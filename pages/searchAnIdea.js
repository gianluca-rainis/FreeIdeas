import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Main
export default function SearchAnIdeaPage({ ideas, pageTitle }) {
    const { themeIsLight, user, randomIdeaId, bannerMessage, showBanner } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />
            
            <header>
                <input type="search" placeholder="Search" id="search" />

                <ul id="allFilters">
                    <li className="filterBlock">
                        <label className="labelInfoSearch">Type of project:</label>
                        <select id="typeFilter" className="filterSearch">
                            <option selected>All</option>
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
                        <select id="creativityTypeFilter" className="filterSearch">
                            <option selected>All</option>
                            <option>Practical and actionable</option>
                            <option>Abstract or conceptual</option>
                            <option>Thought-provoking</option>
                            <option>Visionary or futuristic</option>
                            <option>Humorous or satirical</option>
                        </select>
                    </li>

                    <li className="filterBlock">
                        <label className="labelInfoSearch">Project status:</label>
                        <select id="orderByStatus" className="filterSearch">
                            <option selected>All</option>
                            <option>Finished</option>
                            <option>Work in progress</option>
                            <option>Need help</option>
                        </select>
                    </li>

                    <li className="filterBlock">
                        <label className="labelInfoSearch">Order by:</label>
                        <select id="orderByPeople" className="filterSearch">
                            <option selected>All</option>
                            <option>Most voted</option>
                            <option>Newest</option>
                            <option>Most discussed</option>
                        </select>
                    </li>
                </ul>
            </header>

            <main>
                <ul id="lastIdeasSrc">
                    
                </ul>
            </main>

            <Footer />
        </>
    )
}