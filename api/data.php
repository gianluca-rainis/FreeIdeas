<?php
    header('Content-Type: application/json');

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        echo json_encode(["success"=>false, "error"=>"cannot_get_id_with_POST"]);
        exit;
    }

    $id = $_POST['id'];

    $return = [];

    function getDataFromDatabase($conn, $id, $query) {
        try {
            $state = $conn->prepare($query);

            if (!$state) {
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
            if (!isset($_SESSION['account']['id'])) {
                return [null];
            } else {
                $accountId = $_SESSION['account']['id'];
            }
            
            $state = $conn->prepare($query);

            if (!$state) {
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
        $return['idea'] = getDataFromDatabase($conn, $id, "SELECT accounts.id AS accountId FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;");
        $return['accountdata'] = getDataFromDatabaseWithAccountInfo($conn, $id, "SELECT accountideadata.* FROM accountideadata WHERE accountideadata.ideaid=? AND accountideadata.accountid=?;"); // Labels
        $return['followAccountData'] = getDataFromDatabaseWithAccountInfo($conn, $id, "SELECT follow.* FROM follow WHERE follow.followedideaid=? AND follow.followaccountid=?;"); // Follow

        $conn->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    echo json_encode($return);
    exit;
?>