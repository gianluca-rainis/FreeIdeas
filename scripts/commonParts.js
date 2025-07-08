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
                <li><a href="./publishAnIdea.html" class="navText">Publish an Idea</a></li>
                <li><a href="" class="navText" id="randomIdeaA">Random Idea</a></li>
                <li id="themeImageLi"><img src="./images/sun-dark.svg" id="toggle-light-dark-theme"></li>
                <li id="userImageLi"><img src="./images/user.png" id="userImage"><p id="userName">Login</p></li>
            </ul>
            <div id="loginArea">
                <h2>Sign In</h2>
                <p>Don't have an account? <a id="signUp">Register!</a></p>
                <form action="./api/login.php" method="POST" id="loginCreateAccountForm">
                    <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                    <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" name="password" required>
                
                    <button type="button" id="toggle-password-visibility">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                        </svg>
                    </button>
                    <p><a id="forgotPassword">Forgot your password?</a></p>
                    <button type="submit" id="sendLoginButton">Sign In</button>
                </form>
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
                    <li>Copyright &copy; 2025 Gianluca Rainis</li>
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

// LIGHT DARK THEME
const lightDarkThemeButton = document.getElementById("toggle-light-dark-theme");
loadCurrentTheme();

lightDarkThemeButton.addEventListener("click", () =>{
    const currentSrc = lightDarkThemeButton.src;

    if (currentSrc.includes("/images/sun-dark.svg")) {
        toggleLightDarkThemeOnSessionData(false);
    }
    else if (currentSrc.includes("/images/sun-light.svg")) {
        toggleLightDarkThemeOnSessionData(true);
    }

    loadCurrentTheme();
});

async function toggleLightDarkThemeOnSessionData(isLight) {
    const theme = isLight?"light":"dark";
    
    try {
        await fetch(`./api/toggleLightDarkTheme.php?theme=${theme}`);
    } catch (error) {
        console.error("ERROR_TOGGLE_THEME: "+error);
    }
}

