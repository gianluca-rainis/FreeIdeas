import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
GenericError.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : (err ? err.statusCode : 404);

    return {
        pageTitle: `Error ${statusCode?statusCode:""}`,
        statusCode: statusCode
    };
}

// Main
export default function GenericError({ pageTitle, statusCode }) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />
            
            <Nav randomId={randomIdeaId} />
            
            <main className="errorPageMain">
                <h1>Error {statusCode}</h1>
                <h2>Generic Error</h2>
                <p>
                    We're sorry, but we've encountered an unexpected error. Please try again later. If the problem persists, please contact technical support.
                </p>
            </main>
            
            <Footer />
        </>
    )
}