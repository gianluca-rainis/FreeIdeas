const date = new Date();
const currentdate = `${date.getFullYear()}-${(date.getMonth()+1).toString().length==2?(date.getMonth()+1):"0"+(date.getMonth()+1).toString()}-${date.getDate().toString().length==2?date.getDate():"0"+date.getDate().toString()}`;

const savedIdeaButton = document.getElementById("savedIdea");
const likedIdeaButton = document.getElementById("likedIdea");
const dislikedIdeaButton = document.getElementById("dislikedIdea");
const savedIdeaImg = document.getElementById("savedIdeaImg");
const likedIdeaImg = document.getElementById("likedIdeaImg");
const dislikedIdeaImg = document.getElementById("dislikedIdeaImg");
const savedNumber = document.getElementById("savedNumber");
const likedNumber = document.getElementById("likedNumber");
const dislikedNumber = document.getElementById("dislikedNumber");

const modifyButton = document.getElementById("modifyOldIdea");

let comment = document.querySelectorAll(".comment"); // The comment - IMPORTANT
let writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
let replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
let deleteCommentButton = document.querySelectorAll(".deleteComment"); // Delete a comment if you have writed id

// The id of the page to load
const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url ex. (<a href="./ideaVoid.php?id=123">)
const id = paramsURL.get("idea"); // The id of the page to load

let existCurrentAccountIdeaData = false;
let sessionDataGlobal = null;

function updateQuerySelectorAll() {
    comment = document.querySelectorAll(".comment"); // The comment - IMPORTANT
    writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
    replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
    deleteCommentButton = document.querySelectorAll(".deleteComment"); // Delete a comment if you have writed id
}

// LOAD DATA FROM DATABASE
main();

async function main() {
    if (id && id > 0) {
        const SQLdata = await getIdeaDataFromDatabase();
        sessionDataGlobal = await getSessionDataAccountFromDatabase();

        if (SQLdata) {
            loadData2(SQLdata);
        }
        else {
            printError(404);
        }
    }
    else {
        printError(404);
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

        if (data && data['success'] == false) {
            throw new Error(data['error']);
        }

        return data;
    } catch (error) {
        console.error(error);
        printError(421);

        return null;
    }
}

