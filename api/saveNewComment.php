<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    if (!isset($_SESSION['account'])) {
        echo json_encode(['success'=>false, 'error'=>"user_not_logged_in"]);
        exit;
    }

    $authorid = $data = $description = $ideaid = $superCommentid = "";

    $authorid = $_SESSION['account']['id'];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = getInput($_POST["data"]);
        $description = getInput($_POST["description"]);
        $ideaid = getInput($_POST["ideaid"]);
        $superCommentid = getInput($_POST["superCommentid"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    if ($superCommentid === "") {
        $superCommentid = null;
    }
    
    $sql = "INSERT INTO comments (authorid, data, description, ideaid, superCommentid) VALUES (?, ?, ?, ?, ?);";
    $state = $conn->prepare($sql);

    if (!$state) {
        echo json_encode(["success"=>false, "error"=>"database_connection"]);
        exit;
    }

    $state->bind_param("issii", $authorid, $data, $description, $ideaid, $superCommentid);
    
    if (!$state->execute()) {
        echo json_encode(["success"=>false, "error"=>"execution_command"]);
        exit;
    }

    $state->close();
    $conn->close();

    echo json_encode(["success"=>true]);
    exit;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>