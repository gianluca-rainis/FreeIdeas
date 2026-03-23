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
                <h1>About Us</h1>
                <p>
                    Welcome to FreeIdeas! This project is a collection of free ideas for projects, apps, and websites that you can use to get inspired or to start your own project. The ideas are organized by category and are meant to be a starting point for your own creativity.
                </p>
                <p>
                    The project is open source and you can contribute by adding your own ideas or improving the existing ones. You can also use the ideas in your own projects, as long as you give credit to the original author.
                </p>
                <p>
                    We believe that sharing ideas is a great way to foster creativity and innovation, and we hope that this project will inspire you to create something amazing.
                </p>
                <p>
                    The people behind this project are passionate about technology, design, and creativity. We are always looking for new ideas and ways to improve the project, so feel free to reach out if you have any suggestions or feedback.
                </p>
                <p>
                    Thank you for visiting FreeIdeas, and we hope you find something that inspires you!
                </p>

                <h2>The FreeIdeas Project Presentation</h2>
                <p>
                    Here you can find the complete official Presentation of the FreeIdeas Project.
                    <br />
                    The Presentation is available in English and Italian, in PPTX and PDF formats.
                </p>
                <ul>
                    <li><a href="/files/FreeIdeas_project.pptx" download="">FreeIdeas Project Presentation</a></li>
                    <li><a href="/files/FreeIdeas_project_it.pptx" download="">FreeIdeas Project Presentation (Italian Version)</a></li>
                    <li></li>
                    <li><a href="/files/FreeIdeas_project.pdf" download="">FreeIdeas Project Presentation PDF</a></li>
                    <li><a href="/files/FreeIdeas_project_it.pdf" download="">FreeIdeas Project Presentation PDF (Italian Version)</a></li>
                </ul>
                <p>
                    Here you can find the short official Presentation of the FreeIdeas Project.
                </p>
                <ul>
                    <li><a href="/files/FreeIdeas_project_short.pptx" download="">FreeIdeas Project Short Presentation</a></li>
                    <li><a href="/files/FreeIdeas_project_short_it.pptx" download="">FreeIdeas Project Short Presentation (Italian Version)</a></li>
                    <li></li>
                    <li><a href="/files/FreeIdeas_project_short.pdf" download="">FreeIdeas Project Short Presentation PDF</a></li>
                    <li><a href="/files/FreeIdeas_project_short_it.pdf" download="">FreeIdeas Project Short Presentation PDF (Italian Version)</a></li>
                </ul>

                <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className ="logo" />
            </main>

            <Footer />
        </>
    )
}