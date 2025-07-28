<!--
Author: Gianluca Rainis
This project is licensed under the FreeIdeas License.
You can find the license in the LICENSE file in the root directory of this project.
Project: FreeIdeas
FreeIdeas is a collection of free ideas for projects, apps, and websites that you can use to get inspired or to start your own project.
-->
<!DOCTYPE html>

<html lang="en-US">
    <head>
        <?php 
            include('./include/head.php');
        ?>
    </head>

    <body id="accountBody">
        <nav id="nav">
            <?php 
                include('./include/nav.php');
            ?>
        </nav>

        <main id="accountMain">
            <aside id="accountAsideInfo">
                <img id="modifyAccountInfo" alt="Modify account" src="./images/modify.svg">
                <h1 id="userNameAccount"></h1>
                <img id="userImageAccount" alt="Account image" src="">
                <h2 id="userNameSurnameAccount"></h2>
                <h3 id="emailAccount"></h3>
                <div id="followReportAccountDiv">
                    <input type="button" id="followAccountButton" value="Follow Account">
                    <input type="button" id="reportAccountButton" value="Report Account">
                </div>
                <p id="descriptionAccount"></p>
            </aside>

            <section id="mainAccountSectionInfo">
                <div id="navBarForAccountSaved">
                    <ul>
                        <li id="savedAccount"><img src="./images/saved.svg" alt="Saved"> Saved</li>
                        <li id="publishedAccount"><img src="./images/publish.svg" alt="Published"> Published</li>
                    </ul>
                </div>
                
                <ul id="mainDivDinamicContent">
                    <!-- <a href="" class="ideaLinkSrc">
                        <li class="ideaBoxScr">
                            <img src="" alt="Idea Image" class="ideaImageSrc">
                            <p class="ideaTitleSrc">Title</p>
                            <p class="ideaAuthorSrc">Author</p>
                        </li>
                    </a> -->
                </ul>
            </section>
        </main>

        <footer id="footer">
            <?php 
                include('./include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/accountData.js" defer></script>
    </body>
</html>