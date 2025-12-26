import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    let adminSessionData = false;
    let pageTitle = 'Reserved Area';
    const cookieHeader = context.req?.headers?.cookie ?? '';

    try {
        const res = await fetch(`http://localhost:8000/api/getSessionData.php?data=administrator`, {
            credentials: "include",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined
        });

        const data = await res.json();

        if (!data) {
            throw new Error("Unable to get admin session data.");
        }
        else {
            adminSessionData = data;
        }
    } catch (error) {
        console.error('Failed to load session data: '+error);
    }

    return {
        props: {
            adminSessionData: adminSessionData,
            pageTitle: pageTitle
        }
    }
}

// Main
export default function ReservedAreaPage({ adminSessionData, pageTitle }) {
    const { randomIdeaId, showAlert } = useAppContext();
    const [activeView, setActiveView] = useState('welcome');

    useEffect(() => {
        const form = document.getElementById("loginReservedAreaForm");

        if (!form) {
            return undefined;
        }

        async function handleSubmit(e) {
            e.preventDefault();

            try {
                const formData = new FormData(e.currentTarget);

                const response = await fetch(form.action, {
                    credentials: "include",
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data['success']) {
                    window.location.href = "/reservedArea";
                }
                else {
                    if (data['error'] == "account_not_found") {
                        await showAlert("Username or password are wrong");
                    }
                    else {
                        throw new Error(data['error']);
                    }
                }
            } catch (error) {
                console.error(error);
                await showAlert("Error logging in.");
            }
        }

        form.addEventListener("submit", handleSubmit);

        return () => form.removeEventListener("submit", handleSubmit);
    }, [showAlert]);

    // Toggle size
    useEffect(() => {
        const mobileNavBar = document.getElementById("mobileNavBarReservedAreaHeader");

        function toggleWindowSize() {
            if (window.innerWidth > 760 && mobileNavBar) {
                mobileNavBar.style.display = "none";
            }
        }

        toggleWindowSize();
        window.addEventListener("resize", toggleWindowSize);

        return () => window.removeEventListener("resize", toggleWindowSize);
    }, []);

    // Menu for mobile
    useEffect(() => {
        const menuReservedArea = document.getElementById("menuReservedArea");
        const mobileNavBar = document.getElementById("mobileNavBarReservedAreaHeader");

        if (!menuReservedArea || !mobileNavBar) {
            return undefined;
        }

        function toggleMobileNavBar() {
            mobileNavBar.style.display = mobileNavBar.style.display == "block" ? "none" : "block";
        }

        menuReservedArea.addEventListener("click", toggleMobileNavBar);

        return () => menuReservedArea.removeEventListener("click", toggleMobileNavBar);
    }, []);

    // View handlers
    useEffect(() => {
        const accountsBtns = document.querySelectorAll(".accountsReservedAreaHeader");
        const ideasBtns = document.querySelectorAll(".ideasReservedAreaHeader");
        const notificationsBtns = document.querySelectorAll(".notificationsReservedAreaHeader");
        const reportsBtns = document.querySelectorAll(".reportsReservedAreaHeader");
        const mobileNavBar = document.getElementById("mobileNavBarReservedAreaHeader");

        function handleViewChange(view) {
            setActiveView(view);

            if (mobileNavBar) {
                mobileNavBar.style.display = "none";
            }
        }

        function accountsListener() {
            handleViewChange('accounts');
        }

        function ideasListener() {
            handleViewChange('ideas');
        }

        function notificationsListener() {
            handleViewChange('notifications');
        }

        function reportsListener() {
            handleViewChange('reports');
        }

        accountsBtns.forEach(btn => btn.addEventListener("click", accountsListener));
        ideasBtns.forEach(btn => btn.addEventListener("click", ideasListener));
        notificationsBtns.forEach(btn => btn.addEventListener("click", notificationsListener));
        reportsBtns.forEach(btn => btn.addEventListener("click", reportsListener));

        return () => {
            accountsBtns.forEach(btn => btn.removeEventListener("click", accountsListener));
            ideasBtns.forEach(btn => btn.removeEventListener("click", ideasListener));
            notificationsBtns.forEach(btn => btn.removeEventListener("click", notificationsListener));
            reportsBtns.forEach(btn => btn.removeEventListener("click", reportsListener));
        };
    }, []);

    // Logout handler
    useEffect(() => {
        const logoutReservedAreaHeader = document.querySelectorAll(".logoutReservedAreaHeader");

        if (logoutReservedAreaHeader.length === 0) {
            return undefined;
        }

        async function logout() {
            try {
                await fetch("/api/logout.php", {
                    credentials: "include"
                });
                
                window.location.href = "/reservedArea";
            } catch (error) {
                console.error(error);
                await showAlert("Error logging out");
            }
        }

        logoutReservedAreaHeader.forEach(element => element.addEventListener("click", logout));

        return () => logoutReservedAreaHeader.forEach(element => element.removeEventListener("click", logout));
    }, [showAlert]);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            {
                adminSessionData?
                <header id="reservedAreaHeader">
                    <a href="/reservedArea">
                        <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" className="logo" />
                    </a>

                    <ul id="ulReservedAreaHeader">
                        <li className="liReservedAreaHeaderExt"><button className="accountsReservedAreaHeader">Accounts</button></li>
                        <li className="liReservedAreaHeaderExt"><button className="ideasReservedAreaHeader">Ideas</button></li>
                        <li className="liReservedAreaHeaderExt"><button className="notificationsReservedAreaHeader">Notifications</button></li>
                        <li className="liReservedAreaHeaderExt"><button className="reportsReservedAreaHeader">Reports</button></li>
                        <li className="liReservedAreaHeaderExt"><button className="logoutReservedAreaHeader">Logout</button></li>
                        <li className="liReservedAreaHeaderRed"><img src="/images/menuReservedArea.svg" id="menuReservedArea" /></li>
                    </ul>

                    <div id="mobileNavBarReservedAreaHeader">
                        <ul>
                            <li><button className="accountsReservedAreaHeader">Accounts</button></li>
                            <li><button className="ideasReservedAreaHeader">Ideas</button></li>
                            <li><button className="notificationsReservedAreaHeader">Notifications</button></li>
                            <li><button className="reportsReservedAreaHeader">Reports</button></li>
                            <li><button className="logoutReservedAreaHeader">Logout</button></li>
                        </ul>
                    </div>
                </header>
                :null
            }

            <main id="reservedAreaMain">
                {
                    !adminSessionData?
                    <div>
                        <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" className="logo" />

                        <div id="bannerDiv">
                            <hr />
                            <h2>All unauthorized access will be punished!</h2>
                            <hr />
                        </div>

                        <form action="/api/reservedAreaLogin.php" method="POST" id="loginReservedAreaForm">
                            <ul style={{width: "auto"}}>
                                <li>
                                    <label htmlFor="usernameReservedArea">Username:</label>
                                    <input type="text" name="username" id="usernameReservedArea" autoComplete="username" required />
                                </li>
                                <li>
                                    <label htmlFor="password1ReservedArea">Password 1:</label>
                                    <input type="password" name="password1" id="password1ReservedArea" autoComplete="current-password" required />
                                </li>
                                <li>
                                    <label htmlFor="password2ReservedArea">Password 2:</label>
                                    <input type="password" name="password2" id="password2ReservedArea" autoComplete="current-password" required />
                                </li>
                                <li>
                                    <label htmlFor="password3ReservedArea">Password 3:</label>
                                    <input type="password" name="password3" id="password3ReservedArea" autoComplete="current-password" required />
                                </li>
                                <li>
                                    <label htmlFor="password4ReservedArea">Password 4:</label>
                                    <input type="password" name="password4" id="password4ReservedArea" autoComplete="current-password" required />
                                </li>
                                <li>
                                    <label htmlFor="password5ReservedArea">Password 5:</label>
                                    <input type="password" name="password5" id="password5ReservedArea" autoComplete="current-password" required />
                                </li>
                                <li>
                                    <input type="submit" value="Login" id="loginReservedArea" />
                                </li>
                            </ul>
                        </form>
                    </div>
                    :
                    <>
                        {activeView === 'welcome' && (
                            <div>
                                <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" className="logo" />
                                <h1 style={{paddingBottom: "5%"}}>Welcome {adminSessionData.username}</h1>
                            </div>
                        )}
                        {activeView === 'accounts' && (
                            <div>
                                <section id="searchSectionInReservedArea">
                                    <input type="search" placeholder="Search" id="searchReservedArea" />
                                </section>

                                <ul>

                                </ul>
                            </div>
                        )}
                        {activeView === 'ideas' && (
                            <div>
                                <section id="searchSectionInReservedArea">
                                    <input type="search" placeholder="Search" id="searchReservedArea" />
                                </section>

                                <ul>

                                </ul>
                            </div>
                        )}
                        {activeView === 'notifications' && (
                            <div>
                                <section id="searchSectionInReservedArea">
                                    <input type="search" placeholder="Search" id="searchReservedArea" />
                                    <img src='/images/add.svg' alt='Create notification' id='createNotificationReservedArea' />
                                </section>

                                <ul>

                                </ul>
                            </div>
                        )}
                        {activeView === 'reports' && (
                            <div>
                                <section id="searchSectionInReservedArea">
                                    <input type="search" placeholder="Search" id="searchReservedArea" />
                                </section>

                                <ul>

                                </ul>
                            </div>
                        )}
                    </>
                }
            </main>

            <Footer />
        </>
    )
}