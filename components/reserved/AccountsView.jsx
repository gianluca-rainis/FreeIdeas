import React, { useEffect, useState } from 'react';
import AccountEditModal from './AccountEditModal';

// Simple accounts list with search
export default function AccountsView({ showAlert, showConfirm, showPrompt }) {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('search', search);

                const res = await fetch('/api/getAccountDataForReservedArea.php', {
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
    }, [search])

    return (
        <div style={{width: "100%"}}>
            {editingId ? (
                <AccountEditModal 
                    accountId={editingId} 
                    onClose={() => setEditingId(null)}
                    onSaved={() => {
                        setEditingId(null)
                        setSearch('')
                    }}
                    showAlert={showAlert}
                    showConfirm={showConfirm}
                    showPrompt={showPrompt}
                />
            ) : (
                <>
                    <section id="searchSectionInReservedArea">
                        <input
                            type="search"
                            placeholder="Search"
                            id="searchReservedArea"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </section>

                    {loading && <p>Loading accounts...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <ul>
                        {data.map((account) => (
                            <li key={account.id} className="ideaBox reservedAreaLiBoxInfo">
                                <img
                                    src={account.userimage ?? '/images/FreeIdeas.svg'}
                                    alt="Account Image"
                                    className="ideaImageSrc"
                                />
                                <p className="ideaTitleSrc">{account.username}</p>
                                <p className="ideaAuthorSrc">ID: {account.id}</p>
                                <p className="ideaAuthorSrc">Public: {account.public === 1 ? 'Yes' : 'No'}</p>
                                <p className="ideaAuthorSrc">{account.name} {account.surname}</p>
                                <p className="ideaAuthorSrc">{account.email}</p>
                                <p className="ideaAuthorSrc">{account.description}</p>

                                <img src='/images/modify.svg' alt='Edit account' className='modifyAccountInfoAdmin' onClick={() => setEditingId(account.id)} style={{cursor: 'pointer'}} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}