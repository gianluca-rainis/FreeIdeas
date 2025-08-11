const mainIdea = document.getElementById("ideaMain"); // The main of the page

const date = new Date();
const currentdate = `${date.getFullYear()}-${(date.getMonth()+1).toString().length==2?(date.getMonth()+1):"0"+(date.getMonth()+1).toString()}-${date.getDate().toString().length==2?date.getDate():"0"+date.getDate().toString()}`;

const mainIdeaImageBg = document.getElementById("ideaImageAsBackground"); // Background of the main image
const ideaTitle = document.getElementById("title"); // Idea title
const ideaAuthor = document.getElementById("author"); // Idea main author
const authorAccount = document.getElementById("mainAuthorAccount"); // Idea main author link to account
const mainDescription = document.getElementById("description"); // Description

const savedIdeaButton = document.getElementById("savedIdea");
const likedIdeaButton = document.getElementById("likedIdea");
const dislikedIdeaButton = document.getElementById("dislikedIdea");
const savedIdeaImg = document.getElementById("savedIdeaImg");
const likedIdeaImg = document.getElementById("likedIdeaImg");
const dislikedIdeaImg = document.getElementById("dislikedIdeaImg");
const savedNumber = document.getElementById("savedNumber");
const likedNumber = document.getElementById("likedNumber");
const dislikedNumber = document.getElementById("dislikedNumber");

const additionalInfoWithImagesUl = document.getElementById("imagesInfo"); // The ul with the additional info with images
let additionalInfoWithImageLi = document.querySelectorAll(".imageInfoLi"); // The li of the additional info with images
let additionalInfoWithImageImage = document.querySelectorAll(".imageInfo"); // The image
let additionalInfoWithImageTitle = document.querySelectorAll(".titleImageInfo"); // The title
let additionalInfoWithImageDescription = document.querySelectorAll(".imageInfoDescription"); // The description

const downloadSection = document.getElementById("downloadSection"); // The section of the download
// const downloadText = document.getElementById("download"); // The h3 with the text Download
const buttonLink = document.getElementById("buttonlink"); // The a for the link of the button
const downloadButton = document.getElementById("downloadButton"); // The button to the download

const devLogsSection = document.getElementById("devLogsSection"); // The section with the logs
// const logsTitleh3 = document.getElementById("logsName"); // The name of the log
const logsListUl = document.getElementById("logsList"); // The ul of the logs
let log = document.querySelectorAll(".log"); // The li with the log data
let logTitleAndDataGroup = document.querySelectorAll(".logTitleAndData"); // The div with the logtitle and the data
let logTitle = document.querySelectorAll(".logTitle"); // The log title
let logData = document.querySelectorAll(".data"); // The log data (yyyy-mm-gg)
let logDescription = document.querySelectorAll(".logInfo"); // The p with the log content

const commentSection = document.getElementById("commentSection"); // The section with all the comment data
// const commentsTitleh3 = document.getElementById("commentsTitle"); // The comment section title
const commentsListUl = document.getElementById("commentsList"); // The ul with all the comments

let comment = document.querySelectorAll(".comment"); // The comment - IMPORTANT
let userInfoDiv = document.querySelectorAll(".userInfo"); // The section with the user info of the comment
let linkToWriterAccount = document.querySelectorAll(".writerPage"); // The a with the link at the comment's writer account
let writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
let writerUserName = document.querySelectorAll(".writerUserName"); // The username of the author
let dataComment = document.querySelectorAll(".dataWriter"); // The data of the comment (yyyy-mm-gg)
let commentText = document.querySelectorAll(".commentText"); // The p with the comment text
let replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
let deleteCommentButton = document.querySelectorAll(".deleteComment"); // Delete a comment if you have writed id
let commentAtTheComment = document.querySelectorAll(".underComments"); // The comments at the comment - IT CONTAIN EVERYTHING SINCE THE comment Li

// The id of the page to load
const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url ex. (<a href="./ideaVoid.php?id=123">)
const id = paramsURL.get("idea"); // The id of the page to load

