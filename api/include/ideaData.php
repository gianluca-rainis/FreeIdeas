<?php
    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

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

    function ideaData($id) {
        global $conn;

        $return = [];

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
            return null;
        }

        return $return;
    }
?>