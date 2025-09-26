/* Load last projects from database */
const linkToProjects = document.querySelectorAll(".ideaLink");
const images = document.querySelectorAll(".ideaImage");
const titles = document.querySelectorAll(".ideaTitle");
const authors = document.querySelectorAll(".ideaAuthor");

let error2 = false;

loadLastIdeas();

async function loadLastIdeas() {
    const SQLdata = await getLastIdeasFromDatabase();

    if (SQLdata) {
        loadData2(SQLdata);

        setTimeout(startAutoScroll, 100);
    }
    else {
        printError(421);
    }
}

async function getLastIdeasFromDatabase() {
    try {
        const res = await fetch(`./api/getLastIdeas.php`);

        const data = await res.json();

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function loadData2(SQLdata) {
    try {
        for (let i = 0; i < linkToProjects.length; i++) {
            linkToProjects[i].href = `./ideaVoid.php?idea=${SQLdata[i]['id']}`;
            images[i].src = SQLdata[i]['ideaimage']!=null?SQLdata[i]['ideaimage']:"./images/FreeIdeas.svg";
            titles[i].innerHTML = SQLdata[i]['title'];
            authors[i].innerHTML = SQLdata[i]['username'];
        }
    } catch (error) {
        console.error(error);
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