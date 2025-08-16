<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $authorid = $followedaccountid = $followedideaid = "";
    $isNowFollowed = false;

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

        if (isset($_SESSION['account']['id'])) {
            $authorid = $_SESSION['account']['id'];
        }
        else {
            echo json_encode(["success"=>false, "error"=>"not_logged_in"]);
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
        
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $state->bind_param("ii", $authorid, $followedaccountid);
        
        if (!$state->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $result = $state->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $state->close();

        if (count($data) == 0) {
            // If not followed follow
            $sql = "INSERT INTO follow (followaccountid, followedaccountid, followedideaid) VALUES (?, ?, ?);";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("iii", $authorid, $followedaccountid, $followedideaid);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $state->close();

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

            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $state->bind_param("ii", $authorid, $tempNotNull);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $state->close();

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

    exit;
?>