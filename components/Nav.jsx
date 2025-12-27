import React from 'react'
import Link from 'next/link'
import { useAppContext } from '../contexts/CommonContext'
import { PasswordInput } from './PasswordInput';
import { useAuth } from '../hooks/useAuth';

export default function Nav({ randomId=0 }) {
    const { 
        themeIsLight, 
        toggleTheme, 
        getImagePath,
        toggleNotifications
    } = useAppContext();
    
    const { 
        user,
        loginData,
        isSubmitting,
        handleLoginChange,
        handleLoginSubmit,
        handleLogout,
        handleForgotPassword,
        handleUserImageClick
    } = useAuth();

    return (
        <>
            <nav>
                <div id="pcNavBarGhost">
                    <ul className="navLogo">
                        <li><Link href="/" prefetch><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" /></Link></li>
                    </ul>
                    <ul className="navLinks">
                        <li><Link href="/searchAnIdea" className="navText" prefetch>Search an Idea</Link></li>
                        <li><Link href="/publishAnIdea" className="navText" prefetch>Publish an Idea</Link></li>
                        <li><Link href={`/idea/${randomId}`} className="navText" id="randomIdeaA" prefetch>Random Idea</Link></li>
                        <li id="themeImageLi"><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className="toggle-light-dark-theme" onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLi"><img src="/images/notifications.svg" alt="Notifications" className="notificationsImg" onClick={toggleNotifications} /></li>
                        <li id="userImageLi">
                            <img 
                                src={user ? (user.userimage || "/images/user.svg") : "/images/user.svg"} 
                                alt="User image" 
                                id="userImage" 
                                onClick={handleUserImageClick} 
                                style={{cursor: 'pointer'}} 
                            />
                            <p id="userName">{user ? (user.username?user.username:"") : "Login"}</p>
                        </li>
                    </ul>
                    <div id="loginArea">
                        <div id="pcLoginSignUpBlock">
                            <div id="loginHidden">
                                {user ? (
                                    <div>
                                        <h2>Welcome </h2>
                                        <img alt="User Image" style={{width: "60px", height: "60px", textAlign: 'center', marginBottom: "40px", marginTop: "30px"}} />
                                        <h3 style={{marginBottom: "20px"}}></h3>
                                        <button type="submit" id="sendAccountButton">Account</button>
                                        <button type="submit" id="sendLogoutButton">Log Out</button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2>Sign In</h2>
                                        <p>Don't have an account? <Link className="signUp" href="/createAccount" prefetch>Register!</Link></p>
                                        <form onSubmit={handleLoginSubmit} id="loginAccountForm">
                                            <input 
                                                type="email" 
                                                id="emailAreaLogin" 
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

                                            <p><a onClick={handleForgotPassword} style={{cursor: 'pointer'}} id="forgotPassword">Forgot your password?</a></p>
                                            <button type="submit" id="sendLoginButton" disabled={isSubmitting}>
                                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                                            </button>
                                        </form>
                                    </div>
                                )}
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
                        <li><Link href="/" prefetch><img src="/images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo" /></Link></li>
                    </ul>
                    <ul className="navLinks">
                        <li id="themeImageLiMobile"><img src={themeIsLight ? "/images/sun-dark.svg" : "/images/sun-light.svg"} alt="Toggle Theme" className="toggle-light-dark-theme" onClick={toggleTheme} style={{cursor: 'pointer'}} /></li>
                        <li id="notificationImageLiMobile"><img src="/images/notifications.svg" alt="Notifications" className="notificationsImg" style={{cursor: 'pointer'}} onClick={toggleNotifications} /></li>
                        <li id="userImageLi"><img src="/images/menu.svg" alt="Menu" id="menuMobile" onClick={handleUserImageClick} style={{cursor: 'pointer'}} /></li>
                    </ul>
                    <div id="mobileMenuHidden">
                        <ul id="mobileNavLinks">
                            <li><Link href="/searchAnIdea" className="navText" prefetch>Search an Idea</Link></li>
                            <li><Link href="/publishAnIdea" className="navText" prefetch>Publish an Idea</Link></li>
                            <li><Link href={`/idea/${randomId}`} className="navText" id="randomIdeaAMobile" prefetch>Random Idea</Link></li>
                        </ul>

                        <div id="loginAreaMobile">
                            <div id="mobileLoginSignUpBlock">
                                <div id="loginHiddenMobile">
                                    {user ? (
                                        <div>
                                            <h2>Welcome </h2>
                                            <div style={{alignItems: "center"}}>
                                                <img alt="User Image" style={{width: "100px", height: "100px", textAlign: 'center', marginBottom: "40px", marginTop: "30px"}} />
                                            </div>
                                            <h3 style={{marginBottom: "20px"}}></h3>
                                            <div style={{alignItems: "center"}}>
                                                <button type="submit" id="sendAccountButtonMobile">Account</button>
                                                <button type="submit" id="sendLogoutButtonMobile">Log Out</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2>Sign In</h2>
                                            <p>Don't have an account? <Link className="signUp" href="/register" prefetch>Register!</Link></p>
                                            <form onSubmit={handleLoginSubmit} id="loginAccountFormMobile">
                                                <input 
                                                    type="email" 
                                                    id="emailAreaLoginMobile" 
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

                                                <p><a onClick={handleForgotPassword} style={{cursor: 'pointer'}} id="forgotPassword">Forgot your password?</a></p>
                                                <button type="submit" id="sendLoginButtonMobile" disabled={isSubmitting}>
                                                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                                                </button>
                                            </form>
                                        </div>
                                    )}
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