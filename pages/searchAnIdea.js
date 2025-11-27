import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

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

// Server-side rendering for initial data
export async function getServerSideProps() {
    return {
        props: {
            pageTitle: "Search an Idea"
        }
    }
}

// Main
export default function SearchAnIdeaPage({ pageTitle }) {
    const { themeIsLight, user, randomIdeaId, bannerMessage, showBanner } = useAppContext();
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search
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

            const response = await fetch('/api/searchAnIdea.php', {
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
                        link: `/accountVoid/${phpIdea.id}`,
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
                link: `/ideaVoid/${i + 1}`,
                title: `Idea ${i + 1}`,
                author: `Author ${i + 1}`,
                image: "/images/FreeIdeas.svg"
            })));
        } finally {
            setLoading(false);
        }
    };

    // Carica le idee iniziali
    useEffect(() => {
        searchIdeas();
    }, []);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />
            
            <header style={{padding: "20px 0 20px 0"}}>
                <input type="search" placeholder="Search" id="search" onChange={searchIdeas} />

                <ul id="allFilters">
                    <li className="filterBlock">
                        <label className="labelInfoSearch">Type of project:</label>
                        <select id="typeFilter" className="filterSearch" defaultValue={"All"} onChange={searchIdeas}>
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
                        <select id="creativityTypeFilter" className="filterSearch" defaultValue={"All"} onChange={searchIdeas}>
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
                        <select id="orderByStatus" className="filterSearch" defaultValue={"All"} onChange={searchIdeas}>
                            <option>All</option>
                            <option>Finished</option>
                            <option>Work in progress</option>
                            <option>Need help</option>
                        </select>
                    </li>

                    <li className="filterBlock">
                        <label className="labelInfoSearch">Order by:</label>
                        <select id="orderByPeople" className="filterSearch" defaultValue={"All"} onChange={searchIdeas}>
                            <option>All</option>
                            <option>Most voted</option>
                            <option>Newest</option>
                            <option>Most discussed</option>
                        </select>
                    </li>
                </ul>
            </header>

            <main>
                <IdeaList ideas={ideas} />
            </main>

            <Footer />
        </>
    )
}