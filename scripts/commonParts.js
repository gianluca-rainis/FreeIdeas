const nav = document.getElementById("nav");
const footer = document.getElementById("footer");
const metadata = document.head;

function loadNav() {
    if (nav) {
        nav.innerHTML = `
            <ul class="navLogo">
                <li><a href="./index.html"><img src="./images/FreeIdeas.svg" id="navLogo"></a></li>
            </ul>
            <ul class="navLinks">
                <li><a href="./searchAnIdea.html" class="navText">Search an Idea</a></li>
                <li><a href="" class="navText">Publish an Idea</a></li>
                <li><a href="" class="navText">Ask help for an Idea</a></li>
                <li><a href="" class="navText">Random Idea</a></li>
                <li><a class="navText" id="login">Login</a></li>
            </ul>
            <div id="loginArea">
                <h2>Sign In</h2>
                <p>Don't have an account? <a id="signUp">Register!</a></p>
                <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" required>
                <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" required>
                <button type="button" id="toggle-password-visibility">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                    </svg>
                </button>
                <p><a id="forgotPassword">Forgot your password?</a></p>
                <button type="submit" id="sendLoginButton">Sign In</button>
            </div>
        `;
    }
}

function loadFooter() {
    if (footer) {
        footer.innerHTML = `
            <ul>
                <li><a href="./privacyPolicy.html">Privacy Policy</a></li>
                <li><a href="./termsOfUse.html">Terms of Use</a></li>
                <li><a href="./license.html">License</a></li>
                <li><a href="./contacts.html">Contact Us</a></li>
                <li><a href="./about.html">About Us</a></li>
                <li><a href="https://github.com/rainis-gianluca/FreeIdeas.git"><img src="./images/github.png" id="githubLogo"></a></li>
            </ul>
            <hr>
            <section class="footerTextSection">
                <a href="./index.html" id="footerLogoA"><img src="./images/FreeIdeas.svg" id="footerLogo"></a>

                <ul class="footerText">
                    <li>Author: Gianluca Rainis ( __grdev on summer.hackclub.com )</li>
                    <li>This site was created for the Summer of Making 2025</li>
                </ul>
            </section>
        `;
    }
}

function loadMetadata() {
    if (metadata) {
        metadata.innerHTML = `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Free Ideas</title>
            <link rel="icon" href="./images/FreeIdeas.svg" type="image/x-ico" />
            <link href="./styles/styles.css" rel="stylesheet">
        `;
    }
}

loadMetadata();
loadNav();
loadFooter();

// LOGIN GESTOR
const loginButton = document.getElementById("login");
const loginArea = document.getElementById("loginArea");
let isLoginArea = true;

loginButton.addEventListener("click", () => {
    if (loginArea.style.display == "none" || !loginArea.style.display) {
        loginArea.style.display = "block";
    } else {
        loginArea.style.display = "none";
    }
});

function togglePasswordVisibility() {
    document.getElementById("toggle-password-visibility").addEventListener("click", () => {
        if (document.getElementById("passwordAreaLogin").type == "password" || !document.getElementById("passwordAreaLogin").type) {
            document.getElementById("passwordAreaLogin").type = "text";
            document.getElementById("toggle-password-visibility").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7904 11.9117L9.17617 10.2975C8.80858 10.4286 8.41263 10.5 8 10.5C6.067 10.5 4.5 8.933 4.5 7.00001C4.5 6.58738 4.5714 6.19143 4.70253 5.82384L2.64112 3.76243C0.938717 5.27903 0 7.00001 0 7.00001C0 7.00001 3 12.5 8 12.5C9.01539 12.5 9.9483 12.2732 10.7904 11.9117Z" fill="black"></path>
                <path d="M5.20967 2.08834C6.05172 1.72683 6.98462 1.50001 8 1.50001C13 1.50001 16 7.00001 16 7.00001C16 7.00001 15.0613 8.72098 13.3589 10.2376L11.2975 8.17615C11.4286 7.80857 11.5 7.41263 11.5 7.00001C11.5 5.06701 9.933 3.50001 8 3.50001C7.58738 3.50001 7.19144 3.57141 6.82386 3.70253L5.20967 2.08834Z" fill="black"></path>
                <path d="M5.52485 6.64616C5.50847 6.76175 5.5 6.87989 5.5 7.00001C5.5 8.38072 6.61929 9.50001 8 9.50001C8.12012 9.50001 8.23825 9.49154 8.35385 9.47516L5.52485 6.64616Z" fill="black"></path>
                <path d="M10.4752 7.35383L7.64618 4.52485C7.76176 4.50848 7.87989 4.50001 8 4.50001C9.38071 4.50001 10.5 5.6193 10.5 7.00001C10.5 7.12011 10.4915 7.23824 10.4752 7.35383Z" fill="black"></path>
                <path d="M13.6464 13.3536L1.64645 1.35356L2.35355 0.646454L14.3536 12.6465L13.6464 13.3536Z" fill="black"></path>
            </svg>`;
        } else {
            document.getElementById("passwordAreaLogin").type = "password";
            document.getElementById("toggle-password-visibility").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
            </svg>`;
        }
    });
}

function toggleSendLoginButton() {
    document.getElementById("sendLoginButton").addEventListener("click", () => {
        getDataForLogin();
    });
}

function signUpGestor() {
    document.getElementById("signUp").addEventListener("click", () => {
        if (isLoginArea) {
            loginArea.innerHTML = `<h2>Create your account</h2>
            <p>Already have an account? <a id="signUp">Sign In!</a></p>
            <input type="text" id="firstName" spellcheck="false" placeholder="First Name" required>
            <input type="text" id="lastName" spellcheck="false" placeholder="Last Name" required>
            <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" required>
            <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" required>
            <button type="button" id="toggle-password-visibility">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                    <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                </svg>
            </button>
            <p>By singing up you agree to our <a href="./termsOfUse.html">Terms of Use</a> and <a href="./privacyPolicy.html">Privacy Policy</a></p>
            <button type="submit" id="sendLoginButton">Create Account</button>`;

            isLoginArea = false;
            document.getElementById("toggle-password-visibility").style.top = "216px";
        } else {
            loginArea.innerHTML = `<h2>Sign In</h2>
            <p>Don't have an account? <a id="signUp">Register!</a></p>
            <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" required>
            <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" required>
            <button type="button" id="toggle-password-visibility">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                    <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                </svg>
            </button>
            <p><a id="forgotPassword">Forgot your password?</a></p>
            <button type="submit" id="sendLoginButton">Sign In</button>`;

            isLoginArea = true;
        }

        signUpGestor();
        togglePasswordVisibility();
        toggleSendLoginButton();
    });
}

function getDataForLogin() {
    const email = document.getElementById("emailAreaLogin").value;
    const password = document.getElementById("passwordAreaLogin").value;

    if (isLoginArea) {
        console.log(email+"  "+password);
    } else {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        
        console.log(email+"  "+password+"  "+firstName+"  "+lastName);
    }
}

togglePasswordVisibility();
toggleSendLoginButton();
signUpGestor();