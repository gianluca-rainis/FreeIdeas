<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    $username = $password1 = $password2 = $password3 = $password4 = $password5 = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = getInput($_POST["username"]);
        $password1 = getInput($_POST["password1"]);
        $password2 = getInput($_POST["password2"]);
        $password3 = getInput($_POST["password3"]);
        $password4 = getInput($_POST["password4"]);
        $password5 = getInput($_POST["password5"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM reservedareaaccounts WHERE username = ?;");

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $stmt->bind_param("s", $username);
        
        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $result = $stmt->get_result();

        $foundAccount = false;

        while ($row = $result->fetch_assoc()) {
            if (password_verify($password1, $row['password1']) && password_verify($password2, $row['password2']) && password_verify($password3, $row['password3']) && password_verify($password4, $row['password4']) && password_verify($password5, $row['password5'])) {
                $_SESSION['administrator']['id'] = $row['id'];
                $_SESSION['administrator']['username'] = $row['username'];
                
                $foundAccount = true;
                break;
            }
        }

        $stmt->close();

        if (!$foundAccount) {
            $conn->close();

            echo json_encode(["success"=>false, "error"=>"account_not_found"]);
            exit;
        }
        
        $conn->close();

        echo json_encode(["success"=>true]);
        exit;
    } catch (\Throwable $th) {
        $conn->close();
        
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);

        return $data;
    }
?>