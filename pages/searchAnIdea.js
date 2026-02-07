import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Search an Idea"
        }
    }
}

// Internal functions
function IdeaCard({ link, imgSrc, title, author }) {
    return (
        <li className="ideaBox">
            <Link href={link} className="ideaLink">
                <img src={imgSrc!=null?imgSrc:"/images/FreeIdeas.svg"} alt="Idea Image" className="ideaImageSrc" />
                <p className="ideaTitleSrc">{title}</p>
                <p className="ideaAuthorSrc">{author}</p>
            </Link>
        </li>
    )
}

function IdeaList({ ideas }) {
    return (
        <ul id="lastIdeasSrc">
            {ideas.map((idea, index) => (
                <IdeaCard key={`idea-${index}`} link={idea.link} imgSrc={idea.image} title={idea.title} author={idea.author} />
            ))}
        </ul>
    )
}

// Compact filters component
function CompactFilters({ themeIsLight, onFilterChange, windowWidth, currentFilters }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [openSection, setOpenSection] = useState(null);

    // Close dropdown when scroll
    useEffect(() => {
        function handleScroll() {
            if (showDropdown) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener('scroll', handleScroll);
        }

        return () => document.removeEventListener('scroll', handleScroll);
    }, [showDropdown]);

    function handleFilterClick(filterType, value) {
        onFilterChange(filterType, value);
        // Close after select
        setOpenSection(null);
    }

    function toggleSection(section) {
        setOpenSection(openSection === section ? null : section);
    }

    const filterOptions = {
        type: ['All', 'Technological Innovation', 'Environmental Sustainability', 'Education & Learning', 'Business & Startups', 'Art & Design', 'Social & Community', 'Health & Wellness', 'Travel & Experiences', 'Games & Entertainment'],
        creativity: ['All', 'Practical and actionable', 'Abstract or conceptual', 'Thought-provoking', 'Visionary or futuristic', 'Humorous or satirical'],
        status: ['All', 'Finished', 'Work in progress', 'Need help'],
        order: ['All', 'Most voted', 'Newest', 'Most discussed']
    };

    const renderFilterSection = (key, label) => (
        <li key={key}>
            <div className="hiddenTypeFilterText" onClick={() => toggleSection(key)} style={{ 
                cursor: 'pointer', 
                padding: '10px', 
                borderBottom: `1px solid ${themeIsLight ? '#ccc' : '#555'}`
            }}>
                {label} 
                <img 
                    className="hiddenTypeFilterTextImg" 
                    alt="Filters section" 
                    src="/images/menuFilters.svg"
                    style={{ 
                        transform: openSection === key ? 'rotate(180deg)' : '',
                        transition: 'transform 0.3s',
                        float: 'right'
                    }}
                />
            </div>
            {openSection === key && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filterOptions[key].map(option => (
                        <li 
                            key={option}
                            className={`${key}HiddenLi`}
                            onClick={() => handleFilterClick(key, option)}
                            onMouseEnter={(e) => {
                                if (currentFilters[key] !== option) {
                                    e.target.style.backgroundColor = '#8fb800';
                                    e.target.style.color = '#fff';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentFilters[key] !== option) {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = themeIsLight ? '#000' : '#fff';
                                }
                            }}
                            style={{
                                padding: '8px 15px',
                                margin: '2px 0px',
                                cursor: 'pointer',
                                backgroundColor: currentFilters[key] === option ? (themeIsLight?'#b3e403':'#5c4e2e') : 'transparent',
                                borderBottom: `1px solid ${themeIsLight ? '#eee' : '#444'}`,
                                fontWeight: currentFilters[key] === option ? 'bold' : 'normal',
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );

    if (windowWidth >= 1100) {
        return null;
    }

    return (
        <>
            <li className="filterBlock">
                <div 
                    id="compactFilters" 
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <img 
                        alt="Filters Block" 
                        src={`/images/filters${themeIsLight ? "" : "_Pro"}.svg`}
                    />
                    <span>Filters</span>
                </div>
            </li>

            {windowWidth > 600 && (
                <li className="filterBlock">
                    <label className="labelInfoSearch">Order by:</label>
                    <select 
                        id="orderByPeople" 
                        className="filterSearch" 
                        value={currentFilters.order}
                        onChange={(e) => handleFilterClick('order', e.target.value)}
                    >
                        {filterOptions.order.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </li>
            )}

            {showDropdown && (
                <div 
                    id="compactFiltersHidden"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: themeIsLight ? '#ebffa4' : '#2d2d2d',
                        border: `1px solid ${themeIsLight ? '#ccc' : '#555'}`,
                        borderRadius: '4px',
                        zIndex: 1000,
                        maxHeight: '400px',
                        overflowY: 'auto',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {renderFilterSection('type', 'Type of project')}
                        {renderFilterSection('creativity', 'Creativity Type')}
                        {renderFilterSection('status', 'Project status')}
                        {windowWidth <= 600 && renderFilterSection('order', 'Order By')}
                    </ul>
                </div>
            )}
        </>
    );
}

// Main
export default function SearchAnIdeaPage({ pageTitle }) {
    const { themeIsLight, user, randomIdeaId, bannerMessage, showBanner } = useAppContext();
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1200); // Default desktop size
    const [filters, setFilters] = useState({
        search: '',
        type: 'All',
        creativity: 'All',
        status: 'All',
        order: 'All'
    });

    // Search with params
    async function searchIdeasWithFilters(customFilters = filters) {
        setLoading(true);

        try {
            const formData = new FormData();
            
            formData.append("search", customFilters.search || "");
            formData.append("type", (customFilters.type !== "All") ? customFilters.type : "");
            formData.append("creativity", (customFilters.creativity !== "All") ? customFilters.creativity : "");
            formData.append("status", (customFilters.status !== "All") ? customFilters.status : "");
            formData.append("order", (customFilters.order !== "All") ? customFilters.order : "");

            const response = await fetch((process.env.DB_HOST?process.env.DB_HOST:"")+'/api/searchAnIdea', {
                credentials: "include",
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                const ideasData = data.data;
                let mappedIdeas = [];
                
                if (ideasData.format == "mono") {
                    mappedIdeas = ideasData.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                }
                else if (ideasData.format == "double") {
                    // Merge account and ideas
                    const accounts = ideasData.data.data.map(phpIdea => ({
                        link: `/account/${phpIdea.id}`,
                        title: `${phpIdea.name || ''} ${phpIdea.surname || ''}`.trim() || phpIdea.username || 'Unknown User',
                        author: phpIdea.username || 'unknown',
                        image: phpIdea.userimage || "/images/FreeIdeas.svg"
                    }));
                    
                    const ideas = ideasData.subdata.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                    
                    mappedIdeas = [...accounts, ...ideas];
                }
                else {
                    // Default case (void or unknown format)
                    mappedIdeas = ideasData.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                }
                
                setIdeas(mappedIdeas);
            }
            else {
                throw new Error("PHP API error: " + data.error);
            }
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
            // Fallback data in case of API failure
            setIdeas(Array.from({ length: 6 }, (_, i) => ({
                link: `/idea/${i + 1}`,
                title: `Idea ${i + 1}`,
                author: `Author ${i + 1}`,
                image: "/images/FreeIdeas.svg"
            })));
        } finally {
            setLoading(false);
        }
    }

    // Search base
    async function searchIdeas() {
        setLoading(true);

        try {
            const formData = new FormData();
            const searchInput = document.getElementById("search");
            const typeFilter = document.getElementById("typeFilter");
            const creativityFilter = document.getElementById("creativityTypeFilter");
            const statusFilter = document.getElementById("orderByStatus");
            const orderFilter = document.getElementById("orderByPeople");

            formData.append("search", searchInput?searchInput.value:"");
            formData.append("type", typeFilter?(typeFilter.value!="All"?typeFilter.value:""):"");
            formData.append("creativity", creativityFilter?(creativityFilter.value!="All"?creativityFilter.value:""):"");
            formData.append("status", statusFilter?(statusFilter.value!="All"?statusFilter.value:""):"");
            formData.append("order", orderFilter?(orderFilter.value!="All"?orderFilter.value:""):"");

            const response = await fetch((process.env.DB_HOST?process.env.DB_HOST:"")+'/api/searchAnIdea', {
                credentials: "include",
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                const ideasData = data.data;
                let mappedIdeas = [];
                
                if (ideasData.format == "mono") {
                    mappedIdeas = ideasData.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                }
                else if (ideasData.format == "double") {
                    // Merge accounts and ideas
                    const accounts = ideasData.data.data.map(phpIdea => ({
                        link: `/account/${phpIdea.id}`,
                        title: `${phpIdea.name || ''} ${phpIdea.surname || ''}`.trim() || phpIdea.username || 'Unknown User',
                        author: phpIdea.username || 'unknown',
                        image: phpIdea.userimage || "/images/FreeIdeas.svg"
                    }));
                    
                    const ideas = ideasData.subdata.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                    
                    mappedIdeas = [...accounts, ...ideas];
                }
                else {
                    // Default case (void or unknown format)
                    mappedIdeas = ideasData.data.map(phpIdea => ({
                        link: `/idea/${phpIdea.id}`,
                        title: phpIdea.title || 'Untitled',
                        author: phpIdea.username || 'Unknown',
                        image: phpIdea.ideaimage || "/images/FreeIdeas.svg"
                    }));
                }
                
                setIdeas(mappedIdeas);
            }
            else {
                throw new Error("API error: " + data.error);
            }
        } catch (error) {
            console.error('Failed to fetch ideas:', error);
            // Fallback data in case of API failure
            setIdeas(Array.from({ length: 6 }, (_, i) => ({
                link: `/ideaVoid/${i + 1}`,
                title: `Idea ${i + 1}`,
                author: `Author ${i + 1}`,
                image: "/images/FreeIdeas.svg"
            })));
        } finally {
            setLoading(false);
        }
    }

    // Resize window gestor
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        // Set initial width (call twice for mobile layout fix)
        handleResize();
        setTimeout(handleResize, 1);
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Change filters gestor
    function handleFilterChange(filterType, value) {
        setFilters(prev => {
            const newFilters = { ...prev, [filterType]: value };
            // Trigger search with new filters
            setTimeout(() => searchIdeasWithFilters(newFilters), 0);
            return newFilters;
        });
    }

    function handleSearchChange(value) {
        setFilters(prev => {
            const newFilters = { ...prev, search: value };
            setTimeout(() => searchIdeasWithFilters(newFilters), 300); // Debounce
            return newFilters;
        });
    }

    // Load initial ideas
    useEffect(() => {
        searchIdeas();
    }, []);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />
            
            <header style={{padding: "20px 0 20px 0", position: 'relative'}}>
                <input 
                    type="search" 
                    placeholder="Search" 
                    id="search" 
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />

                <ul id="allFilters">
                    {windowWidth >= 1100 ? (
                        // Show all filters
                        <>
                            <li className="filterBlock">
                                <label className="labelInfoSearch">Type of project:</label>
                                <select 
                                    id="typeFilter" 
                                    className="filterSearch" 
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Technological Innovation</option>
                                    <option>Environmental Sustainability</option>
                                    <option>Education & Learning</option>
                                    <option>Business & Startups</option>
                                    <option>Art & Design</option>
                                    <option>Social & Community</option>
                                    <option>Health & Wellness</option>
                                    <option>Travel & Experiences</option>
                                    <option>Games & Entertainment</option>
                                </select>
                            </li>

                            <li className="filterBlock">
                                <label className="labelInfoSearch">Creativity Type:</label>
                                <select 
                                    id="creativityTypeFilter" 
                                    className="filterSearch" 
                                    value={filters.creativity}
                                    onChange={(e) => handleFilterChange('creativity', e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Practical and actionable</option>
                                    <option>Abstract or conceptual</option>
                                    <option>Thought-provoking</option>
                                    <option>Visionary or futuristic</option>
                                    <option>Humorous or satirical</option>
                                </select>
                            </li>

                            <li className="filterBlock">
                                <label className="labelInfoSearch">Project status:</label>
                                <select 
                                    id="orderByStatus" 
                                    className="filterSearch" 
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Finished</option>
                                    <option>Work in progress</option>
                                    <option>Need help</option>
                                </select>
                            </li>

                            <li className="filterBlock">
                                <label className="labelInfoSearch">Order by:</label>
                                <select 
                                    id="orderByPeople" 
                                    className="filterSearch" 
                                    value={filters.order}
                                    onChange={(e) => handleFilterChange('order', e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Most voted</option>
                                    <option>Newest</option>
                                    <option>Most discussed</option>
                                </select>
                            </li>
                        </>
                    ) : (
                        // Show compact filters
                        <CompactFilters 
                            themeIsLight={themeIsLight}
                            onFilterChange={handleFilterChange}
                            windowWidth={windowWidth}
                            currentFilters={filters}
                        />
                    )}
                </ul>
            </header>

            <main>
                <IdeaList ideas={ideas} />
            </main>

            <Footer />
        </>
    )
}