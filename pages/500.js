import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Error 500 - Internal Server Error"
        }
    }
}

// Main
export default function Page500({ pageTitle }) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />
            
            <Nav randomId={randomIdeaId} />
            
            <main className="errorPageMain">
                <section className="errorCodeColumn">
                    <p>FreeIdeas / Error</p>
                    <h1>500</h1>
                </section>
                <section className="errorContentColumn">
                    <p className="errorEyebrow">Temporary interruption</p>
                    <h2>Internal server error.</h2>
                    <p>Please try again later or contact technical support if the issue continues.</p>
                    <a href="/" className="errorAction">Return home</a>
                </section>
            </main>
            
            <Footer />
        </>
    )
}