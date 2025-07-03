<?php
    header('Content-Type: application/json');

    include("./db_connection.php");

    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        echo null;
        exit;
    }

    $id = $_GET['id'];

    $return = [];

    function getDataFromDatabase($conn, $id, $query) {
        // SELECT ideas.*, accounts.username AS accountName, authorupdates.title AS updateTitle, authorupdates.updtimage AS updateImage, authorupdates.description AS updateDescription, authorupdates.data AS updateData, comments.authorid AS commentAuthor, comments.data AS commentData, comments.description AS commentDescription, comments.superCommentid FROM ideas JOIN accounts ON ideas.authorid=accounts.id JOIN authorupdates ON ideas.id=authorupdates.ideaid JOIN comments ON ideas.id=comments.ideaid WHERE ideas.id=?;
        $state = $conn->prepare($query);

        if (!$state) {
            return null;
        }

        $state->bind_param("s", $id);

        $state->execute();
        $result = $state->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $state->close();

        return $data;
    }

    $return['idea'] = getDataFromDatabase($conn, $id, "SELECT ideas.*, accounts.username AS accountName FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;");
    $return['info'] = getDataFromDatabase($conn, $id, "SELECT * FROM additionalinfo WHERE ideaid=?;"); // Return the info with image
    $return['log'] = getDataFromDatabase($conn, $id, "SELECT * FROM authorupdates WHERE ideaid=?;"); // Logs
    $return['comment'] = getDataFromDatabase($conn, $id, "SELECT comments.*, accounts.username, accounts.userimage FROM comments JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;"); // Comments

    echo json_encode($return);
    
    $conn->close();

    exit;
?>