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
                <section className="errorCodeColumn">
                    <p>FreeIdeas / Error</p>
                    <h1>{statusCode}</h1>
                </section>
                <section className="errorContentColumn">
                    <p className="errorEyebrow">Unexpected interruption</p>
                    <h2>Something went wrong.</h2>
                    <p>Please try again later or contact technical support if the issue continues.</p>
                    <a href="/" className="errorAction">Return home</a>
                </section>
            </main>
            
            <Footer />
        </>
    )
}