import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps() {
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
                <img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" className ="logo" />
            </main>

            <Footer />
        </>
    )
}