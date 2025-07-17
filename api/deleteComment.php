<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";
    $fatalError = "";
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

    if ($id === "") {
        echo json_encode(["success"=>false, "error"=>"post_data"]);
        exit;
    }

    // Delete all the comments from the deeper
    function deleteAllIdsSubComments($conn, $id) {
        try {
            $sql = "SELECT * FROM comments WHERE superCommentid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("i", $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_subcomments"]);
                exit;
            }

            $result = $state->get_result();

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $state->close();

            // $data contains all the subcomments
            foreach ($data as $row) {
                deleteAllIdsSubComments($conn, $row['id']);
            }

            // This is the deeper ($id comment)
            // Delete the subcomment
            $sql = "DELETE FROM comments WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("i", $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_subcomments"]);
                exit;
            }

            $state->close();
        } catch (\Throwable $th) {
            global $fatalError;
            $fatalError = $th;
        }
        
        return;
    }

    deleteAllIdsSubComments($conn, $id);

    // Delete the comment
    try {
        $sql = "DELETE FROM comments WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $state->bind_param("i", $id);
        
        if (!$state->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command_delete_comment"]);
            exit;
        }

        $state->close();
    } catch (\Throwable $th) {
        if ($fatalError == "") {
            $fatalError = $th;
        }
    }

    $conn->close();

    if ($fatalError == "") {
        echo json_encode(["success"=>true]);
    }
    else {
        echo json_encode(["success"=>false, "error"=>$fatalError]);
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>