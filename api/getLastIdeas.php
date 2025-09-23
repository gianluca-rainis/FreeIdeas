<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    $stmt = $conn->prepare("SELECT accounts.username, ideas.id, ideas.title, ideas.ideaimage FROM ideas JOIN accounts ON ideas.authorid=accounts.id ORDER BY ideas.id DESC LIMIT 20;");
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    }
    else {
        echo json_encode(null);
    }

    $stmt->close();
    $conn->close();
    exit;
?>