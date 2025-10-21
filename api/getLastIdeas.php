<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    try {
        $stmt = $conn->prepare("SELECT accounts.username, ideas.id, ideas.title, ideas.ideaimage FROM ideas JOIN accounts ON ideas.authorid=accounts.id ORDER BY ideas.id DESC LIMIT 22;");
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $stmt->close();
            $conn->close();

            echo json_encode(["success"=>true, 'data'=>$data]);
            exit;
        }
        else {
            $stmt->close();
            $conn->close();

            echo json_encode(["success"=>false, 'error'=>"cannot_get_last_ideas"]);
            exit;
        }
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, 'error'=>strval($th)]);
        exit;
    }
?>