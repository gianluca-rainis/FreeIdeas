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
        <title>FreeIdeas - Publish an Idea</title>
        <link rel="canonical" href="https://freeideas.duckdns.org/publishAnIdea.php" />
    </head>

    <body>
        <nav id="nav">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/nav.php');
            ?>
        </nav>

        <main id="newIdeaMain">
            <form id="newIdeaForm" method="post" enctype="multipart/form-data" action="./api/saveNewIdea.php">
                <div id="ideaImageAsBackground"> <!-- MAIN INFO - TITLE AND AUTHOR -->
                    <input type="text" id="title" placeholder="Title" maxlength="255" required>
                    <h2 id="author"><a id="mainAuthorAccount">Author</a></h2>
                </div>

                <label>Backgrount image: </label><input type="file" id="mainImage" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" required>

                <div id="newinfoForFilters">
                    <label class="labelInfoSearch">Type of project:</label>
                    <label class="labelInfoSearch">Creativity Type:</label>
                    <label class="labelInfoSearch">Project status:</label>

                    <select id="typeFilter" class="filterSearch" required>
                        <option value="" selected>None</option>
                        <option value="Technological Innovation">Technological Innovation</option>
                        <option value="Environmental Sustainability">Environmental Sustainability</option>
                        <option value="Education & Learning">Education & Learning</option>
                        <option value="Business & Startups">Business & Startups</option>
                        <option value="Art & Design">Art & Design</option>
                        <option value="Social & Community">Social & Community</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Travel & Experiences">Travel & Experiences</option>
                        <option value="Games & Entertainment">Games & Entertainment</option>
                    </select>

                    <select id="creativityTypeFilter" class="filterSearch" required>
                        <option value="" selected>None</option>
                        <option value="Practical and actionable">Practical and actionable</option>
                        <option value="Abstract or conceptual">Abstract or conceptual</option>
                        <option value="Thought-provoking">Thought-provoking</option>
                        <option value="Visionary or futuristic">Visionary or futuristic</option>
                        <option value="Humorous or satirical">Humorous or satirical</option>
                    </select>

                    <select id="orderByStatus" class="filterSearch" required>
                        <option value="" selected>None</option>
                        <option value="Finished">Finished</option>
                        <option value="Work in progress">Work in progress</option>
                        <option value="Need help">Need help</option>
                    </select>
                </div>

                <textarea type="text" id="description" placeholder="Description" maxlength="10000" required></textarea> <!-- MAIN INFO - DESCRIPTION -->

                <section id="additionalInfo">
                    <h3 class="subtitles">Additional Information</h3>
                    <img src="./images/add.svg" alt="Add additional info" id="addAdditionalInfo">
                    <ul id="imagesInfo"> <!-- SECOND INFO - IMAGE + INFO -->
                        <!-- <li class="imageInfoLi">
                            <div></div>
                            <img src="./images/delete.svg" alt="Delete additional info" class="deleteAdditionalInfo">
                            
                            <div>
                                <img class="preview" alt="Additional info image" src="./images/FreeIdeas.svg">
                                <input type="file" class="imageInfo" accept="image/png, image/jpeg, image/gif, image/x-icon, image/webp, image/bmp" required>
                            </div>

                            <div style="display: flex;flex-direction: column;align-items: center;">
                                <textarea type="text" class="titleImageInfo" placeholder="Title" maxlength="255" required></textarea>
                                <textarea type="text" class="imageInfoDescription" placeholder="Info" maxlength="10000" required></textarea>
                            </div>
                        </li> -->
                    </ul>
                </section>

                <section id="downloadSection">
                    <h3 class="subtitles">External Link</h3> <!-- MAIN INFO - LINK TO DOWNLOAD -->
                    <input type="url" id="buttonlink" placeholder="Link to download data" maxlength="5000">
                </section>

                <section id="licenseSection">
                    <h3 class="subtitles">License</h3> <!-- MAIN INFO - LICENSE -->
                    <input type="file" id="licensePdfFile" accept=".pdf">
                    <div style="padding: 10px;">
                        <label for="licenseDefaultLicense">Use the FreeIdeas license: </label>
                        <input type="checkbox" id="licenseDefaultLicense" name="licenseDefaultLicense" checked>
                    </div>
                </section>

                <section id="devLogsSection">
                    <h3 class="subtitles">Author's Log</h3> <!-- THIRD INFO - DEV LOGS ( ADD AFTER PUBLISHED ) -->
                    <img src="./images/add.svg" alt="Add log" id="addLog">
                    <ul id="logsList">
                        <!-- <li class="log">
                            <img src="./images/delete.svg" alt="Delete log" class="deleteLog">
                            <div class="logTitleAndData">
                                <textarea class="logTitle" placeholder="Title" maxlength="255" required></textarea>
                                <div class="data">yyyy-mm-gg</div>
                            </div>

                            <textarea class="logInfo" placeholder="Description" maxlength="10000" required></textarea>
                        </li> -->
                    </ul>
                </section>

                <div style="display: flex; justify-content: center;">
                    <input type="submit" id="saveNewIdea" value="Publish">
                    <input type="button" id="deleteOldIdea" value="Delete idea" style="display: none;">
                    <img id="cancelNewIdea" alt="Cancel changes" src="./images/delete.svg">
                </div>
            </form>
        </main>

        <footer id="footer">
            <?php
                include($_SERVER['DOCUMENT_ROOT'] . '/include/footer.php');
            ?>
        </footer>

        <script src="./scripts/commonParts.js" defer></script>
        <script src="./scripts/publishanIdea.js" defer></script>
    </body>
</html>