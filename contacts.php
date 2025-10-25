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
        <title>FreeIdeas - Contacts</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/contacts.php" />
    </head>

    <body>
        <nav id="nav">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <main class="footerpage">
            <h1>Contacts</h1>
            <p>
                If you have any questions, suggestions, or just want to say hello, feel free to reach out!
            </p>
            <p>
                You can contact us via email at: <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>
            </p>
            <img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" class="logo" />
        </main>

        <footer id="footer">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
    </body>
</html>