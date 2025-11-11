const newIdeaForm = document.getElementById("newIdeaForm");
const saveNewIdea = document.getElementById("saveNewIdea");
const cancelNewIdea = document.getElementById("cancelNewIdea");
const deleteOldIdea = document.getElementById("deleteOldIdea");

const title = document.getElementById("title");
const author = document.getElementById("mainAuthorAccount");
let authorid = null;

const date = new Date();
const currentdate = `${date.getFullYear()}-${(date.getMonth()+1).toString().length==2?(date.getMonth()+1):"0"+(date.getMonth()+1).toString()}-${date.getDate().toString().length==2?date.getDate():"0"+date.getDate().toString()}`;

const description = document.getElementById("description");
const mainImage = document.getElementById("ideaImageAsBackground");
const getMainImage = document.getElementById("mainImage");

const typeProject = document.getElementById("typeFilter");
const creativityType = document.getElementById("creativityTypeFilter");
const statusProject = document.getElementById("orderByStatus");

const imagesInfo = document.getElementById("imagesInfo");
let fileImage = document.querySelectorAll(".imageInfo");
let imagePreview = document.querySelectorAll(".preview");
let titleSupplemImfo = document.querySelectorAll(".titleImageInfo");
let descriptionSupplemImfo = document.querySelectorAll(".imageInfoDescription");
const addAdditionalInfo = document.getElementById("addAdditionalInfo");
let deleteAdditionalInfo = document.querySelectorAll(".deleteAdditionalInfo");

const buttonlink = document.getElementById("buttonlink");

const licensePdfFile = document.getElementById("licensePdfFile");
const licenseDefaultLicense = document.getElementById("licenseDefaultLicense");

const logsList = document.getElementById("logsList");
const addLog = document.getElementById("addLog");
let logTitle = document.querySelectorAll(".logTitle");
let logData = document.querySelectorAll(".data");
let logInfo = document.querySelectorAll(".logInfo");
let deleteLog = document.querySelectorAll(".deleteLog");

// The id of the page to load
const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url ex. (<a href="./ideaVoid.php?id=123">)
const id = paramsURL.get("idea"); // The id of the page to load

if (id) { // If is an old idea
    modifyOldPageIfAuthorLoggedIn();
}
else { // If is a new idea
    newIdeaForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", title.value);
            formData.append("author", authorid);
            formData.append("data", currentdate);
            formData.append("description", description.value);
            formData.append("mainImage", getMainImage.files[0]);

            formData.append("type", typeProject.value);
            formData.append("creativity", creativityType.value);
            formData.append("status", statusProject.value);

            const tempTitles = [];
            const tempDescriptions = [];

            for (let i = 0; i < fileImage.length; i++) {
                if (fileImage[i].files[0]) {
                    formData.append("additionalInfoImages[]", fileImage[i].files[0]);
                }
                else {
                    throw new Error("ERROR_IMAGE_FILE");
                }

                tempTitles.push(titleSupplemImfo[i].value);
                tempDescriptions.push(descriptionSupplemImfo[i].value);
            }

            const additionalInfoJson = {
                "titles": tempTitles,
                "descriptions": tempDescriptions
            };
            
            formData.append("additionalInfo", JSON.stringify(additionalInfoJson));

            formData.append("link", buttonlink.value);
            formData.append("license", licensePdfFile.files[0]);

            const temp2Dates = [];
            const temp2Titles = [];
            const temp2Descriptions = [];

            for (let i = 0; i < logTitle.length; i++) {
                temp2Dates.push(logData[i].innerHTML);
                temp2Titles.push(logTitle[i].value);
                temp2Descriptions.push(logInfo[i].value);
            }

            const logJson = {
                "dates": temp2Dates,
                "titles": temp2Titles,
                "descriptions": temp2Descriptions
            };

            formData.append("logs", JSON.stringify(logJson));

            const response = await fetch(newIdeaForm.action, {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data['success']) {
                window.location.href = `./index.php`;
            }
            else {
                throw new Error(data['error']);
            }
        } catch (error) {
            console.error(error);
            printError(421);
        }
    });
}

