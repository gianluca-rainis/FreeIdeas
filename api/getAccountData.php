<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);

        $stmt = $conn->prepare("SELECT * FROM accounts WHERE id = ?;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];

        if ($row = $result->fetch_assoc()) {
            $data["id"] = $row['id'];
            $data['email'] = $row['email'];
            $data['name'] = $row['name'];
            $data['surname'] = $row['surname'];
            $data['userimage'] = $row['userimage'];
            $data['description'] = $row['description'];
            $data['username'] = $row['username'];
        }
        else {
            $data = null;
        }

        $stmt->close();
        $conn->close();
        
        echo json_encode($data);
        exit;
    }
    else {
        echo json_encode(null);
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