<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    session_unset();
    session_destroy();

    exit;
?>