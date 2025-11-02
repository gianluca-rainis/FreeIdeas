<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    if (!isset($_SESSION['administrator'])) {
        echo json_encode(['success'=>false, 'error'=>"administrator_not_logged_in"]);
        exit;
    }

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
            $sql = "SELECT * FROM reports ORDER BY id DESC;";
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
            $sql = "SELECT * FROM reports WHERE (reports.authorid LIKE ? OR reports.id LIKE ? OR reports.accountid LIKE ? OR reports.ideaid LIKE ? OR reports.feedback LIKE ?) ORDER BY id DESC;";
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