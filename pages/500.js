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
                <h1>Error 500</h1>
                <h2>Internal Server Error</h2>
                <p>
                    We're sorry, but we encountered a server error. Please try again later. If the problem persists, please contact technical support.
                </p>
            </main>
            
            <Footer />
        </>
    )
}