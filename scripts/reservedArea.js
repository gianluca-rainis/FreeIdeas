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

// Idea edit section
let imageInfoLi = document.querySelectorAll(".imageInfoLi");
let imageInfo = document.querySelectorAll(".imageInfo");
let titleImageInfo = document.querySelectorAll(".titleImageInfo");
let imageInfoDescription = document.querySelectorAll(".imageInfoDescription");

let log = document.querySelectorAll(".log");
let logTitleAdmin = document.querySelectorAll(".logTitleAdmin");
let dataAdmin = document.querySelectorAll(".dataAdmin");
let logInfoAdmin = document.querySelectorAll(".logInfoAdmin");

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
    
    reservedAreaMain.querySelector(".logo").style.width = "70%";
    reservedAreaMain.querySelector(".logo").style.margin = "0";

    const text = document.createElement("h1");
    text.innerHTML = `Welcome <strong>${sessionData["username"]}</strong>.`;
    text.style.paddingBottom = "5%";
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

async function getFreeIdeasLicense(title, author) {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);

        const res = await fetch(`./api/getFreeIdeasLicense.php`, {
            credentials: "include",
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data && data['success'] == false) {
            throw new Error(data['error']);
        }

        return data[0];
    } catch (error) {
        console.error(error);
        printError(421);

        return null;
    }
}

