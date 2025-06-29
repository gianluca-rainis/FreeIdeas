const mainIdea = document.getElementById("ideaMain"); // The main of the page

const mainIdeaImageBg = document.getElementById("ideaImageAsBackground"); // Background of the main image
const ideaTitle = document.getElementById("title"); // Idea title
const ideaAuthor = document.getElementById("author"); // Idea main author
const authorAccount = document.getElementById("mainAuthorAccount"); // Idea main author link to account
const mainDescription = document.getElementById("description"); // Description

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

let error = false; // Error variable to print only the most specific error
let tempBoolControl = false;

main(id);

async function main(id) {
    if (id && id > 0) {
        const SQLdata = await getDataFromDatabase(id);

        if (SQLdata) {
            loadData(SQLdata);
        }
        else {
            printError(404);
        }
    }
    else {
        printError(404);
    }
}

async function getDataFromDatabase(id) {
    try {
        const res = await fetch(`./api/data.php?id=${id}`);
        const data = await res.json();

        return data;
    } catch (error) {
        printError(421);

        return null;
    }
}

function printError(errorCode) {
    if (!error) {
        mainIdea.innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        error = true;
    }
}

function loadData(SQLdata) {
    try {
        ideaTitle.innerHTML = SQLdata['idea'][0].title;
        mainIdeaImageBg.style.backgroundImage = SQLdata['idea'][0].ideaimage;
        authorAccount.innerHTML = SQLdata['idea'][0].accountName;
        authorAccount.href = ""; // To change later
        mainDescription.innerHTML = SQLdata['idea'][0].description;
        buttonLink.href = SQLdata['idea'][0].downloadlink;

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
            additionalInfoWithImageImage[additionalInfoWithImageImage.length-1].src = `data:image/jpeg;base64,${row.updtimage}`;
            additionalInfoWithImageDescription[additionalInfoWithImageDescription.length-1].innerHTML = row.description;
        });

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

        tempBoolControl = true;
        SQLdata['comment'].forEach(row => {
            if (!tempBoolControl) {
                if (row.superCommentid === null) {
                    commentsListUl.innerHTML += `<li class="comment">
                            <div class="userInfo">
                                <a href="" class="writerPage">
                                    <img src="./images/user.png" class="writerImg">
                                    <div class="writerUserName">Name:</div>
                                </a>

                                <div class="dataWriter">yyyy-mm-gg</div>
                            </div>
                            <p class="commentText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.

                            Aliquam erat volutpat. Phasellus hendrerit leo massa. Ut et rutrum mi, vitae fringilla libero. Nunc ut vulputate libero, vel semper tortor. Nunc faucibus efficitur convallis. Duis malesuada odio a iaculis aliquam. Aliquam erat volutpat. Integer sodales metus in dolor congue volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In a risus eu ante sollicitudin blandit.

                            Aliquam erat volutpat. Suspendisse condimentum mi nec metus finibus faucibus. Aliquam aliquet nisl nunc, a eleifend justo dapibus vitae. Pellentesque interdum dapibus libero ut dictum. Integer vitae urna eu ex tincidunt efficitur. Aenean eget sem sit amet felis pulvinar ornare. Donec diam ipsum, cursus in risus vel, vehicula pharetra purus. Etiam porta nulla in nunc pretium gravida. Nunc nunc mauris, tincidunt eget vestibulum sit amet, vestibulum eu massa. Vivamus euismod nisi id mi convallis sollicitudin.
                            </p>
                            <p class="replyComment">Reply</p>

                            <ul class="underComments">
                                
                            </ul>
                        </li>`;
                }
                else {
                    commentAtTheComment[commentAtTheComment.length-1].innerHTML += `<li class="comment">
                            <div class="userInfo">
                                <a href="" class="writerPage">
                                    <img src="./images/user.png" class="writerImg">
                                    <div class="writerUserName">Name:</div>
                                </a>

                                <div class="dataWriter">yyyy-mm-gg</div>
                            </div>
                            <p class="commentText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.

                            Aliquam erat volutpat. Phasellus hendrerit leo massa. Ut et rutrum mi, vitae fringilla libero. Nunc ut vulputate libero, vel semper tortor. Nunc faucibus efficitur convallis. Duis malesuada odio a iaculis aliquam. Aliquam erat volutpat. Integer sodales metus in dolor congue volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In a risus eu ante sollicitudin blandit.

                            Aliquam erat volutpat. Suspendisse condimentum mi nec metus finibus faucibus. Aliquam aliquet nisl nunc, a eleifend justo dapibus vitae. Pellentesque interdum dapibus libero ut dictum. Integer vitae urna eu ex tincidunt efficitur. Aenean eget sem sit amet felis pulvinar ornare. Donec diam ipsum, cursus in risus vel, vehicula pharetra purus. Etiam porta nulla in nunc pretium gravida. Nunc nunc mauris, tincidunt eget vestibulum sit amet, vestibulum eu massa. Vivamus euismod nisi id mi convallis sollicitudin.
                            </p>
                            <p class="replyComment">Reply</p>

                            <ul class="underComments">
                                
                            </ul>
                        </li>`;
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
            }
            else {
                tempBoolControl = false;
            }

            writerImage[writerImage.length-1].src = row.userimage!==null?`data:image/jpeg;base64,${row.userimage}`:"./images/user.png";
            writerUserName[writerUserName.length-1].innerHTML = (row.username+":");
            dataComment[dataComment.length-1].innerHTML = row.data;
            commentText[commentText.length-1].innerHTML = row.description;
            // replyAtTheCommentButton[replyAtTheCommentButton-length-1]; // FOR LATER, WHEN REPLY GESTOR
        });
    } catch (error) {
        printError(404);
    }
}