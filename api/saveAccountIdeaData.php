<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $accountId = $ideaId = $saved = $dislike = $liked = $existRow = "";
    $oldSavedAccountIdeaData = $oldLikedAccountIdeaData = $oldDislikeAccountIdeaData = "0";

    $accountId = $_SESSION['account']['id'];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $ideaId = getInput($_POST["ideaid"]);
        $saved = getInput($_POST["saved"]);
        $dislike = getInput($_POST["dislike"]);
        $liked = getInput($_POST["liked"]);
        $existRow = getInput($_POST["existRowYet"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        if ($existRow == "1") {
            // Get old accountideadata data
            $sql = "SELECT saved, liked, dislike FROM accountideadata WHERE accountid=? AND ideaid=?;";

            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("ii", $accountId, $ideaId);
            
            if (!$stmt->execute()) {
                echo json_encode(["success"=>false, "error"=>"execution_command"]);
                exit;
            }

            $result = $stmt->get_result();

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $oldSavedAccountIdeaData = $data[0]['saved'];
            $oldLikedAccountIdeaData = $data[0]['liked'];
            $oldDislikeAccountIdeaData = $data[0]['dislike'];
            
            $stmt->close();

            $sql = "UPDATE accountideadata SET saved=?, dislike=?, liked=? WHERE accountid=? AND ideaid=?;";
        } else {
            $sql = "INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);";
        }
        
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("iiiii", $saved, $dislike, $liked, $accountId, $ideaId);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }
        
        $stmt->close();

        // Get idealabels data
        $sql = "SELECT saves, likes, dislike FROM idealabels WHERE ideaid=?;";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("i", $ideaId);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $result = $stmt->get_result();

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        $stmt->close();

        $saved = max(0, ((int)$data[0]['saves'] + (int)$saved - (int)$oldSavedAccountIdeaData));
        $liked = max(0, ((int)$data[0]['likes'] + (int)$liked - (int)$oldLikedAccountIdeaData));
        $dislike = max(0, ((int)$data[0]['dislike'] + (int)$dislike - (int)$oldDislikeAccountIdeaData));
        
        // Update idealabels
        $sql = "UPDATE idealabels SET saves=?, likes=?, dislike=? WHERE ideaid=?;";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("iiii", $saved, $liked, $dislike, $ideaId);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }
        
        $stmt->close();
        $conn->close();
        
        echo json_encode(["success"=>true]);
        exit;
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>