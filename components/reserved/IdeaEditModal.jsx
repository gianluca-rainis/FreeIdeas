import React, { useEffect, useState } from 'react';

function decodeHtmlEntities(text) {
    if (!text) {
        return text;
    }

    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

export default function IdeaEditModal({ idea, onClose, onSaved, showAlert, showConfirm }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        downloadlink: '',
        ideaimage: null,
        type: '',
        creativity: '',
        status: '',
        saves: '',
        likes: '',
        dislike: ''
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [useDefaultLicense, setUseDefaultLicense] = useState(false);
    const [licensePdfFile, setLicensePdfFile] = useState(null);
    const [licensePdfUrl, setLicensePdfUrl] = useState(null);
    const [fullIdea, setFullIdea] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState([]);
    const [logs, setLogs] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchIdeaData() {
            try {
                setLoading(true);

                const fd = new FormData();
                fd.append('id', idea.id);

                const res = await fetch('/api/data.php', {
                    method: 'POST',
                    body: fd,
                    credentials: 'include'
                });

                const json = await res.json();

                if (!json?.idea || !Array.isArray(json.idea) || json.idea.length === 0) {
                    throw new Error(json?.error || 'Failed to load idea data');
                }

                const ideaData = json.idea[0];
                const labelsData = json.idealabels?.[0] || {};
                
                setFullIdea({ ...ideaData, idealabels: [labelsData] });
                
                setFormData({
                    title: decodeHtmlEntities(ideaData?.title) || '',
                    description: decodeHtmlEntities(ideaData?.description) || '',
                    downloadlink: decodeHtmlEntities(ideaData?.downloadlink) || '',
                    ideaimage: null,
                    type: decodeHtmlEntities(labelsData?.type) || '',
                    creativity: decodeHtmlEntities(labelsData?.creativity) || '',
                    status: decodeHtmlEntities(labelsData?.status) || '',
                    saves: labelsData?.saves ?? '',
                    likes: labelsData?.likes ?? '',
                    dislike: labelsData?.dislike ?? ''
                });

                setUseDefaultLicense(!ideaData?.license);
                setLicensePdfUrl(ideaData?.license || null);
                setLicensePdfFile(null);
                
                setAdditionalInfo(json.info || []);
                setLogs(json.log || []);
                setComments(json.comment || []);
            } catch (error) {
                console.error(error);
                await showAlert(`Error loading idea: ${error.message}`);
                onClose();
            } finally {
                setLoading(false);
            }
        }

        if (idea?.id) {
            fetchIdeaData();
        }
    }, [idea?.id]);

    useEffect(() => {
        async function fetchDefaultLicense() {
            try {
                if (useDefaultLicense) {
                    const fd = new FormData();
                    fd.append('title', formData.title);
                    fd.append('author', idea?.accountName || '');

                    const res = await fetch('/api/getFreeIdeasLicense.php', {
                        method: 'POST',
                        body: fd,
                        credentials: 'include'
                    });

                    const data = await res.json();

                    if (data && data['success'] === false) {
                        throw new Error(data['error']);
                    }

                    setLicensePdfUrl(data?.[0] || null);
                }
                else {
                    setLicensePdfUrl(idea?.license || null);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchDefaultLicense();
    }, [useDefaultLicense]);

    async function handleSave() {
        try {
            setSaving(true);

            const fd = new FormData();
            fd.append('id', idea.id);
            fd.append('title', formData.title);
            fd.append('authorid', fullIdea?.accountId || '');
            fd.append('description', formData.description);
            fd.append('link', formData.downloadlink);
            fd.append('type', formData.type);
            fd.append('creativity', formData.creativity);
            fd.append('status', formData.status);
            fd.append('saves', formData.saves);
            fd.append('likes', formData.likes);
            fd.append('dislikes', formData.dislike);

            if (formData.ideaimage) {
                fd.append('mainImageFile', formData.ideaimage);
            }
            else {
                fd.append('mainImageData', fullIdea?.ideaimage || '');
            }

            if (licensePdfFile) {
                fd.append('license', licensePdfFile);
            }
            else {
                fd.append('licenseData', licensePdfUrl || 'null');
            }

            fd.append('useDefaultLicense', useDefaultLicense ? 1 : 0);

            if (additionalInfo.length > 0) {
                const titles = [];
                const descriptions = [];
                const types = [];

                additionalInfo.forEach(info => {
                    if (info.imageFile) {
                        types.push('file');
                    }
                    else {
                        types.push('data');
                    }

                    titles.push(info.title);
                    descriptions.push(info.description);
                });

                fd.append('additionalInfo', JSON.stringify({
                    titles,
                    descriptions,
                    types
                }));

                additionalInfo.forEach(info => {
                    if (info.imageFile) {
                        fd.append('additionalInfoImagesFile[]', info.imageFile);
                    }
                });

                additionalInfo.forEach(info => {
                    if (!info.imageFile) {
                        fd.append('additionalInfoImagesData[]', info.updtimage || '');
                    }
                });
            }

            const titles = [];
            const descriptions = [];
            const dates = [];

            logs.forEach(log => {
                titles.push(log.title);
                descriptions.push(log.description);
                dates.push(log.data);
            });

            fd.append('logs', JSON.stringify({
                titles: titles,
                descriptions: descriptions,
                date: dates
            }));

            const res = await fetch('/api/modifyIdeaInfoAdmin.php', {
                method: 'POST',
                body: fd,
                credentials: 'include'
            });

            const json = await res.json();

            if (!json?.success) {
                throw new Error(json?.error || 'Failed to save idea');
            }

            await showAlert('Idea updated successfully!');
            onSaved();
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const ok = await showConfirm('Delete this idea? This cannot be undone.');

        if (!ok) {
            return;
        }

        try {
            const fd = new FormData();
            fd.append('id', idea.id);

            const res = await fetch('/api/deleteIdea.php', {
                method: 'POST',
                body: fd,
                credentials: 'include'
            });

            const json = await res.json();

            if (!json?.success) {
                throw new Error(json?.error || 'Failed to delete idea');
            }

            await showAlert('Idea deleted successfully!');

            onSaved();
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    function handleAddInfo() {
        setAdditionalInfo([...additionalInfo, { title: '', description: '', updtimage: null, imageFile: null }]);
    }

    function handleRemoveInfo(index) {
        setAdditionalInfo(additionalInfo.filter((_, i) => i !== index));
    }

    function handleUpdateInfo(index, field, value) {
        const updated = [...additionalInfo];
        updated[index] = { ...updated[index], [field]: value };
        setAdditionalInfo(updated);
    }

    function handleAddLog() {
        const today = new Date().toISOString().split('T')[0];

        setLogs([...logs, { title: '', data: today, description: '' }]);
    }

    function handleRemoveLog(index) {
        setLogs(logs.filter((_, i) => i !== index));
    }

    function handleUpdateLog(index, field, value) {
        const updated = [...logs];
        updated[index] = { ...updated[index], [field]: value };
        setLogs(updated);
    }

    async function handleDeleteComment(commentId) {
        try {
            const fd = new FormData();
            fd.append('id', commentId);

            const res = await fetch('/api/deleteComment.php', {
                method: 'POST',
                body: fd,
                credentials: 'include'
            });

            const json = await res.json();

            if (!json?.success) {
                throw new Error(json?.error || 'Failed to delete comment');
            }

            setComments(prev => prev.map(c => c.id === commentId ? { ...c, description: 'This comment was deleted by the administrator.', deleted: true } : c));
        } catch (error) {
            console.error(error);
            await showAlert(`Error: ${error.message}`);
        }
    }

    function renderComments(commentsList, parentId = null) {
        const filtered = commentsList.filter(c => c.superCommentid === parentId);
        
        return filtered.map(comment => {
            const renderedText = comment.deleted ? 'This comment was deleted by the administrator.' : decodeHtmlEntities(comment.description);

            return (
                <li key={comment.id} className="comment">
                    <div className="userInfo">
                        <div className="writerPage">
                            <img src={comment.userimage || '/images/user.svg'} alt="Comment Author" className="writerImg" />
                            <div className="writerUserName">{comment.username || 'Deleted'}:</div>
                        </div>
                        <div className="dataWriter">{comment.data}</div>
                    </div>
                    <p className="commentText">{renderedText}</p>
                    <p className="deleteComment" style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteComment(comment.id)}>Delete</p>
                    <ul className="underComments">
                        {renderComments(commentsList, comment.id)}
                    </ul>
                </li>
            )
        });
    }

    return (
        <section className="editDataSectionAdmin">
            {loading && <p>Loading idea data...</p>}
            {!loading && (
                <>
                    <img src={fullIdea?.ideaimage || '/images/FreeIdeas.svg'} alt="Idea Image" className="ideaImageSrc" />
                    <p className="ideaAuthorSrc">ID: {fullIdea?.id}</p>
                    {fullIdea?.accountName && <p className="ideaAuthorSrc">Author Name: {fullIdea?.accountName}</p>}

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
                        <img id="saveIdeaInfoAdmin" alt="Save changes" src="/images/save.svg" style={{ cursor: 'pointer' }} onClick={handleSave} />
                        <img id="cancelIdeaInfoAdmin" alt="Cancel changes" src="/images/delete.svg" style={{ cursor: 'pointer' }} onClick={onClose} />
                    </div>

                    <div id="newDataSetAccount">
                        <label>Image</label>
                        <input type="file" id="newideaImageAdmin" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" onChange={(e) => setFormData({ ...formData, ideaimage: e.target.files?.[0] })} />

                        <label>Title</label>
                        <input type="text" id="newideaTitleAdmin" maxLength={255} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />

                        <label>Author ID</label>
                        <input type="number" id="newideaAuthorIdAdmin" value={fullIdea?.accountId ?? ''} readOnly />

                        <label>Type of project</label>
                        <input type="text" id="newideaTypeAdmin" maxLength={500} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />

                        <label>Creativity Type</label>
                        <input type="text" id="newideaCreativityAdmin" maxLength={500} value={formData.creativity} onChange={(e) => setFormData({ ...formData, creativity: e.target.value })} />

                        <label>Project Status</label>
                        <input type="text" id="newideaStatusAdmin" maxLength={500} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />

                        <label>Saves</label>
                        <input type="number" id="newideaSavesAdmin" value={formData.saves} onChange={(e) => setFormData({ ...formData, saves: e.target.value })} />

                        <label>Likes</label>
                        <input type="number" id="newideaLikesAdmin" value={formData.likes} onChange={(e) => setFormData({ ...formData, likes: e.target.value })} />

                        <label>Dislikes</label>
                        <input type="number" id="newideaDislikesAdmin" value={formData.dislike} onChange={(e) => setFormData({ ...formData, dislike: e.target.value })} />

                        <label>Description</label>
                        <textarea rows={8} cols={25} id="newideaDescriptionAdmin" maxLength={10000} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                        <label>External link</label>
                        <input type="url" id="newideaLinkAdmin" maxLength={5000} value={formData.downloadlink} onChange={(e) => setFormData({ ...formData, downloadlink: e.target.value })} />

                        <label>License</label>
                        <div>
                            {licensePdfUrl ? (
                                <embed src={licensePdfUrl} id="licensePdfEmbed" style={{ width: '100%', height: 300 }} />
                            ) : (
                                <p>No license loaded</p>
                            )}
                            <input type="file" id="newIdealicensePdfFileAdmin" accept=".pdf" onChange={(e) => setLicensePdfFile(e.target.files?.[0] || null)} />
                            <div style={{ padding: 10 }}>
                                <label htmlFor="licenseDefaultLicense">Use the FreeIdeas license: </label>
                                <input type="checkbox" id="licenseDefaultLicense" name="licenseDefaultLicense" checked={useDefaultLicense} onChange={(e) => setUseDefaultLicense(e.target.checked)} />
                            </div>
                        </div>
                    </div>

                    <div id="newAdditionalInfoIdea">
                        <h3>Additional Information</h3>
                        <img src="/images/add.svg" alt="Add additional info" id="addAdditionalInfoAdmin" style={{ cursor: 'pointer' }} onClick={handleAddInfo} />
                        <ul id="imagesInfo">
                            {additionalInfo.map((info, index) => (
                                <li key={index} className="imageInfoLi">
                                    <div></div>
                                    <img src="/images/delete.svg" alt="Delete additional info" className="deleteAdditionalInfoAdmin" style={{ cursor: 'pointer' }} onClick={() => handleRemoveInfo(index)} />
                                    
                                    <div>
                                        <img className="preview" alt="Additional info image" src={info.imageFile ? URL.createObjectURL(info.imageFile) : (info.updtimage || '/images/FreeIdeas.svg')} style={{ maxWidth: 200 }} />
                                        <input type="file" className="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" onChange={(e) => handleUpdateInfo(index, 'imageFile', e.target.files?.[0])} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <textarea className="titleImageInfo" placeholder="Title" maxLength={255} value={decodeHtmlEntities(info.title)} onChange={(e) => handleUpdateInfo(index, 'title', e.target.value)} required />
                                        <textarea className="imageInfoDescription" placeholder="Info" maxLength={10000} value={decodeHtmlEntities(info.description)} onChange={(e) => handleUpdateInfo(index, 'description', e.target.value)} required />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div id="newDevLogsSection">
                        <h3>Author's Log</h3>
                        <img src="/images/add.svg" alt="Add log" id="addLogAdmin" style={{ cursor: 'pointer' }} onClick={handleAddLog} />
                        <ul id="logsList">
                            {logs.map((log, index) => (
                                <li key={index} className="log">
                                    <img src="/images/delete.svg" alt="Delete Log" className="deleteLogAdmin" style={{ cursor: 'pointer' }} onClick={() => handleRemoveLog(index)} />
                                    <div className="logTitleAndData">
                                        <textarea className="logTitleAdmin" placeholder="Title" maxLength={255} value={decodeHtmlEntities(log.title)} onChange={(e) => handleUpdateLog(index, 'title', e.target.value)} required />
                                        <input type="date" className="dataAdmin" value={log.data} maxLength={10} onChange={(e) => handleUpdateLog(index, 'data', e.target.value)} required />
                                    </div>
                                    <textarea className="logInfoAdmin" placeholder="Description" maxLength={10000} value={decodeHtmlEntities(log.description)} onChange={(e) => handleUpdateLog(index, 'description', e.target.value)} required />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div id="commentsSectionAdmin">
                        <h3>Comments</h3>
                        <ul id="commentsListAdmin">
                            {renderComments(comments)}
                        </ul>
                    </div>

                    <div id="dangerAreaAccountAdmin">
                        <label>Danger Area</label>
                        <input type="button" value="Delete Idea" id="dangerAreaDeleteIdeaAdmin" onClick={handleDelete} style={{cursor: "pointer"}} />
                    </div>
                </>
            )}
        </section>
    );
}