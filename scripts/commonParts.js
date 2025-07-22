const nav = document.getElementById("nav");
const footer = document.getElementById("footer");

function loadNav() {
    if (nav) {
        nav.innerHTML = `
        <div id="pcNavBarGhost">
            <ul class="navLogo">
                <li><a href="./index.php"><img src="./images/FreeIdeas.svg" id="navLogo"></a></li>
            </ul>
            <ul class="navLinks">
                <li><a href="./searchAnIdea.php" class="navText">Search an Idea</a></li>
                <li><a href="./publishAnIdea.php" class="navText">Publish an Idea</a></li>
                <li><a href="" class="navText" id="randomIdeaA">Random Idea</a></li>
                <li id="themeImageLi"><img src="./images/sun-dark.svg" class="toggle-light-dark-theme"></li>
                <li id="userImageLi"><img src="./images/user.svg" id="userImage"><p id="userName">Login</p></li>
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
        </div>

        <div id="mobileNavBarGhost">
            <ul class="navLogo">
                <li><a href="./index.php"><img src="./images/FreeIdeas.svg" id="navLogo"></a></li>
            </ul>
            <ul class="navLinks">
                <li id="themeImageLiMobile"><img src="./images/sun-dark.svg" class="toggle-light-dark-theme"></li>
                <li id="userImageLi"><img src="./images/menu.svg" id="menuMobile"></li>
            </ul>
            <div id="mobileMenuHidden">
                <ul id="mobileNavLinks">
                    <li><a href="./searchAnIdea.php" class="navText">Search an Idea</a></li>
                    <li><a href="./publishAnIdea.php" class="navText">Publish an Idea</a></li>
                    <li><a href="" class="navText" id="randomIdeaAMobile">Random Idea</a></li>
                </ul>

                <div id="loginAreaMobile">
                    <h2>Sign In</h2>
                    <p>Don't have an account? <a id="signUpMobile">Register!</a></p>
                    <form action="./api/login.php" method="POST" id="loginCreateAccountFormMobile">
                        <input type="email" id="emailAreaLoginMobile" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                        <input type="password" id="passwordAreaLoginMobile" autocomplete="current-password" placeholder="Password" name="password" required>
                    
                        <button type="button" id="toggle-password-visibility-mobile">
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                                <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                            </svg>
                        </button>
                        <p><a id="forgotPassword">Forgot your password?</a></p>
                        <button type="submit" id="sendLoginButtonMobile">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
        `;
    }
}

function loadFooter() {
    if (footer) {
        footer.innerHTML = `
            <ul>
                <li><a href="./privacyPolicy.php">Privacy Policy</a></li>
                <li><a href="./termsOfUse.php">Terms of Use</a></li>
                <li><a href="./license_info.php">License</a></li>
                <li><a href="./contacts.php">Contact Us</a></li>
                <li><a href="./about.php">About Us</a></li>
                <li><a href="https://github.com/rainis-gianluca/FreeIdeas.git"><img src="./images/github.svg" id="githubLogo"></a></li>
            </ul>
            <hr>
            <section class="footerTextSection">
                <a href="./index.php" id="footerLogoA"><img src="./images/FreeIdeas.svg" id="footerLogo"></a>

                <ul class="footerText">
                    <li>Copyright &copy; 2025 Gianluca Rainis</li>
                </ul>
            </section>
        `;
    }
}

loadNav();
loadFooter();

// LIGHT DARK THEME
const lightDarkThemeButton = document.querySelectorAll(".toggle-light-dark-theme");
let logos = [document.getElementById("pcNavBarGhost").querySelector("#navLogo"), document.getElementById("mobileNavBarGhost").querySelector("#navLogo"), document.getElementById("footerLogo")]; // FreeIdeas logos

window.location.pathname.includes("/about.php")?logos.push(document.querySelector(".footerpage").querySelector(".logo")):null;
window.location.pathname.includes("/contacts.php")?logos.push(document.querySelector(".footerpage").querySelector(".logo")):null;

