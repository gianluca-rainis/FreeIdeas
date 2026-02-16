import React, { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Head from '../components/Head'
import { useAppContext } from '../contexts/CommonContext'
import { apiCall } from '../utils/apiConfig'

// Server-side rendering for initial data
export async function getStaticProps() {
    return {
        props: {
            pageTitle: "Create Account"
        }
    }
}

// Main
export default function CreateAccountPage({pageTitle}) {
    const { randomIdeaId, showAlert } = useAppContext();
    const formRef = useRef(null);
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [newAccountData, setnewAccountData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: ""
    });
    
    // Handle form submit
    useEffect(() => {
        const form = formRef.current;

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

            if (!showOtpStep && form.firstName && form.firstName.value && form.lastName.value && form.userName.value && form.email.value && form.password.value) {
                setnewAccountData({
                    firstname: form.firstName.value,
                    lastname: form.lastName.value,
                    username: form.userName.value,
                    email: form.email.value,
                    password: form.password.value
                });

                try {
                    const formData = new FormData(form);
                    const data = await apiCall('/api/signUpPrecheck', {
                        method: "POST",
                        body: formData
                    });

                    if (!data || !data['success']) {
                        throw new Error(data['error']);
                    }
                    
                    setShowOtpStep(true);
                } catch (error) {
                    console.error(error);
                    showAlert(error instanceof Error ? error.message : String(error));
                }

                return;
            }

            try {
                const formData = new FormData();
                formData.append("email", newAccountData.email);
                formData.append("password", newAccountData.password);
                formData.append("firstName", newAccountData.firstname);
                formData.append("lastName", newAccountData.lastname);
                formData.append("userName", newAccountData.username);
                formData.append("otp", form.emailOTP.value);

                const data = await apiCall(form.action, {
                    method: "POST",
                    body: formData
                });

                if (data && data['success']) {
                    window.location.href = "/";
                }
                else {
                    throw new Error(data['error']);
                }
            } catch (error) {
                console.error(error);
                showAlert(error instanceof Error ? error.message : String(error));
            }
        }

        if (form) {
            form.addEventListener("submit", handleSubmit);
        }

        return () => {
            if (form) {
                form.removeEventListener("submit", handleSubmit);
            }
        };
    }, [showAlert, showOtpStep, newAccountData]);

    // Handle password visibility button
    useEffect(() => {
        if (showOtpStep) {
            return;
        }
        
        function positionTogglePasswordButton() {
            const passwordInput = document.getElementById("passwordFormInputLoginPage");
            const toggleButton = document.querySelector(".toggle-password-visibility-ext");
            
            if (passwordInput && toggleButton) {
                const inputRect = passwordInput.getBoundingClientRect();
                const formRect = passwordInput.closest('form').getBoundingClientRect();
                
                // Calculate position relative to form
                const topPosition = inputRect.top - formRect.top + (inputRect.height / 2);
                
                toggleButton.style.top = topPosition + 'px';
                toggleButton.style.right = '10px';
            }
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
    }, [showOtpStep]);

    return (
        <>
            <Head pageTitle={pageTitle} />

            <Nav randomId={randomIdeaId} />

            <main id="loginMain">
                <section>
                    <h1>Create your account</h1>
                    
                    <form action="/api/signUp" method="POST" ref={formRef} noValidate>
                        {!showOtpStep ? (
                            <React.Fragment key="signup-step">
                                <input type="text" spellCheck="false" autoComplete="given-name" placeholder="First Name" name="firstName" maxLength={255} defaultValue={newAccountData.firstname} required />
                                <input type="text" spellCheck="false" autoComplete="family-name" placeholder="Last Name" name="lastName" maxLength={255} defaultValue={newAccountData.lastname} required />
                                <input type="text" spellCheck="false" autoComplete="username" placeholder="Username" name="userName" maxLength={255} defaultValue={newAccountData.username} required />
                                <input type="email" autoComplete="email" spellCheck="false" autoCapitalize="off" placeholder="Email" name="email" maxLength={255} defaultValue={newAccountData.email} required />
                                <input type="password" autoComplete="current-password" placeholder="Password" name="password" id="passwordFormInputLoginPage" defaultValue={newAccountData.password} required />
                            
                                <button type="button" className="toggle-password-visibility-ext">
                                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                                    </svg>
                                </button>
                            </React.Fragment>
                        ) : (
                            <React.Fragment key="otp-step">
                                <p>We've sent a 6-digit OTP to the email address you provided. If you don't see the email, check your spam folder.</p>

                                <input type="password" spellCheck="false" autoComplete="one-time-code" placeholder="Email OTP" name="emailOTP" maxLength={6} minLength={6} required />
                            </React.Fragment>
                        )}

                        <p>By singing up you agree to our <a href="./termsOfUse">Terms of Use</a> and <a href="./privacyPolicy">Privacy Policy</a></p>

                        <button type="submit" id="signInLoginPageButton">Create Account</button>
                        {showOtpStep && (
                            <button type="button" id="signInLoginPageCancelButton" onClick={() => setShowOtpStep(false)}>Cancel</button>
                        )}
                    </form>

                    <p>Already have an account? <a href="./login">Sign In!</a></p>
                </section>
            </main>

            <Footer />
        </>
    )
}