import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/Nav.module.css';

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
        handleUserImageClick
    } = useAuth();

    return (
        <>
            <nav className={`${styles.nav} ${themeIsLight ? styles.light : styles.dark} ${isScrolled ? styles.scrolled : ''}`}>
                <div id="pcNavBarGhost" className={styles.pcNavBarGhost}>
                    <ul className={`${styles.navList} ${styles.navLogo}`}>
                        <li><Link href="/" prefetch><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" className={styles.navLogoImage} /></Link></li>
                    </ul>
                    <ul className={`${styles.navList} ${styles.navLinks}`}>
                        <li><Link href="/searchAnIdea" className={styles.navText} prefetch>Search an Idea</Link></li>
                        <li><Link href="/publishAnIdea" className={styles.navText} prefetch>Publish an Idea</Link></li>
                        <li><Link href={`/idea/${randomId}`} className={styles.navText} id="randomIdeaA" prefetch>Random Idea</Link></li>
                        <li id="themeImageLi" className={styles.themeImageLi}><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className={styles.themeToggle} onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLi"><img src={themeIsLight ? "/images/notifications.svg" : "/images/notifications_Pro.svg"} alt="Notifications" className={`notificationsImg ${styles.notificationsImg}`} onClick={toggleNotifications} /></li>
                        <li id="userImageLi">
                            <img 
                                src={user ? (user.userimage || "/images/user.svg") : "/images/user.svg"} 
                                alt="User image" 
                                id="userImage" 
                                className={styles.userImage}
                                onClick={handleUserImageClick} 
                                style={{cursor: 'pointer'}} 
                            />
                            <p id="userName" className={styles.userName}>{user ? (user.username?user.username:"") : "Login"}</p>
                        </li>
                    </ul>
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
                    <ul className={`${styles.navList} ${styles.navLogo}`}>
                        <li><Link href="/" prefetch><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" className={styles.navLogoImage} /></Link></li>
                    </ul>
                    <ul className={`${styles.navList} ${styles.navLinks}`}>
                        <li id="themeImageLiMobile" className={styles.themeImageLiMobile}><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className={styles.themeToggle} onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLiMobile"><img src={themeIsLight ? "/images/notifications.svg" : "/images/notifications_Pro.svg"} alt="Notifications" className={`notificationsImg ${styles.notificationsImg}`} style={{cursor: 'pointer'}} onClick={toggleNotifications} /></li>
                        <li id="userImageLi"><img src="/images/menu.svg" alt="Menu" id="menuMobile" className={styles.menuMobile} onClick={handleUserImageClick} style={{cursor: 'pointer'}} /></li>
                    </ul>
                    <div id="mobileMenuHidden" className={styles.mobileMenuHidden}>
                        <ul id="mobileNavLinks" className={styles.mobileNavLinks}>
                               <li><Link href="/searchAnIdea" className={styles.navText}>Search an Idea</Link></li>
                               <li><Link href="/publishAnIdea" className={styles.navText}>Publish an Idea</Link></li>
                               <li><Link href={`/idea/${randomId}`} className={styles.navText} id="randomIdeaAMobile">Random Idea</Link></li>
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
            </nav>
        </>
    )
}