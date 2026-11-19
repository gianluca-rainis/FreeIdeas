import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Error 404 - Page not Found"
        }
    }
}

// Main
export default function Page404({ pageTitle }) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />
            
            <Nav randomId={randomIdeaId} />
            
            <main className="errorPageMain">
                <section className="errorCodeColumn">
                    <p>FreeIdeas / Error</p>
                    <h1>404</h1>
                </section>
                <section className="errorContentColumn">
                    <p className="errorEyebrow">Nothing found here</p>
                    <h2>Page not found.</h2>
                    <p>This address may have moved or never existed.</p>
                    <a href="/" className="errorAction">Return home</a>
                </section>
            </main>
            
            <Footer />
        </>
    )
}