let error2 = false; // Error variable to print only the most specific error
let existCurrentAccountIdeaData = false;

function updateQuerySelectorAll() {
    additionalInfoWithImageLi = document.querySelectorAll(".imageInfoLi"); // The li of the additional info with images
    additionalInfoWithImageImage = document.querySelectorAll(".imageInfo"); // The image
    additionalInfoWithImageTitle = document.querySelectorAll(".titleImageInfo"); // The title
    additionalInfoWithImageDescription = document.querySelectorAll(".imageInfoDescription"); // The description
    log = document.querySelectorAll(".log"); // The li with the log data
    logTitleAndDataGroup = document.querySelectorAll(".logTitleAndData"); // The div with the logtitle and the data
    logTitle = document.querySelectorAll(".logTitle"); // The log title
    logData = document.querySelectorAll(".data"); // The log data (yyyy-mm-gg)
    logDescription = document.querySelectorAll(".logInfo"); // The p with the log content
    comment = document.querySelectorAll(".comment"); // The comment - IMPORTANT
    userInfoDiv = document.querySelectorAll(".userInfo"); // The section with the user info of the comment
    linkToWriterAccount = document.querySelectorAll(".writerPage"); // The a with the link at the comment's writer account
    writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
    writerUserName = document.querySelectorAll(".writerUserName"); // The username of the author
    dataComment = document.querySelectorAll(".dataWriter"); // The data of the comment (yyyy-mm-gg)
    commentText = document.querySelectorAll(".commentText"); // The p with the comment text
    replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
    deleteCommentButton = document.querySelectorAll(".deleteComment"); // Delete a comment if you have writed id
    commentAtTheComment = document.querySelectorAll(".underComments"); // The comments at the comment - IT CONTAIN EVERYTHING SINCE THE comment Li
}

// LOAD DATA FROM DATABASE
main(id);

