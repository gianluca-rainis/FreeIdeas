<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    $stmt = $conn->prepare("SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id;");
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