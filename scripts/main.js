/* Load last projects from database */
const linkToProjects = document.querySelectorAll(".ideaLink");
const images = document.querySelectorAll(".ideaImage");
const titles = document.querySelectorAll(".ideaTitle");
const authors = document.querySelectorAll(".ideaAuthor");

let animationFrames = [];
let currentScrollMode = "vertical"; // or "horizontal"
let cloned = false; // Do not clone the innerHTML of the ul too much times

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

        if (!data['success']) {
            throw new Error(data['error']);
        }
        else {
            return data['data'];
        }
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
    const vertical = window.innerWidth > 760;
    currentScrollMode = vertical?"vertical":"horizontal";
    
    const lastIdeas1 = document.getElementById("lastIdeasVertical1");
    const lastIdeas2 = document.getElementById("lastIdeasVertical2");
    const lastIdeas3 = document.getElementById("lastIdeasHorizontal");
    const lastIdeas4 = document.getElementById("inspirationalUl");

    animationFrames.forEach(frame => cancelAnimationFrame(frame));
    animationFrames = [];

    if (!cloned) {
        lastIdeas1.innerHTML += lastIdeas1.innerHTML;
        lastIdeas2.innerHTML += lastIdeas2.innerHTML;
        lastIdeas3.innerHTML += lastIdeas3.innerHTML;
        lastIdeas4.innerHTML += lastIdeas4.innerHTML;
        cloned = true;
    }

    if (vertical) {
        scrollVertical(lastIdeas1, true);
        scrollVertical(lastIdeas2, false);
    } else {
        scrollHorizontal(lastIdeas1, false);
        scrollHorizontal(lastIdeas2, true);
    }

    scrollHorizontal(lastIdeas3, false);
    scrollHorizontal(lastIdeas4, true);

    function scrollVertical(lastIdeas, direction) {
        let scrollAmount = direction?0:lastIdeas.scrollHeight / 2;
        let speed = 1.5;

        function autoScroll() {
            scrollAmount += (direction?1:-1) * speed;

            if (direction && scrollAmount >= lastIdeas.scrollHeight / 2) {
                scrollAmount = 0;
            } else if (!direction && scrollAmount < 0) {
                scrollAmount = lastIdeas.scrollHeight / 2;
            }

            lastIdeas.scrollTop = scrollAmount;
            animationFrames.push(requestAnimationFrame(autoScroll));
        }

        autoScroll();
    }

    function scrollHorizontal(lastIdeas, direction) {
        let scrollAmount = direction?0:lastIdeas.scrollWidth / 2;
        let speed = 1.5;

        function autoScroll() {
            scrollAmount += (direction?1:-1) * speed;

            if (direction && scrollAmount >= lastIdeas.scrollWidth / 2) {
                scrollAmount = 0;
            } else if (!direction && scrollAmount < 0) {
                scrollAmount = lastIdeas.scrollWidth / 2;
            }

            lastIdeas.scrollLeft = scrollAmount;
            animationFrames.push(requestAnimationFrame(autoScroll));
        }

        autoScroll();
    }
}

/* ============= TOGGLE WINDOW SIZE ============= */
window.addEventListener("resize", toggleWindowSize);

function toggleWindowSize() {
    const scrollMode = window.innerWidth>760?"vertical":"horizontal";

    if (scrollMode != currentScrollMode) {
        startAutoScroll();
    }
}

/* Theme changer */
new MutationObserver(() => {
    if (document.querySelector(".logo")) {
        document.querySelector(".logo").src = `./images/FreeIdeas${themeIsLight?"":"_Pro"}.svg`;
    }
}).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});