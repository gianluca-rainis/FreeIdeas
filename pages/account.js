import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'
import { useThemeImages } from '../hooks/useThemeImages'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    let { id } = context.query;
    let accountData = null;
    let pageTitle = 'Account';
    const cookieHeader = context.req?.headers?.cookie ?? '';

    if (!id) {
        try {
            const res = await fetch(`http://localhost:8000/api/getSessionData.php?data=account`, {
                credentials: "include",
                headers: cookieHeader ? { cookie: cookieHeader } : undefined
            });

            const data = await res.json();

            if (data && data.id) {
                id = data.id;
            }
        } catch (error) {
            console.error('Failed to load session data: '+error);
        }
    }
    
    try {
        const formData = new FormData();
        formData.append("id", id);

        // Send cookies read session in php
        const cookieHeader = context.req?.headers?.cookie ?? '';

        const response = await fetch('http://localhost:8000/api/getAccountData.php', {
            method: "POST",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined,
            body: formData
        });

        const data = await response.json();
        
        if (data && data.success) {
            accountData = data.data;
        }
        else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Failed to fetch account info: '+error);
    }

    return {
        props: {
            accountData: accountData,
            pageTitle: pageTitle
        }
    }
}

// Main
export default function AccountPage({ accountData, pageTitle }) {
    const { randomIdeaId, showAlert, showPrompt, showConfirm } = useAppContext();
    const router = useRouter();
    const { getImagePath } = useThemeImages();
    const [sessionData, setSessionData] = useState(null);
    const [savedList, setSavedList] = useState(accountData?.saved || []);
    const [publishedList, setPublishedList] = useState(accountData?.published || []);
    const [selectedTab, setSelectedTab] = useState('saved');
    const [isFollowed, setIsFollowed] = useState(accountData?.followed || false);
    const [isOwner, setIsOwner] = useState(false);
    const [editing, setEditing] = useState(false);

    const [formValues, setFormValues] = useState({
        username: accountData?.username || '',
        name: accountData?.name || '',
        surname: accountData?.surname || '',
        description: accountData?.description || '',
        public: accountData?.public ?? 1,
        imageFile: null
    });

    const [busy, setBusy] = useState({ follow: false, save: false, danger: false });

    // Load session data
    useEffect(() => {
        async function loadSessionData() {
            try {
                const res = await fetch(`/api/getSessionData.php?data=account`, {
                    credentials: "include"
                });

                const data = await res.json();

                setSessionData(data && data.id?data:null);
            } catch (error) {
                console.error('Failed to load session data: '+error);
            }
        }

        loadSessionData();
    }, []);

    useEffect(() => {
        setIsOwner(accountData?.id && sessionData?.id && accountData.id === sessionData.id);
    }, [accountData, sessionData]);

    useEffect(() => {
        if (accountData) {
            setSavedList(accountData.saved || []);
            setPublishedList(accountData.published || []);
            setIsFollowed(accountData.followed || false);

            setFormValues((prev) => ({
                ...prev,
                username: accountData.username || '',
                name: accountData.name || '',
                surname: accountData.surname || '',
                description: accountData.description || '',
                public: accountData.public ?? 1
            }));
        }
    }, [accountData]);

    if (!accountData) {
        useEffect(() => {
            router.push("/");
        }, []);

        return (
            <>
                <Head pageTitle={pageTitle} />
            </>
        );
    }

    function handleSelectTab(tab) {
        setSelectedTab(tab);
    }

    function renderIdeas(items) {
        if (!items || items.length === 0) {
            return (
                <li className="ideaBox">
                    <a className="ideaLink">
                        <img src="/images/FreeIdeas.svg" alt="Idea Image" className="ideaImageSrc" />
                        <p className="ideaTitleSrc">This user hasn't {selectedTab} any idea yet.</p>
                    </a>
                </li>
            );
        }

        return items.map((item) => (
            <li className="ideaBox" key={`${selectedTab}-${item.id}`}>
                <a href={`/idea/${item.id}`} className="ideaLink">
                    <img src={item.image} alt="Idea Image" className="ideaImageSrc" />
                    <p className="ideaTitleSrc">{item.title}</p>
                    <p className="ideaAuthorSrc">{item.username}</p>
                </a>
            </li>
        ));
    }

    async function handleFollow() {
        if (!sessionData) {
            showAlert('You must login before you can follow an account!');
            return;
        }

        setBusy((prev) => ({ ...prev, follow: true }));

        try {
            const formData = new FormData();
            formData.append('followedaccountid', accountData.id);

            const res = await fetch(`/api/followAccountIdea.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (!data.success) {
                console.error(data.error);
            }
            else {
                setIsFollowed(data.isNowFollowed);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, follow: false }));
        }
    }

    async function handleReport() {
        if (!sessionData) {
            showAlert('You must login before you can report an account!');
            return;
        }

        if (!showConfirm('Are you sure you want to report this account? This action cannot be undone.')) {
            return;
        }

        const feedback = showPrompt('Please tell us why you think this account is inappropriate.');

        if (!feedback) {
            return;
        }

        if (feedback.trim() === '') {
            showAlert('The feedback cannot be empty.');
            return;
        }

        setBusy((prev) => ({ ...prev, danger: true }));

        try {
            const formData = new FormData();
            formData.append('ideaid', '');
            formData.append('feedback', feedback);
            formData.append('accountid', accountData.id);

            const res = await fetch(`/api/reportIdeaAccount.php`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error);
            }
            else {
                showAlert('The account was successfully reported.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, danger: false }));
        }
    }

    function startEdit() {
        setFormValues({
            username: accountData.username || '',
            name: accountData.name || '',
            surname: accountData.surname || '',
            description: accountData.description || '',
            public: accountData.public ?? 1,
            imageFile: null
        });

        setEditing(true);
    }

    function cancelEdit() {
        setEditing(false);
        setFormValues((prev) => ({ ...prev, imageFile: null }));
    }

    async function saveAccount() {
        setBusy((prev) => ({ ...prev, save: true }));

        try {
            const data = new FormData();
            data.append('username', formValues.username);
            data.append('name', formValues.name);
            data.append('surname', formValues.surname);
            data.append('description', formValues.description || '');
            data.append('public', formValues.public);

            if (formValues.imageFile) {
                data.append('image', formValues.imageFile);
            }

            const res = await fetch(`/api/modifyAccountInfo.php`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            const resp = await res.json();

            if (resp?.success) {
                router.reload();
            }
            else {
                console.error(resp?.error);
                showAlert('Unable to save account changes.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, save: false }));
        }
    }

    async function togglePublicPrivate() {
        setBusy((prev) => ({ ...prev, danger: true }));

        try {
            const nextPublic = formValues.public === 1 ? 0 : 1;

            const data = new FormData();
            data.append('username', formValues.username);
            data.append('name', formValues.name);
            data.append('surname', formValues.surname);
            data.append('description', formValues.description || '');
            data.append('public', nextPublic);

            const res = await fetch(`/api/modifyAccountInfo.php`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            const resp = await res.json();

            if (resp?.success) {
                setFormValues((prev) => ({ ...prev, public: nextPublic }));
                showAlert(`Your account is now ${nextPublic === 1 ? 'public' : 'private'}.`);
            }
            else {
                console.error(resp?.error);
                showAlert('Unable to change account visibility.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, danger: false }));
        }
    }

    async function changePassword() {
        if (!sessionData?.email) {
            showAlert('Missing account email.');
            return;
        }

        setBusy((prev) => ({ ...prev, danger: true }));

        try {
            const data = new FormData();
            data.append('email', sessionData.email);

            const res = await fetch(`/api/changePassword.php`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            const resp = await res.json();

            if (resp?.success) {
                showAlert('Check your inbox for the password reset email.');
            }
            else {
                console.error(resp?.error);
                showAlert('Unable to request password change.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, danger: false }));
        }
    }

    async function deleteAccount() {
        if (!sessionData?.id) {
            showAlert('No account id available.');
            return;
        }

        if (!showConfirm('Are you sure that you want to delete your account? This operation cannot be undone.')) {
            return;
        }

        setBusy((prev) => ({ ...prev, danger: true }));

        try {
            const data = new FormData();
            data.append('id', sessionData.id);

            const res = await fetch(`/api/deleteAccount.php`, {
                method: 'POST',
                credentials: 'include',
                body: data
            });

            const resp = await res.json();

            if (resp?.success) {
                router.push('/');
            }
            else {
                console.error(resp?.error);
                showAlert('Unable to delete account.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setBusy((prev) => ({ ...prev, danger: false }));
        }
    }

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="accountMain">
                <aside id="accountAsideInfo">
                    {
                        isOwner && !editing ?
                        <img id="modifyAccountInfo" alt="Modify account" src={getImagePath('modify')} onClick={startEdit} />
                        :null
                    }
                    {editing ? (
                        <>
                            <img id="saveAccountInfo" alt="Save changes" src={getImagePath('save')} onClick={saveAccount} />
                            <img id="cancelAccountInfo" alt="Delete changes" src={getImagePath('delete')} onClick={cancelEdit} />

                            <div id="newDataSetAccount">
                                <label>Username</label>
                                <input type="text" id="newuserNameAccount" maxLength="255" required value={formValues.username} onChange={(e) => setFormValues({ ...formValues, username: e.target.value })} />
                                <label>Image</label>
                                <input type="file" id="newuserImageAccount" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" onChange={(e) => setFormValues({ ...formValues, imageFile: e.target.files?.[0] || null })} />
                                <label>Name</label>
                                <input type="text" id="newuserAccountName" maxLength="255" required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} />
                                <label>Surname</label>
                                <input type="text" id="newuserSurnameAccount" maxLength="255" required value={formValues.surname} onChange={(e) => setFormValues({ ...formValues, surname: e.target.value })} />
                                <label>Description</label>
                                <textarea rows="8" cols="25" id="newdescriptionAccount" maxLength="1000" value={formValues.description} onChange={(e) => setFormValues({ ...formValues, description: e.target.value })} />
                            </div>
                            <div id="dangerAreaAccount">
                                <label>Danger Area</label>
                                <input type="button" value={`Make your account ${formValues.public === 0 ? 'Public' : 'Private'}`} onClick={togglePublicPrivate} disabled={busy.danger} />
                                <input type="button" value="Change Password" onClick={changePassword} disabled={busy.danger} />
                                <input type="button" value="Delete Account" onClick={deleteAccount} disabled={busy.danger} />
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 id="userNameAccount">{accountData.username}</h1>
                            <img id="userImageAccount" alt="Account image" src={accountData.userimage?accountData.userimage:getImagePath("user")} />
                            <h2 id="userNameSurnameAccount">{accountData.name+" "+accountData.surname}</h2>
                            <h3 id="emailAccount">{accountData.email}</h3>
                            {
                                !isOwner?
                                <div id="followReportAccountDiv">
                                    <input type="button" id="followAccountButton" value={isFollowed ? 'Unfollow Account' : 'Follow Account'} onClick={handleFollow} disabled={busy.follow} />
                                    <input type="button" id="reportAccountButton" value="Report Account" onClick={handleReport} disabled={busy.danger} />
                                </div>
                                :null
                            }
                            <p id="descriptionAccount">{accountData.description}</p>
                        </>
                    )}
                </aside>

                <section id="mainAccountSectionInfo">
                    <div id="navBarForAccountSaved">
                        <ul>
                            <li id="savedAccount" className={selectedTab==='saved'?'activeTab':''} onClick={() => handleSelectTab('saved')}><img src={getImagePath('saved')} alt="Saved" /> Saved</li>
                            <li id="publishedAccount" className={selectedTab==='published'?'activeTab':''} onClick={() => handleSelectTab('published')}><img src={getImagePath('publish')} alt="Published" /> Published</li>
                        </ul>
                    </div>
                    
                    <ul id="mainDivDinamicContent">
                        {selectedTab === 'saved' ? renderIdeas(savedList) : renderIdeas(publishedList)}
                    </ul>
                </section>
            </main>

            <Footer />
        </>
    )
}