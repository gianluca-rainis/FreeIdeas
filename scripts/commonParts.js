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

    if (document.querySelectorAll(".notificationsImg").forEach(element => element.src.includes("/images/notifications_active"))) {
        document.querySelectorAll(".notificationsImg").forEach(element => element.src = `./images/notifications_active${themeIsLight?"":"_Pro"}.svg`);
    }
    else if (document.querySelectorAll(".notificationsImg").forEach(element => element.src.includes("/images/notifications"))) {
        document.querySelectorAll(".notificationsImg").forEach(element => element.src = `./images/notifications${themeIsLight?"":"_Pro"}.svg`);
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
        if (!(document.getElementById("notificaions").style.display != "none")) {
            loginArea.style.display = "none";
        }
    }

    if (document.getElementById("notificaions").style.display != "none") {
        document.getElementById("loginHidden").style.display = "block";
        document.getElementById("signUpHidden").style.display = "none";

        document.getElementById("notificaions").style.display = "none";

        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.style.top = "135px");

        isLoginArea = true;
    }
});

/* TOGGLE PASSWORD IMAGE */
document.querySelectorAll(".toggle-password-visibility").forEach(element => element.addEventListener("click", () => {
    if ((document.getElementById("passwordAreaLogin").type == "password" || !document.getElementById("passwordAreaLogin").type) || (document.getElementById("passwordAreaSignIn").type == "password" || !document.getElementById("passwordAreaSignIn").type)) {
        document.getElementById("passwordAreaLogin").type = "text";
        document.getElementById("passwordAreaSignIn").type = "text";
        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.innerHTML = `<svg width="16" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7904 11.9117L9.17617 10.2975C8.80858 10.4286 8.41263 10.5 8 10.5C6.067 10.5 4.5 8.933 4.5 7.00001C4.5 6.58738 4.5714 6.19143 4.70253 5.82384L2.64112 3.76243C0.938717 5.27903 0 7.00001 0 7.00001C0 7.00001 3 12.5 8 12.5C9.01539 12.5 9.9483 12.2732 10.7904 11.9117Z" fill="black"></path>
            <path d="M5.20967 2.08834C6.05172 1.72683 6.98462 1.50001 8 1.50001C13 1.50001 16 7.00001 16 7.00001C16 7.00001 15.0613 8.72098 13.3589 10.2376L11.2975 8.17615C11.4286 7.80857 11.5 7.41263 11.5 7.00001C11.5 5.06701 9.933 3.50001 8 3.50001C7.58738 3.50001 7.19144 3.57141 6.82386 3.70253L5.20967 2.08834Z" fill="black"></path>
            <path d="M5.52485 6.64616C5.50847 6.76175 5.5 6.87989 5.5 7.00001C5.5 8.38072 6.61929 9.50001 8 9.50001C8.12012 9.50001 8.23825 9.49154 8.35385 9.47516L5.52485 6.64616Z" fill="black"></path>
            <path d="M10.4752 7.35383L7.64618 4.52485C7.76176 4.50848 7.87989 4.50001 8 4.50001C9.38071 4.50001 10.5 5.6193 10.5 7.00001C10.5 7.12011 10.4915 7.23824 10.4752 7.35383Z" fill="black"></path>
            <path d="M13.6464 13.3536L1.64645 1.35356L2.35355 0.646454L14.3536 12.6465L13.6464 13.3536Z" fill="black"></path>
        </svg>`);
    } else {
        document.getElementById("passwordAreaLogin").type = "password";
        document.getElementById("passwordAreaSignIn").type = "password";
        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.innerHTML = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
        </svg>`);
    }
}));

/* SEND FORM AREA */
document.getElementById("loginAccountForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        const formData = new FormData(this);
        const response = await fetch(document.getElementById("loginAccountForm").action, {
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

document.getElementById("createAccountForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        const formData = new FormData(this);
        const response = await fetch(document.getElementById("createAccountForm").action, {
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

/* FORGOT PASSWORD BUTTON GESTOR */
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

/* TOGGLE LOGIN / SIGN UP AREAS */
document.querySelectorAll(".signUp").forEach(element => element.addEventListener("click", () => {
    if (isLoginArea) {
        document.getElementById("loginHidden").style.display = "none";
        document.getElementById("signUpHidden").style.display = "block";
        document.getElementById("notificaions").style.display = "none";
        document.getElementById("notificaionsMobile").style.display = "none";

        isLoginArea = false;
        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.style.top = "256px");
    } else {
        document.getElementById("signUpHidden").style.display = "none";
        document.getElementById("loginHidden").style.display = "block";
        document.getElementById("notificaions").style.display = "none";
        document.getElementById("notificaionsMobile").style.display = "none";

        isLoginArea = true;
        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.style.top = "135px");
    }
}));

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
            <img src="${SQLdata['userimage']!=null?SQLdata['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`}" alt="User Image" style="width: 60px; height: 60px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
            <h3 style="margin-bottom: 20px">${SQLdata['name']} ${SQLdata['surname']}</h3>
            <button type="submit" id="sendAccountButton">Account</button>
            <button type="submit" id="sendLogoutButton">Log Out</button>`;

        loginAreaMobile.innerHTML = `<h2>Welcome ${SQLdata['username']}</h2>
            <div style="align-items: center;">
                <img src="${SQLdata['userimage']!=null?SQLdata['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`}" alt="User Image" style="width: 100px; height: 100px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
            </div>
            <h3 style="margin-bottom: 20px">${SQLdata['name']} ${SQLdata['surname']}</h3>
            <div style="align-items: center;">
                <button type="submit" id="sendAccountButtonMobile">Account</button>
                <button type="submit" id="sendLogoutButtonMobile">Log Out</button>
            </div>`;

        function loadNotifications(SQLdata) {
            const notificationPc = document.querySelectorAll(".notificationsImg");
            let numNewNotifications = 0;

            let notificationsShowOrder = [];

            /* Order by data the notifications (from the oldest to the newest) */
            function orderByData(array) {
                return array.sort((a, b) => {
                    let dateA = new Date(a['data']);
                    let dateB = new Date(b['data']);
                    return dateB - dateA;
                });
            }

            /* Order by not-read first notifications */
            function orderByNotReaded(array) {                
                return array.sort((a, b) => {
                    return a['status'] - b['status'];
                });
            }

            notificationsShowOrder = orderByData(SQLdata['notifications']); // Ordered by data, to order by to read - readed
            notificationsShowOrder = orderByNotReaded(notificationsShowOrder); // Ordered by data, to order by to read - readed

            notificationsShowOrder.forEach(notification => {
                if (notification['status'] == 0) {
                    numNewNotifications++;
                }
            });

            if (numNewNotifications != 0) {
                notificationPc.forEach(element => element.src = `./images/notifications_active${themeIsLight?"":"_Pro"}.svg`);
            }

            /* LOAD DATA */
        }

        loadNotifications(SQLdata);

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

/* NOTIFICATIONS EVENTLISTENER */
document.querySelectorAll(".notificationsImg").forEach(element => element.addEventListener("click", () => {
    if ((document.getElementById("loginArea").style.display == "none" || document.getElementById("mobileMenuHidden").style.display == "none" || !document.getElementById("loginArea").style.display || !document.getElementById("mobileMenuHidden").style.display) || document.getElementById("notificaions").style.display == "none" || document.getElementById("notificaionsMobile").style.display == "none") {
        document.getElementById("loginArea").style.display = "block";
        document.getElementById("mobileMenuHidden").style.display = "flex";
        
        document.getElementById("loginHidden").style.display = "none";
        document.getElementById("signUpHidden").style.display = "none";
        document.getElementById("loginHiddenMobile").style.display = "none";
        document.getElementById("signUpHiddenMobile").style.display = "none";
        
        document.getElementById("notificaions").style.display = "block";
        document.getElementById("notificaionsMobile").style.display = "block";

        isLoginArea = false;
    }
    else {
        document.getElementById("loginArea").style.display = "none";
        document.getElementById("mobileMenuHidden").style.display = "none";

        document.getElementById("notificaions").style.display = "none";
        document.getElementById("notificaionsMobile").style.display = "none";

        document.getElementById("loginHidden").style.display = "block";
        document.getElementById("signUpHidden").style.display = "none";
        document.getElementById("loginHiddenMobile").style.display = "block";
        document.getElementById("signUpHiddenMobile").style.display = "none";

        isLoginArea = true;
    }
}));

/* MOBILE MENU GESTOR */
const menuMobileButton = document.getElementById("menuMobile");
const mobileMenuHidden = document.getElementById("mobileMenuHidden");

menuMobileButton.addEventListener("click", () => {
    if (mobileMenuHidden.style.display == "none" || !mobileMenuHidden.style.display) {
        mobileMenuHidden.style.display = "flex";
    } else {
        if (!(document.getElementById("notificaionsMobile").style.display != "none")) {
            mobileMenuHidden.style.display = "none";
        }
    }

    if (document.getElementById("notificaionsMobile").style.display != "none") {
        document.getElementById("loginHiddenMobile").style.display = "block";
        document.getElementById("signUpHiddenMobile").style.display = "none";

        document.getElementById("notificaionsMobile").style.display = "none";

        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.style.top = window.innerHeight>785?"390px":"320px");

        isLoginArea = true;
    }
});

/* MOBILE LOGIN GESTOR */
const loginAreaMobile = document.getElementById("loginAreaMobile");
isLoginArea = true;

document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.addEventListener("click", () => {
    if ((document.getElementById("passwordAreaLoginMobile").type == "password" || !document.getElementById("passwordAreaLoginMobile").type) || (document.getElementById("passwordAreaSignUpMobile").type == "password" || !document.getElementById("passwordAreaSignUpMobile").type)) {
        document.getElementById("passwordAreaLoginMobile").type = "text";
        document.getElementById("passwordAreaSignUpMobile").type = "text";
        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.innerHTML = `<svg width="16" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.7904 11.9117L9.17617 10.2975C8.80858 10.4286 8.41263 10.5 8 10.5C6.067 10.5 4.5 8.933 4.5 7.00001C4.5 6.58738 4.5714 6.19143 4.70253 5.82384L2.64112 3.76243C0.938717 5.27903 0 7.00001 0 7.00001C0 7.00001 3 12.5 8 12.5C9.01539 12.5 9.9483 12.2732 10.7904 11.9117Z" fill="black"></path>
            <path d="M5.20967 2.08834C6.05172 1.72683 6.98462 1.50001 8 1.50001C13 1.50001 16 7.00001 16 7.00001C16 7.00001 15.0613 8.72098 13.3589 10.2376L11.2975 8.17615C11.4286 7.80857 11.5 7.41263 11.5 7.00001C11.5 5.06701 9.933 3.50001 8 3.50001C7.58738 3.50001 7.19144 3.57141 6.82386 3.70253L5.20967 2.08834Z" fill="black"></path>
            <path d="M5.52485 6.64616C5.50847 6.76175 5.5 6.87989 5.5 7.00001C5.5 8.38072 6.61929 9.50001 8 9.50001C8.12012 9.50001 8.23825 9.49154 8.35385 9.47516L5.52485 6.64616Z" fill="black"></path>
            <path d="M10.4752 7.35383L7.64618 4.52485C7.76176 4.50848 7.87989 4.50001 8 4.50001C9.38071 4.50001 10.5 5.6193 10.5 7.00001C10.5 7.12011 10.4915 7.23824 10.4752 7.35383Z" fill="black"></path>
            <path d="M13.6464 13.3536L1.64645 1.35356L2.35355 0.646454L14.3536 12.6465L13.6464 13.3536Z" fill="black"></path>
        </svg>`);
    } else {
        document.getElementById("passwordAreaLoginMobile").type = "password";
        document.getElementById("passwordAreaSignUpMobile").type = "password";
        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.innerHTML = `<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
        </svg>`);
    }
}));

/* SEND FORM AREA */
document.getElementById("loginAccountFormMobile").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        const formData = new FormData(this);
        const response = await fetch(document.getElementById("loginAccountFormMobile").action, {
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

document.getElementById("createAccountFormMobile").addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
        const formData = new FormData(this);
        const response = await fetch(document.getElementById("createAccountFormMobile").action, {
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

/* TOGGLE LOGIN / SIGN UP AREAS */
document.querySelectorAll(".signUpMobile").forEach(element => element.addEventListener("click", () => {
    if (isLoginArea) {
        document.getElementById("loginHiddenMobile").style.display = "none";
        document.getElementById("signUpHiddenMobile").style.display = "block";
        document.getElementById("notificaions").style.display = "none";
        document.getElementById("notificaionsMobile").style.display = "none";

        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.style.top = window.innerHeight>785?"542px":"441px");

        isLoginArea = false;
        document.querySelectorAll(".toggle-password-visibility").forEach(element => element.style.top = "256px");
    } else {
        document.getElementById("signUpHiddenMobile").style.display = "none";
        document.getElementById("loginHiddenMobile").style.display = "block";
        document.getElementById("notificaions").style.display = "none";
        document.getElementById("notificaionsMobile").style.display = "none";

        isLoginArea = true;
        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.style.top = window.innerHeight>785?"390px":"320px");
    }
}));

/* TOGGLE WINDOW SIZE */
window.addEventListener("resize", () => {
    toggleWindowSize();
});

function toggleWindowSize() {
    if (!isLoginArea) {
        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.style.top = window.innerHeight>785?"542px":"441px");
    }
    else {
        document.querySelectorAll(".toggle-password-visibility-mobile").forEach(element => element.style.top = window.innerHeight>785?"390px":"320px");
    }
}

toggleWindowSize();

/* ALERT AND CONFIRM PERSONALIZED */
function alert(text) {
    try {
        const blur = document.createElement("div");

        blur.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            backdrop-filter: blur(5px);
            background-color: rgba(255, 255, 255, 0.2); /* leggero overlay */
            z-index: 9998;
            pointer-events: all;
        `;

        const alert = document.createElement("div");
        const textElement = document.createElement("div");
        const okButton = document.createElement("input");

        textElement.innerHTML = text;
        okButton.type = "button";
        okButton.value = "Ok";

        alert.style.cssText = `
            width: 500px;
            height: 300px;
            max-width: 80%;
            max-height: 70%;
            position: fixed;
            top: 0;
            align-self: anchor-center;
            justify-self: center;
            z-index: 10000;
            background-color: white;
            border-radius: 30px;
            justify-self: center;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            background-color: ${themeIsLight?"#eaffbe":"#000000"};
        `;

        textElement.style.cssText = `
            padding: 10px;
            align-self: center;
            top: 20%;
            position: absolute;
            color: ${themeIsLight?"#2c3d27":"#cba95c"};
        `;

        okButton.style.cssText = `
            padding: 10px;
            border-radius: 10px;
            border: 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            width: 50%;
            align-self: center;
            position: relative;
            bottom: -40%;
            color: ${themeIsLight?"#2c3d27":"#cba95c"};
            background-color: ${themeIsLight?"#f8f095":"#272727"};
            cursor: pointer;
        `;

        function endAlert() {
            document.body.removeChild(alert);
            document.body.removeChild(blur);
        }

        okButton.addEventListener("click", endAlert);
        blur.addEventListener("click", endAlert);

        alert.appendChild(textElement);
        alert.appendChild(okButton);

        document.body.appendChild(blur);
        document.body.appendChild(alert);
    } catch (error) {
        console.error(error);
    }
}

