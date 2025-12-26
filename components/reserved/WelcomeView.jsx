import React from 'react';

export default function WelcomeView({ username }) {
    return (
        <div style={{width: "100%"}}>
            <img src="/images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" className="logo" />
            <h1 style={{ paddingBottom: '5%' }}>Welcome {username}</h1>
        </div>
    )
}