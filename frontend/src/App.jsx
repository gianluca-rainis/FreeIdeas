import React, { useState, useEffect } from 'react'

function IdeaCard({ idea }) {
    return (
        <li className="ideaBox">
            <a href={`/ideaVoid.php?idea=${idea.id}`} className="ideaLink">
                <img src={idea.image || "/images/FreeIdeas.svg"} alt="Idea Image" className="ideaImage" />
                <p className="ideaTitle">{idea.title}</p>
                <p className="ideaAuthor">{idea.author}</p>
            </a>
        </li>
    )
}

function IdeaList({ ideas, id }) {
    return (
        <ul id={id}>
            {
                ideas.map((idea, index) => (
                    <IdeaCard key={ `${id}-${index}` } idea={idea} />
                ))
            }
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
            display: show?undefined:'none'
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

// Main - App
function App() {
    const [ideas, setIdeas] = useState([])
    const [loading, setLoading] = useState(true)

    // Load ideas
    useEffect(() => {
        async function fetchIdeas() {
            try {
                const response = await fetch('/api/getLastIdeas.php')
                const data = await response.json()
                
                if (data && data.length > 0) {
                    setIdeas(data)
                }
                else {
                    setIdeas(generateMockIdeas(10))
                }
            } catch (error) {
                console.error('Error:', error)
                setIdeas(generateMockIdeas(10))
            } finally {
                setLoading(false)
            }
        }

        fetchIdeas()
    }, [])

    // Placeholder
    function generateMockIdeas(count) {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            title: `Placeholder`,
            author: `FreeIdeas`,
            image: `/images/FreeIdeas.svg`
        }))
    }

    if (loading) {
        return <div>Loading ideas...</div>
    }

    return (
        <>
        <section id="whatisFreeIdeas">
            <IdeaList 
                ideas={ideas.slice(0, 6)} 
                id="lastIdeasVertical1" 
            />

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
                    <br /><br />
                    You can search for ideas, publish your own, ask for help with yours, or simply browse other people's ideas.
                    <br /><br />
                    <strong>Join us and start sharing your ideas today!</strong>
                </p>
            </section>

            <IdeaList 
                ideas={ideas.slice(6, 12)} 
                id="lastIdeasVertical2" 
            />
        </section>

        <section id="horizzontalBarSeparatorSection">
            <IdeaList 
                ideas={ideas.slice(0, 10)} 
                id="lastIdeasHorizontal" 
            />
        </section>

        <section id="imagesSectionHome">
            <h1>How FreeIdeas Works</h1>
            <ul id="imagesUl">
                <li className="imageInfoLiHome">
                    <img src="/images/searchPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                    <div>
                        <h1>Explore Ideas</h1>
                        <p>Discover hundreds of original ideas for every type of project: creative, technical, personal, or collaborative.</p>
                    </div>
                </li>
                <li className="imageInfoLiHome">
                    <img src="/images/publishPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                    <div>
                        <h1>Publish Your Own Ideas</h1>
                        <p>Share your ideas freely, easily, and without restrictions.</p>
                    </div>
                </li>
                <li className="imageInfoLiHome">
                    <img src="/images/helpPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                    <div>
                        <h1>Collaborate with Other Creatives</h1>
                        <p>Great ideas don't grow on their own. Find collaborators and offer assistance.</p>
                    </div>
                </li>
                <li className="imageInfoLiHome lastImageInfoLi">
                    <img src="/images/ideaPreview.png" alt="Image of FreeIdeas info" className="imageHome" />
                    <div>
                        <h1>Make it Real</h1>
                        <p>Every idea matters: big or small, bold or simple.</p>
                    </div>
                </li>
            </ul>
        </section>

        <section id="sloganFreeIdeasHome">
            <img src="/images/FreeIdeas.svg" alt="FreeIdeas logo" className="logo" />
            <ColoredTitle />
        </section>
        </>
    )
}

export default App