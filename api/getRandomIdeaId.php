<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $stmt = $conn->prepare("SELECT id FROM ideas ORDER BY RAND() LIMIT 1;");
    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];

    if ($row = $result->fetch_assoc()) {
        $data = ["id"=>$row['id']];
    }

    $stmt->close();
    $conn->close();
    
    echo json_encode($data);
    exit;
?>