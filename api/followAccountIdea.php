<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    $authorid = $followedaccountid = $followedideaid = "";
    $isNowFollowed = false;

    if (isset($_SESSION['account'])) {
        $authorid = $_SESSION['account']['id'];
    }
    else {
        echo json_encode(["success"=>false, "error"=>"user_not_logged_in"]);
        exit;
    }

    try {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST['followedaccountid']) && !empty($_POST['followedaccountid'])) {
                $followedaccountid = getInput($_POST["followedaccountid"]);
                $followedideaid = null;
            }
            else if (isset($_POST['followedideaid']) && !empty($_POST['followedideaid'])) {
                $followedideaid = getInput($_POST["followedideaid"]);
                $followedaccountid = null;
            }
            else {
                echo json_encode(["success"=>false, "error"=>"cannot_get_data_from_post"]);
                exit;
            }
        }
        else {
            echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
            exit;
        }

        // Is followed
        $sql = "";
        $tempNotNull = "";

        if ($followedaccountid) {
            $sql = "SELECT * FROM follow WHERE followaccountid=? AND followedaccountid=?;";
            $tempNotNull = $followedaccountid;
        }
        else if ($followedideaid) {
            $sql = "SELECT * FROM follow WHERE followaccountid=? AND followedideaid=?;";
            $tempNotNull = $followedideaid;
        }
        
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("ii", $authorid, $tempNotNull);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $result = $stmt->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $stmt->close();

        if (count($data) == 0) {
            // If not followed follow
            $sql = "INSERT INTO follow (followaccountid, followedaccountid, followedideaid) VALUES (?, ?, ?);";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("iii", $authorid, $followedaccountid, $followedideaid);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $stmt->close();

            $isNowFollowed = true;
        }
        else {
            // If followed unfollow
            $sql = "";
            $tempNotNull = "";

            if ($followedaccountid) {
                $sql = "DELETE FROM follow WHERE followaccountid=? AND followedaccountid=?;";
                $tempNotNull = $followedaccountid;
            }
            else if ($followedideaid) {
                $sql = "DELETE FROM follow WHERE followaccountid=? AND followedideaid=?;";
                $tempNotNull = $followedideaid;
            }

            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("ii", $authorid, $tempNotNull);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $stmt->close();

            $isNowFollowed = false;
        }
        
        $conn->close();

        echo json_encode(["success"=>true, "isNowFollowed"=>$isNowFollowed]);
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
?>