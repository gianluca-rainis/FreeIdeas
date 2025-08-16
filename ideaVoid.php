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

        <!-- Dinamic head -->
        <?php
            if (isset($_GET['idea']) && !empty($_GET['idea'])) {
                $id = $_GET['idea'];
                $canonical = "https://freeideas.duckdns.org/ideaVoid.php?idea=$id";
                echo "<link rel=\"canonical\" href=\"$canonical\" />";
            }
        ?>
    </head>

    <body>
        <nav id="nav">
            <?php 
                include('./include/nav.php');
            ?>
        </nav>

        <main id="ideaMain">
            <div id="ideaImageAsBackground"> <!-- MAIN INFO - TITLE AND AUTHOR -->
                <h1 id="title">Title</h1>
                <h2 id="author"><a href="" id="mainAuthorAccount">Author</a></h2>
            </div>

            <section id="ideaLikeSaveSection">
                <ul>
                    <li id="savedIdea"><img src="./images/saved.svg" alt="Save idea" id="savedIdeaImg"><div id="savedNumber">0</div></li>
                    <li id="likedIdea"><img src="./images/liked.svg" alt="Like idea" id="likedIdeaImg"><div id="likedNumber">0</div></li>
                    <li id="dislikedIdea"><img src="./images/disliked.svg" alt="Dislike idea" id="dislikedIdeaImg"><div id="dislikedNumber">0</div></li>
                </ul>
                
                <input type="button" id="followIdeaButton" value="Follow Idea">
                <input type="button" id="reportIdeaButton" value="Report Idea">
                <img src="./images/modify.svg" alt="Modify idea" id="modifyOldIdea">
            </section>

            <p id="description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.
            </p> <!-- MAIN INFO - DESCRIPTION -->

            <ul id="imagesInfo"> <!-- SECOND INFO - IMAGE + INFO -->
                <li class="imageInfoLi">
                    <img src="./images/FreeIdeas.svg" alt="Image of additional info" class="imageInfo">
                    <div>
                        <h3 class="titleImageInfo">Info</h3>
                    
                        <p class="imageInfoDescription">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.
                        </p>
                    </div>
                </li>
            </ul>

            <section id="downloadSection">
                <h3 id="download">External Link</h3> <!-- MAIN INFO - LINK TO DOWNLOAD -->
                <a id="buttonlink" href=""><button id="downloadButton">Download</button></a>
            </section>

            <section id="devLogsSection">
                <h3 id="logsName">Author's Log</h3> <!-- THIRD INFO - DEV LOGS ( ADD AFTER PUBLISHED ) -->
                <ul id="logsList">
                    <li class="log">
                        <div class="logTitleAndData">
                            <h4 class="logTitle">Log</h4>
                            <div class="data">yyyy-mm-gg</div>
                        </div>

                        <p class="logInfo">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.
                        </p>
                    </li>
                </ul>
            </section>

            <section id="commentSection">
                <h3 id="commentsTitle">Comments</h3> <!-- THIRD INFO - COMMENTS ( ADD AFTER PUBLISHED ) -->
                <ul id="commentsList">
                    <!-- <li class="comment">
                        <div class="userInfo">
                            <a href="" class="writerPage">
                                <img src="./images/user.svg" class="writerImg">
                                <div class="writerUserName">Name:</div>
                            </a>

                            <div class="dataWriter">yyyy-mm-gg</div>
                        </div>
                        <p class="commentText">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac viverra erat. Etiam eget odio malesuada, condimentum justo ac, elementum leo. Quisque id nibh sed nulla facilisis tincidunt eget pretium felis. Curabitur sit amet scelerisque libero. Nulla eu mattis libero. Ut id purus eleifend, ultricies urna sit amet, semper leo. Etiam dolor felis, suscipit quis maximus aliquet, sagittis nec risus. Morbi maximus nibh quis tempor consequat. Nulla in metus odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum laoreet tincidunt eros. Suspendisse potenti.
                        </p>
                        <p class="replyComment">Reply</p>

                        <ul class="underComments">
                            
                        </ul>
                    </li> -->
                </ul>
            </section>
        </main>

        <footer id="footer">
            <?php 
                include('./include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/ideaData.js" defer></script>
    </body>
</html>