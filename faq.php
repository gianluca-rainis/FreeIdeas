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
        <title>FreeIdeas - FAQ</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/faq.php" />
    </head>

    <body>
        <nav id="nav">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <main class="footerpage">
            <h1>FAQ</h1>

            <ul id="faqUl">
                <li>
                    <div class="question">What is FreeIdeas?</div>
                    <div class="answer">FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project.</div>
                </li>
                <li>
                    <div class="question">Question</div>
                    <div class="answer">Answer</div>
                </li>
            </ul>

            <p>
                If you have any questions that aren't answered on this page, you can contact us via email at: <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>
            </p>
        </main>

        <footer id="footer">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
    </body>
</html>