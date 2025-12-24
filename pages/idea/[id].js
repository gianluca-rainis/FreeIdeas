import React, { useEffect, useState } from 'react'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Head from '../../components/Head'
import { useAppContext } from '../../contexts/CommonContext'
import { useThemeImages } from '../../hooks/useThemeImages'
import { useModals } from '../../hooks/useModals'
import { AlertModal, ConfirmModal, PromptModal } from '../../components/Modal'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    const { id } = context.query;
    let ideaData = null;
    let pageTitle = 'Idea';
    
    try {
        const formData = new FormData();
        formData.append("id", id);

        // Send cookies read session in php
        const cookieHeader = context.req?.headers?.cookie ?? '';

        const response = await fetch('http://localhost:8000/api/data.php', {
            method: "POST",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined,
            body: formData
        });

        const data = await response.json();
        
        if (data && data.success !== false) {
            ideaData = data;
            pageTitle = ideaData['idea'][0]['title'];
        }
        else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Failed to fetch ideas: '+error);
    }

    return {
        props: {
            ideaData: ideaData,
            pageTitle: pageTitle
        }
    }
}

// Internal functions
function PrintAdditionalInfo({ ideaData }) {
    if (ideaData && ideaData['info'] && ideaData['info'].length != 0) {
        return (
            <ul id='imagesInfo'>
                {
                    ideaData['info'].map((ideaInfo, index) => (
                        <li key={index} className='imageInfoLi'>
                            <img src={ideaInfo['updtimage']} alt='Image of additional info' className='imageInfo' />
                            <div>
                                <h3 className='titleImageInfo'>{ideaInfo['title']}</h3>
                            
                                <p className='imageInfoDescription'>
                                    {ideaInfo['description']}
                                </p>
                            </div>
                        </li>
                    ))
                }
            </ul>
        );
    }

    return null;
}

function PrintDownloadLink({ ideaData }) {
    if (ideaData && ideaData['idea'][0]['downloadlink']) {
        const link = ideaData['idea'][0]['downloadlink'];

        return (
            <section id='downloadSection'>
                <h3 id='download'>External Link</h3>
                <a id='buttonlink' href={link}><button id='downloadButton'>{link}</button></a>
            </section>
        );
    }
    
    return null;
}

function PrintDevLogs({ ideaData }) {
    if (ideaData && ideaData['log'] && ideaData['log'].length != 0) {
        return (
            <section id='devLogsSection'>
                <h3 id='logsName'>Author's Log</h3>
                <ul id='logsList'>
                    {
                        ideaData['log'].map((ideaLog, index) => (
                            <li key={index} className='log'>
                                <div className='logTitleAndData'>
                                    <h4 className='logTitle'>{ideaLog['title']}</h4>
                                    <div className='data'>{ideaLog['data']}</div>
                                </div>
                            
                                <p className='logInfo'>
                                    {ideaLog['description']}
                                </p>
                            </li>
                        ))
                    }
                </ul>
            </section>
        );
    }
    return null;
}