async function getSessionDataFromDatabaseTheme() {
    try {
        const res = await fetch(`./api/getSessionData.php?data=theme`, {
            credentials: "include"
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

async function loadCurrentTheme() {
    const theme = await getSessionDataFromDatabaseTheme();

    if (theme) {
        if (theme == "light") { // ========================================== TO FINISH LATHER ==========================================
            lightDarkThemeButton.src = "./images/sun-dark.svg";
        } else {
            lightDarkThemeButton.src = "./images/sun-light.svg";
        }
    }
    else {
        toggleLightDarkThemeOnSessionData(true);
        loadCurrentTheme();
    }
}

// RANDOM IDEA BUTTON
const randomLink = document.getElementById("randomIdeaA");
setRandomLinkForRandomIdea();

async function getRandomIdeaId() {
    try {
        const res = await fetch(`./api/getRandomIdeaId.php`, {
            credentials: "include"
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

async function setRandomLinkForRandomIdea() {
    const randomIdForRandomLink = await getRandomIdeaId();

    randomLink.href = `./ideaVoid.html?idea=${randomIdForRandomLink['id']}`;
}

// LOGIN GESTOR
const loginButton = document.getElementById("userImage");
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
    document.getElementById("loginCreateAccountForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
            const formData = new FormData(this);
            const response = await fetch(document.getElementById("loginCreateAccountForm").action, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data) {
                window.location.href = "./index.html";
            }
            else {
                if (!isLoginArea) {
                    printError(404);
                } else {
                    alert("Email or password are wrong");
                }
            }
        } catch (error) {
            printError(421);
        }
    });
}

async function toggleForgotPassword() {
    document.getElementById("forgotPassword").addEventListener("click", async () => {
        const email = document.getElementById("emailAreaLogin").value;
        
        if (email && email.includes("@") && email.includes(".")) {
            try {
                const formData = new FormData();
                formData.append("email", email);

                const response = await fetch("./api/forgotPassword.php", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data) {
                    alert("Sended email to: "+email);
                }
                else {
                    printError(421);
                }
            } catch (error) {
                console.log(error);
                printError(421);
            }
        } else {
            document.getElementById("emailAreaLogin").focus();

            alert("Insert a valid email");
        }
    });
}

function signUpGestor() {
    document.getElementById("signUp").addEventListener("click", () => {
        if (isLoginArea) {
            loginArea.innerHTML = `<h2>Create your account</h2>
            <p>Already have an account? <a id="signUp">Sign In!</a></p>
            <form action="./api/signUp.php" method="POST" id="loginCreateAccountForm">
                <input type="text" id="firstName" spellcheck="false" placeholder="First Name" name="firstName" required>
                <input type="text" id="lastName" spellcheck="false" placeholder="Last Name" name="lastName" required>
                <input type="text" id="userNameSignIn" spellcheck="false" placeholder="Username" name="userName" required>
                <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" name="password" required>
                <button type="button" id="toggle-password-visibility">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                    </svg>
                </button>
                <p>By singing up you agree to our <a href="./termsOfUse.html">Terms of Use</a> and <a href="./privacyPolicy.html">Privacy Policy</a></p>
                <button type="submit" id="sendLoginButton">Create Account</button>
            </form>`;

            isLoginArea = false;
            document.getElementById("toggle-password-visibility").style.top = "256px";
        } else {
            loginArea.innerHTML = `<h2>Sign In</h2>
            <p>Don't have an account? <a id="signUp">Register!</a></p>
            <form action="./api/login.php" method="POST" id="loginCreateAccountForm">
                <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" name="password" required>
                <button type="button" id="toggle-password-visibility">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                    </svg>
                </button>
                <p><a id="forgotPassword">Forgot your password?</a></p>
                <button type="submit" id="sendLoginButton">Sign In</button>
            </form>`;

            isLoginArea = true;

            toggleForgotPassword();
        }

        signUpGestor();
        togglePasswordVisibility();
        toggleSendLoginButton();
    });
}

toggleForgotPassword();
togglePasswordVisibility();
toggleSendLoginButton();
signUpGestor();

/* LOGIN GESTOR */

let error = false; // Error variable to print only the most specific error
let tempBoolControl = false;

ldAccountData();

async function ldAccountData() {
    const SQLdata = await getDataFromDatabase();

    if (SQLdata) {
        loadData(SQLdata);
    }
}

async function getDataFromDatabase() {
    try {
        const res = await fetch(`./api/getSessionData.php?data=account`, {
            credentials: "include"
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

function printError(errorCode) {
    if (!error) {
        document.querySelector("main").innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        document.querySelector("main").style.textAlign = "center";
        
        if (document.querySelector("header")) {
            document.querySelector("header").innerHTML = "";
            document.querySelector("header").style.visibility = "hidden";
        }

        error = true;
    }
}

function loadData(SQLdata) {
    try {
        loginButton.src = SQLdata['userimage']!=null?SQLdata['userimage']:"./images/user.png";
        document.getElementById("userName").innerHTML = SQLdata['username'];

        loginArea.innerHTML = `<h2>Welcome ${SQLdata['username']}</h2>
            <img src="${SQLdata['userimage']!=null?SQLdata['userimage']:"./images/user.png"}" style="width: 60px; height: 60px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
            <h3 style="margin-bottom: 20px">${SQLdata['name']} ${SQLdata['surname']}</h3>
            <button type="submit" id="sendAccountButton">Account</button>
            <button type="submit" id="sendLogoutButton">Log Out</button>`;

        document.getElementById("sendAccountButton").addEventListener("click", () => {
            window.location.href = "./accountVoid.html";
        });

        document.getElementById("sendLogoutButton").addEventListener("click", () => {
            try {
                fetch("./api/logout.php");
            } catch (error) {
                printError(421);
            }

            window.location.href = "./index.html";
        });
    } catch (error) {
        printError(404);
    }
}