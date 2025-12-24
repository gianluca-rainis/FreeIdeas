import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'

// Server-side rendering for initial data
export async function getServerSideProps(context) {
    let { id } = context.query;
    let accountData = null;
    let pageTitle = 'Account';
    const cookieHeader = context.req?.headers?.cookie ?? '';

    if (!id) {
        try {
            const res = await fetch(`http://localhost:8000/api/getSessionData.php?data=account`, {
                credentials: "include",
                headers: cookieHeader ? { cookie: cookieHeader } : undefined
            });

            const data = await res.json();

            if (data && data.id) {
                id = data.id;
            }
        } catch (error) {
            console.error('Failed to load session data: '+error);
        }
    }
    
    try {
        const formData = new FormData();
        formData.append("id", id);

        // Send cookies read session in php
        const cookieHeader = context.req?.headers?.cookie ?? '';

        const response = await fetch('http://localhost:8000/api/getAccountData.php', {
            method: "POST",
            headers: cookieHeader ? { cookie: cookieHeader } : undefined,
            body: formData
        });

        const data = await response.json();
        
        if (data && data.success) {
            accountData = data.data;
        }
        else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Failed to fetch account info: '+error);
    }

    return {
        props: {
            accountData: accountData,
            pageTitle: pageTitle
        }
    }
}

// Main
export default function AccountPage({ accountData, pageTitle }) {
    const { randomIdeaId } = useAppContext();
    const [sessionData, setSessionData] = useState(null);

    // Load session data
    useEffect(() => {
        async function loadSessionData() {
            try {
                const res = await fetch(`/api/getSessionData.php?data=account`, {
                    credentials: "include"
                });

                const data = await res.json();

                setSessionData(data && data.id?data:null);
            } catch (error) {
                console.error('Failed to load session data: '+error);
            }
        }

        loadSessionData();
    }, []);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="accountMain">
                <aside id="accountAsideInfo">
                    {
                        accountData?.id === sessionData?.id?<img id="modifyAccountInfo" alt="Modify account" src="/images/modify.svg" />:null
                    }
                    <h1 id="userNameAccount">{accountData.username}</h1>
                    <img id="userImageAccount" alt="Account image" src={accountData.userimage} />
                    <h2 id="userNameSurnameAccount">{accountData.name+" "+accountData.surname}</h2>
                    <h3 id="emailAccount">{accountData.email}</h3>
                    {
                        accountData?.id !== sessionData?.id?
                        <div id="followReportAccountDiv">
                            <input type="button" id="followAccountButton" value="Follow Account" />
                            <input type="button" id="reportAccountButton" value="Report Account" />
                        </div>
                        :null
                    }
                    <p id="descriptionAccount">{accountData.description}</p>
                </aside>

                <section id="mainAccountSectionInfo">
                    <div id="navBarForAccountSaved">
                        <ul>
                            <li id="savedAccount"><img src="/images/saved.svg" alt="Saved" /> Saved</li>
                            <li id="publishedAccount"><img src="/images/publish.svg" alt="Published" /> Published</li>
                        </ul>
                    </div>
                    
                    <ul id="mainDivDinamicContent">
                        
                    </ul>
                </section>
            </main>

            <Footer />
        </>
    )
}