let themeIsLight = true; // Main bool for theme control
loadCurrentTheme();

lightDarkThemeButton.forEach(button => {
    button.addEventListener("click", () =>{
        const currentSrc = button.src;

        if (currentSrc.includes("/images/sun-dark.svg")) {
            themeIsLight = false;
        }
        else if (currentSrc.includes("/images/sun-light.svg")) {
            themeIsLight = true;
        }

        localStorage.setItem("themeIsLight", themeIsLight);

        loadCurrentTheme();
    });
});

function loadCurrentTheme() {
    if (localStorage.getItem("themeIsLight")) {
        themeIsLight = localStorage.getItem("themeIsLight")==="true"?true:false;
    }

    if (themeIsLight) {
        if (themeIsLight) {
            lightDarkThemeButton.forEach(button => {
                button.src = "./images/sun-dark.svg";
                document.documentElement.setAttribute("data-theme", "light");
            });
        }

        document.getElementById("githubLogo").src = "./images/github.svg";
    }
    else {
        lightDarkThemeButton.forEach(button => {
            button.src = "./images/sun-light.svg";
            document.documentElement.setAttribute("data-theme", "dark");
        });

        document.getElementById("githubLogo").src = "./images/github-white.svg";
    }

    logos.forEach(logo => {
        logo.src = `./images/FreeIdeas${themeIsLight?"":"_Pro"}.svg`;
    });

    toggleThemeInAllFiles();
}

// Variables used by the load theme functions

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', event => {
    const newColorScheme = event.matches?true:false;

    themeIsLight = newColorScheme;
    localStorage.setItem("themeIsLight", themeIsLight);
    loadCurrentTheme();
});

function toggleThemeInAllFiles() {
    document.getElementById("mobileNavBarGhost").querySelector("#menuMobile").src = `./images/menu${themeIsLight?"":"_Pro"}.svg`;

    if (document.getElementById("userImage").src.includes("/images/user")) {
        document.getElementById("userImage").src = `./images/user${themeIsLight?"":"_Pro"}.svg`;
    }
    
    if (window.location.href.includes("/publishAnIdea.php")) {
        document.getElementById("addAdditionalInfo").src = `./images/add${themeIsLight?"":"_Pro"}.svg`;
        document.getElementById("addLog").src = `./images/add${themeIsLight?"":"_Pro"}.svg`;
        document.getElementById("cancelNewIdea").src = `./images/delete${themeIsLight?"":"_Pro"}.svg`;
    }

    if (window.location.href.includes("/accountVoid.php")) {
        document.getElementById("publishedAccount").children.item(0).src = `./images/publish${themeIsLight?"":"_Pro"}.svg`;
        document.getElementById("savedAccount").children.item(0).src = `./images/saved${themeIsLight?"":"_Pro"}.svg`;
    }

    if (window.location.href.includes("/ideaVoid.php")) {
        document.getElementById("modifyOldIdea").src = `./images/modify${themeIsLight?"":"_Pro"}.svg`;
    }
}

