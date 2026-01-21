import React, { useEffect, useState } from 'react';
import IdeaEditModal from './IdeaEditModal';

export default function IdeasView({ showAlert, showConfirm }) {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingIdea, setEditingIdea] = useState(null);
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

                const res = await fetch('/api/getIdeaDataForReservedArea', {
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
            } catch (err) {
                if (err.name === 'AbortError') {
                    return
                }

                setError(err.message || 'Request failed');
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

    return (
        <div style={{width: "100%"}}>
            {editingIdea ? (
                <IdeaEditModal 
                    idea={editingIdea}
                    onClose={() => setEditingIdea(null)}
                    onSaved={() => { setEditingIdea(null); setRefreshToken((x) => x + 1); }}
                    showAlert={showAlert}
                    showConfirm={showConfirm}
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

                    {loading && <p>Loading ideas...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <ul>
                        {data.map((idea) => (
                            <li key={idea.id} className="ideaBox reservedAreaLiBoxInfo">
                                <img
                                    src={idea.ideaimage ?? '/images/FreeIdeas.svg'}
                                    alt="Idea Image"
                                    className="ideaImageSrc"
                                />
                                <p className="ideaTitleSrc">{idea.title}</p>
                                <p className="ideaAuthorSrc">ID: {idea.id}</p>
                                <p className="ideaAuthorSrc">Author id: {idea.authorid}</p>
                                <p className="ideaAuthorSrc">{idea.data}</p>
                                <p className="ideaAuthorSrc">{idea.description}</p>
                                <p className="ideaAuthorSrc">{idea.downloadlink}</p>

                                <img src='/images/modify.svg' alt='Edit idea' className='modifyIdeaInfoAdmin' style={{cursor: 'pointer'}} onClick={() => setEditingIdea(idea)} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}