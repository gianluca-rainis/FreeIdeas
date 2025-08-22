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
                    window.location.href = "./reservedArea.php";
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
    const accountsReservedAreaHeader = document.querySelectorAll(".accountsReservedAreaHeader");
    const ideasReservedAreaHeader = document.querySelectorAll(".ideasReservedAreaHeader");
    const notificationsReservedAreaHeader = document.querySelectorAll(".notificationsReservedAreaHeader");
    const reportsReservedAreaHeader = document.querySelectorAll(".reportsReservedAreaHeader");
    const logoutReservedAreaHeader = document.querySelectorAll(".logoutReservedAreaHeader");
    const menuReservedArea = document.getElementById("menuReservedArea");

    // Accounts gestor
    accountsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            async function sendData() {
                try {
                    const res = await fetch(`./api/getAccountDataForReservedArea.php`);

                    const resp = await res.json();                    

                    if (resp['success']) {
                        return resp['data'];
                    }
                    else {
                        console.error(resp['error']);
                        return null;
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }

            const result = await sendData();

            if (result) {
                result.forEach(accountData => {
                    addChildToList(accountData['username'], `${accountData['name']} ${accountData['surname']}`, accountData['email'], accountData['id'], accountData['description'], accountData['public'], accountData['userimage']);
                });

                function addChildToList(title, author, email, id, description, public, imgSrc) {
                    const childOfListIdeas = document.createElement("li");

                    childOfListIdeas.classList.add("ideaBoxScr");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <img src="${imgSrc!=null?imgSrc:"./images/FreeIdeas.svg"}" alt="Account Image" class="ideaImageSrc">
                            <p class="ideaTitleSrc">${title}</p>
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Public: ${public==1?"Yes":"No"}</p>
                            <p class="ideaAuthorSrc">${author}</p>
                            <p class="ideaAuthorSrc">${email}</p>
                            <p class="ideaAuthorSrc">${description}</p>`;

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }
            }
            else {
                printError(421);
            }
        }
        
        updateDisplaiedData();
    })});

    // Ideas gestor
    ideasReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            async function sendData() {
                try {
                    const res = await fetch(`./api/getIdeaDataForReservedArea.php`);

                    const resp = await res.json();                    

                    if (resp['success']) {
                        return resp['data'];
                    }
                    else {
                        console.error(resp['error']);
                        return null;
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }

            const result = await sendData();

            if (result) {
                result.forEach(ideaData => {
                    addChildToList(ideaData['id'], ideaData['authorid'], ideaData['title'], ideaData['data'], ideaData['ideaimage'], ideaData['description'], ideaData['downloadlink']);
                });

                function addChildToList(id, authorid, title, data, ideaimage, description, downloadlink) {
                    const childOfListIdeas = document.createElement("li");

                    childOfListIdeas.classList.add("ideaBoxScr");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <img src="${ideaimage!=null?ideaimage:"./images/FreeIdeas.svg"}" alt="Idea Image" class="ideaImageSrc">
                            <p class="ideaTitleSrc">${title}</p>
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Author id: ${authorid}</p>
                            <p class="ideaAuthorSrc">${data}</p>
                            <p class="ideaAuthorSrc">${description}</p>
                            <p class="ideaAuthorSrc">${downloadlink}</p>`;

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }
            }
            else {
                printError(421);
            }
        }
        
        updateDisplaiedData();
    })});

    // Notifications gestor
    notificationsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            async function sendData() {
                try {
                    const res = await fetch(`./api/getNotificationsDataForReservedArea.php`);

                    const resp = await res.json();                    

                    if (resp['success']) {
                        return resp['data'];
                    }
                    else {
                        console.error(resp['error']);
                        return null;
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }

            const result = await sendData();

            if (result) {
                result.forEach(nontifData => {
                    addChildToList(nontifData['id'], nontifData['accountid'], nontifData['title'], nontifData['description'], nontifData['data'], nontifData['status']);
                });

                function addChildToList(id, accountid, title, description, data, status) {
                    const childOfListIdeas = document.createElement("li");

                    childOfListIdeas.classList.add("ideaBoxScr");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <p class="ideaTitleSrc">${title}</p>
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Account id: ${accountid}</p>
                            <p class="ideaAuthorSrc">${data}</p>
                            <p class="ideaAuthorSrc">${description}</p>
                            <p class="ideaAuthorSrc">Status: ${status?"Read":"Not read"}</p>`;

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }
            }
            else {
                printError(421);
            }
        }
        
        updateDisplaiedData();
    })});

    // Reports gestor
    reportsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            async function sendData() {
                try {
                    const res = await fetch(`./api/getReportsDataForReservedArea.php`);

                    const resp = await res.json();                    

                    if (resp['success']) {
                        return resp['data'];
                    }
                    else {
                        console.error(resp['error']);
                        return null;
                    }
                } catch (error) {
                    console.error(error);
                    return null;
                }
            }

            const result = await sendData();

            if (result) {
                result.forEach(repData => {
                    addChildToList(repData['id'], repData['authorid'], repData['ideaid'], repData['accountid'], repData['feedback']);
                });

                function addChildToList(id, authorid, ideaid, accountid, feedback) {
                    const childOfListIdeas = document.createElement("li");

                    childOfListIdeas.classList.add("ideaBoxScr");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Author id: ${authorid}</p>
                            <p class="ideaAuthorSrc">${ideaid!=0?`Idea id: ${ideaid}`:`Account id: ${accountid}`}</p>
                            <p class="ideaAuthorSrc">${feedback}</p>`;

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }
            }
            else {
                printError(421);
            }
        }
        
        updateDisplaiedData();
    })});

    // Logout
    logoutReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        try {
            await fetch("./api/logout.php");
            
            window.location.href = "./reservedArea.php";
        } catch (error) {
            console.error(error);
            printError(421);
        }
    })});

    // Menu for mobile
    menuReservedArea.addEventListener("click", async () => {
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = document.getElementById("mobileNavBarReservedAreaHeader").style.display=="block"?"none":"block";
    });
});

/* Window size responsive part */
window.addEventListener("resize", toggleWindowSize2);

function toggleWindowSize2() {
    if (window.innerWidth > 760) {
        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";
    }
}

toggleWindowSize2();