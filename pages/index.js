import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'
import { fetchWithTimeout } from '../utils/fetchWithTimeout'
import Link from 'next/link'
import { useRouter } from 'next/router'

// Server-side rendering
export async function getServerSideProps({ res }) {
    let ideas = [];
    
    // Cache SSR response briefly to improve perceived speed
    if (res) {
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    }

    try {
        const response = await fetchWithTimeout('/api/getLastIdeas', {
            headers: { 'Accept': 'application/json' }
        }, 2000);

        const data = await response.json();
        
        const sourceList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

        if (!sourceList || sourceList.length === 0) {
            throw new Error("Empty ideas list");
        }

        ideas = sourceList.map(phpIdea => ({
            id: phpIdea.id,
            title: phpIdea.title,
            author: phpIdea.username,
            image: phpIdea.ideaimage || "./images/FreeIdeas.svg"
        }));
    } catch (error) {
        console.error('Failed to fetch ideas:', error);
        
        // Fallback data in case of API failure
        ideas = Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: `Idea ${i + 1}`,
            author: `Author ${i + 1}`,
            image: `./images/FreeIdeas.svg`
        }));
    }

    // Ensure at least 22 items for all UI slices
    if (ideas.length < 22) {
        const fill = [];

        for (let i = ideas.length; i < 22; i++) {
            const base = ideas[i % (ideas.length || 1)] || { id: i + 1, title: `Idea ${i + 1}`, author: `Author ${i + 1}`, image: `./images/FreeIdeas.svg` };
            
            fill.push({ ...base, id: base.id ?? i + 1 });
        }

        ideas = ideas.concat(fill);
    }

    return {
        props: {
            ideas: ideas,
            pageTitle: ""
        }
    }
}

// Internal functions
function IdeaCard({ idea }) {
    const router = useRouter();
    
    return (
        <li className="ideaBox">
            <Link 
                href={`/idea/${idea.id}`} 
                className="ideaLink" 
                onMouseEnter={() => router.prefetch(`/idea/${idea.id}`)}
            >
                <img src={idea.image || "/images/FreeIdeas.svg"} alt="Idea Image" className="ideaImage" />
                <p className="ideaTitle">{idea.title}</p>
                <p className="ideaAuthor">{idea.author}</p>
            </Link>
        </li>
    )
}

function IdeaList({ ideas, id }) {
    return (
        <ul id={id}>
            {ideas.map((idea, index) => (
                <IdeaCard key={`${id}-${index}`} idea={idea} />
            ))}
        </ul>
    )
}

function ColoredTitle() {
    return (
        <h1>
            A place where <strong>your</strong>{' '}
            <span style={{color: '#ffcf00'}}>I</span>
            <span style={{color: '#f4d54b'}}>d</span>
            <span style={{color: '#e4c53d'}}>e</span>
            <span style={{color: '#c0a634'}}>a</span>
            <span style={{color: '#a28710'}}>s</span>
            {' '}can be{' '}
            <span style={{color: '#59ff97'}}>F</span>
            <span style={{color: '#47dc55'}}>r</span>
            <span style={{color: '#05a814'}}>e</span>
            <span style={{color: '#106d19'}}>e</span>
        </h1>
    )
}

function Banner({ message = "", show = false }) {
    return (
        <div style={{
            backgroundColor: '#ffbf8f',
            width: '100%',
            marginBottom: '15px',
            justifyItems: 'center',
            display: show ? undefined : 'none'
        }}>
            <h1 style={{
                width: 'fit-content',
                textAlign: 'center',
                padding: '10px',
                color: 'black'
            }}>
                {message}
            </h1>
        </div>
    )
}

