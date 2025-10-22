<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    $title = $accountId = $date = $description = $status = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $title = getInput($_POST["title"]);
        $accountId = getInput($_POST["accountId"]);
        $date = getInput($_POST["date"]);
        $description = getInput($_POST["description"]);
        $status = getInput($_POST["status"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(['success'=>false, 'error'=>"add_notification"]);
            exit;
        }
        
        $stmt->bind_param("isssi", $accountId, $title, $description, $date, $status);
        $stmt->execute();

        $stmt->close();
        $conn->close();

        echo json_encode(['success'=>true]);
        exit;
    } catch (\Throwable $th) {
        echo json_encode(['success'=>false, 'error'=>strval($th)]);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>