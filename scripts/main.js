// Autoscrolling marquee for the last ideas section
document.addEventListener("DOMContentLoaded", () => {
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
});

document.addEventListener("DOMContentLoaded", () => {
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
});