import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <>
            <footer id="footer">
                <section className="footerTextSection">
                    <Link href="/" id="footerLogoA">
                        <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="footerLogo" />
                    </Link>

                    <ul className="footerText">
                        <li>Copyright &copy; 2025 Gianluca Rainis</li>
                        <li>freeideas.site@gmail.com</li>
                    </ul>
                </section>
                <section className="footerLinksSection">
                    <div>
                        <h4>Legal</h4>
                        <ul>
                            <li><Link href="/privacyPolicy">Privacy Policy</Link></li>
                            <li><Link href="/termsOfUse">Terms of Use</Link></li>
                            <li><Link href="/license">License</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Support</h4>
                        <ul>
                            <li><Link href="/faq">FAQ</Link></li>
                            <li><Link href="/feedback">Feedback</Link></li>
                            <li><Link href="/contacts">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4>About FreeIdeas</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
                            <li><a href="/images/logo/FreeIdeas_official_logos.zip" download="">Official logos</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>More</h4>
                        <ul>
                            <li><Link href="/admin">Reserved Area</Link></li>
                            <li><a href="https://github.com/gianluca-rainis/FreeIdeas.git">
                                <img src="/images/github.svg" alt="GitHub Logo" id="githubLogo" />
                            </a></li>
                        </ul>
                    </div>
                </section>
            </footer>
        </>
    )
}