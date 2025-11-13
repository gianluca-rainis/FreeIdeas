import React from 'react'

function Footer() {
    return (
        <>
        <section className="footerTextSection">
            <a href="./index.php" id="footerLogoA"><img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" id="footerLogo" /></a>

            <ul className="footerText">
                <li>Copyright &copy; 2025 Gianluca Rainis</li>
                <li>freeideas.site@gmail.com</li>
            </ul>
        </section>
        <section className="footerLinksSection">
            <div>
                <h4>Legal</h4>
                <ul>
                    <li><a href="./privacyPolicy.php">Privacy Policy</a></li>
                    <li><a href="./termsOfUse.php">Terms of Use</a></li>
                    <li><a href="./license_info.php">License</a></li>
                </ul>
            </div>

            <div>
                <h4>Support</h4>
                <ul>
                    <li><a href="./faq.php">FAQ</a></li>
                    <li><a href="./feedback.php">Feedback</a></li>
                    <li><a href="./contacts.php">Contact Us</a></li>
                </ul>
            </div>

            <div>
                <h4>About FreeIdeas</h4>
                <ul>
                    <li><a href="./about.php">About Us</a></li>
                    <li><a href="./images/logo/FreeIdeas_official_logos.zip" download="">Official logos</a></li>
                </ul>
            </div>

            <div>
                <h4>More</h4>
                <ul>
                    <li><a href="./sitemap.xml">Sitemap</a></li>
                    <li><a href="./reservedArea.php">Reserved Area</a></li>
                    <li><a href="https://github.com/gianluca-rainis/FreeIdeas.git"><img src="./images/github.svg" alt="GitHub Logo" id="githubLogo" /></a></li>
                </ul>
            </div>
        </section>
        </>
    )
}

export default Footer