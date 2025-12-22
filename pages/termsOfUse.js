import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps() {
    return {
        props: {
            pageTitle: "Terms of Use"
        }
    }
}

// Main
export default function TermsOfUsePage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>Terms and Conditions</h1>
                <p>Last updated: October 27, 2025</p>
                <p>Please read these Terms and Conditions carefully before using Our Service.</p>

                <h2>Interpretation and Definitions</h2>
                <h3>Interpretation</h3>
                <p>Words with the initial letter capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.</p>

                <h3>Definitions</h3>
                <ul>
                    <li><p><strong>Account</strong> means a unique account created for You to access Our Service or parts of Our Service.</p></li>
                    <li><p><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to FreeIdeas.</p></li>
                    <li><p><strong>Country</strong> refers to: Italy.</p></li>
                    <li><p><strong>Content</strong> means any text, images, or other material that You upload, post, or otherwise make available through the Service.</p></li>
                    <li><p><strong>Device</strong> means any device that can access the Service, such as a computer, mobile phone, or tablet.</p></li>
                    <li><p><strong>Service</strong> refers to the Website, FreeIdeas, accessible from <a href="https://freeideas.duckdns.org/" target="_blank" rel="noopener">https://freeideas.duckdns.org/</a>.</p></li>
                    <li><p><strong>You</strong> means the individual accessing or using the Service, or the company or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p></li>
                </ul>

                <h2>Acknowledgment</h2>
                <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
                <p>By accessing or using the Service, You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms, You may not access the Service.</p>
                <p>You represent that You are either (i) at least 18 years old, or (ii) between 14 and 17 years old and have obtained verifiable consent from a parent or legal guardian to use the Service. The Company reserves the right to request proof of parental consent at any time. Parents or legal guardians providing consent are fully responsible for the minor’s use of the Service and for any actions or content submitted by the minor account.</p>

                <h2>Accounts</h2>
                <p>When You create an account with Us, You must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account.</p>
                <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.</p>
                <p>Passwords are securely stored in encrypted form and are never accessible in plain text to the Company or its administrators.</p>
                <p>You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.</p>

                <h2>User-Generated Content</h2>
                <p>You may post, upload, or otherwise share Content through the Service. You retain all rights to any Content You submit, post, or display on or through the Service.</p>
                <p>However, by posting Content, You grant Us a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, display, reproduce, and distribute such Content solely in connection with the operation and promotion of the Service.</p>
                <p>You represent and warrant that: (i) You own or have the necessary rights to the Content You post; (ii) the posting of Your Content does not violate any rights of privacy, publicity, copyright, or other proprietary rights of any person.</p>
                <p>The Company reserves the right, but not the obligation, to monitor, review, and remove any Content deemed inappropriate, illegal, or in violation of these Terms.</p>

                <h2>Acceptable Use</h2>
                <p>You agree not to use the Service to post or share any Content that:</p>
                <ul>
                    <li>Is illegal, offensive, defamatory, or discriminatory;</li>
                    <li>Infringes upon the intellectual property or privacy rights of others;</li>
                    <li>Contains malware, viruses, or other harmful software;</li>
                    <li>Is intended to harass, threaten, or impersonate another person or entity.</li>
                </ul>
                <p>Violation of these rules may result in immediate suspension or termination of Your Account.</p>

                <h2>Intellectual Property</h2>
                <p>Except for Content provided by users, the Service and its original content, design, layout, source code, and functionality are and will remain the exclusive property of the Company and its licensors.</p>
                <p>The entire website, including its structure and code, is licensed under the <strong>FreeIdeas License</strong>, available for review in the footer of the website. By using the Service, You agree to respect the terms and conditions of the FreeIdeas License as published and periodically updated on the official website.</p>
                <p>The trademarks, logos, and other marks displayed on the Service are the property of the Company or their respective owners. You may not use them without prior written permission.</p>
                <p>The Company does not claim ownership of any Content submitted by users. Each user is solely responsible for the ideas and materials they share through the Service. By submitting Content, You acknowledge that Your ideas are made publicly available and may be viewed, shared, or independently developed by others. The Company does not guarantee the confidentiality, originality, or exclusivity of any idea published on the Service.</p>

                <h2>Disclaimer on Ideas and User Interactions</h2>
                <p>The Service allows users to share their ideas publicly. The Company does not claim ownership of these ideas and does not guarantee their originality, confidentiality, or protection against misuse by other users. By posting on FreeIdeas, You understand and accept that Your ideas may be visible to others and may be reused, commented on, or developed independently by other users.</p>
                <p>The Company shall not be held responsible for any disputes or damages arising from interactions between users or from the publication, use, or misuse of user-generated ideas.</p>

                <h2>Data Management and Administrative Rights</h2>
                <p>The Company reserves the full right to modify, restrict, or permanently delete any Content or data belonging to any user, at its sole discretion, when deemed necessary for technical, security, legal, or moderation reasons. This includes user-generated posts, images, comments, or any other data published on the Service.</p>
                <p>User passwords are securely encrypted and cannot be modified or viewed by the Company or the administrator in plain text.</p>
                <p>Except in cases of severe or urgent violations, the administrator will make reasonable efforts to notify the affected user account before taking any action that involves partial or full removal of the user’s data or the termination of the account. In the event of serious breaches (including, but not limited to, illegal activity, harassment, or malicious behavior), the Company reserves the right to act without prior notice.</p>

                <h2>Termination</h2>
                <p>We may terminate or suspend Your Account immediately, without prior notice, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
                <p>Upon termination, Your right to use the Service will cease immediately, and We may delete or disable access to Your Content at Our discretion, in accordance with the principles outlined above.</p>

                <h2>Moderation and Reporting Policy</h2>
                <p>The Company reserves the right to review and moderate all Content submitted to the Service. Users may report inappropriate or illegal Content through the contact email provided. The Company will review such reports and may take actions including removal of Content, suspension, or deletion of user accounts when necessary to protect the integrity of the Service or comply with legal obligations.</p>

                <h2>Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from (i) Your access to or use of the Service; (ii) any conduct or Content of any third party on the Service; (iii) any Content obtained from the Service; and (iv) unauthorized access, use, or alteration of Your transmissions or Content.</p>

                <h2>Service Availability and Maintenance</h2>
                <p>The Company may temporarily suspend access to the Service for maintenance, updates, or technical issues. The Company does not guarantee uninterrupted availability of the Service and shall not be held liable for temporary downtime or data loss resulting from maintenance or technical failures.</p>

                <h2>Feedback and Suggestions</h2>
                <p>If You provide feedback, suggestions, or ideas to improve the Service, You agree that such input is given voluntarily and without expectation of compensation. The Company may freely use, modify, or implement such feedback without any obligation or acknowledgment to You.</p>

                <h2>"AS IS" and "AS AVAILABLE" Disclaimer</h2>
                <p>The Service is provided to You "AS IS" and "AS AVAILABLE" without any warranties of any kind. We do not warrant that the Service will be uninterrupted, secure, or free of errors or viruses.</p>

                <h2>Governing Law</h2>
                <p>The laws of Italy, excluding its conflict of law rules, shall govern these Terms and Your use of the Service.</p>

                <h2>Dispute Resolution</h2>
                <p>Any disputes or concerns related to the Service should first be addressed informally by contacting Us at <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>.</p>

                <h2>Changes to These Terms</h2>
                <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material, We will provide notice prior to the new terms taking effect.</p>
                <p>By continuing to use the Service after those revisions become effective, You agree to be bound by the revised Terms.</p>

                <h2>Contact Us</h2>
                <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
                <ul>
                    <li>By email: <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a></li>
                </ul>
            </main>

            <Footer />
        </>
    )
}