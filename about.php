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
         <title>FreeIdeas - About Us</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/about.php" />
    </head>

    <body>
        <nav id="nav">
            <?php 
                include('./include/nav.php');
            ?>
        </nav>

        <main class="footerpage">
            <h1>About Us</h1>
            <p>
                Welcome to FreeIdeas! This project is a collection of free ideas for projects, apps, and websites that you can use to get inspired or to start your own project. The ideas are organized by category and are meant to be a starting point for your own creativity.
            </p>
            <p>
                The project is open source and you can contribute by adding your own ideas or improving the existing ones. You can also use the ideas in your own projects, as long as you give credit to the original author.
            </p>
            <p>
                We believe that sharing ideas is a great way to foster creativity and innovation, and we hope that this project will inspire you to create something amazing.
            </p>
            <p>
                The people behind this project are passionate about technology, design, and creativity. We are always looking for new ideas and ways to improve the project, so feel free to reach out if you have any suggestions or feedback.
            </p>
            <p>
                Thank you for visiting FreeIdeas, and we hope you find something that inspires you!
            </p>
            <img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" class="logo" />
        </main>

        <footer id="footer">
            <?php 
                include('./include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
    </body>
</html>