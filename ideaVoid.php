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
            include($_SERVER['DOCUMENT_ROOT'] . '/include/head.php');
        ?>

        <!-- Dinamic head -->
        <?php
            include($_SERVER['DOCUMENT_ROOT'] . "/api/getIdeaTitle.php");

            session_start();

            global $id;

            if (isset($_GET['idea']) && !empty($_GET['idea'])) {
                $id = $_GET['idea'];
                $title = getIdeaTitleFromDatabase($id);

                echo "<title>FreeIdeas - $title</title>";

                $canonical = "https://freeideas.duckdns.org/ideaVoid.php?idea=$id";
                echo "<link rel=\"canonical\" href=\"$canonical\" />";
            }
        ?>
    </head>

    <body>
        <nav id="nav">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <?php
            include($_SERVER['DOCUMENT_ROOT'] . "/api/ideaData.php");

            global $id;
            global $data;

            $data = ideaData($id);
        ?>

        <main id="ideaMain">
            <div id="ideaImageAsBackground" style="background-image: url(<?php global $data; echo $data['idea'][0]['ideaimage'] ?>);"> <!-- MAIN INFO - TITLE AND AUTHOR -->
                <h1 id="title"><?php global $data; echo $data['idea'][0]['title'] ?></h1>
                <h2 id="author"><a href="<?php global $data; $accountid = $data['idea'][0]['accountId']; echo $data['idea'][0]['accountPublic']==1?"./accountVoid.php?account=$accountid":"" ?>" id="mainAuthorAccount"><?php global $data; echo $data['idea'][0]['accountName'] ?></a></h2>
            </div>

            <section id="ideaLikeSaveSection">
                <ul>
                    <li id="savedIdea"><img src="./images/saved.svg" alt="Save idea" id="savedIdeaImg"><div id="savedNumber"><?php global $data; echo $data['idealabels'][0]['saves'] ?></div></li>
                    <li id="likedIdea"><img src="./images/liked.svg" alt="Like idea" id="likedIdeaImg"><div id="likedNumber"><?php global $data; echo $data['idealabels'][0]['likes'] ?></div></li>
                    <li id="dislikedIdea"><img src="./images/disliked.svg" alt="Dislike idea" id="dislikedIdeaImg"><div id="dislikedNumber"><?php global $data; echo $data['idealabels'][0]['dislike'] ?></div></li>
                </ul>
                
                <input type="button" id="followIdeaButton" value="Follow Idea">
                <input type="button" id="reportIdeaButton" value="Report Idea">
                <img src="./images/modify.svg" alt="Modify idea" id="modifyOldIdea">
            </section>

            <!-- MAIN INFO - DESCRIPTION -->
            <p id="description">
                <?php global $data; echo $data['idea'][0]['description'] ?>
            </p>

            <!-- SECOND INFO - IMAGE + INFO -->
            <?php
                global $data;

                if (count($data['info']) != 0) {
                    echo "<ul id='imagesInfo'>";

                    for ($i=0; $i < count($data['info']); $i++) {
                        $img = $data['info'][$i]['updtimage'];
                        $title = $data['info'][$i]['title'];
                        $description = $data['info'][$i]['description'];

                        echo "<li class='imageInfoLi'>
                            <img src='$img' alt='Image of additional info' class='imageInfo'>
                            <div>
                                <h3 class='titleImageInfo'>$title</h3>
                            
                                <p class='imageInfoDescription'>
                                    $description
                                </p>
                            </div>
                        </li>";
                    }

                    echo "</ul>";
                }
            ?>

            <!-- MAIN INFO - EXTERNAL LINK -->
            <?php
                global $data;

                if ($data['idea'][0]['downloadlink']) {
                    $link = $data['idea'][0]['downloadlink'];

                    echo "<section id='downloadSection'>
                        <h3 id='download'>External Link</h3> <!-- MAIN INFO - LINK TO DOWNLOAD -->
                        <a id='buttonlink' href='$link'><button id='downloadButton'>$link</button></a>
                    </section>";
                }
            ?>

            <!-- MAIN INFO - LICENSE -->
            <section id="licenseSection">
                <h3 id="licenseTitle">License</h3>
                <embed src="<?php
                    global $data;

                    try {
                        if ($data['idea'][0]['license']) {
                            echo $data['idea'][0]['license'];
                        }
                        else {
                            $title = $data['idea'][0]['title'];
                            $author = $data['idea'][0]['accountName'];

                            include($_SERVER['DOCUMENT_ROOT'] . "/api/getFreeIdeasLicenseServer.php");

                            $return = getFreeIdeasLicense($title, $author);

                            if ($return['success']) {
                                echo $return['data'];
                            }
                            else {
                                error_log($return['error']);
                            }
                        }
                    } catch (\Throwable $th) {
                        error_log(strval($th));
                    }
                ?>" id="licensePdfEmbed">
            </section>

            <!-- THIRD INFO - DEV LOGS -->
            <?php
                global $data;

                if (count($data['log']) != 0) {
                    echo "<section id='devLogsSection'>
                        <h3 id='logsName'>Author's Log</h3>
                        <ul id='logsList'>";

                    for ($i=0; $i < count($data['log']); $i++) {
                        $title = $data['log'][$i]['title'];
                        $date = $data['log'][$i]['data'];
                        $description = $data['log'][$i]['description'];

                        echo "<li class='log'>
                                <div class='logTitleAndData'>
                                    <h4 class='logTitle'>$title</h4>
                                    <div class='data'>$date</div>
                                </div>
                            
                                <p class='logInfo'>
                                    $description
                                </p>
                            </div>
                        </li>";
                    }

                    echo "</ul>
                    </section>";
                }
            ?>

            <section id="commentSection"> <!-- THIRD INFO - COMMENTS ( ADD AFTER PUBLISHED ) -->
                <h3 id="commentsTitle">Comments</h3>
                <ul id="commentsList">
                    <?php
                        global $data;

                        if (count($data['comment']) != 0) {
                            $indexOfRootComments = [];
                            $indexOfSubComments = [];

                            for ($i=0; $i < count($data['comment']); $i++) { 
                                if ($data['comment'][$i]['superCommentid'] === null) {
                                    array_push($indexOfRootComments, $i);
                                }
                                else {
                                    array_push($indexOfSubComments, $i);
                                }
                            }

                            for ($i=0; $i < count($indexOfRootComments); $i++) { // For each root comment
                                $j = $indexOfRootComments[$i];

                                echo printSubCommentRecursive($j, $indexOfSubComments); // Print all the comments
                            }

                            echo "<li class='comment' data-value='rootComment'><p class='replyComment'>Write a comment!</p></li>";
                        }
                        else {
                            echo "<li class='comment' data-value='rootComment'><p class='replyComment'>Write the first comment!</p></li>";
                        }

                        function printSubCommentRecursive($superi, &$indexOfSubComments) { // Get the current supercomment index and the list of index of subcomments
                            global $data;

                            $subCommentsToPrint = [];

                            foreach ($indexOfSubComments as $key => $subIndex) { // For each subcomment
                                if ($data['comment'][$subIndex]['superCommentid'] == $data['comment'][$superi]['id']) { // If the subcomment is subcomment of the supercomment
                                    $subCommentsToPrint[] = $subIndex; // Save the subcomment
                                    unset($indexOfSubComments[$key]); // Delete the subcomment
                                }
                            }

                            return printComment($superi, $subCommentsToPrint, $indexOfSubComments); // Print the current comment and the 1^st level subcomments
                        }

                        function printComment($i, $subComments, $indexOfSubComments) {
                            global $data;

                            $return = "";

                            $authorid = $data['comment'][$i]['authorid'];
                            $accountLink = $data['comment'][$i]['public']==1?"./accountVoid.php?account=$authorid":"";
                            $accountimg = $data['comment'][$i]['userimage']!=null?$data['comment'][$i]['userimage']:"./images/user.svg";
                            $accountUsername = $data['comment'][$i]['username']==null?'Deleted':$data['comment'][$i]['username'];
                            $date = $data['comment'][$i]['data'];
                            $description = $data['comment'][$i]['description'];
                            $delete = isset($_SESSION['account'])?($authorid==$_SESSION['account']['id']?'<p class="deleteComment">Delete</p>':''):'';
                            $id = $data['comment'][$i]['id'];

                            $return = "<li class='comment'>
                                <div class='userInfo'>
                                    <a href='$accountLink' class='writerPage'>
                                        <img src='$accountimg' alt='Comment Author Account Image' class='writerImg'>
                                        <div class='writerUserName'>$accountUsername:</div>
                                    </a>

                                    <div class='dataWriter'>$date</div>
                                </div>
                                <p class='commentText'>$description</p>
                                <p class='replyComment'>Reply</p>
                                $delete

                                <ul class='underComments' data-id='$id'>";
                                
                                foreach ($subComments as $subCommentIndex) { // For each subcomment
                                    $return = $return . printSubCommentRecursive($subCommentIndex, $indexOfSubComments); // Recursive call for each subcomment for the sub-subcomments
                                }

                                $return = $return . "</ul>
                            </li>";

                            return $return;
                        }
                    ?>
                </ul>
            </section>
        </main>

        <footer id="footer">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/ideaData.js" defer></script>
    </body>
</html>