<!--
Author: Gianluca Rainis
This project is licensed under the MIT License.
You can find the license in the LICENSE file in the root directory of this project.
Project: Free Ideas
Free Ideas is a collection of free ideas for projects, apps, and websites that you can use to get inspired or to start your own project.
-->

<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    $email = $password = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = getInput($_POST["email"]);
        $password = getInput($_POST["password"]);
    }

    $stmt = $conn->prepare("SELECT id, password FROM accounts WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password'])) {
            $_SESSION['userid'] = $user['id'];
            $_SESSION['username'] = $user['name'];
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Password errata"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Utente non trovato"]);
    }

    $stmt->close();
    $conn->close();

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>