function updateQuerySelectorAll() {
    imageInfoLi = document.querySelectorAll(".imageInfoLi");
    imageInfo = document.querySelectorAll("imageInfo");
    titleImageInfo = document.querySelectorAll("titleImageInfo");
    imageInfoDescription = document.querySelectorAll(".imageInfoDescription");
    log = document.querySelectorAll(".log");
    logTitleAdmin = document.querySelectorAll(".logTitleAdmin");
    dataAdmin = document.querySelectorAll(".dataAdmin");
    logInfoAdmin = document.querySelectorAll(".logInfoAdmin");
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

                    childOfListIdeas.classList.add("ideaBox");
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
                                
                                <img id="saveAccountInfoAdmin" alt="Save changes" src="./images/save.svg">
                                <img id="cancelAccountInfoAdmin" alt="Delete changes" src="./images/delete.svg">

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
                                        const res = await fetch(`./api/deleteAccountAdmin.php`, {
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
                                    await asyncAlert("Reset password email was send successfully.");
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

                    childOfListIdeas.classList.add("ideaBox");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <img src="${ideaimage!=null?ideaimage:"./images/FreeIdeas.svg"}" alt="Idea Image" class="ideaImageSrc">
                            <p class="ideaTitleSrc">${title}</p>
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Author id: ${authorid}</p>
                            <p class="ideaAuthorSrc">${data}</p>
                            <p class="ideaAuthorSrc">${description}</p>
                            <p class="ideaAuthorSrc">${downloadlink}</p>`;

                    const editIdeaAdminButton = document.createElement("img");
                    editIdeaAdminButton.classList.add("modifyIdeaInfoAdmin");
                    editIdeaAdminButton.alt = "Edit idea";
                    editIdeaAdminButton.src = "./images/modify.svg";
                    editIdeaAdminButton.dataset.valueId = id; // data-value-id

                    childOfListIdeas.appendChild(editIdeaAdminButton);

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }

                document.querySelectorAll(".modifyIdeaInfoAdmin").forEach(element => {
                    element.addEventListener("click", async () => {
                        const idIdeaToEdit = element.dataset.valueId;

                        let tempFreeIdeasLicense = null;
                        let sqlData = null;

                        try {
                            const formData = new FormData();
                            formData.append("id", idIdeaToEdit);

                            const res = await fetch(`./api/data.php`, {
                                credentials: "include",
                                method: 'POST',
                                body: formData
                            });

                            const data = await res.json();

                            if (data["success"] && data["success"] == false) {
                                throw new Error(data["error"]);
                            }
                            else {
                                sqlData = data;
                            }
                        } catch (error) {
                            console.error(error);
                            printError(421);
                        }

                        tempFreeIdeasLicense = await getFreeIdeasLicense(sqlData['idea'][0].title, sqlData['idea'][0].accountName)

                        // Reset all
                        reservedAreaMain.innerHTML = ``;

                        document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

                        const modifyIdeaDataSection = document.createElement("section");
                        modifyIdeaDataSection.classList.add("editDataSectionAdmin");
                        modifyIdeaDataSection.innerHTML = `
                                <img src="${sqlData['idea'][0].ideaimage}" alt="Idea Image" class="ideaImageSrc">
                                <p class="ideaAuthorSrc">ID: ${sqlData['idea'][0].id}</p>
                                <p class="ideaAuthorSrc">Author Name: ${sqlData['idea'][0].accountName}</p>
                                
                                <img id="saveIdeaInfoAdmin" alt="Save changes" src="./images/save.svg">
                                <img id="cancelIdeaInfoAdmin" alt="Delete changes" src="./images/delete.svg">

                                <div id="newDataSetAccount">
                                    <label>Image</label><input type="file" id="newideaImageAdmin" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp">
                                    <label>Title</label><input type="text" id="newideaTitleAdmin" maxlength="255" value="${sqlData['idea'][0].title}" required>
                                    <label>Author ID</label><input type="number" id="newideaAuthorIdAdmin" value="${sqlData['idea'][0].accountId}" required>
                                    <label>Type of project</label><input type="text" id="newideaTypeAdmin" maxlength="500" value="${sqlData['idealabels'][0].type}" required>
                                    <label>Creativity Type</label><input type="text" id="newideaCreativityAdmin" maxlength="500" value="${sqlData['idealabels'][0].creativity}" required>
                                    <label>Project Status</label><input type="text" id="newideaStatusAdmin" maxlength="500" value="${sqlData['idealabels'][0].status}" required>
                                    <label>Saves</label><input type="number" id="newideaSavesAdmin" value="${sqlData['idealabels'][0].saves}" required>
                                    <label>Likes</label><input type="number" id="newideaLikesAdmin" value="${sqlData['idealabels'][0].likes}" required>
                                    <label>Dislikes</label><input type="number" id="newideaDislikesAdmin" value="${sqlData['idealabels'][0].dislike}" required>
                                    <label>Description</label><textarea type="text" rows="8" cols="25" id="newideaDescriptionAdmin" maxlength="10000">${sqlData['idea'][0].description}</textarea>
                                    <label>External link</label><input type="url" id="newideaLinkAdmin" maxlength="5000" value="${sqlData['idea'][0].downloadlink}" required>
                                    <label>License</label>
                                    <div>
                                        <embed src="${sqlData['idea'][0].license?sqlData['idea'][0].license:tempFreeIdeasLicense}" id="licensePdfEmbed">
                                        <input type="file" id="newIdealicensePdfFileAdmin" accept=".pdf">
                                        <div style="padding: 10px;">
                                            <label for="licenseDefaultLicense">Use the FreeIdeas license: </label>
                                            <input type="checkbox" id="licenseDefaultLicense" name="licenseDefaultLicense" ${sqlData['idea'][0].license?"":"checked"}>
                                        </div>
                                    </div>
                                </div>
                                <div id="newAdditionalInfoIdea">
                                    <h3>Additional Information</h3>
                                    <img src="./images/add.svg" alt="Add additional info" id="addAdditionalInfoAdmin">
                                    <ul id="imagesInfo">
                                        
                                    </ul>
                                </div>
                                <div id="newDevLogsSection">
                                    <h3>Author's Log</h3>
                                    <img src="./images/add.svg" alt="Add additional info" id="addLogAdmin">
                                    <ul id="logsList">
                                        
                                    </ul>
                                </div>
                                <div id="commentsSectionAdmin">
                                    <h3>Comments</h3>
                                    <ul id="commentsListAdmin">

                                    </ul>
                                </div>
                                <div id="dangerAreaAccountAdmin">
                                    <label>Danger Area</label>
                                    <input type="button" value="Delete Idea" id="dangerAreaDeleteIdeaAdmin">
                                </div>`;

                        reservedAreaMain.appendChild(modifyIdeaDataSection);

                        sqlData['info'].forEach(element => {
                            const liForAdditionalInfo = document.createElement("li");
                            liForAdditionalInfo.classList = "imageInfoLi";
                            liForAdditionalInfo.innerHTML = `
                                <div></div>
                                <img src="./images/delete.svg" alt="Delete additional info" class="deleteAdditionalInfoAdmin">
                                
                                <div>
                                    <img class="preview" alt="Additional info image" src="${element['updtimage']?element['updtimage']:"./images/FreeIdeas.svg"}">
                                    <input type="file" class="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" required>
                                </div>

                                <div style="display: flex;flex-direction: column;align-items: center;">
                                    <textarea type="text" class="titleImageInfo" placeholder="Title" maxlength="255" required>${element['title']}</textarea>
                                    <textarea type="text" class="imageInfoDescription" placeholder="Info" maxlength="10000" required>${element['description']}</textarea>
                                </div>`;

                            document.getElementById("imagesInfo").appendChild(liForAdditionalInfo);

                            updateQuerySelectorAll();
                        });

                        sqlData['log'].forEach(log => {
                            const newLi = document.createElement("li");
                            newLi.classList.add("log");

                            newLi.innerHTML += `
                                <img src="./images/delete.svg" alt="Delete Log" class="deleteLogAdmin">
                                <div class="logTitleAndData">
                                    <textarea class="logTitleAdmin" placeholder="Title" maxlength="255" required>${log.title}</textarea>
                                    <input type="date" class="dataAdmin" value="${log.data}" maxlength="10" required>
                                </div>

                                <textarea class="logInfoAdmin" placeholder="Description" maxlength="10000" required>${log.description}</textarea>
                            `;

                            document.getElementById("logsList").appendChild(newLi);

                            updateQuerySelectorAll();
                        });

                        if (sqlData['comment'].length != 0) {
                            const commentsListAdmin = document.getElementById("commentsListAdmin");

                            let rootComments = [];
                            let subComments = [];

                            for (let i = 0; i < sqlData['comment'].length; i++) {
                                if (sqlData['comment'][i]['superCommentid'] == null) {
                                    rootComments.push(i);
                                }
                                else {
                                    subComments.push(i);
                                }
                            }

                            for (let i = 0; i < rootComments.length; i++) {
                                let dataToPrint = printSubCommentRecursive(i, subComments);
                                commentsListAdmin.innerHTML = dataToPrint;
                            }

                            function printSubCommentRecursive(superi, subComments) { // Get the current supercomment index and the list of index of subcomments
                                let subCommentsToPrint = [];

                                for (let i = 0; i < subComments.length; i++) {
                                    if (sqlData['comment'][subComments[i]]['superCommentid'] == sqlData['comment'][superi]['id']) { // If the subcomment is subcomment of the supercomment
                                        subCommentsToPrint.push(subComments[i]); // Save the subcomment
                                        subComments[i] = null;
                                    }
                                }

                                let tempArr = [];

                                for (let i = 0; i < subComments.length; i++) {
                                    if (subComments[subComments.length-1]) {
                                        tempArr.push(subComments.pop());
                                    }
                                }

                                subComments = tempArr;

                                return printComment(superi, subCommentsToPrint, subComments); // Print the current comment and the 1^st level subcomments
                            }

                            function printComment(i, subComments, indexOfSubComments) {
                                let returnd = "";

                                let accountimg = sqlData['comment'][i]['userimage']!=null?sqlData['comment'][i]['userimage']:"./images/user.svg";
                                let accountUsername = sqlData['comment'][i]['username']==null?'Deleted':sqlData['comment'][i]['username'];
                                let date = sqlData['comment'][i]['data'];
                                let description = sqlData['comment'][i]['description'];
                                let id = sqlData['comment'][i]['id'];

                                returnd = `<li class='comment'>
                                    <div class='userInfo'>
                                        <a href='' class='writerPage'>
                                            <img src='${accountimg}' alt='Comment Author Account Image' class='writerImg'>
                                            <div class='writerUserName'>${accountUsername}:</div>
                                        </a>

                                        <div class='dataWriter'>${date}</div>
                                    </div>
                                    <p class='commentText'>${description}</p>
                                    <p class="deleteComment">Delete</p>

                                    <ul class='underComments' data-id='${id}'>`;

                                    for (let j = 0; j < subComments.length; j++) {
                                        returnd += printSubCommentRecursive(subComments[j], indexOfSubComments);
                                    }

                                    returnd += `</ul>
                                </li>`;

                                return returnd;
                            }
                        }

                        document.getElementById("addAdditionalInfoAdmin").addEventListener("click", () => {
                            const liForAdditionalInfo = document.createElement("li");
                            liForAdditionalInfo.classList = "imageInfoLi";
                            liForAdditionalInfo.innerHTML = `
                                <div></div>
                                <img src="./images/delete.svg" alt="Delete additional info" class="deleteAdditionalInfoAdmin">
                                
                                <div>
                                    <img class="preview" alt="Additional info image" src="./images/FreeIdeas.svg">
                                    <input type="file" class="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" required>
                                </div>

                                <div style="display: flex;flex-direction: column;align-items: center;">
                                    <textarea type="text" class="titleImageInfo" placeholder="Title" maxlength="255" required></textarea>
                                    <textarea type="text" class="imageInfoDescription" placeholder="Info" maxlength="10000" required></textarea>
                                </div>`;

                            document.getElementById("imagesInfo").appendChild(liForAdditionalInfo);

                            updateQuerySelectorAll();
                        });

                        document.getElementById("addLogAdmin").addEventListener("click", () => {
                            const newLi = document.createElement("li");
                            newLi.classList.add("log");

                            newLi.innerHTML += `
                                <img src="./images/delete.svg" alt="Delete Log" class="deleteLogAdmin">
                                <div class="logTitleAndData">
                                    <textarea class="logTitleAdmin" placeholder="Title" maxlength="255" required></textarea>
                                    <input type="date" class="dataAdmin" value="" maxlength="10" required>
                                </div>

                                <textarea class="logInfoAdmin" placeholder="Description" maxlength="10000" required></textarea>
                            `;

                            document.getElementById("logsList").appendChild(newLi);

                            updateQuerySelectorAll();
                        });

                        document.getElementById("imagesInfo").addEventListener("click", (event) => { // Delete additional info
                            if (event.target.classList.contains("deleteAdditionalInfoAdmin")) {
                                event.target.closest("li").remove();
                                updateQuerySelectorAll();
                            }
                        });

                        document.getElementById("logsList").addEventListener("click", (event) => { // Delete log
                            if (event.target.classList.contains("deleteLogAdmin")) {
                                event.target.closest("li").remove();
                                updateQuerySelectorAll();
                            }
                        });

                        document.getElementById("newIdealicensePdfFileAdmin").addEventListener("change", () => { // Main image gestor
                            const file = document.getElementById("newIdealicensePdfFileAdmin").files[0];

                            if (file) {
                                document.getElementById("licenseDefaultLicense").checked = false;
                            }
                        });

                        document.getElementById("licenseDefaultLicense").addEventListener("change", () => {
                            const file = document.getElementById("newIdealicensePdfFileAdmin").files[0];

                            if (file) {
                                document.getElementById("newIdealicensePdfFileAdmin").value = "";
                            }
                            else {
                                !document.getElementById("licenseDefaultLicense").checked?alert("The idea must have a license!"):null;
                                document.getElementById("licenseDefaultLicense").checked = true;
                            }
                        });

                        const deleteIdeaButton = document.getElementById("dangerAreaDeleteIdeaAdmin");
                        deleteIdeaButton.addEventListener("click", async () => {
                            if (await confirm(`Are you sure that you want to delete this idea? This operation cannot be undone.`)) {
                                const dataId = new FormData();
                                dataId.append('id', sqlData['idea'][0].id);

                                async function sendData(dataId) {
                                    try {
                                        const res = await fetch(`./api/deleteIdeaAdmin.php`, {
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

                        const saveIdeaInfoAdmin = document.getElementById("saveIdeaInfoAdmin");
                        saveIdeaInfoAdmin.addEventListener("click", async () => {
                            let image = null;
                            let license = null;

                            let title = document.getElementById("newideaTitleAdmin").value;
                            let authorid = document.getElementById("newideaAuthorIdAdmin").value;
                            let type = document.getElementById("newideaTypeAdmin").value;
                            let creativity = document.getElementById("newideaCreativityAdmin").value;
                            let status = document.getElementById("newideaStatusAdmin").value;
                            let saves = document.getElementById("newideaSavesAdmin").value;
                            let likes = document.getElementById("newideaLikesAdmin").value;
                            let dislikes = document.getElementById("newideaDislikesAdmin").value;
                            let description = document.getElementById("newideaDescriptionAdmin").value;
                            let link = document.getElementById("newideaLinkAdmin").value;

                            if (document.getElementById("newideaImageAdmin").files[0] != null) {
                                image = document.getElementById("newideaImageAdmin").files[0];
                            }

                            if (document.getElementById("newIdealicensePdfFileAdmin").files[0] != null) {
                                license = document.getElementById("newIdealicensePdfFileAdmin").files[0];
                            }
                            
                            const data = new FormData();
                            data.append('id', idIdeaToEdit);
                            data.append('title', title);
                            data.append('authorid', authorid);
                            data.append('type', type);
                            data.append('creativity', creativity);
                            data.append('status', status);
                            data.append('saves', saves);
                            data.append('likes', likes);
                            data.append('dislikes', dislikes);
                            data.append('description', description);
                            data.append('link', link);
                            
                            if (image) {
                                data.append('mainImageFile', image);
                            }
                            else {
                                data.append('mainImageData', sqlData['idea'][0].ideaimage);
                            }

                            if (license) {
                                data.append('license', license);
                            }
                            else {
                                if (document.getElementById("licenseDefaultLicense").checked) {
                                    data.append('licenseData', null);
                                } else {
                                    data.append('licenseData', sqlData['idea'][0].license);
                                }
                            }

                            if (imageInfoLi && imageInfoLi.length > 0) {
                                const fileImage = document.querySelectorAll(".imageInfo");

                                const tempTitles = [];
                                const tempDescriptions = [];
                                const tempTypeOfFile = [];

                                for (let i = 0; i < fileImage.length; i++) {
                                    if (fileImage[i].files[0]) {
                                        data.append("additionalInfoImagesFile[]", fileImage[i].files[0]);
                                        tempTypeOfFile.push("file");
                                    }
                                    else {
                                        data.append("additionalInfoImagesData[]", document.querySelectorAll(".preview")[i].src);
                                        tempTypeOfFile.push("data");
                                    }

                                    tempTitles.push(document.querySelectorAll(".titleImageInfo")[i].value);
                                    tempDescriptions.push(document.querySelectorAll(".imageInfoDescription")[i].value);
                                }

                                const additionalInfoJson = {
                                    "titles": tempTitles,
                                    "descriptions": tempDescriptions,
                                    "types": tempTypeOfFile
                                };

                                data.append('additionalInfo', JSON.stringify(additionalInfoJson));
                            }

                            if (log && log.length > 0) {
                                const tempTitles = [];
                                const tempDescriptions = [];
                                const tempDate = [];

                                for (let i = 0; i < log.length; i++) {
                                    tempTitles.push(logTitleAdmin[i].value);
                                    tempDescriptions.push(logInfoAdmin[i].value);
                                    tempDate.push(dataAdmin[i].value);
                                }

                                const logsJson = {
                                    "titles": tempTitles,
                                    "descriptions": tempDescriptions,
                                    "date": tempDate
                                };

                                data.append('logs', JSON.stringify(logsJson));
                            }

                            async function sendData(data) {
                                try {
                                    const res = await fetch(`./api/modifyIdeaInfoAdmin.php`, {
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

                        const cancelIdeaInfoAdmin = document.getElementById("cancelIdeaInfoAdmin");
                        cancelIdeaInfoAdmin.addEventListener("click", async () => {
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

    // Notifications gestor
    notificationsReservedAreaHeader.forEach(element => {element.addEventListener("click", async () => {
        reservedAreaMain.innerHTML = ``;
        searchInReservedArea.innerHTML = ``;

        const inputSearchReservedArea = document.createElement("input");
        inputSearchReservedArea.type = "search";
        inputSearchReservedArea.placeholder = "Search";
        inputSearchReservedArea.id = "searchReservedArea";

        const createNotificationReservedArea = document.createElement("img");
        createNotificationReservedArea.src = "./images/add.svg";
        createNotificationReservedArea.alt = "Create notification";
        createNotificationReservedArea.id = "createNotificationReservedArea";

        searchInReservedArea.appendChild(inputSearchReservedArea);
        searchInReservedArea.appendChild(createNotificationReservedArea);
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

                    childOfListIdeas.classList.add("ideaBox");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <p class="ideaTitleSrc">${title}</p>
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Account id: ${accountid}</p>
                            <p class="ideaAuthorSrc">${data}</p>
                            <p class="ideaAuthorSrc">${description}</p>
                            <p class="ideaAuthorSrc">Status: ${status?"Read":"Not read"}</p>`;

                    const deleteNotificationAdmin = document.createElement("img");
                    deleteNotificationAdmin.classList.add("deleteNotificationAdmin");
                    deleteNotificationAdmin.alt = "Delete notification";
                    deleteNotificationAdmin.src = "./images/delete.svg";
                    deleteNotificationAdmin.dataset.valueId = id; // data-value-id

                    childOfListIdeas.appendChild(deleteNotificationAdmin);

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }

                document.querySelectorAll(".deleteNotificationAdmin").forEach(element => {
                    element.addEventListener("click", async () => {
                        if (await confirm("Are you sure that you want to delete this notification?")) {
                            const idNotificationToDelete = element.dataset.valueId;
                            let isDeleted = false;

                            try {
                                const formData = new FormData();
                                formData.append("id", idNotificationToDelete);

                                const res = await fetch(`./api/deleteNotificationAdmin.php`, {
                                    credentials: "include",
                                    method: "POST",
                                    body: formData
                                });

                                const data = await res.json();

                                if (data) {
                                    if (!data["success"]) {
                                        throw new Error(data["error"]);
                                    }
                                    else {
                                        isDeleted = true;
                                    }
                                } else {
                                    throw new Error("generic_error_in_delete_notification");
                                }
                            } catch (error) {
                                console.error(error);
                                printError(421);
                            }

                            if (isDeleted) {
                                element.closest("li").remove();
                            }
                        }
                    });
                });
            }
            else {
                printError(421);
            }
        }

        async function createNewNotification() {
            // Reset all
            reservedAreaMain.innerHTML = ``;

            document.getElementById("mobileNavBarReservedAreaHeader").style.display = "none";

            const newNotifiactionSection = document.createElement("section");
            newNotifiactionSection.classList.add("ideaBox");
            newNotifiactionSection.classList.add("reservedAreaLiBoxInfo");
            newNotifiactionSection.innerHTML = `
            <img id="saveNotificationInfoAdmin" alt="Save changes" src="./images/save.svg">
            <img id="cancelNotificaitonInfoAdmin" alt="Delete changes" src="./images/delete.svg">
            
            <div class="ideaTitleSrc newNotificationDivsAdmin">
                <label for="newNotificationTitle">Title</label>
                <input type="text" name="title" placeholder="Title" id="newNotificationTitle">
            </div>
            <div class="ideaAuthorSrc newNotificationDivsAdmin">
                <label for="newNotificationAccountId">Account ID</label>
                <input type="number" name="accountId" placeholder="Account ID" id="newNotificationAccountId">
            </div>
            <div class="ideaAuthorSrc newNotificationDivsAdmin">
                <label for="newNotificationDate">Date</label>
                <input type="date" name="date" placeholder="Date" id="newNotificationDate">
            </div>
            <div class="ideaAuthorSrc newNotificationDivsAdmin">
                <label for="newNotificationDescription">Description</label>
                <input type="text" name="description" placeholder="Description" id="newNotificationDescription">
            </div>
            <div class="ideaAuthorSrc newNotificationDivsAdmin">
                <label for="newNotificationStatus">Status</label>
                <input type="checkbox" name="status" id="newNotificationStatus">
                <p id="statusResult">Not read</p>
            </div>`;
            
            reservedAreaMain.appendChild(newNotifiactionSection);

            document.getElementById("newNotificationStatus").addEventListener("click", () => {
                document.getElementById("statusResult").innerHTML = document.getElementById("newNotificationStatus").checked?"Read":"Not read";
            });

            const saveNotificationInfoAdmin = document.getElementById("saveNotificationInfoAdmin");
            saveNotificationInfoAdmin.addEventListener("click", async () => {
                let title = document.getElementById("newNotificationTitle").value;
                let accountId = document.getElementById("newNotificationAccountId").value;
                let date = document.getElementById("newNotificationDate").value;
                let description = document.getElementById("newNotificationDescription").value;
                let status = document.getElementById("newNotificationStatus").checked?1:0;

                if (!title || !accountId || !date || !description) {
                    alert("You need to insert a value for each box in the form!");
                    return;
                }
                
                const data = new FormData();
                data.append('title', title);
                data.append('accountId', accountId);
                data.append('date', date);
                data.append('description', description);
                data.append('status', status);

                async function sendData(data) {
                    try {
                        const res = await fetch(`./api/createNewNotificationAdmin.php`, {
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
            
            const cancelNotificaitonInfoAdmin = document.getElementById("cancelNotificaitonInfoAdmin");
            cancelNotificaitonInfoAdmin.addEventListener("click", async () => {
                window.location.href = "./reservedArea.php";
            });
        }

        inputSearchReservedArea.addEventListener("input", updateDisplaiedData);
        createNotificationReservedArea.addEventListener("click", createNewNotification);
        
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

                    childOfListIdeas.classList.add("ideaBox");
                    childOfListIdeas.classList.add("reservedAreaLiBoxInfo");
                    childOfListIdeas.innerHTML = `
                            <p class="ideaAuthorSrc">ID: ${id}</p>
                            <p class="ideaAuthorSrc">Author id: ${authorid}</p>
                            <p class="ideaAuthorSrc">${ideaid!=0?`Idea id: ${ideaid}`:`Account id: ${accountid}`}</p>
                            <p class="ideaAuthorSrc">${feedback}</p>`;

                    const deleteReportsAdmin = document.createElement("img");
                    deleteReportsAdmin.classList.add("deleteReportsAdmin");
                    deleteReportsAdmin.alt = "Delete report";
                    deleteReportsAdmin.src = "./images/delete.svg";
                    deleteReportsAdmin.dataset.valueId = id; // data-value-id

                    childOfListIdeas.appendChild(deleteReportsAdmin);

                    reservedAreaMain.querySelector("ul").appendChild(childOfListIdeas);
                }

                document.querySelectorAll(".deleteReportsAdmin").forEach(element => {
                    element.addEventListener("click", async () => {
                        if (await confirm("Are you sure that you want to delete this report?")) {
                            const idReportToDelete = element.dataset.valueId;
                            let isDeleted = false;

                            try {
                                const formData = new FormData();
                                formData.append("id", idReportToDelete);

                                const res = await fetch(`./api/deleteReportAdmin.php`, {
                                    credentials: "include",
                                    method: "POST",
                                    body: formData
                                });

                                const data = await res.json();

                                if (data) {
                                    if (!data["success"]) {
                                        throw new Error(data["error"]);
                                    }
                                    else {
                                        isDeleted = true;
                                    }
                                } else {
                                    throw new Error("generic_error_in_delete_report");
                                }
                            } catch (error) {
                                console.error(error);
                                printError(421);
                            }

                            if (isDeleted) {
                                element.closest("li").remove();
                            }
                        }
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