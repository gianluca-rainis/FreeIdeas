import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "About"
        }
    }
}

// Main
export default function AboutPage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>About FreeIdeas</h1>
                <p>
                    FreeIdeas is a platform built to give everyone a free and open space to publish, share, and showcase their ideas -
                    no matter what they are. Whether an idea is ready to be built tomorrow or simply a spark of imagination,
                    every contribution is equally valued and equally visible.
                    The homepage highlights the latest 22 ideas, and the search page sorts results in reverse chronological order,
                    ensuring every creator has the same opportunity to be discovered.
                </p>
                <p>
                    Our mission is to promote <strong>freedom of expression</strong> and <strong>digital inclusion</strong>,
                    fostering an international community where creative people can share ideas and support one another in
                    bringing them to life - constructively and positively. The platform is in English to allow anyone,
                    anywhere in the world, to participate freely.
                </p>
                <p>
                    As the community grows, we also expect sub-communities to emerge in other languages,
                    ensuring that people who are not comfortable with English are never left out.
                </p>

                <h2>Graphic Identity</h2>
                <p>
                    The name <em>FreeIdeas</em> means exactly what it says: a space where ideas are free.
                    The logo pairs the word <em>Free</em> in shades of green - symbolising vitality, energy, and growth -
                    with the word <em>Ideas</em> in shades of yellow, evoking gold: something precious and one of a kind.
                    The design communicates care, creativity, and openness: even a rough, unfinished idea has value here.
                </p>
                <p>
                    Our official tagline is:<br />
                    <strong>"A place where your Ideas can be Free"</strong><br />
                    - chosen to put contributors at the centre. This platform exists because of its users' ideas,
                    and it is built to celebrate them without limits.
                </p>

                <h2>How FreeIdeas Works</h2>
                <p>
                    FreeIdeas offers a modern, intuitive, and fully public platform: every idea can be viewed,
                    commented on, and used as a source of inspiration. The experience includes:
                </p>
                <ul>
                    <li>Advanced search with filters and sorting options</li>
                    <li>A publishing page with cover image, description, license, updates, and external links</li>
                    <li>A dedicated page for each idea, with a clear and consistent layout</li>
                    <li>A public or private profile page for every author, at their own discretion</li>
                </ul>

                <h2>Privacy &amp; Safety</h2>
                <p>
                    FreeIdeas is built with user privacy in mind. Every account is private by default,
                    and only the author can choose to make it public. Public accounts get their own dedicated profile page,
                    while private accounts remain completely hidden from other users.
                </p>
                <p>
                    To maintain a healthy and respectful environment, FreeIdeas prohibits the publication of any content
                    that is illegal, offensive, defamatory, discriminatory, malicious, or in violation of intellectual property rights.
                    In the event of a breach, the administration reserves the right to intervene, up to and including
                    permanent account removal.
                </p>

                <h2>Intellectual Property</h2>
                <p>
                    FreeIdeas protects the intellectual property of its creators by requiring a license for every published idea.
                    Authors can choose the <strong>FreeIdeas License</strong> - designed for non-commercial use,
                    freely shareable, and modifiable for personal or educational purposes only -
                    or upload a custom license in PDF format.
                </p>

                <h2>Community &amp; Interaction</h2>
                <p>
                    Every idea includes a comment section for constructive discussion and feedback.
                    The system supports an unlimited number of comments and nested replies, and is designed so that
                    when a comment is deleted, only its content is removed - preserving the integrity of the conversation thread.
                </p>
                <p>
                    A notification system keeps users informed about updates to ideas they follow,
                    new publications from profiles they follow, and any changes to their own account.
                </p>

                <h2>Reserved Area</h2>
                <p>
                    The administration panel is accessible only through a five-password authentication process,
                    allowing the team to manage all platform content: accounts, ideas, notifications, and reports.
                    Creating a new administrator account requires physical access to the server.
                </p>

                <h2>Accessibility &amp; Responsive Design</h2>
                <p>
                    FreeIdeas is fully responsive and works seamlessly on smartphones and tablets,
                    with no loss of functionality across any device or screen size.
                </p>

                <h2>Official Presentations</h2>
                <p>
                    Download the full project presentation in PPTX or PDF format, available in both English and Italian.
                </p>
                <ul>
                    <li><a href="/files/FreeIdeas_project.pptx" download>FreeIdeas Project Presentation</a></li>
                    <li><a href="/files/FreeIdeas_project_it.pptx" download>FreeIdeas Project Presentation (Italian Version)</a></li>
                    <li><a href="/files/FreeIdeas_project.pdf" download>FreeIdeas Project Presentation PDF</a></li>
                    <li><a href="/files/FreeIdeas_project_it.pdf" download>FreeIdeas Project Presentation PDF (Italian Version)</a></li>
                </ul>
                <p>
                    Short versions are also available:
                </p>
                <ul>
                    <li><a href="/files/FreeIdeas_project_short.pptx" download>FreeIdeas Project Short Presentation</a></li>
                    <li><a href="/files/FreeIdeas_project_short_it.pptx" download>FreeIdeas Project Short Presentation (Italian Version)</a></li>
                    <li><a href="/files/FreeIdeas_project_short.pdf" download>FreeIdeas Project Short Presentation PDF</a></li>
                    <li><a href="/files/FreeIdeas_project_short_it.pdf" download>FreeIdeas Project Short Presentation PDF (Italian Version)</a></li>
                </ul>

                <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className="logo" />
            </main>

            <Footer />
        </>
    )
}