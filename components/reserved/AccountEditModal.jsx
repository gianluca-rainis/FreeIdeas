import React, { useEffect, useState } from 'react';

export default function AccountEditModal({ accountId, onClose, onSaved, showAlert, showConfirm, showPrompt }) {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        surname: '',
        email: '',
        description: '',
        userimage: null
    });

    useEffect(() => {
        async function loadAccount() {
            setLoading(true);
            setError(null);

            try {
                const fd = new FormData();
                fd.append('id', accountId);

                const res = await fetch('/api/getAccountData.php', {
                    credentials: 'include',
                    method: 'POST',
                    body: fd
                });

                const data = await res.json();

                if (!data?.success) {
                    throw new Error(data?.error || 'Failed to load account');
                }

                setAccountData(data.data);
                setFormData({
                    username: data.data.username || '',
                    name: data.data.name || '',
                    surname: data.data.surname || '',
                    email: data.data.email || '',
                    description: data.data.description || '',
                    userimage: null
                });
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadAccount();
    }, [accountId]);

    async function handleSave() {
        try {
            const fd = new FormData();

            fd.append('id', accountId);
            fd.append('username', formData.username);
            fd.append('name', formData.name);
            fd.append('surname', formData.surname);
            fd.append('email', formData.email);
            fd.append('description', formData.description);
            fd.append('public', formData.public);

            if (formData.userimage) {
                fd.append('userimage', formData.userimage);
            }

            const res = await fetch('/api/modifyAccountInfoAdmin.php', {
                credentials: 'include',
                method: 'POST',
                body: fd
            });

            const data = await res.json();

            if (!data?.success) {
                throw new Error(data?.error || 'Failed to save');
            }

            await showAlert('Account updated successfully!');

            onSaved();
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    async function handleTogglePublic() {
        if (!await showConfirm(`Make this account ${accountData.public === 0 ? 'Public' : 'Private'}?`)) {
            return
        }

        try {
            const fd = new FormData();
            fd.append('id', accountId);
            fd.append('username', formData.username);
            fd.append('name', formData.name);
            fd.append('surname', formData.surname);
            fd.append('email', formData.email);
            fd.append('description', formData.description);
            fd.append('public', formData.public==0?1:0);

            const res = await fetch('/api/modifyAccountInfoAdmin.php', {
                credentials: 'include',
                method: 'POST',
                body: fd
            });

            const data = await res.json();

            if (!data?.success) {
                throw new Error(data?.error || 'Failed to toggle');
            }

            setAccountData((prev) => ({
                ...prev,
                public: prev.public === 0 ? 1 : 0
            }));

            await showAlert('Account status updated!');
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    async function handleChangePassword() {
        const newPassword = await showPrompt('Enter new password:');

        if (!newPassword) {
            return
        }

        try {
            const fd = new FormData();
            fd.append('id', accountId);
            fd.append('newPassword', newPassword);

            const res = await fetch('/api/changePassword.php', {
                credentials: 'include',
                method: 'POST',
                body: fd
            });

            const data = await res.json();

            if (!data?.success) {
                throw new Error(data?.error || 'Failed to change password');
            }

            await showAlert('Password changed successfully!');
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    async function handleDeleteAccount() {
        if (!await showConfirm('Are you absolutely sure? This cannot be undone!')) {
            return
        }

        try {
            const fd = new FormData();
            fd.append('id', accountId);

            const res = await fetch('/api/deleteAccountAdmin.php', {
                credentials: 'include',
                method: 'POST',
                body: fd
            });

            const data = await res.json();

            if (!data?.success) {
                throw new Error(data?.error || 'Failed to delete');
            }

            await showAlert('Account deleted successfully!');

            onSaved();
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    if (loading) {
        return <p>Loading account...</p>
    }

    if (error) {
        return <p style={{ color: 'red' }}>Error: {error}</p>
    }

    if (!accountData) {
        return <p>No account data</p>
    }

    return (
        <section className="editDataSectionAdmin">
            <img
                src={accountData.userimage || '/images/FreeIdeas.svg'}
                alt="Account"
                className="ideaImageSrc"
                style={{ maxWidth: '150px' }}
            />
            <p className="ideaAuthorSrc">ID: {accountData.id}</p>
            
            <img id="saveAccountInfoAdmin" alt="Save changes" src="/images/save.svg" onClick={handleSave} />
            <img id="cancelAccountInfoAdmin" alt="Delete changes" src="/images/delete.svg" onClick={onClose} />

            <div id="newDataSetAccount">
                <label>Image</label>
                <input type="file" id="newuserImageAccountAdmin" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" onChange={(e) => setFormData({ ...formData, userimage: e.target.files?.[0] })} />
                
                <label>Username</label>
                <input type="text" id="newuserNameAccountAdmin" maxLength="255" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                
                <label>Name</label>
                <input type="text" id="newuserAccountNameAdmin" maxLength="255" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                
                <label>Surname</label>
                <input type="text" id="newuserSurnameAccountAdmin" maxLength="255" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} required />
                
                <label>Email</label>
                <input type="text" id="newemailAccountAdmin" maxLength="255" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                
                <label>Description</label>
                <textarea type="text" rows="8" cols="25" id="newdescriptionAccountAdmin" maxLength="1000" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
            <div id="dangerAreaAccountAdmin">
                <label>Danger Area</label>
                <input type="button" onClick={handleTogglePublic} value={"Make the account "+accountData.public===0?'Public':'Private'} data-value="" id="dangerAreaAccountPublicPrivateAccountAdmin" />
                <input type="button" onClick={handleChangePassword} value="Change Password" id="dangerAreaAccountChangePasswordAdmin" />
                <input type="button" onClick={handleDeleteAccount} value="Delete Account" id="dangerAreaAccountDeleteAccountAdmin" />
            </div>
        </section>
    );
}