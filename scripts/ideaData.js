const mainIdea = document.getElementById("ideaMain"); // The main of the page

const mainIdeaImageBg = document.getElementById("ideaImageAsBackground"); // Background of the main image
const ideaTitle = document.getElementById("title"); // Idea title
const ideaAuthor = document.getElementById("author"); // Idea main author
const authorAccount = document.getElementById("mainAuthorAccount"); // Idea main author link to account
const mainDescription = document.getElementById("description"); // Description

const additionalInfoWithImagesUl = document.getElementById("imagesInfo"); // The ul with the additional info with images
const additionalInfoWithImageLi = document.querySelectorAll("imageInfoLi"); // The li of the additional info with images
const additionalInfoWithImageImage = document.querySelectorAll("imageInfo"); // The image
const additionalInfoWithImageTitle = document.querySelectorAll("titleImageInfo"); // The title
const additionalInfoWithImageDescription = document.querySelectorAll("imageInfoDescription"); // The description

const teamSection = document.getElementById("teamSection"); // The section with the team info
// const teamName = document.getElementById("teamName"); // The name of the team
const teamMembersUl = document.getElementById("teamMembers"); // The ul with the name of the team
const nameOfTheTeamMemberLi = document.querySelectorAll("nameTeamMember"); // The li with the name of the team member
const linkToTheTeamMemberAccountA = document.querySelectorAll("linkAccount"); // The a with the link to the team member account

const downloadSection = document.getElementById("downloadSection"); // The section of the download
// const downloadText = document.getElementById("download"); // The h3 with the text Download
const downloadButton = document.getElementById("downloadButton"); // The button to the download

const devLogsSection = document.getElementById("devLogsSection"); // The section with the logs
// const logsTitleh3 = document.getElementById("logsName"); // The name of the log
const logsListUl = document.getElementById("logsList"); // The ul of the logs
const log = document.querySelectorAll("log"); // The li with the log data
const logTitleAndDataGroup = document.querySelectorAll("logTitleAndData"); // The div with the logtitle and the data
const logTitle = document.querySelectorAll("logTitle"); // The log title
const logData = document.querySelectorAll("data"); // The log data (yyyy-mm-gg)
const logDescription = document.querySelectorAll("logInfo"); // The p with the log content

const commentSection = document.getElementById("commentSection"); // The section with all the comment data
// const commentsTitleh3 = document.getElementById("commentsTitle"); // The comment section title
const commentsListUl = document.getElementById("commentsList"); // The ul with all the comments

const comment = document.querySelectorAll("comment"); // The comment - IMPORTANT
const userInfoDiv = document.querySelectorAll("userInfo"); // The section with the user info of the comment
const linkToWriterAccount = document.querySelectorAll("writerPage"); // The a with the link at the comment's writer account
const writerImage = document.querySelectorAll("writerImg") // The image of the writer account
const writerUserName = document.querySelectorAll("writerUserName"); // The username of the author
const dataComment = document.querySelectorAll("dataWriter"); // The data of the comment (yyyy-mm-gg)
const commentText = document.querySelectorAll("commentText"); // The p with the comment text
const replyAtTheCommentButton = document.querySelectorAll("replyComment"); // The text for reply at the comment
const commentAtTheComment = document.querySelectorAll("underComments"); // The comments at the comment - IT CONTAIN EVERYTHING SINCE THE comment Li

// The id of the page to load
const paramsURL = new URLSearchParams(window.location.search); // The params passed with the url ex. (<a href="./ideaVoid.html?id=123">)
const id = paramsURL.get("id"); // The id of the page to load
main(id);

async function main(id) {
    if (id && id > 0) {
        const SQLdata = await getDataFromDatabase(id);
        
        if (SQLdata) {
            printError(418);
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
    }
}

function printError(errorCode) {
    mainIdea.innerHTML = `
        <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
        <div style="padding-top: calc(5%);"></div>
        <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
        <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
        <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
        <div style="padding-top: calc(6%);"></div>
    `;
}