import React from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import styles from '../styles/Footer.module.css';

export default function Footer() {
    const { themeIsLight } = useAppContext();

    return (
        <footer className={`${styles.footer} ${themeIsLight ? styles.light : styles.dark}`}>
            <div className={styles.footerContainer}>
                <section className={styles.brandColumn}>
                    <p className={styles.footerEyebrow}>FreeIdeas / Community</p>
                    <Link href="/" prefetch className={styles.logoLink}>
                        <img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" className={styles.footerLogo} />
                    </Link>
                    <p className={styles.tagline}>A place where Ideas can be Free.</p>
                    <a className={styles.contact} href="mailto:freeideas@freeideas.pro">freeideas@freeideas.pro</a>
                </section>

                <nav className={styles.linkGrid} aria-label="Footer navigation">
                    <div className={styles.linkColumn}>
                        <h2>Discover</h2>
                        <Link href="/searchAnIdea" prefetch>Browse ideas</Link>
                        <Link href="/publishAnIdea" prefetch>Publish an idea</Link>
                        <Link href="/about" prefetch>About FreeIdeas</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h2>Legal</h2>
                        <Link href="/privacyPolicy" prefetch>Privacy policy</Link>
                        <Link href="/termsOfUse" prefetch>Terms of use</Link>
                        <Link href="/licensePage" prefetch>License</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h2>Community</h2>
                        <Link href="/faq" prefetch>FAQ</Link>
                        <Link href="/feedback" prefetch>Feedback</Link>
                        <Link href="/contacts" prefetch>Contact</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h2>Platform</h2>
                        <Link href="/reservedArea" prefetch>Reserved area</Link>
                        <a href="/images/logo/FreeIdeas_official_logos.zip" download>Brand assets</a>
                        <a href="https://github.com/gianluca-rainis/FreeIdeas.git" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </nav>
            </div>

            <div className={styles.bottomBar}>
                <p className={styles.copyright}>
                    &copy; 2025-{new Date().getFullYear()} Gianluca Rainis
                </p>
                <p className={styles.bottomNote}>Ideas belong to the people who share them.</p>
            </div>
        </footer>
    )
}