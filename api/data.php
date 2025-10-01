<?php
    header('Content-Type: application/json');

    include("./db_connection.php");

    session_start();

    if (!isset($_GET['id']) || !is_numeric($_GET['id']))
    {
        echo json_encode(["success"=>false, "error"=>"cannot_get_id_with_GET"]);
        exit;
    }

    $id = $_GET['id'];

    $return = [];

    function getDataFromDatabase($conn, $id, $query) {
        try {
            $state = $conn->prepare($query);

            if (!$state)
            {
                return null;
            }

            $state->bind_param("i", $id);

            $state->execute();
            $result = $state->get_result();

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $state->close();

            return $data;
        } catch (\Throwable $th) {
            return null;
        }
    }

    function getDataFromDatabaseWithAccountInfo($conn, $id, $query) {
        try {
            if (!isset($_SESSION['account']['id']))
            {
                return [null];
            }
            else
            {
                $accountId = $_SESSION['account']['id'];
            }
            
            $state = $conn->prepare($query);

            if (!$state)
            {
                return null;
            }

            $state->bind_param("ii", $id, $accountId);

            $state->execute();
            $result = $state->get_result();

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $state->close();

            return $data;
        } catch (\Throwable $th) {
            return null;
        }
    }

    try {
        $return['idea'] = getDataFromDatabase($conn, $id, "SELECT ideas.*, accounts.username AS accountName, accounts.id AS accountId, accounts.public AS accountPublic FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;");
        $return['info'] = getDataFromDatabase($conn, $id, "SELECT * FROM additionalinfo WHERE ideaid=?;"); // Return the info with image
        $return['log'] = getDataFromDatabase($conn, $id, "SELECT * FROM authorupdates WHERE ideaid=?;"); // Logs
        $return['comment'] = getDataFromDatabase($conn, $id, "SELECT comments.*, accounts.username, accounts.userimage, accounts.public FROM comments LEFT JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;"); // Comments
        $return['idealabels'] = getDataFromDatabase($conn, $id, "SELECT idealabels.* FROM idealabels WHERE idealabels.ideaid=?;"); // Labels
        $return['accountdata'] = getDataFromDatabaseWithAccountInfo($conn, $id, "SELECT accountideadata.* FROM accountideadata WHERE accountideadata.ideaid=? AND accountideadata.accountid=?;"); // Labels
        $return['followAccountData'] = getDataFromDatabaseWithAccountInfo($conn, $id, "SELECT follow.* FROM follow WHERE follow.followedideaid=? AND follow.followaccountid=?;"); // Follow

        $conn->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
    }

    echo json_encode($return);
    exit;
?>