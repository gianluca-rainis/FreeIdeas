<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";
    $authorDeletedCommentid = 14; // Need an account named "Deleted" without profile image with id 14 to work
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

    if ($id === "") {
        echo json_encode(["success"=>false, "error"=>"post_data"]);
        exit;
    }

    // Delete the comment
    if (!controlIfHaveSubcomments($conn, $id)) {
        deleteCommentAndSuperCommentsWithoutSubComments($conn, $id);
    }
    else { // Delete the info about the comment without delete the subcomments
        try {
            $sql = "UPDATE comments SET authorid=?, description=? WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $description = "This comment was deleted by the author.";

            $state->bind_param("isi", $authorDeletedCommentid, $description, $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_comment"]);
                exit;
            }

            $state->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }
    }

    $conn->close();

    echo json_encode(["success"=>true]);
    exit;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    // Control if the comment have subcomments
    function controlIfHaveSubcomments($conn, $id) {
        $ret = false;

        try {
            $sql = "SELECT * FROM comments WHERE superCommentid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("i", $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $state->get_result();

            if ($result->num_rows > 0) {
                $ret = true;
            }

            $state->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }

        return $ret;
    }

    // Get the superCommentid
    function getSuperCommentid($conn, $id) {
        $ret = null;

        try {
            $sql = "SELECT superCommentid FROM comments WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("i", $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $state->get_result();

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();

                $ret = $row['superCommentid'];
            }

            $state->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }

        return $ret;
    }

    // Get the authorid of the comment
    function getAuthorId($conn, $id) {
        $ret = null;

        try {
            $sql = "SELECT authorid FROM comments WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("i", $id);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $state->get_result();

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();

                $ret = $row['authorid'];
            }

            $state->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }

        return $ret;
    }

    // Delete the comment and all the supersomments without comment
    function deleteCommentAndSuperCommentsWithoutSubComments($conn, $id) {
        global $authorDeletedCommentid;

        $superCommentId = getSuperCommentid($conn, $id);
        $authorId = getAuthorId($conn, $superCommentId);

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
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }

        if ($superCommentId !== null && !controlIfHaveSubcomments($conn, $superCommentId) && $authorId === $authorDeletedCommentid) {
            deleteCommentAndSuperCommentsWithoutSubComments($conn, $superCommentId);
        }
    }

    exit;
?>