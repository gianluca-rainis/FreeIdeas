import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Nav.module.css';

function ThemeIcon({ isLight }) {
    if (!isLight) {
        return (
            <svg className={styles.themeToggle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
        );
    }

    return (
        <svg className={styles.themeToggle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.985 12.486A9 9 0 1 1 11.514 3.015A7 7 0 0 0 20.985 12.486Z" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg className={styles.notificationsImg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.674C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className={styles.userImage} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a5 5 0 0 1 10 0v1.662" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg className={styles.menuMobile} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

export default function Nav({ randomId=0 }) {
    const [isScrolled, setIsScrolled] = useState(false);

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
        toggleNotifications
    } = useAppContext();
    
    const {
        user,
        loginData,
        isSubmitting,
        handleLoginChange,
        handleLoginSubmit,
        handleForgotPassword,
        handleUserImageClick,
        handleLogout,
        redirectToAccount
    } = useAuth();

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
                                <BellIcon />
                            </button>
                            <button type="button" id="userImageLi" className={styles.accountButton} onClick={handleUserImageClick} aria-label="Open account menu">
                                <span id="userImage" className={styles.userIconWrap}><UserIcon /></span>
                                <span id="userName" className={styles.userName}>{user ? (user.username || '') : 'Sign in'}</span>
                            </button>
                        </div>
                    </div>
                    <div id="loginArea" className={styles.loginArea}>
                        <div id="pcLoginSignUpBlock">
                            <div id="loginHidden">
                                {user ? (
                                    <div>
                                        <h2>Welcome </h2>
                                        <img alt="User Image" style={{width: "60px", height: "60px", borderRadius: "50%", textAlign: 'center', marginBottom: "40px", marginTop: "30px"}} />
                                        <h3 style={{marginBottom: "20px"}}></h3>
                                        <button type="submit" id="sendAccountButton" className={styles.desktopActionButton}>Account</button>
                                        <button type="submit" id="sendLogoutButton" className={styles.desktopActionButton}>Log Out</button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2>Sign In</h2>
                                        <p>Don't have an account? <Link className={styles.signUp} href="/createAccount" prefetch>Register!</Link></p>
                                        <form onSubmit={handleLoginSubmit} id="loginAccountForm">
                                            <input 
                                                type="email" 
                                                id="emailAreaLogin" 
                                                className={styles.desktopInput}
                                                autoComplete="email" 
                                                spellCheck="false" 
                                                autoCapitalize="off" 
                                                placeholder="Email" 
                                                name="email" 
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                required 
                                            />
                                            
                                            <PasswordInput 
                                                id={"passwordAreaLogin"}
                                                name={"password"} 
                                                placeholder={"Password"} 
                                                autoComplete='current-password' 
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                required 
                                            />

                                            <p><a onClick={handleForgotPassword} style={{cursor: 'pointer'}} id="forgotPassword" className={styles.forgotPassword}>Forgot your password?</a></p>
                                            <button type="submit" id="sendLoginButton" className={styles.desktopActionButton} disabled={isSubmitting}>
                                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div id="notificaions" style={{ display: 'none' }}>
                            <h2>Notifications</h2>
                            <ul className={`notificationsUl ${styles.notificationsUl}`}>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                            </ul>

                            <div className={`hiddenNotificationData ${styles.hiddenNotificationData}`} style={{ display: 'none' }}>

                            </div>
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
                            <button type="button" id="notificationImageLiMobile" className={styles.iconButton} onClick={toggleNotifications} aria-label="Notifications">
                                <BellIcon />
                            </button>
                            <button type="button" id="userImageLi" className={styles.iconButton} onClick={handleUserImageClick} aria-label="Open menu">
                                <span id="menuMobile" className={styles.menuIconWrap}><MenuIcon /></span>
                            </button>
                        </div>
                    <div id="mobileMenuHidden" className={styles.mobileMenuHidden}>
                        <ul id="mobileNavLinks" className={styles.mobileNavLinks}>
                               <li><Link href="/searchAnIdea" className={styles.navText}>Explore ideas</Link></li>
                               <li><Link href="/publishAnIdea" className={styles.navText}>Publish an idea</Link></li>
                               <li><Link href={`/idea/${randomId}`} className={styles.navText} id="randomIdeaAMobile">Surprise me</Link></li>
                        </ul>

                        <div id="loginAreaMobile" className={styles.loginAreaMobile}>
                            <div id="mobileLoginSignUpBlock">
                                <div id="loginHiddenMobile">
                                    {user ? (
                                        <div>
                                            <h2>Welcome </h2>
                                            <div style={{alignItems: "center"}}>
                                                <img alt="User Image" style={{width: "100px", height: "100px", borderRadius: "50%", textAlign: 'center', marginBottom: "40px", marginTop: "30px"}} />
                                            </div>
                                            <h3 style={{marginBottom: "20px"}}></h3>
                                            <div style={{alignItems: "center"}}>
                                                <button type="submit" id="sendAccountButtonMobile" className={styles.mobileActionButton}>Account</button>
                                                <button type="submit" id="sendLogoutButtonMobile" className={styles.mobileActionButton}>Log Out</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2>Sign In</h2>
                                            <p>Don't have an account? <Link className={styles.signUpMobile} href="/createAccount" prefetch>Register!</Link></p>
                                            <form onSubmit={handleLoginSubmit} id="loginAccountFormMobile">
                                                <input 
                                                    type="email" 
                                                    id="emailAreaLoginMobile" 
                                                    className={styles.mobileInput}
                                                    autoComplete="email" 
                                                    spellCheck="false" 
                                                    autoCapitalize="off" 
                                                    placeholder="Email" 
                                                    name="email" 
                                                    value={loginData.email}
                                                    onChange={handleLoginChange}
                                                    required 
                                                />
                                                
                                                <PasswordInput 
                                                    id={"passwordAreaLoginMobile"} 
                                                    name={"password"} 
                                                    placeholder={"Password"} 
                                                    autoComplete='current-password' 
                                                    value={loginData.password}
                                                    onChange={handleLoginChange}
                                                    required 
                                                />

                                                <p><a onClick={handleForgotPassword} style={{cursor: 'pointer'}} id="forgotPassword" className={styles.forgotPassword}>Forgot your password?</a></p>
                                                <button type="submit" id="sendLoginButtonMobile" className={styles.mobileActionButton} disabled={isSubmitting}>
                                                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div id="notificaionsMobile" className={styles.notificaionsMobile} style={{ display: 'none' }}>
                                <h2>Notifications</h2>
                                <ul className={`notificationsUl ${styles.notificationsUl}`}>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                </ul>

                                <div className={`hiddenNotificationData ${styles.hiddenNotificationData}`} style={{ display: 'none' }}>

                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}