<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    $search = "";
    $searchParam = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $search = getInput($_POST["search"]);
        $searchParam = "%" . $search . "%";
    } else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        if ($search == "") {
            $sql = "SELECT * FROM notifications ORDER BY id DESC;";
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
        }
        else {
            $sql = "SELECT * FROM notifications WHERE (notifications.title LIKE ? OR notifications.id LIKE ? OR notifications.accountid LIKE ? OR notifications.data LIKE ? OR notifications.description LIKE ?) ORDER BY id DESC;";
            $stmt = $conn->prepare($sql);

            $stmt->bind_param("sssss", $searchParam, $searchParam, $searchParam, $searchParam, $searchParam);
            
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
                echo json_encode(['success'=>true, 'data'=>[]]);
            }

            $stmt->close();
        }
        
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