<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $authorid = $ideaid = $accountid = $feedback = "";

    try {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $ideaid = getInput($_POST["ideaid"]);
            $accountid = getInput($_POST["accountid"]);
            $feedback = getInput($_POST["feedback"]);
        }

        if (isset($_SESSION['account']['id'])) {
            $authorid = $_SESSION['account']['id'];
        }
        else {
            echo json_encode(["success"=>false, "error"=>"not_logged_in"]);
            exit;
        }
        
        $sql = "INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $state->bind_param("iiis", $authorid, $ideaid, $accountid, $feedback);
        
        if (!$state->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $state->close();

        // Control if the author have done too much reports on the same thing
        $sql = "SELECT * FROM reports WHERE authorid=? AND ideaid=? AND accountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection_verify_reports_sended"]);
            exit;
        }

        $state->bind_param("iii", $authorid, $ideaid, $accountid);
        
        if (!$state->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command_verify_reports_sended"]);
            exit;
        }

        $result = $state->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $state->close();

        if (count($data) == 6) { // If the same author have report the same account/idea more than 5 times, report it's account
            $sql = "INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $tempAuthorId = 1;
            $tempIdeaId = null;
            $tempFeedback = "The user have reported too much times the same account/idea. This is an auto-generated report.";

            $state->bind_param("iiis", $tempAuthorId, $tempIdeaId, $authorid, $tempFeedback);
            
            if (!$state->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $state->close();
        }

        $conn->close();

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

    exit;
?>