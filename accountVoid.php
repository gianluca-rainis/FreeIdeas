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
        <title>FreeIdeas - Account</title>
        
        <?php
            session_start();
            
            global $id;

            if (isset($_GET['account']) && !empty($_GET['account'])) {
                $id = $_GET['account'];
                $canonical = "https://freeideas.duckdns.org/accountVoid.php?account=$id";
                echo "<link rel=\"canonical\" href=\"$canonical\" />";
            }
        ?>
    </head>

    <body id="accountBody">
        <nav id="nav">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <?php
            include($_SERVER['DOCUMENT_ROOT'] . "/api/getAccountDataServer.php");

            global $id;
            global $data;
            global $accountImage, $username, $name, $surname, $email, $description;

            try {
                if (!empty($id)) {
                    loadOtherAccount();
                } else {
                    if (isset($_SESSION['account'])) {
                        $id = $_SESSION['account']['id'];
                        loadOtherAccount();
                    }
                }
            } catch (\Throwable $th) {
                error_log(strval($th));
            }
            
            function loadOtherAccount() {
                global $id;
                global $data;
                global $accountImage;
                global $username;
                global $name;
                global $surname;
                global $email;
                global $description;

                try {
                    $data = getAccountData($id);

                    if ($data && $data['success']) {
                        $data = $data['data'];

                        if ($data['public'] || (isset($_SESSION['account']) && $_SESSION['account']['id'] == $id)) {
                            $accountImage = $data['userimage'];
                            $username = $data['username'];
                            $name = $data['name'];
                            $surname = $data['surname'];
                            $email = $data['email'];
                            $description = $data['description'];
                        }
                    } else {
                        throw new Exception($data['error'], 1);
                    }
                } catch (\Throwable $th) {
                    error_log(strval($th));
                }
            }
        ?>

        <main id="accountMain">
            <aside id="accountAsideInfo">
                <?php
                    if (empty($id) || (isset($_SESSION['account']) && $_SESSION['account']['id'] == $id)) {
                        echo '<img id="modifyAccountInfo" alt="Modify account" src="./images/modify.svg">';
                    }
                ?>
                <h1 id="userNameAccount"><?php global $username; echo $username; ?></h1>
                <img id="userImageAccount" alt="Account image" src="<?php global $accountImage; echo $accountImage; ?>">
                <h2 id="userNameSurnameAccount"><?php global $name; global $surname; echo $name . " " . $surname; ?></h2>
                <h3 id="emailAccount"><?php global $email; echo $email; ?></h3>
                <?php
                    if (!empty($id) && !(isset($_SESSION['account']) && $_SESSION['account']['id'] == $id)) {
                        echo '<div id="followReportAccountDiv">
                            <input type="button" id="followAccountButton" value="Follow Account">
                            <input type="button" id="reportAccountButton" value="Report Account">
                        </div>';
                    }
                ?>
                <p id="descriptionAccount"><?php global $description; echo $description; ?></p>
            </aside>

            <section id="mainAccountSectionInfo">
                <div id="navBarForAccountSaved">
                    <ul>
                        <li id="savedAccount"><img src="./images/saved.svg" alt="Saved"> Saved</li>
                        <li id="publishedAccount"><img src="./images/publish.svg" alt="Published"> Published</li>
                    </ul>
                </div>
                
                <ul id="mainDivDinamicContent">
                    <!-- <a href="" class="ideaLink">
                        <li class="ideaBox">
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
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/accountData.js" defer></script>
    </body>
</html>