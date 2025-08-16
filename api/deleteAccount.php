<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";
    $accountInfoData = [];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

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
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        $result = $state->get_result();

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
        
        $state->close();

        // follow clear
        $sql = "DELETE FROM follow WHERE followaccountid=? OR followedaccountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $state->bind_param("ii", $id, $id);

        $state->execute();
        
        $state->close();

        // accountideadata clear
        $sql = "DELETE FROM accountideadata WHERE accountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"accountideadata_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // reports clear
        $sql = "DELETE FROM reports WHERE accountid=? OR authorid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"reports_error"]);
            exit;
        }

        $state->bind_param("ii", $id, $id);

        $state->execute();
        
        $state->close();

        // get ideas id
        $sql = "SELECT id FROM ideas WHERE authorid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"get_ideas_ids_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        $result = $state->get_result();

        $ideasId = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $ideasId[] = $row['id'];
            }
        }
        
        $state->close();

        // notifications clear
        $sql = "DELETE FROM notifications WHERE accountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"delete_notifications_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        for ($i=0; $i < count($ideasId); $i++) { 
            // idealabels clear
            $sql = "DELETE FROM idealabels WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"idealabels_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // reports clear
            $sql = "DELETE FROM reports WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"reports_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // follow clear
            $sql = "DELETE FROM follow WHERE followedideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"follow_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // comments clear
            $sql = "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"comments_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            $result = $state->get_result();

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    deleteAllIdsSubComments($conn, $row['id']);
                }
            }
            
            $state->close();

            // authorupdates clear
            $sql = "DELETE FROM authorupdates WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"authorupdates_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // additionalinfo clear
            $sql = "DELETE FROM additionalinfo WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"additionalinfo_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // ideas clear
            $sql = "DELETE FROM ideas WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"ideas_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();
        }

        // accounts clear
        $sql = "DELETE FROM accounts WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"accounts_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>$th->__toString()]);
        exit;
    }

    session_unset();
    session_destroy();

    $conn->close();

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
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

    echo json_encode(["success"=>true]);
    exit;
?>