<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    $id = "";
    $title = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        // authorupdates clear
        $sql = "DELETE FROM authorupdates WHERE ideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // reports clear
        $sql = "DELETE FROM reports WHERE ideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // additionalinfo clear
        $sql = "DELETE FROM additionalinfo WHERE ideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // idealabels clear
        $sql = "DELETE FROM idealabels WHERE ideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // accountideadata clear
        $sql = "DELETE FROM accountideadata WHERE ideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // comments clear
        $sql = "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"comments_error"]);
            exit;
        }

        $stmt->bind_param("i", $id);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                deleteAllIdsSubComments($conn, $row['id']);
            }
        }
        
        $stmt->close();

        // get the idea title for the notification
        $sql = "SELECT title FROM ideas WHERE id=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"comments_error"]);
            exit;
        }

        $stmt->bind_param("i", $id);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            $title = $row['title'];
        }
        
        $stmt->close();

        // Send notification to followers
        $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=? OR followedideaid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $stmt->bind_param("ii", $_SESSION['account']['id'], $id);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // add default notification
                $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                $stmt = $conn->prepare($sql);

                if (!$stmt) {
                    echo json_encode(["success"=>false, "error"=>"follow_error"]);
                    exit;
                }

                $zero = 0; // Not read for default
                $today = date("Y-m-d");
                $idNot = $row['followaccountid'];
                $titleNot = $_SESSION['account']['username'] . " has deleted " . $title . ".";
                $description = $_SESSION['account']['username'] . " has deleted " . $title . ". You can no longer visit its idea page.";

                $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);
                $stmt->execute();
            }
        }
        
        $stmt->close();

        // Delete followers from idea
        $sql = "DELETE FROM follow WHERE followedideaid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // ideas clear
        $sql = "DELETE FROM ideas WHERE id=?;";
        deleteDataFormDb($conn, $id, $sql);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    try {
        // add default notification
        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"error_insert_notification"]);
            exit;
        }

        $zero = 0; // Not read for default
        $today = date("Y-m-d");
        $idNot = $_SESSION['account']['id'];
        $titleNot = "You have deleted an idea!";
        $description = "You have just deleted an old idea: " . $title . "! We're sorry you've decided to remove one of your amazing ideas. If you encountered any issues, feel free to contact us.";

        $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);
        $stmt->execute();
        $stmt->close();

        /* Notifications loading */
        $stmt = $conn->prepare("SELECT * FROM notifications WHERE accountid = ?;");
        $stmt->bind_param("i", $_SESSION['account']['id']);
        $stmt->execute();
        $result = $stmt->get_result();

        $notifications = [];

        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }

        $stmt->close();
        $conn->close();

        $_SESSION['account']['notifications'] = $notifications;

        echo json_encode(["success"=>true]);
        exit;
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    function deleteDataFormDb($conn, $id, $sql) {
        try {
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"generic_delete_query_error"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
        } catch (\Throwable $th) {
            echo json_encode(["success"=>false, "error"=>strval($th)]);
            exit;
        }
    }

    // Delete all the comments from the deeper
    function deleteAllIdsSubComments($conn, $id) {
        try {
            $sql = "SELECT * FROM comments WHERE superCommentid=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("i", $id);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command_delete_subcomments"]);
                exit;
            }

            $result = $stmt->get_result();

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $stmt->close();

            // $data contains all the subcomments
            foreach ($data as $row) {
                deleteAllIdsSubComments($conn, $row['id']);
            }

            // This is the deeper ($id comment)
            // Delete the subcomment
            $sql = "DELETE FROM comments WHERE id=?;";
            deleteDataFormDb($conn, $id, $sql);
        } catch (\Throwable $th) {
            global $fatalError;
            $fatalError = $th;
        }
        
        return;
    }
?>