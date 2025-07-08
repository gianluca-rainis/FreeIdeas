<?php
    header('Content-Type: application/json');
    session_start();

    if (!isset($_GET['data'])) {
        echo json_encode(null);
        exit;
    }

    $id = $_GET['data'];

    if ($id == 'account') {
        echo json_encode($_SESSION['account']);
        exit;
    }
    else if ($id == 'theme') {
        echo json_encode($_SESSION['theme']);
        exit;
    }
    else {
        echo json_encode(null);
        exit;
    }

    exit;
?>