// Auto-scroll effect
function autoScrollIdeas() {
    useEffect(() => {
        let currentScrollMode = true;

        const startAutoScroll = () => {
            const vertical = window.innerWidth > 760;

            currentScrollMode = vertical;

            const lastIdeas1 = document.getElementById("lastIdeasVertical1");
            const lastIdeas2 = document.getElementById("lastIdeasVertical2");
            const lastIdeas3 = document.getElementById("lastIdeasHorizontal");
            const lastIdeas4 = document.getElementById("inspirationalUl");

            if (!lastIdeas1 || !lastIdeas2 || !lastIdeas3 || !lastIdeas4) {
                return;
            }

            // Clone content for infinite scroll
            if (!lastIdeas1.dataset.cloned) {
                lastIdeas1.innerHTML += lastIdeas1.innerHTML;
                lastIdeas2.innerHTML += lastIdeas2.innerHTML;  
                lastIdeas3.innerHTML += lastIdeas3.innerHTML;
                lastIdeas4.innerHTML += lastIdeas4.innerHTML;

                lastIdeas1.dataset.cloned = "true";
                lastIdeas2.dataset.cloned = "true";
                lastIdeas3.dataset.cloned = "true";
                lastIdeas4.dataset.cloned = "true";
            }

            // Scroll functions
            function scrollVertical(element, direction) {
                let scrollAmount = direction?0:element.scrollHeight / 2;
                const speed = 1.5;

                function autoScroll() {
                    scrollAmount += (direction?1:-1) * speed;
                    
                    if (direction && scrollAmount >= element.scrollHeight / 2) {
                        scrollAmount = 0;
                    }
                    else if (!direction && scrollAmount < 0) {
                        scrollAmount = element.scrollHeight / 2;
                    }
                    
                    element.scrollTop = scrollAmount;
                    requestAnimationFrame(autoScroll);
                }

                autoScroll();
            };

            function scrollHorizontal(element, direction) {
                let scrollAmount = direction?0:element.scrollWidth / 2;
                const speed = 1.5;

                function autoScroll() {
                    scrollAmount += (direction?1:-1) * speed;
                    
                    if (direction && scrollAmount >= element.scrollWidth / 2) {
                        scrollAmount = 0;
                    }
                    else if (!direction && scrollAmount < 0) {
                        scrollAmount = element.scrollWidth / 2;
                    }
                    
                    element.scrollLeft = scrollAmount;
                    requestAnimationFrame(autoScroll);
                }

                autoScroll();
            };

            // Apply scrolling based on screen size
            if (vertical) {
                scrollVertical(lastIdeas1, true);
                scrollVertical(lastIdeas2, false);
            }
            else {
                scrollHorizontal(lastIdeas1, false);
                scrollHorizontal(lastIdeas2, true);
            }

            scrollHorizontal(lastIdeas3, false);
            scrollHorizontal(lastIdeas4, true);
        };

        // Start after component mount
        setTimeout(startAutoScroll, 100);

        // Handle window resize
        function handleResize() {
            const scrollMode = window.innerWidth>760;

            if (scrollMode != currentScrollMode) {
                startAutoScroll();
            }
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);
}

// Main
export default function HomePage({ ideas, pageTitle }) {
    const { randomIdeaId, bannerMessage, showBanner } = useAppContext();
    
    autoScrollIdeas();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />
            
            <header>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    padding: '20px 0 20px 0'
                }}>
                    <Banner message={bannerMessage} show={showBanner} />
                    <ColoredTitle />
                </div>
            </header>

            <main id="indexMain">
                <section id="whatisFreeIdeas">
                    <IdeaList ideas={ideas.slice(0, 6)} id="lastIdeasVertical1" />

                    <section id="middleTextSection">
                        <h1>
                            Welcome to{' '}
                            <span style={{color: '#59ff97'}}>F</span>
                            <span style={{color: '#47dc55'}}>r</span>
                            <span style={{color: '#05a814'}}>e</span>
                            <span style={{color: '#106d19'}}>e</span>
                            <span style={{color: '#ffcf00'}}>I</span>
                            <span style={{color: '#f4d54b'}}>d</span>
                            <span style={{color: '#e4c53d'}}>e</span>
                            <span style={{color: '#c0a634'}}>a</span>
                            <span style={{color: '#a28710'}}>s</span>!
                        </h1>

                        <h2>What is FreeIdeas?</h2>
                        <p className="description">
                            FreeIdeas is a platform where you can share ideas for any type of project — creative, technical, personal, or collaborative — and find inspiration for your next venture.
                            <br />
                            You can search for ideas, publish your own, ask for help with yours, or simply browse other people's ideas.
                            <br />
                            The ideas published are free and you can use them as you wish, without any restrictions (except those mentioned in the license section).
                            <br />
                            The site is open to everyone, and you can contribute by publishing your own ideas or helping others with theirs.
                            <br />
                            The goal of FreeIdeas is to create a community of people who share their ideas and help each other bring them to life.
                            <br />
                            Whether you have an idea you want to share with the world or are looking for inspiration for your next project, FreeIdeas is the place for you.
                            <br />
                            <strong>Join us and start sharing your ideas today!</strong>
                        </p>
                    </section>

                    <IdeaList ideas={ideas.slice(6, 12)} id="lastIdeasVertical2" />
                </section>

                <section id="horizzontalBarSeparatorSection">
                    <IdeaList ideas={ideas.slice(12, 22)} id="lastIdeasHorizontal" />
                </section>

                <section id="imagesSectionHome">
                    <h1>How FreeIdeas Works</h1>
                    <ul id="imagesUl">
                        <li className="imageInfoLiHome">
                            <img src="/images/searchPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                            <div>
                                <h1>Explore Ideas</h1>
                                <p>Discover hundreds of original ideas for every type of project: creative, technical, personal, or collaborative. Draw inspiration from the most original or find inspiration for your next venture! On FreeIdeas, every idea has its own special place!</p>
                            </div>
                        </li>

                        <li className="imageInfoLiHome">
                            <img src="/images/publishPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                            <div>
                                <h1>Publish Your Own Ideas</h1>
                                <p>Share your ideas freely, easily, and without restrictions. No approvals or complicated steps are required. You can post any idea you have without being judged. Even the most diverse ideas can find a place on FreeIdeas.</p>
                            </div>
                        </li>

                        <li className="imageInfoLiHome">
                            <img src="/images/helpPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                            <div>
                                <h1>Collaborate with Other Creatives</h1>
                                <p>Great ideas don't grow on their own. On FreeIdeas, you can ask for help, find collaborators, or offer your assistance. Because sharing an idea is just the beginning.</p>
                            </div>
                        </li>

                        <li className="imageInfoLiHome lastImageInfoLi">
                            <img src="/images/ideaPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                            <div>
                                <h1>Make it Real</h1>
                                <p>You don't need permission to be creative. On FreeIdeas, every idea matters: big or small, bold or simple. This is where your imagination finds a home. Every idea deserves a place, and FreeIdeas is the right place for yours.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section id="inspirationalSection">
                    <ul id="inspirationalUl">
                        <li className="ideaBox">
                            <h2>Ideas are what move the world forward.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Ideas deserve freedom. Not judgment. Not silence.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>We believe that creativity grows when it's shared.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>FreeIdeas exists because imagination deserves to be shared.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Whether your idea is simple or revolutionary, there's room for it here.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>No judgments. No filters. Just ideas.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Your ideas don't need permission to exist.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Originality starts with the courage to share.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Every idea is a seed. Sharing is planting.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>There are no wrong ideas. Just untold ones.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>You don’t need an audience — just a voice.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>FreeIdeas is where thinking out loud becomes a movement.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Ideas aren’t meant to be stored. They’re meant to be set free.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Don't wait for perfect. Share what's real.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>The world doesn't need more content. It needs more ideas.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Sharing an idea is the first step toward changing something.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Some ideas are quiet. But even quiet ideas deserve to be heard.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>Free thinking isn’t just allowed. It’s celebrated.</h2>
                        </li>

                        <li className="ideaBox">
                            <h2>This is where your thoughts stop being just yours.</h2>
                        </li>
                    </ul>
                </section>

                <section id="sloganFreeIdeasHome">
                    <img src="/images/FreeIdeas.svg" alt="FreeIdeas logo" className="logo" />
                    <ColoredTitle />
                </section>
            </main>

            <Footer />
        </>
    )
}