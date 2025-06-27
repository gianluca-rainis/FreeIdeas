<?php
    header('Content-Type: application/json');

    include("./db_connection.php");

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        echo null;
        exit;
    }

    $id = $_GET['id'];

    $sql = "SELECT ideas.*, accounts.name AS accountName, authorupdates.title AS updateTitle, authorupdates.updtimage AS updateImage, authorupdates.description AS updateDescription, authorupdates.data AS updateData, comments.authorid AS commentAuthor, comments.data AS commentData, comments.description AS commentDescription, comments.superCommentid FROM ideas JOIN accounts ON ideas.authorid=accounts.id JOIN authorupdates ON ideas.id=authorupdates.ideaid JOIN comments ON ideas.id=comments.ideaid WHERE ideas.id=?;"; 
    // SELECT ideas.*, accounts.name AS accountName, authorupdates.title AS updateTitle, authorupdates.updtimage AS updateImage, authorupdates.description AS updateDescription, authorupdates.data AS updateData, comments.authorid AS commentAuthor, comments.data AS commentData, comments.description AS commentDescription, comments.superCommentid FROM ideas JOIN accounts ON ideas.authorid=accounts.id JOIN authorupdates ON ideas.id=authorupdates.ideaid JOIN comments ON ideas.id=comments.ideaid WHERE ideas.id=?;
    $state = $conn->prepare($sql);

    if (!$state) {
        echo null;
        exit;
    }

    $state->bind_param("s", $id);

    $state->execute();
    $result = $state->get_result();

    if ($data = $result->fetch_assoc()) {
        echo json_encode($data);
    }
    else {
        echo null;
        exit;
    }

    $state->close();
    $conn->close();

    exit;
?>