function PrintComments({ ideaData, onDeleteComment, sessionData, themeIsLight, showAlert, ideaId }) {
    const [replyingToCommentId, setReplyingToCommentId] = useState(undefined);
    const [replyText, setReplyText] = useState('');

    const getCurrentDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    async function handleReplyClick(commentId = null) {
        if (!sessionData) {
            await showAlert("You must log in before writing a comment.");
            return;
        }
        
        setReplyingToCommentId(commentId);
        setReplyText('');
    }

    async function handleSaveReply(superCommentId) {
        if (replyText.trim() === '') {
            await showAlert("The comment can't be empty!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('data', getCurrentDate());
            formData.append('description', replyText);
            formData.append('ideaid', ideaId);
            formData.append('superCommentid', superCommentId || '');

            const res = await fetch(`/api/saveNewComment.php`, {
                credentials: "include",
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data['success']) {
                window.location.href = `/idea/${ideaId}`;
            }
            else {
                throw new Error(data['error']);
            }
        } catch (error) {
            console.error(error);
            await showAlert("Error saving comment");
        }
    }

    function handleCancelReply() {
        setReplyingToCommentId(undefined);
        setReplyText('');
    }

    if (!ideaData || !ideaData['comment'] || ideaData['comment'].length == 0) {
        return (
            <>
                {(replyingToCommentId === null && sessionData && (
                    <li className='comment'>
                        <div className='userInfo'>
                            <a href={`/account/${sessionData['id']}`} className='writerPage'>
                                <img src={sessionData['userimage'] || `/images/user${themeIsLight?"":"_Pro"}.svg`} alt="Your image" className='writerImg' />
                                <div className='writerUserName'>{sessionData['username']}:</div>
                            </a>
                            <div className='dataWriter'>{getCurrentDate()}</div>
                        </div>
                        <textarea 
                            value={replyText} 
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder='Write your comment...'
                            maxLength='10000'
                            style={{ width: '90%', maxWidth: '90%', minHeight: '80px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <p id='saveComment' onClick={() => handleSaveReply('')}>Save</p>
                            <p id='deleteComment' onClick={handleCancelReply}>Cancel</p>
                        </div>
                    </li>
                )) || (
                    <li className='comment' data-value='rootComment'>
                        <p className='replyComment' onClick={() => handleReplyClick(null)} style={{ cursor: 'pointer' }}>Write the first comment!</p>
                    </li>
                )}
            </>
        );
    }

    function printSubCommentRecursive(superi, indexOfSubComments) {
        let subCommentsToPrint = [];

        for (let i = indexOfSubComments.length - 1; i >= 0; i--) {
            if (ideaData['comment'][indexOfSubComments[i]]['superCommentid'] == ideaData['comment'][superi]['id']) {
                subCommentsToPrint.push(indexOfSubComments[i]);
                indexOfSubComments.splice(i, 1);
            }
        }

        return printComment(superi, subCommentsToPrint, indexOfSubComments);
    }

    function printComment(i, subComments, indexOfSubComments) {
        let authorid = ideaData['comment'][i]['authorid'];
        let accountLink = ideaData['comment'][i]['public'] == 1 ? `./accountVoid.php?account=${authorid}` : "";
        let accountimg = ideaData['comment'][i]['userimage'] != null ? ideaData['comment'][i]['userimage'] : `/images/user${themeIsLight?"":"_Pro"}.svg`;
        let accountUsername = ideaData['comment'][i]['username'] == null ? 'Deleted' : ideaData['comment'][i]['username'];
        let date = ideaData['comment'][i]['data'];
        let description = ideaData['comment'][i]['description'];
        let id = ideaData['comment'][i]['id'];

        const canDelete = sessionData && (sessionData.id == authorid || sessionData.is_admin);

        return (
            <React.Fragment key={id}>
                <li className='comment'>
                    <div className='userInfo'>
                        <a href={accountLink} className='writerPage'>
                            <img src={accountimg} alt='Comment Author Account Image' className='writerImg' />
                            <div className='writerUserName'>{accountUsername}:</div>
                        </a>

                        <div className='dataWriter'>{date}</div>
                    </div>
                    <p className='commentText'>{description}</p>
                    <p className='replyComment' onClick={() => handleReplyClick(id)} style={{ cursor: 'pointer' }}>Reply</p>

                    {canDelete && (
                        <p className='deleteComment' onClick={() => onDeleteComment(id)} style={{ cursor: 'pointer', color: '#ff6b6b' }}>
                            Delete
                        </p>
                    )}

                    <ul className='underComments' data-id={id}>
                        {
                            subComments.map(subCommentIndex => printSubCommentRecursive(subCommentIndex, indexOfSubComments))
                        }

                        {replyingToCommentId === id && sessionData && (
                            <li className='comment' style={{ marginLeft: '20px' }}>
                                <div className='userInfo'>
                                    <a href={`/account/${sessionData['id']}`} className='writerPage'>
                                        <img src={sessionData['userimage'] || `/images/user${themeIsLight?"":"_Pro"}.svg`} alt="Your user image" className='writerImg' />
                                        <div className='writerUserName'>{sessionData['username']}:</div>
                                    </a>
                                    <div className='dataWriter'>{getCurrentDate()}</div>
                                </div>
                                <textarea 
                                    value={replyText} 
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder='Write your reply...'
                                    maxLength='10000'
                                    style={{ width: '90%', maxWidth: '90%', minHeight: '80px' }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <p id='saveComment' onClick={() => handleSaveReply(id)}>Save</p>
                                    <p id='deleteComment' onClick={handleCancelReply}>Cancel</p>
                                </div>
                            </li>
                        )}
                    </ul>
                </li>
            </React.Fragment>
        );
    }

    let indexOfRootComments = [];
    let indexOfSubComments = [];

    for (let i = 0; i < ideaData['comment'].length; i++) {
        if (ideaData['comment'][i]['superCommentid'] === null) {
            indexOfRootComments.push(i);
        }
        else {
            indexOfSubComments.push(i);
        }
    }

    return (
        <>
            {indexOfRootComments.map(j => printSubCommentRecursive(j, [...indexOfSubComments]))}
            
            {(replyingToCommentId === null && sessionData && (
                <li className='comment'>
                    <div className='userInfo'>
                        <a href={`/account/${sessionData['id']}`} className='writerPage'>
                            <img src={sessionData['userimage'] || `/images/user${themeIsLight?"":"_Pro"}.svg`} alt="Your image" className='writerImg' />
                            <div className='writerUserName'>{sessionData['username']}:</div>
                        </a>
                        <div className='dataWriter'>{getCurrentDate()}</div>
                    </div>
                    <textarea 
                        value={replyText} 
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder='Write your comment...'
                        maxLength='10000'
                        style={{ width: '90%', maxWidth: '90%', minHeight: '80px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <p id='saveComment' onClick={() => handleSaveReply('')}>Save</p>
                        <p id='deleteComment' onClick={handleCancelReply}>Cancel</p>
                    </div>
                </li>
            )) || (
                <li className='comment' data-value='rootComment'>
                    <p className='replyComment' onClick={() => handleReplyClick(null)} style={{ cursor: 'pointer' }}>Write a comment!</p>
                </li>
            )}
        </>
    );
}

function LicenseSection({ ideaData }) {
    const [licenseUrl, setLicenseUrl] = useState(null);

    useEffect(() => {
        async function getLicense() {
            try {
                if (ideaData && ideaData['idea'][0]['license']) {
                    setLicenseUrl(ideaData['idea'][0]['license']);
                }
                else if (ideaData && ideaData['idea'][0]['title']) {
                    const title = ideaData['idea'][0]['title'];
                    const author = ideaData['idea'][0]['accountName'];

                    const formData = new FormData();
                    formData.append("title", title);
                    formData.append("author", author);

                    const response = await fetch("/api/getFreeIdeasLicense.php", {
                        credentials: "include",
                        method: "POST",
                        body: formData
                    });

                    const data = await response.json();

                    if (data && data[0]) {
                        setLicenseUrl(data[0]);
                    }
                    else {
                        console.error('License API error: '+data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        getLicense();
    }, [ideaData?.idea?.[0]?.license, ideaData?.idea?.[0]?.title, ideaData?.idea?.[0]?.accountName]);

    if (!licenseUrl) {
        return null;
    }

    return (
        <section id="licenseSection">
            <h3 id="licenseTitle">License</h3>
            <embed src={licenseUrl} id="licensePdfEmbed" />
        </section>
    );
}

// Main
export default function IdeaPage({ ideaData, pageTitle }) {
    const { randomIdeaId } = useAppContext();
    const { themeIsLight } = useThemeImages();
    const { currentModal, showAlert, showConfirm, showPrompt, closeModal } = useModals();
    
    // State management
    const [sessionData, setSessionData] = useState(null);
    const [savedState, setSavedState] = useState(false);
    const [likedState, setLikedState] = useState(false);
    const [dislikedState, setDislikedState] = useState(false);
    const [followState, setFollowState] = useState(false);
    const [existCurrentAccountIdeaData, setExistCurrentAccountIdeaData] = useState(false);
    const [savesCount, setSavesCount] = useState(ideaData?.idealabels?.[0]?.saves ?? 0);
    const [likesCount, setLikesCount] = useState(ideaData?.idealabels?.[0]?.likes ?? 0);
    const [dislikesCount, setDislikesCount] = useState(ideaData?.idealabels?.[0]?.dislike ?? 0);

    // Load session data
    useEffect(() => {
        const loadSessionData = async () => {
            try {
                const res = await fetch(`/api/getSessionData.php?data=account`, {
                    credentials: "include"
                });

                const data = await res.json();

                setSessionData(data && data.id?data:null);
            } catch (error) {
                console.error('Failed to load session data: '+error);
            }
        };

        loadSessionData();
    }, []);

    // Load account idea data (saved, liked, disliked state)
    useEffect(() => {
        if (!ideaData || !sessionData) {
            return;
        }

        if (ideaData['accountdata'] && ideaData['accountdata'][0]) {
            setSavedState(ideaData['accountdata'][0].saved == 1);
            setLikedState(ideaData['accountdata'][0].liked == 1);
            setDislikedState(ideaData['accountdata'][0].dislike == 1);
            setExistCurrentAccountIdeaData(true);
        }

        if (ideaData['followAccountData'] && ideaData['followAccountData'].length > 0) {
            setFollowState(true);
        }
    }, [ideaData, sessionData]);

    // Toggle saved/liked/disliked
    async function toggleSavedLikedDisliked(type) {
        if (!sessionData) {
            await showAlert("You need to login before vote a project!");
            return;
        }

        const prevSaved = savedState;
        const prevLiked = likedState;
        const prevDisliked = dislikedState;
        const prevSavesCount = savesCount;
        const prevLikesCount = likesCount;
        const prevDislikesCount = dislikesCount;

        let newSaved = savedState;
        let newLiked = likedState;
        let newDisliked = dislikedState;

        if (type === 'save') {
            newSaved = !savedState;

            setSavedState(newSaved);
            setSavesCount(prev => prev + (savedState ? -1 : 1));
        }
        else if (type === 'like') {
            if (likedState) {
                newLiked = false;

                setLikesCount(prev => prev - 1);
            }
            else {
                newLiked = true;
                newDisliked = false;

                setLikesCount(prev => prev + 1);

                if (dislikedState) {
                    setDislikesCount(prev => prev - 1);
                }
            }

            setLikedState(newLiked);
            setDislikedState(newDisliked);
        }
        else if (type === 'dislike') {
            if (dislikedState) {
                newDisliked = false;

                setDislikesCount(prev => prev - 1);
            }
            else {
                newDisliked = true;
                newLiked = false;

                setDislikesCount(prev => prev + 1);

                if (likedState) {
                    setLikesCount(prev => prev - 1);
                }
            }

            setDislikedState(newDisliked);
            setLikedState(newLiked);
        }

        // Send to server
        try {
            const formData = new FormData();
            formData.append("ideaid", ideaData['idea'][0].id);
            formData.append("saved", newSaved?"1":"0");
            formData.append("dislike", newDisliked?"1":"0");
            formData.append("liked", newLiked?"1":"0");
            formData.append("existRowYet", existCurrentAccountIdeaData?"1":"0");

            const res = await fetch(`/api/saveAccountIdeaData.php`, {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data['success']) {
                throw new Error(data['error']);
            }

            setExistCurrentAccountIdeaData(true);
        } catch (error) {
            // If error don't update
            setSavedState(prevSaved);
            setLikedState(prevLiked);
            setDislikedState(prevDisliked);
            setSavesCount(prevSavesCount);
            setLikesCount(prevLikesCount);
            setDislikesCount(prevDislikesCount);
            
            console.error('Error saving idea data: '+error);
        }
    }

    // Report idea
    async function handleReportIdea() {
        if (!sessionData) {
            await showAlert("You must login before you can report an idea!");
            return;
        }

        const confirmed = await showConfirm("Are you sure you want to report this idea? This action cannot be undone. Remember that reporting an idea also harms the idea's creator.");
        
        if (!confirmed) {
            return;
        }

        const feedback = await showPrompt("Please tell us why you think this content is inappropriate.");
        
        if (feedback === null || feedback === "") {
            if (feedback !== null) {
                await showAlert("The feedback cannot be empty.");
            }

            return;
        }

        try {
            const formData = new FormData();
            formData.append("ideaid", ideaData['idea'][0].id);
            formData.append("feedback", feedback);
            formData.append("accountid", null);

            const res = await fetch(`/api/reportIdeaAccount.php`, {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data['success']) {
                await showAlert("The idea was successfully reported.");
            }
            else {
                throw new Error(data['error']);
            }
        } catch (error) {
            console.error('Error reporting idea: '+error);
        }
    }

    // Follow idea
    async function handleFollowIdea() {
        if (!sessionData) {
            await showAlert("You must login before you can follow an idea!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("followedideaid", ideaData['idea'][0].id);

            const res = await fetch(`/api/followAccountIdea.php`, {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data['success']) {
                setFollowState(data["isNowFollowed"]);
            }
            else {
                throw new Error(data['error']);
            }
        } catch (error) {
            console.error('Error following idea: '+error);
        }
    }

    // Delete comment
    async function handleDeleteComment(commentId) {
        const confirmed = await showConfirm("Are you sure you want to delete the comment?");
        
        if (!confirmed) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('id', commentId);

            const res = await fetch(`/api/deleteComment.php`, {
                credentials: "include",
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data["success"]) {
                window.location.reload();
            }
            else {
                throw new Error(data['error']);
            }
        } catch (error) {
            console.error('Error deleting comment: '+error);
        }
    }

    if (!ideaData) {
        return (
            <>
                <Head pageTitle="Idea not found" />
                <Nav randomId={randomIdeaId} />
                <main id="ideaMain">
                    <h1>Idea not found</h1>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="ideaMain">
                <div id="ideaImageAsBackground" style={{ backgroundImage: `url(${ideaData['idea'][0]['ideaimage']})` }}>
                    <h1 id="title">{pageTitle}</h1>
                    <h2 id="author">
                        <a href={ideaData['idea'][0]['accountPublic'] == 1 ? `./account/${ideaData['idea'][0]['accountId']}` : ""} id="mainAuthorAccount">
                            {ideaData['idea'][0]['accountName']}
                        </a>
                    </h2>
                </div>

                <section id="ideaLikeSaveSection">
                    <ul>
                        <li id="savedIdea" onClick={() => toggleSavedLikedDisliked('save')}>
                            <img 
                                src={savedState ? `/images/savedIdea${themeIsLight?"":"_Pro"}.svg` : `/images/saved${themeIsLight?"":"_Pro"}.svg`} 
                                alt="Save idea" 
                                id="savedIdeaImg" 
                                style={{ cursor: 'pointer' }}
                            />
                            <div id="savedNumber">{savesCount}</div>
                        </li>
                        <li id="likedIdea" onClick={() => toggleSavedLikedDisliked('like')}>
                            <img 
                                src={likedState ? `/images/likedIdea${themeIsLight?"":"_Pro"}.svg` : `/images/liked${themeIsLight?"":"_Pro"}.svg`} 
                                alt="Like idea" 
                                id="likedIdeaImg" 
                                style={{ cursor: 'pointer' }}
                            />
                            <div id="likedNumber">{likesCount}</div>
                        </li>
                        <li id="dislikedIdea" onClick={() => toggleSavedLikedDisliked('dislike')}>
                            <img 
                                src={dislikedState ? `/images/dislikedIdea${themeIsLight?"":"_Pro"}.svg` : `/images/disliked${themeIsLight?"":"_Pro"}.svg`} 
                                alt="Dislike idea" 
                                id="dislikedIdeaImg" 
                                style={{ cursor: 'pointer' }}
                            />
                            <div id="dislikedNumber">{dislikesCount}</div>
                        </li>
                    </ul>
                    
                    <input 
                        type="button" 
                        id="followIdeaButton" 
                        value="Follow Idea"
                        onClick={handleFollowIdea}
                        style={{
                            backgroundColor: followState ? `${themeIsLight?"#a9acf5":"#5c4e2e"}` : `${themeIsLight?"#b6ffa4":"#cba95c"}`
                        }}
                    />
                    <input 
                        type="button" 
                        id="reportIdeaButton" 
                        value="Report Idea"
                        onClick={handleReportIdea}
                    />
                    <img 
                        src="/images/modify.svg" 
                        alt="Modify idea" 
                        id="modifyOldIdea"
                        onClick={() => {
                            if (sessionData && sessionData.id == ideaData['idea'][0].accountId) {
                                window.location.href = `/publishAnIdea/${ideaData['idea'][0].id}`;
                            }
                        }}
                        style={{ cursor: 'pointer', display: (sessionData && sessionData.id == ideaData['idea'][0].accountId)?"block":"none" }}
                    />
                </section>

                <p id="description">
                    {ideaData['idea'][0]['description']}
                </p>

                <PrintAdditionalInfo ideaData={ideaData} />

                <PrintDownloadLink ideaData={ideaData} />

                <LicenseSection ideaData={ideaData} />

                <PrintDevLogs ideaData={ideaData} />

                <section id="commentSection">
                    <h3 id="commentsTitle">Comments</h3>
                    <ul id="commentsList">
                        <PrintComments ideaData={ideaData} onDeleteComment={handleDeleteComment} sessionData={sessionData} themeIsLight={themeIsLight} showAlert={showAlert} ideaId={ideaData['idea'][0].id} />
                    </ul>
                </section>
            </main>

            {currentModal?.type === 'alert' && <AlertModal text={currentModal.text} onClose={currentModal.onClose} />}
            {currentModal?.type === 'confirm' && <ConfirmModal text={currentModal.text} onConfirm={currentModal.onConfirm} onCancel={currentModal.onCancel} />}
            {currentModal?.type === 'prompt' && <PromptModal message={currentModal.message} defaultValue={currentModal.defaultValue} onSubmit={currentModal.onSubmit} onCancel={currentModal.onCancel} />}

            <Footer />
        </>
    )
}