async function loadData2(SQLdata) {
    try {
        // Modify page if author part
        if (sessionDataGlobal && SQLdata && (parseInt(sessionDataGlobal['id']) == parseInt(SQLdata['idea'][0].accountId))) {
            modifyButton.addEventListener("click", () => {
                window.location.href = `./publishAnIdea.php?idea=${id}`;
            });
        }
        else {
            modifyButton.style.display = "none";
        }

        // Load account dinamic part
        if (SQLdata['accountdata'][0]) {
            if (SQLdata['accountdata'][0].saved == 1) {
                savedIdeaImg.src = `./images/savedIdea${themeIsLight?"":"_Pro"}.svg`;
            }
            else {
                savedIdeaImg.src = `./images/saved${themeIsLight?"":"_Pro"}.svg`;
            }

            if (SQLdata['accountdata'][0].liked == 1) {
                likedIdeaImg.src = `./images/likedIdea${themeIsLight?"":"_Pro"}.svg`;
            }
            else {
                likedIdeaImg.src = `./images/liked${themeIsLight?"":"_Pro"}.svg`;
            }

            if (SQLdata['accountdata'][0].dislike == 1) {
                dislikedIdeaImg.src = `./images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`;
            }
            else {
                dislikedIdeaImg.src = `./images/disliked${themeIsLight?"":"_Pro"}.svg`;
            }

            existCurrentAccountIdeaData = true;
        }

        if (SQLdata['followAccountData']) {
            if (SQLdata['followAccountData'].length == 0) {
                document.getElementById("followIdeaButton").style.backgroundColor = `${themeIsLight?"#b6ffa4":"#cba95c"}`;
            }
            else {
                document.getElementById("followIdeaButton").style.backgroundColor = `${themeIsLight?"#a9acf5":"#5c4e2e"}`;
            }
        }

        // Delete comment gestor
        for (let commentDeleteIndex = 0; commentDeleteIndex < deleteCommentButton.length; commentDeleteIndex++) {
            deleteCommentButton[commentDeleteIndex].addEventListener("click", async () => {
                const commentToDelete = deleteCommentButton[commentDeleteIndex].closest("li");
                const commentToDeleteId = commentToDelete.querySelector(".underComments").dataset.id;

                if (await confirm("Are you sure you want to delete the comment?")) {
                    const data = new FormData();
                            
                    data.append('id', commentToDeleteId);

                    async function sendData(data) {
                        try {
                            const res = await fetch(`./api/deleteComment.php`, {
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

                    if (result) {
                        if (result["success"]) {
                            window.location.href = `./ideaVoid.php?idea=${id}`;
                        }
                        else {
                            console.error(result['error']);
                        }
                    }
                    else {
                        console.error("FATAL_ERROR_IN_PHP");
                    }
                }
            });
        }

        // Reply comment gestor
        for (let commentReplyIndex = 0; commentReplyIndex < replyAtTheCommentButton.length; commentReplyIndex++) {
            replyAtTheCommentButton[commentReplyIndex].addEventListener("click", async () => {
                const sessionData = sessionDataGlobal;

                if (sessionData) {
                    const oldCommentReplyButton = replyAtTheCommentButton[commentReplyIndex];
                    const contentToIniect = document.createElement("div");
                    contentToIniect.innerHTML = `
                        <div class="userInfo">
                            <a href="./accountVoid.php?account=${sessionData['authorid']}" class="writerPage">
                                <img src="${sessionData['userimage']!=null?sessionData['userimage']:`./images/user${themeIsLight?"":"_Pro"}.svg`}" alt="Comment Author Account Image" class="writerImg">
                                <div class="writerUserName">${sessionData['username']}:</div>
                            </a>

                            <div class="dataWriter">${currentdate}</div>
                        </div>

                        <p class="commentText">
                            <textarea id="newCommentText" placeholder="Comment" maxlength="10000" required></textarea>
                        </p>

                        <div style="display:flex;">
                            <p id="saveComment">Save</p>
                            <p id="deleteComment">Delete</p>
                        </div>
                    `;

                    const liCommentNew = document.createElement("li");
                    liCommentNew.className = "comment";
                    liCommentNew.appendChild(contentToIniect);
                
                    let superCommentId = "";
                    if (comment[commentReplyIndex].dataset.value == "rootComment") {
                        comment[commentReplyIndex].removeChild(replyAtTheCommentButton[commentReplyIndex]);
                        comment[commentReplyIndex].appendChild(contentToIniect);
                    }
                    else {                        
                        comment[commentReplyIndex].querySelector(".underComments").appendChild(liCommentNew);

                        superCommentId = comment[commentReplyIndex].querySelector(".underComments").dataset.id;
                    }

                    updateQuerySelectorAll();
                    
                    document.getElementById("saveComment").addEventListener("click", async () => {
                        try {
                            if (document.getElementById("newCommentText").value == "") {
                                alert("The comment can't be void!");
                                throw new Error("ERR_VOID_COMMENT");
                            }

                            const data = new FormData();
                            
                            data.append('authorid', sessionData['id']);
                            data.append('data', currentdate);
                            data.append('description', document.getElementById("newCommentText").value);
                            data.append('ideaid', id);
                            data.append('superCommentid', superCommentId);

                            async function sendData(data) {
                                try {
                                    const res = await fetch(`./api/saveNewComment.php`, {
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
                                console.error("ERROR_SAVING_COMMENT");
                                printError(421);
                            }
                            else {
                                if (result['success']) {
                                    window.location.href = `./ideaVoid.php?idea=${id}`;
                                }
                                else {
                                    printError(result['error']);
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });

                    document.getElementById("deleteComment").addEventListener("click", () => {
                        if (comment[commentReplyIndex].dataset.value == "rootComment") {
                            comment[commentReplyIndex].removeChild(contentToIniect);
                            comment[commentReplyIndex].appendChild(oldCommentReplyButton);
                        }
                        else {
                            comment[commentReplyIndex].querySelector(".underComments").removeChild(liCommentNew);
                        }

                        updateQuerySelectorAll();
                    });
                }
                else {
                    alert("You must log in before writing a comment.");
                }
            });
        }

        toggleThemeGestorIdeaData();
    } catch (error) {
        console.error(error);
        printError(404);
    }
}

// Like, save, dislike gestors
async function toggleSavedLikedDislikedAccountIdeaData() {
    let tempSrc = savedIdeaImg.src;
    let saved = false;
    let liked = false;
    let disliked = false;

    if (tempSrc.includes(`/images/savedIdea${themeIsLight?"":"_Pro"}.svg`)) {
        saved = true;
    }

    tempSrc = likedIdeaImg.src;

    if (tempSrc.includes(`/images/likedIdea${themeIsLight?"":"_Pro"}.svg`)) {
        liked = true;
    }

    tempSrc = dislikedIdeaImg.src;

    if (tempSrc.includes(`/images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`)) {
        disliked = true;
    }

    if (liked && disliked) {
        console.error("LIKE_AND_DISLIKE_AT_THE_SAME_TIME");
        printError(421);
    }
    else {
        const formData = new FormData();
        formData.append("ideaid", id);
        formData.append("saved", saved?"1":"0");
        formData.append("dislike", disliked?"1":"0");
        formData.append("liked", liked?"1":"0");
        formData.append("existRowYet", existCurrentAccountIdeaData?"1":"0");

        try {
            const res = await fetch(`./api/saveAccountIdeaData.php`, {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data['success']) {
                throw new Error("");
            }
        } catch (error) {
            console.error(error);
            printError(421);
        }
    }

    existCurrentAccountIdeaData = true;
}

savedIdeaButton.addEventListener("click", async () => {
    const sessionData = sessionDataGlobal;

    if (sessionData) {
        const currentSrc = savedIdeaImg.src;

        if (currentSrc.includes(`/images/saved${themeIsLight?"":"_Pro"}.svg`)) {
            savedIdeaImg.src = `./images/savedIdea${themeIsLight?"":"_Pro"}.svg`;
            savedNumber.innerHTML = parseInt(savedNumber.innerHTML)+1;
        }
        else if (currentSrc.includes(`/images/savedIdea${themeIsLight?"":"_Pro"}.svg`)) {
            savedIdeaImg.src = `./images/saved${themeIsLight?"":"_Pro"}.svg`;
            savedNumber.innerHTML = parseInt(savedNumber.innerHTML)-1;
        }

        toggleSavedLikedDislikedAccountIdeaData();
    }
    else {
        alert("You need to login before vote a project!");
    }
});

likedIdeaButton.addEventListener("click", async () => {
    const sessionData = sessionDataGlobal;

    if (sessionData) {
        const currentSrc = likedIdeaImg.src;
        const dislikeSrc = dislikedIdeaImg.src;

        if (currentSrc.includes(`/images/liked${themeIsLight?"":"_Pro"}.svg`)) {
            likedIdeaImg.src = `./images/likedIdea${themeIsLight?"":"_Pro"}.svg`;
            likedNumber.innerHTML = parseInt(likedNumber.innerHTML)+1;

            if (dislikeSrc.includes(`/images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`)) { // Can't be like and dislike at the same time
                dislikedIdeaImg.src = `./images/disliked${themeIsLight?"":"_Pro"}.svg`;
                dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)-1;
            }
        }
        else if (currentSrc.includes(`/images/likedIdea${themeIsLight?"":"_Pro"}.svg`)) {
            likedIdeaImg.src = `./images/liked${themeIsLight?"":"_Pro"}.svg`;
            likedNumber.innerHTML = parseInt(likedNumber.innerHTML)-1;
        }

        toggleSavedLikedDislikedAccountIdeaData();
    }
    else {
        alert("You need to login before vote a project!");
    }
});

dislikedIdeaButton.addEventListener("click", async () => {
    const sessionData = sessionDataGlobal;

    if (sessionData) {
        const currentSrc = dislikedIdeaImg.src;
        const likedSrc = likedIdeaImg.src;

        if (currentSrc.includes(`/images/disliked${themeIsLight?"":"_Pro"}.svg`)) {
            dislikedIdeaImg.src = `./images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`;
            dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)+1;

            if (likedSrc.includes(`/images/likedIdea${themeIsLight?"":"_Pro"}.svg`)) { // Can't be like and dislike at the same time
                likedIdeaImg.src = `./images/liked${themeIsLight?"":"_Pro"}.svg`;
                likedNumber.innerHTML = parseInt(likedNumber.innerHTML)-1;
            }
        }
        else if (currentSrc.includes(`/images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`)) {
            dislikedIdeaImg.src = `./images/disliked${themeIsLight?"":"_Pro"}.svg`;
            dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)-1;
        }

        toggleSavedLikedDislikedAccountIdeaData();
    }
    else {
        alert("You need to login before vote a project!");
    }
});

// Report idea
const reportIdeaButton = document.getElementById("reportIdeaButton");

async function reportIdea() {
    try {
        const sessionData = sessionDataGlobal;

        if (sessionData) {
            if (await confirm("Are you sure you want to report this idea? This action cannot be undone. Remember that reporting an idea also harms the idea's creator.")) {
                const feedback = await prompt("Please tell us why you think this content is inappropriate.");
                
                if (feedback != null) {
                    if (feedback != "") {
                        const formData = new FormData();
                        formData.append("ideaid", id);
                        formData.append("feedback", feedback);
                        formData.append("accountid", null);

                        try {
                            const res = await fetch(`./api/reportIdeaAccount.php`, {
                                credentials: "include",
                                method: "POST",
                                body: formData
                            });

                            const data = await res.json();

                            if (!data['success']) {
                                console.error(data['error']);
                            }
                            else {
                                alert("The idea was successfully reported.");
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    else {
                        alert("The feedback cannot be empty.");
                    }
                }
            }
        }
        else {
            alert("You must login before you can report an idea!");
        }
    } catch (error) {
        console.error(error);
    }
}

reportIdeaButton.addEventListener("click", reportIdea);

// Follow idea
const followIdeaButton = document.getElementById("followIdeaButton");

async function followIdea() {
    try {
        const sessionData = sessionDataGlobal;

        if (sessionData) {
            const formData = new FormData();
            formData.append("followedideaid", id);

            try {
                const res = await fetch(`./api/followAccountIdea.php`, {
                    credentials: "include",
                    method: "POST",
                    body: formData
                });

                const data = await res.json();

                if (!data['success']) {
                    console.error(data['error']);
                }
                else {
                    followIdeaButton.style.backgroundColor = data["isNowFollowed"]?`${themeIsLight?"#a9acf5":"#5c4e2e"}`:`${themeIsLight?"#b6ffa4":"#cba95c"}`;
                }
            } catch (error) {
                console.error(error);
            }
        }
        else {
            alert("You must login before you can follow an idea!");
        }
    } catch (error) {
        console.error(error);
    }
}

followIdeaButton.addEventListener("click", followIdea);

/* Toggle theme */
function toggleThemeGestorIdeaData() {
    new MutationObserver(() => {
        const currentSrc = savedIdeaImg.src;

        if (currentSrc.includes("savedIdea")) {
            savedIdeaImg.src = `./images/savedIdea${themeIsLight?"":"_Pro"}.svg`;
        }
        else {
            savedIdeaImg.src = `./images/saved${themeIsLight?"":"_Pro"}.svg`;
        }

        if (likedIdeaImg.src.includes("likedIdea")) {
            likedIdeaImg.src = `./images/likedIdea${themeIsLight?"":"_Pro"}.svg`;
        }
        else {
            likedIdeaImg.src = `./images/liked${themeIsLight?"":"_Pro"}.svg`;
        }

        if (dislikedIdeaImg.src.includes("dislikedIdea")) {
            dislikedIdeaImg.src = `./images/dislikedIdea${themeIsLight?"":"_Pro"}.svg`;
        }
        else {
            dislikedIdeaImg.src = `./images/disliked${themeIsLight?"":"_Pro"}.svg`;
        }

        if (document.getElementById("followIdeaButton")) {
            function rgbToHex(rgb) { // Convert rgb(r, g, b) to #rrggbb
                const result = rgb.match(/\d+/g); // Select the numbers

                return ("#" + result.map((x) => {
                    const hex = parseInt(x).toString(16); // In base 16
                    return hex.length==1?"0"+hex:hex; // If have 1 char add a 0
                }).join(""));
            }

            if (rgbToHex(document.getElementById("followIdeaButton").style.backgroundColor) == `${!themeIsLight?"#b6ffa4":"#cba95c"}`) {
                document.getElementById("followIdeaButton").style.backgroundColor = `${themeIsLight?"#b6ffa4":"#cba95c"}`;
            }
            else {
                document.getElementById("followIdeaButton").style.backgroundColor = `${themeIsLight?"#a9acf5":"#5c4e2e"}`;
            }
        }

        writerImage.forEach(writer => {
            if (writer.src.includes("/images/user")) {
                writer.src = `./images/user${themeIsLight?"":"_Pro"}.svg`;
            }
        });
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}