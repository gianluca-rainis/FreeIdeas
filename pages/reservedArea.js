import React, { useEffect } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    let loggedInAsAdmin = false;
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
            loggedInAsAdmin = true;
        }
    } catch (error) {
        console.error('Failed to load session data: '+error);
    }

    return {
        props: {
            loggedInAsAdmin: loggedInAsAdmin,
            pageTitle: pageTitle
        }
    }
}

// Main
export default function ReservedAreaPage({ loggedInAsAdmin, pageTitle }) {
    const { randomIdeaId, showAlert } = useAppContext();

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

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            {
                loggedInAsAdmin?
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
                    !loggedInAsAdmin?
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
                    :null
                }
            </main>

            <Footer />
        </>
    )
}