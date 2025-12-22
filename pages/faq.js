import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Main
export default function FaqPage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>FAQ</h1>

                <ul id="faqUl">
                    <li>
                        <div className="question">What is FreeIdeas?</div>
                        <div className="answer">
                            FreeIdeas is a platform where you can share your ideas for projects, apps, or websites, and get inspired by other users’ creativity. 
                            It’s a place to exchange and grow ideas freely.
                        </div>
                    </li>
                    <li>
                        <div className="question">How can I use FreeIdeas?</div>
                        <div className="answer">
                            You can browse published ideas, post your own, ask for feedback or help, and collaborate with others on existing projects.
                        </div>
                    </li>
                    <li>
                        <div className="question">Is my account information safe?</div>
                        <div className="answer">
                            We store your data securely in our local database and never share it with third parties. 
                            Passwords are encrypted, while other account details are stored in clear text. 
                            Your personal information is visible only if you choose to make your profile public.
                        </div>
                    </li>
                    <li>
                        <div className="question">Are the ideas posted free to use?</div>
                        <div className="answer">
                            Each idea on FreeIdeas is released under a license — either the FreeIdeas License or a custom license defined by the author. 
                            The <a href="./FreeIdeasLicense.md">FreeIdeas License</a> allows anyone to use, modify, and share ideas freely for non-commercial, educational, or creative purposes. 
                            If an idea has a different license, it will be clearly shown on its page.
                        </div>
                    </li>
                    <li>
                        <div className="question">Do I need an account to post or collaborate?</div>
                        <div className="answer">
                            Yes. You need to create an account to post your ideas or actively collaborate with others.
                        </div>
                    </li>
                    <li>
                        <div className="question">Can I post any kind of idea?</div>
                        <div className="answer">
                            Generally yes — creative, technical, personal, or collaborative ideas are all welcome. 
                            However, you must follow our <a href="./termsOfUse.php">Terms of Use</a> and avoid illegal, offensive, or copyrighted content if you don’t own the rights.
                        </div>
                    </li>
                    <li>
                        <div className="question">How can I edit or delete an idea I’ve posted?</div>
                        <div className="answer">
                            Log in to your account, go to your profile, select the idea, and choose to edit or delete it. 
                            If you search for your idea while logged in, an “Edit” button will also appear on the idea’s page.
                        </div>
                    </li>
                    <li>
                        <div className="question">Where can I find support or contact the FreeIdeas team?</div>
                        <div className="answer">
                            You can reach us through the “Contact Us” section in the site footer or by email at <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>.
                        </div>
                    </li>
                    <li>
                        <div className="question">Who can use FreeIdeas and what are the age restrictions?</div>
                        <div className="answer">
                            FreeIdeas is designed for everyone — creators, developers, and thinkers of all ages. 
                            However, to comply with privacy and data protection laws, users under 18 must have verifiable parental consent before creating an account or posting content. 
                            Parents or guardians can contact us for more information as described in our <a href="./privacyPolicy.php">Privacy Policy</a>.
                        </div>
                    </li>
                    <li>
                        <div className="question">What happens to my personal data and what rights do I have?</div>
                        <div className="answer">
                            FreeIdeas collects the data you provide (such as account info and submitted content) and some usage data automatically 
                            (like IP address, browser type, and access logs). 
                            These data are used to manage your account, improve the Service, enable user interactions, and comply with legal obligations. 
                            You have the right to access, correct, delete, or export your data, and to object to or restrict its processing, in accordance with applicable law.
                        </div>
                    </li>
                    <li>
                        <div className="question">How long does FreeIdeas keep my data?</div>
                        <div className="answer">
                            Your data is kept until you delete your account or remove your content, unless a longer retention period is required by law.
                        </div>
                    </li>
                </ul>

                <p>
                    If you have any questions not answered here, feel free to contact us at <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>.
                </p>
            </main>

            <Footer />
        </>
    )
}