const reservedAreaMain = document.getElementById("reservedAreaMain");

// Login const
const loginReservedAreaForm = document.getElementById("loginReservedAreaForm");

const usernameReservedArea = document.getElementById("usernameReservedArea");
const password1ReservedArea = document.getElementById("password1ReservedArea");
const password2ReservedArea = document.getElementById("password2ReservedArea");
const password3ReservedArea = document.getElementById("password3ReservedArea");
const password4ReservedArea = document.getElementById("password4ReservedArea");
const password5ReservedArea = document.getElementById("password5ReservedArea");
const loginReservedArea = document.getElementById("loginReservedArea");

// Header const
const ulReservedAreaHeader = document.getElementById("ulReservedAreaHeader");

const accountsReservedAreaHeader = document.getElementById("accountsReservedAreaHeader");
const ideasReservedAreaHeader = document.getElementById("ideasReservedAreaHeader");
const notificationsReservedAreaHeader = document.getElementById("notificationsReservedAreaHeader");
const reportsReservedAreaHeader = document.getElementById("reportsReservedAreaHeader");
const logoutReservedAreaHeader = document.getElementById("logoutReservedAreaHeader");

// Functions
async function getAdminSessionData() {
    try {
        const res = await fetch(`./api/getSessionData.php?data=administrator`, {
            credentials: "include"
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

mainReservedArea();

// Control if logged in yet
async function mainReservedArea() {
    if (await getAdminSessionData()) {
        accessReservedArea();
    }
    else {
        loginReservedAreaForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            try {
                await fetch(`./api/logout.php`, {
                    method: "POST",
                    credentials: "include"
                });
            } catch (error) {
                console.error(error);
                printError(421);
            }

            try {
                const formData = new FormData(this);
                
                const response = await fetch(loginReservedAreaForm.action, {
                    method: "POST",
                    credentials: "include",
                    body: formData
                });

                const data = await response.json();

                if (data['success']) {
                    accessReservedArea();
                }
                else {
                    if (data['error'] == "account_not_found") {
                        alert("Username or password are wrong");
                    }
                    else {
                        console.error(data['error']);
                        printError(421);
                    }
                }
            } catch (error) {
                console.error(error);
                printError(421);
            }
        });
    }
}

async function accessReservedArea() {
    const sessionData = await getAdminSessionData();

    document.querySelector("header").style.display = "flex";

    document.getElementById("bannerDiv").remove();
    loginReservedAreaForm.remove();
    
    reservedAreaMain.querySelector(".logo").style.width = "90%";
    reservedAreaMain.querySelector(".logo").style.margin = "0";
    reservedAreaMain.querySelector(".logo").style.paddingTop = "10%";
    reservedAreaMain.querySelector(".logo").style.paddingBottom = "10%";
    reservedAreaMain.querySelector(".logo").style.paddingLeft = "0";
    reservedAreaMain.querySelector(".logo").style.paddingRight = "0";

    const text = document.createElement("h1");
    text.innerHTML = `Welcome <strong>${sessionData["username"]}</strong>.`;
    text.style.paddingBottom = "10%";
    reservedAreaMain.appendChild(text);
}

// Buttons function
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logoutReservedAreaHeader").addEventListener("click", async () => {
        try {
            await fetch("../api/logout.php");
        } catch (error) {
            console.error(error);
            printError(421);
        }

        window.location.href = "./reservedArea.php";
    });
});

/* Window size responsive part */
let beckupUlReservedAreaHeader = ulReservedAreaHeader.innerHTML;
let previousUlContent = ulReservedAreaHeader.innerHTML;

window.addEventListener("resize", toggleWindowSize2);

function toggleWindowSize2() {
    if (window.innerWidth <= 760) {
        if (previousUlContent == beckupUlReservedAreaHeader) {
            ulReservedAreaHeader.innerHTML = `
            <li><img src="./images/menuReservedArea.svg" id="menuReservedArea"></li>
            `;

            previousUlContent = ulReservedAreaHeader.innerHTML;
        }
    }
    else {
        ulReservedAreaHeader.innerHTML = beckupUlReservedAreaHeader;
        previousUlContent = ulReservedAreaHeader.innerHTML;
    }
}

toggleWindowSize2();