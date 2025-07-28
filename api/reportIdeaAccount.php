<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $authorid = $ideaid = $accountid = $feedback = "";
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $ideaid = getInput($_POST["ideaid"]);
        $accountid = getInput($_POST["accountid"]);
        $feedback = getInput($_POST["feedback"]);
    }

    if (isset($_SESSION['account']['id'])) {
        $authorid = $_SESSION['account']['id'];
    }
    else {
        echo json_encode(["success"=>false, "error"=>"not_logged_in"]);
        exit;
    }
    
    $sql = "INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);";
    $state = $conn->prepare($sql);

    if (!$state) {
        echo json_encode(["success"=>false, "error"=>"database_connection"]);
        exit;
    }

    $state->bind_param("iiis", $authorid, $ideaid, $accountid, $feedback);
    
    if (!$state->execute()) {
        echo json_encode(["success"=>false, "error"=>"execution_command"]);
        exit;
    }

    $state->close();
    $conn->close();

    echo json_encode(["success"=>true]);

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>