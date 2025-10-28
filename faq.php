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
                    <div class="question">How can I use FreeIdeas?</div>
                    <div class="answer">You can search for previously published ideas, post your own idea, ask for help with one of your own, or collaborate with others on someone else's ideas.</div>
                </li>
                <li>
                    <div class="question">Is my account information safe?</div>
                    <div class="answer">We store your data in a local database and do not share it with third parties. Your password is stored encrypted, while other data is stored in clear text. Your personal information is not available on the site unless you choose to make your account public.</div>
                </li>
                <li>
                    <div class="question">Are the ideas posted free to use?</div>
                    <div class="answer">All ideas published on FreeIdeas are released under a license — either a custom license specified by the author or the standard FreeIdeas License. The FreeIdeas License allows anyone to use, modify, and share ideas freely for non-commercial purposes, while giving enough flexibility for creative and educational use. If an idea has a different license, it will be clearly indicated on its page.</div>
                </li>
                <li>
                    <div class="question">Do I have to register to post an idea or participate?</div>
                    <div class="answer">Yes, to post an idea or actively collaborate, you will need to create an account.</div>
                </li>
                <li>
                    <div class="question">Can I post any kind of idea?</div>
                    <div class="answer">Generally, yes: creative, technical, personal, or collaborative ideas. However, you must abide by the site's Terms of Use (for example, avoiding illegal, offensive, or copyrighted content if you don't have the rights).</div>
                </li>
                <li>
                    <div class="question">How can I edit or delete an idea I've posted?</div>
                    <div class="answer">You can log in to your profile, select the published idea, and choose to edit or delete it. You can also search for the idea, and once logged in, a button to edit the idea will appear.</div>
                </li>
                <li>
                    <div class="question">Where can I find support or contact the FreeIdeas team?</div>
                    <div class="answer">You can use the “Contact Us” section in the footer of the site.</div>
                </li>
                <li>
                    <div class="question">Who can use FreeIdeas and what are the age restrictions?</div>
                    <div class="answer"></div>
                </li>
                <li>
                    <div class="question">Can I post any kind of idea?</div>
                    <div class="answer">You must be at least 18 years old to use the Service, since by accessing the site you represent that you are over 18. For users aged 14-17, the Privacy Policy states that they may use the Service only with verifiable parental consent.</div>
                </li>
                <li>
                    <div class="question">What happens to my personal data and what rights do I have?</div>
                    <div class="answer">FreeIdeas collects the data you provide (e.g., account info, content you submit) and also collects usage data automatically (IP address, device/browser type, access logs). The data are used to manage your account, run and improve the Service, enable user interactions, comply with legal obligations and moderate content. You have rights under applicable law to access, correct or delete your personal data; object or restrict processing; and receive your data in a portable format.</div>
                </li>
                <li>
                    <div class="question">How long does FreeIdeas keep my data?</div>
                    <div class="answer">Data is stored until you delete your account or remove your content, unless a longer retention period is required by law.</div>
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