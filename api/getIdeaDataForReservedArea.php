<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

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
            $sql = "SELECT * FROM ideas ORDER BY id DESC;";
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
            $sql = "SELECT * FROM ideas WHERE (ideas.title LIKE ? OR ideas.id LIKE ? OR ideas.authorid LIKE ? OR ideas.data LIKE ? OR ideas.description LIKE ? OR ideas.downloadlink LIKE ?) ORDER BY id DESC;";
            $stmt = $conn->prepare($sql);

            $stmt->bind_param("ssssss", $searchParam, $searchParam, $searchParam, $searchParam, $searchParam, $searchParam);
            
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