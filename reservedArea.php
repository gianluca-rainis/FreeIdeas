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
        <link rel="canonical" href="https://freeideas.duckdns.org/about.php" />
    </head>

    <body>
        <nav id="nav">
            <?php 
                include('./include/nav.php');
            ?>
        </nav>

        <header id="reservedAreaHeader" style="display: none;">
            <img src="./images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" class="logo" />

            <ul id="ulReservedAreaHeader">
                <li><button id="accountsReservedAreaHeader">Accounts</button></li>
                <li><button id="ideasReservedAreaHeader">Ideas</button></li>
                <li><button id="notificationsReservedAreaHeader">Notifications</button></li>
                <li><button id="reportsReservedAreaHeader">Reports</button></li>
                <li><button id="logoutReservedAreaHeader">Logout</button></li>
            </ul>
        </header>

        <main id="reservedAreaMain">
            <img src="./images/FreeIdeas_ReservedArea.svg" alt="FreeIdeas Logo" class="logo" />

            <div id="bannerDiv">
                <hr>
                <h2>All unauthorized access will be punished!</h2>
                <hr>
            </div>

            <form action="./api/reservedAreaLogin.php" method="POST" id="loginReservedAreaForm">
                <ul>
                    <li>
                        <label for="usernameReservedArea">Username:</label>
                        <input type="text" name="username" id="usernameReservedArea" autocomplete="username" required>
                    </li>
                    <li>
                        <label for="password1ReservedArea">Password 1:</label>
                        <input type="password" name="password1" id="password1ReservedArea" autocomplete="current-password" required>
                    </li>
                    <li>
                        <label for="password2ReservedArea">Password 2:</label>
                        <input type="password" name="password2" id="password2ReservedArea" autocomplete="current-password" required>
                    </li>
                    <li>
                        <label for="password3ReservedArea">Password 3:</label>
                        <input type="password" name="password3" id="password3ReservedArea" autocomplete="current-password" required>
                    </li>
                    <li>
                        <label for="password4ReservedArea">Password 4:</label>
                        <input type="password" name="password4" id="password4ReservedArea" autocomplete="current-password" required>
                    </li>
                    <li>
                        <label for="password5ReservedArea">Password 5:</label>
                        <input type="password" name="password5" id="password5ReservedArea" autocomplete="current-password" required>
                    </li>
                    <li>
                        <input type="submit" value="Login" id="loginReservedArea">
                    </li>
                </ul>
            </form>
        </main>

        <footer id="footer">
            <?php 
                include('./include/footer.php');
            ?>
        </footer>

        <script src="./scripts/reservedArea.js" defer></script>
        <script src="./scripts/commonParts.js" defer></script>
    </body>
</html>