function updateQuerySelectorAll() {
    fileImage = document.querySelectorAll(".imageInfo");
    imagePreview = document.querySelectorAll(".preview");
    titleSupplemImfo = document.querySelectorAll(".titleImageInfo");
    descriptionSupplemImfo = document.querySelectorAll(".imageInfoDescription");
    deleteAdditionalInfo = document.querySelectorAll(".deleteAdditionalInfo");
    logTitle = document.querySelectorAll(".logTitle");
    logData = document.querySelectorAll(".data");
    logInfo = document.querySelectorAll(".logInfo");
    deleteLog = document.querySelectorAll(".deleteLog");

    for (let i = 0; i < fileImage.length; i++) {
        fileImage[i].addEventListener("change", () => {
            const file = fileImage[i].files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview[i].src = e.target.result;
                }

                reader.readAsDataURL(file);
            }
        });
    }
}

getMainImage.addEventListener("change", () => { // Main image gestor
    const file = getMainImage.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            mainImage.style.backgroundImage = `url(${e.target.result})`;
        }

        reader.readAsDataURL(file);
    }
});

licensePdfFile.addEventListener("change", () => { // Main image gestor
    const file = licensePdfFile.files[0];

    if (file) {
        licenseDefaultLicense.checked = false;
    }
});

licenseDefaultLicense.addEventListener("change", () => {
    const file = licensePdfFile.files[0];

    if (file) {
        licensePdfFile.value = "";
    }
    else {
        alert("Your idea must have a license!");
        licenseDefaultLicense.checked = true;
    }
});

addAdditionalInfo.addEventListener("click", () => { // Add additional info
    const newLi = document.createElement("li");
    newLi.classList.add("imageInfoLi");
    newLi.innerHTML += `
        <div></div>
        <img src="./images/delete${themeIsLight?"":"_Pro"}.svg" alt="Delete Additional info" class="deleteAdditionalInfo">
        
        <div>
            <img class="preview" alt="Additional info image" src="./images/FreeIdeas.svg">
            <input type="file" class="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" required>
        </div>

        <div style="display: flex;flex-direction: column;align-items: center;">
            <textarea type="text" class="titleImageInfo" placeholder="Title" maxlength="255" required></textarea>
            <textarea type="text" class="imageInfoDescription" placeholder="Info" maxlength="10000" required></textarea>
        </div>
    `;

    imagesInfo.appendChild(newLi);

    updateQuerySelectorAll();
});

imagesInfo.addEventListener("click", (event) => { // Delete additional info
    if (event.target.classList.contains("deleteAdditionalInfo")) {
        event.target.closest("li").remove();
        updateQuerySelectorAll();
    }
});

addLog.addEventListener("click", () => { // Add log
    const newLi = document.createElement("li");
    newLi.classList.add("log");

    newLi.innerHTML += `
        <img src="./images/delete${themeIsLight?"":"_Pro"}.svg" alt="Delete Log" class="deleteLog">
        <div class="logTitleAndData">
            <textarea class="logTitle" placeholder="Title" maxlength="255" required></textarea>
            <div class="data">${currentdate}</div>
        </div>

        <textarea class="logInfo" placeholder="Description" maxlength="10000" required></textarea>
    `;

    logsList.appendChild(newLi);

    updateQuerySelectorAll();
});

logsList.addEventListener("click", (event) => { // Delete log
    if (event.target.classList.contains("deleteLog")) {
        event.target.closest("li").remove();
        updateQuerySelectorAll();
    }
});

cancelNewIdea.addEventListener("click", () => { // Delete changes
    window.location.href = "./publishAnIdea.php";
});

/* LOGIN GESTOR */
ldAccountData2();

