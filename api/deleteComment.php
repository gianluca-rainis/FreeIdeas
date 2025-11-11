<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    $id = "";
    $authorDeletedCommentid = null;
    
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        $sql = "SELECT authorid FROM comments WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $authorId = $row['authorid'];

            if ((!isset($_SESSION['account']) || $_SESSION['account']['id'] != $authorId) && !isset($_SESSION['administrator'])) {
                echo json_encode(['success'=>false, 'error'=>"user_not_logged_in"]);
                exit;
            }
        }

        $stmt->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
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
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            if (isset($_SESSION['administrator'])) {
                $description = "This comment was deleted by the administrator.";
            }
            else {
                $description = "This comment was deleted by the author.";
            }

            $stmt->bind_param("isi", $authorDeletedCommentid, $description, $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_comment"]);
                exit;
            }

            $stmt->close();
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
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $ret = true;
            }

            $stmt->close();
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
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $stmt->get_result();

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();

                $ret = $row['superCommentid'];
            }

            $stmt->close();
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
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_get_subcomments"]);
                exit;
            }

            $result = $stmt->get_result();

            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();

                $ret = $row['authorid'];
            }

            $stmt->close();
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
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_comment"]);
                exit;
            }

            $stmt->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }

        if ($superCommentId !== null && !controlIfHaveSubcomments($conn, $superCommentId) && $authorId === $authorDeletedCommentid) {
            deleteCommentAndSuperCommentsWithoutSubComments($conn, $superCommentId);
        }
    }
?>