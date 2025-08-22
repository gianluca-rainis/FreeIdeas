<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    try {
        $sql = "SELECT * FROM accounts;";

        $stmt = $conn->prepare($sql);
        
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            echo json_encode(['success'=>true, 'data'=>$data]);
        }
        else {
            echo json_encode(['success'=>false, 'error'=>"no_data_found"]);
        }

        $stmt->close();
        $conn->close();
        exit;
    } catch (\Throwable $th) {
        echo json_encode(['success'=>false, 'error'=>strval($th)]);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>