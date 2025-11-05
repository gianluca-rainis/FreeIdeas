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
         <title>FreeIdeas - Create Account</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/createAccount.php" />
    </head>

    <body>
        <nav id="nav">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <main id="loginMain">
            <section>
                <h1>Create your account</h1>
                
                <form action="./api/signUp.php" method="POST">
                    <input type="text" spellcheck="false" autocomplete="given-name" placeholder="First Name" name="firstName" maxlength="255" required>
                    <input type="text" spellcheck="false" autocomplete="family-name" placeholder="Last Name" name="lastName" maxlength="255" required>
                    <input type="text" spellcheck="false" autocomplete="username" placeholder="Username" name="userName" maxlength="255" required>
                    <input type="email" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" maxlength="255" required>
                    <input type="password" autocomplete="current-password" placeholder="Password" name="password" id="passwordFormInputLoginPage" required>
                
                    <button type="button" class="toggle-password-visibility-ext">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                        </svg>
                    </button>

                    <p>By singing up you agree to our <a href="./termsOfUse.php">Terms of Use</a> and <a href="./privacyPolicy.php">Privacy Policy</a></p>

                    <button type="submit" id="signInLoginPageButton">Create Account</button>
                </form>

                <p>Already have an account? <a href="./login.php">Sign In!</a></p>
            </section>
        </main>

        <footer id="footer">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/loginSignUpPages.js" defer></script>
    </body>
</html>