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
export default function Page404({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />
            
            <Nav randomId={randomIdeaId} />
            
            <main id="page404Main">
                <h1>Error 404</h1>
                <h2>Page not found</h2>
                <p>
                    We're sorry, but the page you're looking for doesn't exist or has moved.
                </p>
            </main>
            
            <Footer />
        </>
    )
}