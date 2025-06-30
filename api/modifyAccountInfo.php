<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = $_SESSION['account']['id'];

    $firstName = $lastName = $email = $description = $username = "";
    $image = null;
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $firstName = getInput($_POST["name"]);
        $lastName = getInput($_POST["surname"]);
        $email = getInput($_POST["email"]);
        $description = getInput($_POST["description"]);
        $username = getInput($_POST["username"]);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success"=>false, "error"=>"invalid_email"]);
        exit;
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = file_get_contents($_FILES['image']['tmp_name']);
    }

    if ($image !== null) {
        $sql = "UPDATE accounts SET email=?, name=?, surname=?, username=?, userimage=?, description=? WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"image_database_connection"]);
            exit;
        }

        $userImage = null;
        
        $state->bind_param("ssssbsi", $email, $firstName, $lastName, $username, $userImage, $description, $id);

        $state->send_long_data(4, $image);
    }
    else {
        $sql = "UPDATE accounts SET email=?, name=?, surname=?, username=?, description=? WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $state->bind_param("sssssi", $email, $firstName, $lastName, $username, $description, $id);
    }

    if (!$state->execute()) {
        echo json_encode(["success"=>false, "error"=>"execution_command"]);
    }

    $state->close();
    $conn->close();

    $_SESSION['account']['id'] = $id;
    $_SESSION['account']['email'] = $email;
    $_SESSION['account']['name'] = $firstName;
    $_SESSION['account']['surname'] = $lastName;

    if ($image) {
        $_SESSION['account']['userimage'] = 'data:image/png;base64,' . base64_encode($image);
    }
    else {
        $_SESSION['account']['userimage'] = null;
    }

    $_SESSION['account']['description'] = $description;
    $_SESSION['account']['username'] = $username;

    echo json_encode(["success"=>true]);

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>