// RANDOM IDEA BUTTON
const randomLink = document.getElementById("randomIdeaA");
const randomLinkMobile = document.getElementById("randomIdeaAMobile");
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

    randomLink.href = `./ideaVoid.php?idea=${randomIdForRandomLink['id']}`;
    randomLinkMobile.href = `./ideaVoid.php?idea=${randomIdForRandomLink['id']}`;
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
                window.location.href = "./index.php";
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
                <input type="text" id="firstName" spellcheck="false" placeholder="First Name" name="firstName" maxlength="255" required>
                <input type="text" id="lastName" spellcheck="false" placeholder="Last Name" name="lastName" maxlength="255" required>
                <input type="text" id="userNameSignIn" spellcheck="false" placeholder="Username" name="userName" maxlength="255" required>
                <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" maxlength="255" name="email" required>
                <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" name="password" maxlength="255" required>
                <button type="button" id="toggle-password-visibility">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                    </svg>
                </button>
                <p>By singing up you agree to our <a href="./termsOfUse.php">Terms of Use</a> and <a href="./privacyPolicy.php">Privacy Policy</a></p>
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
        loginButton.src = SQLdata['userimage']!=null?SQLdata['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`;
        document.getElementById("userName").innerHTML = SQLdata['username'];

        loginArea.innerHTML = `<h2>Welcome ${SQLdata['username']}</h2>
            <img src="${SQLdata['userimage']!=null?SQLdata['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`}" style="width: 60px; height: 60px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
            <h3 style="margin-bottom: 20px">${SQLdata['name']} ${SQLdata['surname']}</h3>
            <button type="submit" id="sendAccountButton">Account</button>
            <button type="submit" id="sendLogoutButton">Log Out</button>`;

        loginAreaMobile.innerHTML = `<h2>Welcome ${SQLdata['username']}</h2>
            <div style="align-items: center;">
                <img src="${SQLdata['userimage']!=null?SQLdata['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`}" style="width: 100px; height: 100px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
            </div>
            <h3 style="margin-bottom: 20px">${SQLdata['name']} ${SQLdata['surname']}</h3>
            <div style="align-items: center;">
                <button type="submit" id="sendAccountButtonMobile">Account</button>
                <button type="submit" id="sendLogoutButtonMobile">Log Out</button>
            </div>`;

        document.getElementById("sendAccountButton").addEventListener("click", () => {
            window.location.href = "./accountVoid.php";
        });

        document.getElementById("sendAccountButtonMobile").addEventListener("click", () => {
            window.location.href = "./accountVoid.php";
        });

        document.getElementById("sendLogoutButton").addEventListener("click", () => {
            try {
                fetch("./api/logout.php");
            } catch (error) {
                printError(421);
            }

            window.location.href = "./index.php";
        });

        document.getElementById("sendLogoutButtonMobile").addEventListener("click", () => {
            try {
                fetch("./api/logout.php");
            } catch (error) {
                printError(421);
            }

            window.location.href = "./index.php";
        });
    } catch (error) {
        printError(404);
    }
}

/* MOBILE MENU GESTOR */
const menuMobileButton = document.getElementById("menuMobile");
const mobileMenuHidden = document.getElementById("mobileMenuHidden");

menuMobileButton.addEventListener("click", () => {
    if (mobileMenuHidden.style.display == "none" || !mobileMenuHidden.style.display) {
        mobileMenuHidden.style.display = "flex";
    } else {
        mobileMenuHidden.style.display = "none";
    }
});

/* MOBILE LOGIN GESTOR */
const loginAreaMobile = document.getElementById("loginAreaMobile");
isLoginArea = true;

function togglePasswordVisibilityMobile() {
    document.getElementById("toggle-password-visibility-mobile").addEventListener("click", () => {
        if (document.getElementById("passwordAreaLoginMobile").type == "password" || !document.getElementById("passwordAreaLoginMobile").type) {
            document.getElementById("passwordAreaLoginMobile").type = "text";
            document.getElementById("toggle-password-visibility-mobile").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7904 11.9117L9.17617 10.2975C8.80858 10.4286 8.41263 10.5 8 10.5C6.067 10.5 4.5 8.933 4.5 7.00001C4.5 6.58738 4.5714 6.19143 4.70253 5.82384L2.64112 3.76243C0.938717 5.27903 0 7.00001 0 7.00001C0 7.00001 3 12.5 8 12.5C9.01539 12.5 9.9483 12.2732 10.7904 11.9117Z" fill="black"></path>
                <path d="M5.20967 2.08834C6.05172 1.72683 6.98462 1.50001 8 1.50001C13 1.50001 16 7.00001 16 7.00001C16 7.00001 15.0613 8.72098 13.3589 10.2376L11.2975 8.17615C11.4286 7.80857 11.5 7.41263 11.5 7.00001C11.5 5.06701 9.933 3.50001 8 3.50001C7.58738 3.50001 7.19144 3.57141 6.82386 3.70253L5.20967 2.08834Z" fill="black"></path>
                <path d="M5.52485 6.64616C5.50847 6.76175 5.5 6.87989 5.5 7.00001C5.5 8.38072 6.61929 9.50001 8 9.50001C8.12012 9.50001 8.23825 9.49154 8.35385 9.47516L5.52485 6.64616Z" fill="black"></path>
                <path d="M10.4752 7.35383L7.64618 4.52485C7.76176 4.50848 7.87989 4.50001 8 4.50001C9.38071 4.50001 10.5 5.6193 10.5 7.00001C10.5 7.12011 10.4915 7.23824 10.4752 7.35383Z" fill="black"></path>
                <path d="M13.6464 13.3536L1.64645 1.35356L2.35355 0.646454L14.3536 12.6465L13.6464 13.3536Z" fill="black"></path>
            </svg>`;
        } else {
            document.getElementById("passwordAreaLoginMobile").type = "password";
            document.getElementById("toggle-password-visibility-mobile").innerHTML = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
            </svg>`;
        }
    });
}

function toggleSendLoginButtonMobile() {
    document.getElementById("loginCreateAccountFormMobile").addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
            const formData = new FormData(this);
            const response = await fetch(document.getElementById("loginCreateAccountFormMobile").action, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data) {
                window.location.href = "./index.php";
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

function signUpGestorMobile() {
    document.getElementById("signUpMobile").addEventListener("click", () => {
        if (isLoginArea) {
            loginAreaMobile.innerHTML = `<h2>Create your account</h2>
            <p>Already have an account? <a id="signUpMobile">Sign In!</a></p>
            <form action="./api/signUp.php" method="POST" id="loginCreateAccountFormMobile">
                <input type="text" id="firstNameMobile" spellcheck="false" placeholder="First Name" name="firstName" required>
                <input type="text" id="lastNameMobile" spellcheck="false" placeholder="Last Name" name="lastName" required>
                <input type="text" id="userNameSignInMobile" spellcheck="false" placeholder="Username" name="userName" required>
                <input type="email" id="emailAreaLoginMobile" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                <input type="password" id="passwordAreaLoginMobile" autocomplete="current-password" placeholder="Password" name="password" required>
                <button type="button" id="toggle-password-visibility-mobile">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                        <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                    </svg>
                </button>
                <p>By singing up you agree to our <a href="./termsOfUse.php">Terms of Use</a> and <a href="./privacyPolicy.php">Privacy Policy</a></p>
                <button type="submit" id="sendLoginButtonMobile">Create Account</button>
            </form>`;

            document.getElementById("toggle-password-visibility-mobile").style.top = window.innerHeight>785?"542px":"441px";
            isLoginArea = false;
        } else {
            loginAreaMobile.innerHTML = `<h2>Sign In</h2>
                <p>Don't have an account? <a id="signUpMobile">Register!</a></p>
                <form action="./api/login.php" method="POST" id="loginCreateAccountFormMobile">
                    <input type="email" id="emailAreaLoginMobile" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                    <input type="password" id="passwordAreaLoginMobile" autocomplete="current-password" placeholder="Password" name="password" required>
                
                    <button type="button" id="toggle-password-visibility-mobile">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                        </svg>
                    </button>
                    <p><a id="forgotPassword">Forgot your password?</a></p>
                    <button type="submit" id="sendLoginButtonMobile">Sign In</button>
                </form>`;

            isLoginArea = true;
        }

        signUpGestorMobile();
        togglePasswordVisibilityMobile();
        toggleSendLoginButtonMobile();
    });
}

togglePasswordVisibilityMobile();
toggleSendLoginButtonMobile();
signUpGestorMobile();

/* TOGGLE WINDOW SIZE */
window.addEventListener("resize", () => {
    toggleWindowSize();
});

function toggleWindowSize() {
    if (!isLoginArea) {
        document.getElementById("toggle-password-visibility-mobile").style.top = window.innerHeight>785?"542px":"441px";
    }
}

toggleWindowSize();