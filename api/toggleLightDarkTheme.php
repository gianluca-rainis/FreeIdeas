<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    if (!isset($_GET['theme'])) {
        echo json_encode(null);
        exit;
    }

    $id = $_GET['theme'];

    if ($id == "light") {
        $_SESSION['theme'] = "light";
    } else {
        $_SESSION['theme'] = "dark";
    }
    
    echo json_encode(['success'=>true]);
    exit;
?>