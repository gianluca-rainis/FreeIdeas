<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";
    $accountInfoData = [];
    $fatalError = null;

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    // Get account info
    try {
        $stmt = $conn->prepare("SELECT * FROM accounts WHERE id = ?;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $accountInfoData = [];

        if ($row = $result->fetch_assoc()) {
            $accountInfoData["id"] = $row['id'];
            $accountInfoData['email'] = $row['email'];
            $accountInfoData['name'] = $row['name'];
            $accountInfoData['surname'] = $row['surname'];
            $accountInfoData['userimage'] = $row['userimage'];
            $accountInfoData['description'] = $row['description'];
            $accountInfoData['username'] = $row['username'];
            $accountInfoData['public'] = $row['public'];
        }
        else {
            $accountInfoData = null;
        }

        $stmt->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    try {
        // get followers id
        $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $stmt->bind_param("i", $id);

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
                $titleNot = $accountInfoData['username'] . " has deleted his account.";
                $description = "We are sorry to inform you that " . $accountInfoData['username'] . " has deleted his account. You see this notification because you were following it. You will no longer receive notifications about activity on this account.";

                $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);
                $stmt->execute();
                $stmt->close();
            }
        }
        
        $stmt->close();

        // follow clear
        $sql = "DELETE FROM follow WHERE followaccountid=? OR followedaccountid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"delete_follow_error"]);
            exit;
        }

        $stmt->bind_param("ii", $id, $id);
        $stmt->execute();
        $stmt->close();

        // accountideadata clear
        $sql = "DELETE FROM accountideadata WHERE accountid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // reports clear
        $sql = "DELETE FROM reports WHERE accountid=? OR authorid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"delete_reports_error"]);
            exit;
        }

        $stmt->bind_param("ii", $id, $id);
        $stmt->execute();
        $stmt->close();

        // notifications clear
        $sql = "DELETE FROM notifications WHERE accountid=?;";
        deleteDataFormDb($conn, $id, $sql);

        // get ideas id
        $sql = "SELECT id FROM ideas WHERE authorid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"get_ideas_ids_error"]);
            exit;
        }

        $stmt->bind_param("i", $id);

        $stmt->execute();
        $result = $stmt->get_result();

        $ideasId = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $ideasId[] = $row['id'];
            }
        }
        
        $stmt->close();

        for ($i=0; $i < count($ideasId); $i++) { 
            // idealabels clear
            $sql = "DELETE FROM idealabels WHERE ideaid=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);

            // reports clear
            $sql = "DELETE FROM reports WHERE ideaid=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);

            // follow clear
            $sql = "DELETE FROM follow WHERE followedideaid=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);

            // comments clear
            $sql = "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"comments_error"]);
                exit;
            }

            $stmt->bind_param("i", $ideasId[$i]);

            $stmt->execute();
            $result = $stmt->get_result();

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    deleteAllIdsSubComments($conn, $row['id']);
                }
            }
            
            $stmt->close();

            if ($fatalError != null) {
                echo json_encode(["success"=>false, "error"=>$fatalError]);
                exit;
            }

            // authorupdates clear
            $sql = "DELETE FROM authorupdates WHERE ideaid=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);

            // additionalinfo clear
            $sql = "DELETE FROM additionalinfo WHERE ideaid=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);

            // ideas clear
            $sql = "DELETE FROM ideas WHERE id=?;";
            deleteDataFormDb($conn, $ideasId[$i], $sql);
        }

        // accounts clear
        $sql = "DELETE FROM accounts WHERE id=?;";
        deleteDataFormDb($conn, $id, $sql);
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    session_unset();
    session_destroy();

    $conn->close();
    
    echo json_encode(["success"=>true]);
    exit;

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
            $fatalError = strval($th);
        }
        
        return;
    }
?>