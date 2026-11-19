import React from 'react';

export default function WelcomeView({ username }) {
    return (
        <div className="adminWelcomeView">
            <p className="adminWelcomeEyebrow">Signed in as administrator</p>
            <h2>Welcome back, {username}.</h2>
            <p>Choose a workspace section from the sidebar to review platform data and moderation activity.</p>
        </div>
    )
}