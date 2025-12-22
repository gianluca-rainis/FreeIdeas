import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Main
export default function FeedbackPage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>Feedback</h1>
                <section>
                    <form action="" method="post" id="feedbackForm">
                        <label htmlFor="feedbackTitle">Title:</label>
                        <textarea type="text" placeholder="Feedback Title" name="title" id="feedbackTitle" required></textarea>
                        <label htmlFor="feedbackDescription">Description:</label>
                        <textarea type="text" placeholder="Feedback Body" name="description" id="feedbackDescription" required></textarea>

                        <input type="submit" value="Send Feedback" />
                    </form>
                </section>
                <section>
                    <p>All feedback submitted in this section is anonymous and cannot be traced back to the person or account that posted it. We encourage you to submit only relevant and appropriate feedback.</p>
                    <p>By submitting feedback, you help us improve FreeIdeas. Please be as detailed as possible in your descriptions.</p>
                    <p>Please remember that by sending us feedback you agree to the <a href="./termsOfUse">Terms of Use</a> and <a href="./privacyPolicy">Privacy Policy</a>.</p>
                    <p>You can also give us feedback by <a href="./contacts">contacting us</a> using the methods described in the appropriate section.</p>
                </section>
            </main>

            <Footer />
        </>
    )
}