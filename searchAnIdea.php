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
        <title>FreeIdeas - Search an Idea</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/searchAnIdea.php" />
    </head>

    <body id="searchPage">
        <nav id="nav">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <header>
            <input type="search" placeholder="Search" id="search">

            <ul id="allFilters">
                <li class="filterBlock">
                    <label class="labelInfoSearch">Type of project:</label>
                    <select id="typeFilter" class="filterSearch">
                        <option selected>All</option>
                        <option>Technological Innovation</option>
                        <option>Environmental Sustainability</option>
                        <option>Education & Learning</option>
                        <option>Business & Startups</option>
                        <option>Art & Design</option>
                        <option>Social & Community</option>
                        <option>Health & Wellness</option>
                        <option>Travel & Experiences</option>
                        <option>Games & Entertainment</option>
                    </select>
                </li>

                <li class="filterBlock">
                    <label class="labelInfoSearch">Creativity Type:</label>
                    <select id="creativityTypeFilter" class="filterSearch">
                        <option selected>All</option>
                        <option>Practical and actionable</option>
                        <option>Abstract or conceptual</option>
                        <option>Thought-provoking</option>
                        <option>Visionary or futuristic</option>
                        <option>Humorous or satirical</option>
                    </select>
                </li>

                <li class="filterBlock">
                    <label class="labelInfoSearch">Project status:</label>
                    <select id="orderByStatus" class="filterSearch">
                        <option selected>All</option>
                        <option>Finished</option>
                        <option>Work in progress</option>
                        <option>Need help</option>
                    </select>
                </li>

                <li class="filterBlock">
                    <label class="labelInfoSearch">Order by:</label>
                    <select id="orderByPeople" class="filterSearch">
                        <option selected>All</option>
                        <option>Most voted</option>
                        <option>Newest</option>
                        <option>Most discussed</option>
                    </select>
                </li>
            </ul>
        </header>

        <main>
            <ul id="lastIdeasSrc">
                <!-- <li class="ideaBox">
                    <a href="" class="ideaLink">
                        <img src="" alt="Idea Image" class="ideaImageSrc">
                        <p class="ideaTitleSrc">Title</p>
                        <p class="ideaAuthorSrc">Author</p>
                    </a>
                </li> -->
            </ul>
        </main>

        <footer id="footer">
            <?php 
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/searchIdea.js" defer></script>
    </body>
</html>