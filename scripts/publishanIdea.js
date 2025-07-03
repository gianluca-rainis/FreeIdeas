const main = document.getElementById("newIdeaMain");
const newIdeaForm = document.getElementById("newIdeaForm");
const saveNewIdea = document.getElementById("saveNewIdea");
const cancelNewIdea = document.getElementById("cancelNewIdea");

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

const logsList = document.getElementById("logsList");
const addLog = document.getElementById("addLog");
let logTitle = document.querySelectorAll(".logTitle");
let logData = document.querySelectorAll(".data");
let logInfo = document.querySelectorAll(".logInfo");
let deleteLog = document.querySelectorAll(".deleteLog");

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

getMainImage.addEventListener("change", () => {
    const file = getMainImage.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            mainImage.style.backgroundImage = `url(${e.target.result})`;
        }

        reader.readAsDataURL(file);
    }
});

addAdditionalInfo.addEventListener("click", () => {
    const newLi = document.createElement("li");
    newLi.classList.add("imageInfoLi");
    newLi.innerHTML += `
        <div></div>
        <img src="./images/delete.svg" class="deleteAdditionalInfo">
        
        <div>
            <img class="preview" src="./images/voidImage.jpg">
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

imagesInfo.addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteAdditionalInfo")) {
        event.target.closest("li").remove();
    }
});

addLog.addEventListener("click", () => {
    const newLi = document.createElement("li");
    newLi.classList.add("log");

    newLi.innerHTML += `
        <img src="./images/delete.svg" class="deleteLog">
        <div class="logTitleAndData">
            <textarea class="logTitle" placeholder="Title" maxlength="255" required></textarea>
            <div class="data">${currentdate}</div>
        </div>

        <textarea class="logInfo" placeholder="Description" maxlength="10000" required></textarea>
    `;

    logsList.appendChild(newLi);

    updateQuerySelectorAll();
});

logsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteLog")) {
        event.target.closest("li").remove();
    }
});

cancelNewIdea.addEventListener("click", () => {
    window.location.href = "./publishAnIdea.html";
});

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
            "titles":tempTitles,
            "descriptions":tempDescriptions
        };
        
        formData.append("additionalInfo", JSON.stringify(additionalInfoJson));

        formData.append("link", buttonlink.value);

        const temp2Dates = [];
        const temp2Titles = [];
        const temp2Descriptions = [];
        for (let i = 0; i < logTitle.length; i++) {
            temp2Dates.push(logData[i].innerHTML);
            temp2Titles.push(logTitle[i].value);
            temp2Descriptions.push(logInfo[i].value);
        }

        const logJson = {
            "dates":temp2Dates,
            "titles":temp2Titles,
            "descriptions":temp2Descriptions
        };

        formData.append("logs", JSON.stringify(logJson));

        /* for (const [key, value] of formData) {
           console.log(`${key}: ${value}\n`);
        } */

        const response = await fetch(newIdeaForm.action, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data) {
            window.location.href = "./index.html";
        }
        else {
            throw new Error("ERROR_IN_PHP");
        }
    } catch (error) {
        console.error(error);
        printError(421);
    }
});

/* LOGIN GESTOR */
error = false; // Error variable to print only the most specific error
tempBoolControl = false;

ldAccountData2();

async function ldAccountData2() {
    const SQLdata = await getDataFromDatabase2();

    if (SQLdata) {
        loadData2(SQLdata);
    }
    else {
        main.innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(119, 177, 66);">Before to publish an idea you need to login</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(64, 133, 43);">Fore more information you can read our <a href="./termsOfUse.html">Terms of Use</a> and our <a href="privacyPolicy.html">Privacy Policy</a></p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(64, 133, 43);">If you have any questions you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        if (document.querySelector("header")) {
            document.querySelector("header").innerHTML = "";
            document.querySelector("header").style.visibility = "hidden";
        }
    }
}

async function getDataFromDatabase2() {
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

function loadData2(SQLdata) {
    try {
        author.innerHTML = SQLdata['username'];
        authorid = SQLdata['id'];
    } catch (error) {
        printError(404);
    }
}