<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        $sql = "UPDATE notifications SET status=? WHERE id=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $one = 1;

        $stmt->bind_param("ii", $one, $id);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $stmt->close();

        /* Notifications loading */
        $id = $_SESSION['account']['id'];

        $stmt = $conn->prepare("SELECT * FROM notifications WHERE accountid = ?;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $notifications = [];

        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        
        $_SESSION['account']['notifications'] = $notifications;

        $stmt->close();
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