import React from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import styles from '../styles/Footer.module.css';

export default function Footer() {
    const { themeIsLight } = useAppContext();

    return (
        <footer className={`${styles.footer} ${themeIsLight ? styles.light : styles.dark}`}>
            <div className={styles.footerContainer}>
                {/* Info Section */}
                <div className={styles.infoSection}>
                    <Link href="/" prefetch className={styles.logoLink}>
                        <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className={styles.footerLogo} />
                    </Link>
                    <div className={styles.info}>
                        <p className={styles.tagline}>A place where your Ideas can be Free.</p>
                        <p className={styles.contact}>freeideas@freeideas.pro</p>
                    </div>
                </div>

                {/* Links Grid */}
                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h5>Explore</h5>
                        <ul>
                            <li><Link href="/searchAnIdea" prefetch>Browse Ideas</Link></li>
                            <li><Link href="/publishAnIdea" prefetch>Publish Idea</Link></li>
                            <li><Link href="/about" prefetch>About Us</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkColumn}>
                        <h5>Legal</h5>
                        <ul>
                            <li><Link href="/privacyPolicy" prefetch>Privacy Policy</Link></li>
                            <li><Link href="/termsOfUse" prefetch>Terms of Use</Link></li>
                            <li><Link href="/licensePage" prefetch>License</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkColumn}>
                        <h5>Support</h5>
                        <ul>
                            <li><Link href="/faq" prefetch>FAQ</Link></li>
                            <li><Link href="/feedback" prefetch>Feedback</Link></li>
                            <li><Link href="/contacts" prefetch>Contact</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkColumn}>
                        <h5>Community</h5>
                        <ul>
                            <li><Link href="/reservedArea" prefetch>Reserved Area</Link></li>
                            <li><a href="/images/logo/FreeIdeas_official_logos.zip" download>Logos</a></li>
                            <li><a href="https://github.com/gianluca-rainis/FreeIdeas.git" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottomBar}>
                <p className={styles.copyright}>
                    &copy; 2025-{new Date().getFullYear()} Gianluca Rainis. All rights reserved.
                </p>
            </div>
        </footer>
    )
}