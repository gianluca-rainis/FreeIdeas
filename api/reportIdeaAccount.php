<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    $authorid = $ideaid = $accountid = $feedback = "";

    if (!isset($_SESSION['account'])) {
        echo json_encode(['success'=>false, 'error'=>"administrator_not_logged_in"]);
        exit;
    }
    else {
        $authorid = $_SESSION['account']['id'];
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $ideaid = getInput($_POST["ideaid"]);
        $accountid = getInput($_POST["accountid"]);
        $feedback = getInput($_POST["feedback"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        $sql = "INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("iiis", $authorid, $ideaid, $accountid, $feedback);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $stmt->close();

        // Control if the author have done too much reports on the same thing
        $sql = "SELECT * FROM reports WHERE authorid=? AND ideaid=? AND accountid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection_verify_reports_sended"]);
            exit;
        }

        $stmt->bind_param("iii", $authorid, $ideaid, $accountid);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command_verify_reports_sended"]);
            exit;
        }

        $result = $stmt->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $stmt->close();

        if (count($data) == 6) { // If the same author have report the same account/idea more than 5 times, report it's account
            $sql = "INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $tempAuthorId = 1;
            $tempIdeaId = null;
            $tempFeedback = "The user have reported too much times the same account/idea. This is an auto-generated report.";

            $stmt->bind_param("iiis", $tempAuthorId, $tempIdeaId, $authorid, $tempFeedback);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $stmt->close();
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
?>