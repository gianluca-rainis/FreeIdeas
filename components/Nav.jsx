import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useAppContext } from '@/contexts/CommonContext'
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/Nav.module.css';

function ThemeIcon({ isLight }) {
    const Icon = isLight ? Moon : Sun;

    return <Icon className={styles.themeToggle} aria-hidden="true" strokeWidth={1.8} />;
}

export default function Nav({ randomId=0 }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        function onScroll() {
            setIsScrolled(window.scrollY > 4);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const {
        themeIsLight,
        toggleTheme,
        showNotifications,
        toggleNotifications
    } = useAppContext();
    
    const {
        user,
        redirectToAccount
    } = useAuth();

    useEffect(() => {
        function closeMobileMenu() {
            setIsMobileMenuOpen(false);
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        }

        window.addEventListener('resize', closeMobileMenu);
        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('resize', closeMobileMenu);
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    function toggleMobileMenu() {
        if (showNotifications) {
            toggleNotifications();
        }

        setIsMobileMenuOpen((isOpen) => !isOpen);
    }

    function toggleMobileNotifications() {
        setIsMobileMenuOpen(false);
        toggleNotifications();
    }

    function closeMobileMenu() {
        setIsMobileMenuOpen(false);
    }

    return (
        <>
            <nav className={`${styles.nav} ${themeIsLight ? styles.light : styles.dark} ${isScrolled ? styles.scrolled : ''}`}>
                <div id="pcNavBarGhost" className={styles.pcNavBarGhost}>
                    <div className={styles.navInner}>
                        <Link href="/" prefetch className={styles.brandLink}>
                            <img src="/images/FreeIdeas.svg" alt="FreeIdeas" id="navLogo" className={styles.navLogoImage} />
                        </Link>

                        <nav className={styles.primaryNav} aria-label="Primary navigation">
                            <Link href="/searchAnIdea" className={styles.navText} prefetch>Explore</Link>
                            <Link href="/publishAnIdea" className={styles.publishLink} prefetch>Publish idea</Link>
                            <Link href={`/idea/${randomId}`} className={styles.navText} id="randomIdeaA" prefetch>Random idea</Link>
                        </nav>

                        <div className={styles.navUtilities}>
                            <button type="button" id="themeImageLi" className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
                                <ThemeIcon isLight={themeIsLight} />
                            </button>
                            <button type="button" id="notificationImageLi" className={styles.iconButton} onClick={toggleNotifications} aria-label="Notifications">
                                <Bell className={styles.notificationsImg} aria-hidden="true" strokeWidth={1.8} />
                            </button>
                            <button type="button" id="userImageLi" className={styles.accountButton} onClick={user ? redirectToAccount : () => window.location.assign('/login')} aria-label={user ? 'Open account' : 'Sign in'}>
                                <span id="userImage" className={styles.userIconWrap}><UserRound className={styles.userImage} aria-hidden="true" strokeWidth={1.8} /></span>
                                <span id="userName" className={styles.userName}>{user ? (user.username || '') : 'Sign in'}</span>
                            </button>
                        </div>
                    </div>

                    <div
                        id="notificaions"
                        className={styles.notificationsPanel}
                        style={{
                            display: 'none',
                            position: 'absolute',
                            top: '100%',
                            right: 'max(1.25rem, calc((100vw - 1320px) / 2))',
                            width: '50vw',
                            zIndex: 20
                        }}
                    >
                        <header className={styles.notificationsHeader}>
                            <div>
                                <p className={styles.panelEyebrow}>Inbox</p>
                                <h2>Notifications</h2>
                            </div>
                        </header>
                            <ul className={`notificationsUl ${styles.notificationsUl}`}>
                                <li className={styles.notificationEmpty}>Loading notifications</li>
                            </ul>

                            <div className={`hiddenNotificationData ${styles.hiddenNotificationData}`} style={{ display: 'none' }}>

                            </div>
                        </div>
                    </div>

                <div id="mobileNavBarGhost" className={styles.mobileNavBarGhost}>
                    <div className={styles.mobileNavInner}>
                        <Link href="/" prefetch className={styles.brandLink}>
                            <img src="/images/FreeIdeas.svg" alt="FreeIdeas" id="navLogo" className={styles.navLogoImage} />
                        </Link>
                        <div className={styles.mobileUtilities}>
                            <button type="button" id="themeImageLiMobile" className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme">
                                <ThemeIcon isLight={themeIsLight} />
                            </button>
                            <button type="button" id="notificationImageLiMobile" className={styles.iconButton} onClick={toggleMobileNotifications} aria-label="Notifications">
                                <Bell className={styles.notificationsImg} aria-hidden="true" strokeWidth={1.8} />
                            </button>
                            <button type="button" className={styles.iconButton} onClick={toggleMobileMenu} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileMenuOpen} aria-controls="mobileMenuHidden">
                                <span id="menuMobile" className={styles.menuIconWrap}>{isMobileMenuOpen ? <X className={styles.menuMobile} aria-hidden="true" strokeWidth={1.8} /> : <Menu className={styles.menuMobile} aria-hidden="true" strokeWidth={1.8} />}</span>
                            </button>
                            <button type="button" id="userImageLiMobile" className={styles.iconButton} onClick={user ? redirectToAccount : () => window.location.assign('/login')} aria-label={user ? 'Open account' : 'Sign in'}>
                                <span className={styles.menuIconWrap}><UserRound className={styles.userImage} aria-hidden="true" strokeWidth={1.8} /></span>
                            </button>
                        </div>
                    </div>

                    <div id="mobileMenuHidden" className={`${styles.mobileMenuHidden} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`} aria-hidden={!isMobileMenuOpen}>
                        <ul id="mobileNavLinks" className={styles.mobileNavLinks}>
                               <li><Link href="/searchAnIdea" className={styles.navText} onClick={closeMobileMenu}>Explore ideas</Link></li>
                               <li><Link href="/publishAnIdea" className={styles.navText} onClick={closeMobileMenu}>Publish an idea</Link></li>
                               <li><Link href={`/idea/${randomId}`} className={styles.navText} id="randomIdeaAMobile" onClick={closeMobileMenu}>Surprise me</Link></li>
                        </ul>
                    </div>

                    <div
                        id="notificaionsMobile"
                        className={styles.notificaionsMobile}
                        style={{
                            display: 'none',
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            width: '100%',
                            margin: 0,
                            zIndex: 20
                        }}
                    >
                        <header className={styles.notificationsHeader}>
                            <div>
                                <p className={styles.panelEyebrow}>Inbox</p>
                                <h2>Notifications</h2>
                            </div>
                        </header>
                        <ul className={`notificationsUl ${styles.notificationsUl}`}>
                            <li className={styles.notificationEmpty}>Loading notifications</li>
                        </ul>

                        <div className={`hiddenNotificationData ${styles.hiddenNotificationData}`} style={{ display: 'none' }}>

                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
