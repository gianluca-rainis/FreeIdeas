import '@/styles/ResponsivePages.module.css';
import '@/styles/ThemeAndBase.module.css';
import styles from '@/styles/SearchPublishModern.module.css'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Head from '@/components/Head'
import { useAppContext } from '@/contexts/CommonContext'
import { apiCall } from '@/utils/apiConfig'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Search an Idea"
        }
    }
}

// Internal functions
function IdeaCard({ link, imgSrc, title, author, index }) {
    return (
        <li className={styles.ideaBox}>
            <Link href={link} className={styles.ideaLink}>
                <div className={styles.ideaImageWrap}>
                    <img src={imgSrc!=null?imgSrc:"/images/FreeIdeas.svg"} alt="" className={styles.ideaImageSrc} />
                    <span className={styles.ideaIndex}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className={styles.ideaCardCopy}>
                    <p className={styles.ideaTitleSrc}>{title}</p>
                    <p className={styles.ideaAuthorSrc}>by {author}</p>
                </div>
            </Link>
        </li>
    )
}

function IdeaList({ ideas }) {
    return (
        <ul id="lastIdeasSrc" className={styles.lastIdeasSrc}>
            {ideas.map((idea, index) => (
                <IdeaCard key={`idea-${index}`} link={idea.link} imgSrc={idea.image} title={idea.title} author={idea.author} index={index} />
            ))}
        </ul>
    )
}

// Compact filters component
function CompactFilters({ onFilterChange, windowWidth, currentFilters }) {
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
        <li key={key} className={styles.compactFilterSection}>
            <button
                type="button"
                className={styles.compactFilterSectionButton}
                onClick={() => toggleSection(key)}
                aria-expanded={openSection === key}
            >
                <span>{label}</span>
                <ChevronDown className={`${styles.compactFilterChevron} ${openSection === key ? styles.compactFilterChevronOpen : ''}`} aria-hidden="true" />
            </button>
            {openSection === key && (
                <ul className={styles.compactFilterOptions}>
                    {filterOptions[key].map(option => (
                        <li key={option}>
                            <button
                                type="button"
                                className={`${styles.compactFilterOption} ${currentFilters[key] === option ? styles.compactFilterOptionActive : ''}`}
                                onClick={() => handleFilterClick(key, option)}
                            >
                                {option}
                            </button>
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
            <li className={`${styles.filterBlock} ${styles.compactFilterItem}`}>
                <button
                    type="button"
                    id="compactFilters" 
                    className={styles.compactFilterTrigger}
                    onClick={() => setShowDropdown((isOpen) => !isOpen)}
                    aria-expanded={showDropdown}
                    aria-controls="compactFiltersHidden"
                >
                    <SlidersHorizontal aria-hidden="true" />
                    <span>Filters</span>
                    <ChevronDown className={`${styles.compactFilterChevron} ${showDropdown ? styles.compactFilterChevronOpen : ''}`} aria-hidden="true" />
                </button>

                {showDropdown && (
                    <div id="compactFiltersHidden" className={styles.compactFiltersHidden}>
                        <div className={styles.compactFiltersHeader}>
                            <div>
                                <span className={styles.compactFiltersEyebrow}>Refine results</span>
                                <strong>Filter ideas</strong>
                            </div>
                            <button type="button" className={styles.compactFiltersClose} onClick={() => setShowDropdown(false)} aria-label="Close filters">
                                <X aria-hidden="true" />
                            </button>
                        </div>
                        <ul className={styles.compactFilterSections}>
                            {renderFilterSection('type', 'Type of project')}
                            {renderFilterSection('creativity', 'Creativity type')}
                            {renderFilterSection('status', 'Project status')}
                            {windowWidth <= 600 && renderFilterSection('order', 'Order by')}
                        </ul>
                    </div>
                )}
            </li>

            {windowWidth > 600 && (
                <li className={styles.filterBlock}>
                    <label className={styles.labelInfoSearch}>Order by:</label>
                    <select 
                        id="orderByPeople" 
                        className={styles.filterSearch} 
                        value={currentFilters.order}
                        onChange={(e) => handleFilterClick('order', e.target.value)}
                    >
                        {filterOptions.order.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </li>
            )}

        </>
    );
}

// Main
export default function SearchAnIdeaPage({ pageTitle }) {
    const { randomIdeaId } = useAppContext();
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

            const data = await apiCall('/api/searchAnIdea', {
                method: 'POST',
                body: formData
            });
            
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

            const data = await apiCall('/api/searchAnIdea', {
                method: 'POST',
                body: formData
            });
            
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
            
            <main className={styles.searchPageMain}>
                <header className={styles.searchToolbar}>
                <input 
                    type="search" 
                    placeholder="Search" 
                    id="search"
                    className={styles.search}
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />

                <ul id="allFilters" className={styles.allFilters}>
                    {windowWidth >= 1100 ? (
                        // Show all filters
                        <>
                            <li className={styles.filterBlock}>
                                <label className={styles.labelInfoSearch}>Type of project:</label>
                                <select 
                                    id="typeFilter" 
                                    className={styles.filterSearch} 
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

                            <li className={styles.filterBlock}>
                                <label className={styles.labelInfoSearch}>Creativity Type:</label>
                                <select 
                                    id="creativityTypeFilter" 
                                    className={styles.filterSearch} 
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

                            <li className={styles.filterBlock}>
                                <label className={styles.labelInfoSearch}>Project status:</label>
                                <select 
                                    id="orderByStatus" 
                                    className={styles.filterSearch} 
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Finished</option>
                                    <option>Work in progress</option>
                                    <option>Need help</option>
                                </select>
                            </li>

                            <li className={styles.filterBlock}>
                                <label className={styles.labelInfoSearch}>Order by:</label>
                                <select 
                                    id="orderByPeople" 
                                    className={styles.filterSearch} 
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
                            onFilterChange={handleFilterChange}
                            windowWidth={windowWidth}
                            currentFilters={filters}
                        />
                    )}
                </ul>
                </header>

                <section className={styles.searchResults}>
                <div className={styles.searchResultsHeader}>
                    <div>
                        <p className={styles.searchEyebrow}>Community library</p>
                        <h1>Explore ideas</h1>
                    </div>
                    <p>{loading ? 'Searching...' : `${ideas.length} result${ideas.length === 1 ? '' : 's'}`}</p>
                </div>
                    <IdeaList ideas={ideas} />
                </section>
            </main>

            <Footer />
        </>
    )
}