async function main(id) {
    if (id && id > 0) {
        const SQLdata = await getDataFromDatabase2(id);

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

async function isLoggedIn() {
    const sessionData = await getSessionData2();

    if (sessionData) {
        return sessionData;
    }
    else {
        return null;
    }
}

async function getDataFromDatabase2(id) {
    try {
        const res = await fetch(`./api/data.php?id=${id}`);
        const data = await res.json();

        return data;
    } catch (error) {
        console.error(error);

        printError(421);

        return null;
    }
}

async function getSessionData2() {
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
    if (!error2) {
        mainIdea.innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        error2 = true;
    }
}

async function loadData2(SQLdata) {
    try {
        ideaTitle.innerHTML = SQLdata['idea'][0].title;
        mainIdeaImageBg.style.backgroundImage = `url(${SQLdata['idea'][0].ideaimage})`;
        authorAccount.innerHTML = SQLdata['idea'][0].accountName;
        authorAccount.href = `${SQLdata['idea'][0].accountPublic==1?`./accountVoid.php?account=${SQLdata['idea'][0].accountId}`:""}`;
        mainDescription.innerHTML = SQLdata['idea'][0].description;

        savedNumber.innerHTML = SQLdata['idealabels'][0].saves;
        likedNumber.innerHTML = SQLdata['idealabels'][0].likes;
        dislikedNumber.innerHTML = SQLdata['idealabels'][0].dislike;

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

        if (SQLdata['idea'][0].downloadlink) { // Download link
            buttonLink.href = SQLdata['idea'][0].downloadlink;
            downloadButton.innerHTML = SQLdata['idea'][0].downloadlink;
        }
        else {
            downloadSection.innerHTML = "";
            downloadSection.style.display = "none";
        }

        if (SQLdata['info'].length != 0) { // Info with images
            tempBoolControl = true;
            SQLdata['info'].forEach(row => {
                if (!tempBoolControl) {
                    additionalInfoWithImagesUl.innerHTML += `<li class="imageInfoLi">
                        <img src="./images/FreeIdeas.svg" alt="Additional info image" class="imageInfo">
                        <div>
                            <h3 class="titleImageInfo">Info</h3>
                        
                            <p class="imageInfoDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.

                            Aliquam erat volutpat. Phasellus hendrerit leo massa. Ut et rutrum mi, vitae fringilla libero. Nunc ut vulputate libero, vel semper tortor. Nunc faucibus efficitur convallis. Duis malesuada odio a iaculis aliquam. Aliquam erat volutpat. Integer sodales metus in dolor congue volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In a risus eu ante sollicitudin blandit.

                            Aliquam erat volutpat. Suspendisse condimentum mi nec metus finibus faucibus. Aliquam aliquet nisl nunc, a eleifend justo dapibus vitae. Pellentesque interdum dapibus libero ut dictum. Integer vitae urna eu ex tincidunt efficitur. Aenean eget sem sit amet felis pulvinar ornare. Donec diam ipsum, cursus in risus vel, vehicula pharetra purus. Etiam porta nulla in nunc pretium gravida. Nunc nunc mauris, tincidunt eget vestibulum sit amet, vestibulum eu massa. Vivamus euismod nisi id mi convallis sollicitudin.
                            </p>
                        </div>
                    </li>`;

                    updateQuerySelectorAll();
                }
                else {
                    tempBoolControl = false;
                }

                additionalInfoWithImageTitle[additionalInfoWithImageTitle.length-1].innerHTML = row.title;
                additionalInfoWithImageImage[additionalInfoWithImageImage.length-1].src = `${row.updtimage}`;
                additionalInfoWithImageDescription[additionalInfoWithImageDescription.length-1].innerHTML = row.description;
            });
        }
        else {
            additionalInfoWithImagesUl.innerHTML = "";
        }        

        if (SQLdata['log'].length != 0) { // Logs
            tempBoolControl = true;
            SQLdata['log'].forEach(row => {
                if (!tempBoolControl) {
                    logsListUl.innerHTML += `<li class="log">
                            <div class="logTitleAndData">
                                <h4 class="logTitle">Log</h4>
                                <div class="data">yyyy-mm-gg</div>
                            </div>

                            <p class="logInfo">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.

                            Aliquam erat volutpat. Phasellus hendrerit leo massa. Ut et rutrum mi, vitae fringilla libero. Nunc ut vulputate libero, vel semper tortor. Nunc faucibus efficitur convallis. Duis malesuada odio a iaculis aliquam. Aliquam erat volutpat. Integer sodales metus in dolor congue volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In a risus eu ante sollicitudin blandit.

                            Aliquam erat volutpat. Suspendisse condimentum mi nec metus finibus faucibus. Aliquam aliquet nisl nunc, a eleifend justo dapibus vitae. Pellentesque interdum dapibus libero ut dictum. Integer vitae urna eu ex tincidunt efficitur. Aenean eget sem sit amet felis pulvinar ornare. Donec diam ipsum, cursus in risus vel, vehicula pharetra purus. Etiam porta nulla in nunc pretium gravida. Nunc nunc mauris, tincidunt eget vestibulum sit amet, vestibulum eu massa. Vivamus euismod nisi id mi convallis sollicitudin.
                            </p>
                        </li>`;

                    updateQuerySelectorAll();
                }
                else {
                    tempBoolControl = false;
                }

                logTitle[logTitle.length-1].innerHTML = row.title;
                logData[logData.length-1].innerHTML = row.data;
                logDescription[logDescription.length-1].innerHTML = row.description;
            });
        }
        else {
            devLogsSection.innerHTML = "";
        }
        
        if (SQLdata['comment'].length != 0) {
            const sessionData = await isLoggedIn();

            SQLdata['comment'].forEach(row => {
                if (row.superCommentid === null) {
                    commentsListUl.innerHTML += `<li class="comment">
                            <div class="userInfo">
                                <a href="./accountVoid.php?account=${row.authorid}" class="writerPage">
                                    <img src="${row.userimage!=null?row.userimage:`./images/user${themeIsLight?"":"_Pro"}.svg`}" alt="Comment Author Account Image" class="writerImg">
                                    <div class="writerUserName">${row.username}:</div>
                                </a>

                                <div class="dataWriter">${row.data}</div>
                            </div>
                            <p class="commentText">${row.description}</p>
                            <p class="replyComment">Reply</p>
                            ${sessionData?(row.authorid==sessionData['id']?`<p class="deleteComment">Delete</p>`:""):""}

                            <ul class="underComments" data-id="${row.id}">
                                
                            </ul>
                        </li>`;
                }
                else {
                    commentAtTheComment.forEach(element => {
                        if (element.dataset.id == row.superCommentid) {
                            element.innerHTML += `<li class="comment">
                                <div class="userInfo">
                                    <a href="./accountVoid.php?account=${row.authorid}" class="writerPage">
                                        <img src="${row.userimage!=null?row.userimage:`./images/user${themeIsLight?"":"_Pro"}.svg`}" alt="Comment Author Account Image" class="writerImg">
                                        <div class="writerUserName">${row.username}:</div>
                                    </a>

                                    <div class="dataWriter">${row.data}</div>
                                </div>
                                <p class="commentText">${row.description}</p>
                                <p class="replyComment">Reply</p>
                                ${sessionData?(row.authorid==sessionData['id']?'<p class="deleteComment">Delete</p>':""):""}

                                <ul class="underComments" data-id="${row.id}">
                                    
                                </ul>
                            </li>`;
                        }
                    });
                }

                updateQuerySelectorAll();
            });

            commentsListUl.innerHTML += `<li class="comment" data-value="rootComment"><p class="replyComment">Write a comment!</p></li>`;
        }
        else {
            commentsListUl.innerHTML = `<li class="comment" data-value="rootComment"><p class="replyComment">Write the first comment!</p></li>`;

            comment = document.querySelectorAll(".comment");
            replyAtTheCommentButton = document.querySelectorAll(".replyComment");
        }

        updateQuerySelectorAll();

        // Delete comment gestor
        for (let commentDeleteIndex = 0; commentDeleteIndex < deleteCommentButton.length; commentDeleteIndex++) {
            deleteCommentButton[commentDeleteIndex].addEventListener("click", async () => {
                const commentToDelete = deleteCommentButton[commentDeleteIndex].closest("li");
                const commentToDeleteId = commentToDelete.querySelector(".underComments").dataset.id;

                if (await confirm("Are you sure you want to delete the comment?\nThis will also delete all subcomments.")) {
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
                            return null;
                        }
                    }

                    const result = await sendData(data);

                    if (result) {
                        if (result["success"]) {
                            window.location.href = `./ideaVoid.php?idea=${id}`;
                        } else {
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
                const sessionData = await isLoggedIn();

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
                    } else {                        
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
                        } else {
                            comment[commentReplyIndex].querySelector(".underComments").removeChild(liCommentNew);
                        }

                        updateQuerySelectorAll();
                    });
                } else {
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
    const sessionData = await isLoggedIn();

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
    const sessionData = await isLoggedIn();

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
    const sessionData = await isLoggedIn();

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

// Modify page if author part
const modifyButton = document.getElementById("modifyOldIdea");

modifyOldPageIfAuthorLoggedIn();

async function modifyOldPageIfAuthorLoggedIn() {
    try {
        const SQLdata = await getDataFromDatabase2(id);
        const sessionData = await isLoggedIn();

        if (sessionData && SQLdata && (parseInt(sessionData['id']) == parseInt(SQLdata['idea'][0].accountId))) {
            modifyButton.addEventListener("click", () => {
                window.location.href = `./publishAnIdea.php?idea=${id}`;
            });
        }
        else {
            modifyButton.style.display = "none";
        }
    } catch (error) {
        console.error(error);
    }
}

// Report idea
const reportIdeaButton = document.getElementById("reportIdeaButton");

async function reportIdea() {
    try {
        const sessionData = await isLoggedIn();

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