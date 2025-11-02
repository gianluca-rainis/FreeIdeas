<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    session_unset();
    session_destroy();

    exit;
?>