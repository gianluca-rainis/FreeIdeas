<?php
    header('Content-Type: application/json');
    session_start();

    if (!isset($_GET['data'])) {
        echo json_encode(null);
        exit;
    }

    $id = $_GET['data'];

    try {
        if ($id == 'account') {
            if (isset($_SESSION['account'])) {
                echo json_encode($_SESSION['account']);
                exit;
            }
            else {
                echo json_encode(null);
                exit;
            }
        }
        else {
            echo json_encode(null);
            exit;
        }
    } catch (\Throwable $th) {
        echo json_encode(null);
        exit;
    }

    exit;
?>