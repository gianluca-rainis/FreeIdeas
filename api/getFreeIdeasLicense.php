<?php
    header('Content-Type: application/json');

    include("./db_connection.php");

    session_start();

    echo json_encode(['success'=>false, 'error'=>"function_not_implemented_yet"]);
    exit;
?>