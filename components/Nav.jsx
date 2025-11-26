import React from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import { PasswordInput } from './PasswordInput';

export default function Nav({ randomId=0 }) {
    const { themeIsLight, toggleTheme, getImagePath, toggleNotifications, toggleLoginArea } = useAppContext();

    return (
        <>
            <nav>
                <div id="pcNavBarGhost">
                    <ul className="navLogo">
                        <li><Link href="/"><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" /></Link></li>
                    </ul>
                    <ul className="navLinks">
                        <li><Link href="/searchAnIdea.php" className="navText">Search an Idea</Link></li>
                        <li><Link href="/publishAnIdea.php" className="navText">Publish an Idea</Link></li>
                        <li><Link href={`/ideaVoid.php?idea=${randomId}`} className="navText" id="randomIdeaA">Random Idea</Link></li>
                        <li id="themeImageLi"><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className="toggle-light-dark-theme" onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLi"><img src="/images/notifications.svg" alt="Notifications" className="notificationsImg" onClick={toggleNotifications} /></li>
                        <li id="userImageLi"><img src="/images/user.svg" alt="User image" id="userImage" onClick={toggleLoginArea} style={{cursor: 'pointer'}} /><p id="userName">Login</p></li>
                    </ul>
                    <div id="loginArea">
                        <div id="pcLoginSignUpBlock">
                            <div id="loginHidden">
                                <h2>Sign In</h2>
                                <p>Don't have an account? <Link className="signUp" href="/register">Register!</Link></p>
                                <form action="/api/login.php" method="POST" id="loginAccountForm">
                                    <input type="email" id="emailAreaLogin" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="Email" name="email" required />
                                    
                                    <PasswordInput id={"passwordAreaLogin"} name={"password"} placeholder={"Password"} autoComplete='current-password' required />

                                    <p><a id="forgotPassword">Forgot your password?</a></p>
                                    <button type="submit" id="sendLoginButton">Sign In</button>
                                </form>
                            </div>
                        </div>

                        <div id="notificaions" style={{ display: 'none' }}>
                            <h2>Notifications</h2>
                            <ul className="notificationsUl">
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                            </ul>

                            <div className="hiddenNotificationData" style={{ display: 'none' }}>

                            </div>
                        </div>
                    </div>
                </div>

                <div id="mobileNavBarGhost">
                    <ul className="navLogo">
                        <li><Link href="/"><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" /></Link></li>
                    </ul>
                    <ul className="navLinks">
                        <li id="themeImageLiMobile"><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className="toggle-light-dark-theme" onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLiMobile"><img src="/images/notifications.svg" alt="Notifications" className="notificationsImg" onClick={toggleNotifications} style={{cursor: 'pointer'}} /></li>
                        <li id="userImageLi"><img src="/images/menu.svg" alt="Menu" id="menuMobile" onClick={toggleLoginArea} style={{cursor: 'pointer'}} /></li>
                    </ul>
                    <div id="mobileMenuHidden">
                        <ul id="mobileNavLinks">
                            <li><Link href="/searchAnIdea.php" className="navText">Search an Idea</Link></li>
                            <li><Link href="/publishAnIdea.php" className="navText">Publish an Idea</Link></li>
                            <li><Link href={`/ideaVoid.php?idea=${randomId}`} className="navText" id="randomIdeaAMobile">Random Idea</Link></li>
                        </ul>

                        <div id="loginAreaMobile">
                            <div id="mobileLoginSignUpBlock">
                                <div id="loginHiddenMobile">
                                    <h2>Sign In</h2>
                                    <p>Don't have an account? <Link className="signUp" href="/register">Register!</Link></p>
                                    <form action="/api/login.php" method="POST" id="loginAccountFormMobile">
                                        <input type="email" id="emailAreaLoginMobile" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="Email" name="email" required />
                                        
                                        <PasswordInput id={"passwordAreaLoginMobile"} name={"password"} placeholder={"Password"} autoComplete='current-password' required />

                                        <p><a id="forgotPassword">Forgot your password?</a></p>
                                        <button type="submit" id="sendLoginButtonMobile">Sign In</button>
                                    </form>
                                </div>
                            </div>

                            <div id="notificaionsMobile" style={{ display: 'none' }}>
                                <h2>Notifications</h2>
                                <ul className="notificationsUl">
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                    <li><div style={{ display: 'flex' }}><strong> </strong> &nbsp; &nbsp; <div style={{ color: 'grey' }}> </div></div><div> </div></li>
                                </ul>

                                <div className="hiddenNotificationData" style={{ display: 'none' }}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}