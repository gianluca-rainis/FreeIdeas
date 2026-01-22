import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Contact Us"
        }
    }
}

// Main
export default function ContactsPage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>Contacts</h1>
                <p>
                    If you have any questions, suggestions, or just want to say hello, feel free to reach out!
                </p>
                <p>
                    You can contact us via email at: <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>
                </p>
                <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className="logo" />
            </main>

            <Footer />
        </>
    )
}