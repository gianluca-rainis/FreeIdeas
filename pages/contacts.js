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
                    If you want to report inappropriate content, you can do so using the appropriate button on the idea or account page.
                </p>
                <p>
                    If you want to give us feedback on your experience on the site, report a bug or suggest improvements, you can send feedback via the <a href='/feedback'>feedback</a> page.
                </p>
                <p>
                    You can contact us by email at the following addresses:
                    <ul>
                        <li>For general questions and communications: <a href="mailto:freeideas@freeideas.pro">freeideas@freeideas.pro</a></li>
                        <li>To obtain technical support, to ask questions of any kind, and to provide feedback and information useful for improving the site: <a href="mailto:customer_service@freeideas.pro">customer_service@freeideas.pro</a></li>
                        <li>To contact the site administrator directly (use only in case of serious need): <a href="mailto:administrator@freeideas.pro">administrator@freeideas.pro</a></li>
                    </ul>
                </p>
                <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className="logo" />
            </main>

            <Footer />
        </>
    )
}