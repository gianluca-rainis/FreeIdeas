<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

    if ($id === "") {
        echo json_encode(["success"=>false, "error"=>"post_data"]);
        exit;
    }

    // Delete the comment
    try {
        $sql = "UPDATE comments SET authorid=?, description=? WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $authorid = 0;
        $description = "This comment was deleted by the author.";

        $state->bind_param("ssi", $authorid, $description, $id);
        
        if (!$state->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command_delete_comment"]);
            exit;
        }

        $state->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

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