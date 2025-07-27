<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

    try {
        // authorupdates clear
        $sql = "DELETE FROM authorupdates WHERE ideaid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"authorupdates_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // additionalinfo clear
        $sql = "DELETE FROM additionalinfo WHERE ideaid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"additionalinfo_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // idealabels clear
        $sql = "DELETE FROM idealabels WHERE ideaid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"idealabels_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // accountideadata clear
        $sql = "DELETE FROM accountideadata WHERE ideaid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"accountideadata_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // comments clear
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

        $sql = "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"comments_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        $result = $state->get_result();

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                deleteAllIdsSubComments($conn, $row['id']);
            }
        }
        
        $state->close();

        // get the idea title for the notification
        $sql = "SELECT title FROM ideas WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"comments_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        $result = $state->get_result();

        if ($result) {
            $title = $result;
        }
        
        $state->close();

        // ideas clear
        $sql = "DELETE FROM ideas WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"ideas_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>$th->__toString()]);
        exit;
    }

    $conn->close();

    // add default notification
    $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(null);
        exit;
    }

    $zero = 0; // Not read for default
    $today = date("Y-m-d");
    $id = $_SESSION['account']['id'];
    $titleNot = "You have deleted an idea!";
    $description = "You have just deleted an old idea: " . $title . "! We're sorry you've decided to remove one of your amazing ideas from our site. If you've had any specific issues, please don't hesitate to contact us.";

    $stmt->bind_param("isssi", $id, $titleNot, $description, $today, $zero);

    $stmt->execute();
    
    $stmt->close();

    /* Notifications loading */
    $stmt = $conn->prepare("SELECT * FROM notifications WHERE accountid = ?;");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];

    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }

    $stmt->close();

    $_SESSION['account']['notifications'] = $notifications;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    echo json_encode(["success"=>true]);
    exit;
?>