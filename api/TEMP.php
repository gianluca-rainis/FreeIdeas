<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    $username = "";
    $password1 = password_hash("", PASSWORD_DEFAULT);
    $password2 = password_hash("", PASSWORD_DEFAULT);
    $password3 = password_hash("", PASSWORD_DEFAULT);
    $password4 = password_hash("", PASSWORD_DEFAULT);
    $password5 = password_hash("", PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO reservedareaaccounts (username, password1, password2, password3, password4, password5) VALUES (?, ?, ?, ?, ?, ?);");
    $stmt->bind_param("ssssss", $username, $password1, $password2, $password3, $password4, $password5);
    $stmt->execute();

    $conn->close();
    exit;
?>