<!--
Author: Gianluca Rainis
This project is licensed under the MIT License.
You can find the license in the LICENSE file in the root directory of this project.
Project: Free Ideas
Free Ideas is a collection of free ideas for projects, apps, and websites that you can use to get inspired or to start your own project.
-->

<?php
    $firstName = $lastName = $email = $password = "";
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $firstName = getInput($_POST["firstName"]);
        $lastName = getInput($_POST["lastName"]);
        $email = getInput($_POST["email"]);
        $password = getInput($_POST["password"]);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = true;

        $errorLog = "Invalid email format";
    }
    
    echo $firstName+" "+$lastName+" "+$email+" "+$password;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>