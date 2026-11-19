import styles from '@/styles/UnifiedPages.module.css'
import '@/styles/ReservedAreaPage.module.css';
import '@/styles/ReservedAreaModern.module.css';
import '@/styles/ResponsivePages.module.css';
import '@/styles/ThemeAndBase.module.css';
import React, { useEffect, useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Head from '@/components/Head'
import { useAppContext } from '@/contexts/CommonContext'
import WelcomeView from '@/components/reserved/WelcomeView'
import AccountsView from '@/components/reserved/AccountsView'
import IdeasView from '@/components/reserved/IdeasView'
import NotificationsView from '@/components/reserved/NotificationsView'
import ReportsView from '@/components/reserved/ReportsView'
import { fetchWithTimeout } from '@/utils/fetchWithTimeout'
import { apiCall, getBaseUrl } from '@/utils/apiConfig'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    let adminSessionData = false;
    let pageTitle = 'Reserved Area';
    
    const cookieHeader = context.req?.headers?.cookie ?? '';
    const baseUrl = getBaseUrl(context.req);

    // Cache SSR response briefly to improve perceived speed
    if (context.res) {
        context.res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    }

    try {
        const res = await fetchWithTimeout(`${baseUrl}/api/getSessionData?data=administrator`, {
            credentials: "include",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined
        }, 800);

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
    const { randomIdeaId, showAlert, showConfirm, showPrompt } = useAppContext();
    const [activeView, setActiveView] = useState('welcome');

    function handleViewChange(view) {
        setActiveView(view);

        const mobileNavBar = document.getElementById("mobileNavBarReservedAreaHeader");

        if (mobileNavBar) {
            mobileNavBar.style.display = "none";
        }
    }

    async function handleLogout() {
        try {
            await apiCall("/api/logout", {
                method: 'POST'
            });
            
            window.location.href = "/reservedArea";
        } catch (error) {
            console.error(error);
            await showAlert("Error logging out");
        }
    }

    useEffect(() => {
        const form = document.getElementById("loginReservedAreaForm");

        if (!form) {
            return undefined;
        }

        async function handleSubmit(e) {
            e.preventDefault();

            try {
                const formData = new FormData(e.currentTarget);

                const data = await apiCall("/api/reservedAreaLogin", {
                    method: "POST",
                    body: formData
                });

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

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            {
                adminSessionData?
                <header className="adminWorkspaceHeader">
                    <button type="button" className="adminMenuButton" id="menuReservedArea" aria-label="Open administration menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <a href="/reservedArea" className="adminBrand">
                        <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Reserved Area" />
                    </a>

                    <div className="adminIdentity">
                        <span>{adminSessionData.username || 'Administrator'}</span>
                        <button type="button" onClick={handleLogout}>Sign out</button>
                    </div>

                    <div id="mobileNavBarReservedAreaHeader" className="adminMobileMenu">
                        <button type="button" className={activeView === 'welcome' ? 'active' : ''} onClick={() => handleViewChange('welcome')}>Overview</button>
                        <button type="button" className={activeView === 'accounts' ? 'active' : ''} onClick={() => handleViewChange('accounts')}>Accounts</button>
                        <button type="button" className={activeView === 'ideas' ? 'active' : ''} onClick={() => handleViewChange('ideas')}>Ideas</button>
                        <button type="button" className={activeView === 'notifications' ? 'active' : ''} onClick={() => handleViewChange('notifications')}>Notifications</button>
                        <button type="button" className={activeView === 'reports' ? 'active' : ''} onClick={() => handleViewChange('reports')}>Reports</button>
                        <button type="button" onClick={handleLogout}>Sign out</button>
                    </div>
                </header>
                :null
            }

            <main id="reservedAreaMain" className={`${styles.scope} ${adminSessionData ? 'adminWorkspace' : 'reservedLoginWorkspace'}`}>
                {
                    !adminSessionData?
                    <div className="reservedLoginPanel">
                        <header className="reservedLoginHeader">
                            <p>Administration / Secure access</p>
                            <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" className="logo" />
                        </header>

                        <div id="bannerDiv">
                            <hr />
                            <h2>All unauthorized access will be punished!</h2>
                            <hr />
                        </div>

                        <form action="/api/reservedAreaLogin" method="POST" id="loginReservedAreaForm">
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
                        <aside className="adminSidebar">
                            <p className="adminSidebarLabel">Workspace</p>
                            <nav className="adminSidebarNav" aria-label="Administration navigation">
                                <button type="button" className={activeView === 'welcome' ? 'active' : ''} onClick={() => handleViewChange('welcome')}>
                                    <span>01</span>
                                    Overview
                                </button>
                                <button type="button" className={activeView === 'accounts' ? 'active' : ''} onClick={() => handleViewChange('accounts')}>
                                    <span>02</span>
                                    Accounts
                                </button>
                                <button type="button" className={activeView === 'ideas' ? 'active' : ''} onClick={() => handleViewChange('ideas')}>
                                    <span>03</span>
                                    Ideas
                                </button>
                                <button type="button" className={activeView === 'notifications' ? 'active' : ''} onClick={() => handleViewChange('notifications')}>
                                    <span>04</span>
                                    Notifications
                                </button>
                                <button type="button" className={activeView === 'reports' ? 'active' : ''} onClick={() => handleViewChange('reports')}>
                                    <span>05</span>
                                    Reports
                                </button>
                            </nav>
                        </aside>

                        <section className="adminContent">
                            <header className="adminContentHeader">
                                <p>Administration</p>
                                <h1>{activeView === 'welcome' ? 'Overview' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
                            </header>

                            <div className="adminViewBody">
                        {activeView === 'welcome' && (
                            <WelcomeView username={adminSessionData.username} />
                        )}
                        {activeView === 'accounts' && (
                            <AccountsView showAlert={showAlert} showConfirm={showConfirm} showPrompt={showPrompt} />
                        )}
                        {activeView === 'ideas' && (
                            <IdeasView showAlert={showAlert} showConfirm={showConfirm} />
                        )}
                        {activeView === 'notifications' && (
                            <NotificationsView showAlert={showAlert} showConfirm={showConfirm} />
                        )}
                        {activeView === 'reports' && (
                            <ReportsView showAlert={showAlert} showConfirm={showConfirm} />
                        )}
                            </div>
                        </section>
                    </>
                }
            </main>

            <Footer />
        </>
    )
}