async function confirm(text) {
    return new Promise((resolve) => {
        try {
            const blur = document.createElement("div");

            blur.style.cssText = `
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                backdrop-filter: blur(5px);
                background-color: rgba(255, 255, 255, 0.2); /* leggero overlay */
                z-index: 9998;
                pointer-events: all;
            `;

            const alert = document.createElement("div");
            const textElement = document.createElement("div");
            const buttonsDiv = document.createElement("div");
            const okButton = document.createElement("input");
            const noButton = document.createElement("input");

            textElement.innerHTML = text;
            okButton.type = "button";
            okButton.value = "Yes";
            noButton.type = "button";
            noButton.value = "No";

            buttonsDiv.appendChild(okButton);
            buttonsDiv.appendChild(noButton);

            alert.style.cssText = `
                width: 500px;
                height: 300px;
                max-width: 80%;
                max-height: 70%;
                position: fixed;
                top: 0;
                align-self: anchor-center;
                justify-self: center;
                z-index: 10000;
                background-color: white;
                border-radius: 30px;
                justify-self: center;
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                background-color: ${themeIsLight?"#eaffbe":"#000000"};
            `;

            textElement.style.cssText = `
                padding: 10px;
                align-self: center;
                top: 20%;
                position: absolute;
                color: ${themeIsLight?"#2c3d27":"#cba95c"};
            `;

            buttonsDiv.style.cssText = `
                justify-content: space-around;
                display: flex;
                bottom: -40%;
                position: relative;
            `;

            okButton.style.cssText = `
                padding: 10px;
                border-radius: 10px;
                border: 0;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                width: 45%;
                color: ${themeIsLight?"#2c3d27":"#cba95c"};
                background-color: ${themeIsLight?"#f8f095":"#272727"};
                cursor: pointer;
            `;

            noButton.style.cssText = `
                padding: 10px;
                border-radius: 10px;
                border: 0;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                width: 45%;
                color: ${themeIsLight?"#2c3d27":"#cba95c"};
                background-color: ${themeIsLight?"#f8f095":"#272727"};
                cursor: pointer;
            `;

            function endAlert() {
                document.body.removeChild(alert);
                document.body.removeChild(blur);
            }

            okButton.addEventListener("click", () => {
                endAlert();
                resolve(true);
            });

            noButton.addEventListener("click", () => {
                endAlert();
                resolve(false);
            });

            blur.addEventListener("click", () => {
                endAlert();
                resolve(false);
            });

            alert.appendChild(textElement);
            alert.appendChild(buttonsDiv);

            document.body.appendChild(blur);
            document.body.appendChild(alert);
        } catch (error) {
            console.error(error);
            resolve(false);
        }
    });
}