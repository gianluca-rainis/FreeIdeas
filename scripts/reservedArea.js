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

async function getAdminSessionData() { // Get the session data on admin info
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

// Buttons function
document.addEventListener("DOMContentLoaded", () => {
    const accountsReservedAreaHeader = document.querySelectorAll(".accountsReservedAreaHeader");
    const ideasReservedAreaHeader = document.querySelectorAll(".ideasReservedAreaHeader");
    const notificationsReservedAreaHeader = document.querySelectorAll(".notificationsReservedAreaHeader");
    const reportsReservedAreaHeader = document.querySelectorAll(".reportsReservedAreaHeader");
    const logoutReservedAreaHeader = document.querySelectorAll(".logoutReservedAreaHeader");
    const menuReservedArea = document.getElementById("menuReservedArea");

    // Create search section
    const searchInReservedArea = document.createElement("section");
    searchInReservedArea.id = "searchSectionInReservedArea";

    // Accounts gestor
    accountsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        searchInReservedArea.innerHTML = ``;

        const inputSearchReservedArea = document.createElement("input");
        inputSearchReservedArea.type = "search";
        inputSearchReservedArea.placeholder = "Search";
        inputSearchReservedArea.id = "searchReservedArea";

        searchInReservedArea.appendChild(inputSearchReservedArea);
        reservedAreaMain.appendChild(searchInReservedArea);

        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";
        
        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            reservedAreaMain.querySelector("ul").remove();
            reservedAreaMain.appendChild(document.createElement("ul"));

            async function sendData() {
                try {
                    const data = new FormData();
                    data.append("search", inputSearchReservedArea.value);

                    const res = await fetch(`./api/getAccountDataForReservedArea.php`, {
                        method: 'POST',
                        body: data
                    });

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
                    
                    const editAccountAdminButton = document.createElement("img");
                    editAccountAdminButton.classList.add("modifyAccountInfoAdmin");
                    editAccountAdminButton.alt = "Edit account";
                    editAccountAdminButton.src = "./images/modify.svg";
                    editAccountAdminButton.dataset.valueId = id; // data-value-id

                    childOfListIdeas.appendChild(editAccountAdminButton);

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }

                document.querySelectorAll(".modifyAccountInfoAdmin").forEach(element => {
                    element.addEventListener("click", async () => {
                        const idAccountToEdit = element.dataset.valueId;
                        let sqlData = null;

                        try {
                            const formData = new FormData();
                            formData.append("id", idAccountToEdit);

                            const res = await fetch(`./api/getAccountData.php`, {
                                credentials: "include",
                                method: "POST",
                                body: formData
                            });

                            const data = await res.json();

                            if (!data["success"]) {
                                throw new Error(data["error"]);
                            }
                            else {
                                sqlData = data["data"];
                            }
                        } catch (error) {
                            console.error(error);
                            printError(421);
                        }

                        // Reset all
                        reservedAreaMain.innerHTML = ``;

                        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

                        const modifyAccountDataSection = document.createElement("section");
                        modifyAccountDataSection.classList.add("editDataSectionAdmin");
                        modifyAccountDataSection.innerHTML = `
                                <img src="${sqlData["userimage"]!=null?sqlData["userimage"]:"./images/FreeIdeas.svg"}" alt="Account Image" class="ideaImageSrc">
                                <p class="ideaAuthorSrc">ID: ${sqlData["id"]}</p>
                                
                                <img id="saveAccountInfoAdmin" alt="Save changes" src="./images/save${themeIsLight?"":"_Pro"}.svg">
                                <img id="cancelAccountInfoAdmin" alt="Delete changes" src="./images/delete${themeIsLight?"":"_Pro"}.svg">

                                <div id="newDataSetAccount">
                                    <label>Image</label><input type="file" id="newuserImageAccountAdmin" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp">
                                    <label>Username</label><input type="text" id="newuserNameAccountAdmin" maxlength="255" value="${sqlData["username"]}" required>
                                    <label>Name</label><input type="text" id="newuserAccountNameAdmin" maxlength="255" value="${sqlData["name"]}" required>
                                    <label>Surname</label><input type="text" id="newuserSurnameAccountAdmin" maxlength="255" value="${sqlData["surname"]}" required>
                                    <label>Email</label><input type="text" id="newemailAccountAdmin" maxlength="255" value="${sqlData["email"]}" required>
                                    <label>Description</label><textarea type="text" rows="8" cols="25" id="newdescriptionAccountAdmin" maxlength="1000">${sqlData["description"]==null?"":sqlData["description"]}</textarea>
                                </div>
                                <div id="dangerAreaAccountAdmin">
                                    <label>Danger Area</label>
                                    <input type="button" value="Make the account ${sqlData['public']==0?"Public":"Private"}" data-value="" id="dangerAreaAccountPublicPrivateAccountAdmin">
                                    <input type="button" value="Change Password" id="dangerAreaAccountChangePasswordAdmin">
                                    <input type="button" value="Delete Account" id="dangerAreaAccountDeleteAccountAdmin">
                                </div>`;
                        
                        reservedAreaMain.appendChild(modifyAccountDataSection);

                        const deleteAccountButton = document.getElementById("dangerAreaAccountDeleteAccountAdmin");
                        deleteAccountButton.addEventListener("click", async () => {
                            if (await confirm(`Are you sure that you want to delete this account? This operation cannot be undone.`)) {
                                const dataId = new FormData();
                                dataId.append('id', sqlData['id']);

                                async function sendData(dataId) {
                                    try {
                                        const res = await fetch(`./api/deleteAccount.php`, {
                                            credentials: "include",
                                            method: 'POST',
                                            body: dataId
                                        });

                                        const resp = await res.json();
                                        
                                        return resp;
                                    } catch (error) {
                                        console.error(error);
                                        return null;
                                    }
                                }

                                const result = await sendData(dataId);

                                if (!result) {
                                    printError(421);
                                }
                                else {
                                    if (result['success']) {
                                        window.location.href = "./reservedArea.php";
                                    }
                                    else {
                                        console.error(result['error']);
                                        printError(421);
                                    }
                                }
                            }
                        });

                        const dangerAreaAccountPublicPrivateAccountAdmin = document.getElementById("dangerAreaAccountPublicPrivateAccountAdmin");
                        dangerAreaAccountPublicPrivateAccountAdmin.addEventListener("click", async () => {
                            let username = document.getElementById("newuserNameAccountAdmin").value;
                            let name = document.getElementById("newuserAccountNameAdmin").value;
                            let surname = document.getElementById("newuserSurnameAccountAdmin").value;
                            let email = document.getElementById("newemailAccountAdmin").value;
                            let description = document.getElementById("newdescriptionAccountAdmin").value;
                            let image = null;

                            if (document.getElementById("newuserImageAccountAdmin").files[0] != null) {
                                image = document.getElementById("newuserImageAccountAdmin").files[0];
                            }
                            
                            const data = new FormData();
                            data.append('id', sqlData["id"]);
                            data.append('username', username);
                            data.append('name', name);
                            data.append('surname', surname);
                            data.append('description', description);
                            data.append('email', email);
                            data.append('public', sqlData['public']==0?1:0);
                            
                            if (image) {
                                data.append('image', image);
                            }

                            async function sendData(data) {
                                try {
                                    const res = await fetch(`./api/modifyAccountInfoAdmin.php`, {
                                        credentials: "include",
                                        method: 'POST',
                                        body: data
                                    });

                                    const resp = await res.json();

                                    return resp;
                                } catch (error) {
                                    console.error(error);
                                    return null;
                                }
                            }

                            const result = await sendData(data);

                            if (!result) {
                                printError(421);
                            }
                            else {
                                if (result['success']) {
                                    window.location.href = "./reservedArea.php";
                                }
                                else {
                                    console.error(result['error']);
                                    printError(421);
                                }
                            }
                        });

                        const dangerAreaAccountChangePasswordAdmin = document.getElementById("dangerAreaAccountChangePasswordAdmin");
                        dangerAreaAccountChangePasswordAdmin.addEventListener("click", async () => {
                            const dataId = new FormData();
                            dataId.append('email', sqlData['email']);

                            async function sendData(dataId) {
                                try {
                                    const res = await fetch(`./api/changePassword.php`, {
                                        credentials: "include",
                                        method: 'POST',
                                        body: dataId
                                    });

                                    const resp = await res.json();
                                    
                                    return resp;
                                } catch (error) {
                                    console.error(error);
                                    return null;
                                }
                            }

                            const result = await sendData(dataId);

                            if (!result) {
                                printError(421);
                            }
                            else {
                                if (result['success']) {
                                    alert("Reset password email was send successfully.");
                                    window.location.href = "./reservedArea.php";
                                }
                                else {
                                    console.error(result['error']);
                                    printError(421);
                                }
                            }
                        });

                        const saveAccountInfoAdmin = document.getElementById("saveAccountInfoAdmin");
                        saveAccountInfoAdmin.addEventListener("click", async () => {
                            let username = document.getElementById("newuserNameAccountAdmin").value;
                            let name = document.getElementById("newuserAccountNameAdmin").value;
                            let surname = document.getElementById("newuserSurnameAccountAdmin").value;
                            let email = document.getElementById("newemailAccountAdmin").value;
                            let description = document.getElementById("newdescriptionAccountAdmin").value;
                            let image = null;

                            if (document.getElementById("newuserImageAccountAdmin").files[0] != null) {
                                image = document.getElementById("newuserImageAccountAdmin").files[0];
                            }
                            
                            const data = new FormData();
                            data.append('id', sqlData["id"]);
                            data.append('username', username);
                            data.append('name', name);
                            data.append('surname', surname);
                            data.append('description', description);
                            data.append('email', email);
                            data.append('public', sqlData['public']);
                            
                            if (image) {
                                data.append('image', image);
                            }

                            async function sendData(data) {
                                try {
                                    const res = await fetch(`./api/modifyAccountInfoAdmin.php`, {
                                        credentials: "include",
                                        method: 'POST',
                                        body: data
                                    });

                                    const resp = await res.json();

                                    return resp;
                                } catch (error) {
                                    console.error(error);
                                    return null;
                                }
                            }

                            const result = await sendData(data);

                            if (!result) {
                                printError(421);
                            }
                            else {
                                if (result['success']) {
                                    window.location.href = "./reservedArea.php";
                                }
                                else {
                                    console.error(result['error']);
                                    printError(421);
                                }
                            }
                        });

                        const cancelAccountInfoAdmin = document.getElementById("cancelAccountInfoAdmin");
                        cancelAccountInfoAdmin.addEventListener("click", async () => {
                            window.location.href = "./reservedArea.php";
                        });
                    });
                });
            }
            else {
                printError(421);
            }
        }

        inputSearchReservedArea.addEventListener("input", updateDisplaiedData);
        
        updateDisplaiedData();
    })});

    // Ideas gestor
    ideasReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        searchInReservedArea.innerHTML = ``;

        const inputSearchReservedArea = document.createElement("input");
        inputSearchReservedArea.type = "search";
        inputSearchReservedArea.placeholder = "Search";
        inputSearchReservedArea.id = "searchReservedArea";

        searchInReservedArea.appendChild(inputSearchReservedArea);
        reservedAreaMain.appendChild(searchInReservedArea);

        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            reservedAreaMain.querySelector("ul").remove();
            reservedAreaMain.appendChild(document.createElement("ul"));

            async function sendData() {
                try {
                    const data = new FormData();
                    data.append("search", inputSearchReservedArea.value);

                    const res = await fetch(`./api/getIdeaDataForReservedArea.php`, {
                        method: 'POST',
                        body: data
                    });

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

        inputSearchReservedArea.addEventListener("input", updateDisplaiedData);
        
        updateDisplaiedData();
    })});

    // Notifications gestor
    notificationsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        searchInReservedArea.innerHTML = ``;

        const inputSearchReservedArea = document.createElement("input");
        inputSearchReservedArea.type = "search";
        inputSearchReservedArea.placeholder = "Search";
        inputSearchReservedArea.id = "searchReservedArea";

        searchInReservedArea.appendChild(inputSearchReservedArea);
        reservedAreaMain.appendChild(searchInReservedArea);

        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            reservedAreaMain.querySelector("ul").remove();
            reservedAreaMain.appendChild(document.createElement("ul"));

            async function sendData() {
                try {
                    const data = new FormData();
                    data.append("search", inputSearchReservedArea.value);

                    const res = await fetch(`./api/getNotificationsDataForReservedArea.php`, {
                        method: 'POST',
                        body: data
                    });

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

        inputSearchReservedArea.addEventListener("input", updateDisplaiedData);
        
        updateDisplaiedData();
    })});

    // Reports gestor
    reportsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        searchInReservedArea.innerHTML = ``;

        const inputSearchReservedArea = document.createElement("input");
        inputSearchReservedArea.type = "search";
        inputSearchReservedArea.placeholder = "Search";
        inputSearchReservedArea.id = "searchReservedArea";

        searchInReservedArea.appendChild(inputSearchReservedArea);
        reservedAreaMain.appendChild(searchInReservedArea);

        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

        reservedAreaMain.appendChild(document.createElement("ul"));

        async function updateDisplaiedData() {
            reservedAreaMain.querySelector("ul").remove();
            reservedAreaMain.appendChild(document.createElement("ul"));

            async function sendData() {
                try {
                    const data = new FormData();
                    data.append("search", inputSearchReservedArea.value);

                    const res = await fetch(`./api/getReportsDataForReservedArea.php`, {
                        method: 'POST',
                        body: data
                    });

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

        inputSearchReservedArea.addEventListener("input", updateDisplaiedData);
        
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