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
        <title>FreeIdeas - Feedback</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/feedback.php" />
    </head>

    <body>
        <nav id="nav">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <main class="footerpage">
            <h1>Feedback</h1>
            <section>
                <form action="" method="post" id="feedbackForm">
                    <label for="feedbackTitle">Title:</label>
                    <textarea type="text" placeholder="Feedback Title" name="title" id="feedbackTitle" required></textarea>
                    <label for="feedbackDescription">Description:</label>
                    <textarea type="text" placeholder="Feedback Body" name="description" id="feedbackDescription" required></textarea>

                    <input type="submit" value="Send Feedback">
                </form>
            </section>
            <section>
                <p>All feedback submitted in this section is anonymous and cannot be traced back to the person or account that posted it. We encourage you to submit only relevant and appropriate feedback.</p>
                <p>By submitting feedback, you help us improve FreeIdeas. Please be as detailed as possible in your descriptions.</p>
                <p>Please remember that by sending us feedback you agree to the <a href="./termsOfUse.php">Terms of Use</a> and <a href="./privacyPolicy.php">Privacy Policy</a>.</p>
                <p>You can also give us feedback by <a href="./contacts.php">contacting us</a> using the methods described in the appropriate section.</p>
            </section>
        </main>

        <footer id="footer">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
    </body>
</html>