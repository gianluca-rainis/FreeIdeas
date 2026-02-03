import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Head from '../../components/Head'
import { useAppContext } from '../../contexts/CommonContext'
import { fetchWithTimeout } from '../../utils/fetchWithTimeout'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    const { id } = context.query;
    let ideaData = null;
    let pageTitle = 'Edit an Idea - ';
    
    // Cache SSR response briefly to improve perceived speed
    if (context.res) {
        context.res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    }
    
    try {
        const formData = new FormData();
        formData.append("id", id);

        // Send cookies read session in php
        const cookieHeader = context.req?.headers?.cookie ?? '';
        const hostHeader = context.req?.headers?.host;
        const baseUrl = process.env.SITE_URL || (hostHeader ? `http://${hostHeader}` : 'http://localhost:3000');

        const response = await fetchWithTimeout(`${baseUrl}/api/data`, {
            method: "POST",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined,
            body: formData
        }, 2000);

        const data = await response.json();
        
        if (data && data.success !== false) {
            ideaData = data;
            pageTitle += ideaData['idea'][0]['title'];
        }
        else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Failed to fetch ideas: '+error);
    }

    return {
        props: {
            id: id,
            ideaData: ideaData,
            pageTitle: pageTitle
        }
    }
}

// Main
export default function PublishAnIdeaPage({ id, ideaData, pageTitle }) {
    const { themeIsLight, user, randomIdeaId, showAlert, showConfirm, showLoading } = useAppContext();
    const router = useRouter();
    
    // State management
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        typeProject: '',
        creativityType: '',
        statusProject: '',
        buttonlink: '',
        licenseDefaultLicense: true
    });
    
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [licensePdfFile, setLicensePdfFile] = useState(null);
    const [additionalInfos, setAdditionalInfos] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    
    // Current date helper
    function getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Check if user is logged in and load existing idea data if editing
    useEffect(() => {
        if (!isHydrated) {
            return;
        }
        
        async function checkAuthAndLoadData() {
            try {
                setLoading(true);
            
                // If editing an existing idea, load data
                if (id && user && ideaData && id == ideaData['idea'][0]['id'] && (parseInt(user.id) === parseInt(ideaData['idea'][0]['accountId']) || user.isAdmin)) {
                    await loadExistingIdeaData();
                }
                
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        
        checkAuthAndLoadData();
    }, [id, user, ideaData, isHydrated]);

    // Load existing idea data for editing
    async function loadExistingIdeaData() {
        try {
            if (ideaData) {
                // Helper to decode HTML entities
                function decodeHtmlEntities(text) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');
                    return doc.documentElement.textContent;
                };
                
                setFormData({
                    title: decodeHtmlEntities(ideaData.idea[0].title),
                    description: ideaData.idea[0].description,
                    typeProject: decodeHtmlEntities(ideaData.idealabels[0].type),
                    creativityType: decodeHtmlEntities(ideaData.idealabels[0].creativity),
                    statusProject: decodeHtmlEntities(ideaData.idealabels[0].status),
                    buttonlink: ideaData.idea[0].downloadlink || '',
                    licenseDefaultLicense: !ideaData.idea[0].license || ideaData.idea[0].license === 'default'
                });

                setLicensePdfFile(null);
                
                setMainImagePreview(ideaData.idea[0].ideaimage);
                
                // Load additional info
                if (ideaData.info && ideaData.info.length > 0) {
                    setAdditionalInfos(ideaData.info.map(info => ({
                        id: Date.now() + Math.random(),
                        title: info.title,
                        description: info.description,
                        imagePreview: info.updtimage,
                        imageFile: null
                    })));
                }
                
                // Load logs
                if (ideaData.log && ideaData.log.length > 0) {
                    setLogs(ideaData.log.map(log => ({
                        id: Date.now() + Math.random(),
                        title: log.title,
                        description: log.description,
                        date: log.data
                    })));
                }
            }
        } catch (error) {
            console.error('Error loading idea data:', error);
            await showAlert('Error loading idea data. Please try again.');
        }
    }

    // Handle main image change
    function handleMainImageChange(e) {
        const file = e.target.files[0];

        if (file) {
            setMainImageFile(file);

            const reader = new FileReader();

            reader.onload = (e) => {
                setMainImagePreview(e.target.result);
            };

            reader.readAsDataURL(file);
        }
    }

    // Handle license file change
    function handleLicenseFileChange(e) {
        const file = e.target.files[0];

        if (file) {
            setLicensePdfFile(file);
            setFormData(prev => ({ ...prev, licenseDefaultLicense: false }));
        }
    }

    // Handle license checkbox change
    function handleLicenseCheckboxChange(e) {
        if (e.target.checked) {
            setLicensePdfFile(null);
            setFormData(prev => ({ ...prev, licenseDefaultLicense: true }));

            if (document.getElementById("licensePdfFile")) {
                document.getElementById("licensePdfFile").value = "";
            }
        }
        else if (!licensePdfFile) {
            showAlert("Your idea must have a license!");
            // Reset checkbox if no file is selected
            setTimeout(() => {
                setFormData(prev => ({ ...prev, licenseDefaultLicense: true }));
            }, 0);
        }
    }

    // Add additional info
    function addAdditionalInfo() {
        setAdditionalInfos(prev => [...prev, {
            id: Date.now() + Math.random(),
            title: '',
            description: '',
            imagePreview: '/images/FreeIdeas.svg',
            imageFile: null
        }]);
    }

    // Remove additional info
    function removeAdditionalInfo(id) {
        setAdditionalInfos(prev => prev.filter(info => info.id !== id));
    }

    // Update additional info
    function updateAdditionalInfo(id, field, value) {
        setAdditionalInfos(prev => prev.map(info => 
            info.id === id ? { ...info, [field]: value } : info
        ));
    }

    // Handle additional info image change
    function handleAdditionalInfoImageChange(id, file) {
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                updateAdditionalInfo(id, 'imagePreview', e.target.result);
                updateAdditionalInfo(id, 'imageFile', file);
            };

            reader.readAsDataURL(file);
        }
    }

    // Add log
    function addLog() {
        setLogs(prev => [...prev, {
            id: Date.now() + Math.random(),
            title: '',
            description: '',
            date: getCurrentDate()
        }]);
    }

    // Remove log
    function removeLog(id) {
        setLogs(prev => prev.filter(log => log.id !== id));
    }

    // Update log
    function updateLog(id, field, value) {
        setLogs(prev => prev.map(log => 
            log.id === id ? { ...log, [field]: value } : log
        ));
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        const form = document.getElementById("newIdeaForm");

        if (!form.checkValidity()) {
            await showAlert("You must fill in all required fields!");

            const firstInvalid = form.querySelector(":invalid");

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }
        
        setLoading(true);

        const closeLoading = showLoading("Updating your idea. This process can take anywhere from a few seconds to a few minutes. Please wait and do not reload the page; you will be redirected to the new idea page once it's finished loading.");

        try {
            const submitFormData = new FormData();
            
            submitFormData.append("ideaid", id);
            submitFormData.append("author", ideaData.idea[0].accountId);
            
            if (mainImageFile) {
                submitFormData.append("mainImageFile", mainImageFile);
            }
            else {
                submitFormData.append("mainImageData", ideaData.idea[0].ideaimage);
            }
            
            submitFormData.append("title", formData.title);
            submitFormData.append("date", getCurrentDate());
            submitFormData.append("description", formData.description);
            submitFormData.append("type", formData.typeProject);
            submitFormData.append("creativity", formData.creativityType);
            submitFormData.append("status", formData.statusProject);
            submitFormData.append("link", formData.buttonlink);

            // Handle additional info
            const additionalInfoTitles = [];
            const additionalInfoDescriptions = [];
            const additionalInfoTypes = [];

            additionalInfos.forEach((info) => {
                if (info.imageFile) {
                    submitFormData.append("additionalInfoImagesFile[]", info.imageFile);
                    additionalInfoTypes.push("file");
                }
                else {
                    submitFormData.append("additionalInfoImagesData[]", info.imagePreview);
                    additionalInfoTypes.push("data");
                }

                additionalInfoTitles.push(info.title);
                additionalInfoDescriptions.push(info.description);
            });

            const additionalInfoJson = {
                titles: additionalInfoTitles,
                descriptions: additionalInfoDescriptions,
                types: additionalInfoTypes
            };

            submitFormData.append("additionalInfo", JSON.stringify(additionalInfoJson));

            // Handle license
            if (licensePdfFile instanceof File) {
                submitFormData.append("license", licensePdfFile);
            }
            else {
                submitFormData.append("license", ideaData.idea[0].license);
            }

            // Handle logs
            const logDates = logs.map(log => log.date);
            const logTitles = logs.map(log => log.title);
            const logDescriptions = logs.map(log => log.description);

            const logJson = {
                dates: logDates,
                titles: logTitles,
                descriptions: logDescriptions
            };

            submitFormData.append("logs", JSON.stringify(logJson));

            // Submit to appropriate endpoint
            const response = await fetch('/api/updateOldIdea', {
                credentials: "include",
                method: "POST",
                body: submitFormData
            });

            const data = await response.json();

            if (data && data.success) {
                closeLoading();
                router.push(`/idea/${id}`);
            }
            else {
                throw new Error(data?.error || "Failed to save idea");
            }
        } catch (error) {
            console.error('Submission error:', error);
            closeLoading();
            await showAlert('Failed to save idea. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Handle delete idea (only in edit mode)
    async function handleDeleteIdea() {
        const confirmed = await showConfirm("Are you sure that you want to delete this idea? This operation cannot be undone.");
        
        if (confirmed) {
            try {
                setLoading(true);

                const deleteFormData = new FormData();
                deleteFormData.append('id', id);

                const response = await fetch('/api/deleteIdea', {
                    credentials: "include",
                    method: 'POST',
                    body: deleteFormData
                });

                const data = await response.json();
                
                if (data && data.success) {
                    router.push('/publishAnIdea');
                }
                else {
                    throw new Error(data?.error || "Failed to delete idea");
                }
            } catch (error) {
                console.error('Delete error:', error);
                await showAlert('Failed to delete idea. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    // Handle cancel
    function handleCancel() {
        router.push('/publishAnIdea');
    }

    // Don't render anything until hydrated to prevent hydration mismatch
    if (!isHydrated) {
        return (
            <>
                <Head pageTitle={pageTitle} />

                <Nav randomId={randomIdeaId} />

                <main id="newIdeaMain">
                    <form id="newIdeaForm">
                        <div id="ideaImageAsBackground">
                            <input type="text" placeholder="Title" disabled />
                            <h2 id="author"><span>Author</span></h2>
                        </div>
                        <label>Background image: </label>
                        <input type="file" disabled />
                        <div id="newinfoForFilters">
                            <label className="labelInfoSearch">Type of project:</label>
                            <label className="labelInfoSearch">Creativity Type:</label>
                            <label className="labelInfoSearch">Project status:</label>
                            <select className="filterSearch" disabled><option>Loading...</option></select>
                            <select className="filterSearch" disabled><option>Loading...</option></select>
                            <select className="filterSearch" disabled><option>Loading...</option></select>
                        </div>
                        <textarea placeholder="Description" disabled></textarea>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <input type="submit" value="Loading..." disabled />
                        </div>
                    </form>
                </main>

                <Footer />
            </>
        );
    }

    // Show login requirement if user is not logged in (only after hydration)
    if (!user) {
        return (
            <>
                <Head pageTitle={pageTitle} />
                
                <Nav randomId={randomIdeaId} />
                
                <main id="newIdeaMain" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backdropFilter: 'blur(5px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        zIndex: 90,
                        pointerEvents: 'all',
                    }} />
                    
                    <div style={{
                        width: '500px',
                        height: '300px',
                        maxWidth: '80%',
                        maxHeight: '70%',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 91,
                        backgroundColor: themeIsLight ? '#eaffbe' : '#000000',
                        borderRadius: '30px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                        color: themeIsLight ? '#2c3d27' : '#cba95c'
                    }}>
                        <div style={{
                            fontSize: 'larger',
                            padding: '10px',
                            alignSelf: 'center',
                            textAlign: 'center',
                            marginBottom: '20px'
                        }}>
                            Before to publish an idea you need to login!
                        </div>
                        
                        <div style={{
                            padding: '20px',
                            alignSelf: 'center',
                            textAlign: 'center'
                        }}>
                            For more information you can read our{' '}
                            <Link href="/termsOfUse" style={{ color: 'inherit' }}>Terms of Use</Link>
                            {' '}and our{' '}
                            <Link href="/privacyPolicy" style={{ color: 'inherit' }}>Privacy Policy</Link>
                            <br /><br />
                            If you have any questions you can contact us via email at{' '}
                            <a href="mailto:freeideas.site@gmail.com" style={{ color: 'inherit' }}>
                                freeideas.site@gmail.com
                            </a>
                        </div>
                    </div>
                    
                    {/* Blurred form in background */}
                    <form style={{ filter: 'blur(5px)' }}>
                        <div id="ideaImageAsBackground">
                            <input type="text" placeholder="Title" disabled />
                            <h2 id="author"><span>Author</span></h2>
                        </div>
                        <label>Background image: </label>
                        <input type="file" disabled />
                        <div id="newinfoForFilters">
                            <label className="labelInfoSearch">Type of project:</label>
                            <label className="labelInfoSearch">Creativity Type:</label>
                            <label className="labelInfoSearch">Project status:</label>
                            <select className="filterSearch" disabled><option>None</option></select>
                            <select className="filterSearch" disabled><option>None</option></select>
                            <select className="filterSearch" disabled><option>None</option></select>
                        </div>
                        <textarea placeholder="Description" disabled></textarea>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <input type="submit" value="Publish" disabled />
                        </div>
                    </form>
                </main>
                
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="newIdeaMain">
                <form id="newIdeaForm" onSubmit={handleSubmit} noValidate>
                    <div 
                        id="ideaImageAsBackground"
                        style={{
                            backgroundImage: mainImagePreview ? `url(${mainImagePreview})` : ''
                        }}
                    >
                        <input 
                            type="text" 
                            id="title" 
                            placeholder="Title" 
                            maxLength="255" 
                            required 
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            disabled={loading}
                        />
                        <h2 id="author">
                            <a id="mainAuthorAccount">
                                {user && user.username ? user.username : 'Author'}
                            </a>
                        </h2>
                    </div>

                    <label>Background image: </label>
                    <input 
                        type="file" 
                        id="mainImage" 
                        accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" 
                        required={false}
                        onChange={handleMainImageChange}
                        disabled={loading}
                    />

                    <div id="newinfoForFilters">
                        <label className="labelInfoSearch">Type of project:</label>
                        <label className="labelInfoSearch">Creativity Type:</label>
                        <label className="labelInfoSearch">Project status:</label>

                        <select 
                            id="typeFilter" 
                            className="filterSearch" 
                            required
                            value={formData.typeProject}
                            onChange={(e) => setFormData(prev => ({ ...prev, typeProject: e.target.value }))}
                            disabled={loading}
                        >
                            <option value="">None</option>
                            <option value="Technological Innovation">Technological Innovation</option>
                            <option value="Environmental Sustainability">Environmental Sustainability</option>
                            <option value="Education & Learning">Education & Learning</option>
                            <option value="Business & Startups">Business & Startups</option>
                            <option value="Art & Design">Art & Design</option>
                            <option value="Social & Community">Social & Community</option>
                            <option value="Health & Wellness">Health & Wellness</option>
                            <option value="Travel & Experiences">Travel & Experiences</option>
                            <option value="Games & Entertainment">Games & Entertainment</option>
                        </select>

                        <select 
                            id="creativityTypeFilter" 
                            className="filterSearch" 
                            required
                            value={formData.creativityType}
                            onChange={(e) => setFormData(prev => ({ ...prev, creativityType: e.target.value }))}
                            disabled={loading}
                        >
                            <option value="">None</option>
                            <option value="Practical and actionable">Practical and actionable</option>
                            <option value="Abstract or conceptual">Abstract or conceptual</option>
                            <option value="Thought-provoking">Thought-provoking</option>
                            <option value="Visionary or futuristic">Visionary or futuristic</option>
                            <option value="Humorous or satirical">Humorous or satirical</option>
                        </select>

                        <select 
                            id="orderByStatus" 
                            className="filterSearch" 
                            required
                            value={formData.statusProject}
                            onChange={(e) => setFormData(prev => ({ ...prev, statusProject: e.target.value }))}
                            disabled={loading}
                        >
                            <option value="">None</option>
                            <option value="Finished">Finished</option>
                            <option value="Work in progress">Work in progress</option>
                            <option value="Need help">Need help</option>
                        </select>
                    </div>

                    <textarea 
                        type="text" 
                        id="description" 
                        placeholder="Description" 
                        maxLength="10000" 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={loading}
                    ></textarea>

                    <section id="additionalInfo">
                        <h3 className="subtitles">Additional Information</h3>
                        <img 
                            src={`/images/add${themeIsLight ? "" : "_Pro"}.svg`} 
                            alt="Add additional info" 
                            id="addAdditionalInfo"
                            onClick={addAdditionalInfo}
                            style={{ cursor: 'pointer' }}
                        />
                        <ul id="imagesInfo">
                            {additionalInfos.map((info) => (
                                <li key={info.id} className="imageInfoLi">
                                    <div></div>
                                    <img 
                                        src={`/images/delete${themeIsLight ? "" : "_Pro"}.svg`} 
                                        alt="Delete additional info" 
                                        className="deleteAdditionalInfo"
                                        onClick={() => removeAdditionalInfo(info.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    
                                    <div>
                                        <img 
                                            className="preview" 
                                            alt="Additional info image" 
                                            src={info.imagePreview}
                                        />
                                        <input 
                                            type="file" 
                                            className="imageInfo" 
                                            accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" 
                                            required={!info.imagePreview || info.imagePreview === '/images/FreeIdeas.svg'}
                                            onChange={(e) => handleAdditionalInfoImageChange(info.id, e.target.files[0])}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <textarea 
                                            type="text" 
                                            className="titleImageInfo" 
                                            placeholder="Title" 
                                            maxLength="255" 
                                            required
                                            value={info.title}
                                            onChange={(e) => updateAdditionalInfo(info.id, 'title', e.target.value)}
                                            disabled={loading}
                                        ></textarea>
                                        <textarea 
                                            type="text" 
                                            className="imageInfoDescription" 
                                            placeholder="Info" 
                                            maxLength="10000" 
                                            required
                                            value={info.description}
                                            onChange={(e) => updateAdditionalInfo(info.id, 'description', e.target.value)}
                                            disabled={loading}
                                        ></textarea>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section id="downloadSection">
                        <h3 className="subtitles">External Link</h3>
                        <input 
                            type="url" 
                            id="buttonlink" 
                            placeholder="Link to download data" 
                            maxLength="5000"
                            value={formData.buttonlink}
                            onChange={(e) => setFormData(prev => ({ ...prev, buttonlink: e.target.value }))}
                            disabled={loading}
                        />
                    </section>

                    <section id="licenseSection">
                        <h3 className="subtitles">License</h3>
                        <input 
                            type="file" 
                            id="licensePdfFile" 
                            accept=".pdf"
                            onChange={handleLicenseFileChange}
                            disabled={loading}
                        />
                        <div style={{padding: "10px"}}>
                            <label htmlFor="licenseDefaultLicense">Use the FreeIdeas license: </label>
                            <input 
                                type="checkbox" 
                                id="licenseDefaultLicense" 
                                name="licenseDefaultLicense" 
                                checked={formData.licenseDefaultLicense}
                                onChange={handleLicenseCheckboxChange}
                                disabled={loading}
                            />
                        </div>
                    </section>

                    <section id="devLogsSection">
                        <h3 className="subtitles">Author's Log</h3>
                        <img 
                            src={`/images/add${themeIsLight ? "" : "_Pro"}.svg`} 
                            alt="Add log" 
                            id="addLog"
                            onClick={addLog}
                            style={{ cursor: 'pointer' }}
                        />
                        <ul id="logsList">
                            {logs.map((log) => (
                                <li key={log.id} className="log">
                                    <img 
                                        src={`/images/delete${themeIsLight ? "" : "_Pro"}.svg`} 
                                        alt="Delete log" 
                                        className="deleteLog"
                                        onClick={() => removeLog(log.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <div className="logTitleAndData">
                                        <textarea 
                                            className="logTitle" 
                                            placeholder="Title" 
                                            maxLength="255" 
                                            required
                                            value={log.title}
                                            onChange={(e) => updateLog(log.id, 'title', e.target.value)}
                                            disabled={loading}
                                        ></textarea>
                                        <div className="data">{log.date}</div>
                                    </div>

                                    <textarea 
                                        className="logInfo" 
                                        placeholder="Description" 
                                        maxLength="10000" 
                                        required
                                        value={log.description}
                                        onChange={(e) => updateLog(log.id, 'description', e.target.value)}
                                        disabled={loading}
                                    ></textarea>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div style={{display: "flex", justifyContent: "center"}}>
                        <input 
                            type="submit" 
                            id="saveNewIdea" 
                            value={"Update"}
                            disabled={loading}
                        />
                        <input 
                            type="button" 
                            id="deleteOldIdea" 
                            value="Delete idea"
                            onClick={handleDeleteIdea}
                            disabled={loading}
                        />
                        <img 
                            id="cancelNewIdea" 
                            alt="Cancel changes" 
                            src={`/images/delete${themeIsLight ? "" : "_Pro"}.svg`}
                            onClick={handleCancel}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </form>
            </main>

            <Footer />
        </>
    )
}