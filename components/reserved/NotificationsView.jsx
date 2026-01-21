import React, { useEffect, useState } from 'react';

export default function NotificationsView({ showAlert, showConfirm }) {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newAccountId, setNewAccountId] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newStatus, setNewStatus] = useState(false);
    const [refreshToken, setRefreshToken] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('search', search);

                const res = await fetch('/api/getNotificationsDataForReservedArea', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    signal: controller.signal
                });

                const json = await res.json();

                if (ignore) {
                    return
                }

                if (!json?.success) {
                    throw new Error(json?.error || 'Request failed');
                }

                setData(Array.isArray(json.data) ? json.data : []);
            } catch (error) {
                if (error.name === 'AbortError') {
                    return
                }

                setError(error.message || 'Request failed');
                setData([]);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [search, refreshToken]);

    async function handleCreate() {
        setCreating(true);
        setNewTitle('');
        setNewAccountId('');
        setNewDate('');
        setNewDescription('');
        setNewStatus(false);
    }

    async function handleCancelCreate() {
        setCreating(false);
    }

    async function handleSaveCreate() {
        try {
            if (!newTitle || !newAccountId || !newDate || !newDescription) {
                await showAlert('You need to insert a value for each box in the form!');
                return;
            }

            const formData = new FormData();
            formData.append('title', newTitle);
            formData.append('accountId', newAccountId);
            formData.append('date', newDate);
            formData.append('description', newDescription);
            formData.append('status', newStatus ? 1 : 0);

            const res = await fetch(`/api/createNewNotificationAdmin`, {
                credentials: 'include',
                method: 'POST',
                body: formData
            });

            const resp = await res.json();

            if (!resp || !resp.success) {
                throw new Error(resp?.error || 'Error creating notification');
            }

            await showAlert('Notification created successfully!');
            setCreating(false);
            setRefreshToken((x) => x + 1);
        } catch (error) {
            console.error(error);
            await showAlert('Error creating notification.');
        }
    }

    async function handleDeleteNotification(id) {
        if (await showConfirm("Are you sure that you want to delete this notification?")) {
            let isDeleted = false;

            try {
                const formData = new FormData();
                formData.append("id", id);

                const res = await fetch(`/api/deleteNotificationAdmin`, {
                    credentials: "include",
                    method: "POST",
                    body: formData
                });

                const data = await res.json();

                if (data) {
                    if (!data["success"]) {
                        throw new Error(data["error"]);
                    }
                    else {
                        isDeleted = true;
                    }
                }
                else {
                    throw new Error("generic_error_in_delete_notification");
                }
            } catch (error) {
                console.error(error);
                await showAlert("Error deleting notification.");
            }

            if (isDeleted) {
                setData((prev) => prev.filter((item) => item.id !== id));
            }
        }
    }

    return (
        <div style={{width: "100%"}}>
            <section id="searchSectionInReservedArea">
                <input
                    type="search"
                    placeholder="Search"
                    id="searchReservedArea"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <img
                    src="/images/add.svg"
                    alt="Create notification"
                    id="createNotificationReservedArea"
                    onClick={handleCreate}
                    style={{ cursor: 'pointer' }}
                />
            </section>

            {creating && (
                <section className="ideaBox reservedAreaLiBoxInfo" style={{ marginBottom: '20px' }}>
                    <img id="saveNotificationInfoAdmin" alt="Save changes" src="/images/save.svg" style={{ cursor: 'pointer' }} onClick={handleSaveCreate} />
                    <img id="cancelNotificaitonInfoAdmin" alt="Delete changes" src="/images/delete.svg" style={{ cursor: 'pointer' }} onClick={handleCancelCreate} />
                    
                    <div className="ideaTitleSrc newNotificationDivsAdmin">
                        <label htmlFor="newNotificationTitle">Title</label>
                        <input type="text" name="title" placeholder="Title" id="newNotificationTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    </div>
                    <div className="ideaAuthorSrc newNotificationDivsAdmin">
                        <label htmlFor="newNotificationAccountId">Account ID</label>
                        <input type="number" name="accountId" placeholder="Account ID" id="newNotificationAccountId" value={newAccountId} onChange={(e) => setNewAccountId(e.target.value)} />
                    </div>
                    <div className="ideaAuthorSrc newNotificationDivsAdmin">
                        <label htmlFor="newNotificationDate">Date</label>
                        <input type="date" name="date" placeholder="Date" id="newNotificationDate" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>
                    <div className="ideaAuthorSrc newNotificationDivsAdmin">
                        <label htmlFor="newNotificationDescription">Description</label>
                        <input type="text" name="description" placeholder="Description" id="newNotificationDescription" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                    </div>
                    <div className="ideaAuthorSrc newNotificationDivsAdmin" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="newNotificationStatus">Status</label>
                        <input type="checkbox" name="status" id="newNotificationStatus" checked={newStatus} onChange={(e) => setNewStatus(e.target.checked)} />
                        <p id="statusResult">{newStatus ? 'Read' : 'Not read'}</p>
                    </div>
                </section>
            )}

            {loading && <p>Loading notifications...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {data.map((notif) => (
                    <li key={notif.id} className="ideaBox reservedAreaLiBoxInfo">
                        <p className="ideaTitleSrc">{notif.title}</p>
                        <p className="ideaAuthorSrc">ID: {notif.id}</p>
                        <p className="ideaAuthorSrc">Account id: {notif.accountid}</p>
                        <p className="ideaAuthorSrc">{notif.data}</p>
                        <p className="ideaAuthorSrc">{notif.description}</p>
                        <p className="ideaAuthorSrc">Status: {notif.status ? 'Read' : 'Not read'}</p>

                        <img src='/images/delete.svg' alt='Delete notification' className='deleteNotificationAdmin' onClick={() => handleDeleteNotification(notif.id)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}