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
let commentAtTheComment = document.querySelectorAll(".underComments"); // The comments at the comment - IT CONTAIN EVERYTHING SINCE THE comment Li

// The id of the page to load
const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url ex. (<a href="./ideaVoid.html?id=123">)
const id = paramsURL.get("idea"); // The id of the page to load

let error2 = false; // Error variable to print only the most specific error
let existCurrentAccountIdeaData = false;

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
        console.log(error);

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

function loadData2(SQLdata) {
    try {
        ideaTitle.innerHTML = SQLdata['idea'][0].title;
        mainIdeaImageBg.style.backgroundImage = `url(${SQLdata['idea'][0].ideaimage})`;
        authorAccount.innerHTML = SQLdata['idea'][0].accountName;
        authorAccount.href = `./accountVoid.html?account=${SQLdata['idea'][0].accountId}`;
        mainDescription.innerHTML = SQLdata['idea'][0].description;

        savedNumber.innerHTML = SQLdata['idealabels'][0].saves;
        likedNumber.innerHTML = SQLdata['idealabels'][0].likes;
        dislikedNumber.innerHTML = SQLdata['idealabels'][0].dislike;

        if (SQLdata['accountdata'][0]) {
            if (SQLdata['accountdata'][0].saved == 1) {
                savedIdeaImg.src = "./images/savedIdea.svg";
            }

            if (SQLdata['accountdata'][0].liked == 1) {
                likedIdeaImg.src = "./images/likedIdea.svg";
            }

            if (SQLdata['accountdata'][0].dislike == 1) {
                dislikedIdeaImg.src = "./images/dislikedIdea.svg";
            }

            existCurrentAccountIdeaData = true;
        }

        if (SQLdata['idea'][0].downloadlink) { // Download link
            buttonLink.href = SQLdata['idea'][0].downloadlink;
        }
        else {
            downloadSection.innerHTML = "";
        }

        if (SQLdata['info'].length != 0) { // Info with images
            tempBoolControl = true;
            SQLdata['info'].forEach(row => {
                if (!tempBoolControl) {
                    additionalInfoWithImagesUl.innerHTML += `<li class="imageInfoLi">
                        <img src="./images/voidImage.jpg" class="imageInfo">
                        <div>
                            <h3 class="titleImageInfo">Info</h3>
                        
                            <p class="imageInfoDescription">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.

                            Aliquam erat volutpat. Phasellus hendrerit leo massa. Ut et rutrum mi, vitae fringilla libero. Nunc ut vulputate libero, vel semper tortor. Nunc faucibus efficitur convallis. Duis malesuada odio a iaculis aliquam. Aliquam erat volutpat. Integer sodales metus in dolor congue volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In a risus eu ante sollicitudin blandit.

                            Aliquam erat volutpat. Suspendisse condimentum mi nec metus finibus faucibus. Aliquam aliquet nisl nunc, a eleifend justo dapibus vitae. Pellentesque interdum dapibus libero ut dictum. Integer vitae urna eu ex tincidunt efficitur. Aenean eget sem sit amet felis pulvinar ornare. Donec diam ipsum, cursus in risus vel, vehicula pharetra purus. Etiam porta nulla in nunc pretium gravida. Nunc nunc mauris, tincidunt eget vestibulum sit amet, vestibulum eu massa. Vivamus euismod nisi id mi convallis sollicitudin.
                            </p>
                        </div>
                    </li>`;

                    additionalInfoWithImageLi = document.querySelectorAll(".imageInfoLi"); // The li of the additional info with images
                    additionalInfoWithImageImage = document.querySelectorAll(".imageInfo"); // The image
                    additionalInfoWithImageTitle = document.querySelectorAll(".titleImageInfo"); // The title
                    additionalInfoWithImageDescription = document.querySelectorAll(".imageInfoDescription"); // The description
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

                    log = document.querySelectorAll(".log"); // The li with the log data
                    logTitleAndDataGroup = document.querySelectorAll(".logTitleAndData"); // The div with the logtitle and the data
                    logTitle = document.querySelectorAll(".logTitle"); // The log title
                    logData = document.querySelectorAll(".data"); // The log data (yyyy-mm-gg)
                    logDescription = document.querySelectorAll(".logInfo"); // The p with the log content
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
            SQLdata['comment'].forEach(row => {
                if (row.superCommentid === null) {
                    commentsListUl.innerHTML += `<li class="comment">
                            <div class="userInfo">
                                <a href="" class="writerPage">
                                    <img src="${row.userimage!=null?row.userimage:"./images/user.png"}" class="writerImg">
                                    <div class="writerUserName">${row.username}:</div>
                                </a>

                                <div class="dataWriter">${row.data}</div>
                            </div>
                            <p class="commentText">${row.description}</p>
                            <p class="replyComment">Reply</p>

                            <ul class="underComments" data-id="${row.id}">
                                
                            </ul>
                        </li>`;
                }
                else {
                    commentAtTheComment.forEach(element => {
                        if (element.dataset.id == row.superCommentid) {
                            element.innerHTML += `<li class="comment">
                                <div class="userInfo">
                                    <a href="" class="writerPage">
                                        <img src="${row.userimage!=null?row.userimage:"./images/user.png"}" class="writerImg">
                                        <div class="writerUserName">${row.username}:</div>
                                    </a>

                                    <div class="dataWriter">${row.data}</div>
                                </div>
                                <p class="commentText">${row.description}</p>
                                <p class="replyComment">Reply</p>

                                <ul class="underComments" data-id="${row.id}">
                                    
                                </ul>
                            </li>`;
                        }
                    });
                }

                comment = document.querySelectorAll(".comment"); // The comment LI
                userInfoDiv = document.querySelectorAll(".userInfo"); // The section with the user info of the comment
                linkToWriterAccount = document.querySelectorAll(".writerPage"); // The a with the link at the comment's writer account
                writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
                writerUserName = document.querySelectorAll(".writerUserName"); // The username of the author
                dataComment = document.querySelectorAll(".dataWriter"); // The data of the comment (yyyy-mm-gg)
                commentText = document.querySelectorAll(".commentText"); // The p with the comment text
                replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
                commentAtTheComment = document.querySelectorAll(".underComments"); // The comments at the comment
            });

            commentsListUl.innerHTML += `<li class="comment" data-value="rootComment"><p class="replyComment">Write a comment!</p></li>`;
        }
        else {
            commentsListUl.innerHTML = `<li class="comment" data-value="rootComment"><p class="replyComment">Write the first comment!</p></li>`;

            comment = document.querySelectorAll(".comment");
            replyAtTheCommentButton = document.querySelectorAll(".replyComment");
        }

        comment = document.querySelectorAll(".comment"); // The comment LI
        userInfoDiv = document.querySelectorAll(".userInfo"); // The section with the user info of the comment
        linkToWriterAccount = document.querySelectorAll(".writerPage"); // The a with the link at the comment's writer account
        writerImage = document.querySelectorAll(".writerImg") // The image of the writer account
        writerUserName = document.querySelectorAll(".writerUserName"); // The username of the author
        dataComment = document.querySelectorAll(".dataWriter"); // The data of the comment (yyyy-mm-gg)
        commentText = document.querySelectorAll(".commentText"); // The p with the comment text
        replyAtTheCommentButton = document.querySelectorAll(".replyComment"); // The text for reply at the comment
        commentAtTheComment = document.querySelectorAll(".underComments"); // The comments at the comment

        // Reply comment gestor
        for (let commentReplyIndex = 0; commentReplyIndex < replyAtTheCommentButton.length; commentReplyIndex++) {
            replyAtTheCommentButton[commentReplyIndex].addEventListener("click", async () => {
                const sessionData = await isLoggedIn();
                const oldCommentContent = comment[commentReplyIndex].innerHTML;

                if (sessionData) {
                    let superCommentId = "";

                    if (comment[commentReplyIndex].dataset.value == "rootComment") {
                        comment[commentReplyIndex].innerHTML = `
                            <div class="userInfo">
                                <a href="" class="writerPage">
                                    <img src="${sessionData['userimage']!=null?sessionData['userimage']:"./images/user.png"}" class="writerImg">
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
                    } else {
                        comment[commentReplyIndex].querySelector(".underComments").innerHTML += `
                        <li class="comment">
                            <div class="userInfo">
                                <a href="" class="writerPage">
                                    <img src="${sessionData['userimage']!=null?sessionData['userimage']:"./images/user.png"}" class="writerImg">
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
                        </li>
                        `;

                        superCommentId = comment[commentReplyIndex].querySelector(".underComments").dataset.id;
                    }
                    
                    document.getElementById("saveComment").addEventListener("click", async () => {
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
                                window.location.href = `./ideaVoid.html?idea=${id}`;
                            }
                            else {
                                printError(result['error']);
                            }
                        }
                    });

                    document.getElementById("deleteComment").addEventListener("click", () => {
                        comment[commentReplyIndex].innerHTML = oldCommentContent;
                    });
                } else {
                    alert("You must log in before writing a comment.");
                }
            });
        }
    } catch (error) {
        console.log(error);
        printError(404);
    }
}

// Like, save, dislike gestors
async function toggleSavedLikedDislikedAccountIdeaData() {
    let tempSrc = savedIdeaImg.src;
    let saved = false;
    let liked = false;
    let disliked = false;

    if (tempSrc.includes("/images/savedIdea.svg")) {
        saved = true;
    }

    tempSrc = likedIdeaImg.src;

    if (tempSrc.includes("/images/likedIdea.svg")) {
        liked = true;
    }

    tempSrc = dislikedIdeaImg.src;

    if (tempSrc.includes("/images/dislikedIdea.svg")) {
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
            console.log(error);
            printError(421);
        }
    }

    existCurrentAccountIdeaData = true;
}

savedIdeaButton.addEventListener("click", async () => {
    const sessionData = await isLoggedIn();

    if (sessionData) {
        const currentSrc = savedIdeaImg.src;

        if (currentSrc.includes("/images/saved.svg")) {
            savedIdeaImg.src = "./images/savedIdea.svg";
            savedNumber.innerHTML = parseInt(savedNumber.innerHTML)+1;
        }
        else if (currentSrc.includes("/images/savedIdea.svg")) {
            savedIdeaImg.src = "./images/saved.svg";
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

        if (currentSrc.includes("/images/liked.svg")) {
            likedIdeaImg.src = "./images/likedIdea.svg";
            likedNumber.innerHTML = parseInt(likedNumber.innerHTML)+1;

            if (dislikeSrc.includes("/images/dislikedIdea.svg")) { // Can't be like and dislike at the same time
                dislikedIdeaImg.src = "./images/disliked.svg";
                dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)-1;
            }
        }
        else if (currentSrc.includes("/images/likedIdea.svg")) {
            likedIdeaImg.src = "./images/liked.svg";
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

        if (currentSrc.includes("/images/disliked.svg")) {
            dislikedIdeaImg.src = "./images/dislikedIdea.svg";
            dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)+1;

            if (likedSrc.includes("/images/likedIdea.svg")) { // Can't be like and dislike at the same time
                likedIdeaImg.src = "./images/liked.svg";
                likedNumber.innerHTML = parseInt(likedNumber.innerHTML)-1;
            }
        }
        else if (currentSrc.includes("/images/dislikedIdea.svg")) {
            dislikedIdeaImg.src = "./images/disliked.svg";
            dislikedNumber.innerHTML = parseInt(dislikedNumber.innerHTML)-1;
        }

        toggleSavedLikedDislikedAccountIdeaData();
    }
    else {
        alert("You need to login before vote a project!");
    }
});