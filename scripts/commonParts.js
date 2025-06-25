const nav = document.getElementById("nav");
const footer = document.getElementById("footer");
const metadata = document.head;

function loadNav() {
    if (nav) {
        nav.innerHTML = `
            <ul class="navLogo">
                <li><a href="./index.html"><img src="./images/FreeIdeas.svg" id="navLogo"></a></li>
            </ul>
            <ul class="navLinks">
                <li><a href="" class="navText">Search an Idea</a></li>
                <li><a href="" class="navText">Publish an Idea</a></li>
                <li><a href="" class="navText">Ask help for an Idea</a></li>
                <li><a href="" class="navText">Random Idea</a></li>
                <li><a href="" class="navText" id="login">Login</a></li>
            </ul>
        `;
    }
}

function loadFooter() {
    if (footer) {
        footer.innerHTML = `
            <ul>
                <li><a href="./privacyPolicy.html">Privacy Policy</a></li>
                <li><a href="./termsOfUse.html">Terms of Use</a></li>
                <li><a href="./license.html">License</a></li>
                <li><a href="./contacts.html">Contact Us</a></li>
                <li><a href="./about.html">About Us</a></li>
                <li><a href="https://github.com/rainis-gianluca/FreeIdeas.git"><img src="./images/github.png" id="githubLogo"></a></li>
            </ul>
            <hr>
            <section class="footerTextSection">
                <a href="./index.html" id="footerLogoA"><img src="./images/FreeIdeas.svg" id="footerLogo"></a>

                <ul class="footerText">
                    <li>Author: Gianluca Rainis ( __grdev on summer.hackclub.com )</li>
                    <li>This site was created for the Summer of Making 2025</li>
                </ul>
            </section>
        `;
    }
}

function loadMetadata() {
    if (metadata) {
        metadata.innerHTML = `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Free Ideas</title>
            <link rel="icon" href="./images/FreeIdeas.svg" type="image/x-ico" />
            <link href="./styles/styles.css" rel="stylesheet">
        `;
    }
}

loadMetadata();
loadNav();
loadFooter();