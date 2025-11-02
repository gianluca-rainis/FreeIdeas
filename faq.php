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
                    <div class="answer">
                        FreeIdeas is a platform where you can share your ideas for projects, apps, or websites, and get inspired by other users’ creativity. 
                        It’s a place to exchange and grow ideas freely.
                    </div>
                </li>
                <li>
                    <div class="question">How can I use FreeIdeas?</div>
                    <div class="answer">
                        You can browse published ideas, post your own, ask for feedback or help, and collaborate with others on existing projects.
                    </div>
                </li>
                <li>
                    <div class="question">Is my account information safe?</div>
                    <div class="answer">
                        We store your data securely in our local database and never share it with third parties. 
                        Passwords are encrypted, while other account details are stored in clear text. 
                        Your personal information is visible only if you choose to make your profile public.
                    </div>
                </li>
                <li>
                    <div class="question">Are the ideas posted free to use?</div>
                    <div class="answer">
                        Each idea on FreeIdeas is released under a license — either the FreeIdeas License or a custom license defined by the author. 
                        The <a href="./FreeIdeasLicense.md">FreeIdeas License</a> allows anyone to use, modify, and share ideas freely for non-commercial, educational, or creative purposes. 
                        If an idea has a different license, it will be clearly shown on its page.
                    </div>
                </li>
                <li>
                    <div class="question">Do I need an account to post or collaborate?</div>
                    <div class="answer">
                        Yes. You need to create an account to post your ideas or actively collaborate with others.
                    </div>
                </li>
                <li>
                    <div class="question">Can I post any kind of idea?</div>
                    <div class="answer">
                        Generally yes — creative, technical, personal, or collaborative ideas are all welcome. 
                        However, you must follow our <a href="./termsOfUse.php">Terms of Use</a> and avoid illegal, offensive, or copyrighted content if you don’t own the rights.
                    </div>
                </li>
                <li>
                    <div class="question">How can I edit or delete an idea I’ve posted?</div>
                    <div class="answer">
                        Log in to your account, go to your profile, select the idea, and choose to edit or delete it. 
                        If you search for your idea while logged in, an “Edit” button will also appear on the idea’s page.
                    </div>
                </li>
                <li>
                    <div class="question">Where can I find support or contact the FreeIdeas team?</div>
                    <div class="answer">
                        You can reach us through the “Contact Us” section in the site footer or by email at 
                        <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>.
                    </div>
                </li>
                <li>
                    <div class="question">Who can use FreeIdeas and what are the age restrictions?</div>
                    <div class="answer">
                        FreeIdeas is designed for everyone — creators, developers, and thinkers of all ages. 
                        However, to comply with privacy and data protection laws, users under 18 must have verifiable parental consent before creating an account or posting content. 
                        Parents or guardians can contact us for more information as described in our <a href="./privacyPolicy.php">Privacy Policy</a>.
                    </div>
                </li>
                <li>
                    <div class="question">What happens to my personal data and what rights do I have?</div>
                    <div class="answer">
                        FreeIdeas collects the data you provide (such as account info and submitted content) and some usage data automatically 
                        (like IP address, browser type, and access logs). 
                        These data are used to manage your account, improve the Service, enable user interactions, and comply with legal obligations. 
                        You have the right to access, correct, delete, or export your data, and to object to or restrict its processing, in accordance with applicable law.
                    </div>
                </li>
                <li>
                    <div class="question">How long does FreeIdeas keep my data?</div>
                    <div class="answer">
                        Your data is kept until you delete your account or remove your content, unless a longer retention period is required by law.
                    </div>
                </li>
            </ul>

            <p>
                If you have any questions not answered here, feel free to contact us at <a href="mailto:freeideas.site@gmail.com">freeideas.site@gmail.com</a>.
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