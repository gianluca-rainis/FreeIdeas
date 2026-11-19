import styles from '@/styles/UnifiedPages.module.css'
import authStyles from '@/styles/AuthPages.module.css';
import '@/styles/ResponsivePages.module.css';
import '@/styles/ThemeAndBase.module.css';
import React, { useEffect, useRef } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Head from '@/components/Head'
import { useAppContext } from '@/contexts/CommonContext'
import { apiCall } from '@/utils/apiConfig'
import { positionPasswordToggleButtons } from '@/utils/passwordTogglePosition'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Login"
        }
    }
}

// Main
export default function LoginPage({pageTitle}) {
    const { randomIdeaId, showAlert } = useAppContext();
    const formRef = useRef(null);

    // Handle form submit
    useEffect(() => {
        const form = formRef.current;
        const forgotPassword = document.getElementById("forgotPasswordLoginPage");

        if (!form) {
            return;
        }

        async function handleSubmit(e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                await showAlert("You must fill in all required fields!");

                const invalids = form.querySelectorAll(":invalid");

                invalids.forEach(invalid => {
                    invalid.style.border = "3px solid #d31c1c";

                    function handleInputChange() {
                        if (invalid.checkValidity()) {
                            invalid.style.border = "";

                            invalid.removeEventListener("input", handleInputChange);
                            invalid.removeEventListener("change", handleInputChange);
                        }
                    }

                    invalid.removeEventListener("input", handleInputChange);
                    invalid.removeEventListener("change", handleInputChange);

                    invalid.addEventListener("input", handleInputChange);
                    invalid.addEventListener("change", handleInputChange);
                });

                if (invalids[0]) {
                    invalids[0].focus();
                }

                return;
            }

            try {
                const formData = new FormData(form);
                const data = await apiCall("/api/login", {
                    method: "POST",
                    body: formData
                });

                if (data && data['success']) {
                    window.location.href = "/";
                }
                else {
                    showAlert("Email or password are wrong");
                }
            } catch (error) {
                console.error(error);
                showAlert("An error occurred. Please try again.");
            }
        }

        async function handleForgotPassword() {
            const email = document.getElementById("emailLoginPage").value;

            if (email && email.includes("@") && email.includes(".")) {
                try {
                    const formData = new FormData();
                    formData.append("email", email);

                    const data = await apiCall("/api/changePassword", {
                        method: "POST",
                        body: formData
                    });

                    if (data['success']) {
                        showAlert("Email sent to: " + email + ". Remember to check your spam folder!");
                    }
                    else {
                        console.error(data['error']);
                        showAlert("Error sending email");
                    }
                } catch (error) {
                    console.error(error);
                    showAlert("An error occurred. Please try again.");
                }
            }
            else {
                showAlert("Insert a valid email");
            }
        }

        if (form) {
            form.addEventListener("submit", handleSubmit);
        }

        if (forgotPassword) {
            forgotPassword.addEventListener("click", handleForgotPassword);
        }

        return () => {
            if (form) {
                form.removeEventListener("submit", handleSubmit);
            }
            
            if (forgotPassword) {
                forgotPassword.removeEventListener("click", handleForgotPassword);
            }
        };
    }, []);

    // Handle password visibility button
    useEffect(() => {
        function positionTogglePasswordButton() {
            positionPasswordToggleButtons({
                form: formRef.current,
                inputSelectors: ['#passwordFormInputLoginPage']
            });
        }

        function togglePasswordButton() {
            if ((document.getElementById("passwordFormInputLoginPage").type == "password" || !document.getElementById("passwordFormInputLoginPage").type)) {
                document.getElementById("passwordFormInputLoginPage").type = "text";

                document.querySelector(".toggle-password-visibility-ext").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.7904 11.9117L9.17617 10.2975C8.80858 10.4286 8.41263 10.5 8 10.5C6.067 10.5 4.5 8.933 4.5 7.00001C4.5 6.58738 4.5714 6.19143 4.70253 5.82384L2.64112 3.76243C0.938717 5.27903 0 7.00001 0 7.00001C0 7.00001 3 12.5 8 12.5C9.01539 12.5 9.9483 12.2732 10.7904 11.9117Z" fill="black"></path>
                    <path d="M5.20967 2.08834C6.05172 1.72683 6.98462 1.50001 8 1.50001C13 1.50001 16 7.00001 16 7.00001C16 7.00001 15.0613 8.72098 13.3589 10.2376L11.2975 8.17615C11.4286 7.80857 11.5 7.41263 11.5 7.00001C11.5 5.06701 9.933 3.50001 8 3.50001C7.58738 3.50001 7.19144 3.57141 6.82386 3.70253L5.20967 2.08834Z" fill="black"></path>
                    <path d="M5.52485 6.64616C5.50847 6.76175 5.5 6.87989 5.5 7.00001C5.5 8.38072 6.61929 9.50001 8 9.50001C8.12012 9.50001 8.23825 9.49154 8.35385 9.47516L5.52485 6.64616Z" fill="black"></path>
                    <path d="M10.4752 7.35383L7.64618 4.52485C7.76176 4.50848 7.87989 4.50001 8 4.50001C9.38071 4.50001 10.5 5.6193 10.5 7.00001C10.5 7.12011 10.4915 7.23824 10.4752 7.35383Z" fill="black"></path>
                    <path d="M13.6464 13.3536L1.64645 1.35356L2.35355 0.646454L14.3536 12.6465L13.6464 13.3536Z" fill="black"></path>
                </svg>`;
            }
            else {
                document.getElementById("passwordFormInputLoginPage").type = "password";

                document.querySelector(".toggle-password-visibility-ext").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                    <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                </svg>`;
            }
        }

        // Position button on page load and window resize
        positionTogglePasswordButton();
        window.addEventListener('resize', positionTogglePasswordButton);

        /* TOGGLE PASSWORD IMAGE */
        document.querySelectorAll(".toggle-password-visibility-ext").forEach(element => element.addEventListener("click", togglePasswordButton));

        return () => {
            window.removeEventListener('resize', positionTogglePasswordButton);

            document.querySelectorAll(".toggle-password-visibility-ext").forEach(element => element.removeEventListener("click", togglePasswordButton));
        };
    }, []);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="loginMain" className={`${styles.scope} ${authStyles.authPage}`}>
                <section className={authStyles.authCard}>
                    <div className={authStyles.authIntro}>
                        <span className={authStyles.authKicker}>FreeIdeas / Community</span>
                        <h1>Ideas worth sharing.</h1>
                        <p>Welcome back. Sign in to keep exploring, saving and sharing ideas with the community.</p>
                        <div className={authStyles.authAccent} aria-hidden="true">+</div>
                    </div>

                    <div className={authStyles.authFormPanel}>
                        <p className={authStyles.authEyebrow}>Welcome back</p>
                        <h2>Sign in to FreeIdeas</h2>
                    
                        <form className={authStyles.authForm} action="/api/login" method="POST" ref={formRef} noValidate>
                            <div className={authStyles.authFields}>
                                <label className={authStyles.authField}>
                                    <span>Email address</span>
                                    <input type="email" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="you@example.com" name="email" maxLength={255} id="emailLoginPage" required />
                                </label>

                                <label className={authStyles.authField}>
                                    <span>Password</span>
                                    <input type="password" autoComplete="current-password" placeholder="Enter your password" name="password" id="passwordFormInputLoginPage" required />
                                </label>
                            </div>
                    
                            <button type="button" className={`${authStyles.passwordToggle} toggle-password-visibility-ext`} aria-label="Show password">
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                                <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                            </svg>
                            </button>

                            <div className={authStyles.authMeta}>
                                <a id="forgotPasswordLoginPage">Forgot your password?</a>
                            </div>

                            <button type="submit" id="signInLoginPageButton" className={authStyles.authPrimaryButton}>Sign In</button>
                        </form>

                        <p className={authStyles.authFooter}>Don't have an account? <a href="/createAccount">Create one</a></p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    )
}
