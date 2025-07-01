/* Load last projects from database */
const linkToProjects = document.querySelectorAll(".ideaLink");
const images = document.querySelectorAll(".ideaImage");
const titles = document.querySelectorAll(".ideaTitle");
const authors = document.querySelectorAll(".ideaAuthor");

let error2 = false;

ldAccountData2();

async function ldAccountData2() {
    const SQLdata = await getDataFromDatabase2();

    if (SQLdata) {
        loadData2(SQLdata);

        setTimeout(startAutoScroll, 100);
    }
    else {
        printError(421);
    }
}

async function getDataFromDatabase2() {
    try {
        const res = await fetch(`./api/getLastIdeas.php`);

        const data = await res.json();

        return data;
    } catch (error) {
        return null;
    }
}

function printError(errorCode) {
    if (!error2) {
        document.querySelector("main").innerHTML = `
            <h1 style="margin-top: 50px; margin-bottom: 50px; color: rgb(255, 0, 0);">ERROR ${errorCode}</h1>
            <div style="padding-top: calc(5%);"></div>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">We are sorry to inform you that the searched page aren't avable in this moment.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">If the problem persist contact the author of the page.</p>
            <p style="margin-top: 20px; margin-bottom: 20px; color: rgb(255, 130, 130);">For more info you can contact us via email at <a href="mailto:free_ideas@yahoo.com">free_ideas@yahoo.com</a></p>
            <div style="padding-top: calc(6%);"></div>
        `;

        document.querySelector("main").style.textAlign = "center";
        
        if (document.querySelector("header")) {
            document.querySelector("header").innerHTML = "";
            document.querySelector("header").style.visibility = "hidden";
        }

        error2 = true;
    }
}

function loadData2(SQLdata) {
    try {
        for (let i = 0; i < linkToProjects.length; i++) {
            linkToProjects[i].href = `./ideaVoid.html?idea=${SQLdata[i]['id']}`;
            images[i].src = SQLdata[i]['ideaimage']!=null?SQLdata[i]['ideaimage']:"./images/FreeIdeas.svg";
            titles[i].innerHTML = SQLdata[i]['title'];
            authors[i].innerHTML = SQLdata[i]['username'];
        }
    } catch (error) {
        printError(404);
    }
}

// Autoscrolling marquee for the last ideas section
function startAutoScroll() {
    // Autoscroll last ideas section
    const lastIdeas = document.getElementById("lastIdeas");
    let scrollAmount = 0;
    let speed = 1.5;

    lastIdeas.innerHTML += lastIdeas.innerHTML;

    function autoScroll() {
        scrollAmount += speed;

        if (scrollAmount >= lastIdeas.scrollWidth / 2) {
            scrollAmount = 0;
        }

        lastIdeas.scrollLeft = scrollAmount;
        requestAnimationFrame(autoScroll);
    }

    autoScroll();

    // Autoscroll help section
    const lastHelp = document.getElementById("lastHelp");
    let scrollAmountHelp = lastHelp.scrollWidth / 2;
    let speedHelp = 1.5;

    lastHelp.innerHTML += lastHelp.innerHTML;

    function autoScrollHelp() {
        scrollAmountHelp -= speedHelp;

        if (scrollAmountHelp < 0) {
            scrollAmountHelp = lastHelp.scrollWidth / 2;
        }

        lastHelp.scrollLeft = scrollAmountHelp;
        requestAnimationFrame(autoScrollHelp);
    }

    autoScrollHelp();
}