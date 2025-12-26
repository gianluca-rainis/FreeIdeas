import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps() {
    return {
        props: {
            pageTitle: "License"
        }
    }
}

// Main
export default function LicensePage({pageTitle}) {
    const { randomIdeaId } = useAppContext();

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main className="footerpage">
                <h1>FreeIdeas License</h1>

                <h1>Copyright (c) 2025, FreeIdeas by Gianluca Rainis</h1>

                <h1>1. Permission of Use</h1>
                <p>Permission is hereby granted to any individual to use this project exclusively for personal, non-commercial purposes, provided that all terms of this license are respected.</p>

                <h2>1.1 Definition of "Non-Commercial Use"</h2>
                <p><em>Non-commercial use</em> refers to any use <strong>not primarily intended for or directed toward commercial advantage or monetary compensation</strong>, including but not limited to:</p>
                <ul>
                    <li>Personal publication without monetized ads;</li>
                    <li>Educational or academic use within nonprofit institutions;</li>
                    <li>Use within nonprofit organizations that do not sell, license, or commercially promote services based on this project.</li>
                </ul>
                <p>The author reserves the right to assess and clarify borderline cases.</p>

                <h1>2. Derivative Works</h1>
                <p>Non-commercial derivative works are permitted, provided that:</p>
                <ul>
                    <li>The work includes the <strong>latest published version</strong> of the FreeIdeas License, even if the source project used an earlier version;</li>
                    <li><strong>Clear attribution</strong> is given, stating the work is derived from or inspired by FreeIdeas;</li>
                    <li>The derivative work is released under the same FreeIdeas License without altering its terms.</li>
                </ul>
                <p>Authors of derivative works are responsible for <strong>updating the included license</strong> whenever a new official version is published.</p>

                <h2>2.1 Definition of Derivative Work</h2>
                <p>A derivative work is defined as any project, code, design, document, or content that <strong>modifies, extends, incorporates, adapts, or is substantially based on</strong> this project.</p>

                <h1>3. Commercial Use and Permissions</h1>
                <ul>
                    <li><strong>Commercial use</strong> of any part of this project, whether direct or indirect (e.g., selling, licensing, monetizing, providing services based on the project), is strictly prohibited unless prior written permission is obtained from the author.</li>
                    <li>This license is non-transferable and non-sublicensable.</li>
                </ul>

                <h1>4. Attribution and Traceability Clause</h1>
                <p>Any distributed or derivative work must include <strong>complete and traceable attribution</strong>, listing:</p>
                <ul>
                    <li>The original FreeIdeas project and its author;</li>
                    <li>Any intermediate contributors whose work has been incorporated;</li>
                    <li>The immediate upstream source from which the current work is derived.</li>
                </ul>
                <p>This attribution must be <strong>clearly visible and publicly accessible</strong> within the project documentation or metadata.</p>
                <p>The purpose of this clause is to ensure full transparency, uphold the integrity of derivative efforts, and preserve historical linkage to FreeIdeas as the origin point. Failure to honor the complete attribution chain constitutes a violation of this license.</p>

                <h1>5. Commercial Use in Derivation Chains</h1>
                <p>For works modified or built upon by multiple contributors:</p>
                <ul>
                    <li>Any party seeking <strong>commercial use</strong> of a derivative must obtain <strong>explicit written permission from</strong>:
                        <ul>
                            <li>The original author of FreeIdeas;</li>
                            <li><strong>All intermediate contributors</strong> involved in the derivation chain.</li>
                        </ul>
                    </li>
                </ul>
                <p>No contributor is authorized to grant commercial rights on behalf of the original author or any upstream contributor.</p>

                <h1>6. Governing Law and Jurisdiction</h1>
                <p>This license is governed by <strong>Italian law</strong>.</p>
                <p>For international disputes, mandatory mediation under the <strong>Arbitration Chamber of Milan</strong>'s rules is required before pursuing legal action.</p>

                <h1>7. Licensing Updates</h1>
                <p>The author reserves the right to release updated versions of this license at any time.</p>
                <p>All versions of the FreeIdeas project, unless explicitly stated otherwise, are governed by the latest published version of the FreeIdeas License.</p>
                <p>This ensures consistent terms and conditions across all versions of the project.</p>

                <h1>8. Name and Trademark Clause</h1>
                <p>The name "<em>FreeIdeas</em>" and any logos, symbols, or visual elements associated with it are considered protected identifiers. Even if not formally registered as trademarks, their use is strictly regulated as follows:</p>

                <h2>8.1 Official Reference and Affiliation</h2>
                <ul>
                    <li>The use of official FreeIdeas logos and the name "<em>FreeIdeas</em>" is permitted <strong>for citation or reference purposes</strong>, and such use <strong>must not clearly imply authorship, endorsement, or affiliation</strong> unless such authorship, endorsement, or affiliation actually exists.</li>
                    <li>In cases where a legitimate relationship with FreeIdeas exists (authorship, endorsement, or affiliation), the use of the official name and logos is <strong>both permitted and required</strong> to accurately indicate that connection.</li>
                </ul>

                <h2>8.2 Prohibited Uses</h2>
                <ul>
                    <li>Using unofficial logos to represent FreeIdeas in official contexts is strictly prohibited.</li>
                    <li>Using the name or logos (official or unofficial) to <strong>mislead others into believing a product, service, or work is created, endorsed, or affiliated with FreeIdeas</strong> is strictly forbidden.</li>
                    <li>Using the name or logos (official or unofficial) to <strong>impersonate FreeIdeas or falsely claim to be FreeIdeas</strong> is strictly prohibited.</li>
                    <li>Any commercial or unauthorized use of the name or logos remains prohibited without prior written permission from the author.</li>
                </ul>
                <p>This clause ensures that the identity of FreeIdeas is preserved, while allowing limited and transparent references in documentation and discussion.</p>

                <h1>9. Disclaimer of Warranty and Liability</h1>
                <p><strong>THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT ANY WARRANTY</strong>, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                <p>IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, LOSS OF USE, DATA, OR PROFITS), HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE), ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE.</p>

                <h3><strong>Version 1.6 — 2025-11-02</strong></h3>
            </main>

            <Footer />
        </>
    )
}