<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);

        $stmt = $conn->prepare("SELECT * FROM accounts WHERE id = ?;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];

        if ($row = $result->fetch_assoc()) {
            $data["id"] = $row['id'];
            $data['email'] = $row['email'];
            $data['name'] = $row['name'];
            $data['surname'] = $row['surname'];
            $data['userimage'] = $row['userimage'];
            $data['description'] = $row['description'];
            $data['username'] = $row['username'];
        }
        else {
            $data = null;
        }

        $stmt->close();

        // Get saved ideas
        $stmt = $conn->prepare("SELECT ideas.id, ideas.title, ideas.ideaimage, accounts.username FROM accountideadata JOIN ideas ON ideas.id=accountideadata.ideaid JOIN accounts ON accounts.id=ideas.authorid WHERE accountideadata.accountid=? AND accountideadata.saved=1;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $data['saved'] = [];
        $indexForSaved = 0;

        while ($row = $result->fetch_assoc()) {
            $data['saved'][$indexForSaved]['id'] = $row['id'];
            $data['saved'][$indexForSaved]['title'] = $row['title'];
            $data['saved'][$indexForSaved]['image'] = $row['ideaimage'];
            $data['saved'][$indexForSaved]['username'] = $row['username'];

            $indexForSaved++;
        }

        $stmt->close();

        // Get published ideas
        $stmt = $conn->prepare("SELECT ideas.id, ideas.title, ideas.ideaimage, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.authorid=? ORDER BY ideas.data DESC;");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $data['published'] = [];
        $indexForSaved = 0;

        while ($row = $result->fetch_assoc()) {
            $data['published'][$indexForSaved]['id'] = $row['id'];
            $data['published'][$indexForSaved]['title'] = $row['title'];
            $data['published'][$indexForSaved]['image'] = $row['ideaimage'];
            $data['published'][$indexForSaved]['username'] = $row['username'];

            $indexForSaved++;
        }

        $stmt->close();

        $conn->close();
        
        echo json_encode($data);
        exit;
    }
    else {
        echo json_encode(null);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>