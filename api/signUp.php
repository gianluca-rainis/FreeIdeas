<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    $firstName = $lastName = $email = $password = $username = "";
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $firstName = getInput($_POST["firstName"]);
        $lastName = getInput($_POST["lastName"]);
        $email = getInput($_POST["email"]);
        $password = getInput($_POST["password"]);
        $username = getInput($_POST["userName"]);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(null);
        exit;
    }

    $passwordhash = password_hash($password, PASSWORD_DEFAULT);

    // control if email exist yet
    $stmt = $conn->prepare("SELECT id FROM accounts WHERE email = ?;");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(null);
        exit;
    }

    $stmt->close();

    // insert values
    $sql = "INSERT INTO accounts (email, password, name, surname, username) VALUES (?, ?, ?, ?, ?);";
    $state = $conn->prepare($sql);

    if (!$state) {
        echo json_encode(null);
        exit;
    }

    $state->bind_param("sssss", $email, $passwordhash, $firstName, $lastName, $username);

    $state->execute();
    
    $state->close();

    // login
    $stmt = $conn->prepare("SELECT * FROM accounts WHERE email = ?;");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    session_start();

    while ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['account']['id'] = $row['id'];
            $_SESSION['account']['email'] = $row['email'];
            $_SESSION['account']['name'] = $row['name'];
            $_SESSION['account']['surname'] = $row['surname'];

            if (isset($row['userimage'])) {
                $row['userimage'] = base64_encode($row['userimage']);
            }
            else {
                $_SESSION['account']['userimage'] = null;
            }

            $_SESSION['account']['description'] = $row['description'];
            $_SESSION['account']['username'] = $row['username'];

            $stmt->close();
            echo json_encode($_SESSION['account']);
            $conn->close();
            exit;
        }
    }

    $stmt->close();
    echo json_encode(null);
    $conn->close();
    exit;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>