<!-- 
    Nav iniected by /include/nav.php
-->

<div id="pcNavBarGhost">
    <ul class="navLogo">
        <li><a href="./index.php"><img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo"></a></li>
    </ul>
    <ul class="navLinks">
        <li><a href="./searchAnIdea.php" class="navText">Search an Idea</a></li>
        <li><a href="./publishAnIdea.php" class="navText">Publish an Idea</a></li>
        <li><a href="" class="navText" id="randomIdeaA">Random Idea</a></li>
        <li id="themeImageLi"><img src="./images/sun-dark.svg" alt="Toggle Theme" class="toggle-light-dark-theme"></li>
        <li id="notificationImageLi"><img src="./images/notifications.svg" alt="Notifications" class="notificationsImg"></li>
        <li id="userImageLi"><img src="./images/user.svg" alt="User image" id="userImage"><p id="userName">Login</p></li>
    </ul>
    <div id="loginArea">
        <div id="pcLoginSignUpBlock">
            <div id="loginHidden">
                <h2>Sign In</h2>
                <p>Don't have an account? <a class="signUp" href="./createAccount.php">Register!</a></p>
                <form action="./api/login.php" method="POST" id="loginAccountForm">
                    <input type="email" id="emailAreaLogin" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                    <input type="password" id="passwordAreaLogin" autocomplete="current-password" placeholder="Password" name="password" required>
                
                    <button type="button" class="toggle-password-visibility">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                            <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                        </svg>
                    </button>
                    <p><a id="forgotPassword">Forgot your password?</a></p>
                    <button type="submit" id="sendLoginButton">Sign In</button>
                </form>
            </div>
        </div>

        <div id="notificaions" style="display: none;">
            <h2>Notifications</h2>
            <ul class="notificationsUl">
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
            </ul>

            <div class="hiddenNotificationData" style="display: none;">

            </div>
        </div>
    </div>
</div>

<div id="mobileNavBarGhost">
    <ul class="navLogo">
        <li><a href="./index.php"><img src="./images/FreeIdeas.svg" alt="FreeIdeas Logo" id="navLogo"></a></li>
    </ul>
    <ul class="navLinks">
        <li id="themeImageLiMobile"><img src="./images/sun-dark.svg" alt="Toggle Theme" class="toggle-light-dark-theme"></li>
        <li id="notificationImageLiMobile"><img src="./images/notifications.svg" alt="Notifications" class="notificationsImg"></li>
        <li id="userImageLi"><img src="./images/menu.svg" alt="Menu" id="menuMobile"></li>
    </ul>
    <div id="mobileMenuHidden">
        <ul id="mobileNavLinks">
            <li><a href="./searchAnIdea.php" class="navText">Search an Idea</a></li>
            <li><a href="./publishAnIdea.php" class="navText">Publish an Idea</a></li>
            <li><a href="" class="navText" id="randomIdeaAMobile">Random Idea</a></li>
        </ul>

        <div id="loginAreaMobile">
            <div id="mobileLoginSignUpBlock">
                <div id="loginHiddenMobile">
                    <h2>Sign In</h2>
                    <p>Don't have an account? <a class="signUp" href="./createAccount.php">Register!</a></p>
                    <form action="./api/login.php" method="POST" id="loginAccountFormMobile">
                        <input type="email" id="emailAreaLoginMobile" autocomplete="email" spellcheck="false" autocapitalize="off" placeholder="Email" name="email" required>
                        <input type="password" id="passwordAreaLoginMobile" autocomplete="current-password" placeholder="Password" name="password" required>
                    
                        <button type="button" class="toggle-password-visibility-mobile">
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 6C10.5 7.38071 9.38071 8.5 8 8.5C6.61929 8.5 5.5 7.38071 5.5 6C5.5 4.61929 6.61929 3.5 8 3.5C9.38071 3.5 10.5 4.61929 10.5 6Z" fill="black"></path>
                                <path d="M0 6C0 6 3 0.5 8 0.5C13 0.5 16 6 16 6C16 6 13 11.5 8 11.5C3 11.5 0 6 0 6ZM8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5Z" fill="black"></path>
                            </svg>
                        </button>
                        <p><a id="forgotPassword">Forgot your password?</a></p>
                        <button type="submit" id="sendLoginButtonMobile">Sign In</button>
                    </form>
                </div>
            </div>

            <div id="notificaionsMobile" style="display: none;">
                <h2>Notifications</h2>
                <ul class="notificationsUl">
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                    <li><div style="display: flex;"><strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div></div><div> </div></li>
                </ul>

                <div class="hiddenNotificationData" style="display: none;">

                </div>
            </div>
        </div>
    </div>
</div>