async function ldAccountData2() {
    const SQLdata = await getSessionDataAccountFromDatabase();
    const adminSessionData = await getSessionDataAdminFromDatabase();

    if (!SQLdata && !adminSessionData) {
        try {
            const main = document.querySelector("main");
            main.style.position = "relative";

            const blur = document.createElement("div");

            blur.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                backdrop-filter: blur(5px);
                background-color: rgba(255, 255, 255, 0.2); /* leggero overlay */
                z-index: 90;
                pointer-events: all;
            `;

            const alert = document.createElement("div");
            const titleTextElement = document.createElement("div");
            const textElement = document.createElement("div");

            titleTextElement.innerHTML = "Before to publish an idea you need to login!";
            textElement.innerHTML = `Fore more information you can read our <a href="./termsOfUse.php">Terms of Use</a> and our <a href="privacyPolicy.php">Privacy Policy</a><br><br>If you have any questions you can contact us via email at <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>`;

            alert.style.cssText = `
                width: 500px;
                height: 300px;
                max-width: 80%;
                max-height: 70%;
                position: absolute;
                top: 0;
                align-self: anchor-center;
                justify-self: center;
                z-index: 91;
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

            titleTextElement.style.cssText = `
                font-size: larger;
                padding: 10px;
                align-self: center;
                top: 20%;
                position: absolute;
                color: ${themeIsLight?"#2c3d27":"#cba95c"};
            `;

            textElement.style.cssText = `
                padding: 20px;
                align-self: center;
                top: 40%;
                position: absolute;
                color: ${themeIsLight?"#2c3d27":"#cba95c"};
            `;

            alert.appendChild(titleTextElement);
            alert.appendChild(textElement);

            main.appendChild(blur);
            main.appendChild(alert);

            /* Theme changer */
            try {
                new MutationObserver(() => {
                    alert.style.backgroundColor = `${themeIsLight?"#eaffbe":"#000000"}`;
                    titleTextElement.style.color = `${themeIsLight?"#2c3d27":"#cba95c"}`;
                    textElement.style.color = `${themeIsLight?"#2c3d27":"#cba95c"}`;
                }).observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['data-theme']
                });
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// Modify an existing idea features
async function modifyOldPageIfAuthorLoggedIn() {
    try {
        const SQLdata = await getIdeaDataFromDatabase();
        const sessionData = await getSessionDataAccountFromDatabase();
        const adminSessionData = await getSessionDataAdminFromDatabase();

        if (((sessionData && (parseInt(sessionData['id']) == parseInt(SQLdata['idea'][0].accountId))) || adminSessionData) && SQLdata) {
            let parseTitle = new DOMParser().parseFromString(SQLdata['idea'][0].title, 'text/html');

            title.value = parseTitle.body.innerText;
            author.innerHTML= SQLdata['idea'][0].accountName;
            description.innerHTML = SQLdata['idea'][0].description;
            mainImage.style.backgroundImage = `url(${SQLdata['idea'][0].ideaimage})`;
            getMainImage.removeAttribute("required");

            buttonlink.value = SQLdata['idea'][0].downloadlink;

            typeProject.value = SQLdata['idealabels'][0].type;
            creativityType.value = SQLdata['idealabels'][0].creativity;
            statusProject.value = SQLdata['idealabels'][0].status;

            saveNewIdea.value = "Update";

            SQLdata['info'].forEach(info => {
                const newLi = document.createElement("li");
                newLi.classList.add("imageInfoLi");
                newLi.innerHTML += `
                    <div></div>
                    <img src="./images/delete${themeIsLight?"":"_Pro"}.svg" alt="Delete Additional info" class="deleteAdditionalInfo">
                    
                    <div>
                        <img class="preview" src="${info.updtimage}" alt="Additional info image">
                        <input type="file" class="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp">
                    </div>

                    <div style="display: flex;flex-direction: column;align-items: center;">
                        <textarea type="text" class="titleImageInfo" placeholder="Title" maxlength="255" required>${info.title}</textarea>
                        <textarea type="text" class="imageInfoDescription" placeholder="Info" maxlength="10000" required>${info.description}</textarea>
                    </div>
                `;

                imagesInfo.appendChild(newLi);

                updateQuerySelectorAll();
            });

            SQLdata['log'].forEach(log => {
                const newLi = document.createElement("li");
                newLi.classList.add("log");

                newLi.innerHTML += `
                    <img src="./images/delete${themeIsLight?"":"_Pro"}.svg" alt="Delete Log" class="deleteLog">
                    <div class="logTitleAndData">
                        <textarea class="logTitle" placeholder="Title" maxlength="255" required>${log.title}</textarea>
                        <div class="data">${log.data}</div>
                    </div>

                    <textarea class="logInfo" placeholder="Description" maxlength="10000" required>${log.description}</textarea>
                `;

                logsList.appendChild(newLi);

                updateQuerySelectorAll();
            });

            deleteOldIdea.style.display = "block";
            deleteOldIdea.addEventListener("click", async () => {
                if (await confirm(`Are you sure that you want to delete this idea? This operation cannot be undone.`)) {
                    const dataId = new FormData();
                    dataId.append('id', id);

                    async function sendData(dataId) {
                        try {
                            const res = await fetch(`./api/deleteIdea.php`, {
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
                            window.location.href = "./index.php";
                        }
                        else {
                            console.error(result['error']);
                            printError(421);
                        }
                    }
                }
            });

            // SUBMIT OVERRIDE
            newIdeaForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                updateQuerySelectorAll();

                try {
                    const formData = new FormData();
                    formData.append("ideaid", id);
                    formData.append("title", title.value);
                    formData.append("author", SQLdata['idea'][0].accountId);
                    formData.append("data", currentdate);
                    formData.append("description", description.value);

                    if (getMainImage.files[0]) {
                        formData.append("mainImageFile", getMainImage.files[0]);
                    }
                    else {
                        formData.append("mainImageData", SQLdata['idea'][0].ideaimage);
                    }

                    formData.append("type", typeProject.value);
                    formData.append("creativity", creativityType.value);
                    formData.append("status", statusProject.value);

                    const tempTitles = [];
                    const tempDescriptions = [];
                    const tempTypeOfFile = [];

                    for (let i = 0; i < fileImage.length; i++) {
                        if (fileImage[i].files[0]) {
                            formData.append("additionalInfoImagesFile[]", fileImage[i].files[0]);
                            tempTypeOfFile.push("file");
                        }
                        else {
                            formData.append("additionalInfoImagesData[]", SQLdata['info'][i].updtimage);
                            tempTypeOfFile.push("data");
                        }

                        tempTitles.push(titleSupplemImfo[i].value);
                        tempDescriptions.push(descriptionSupplemImfo[i].value);
                    }

                    const additionalInfoJson = {
                        "titles": tempTitles,
                        "descriptions": tempDescriptions,
                        "types": tempTypeOfFile
                    };
                    
                    formData.append("additionalInfo", JSON.stringify(additionalInfoJson));

                    formData.append("link", buttonlink.value);

                    if (licensePdfFile.files[0]) {
                        formData.append("license", licensePdfFile.files[0]);
                    }
                    else {
                        formData.append("license", SQLdata['idea'][0].license);
                    }

                    const temp2Dates = [];
                    const temp2Titles = [];
                    const temp2Descriptions = [];

                    for (let i = 0; i < logTitle.length; i++) {
                        temp2Dates.push(logData[i].innerHTML);
                        temp2Titles.push(logTitle[i].value);
                        temp2Descriptions.push(logInfo[i].value);
                    }

                    const logJson = {
                        "dates": temp2Dates,
                        "titles": temp2Titles,
                        "descriptions": temp2Descriptions
                    };

                    formData.append("logs", JSON.stringify(logJson));

                    const response = await fetch(`./api/updateOldIdea.php`, {
                        credentials: "include",
                        method: "POST",
                        body: formData
                    });

                    const data = await response.json();

                    if (data) {
                        if (data['success']) {
                            window.location.href = `./ideaVoid.php?idea=${id}`;
                        }
                        else {
                            throw new Error(data['error']);
                        }
                    }
                    else {
                        throw new Error("ERROR_IN_PHP");
                    }
                } catch (error) {
                    console.error(error);
                    printError(421);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

async function getIdeaDataFromDatabase() {
    try {
        const formData = new FormData();
        formData.append("id", id);

        const res = await fetch(`./api/data.php`, {
            credentials: "include",
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();

        return data;
    } catch (error) {
        console.error(error);
        printError(421);

        return null;
    }
}