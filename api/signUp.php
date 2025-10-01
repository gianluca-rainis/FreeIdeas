<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    // Logout if logged in
    session_start();
    session_unset();
    session_destroy();
    
    session_start();

    $firstName = $lastName = $email = $password = $username = "";
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $firstName = getInput($_POST["firstName"]);
        $lastName = getInput($_POST["lastName"]);
        $email = getInput($_POST["email"]);
        $password = getInput($_POST["password"]);
        $username = getInput($_POST["userName"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success"=>false, "error"=>"non_valid_email"]);
            exit;
        }

        $passwordhash = password_hash($password, PASSWORD_DEFAULT);

        // control if email exist yet
        $stmt = $conn->prepare("SELECT id FROM accounts WHERE email = ?;");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["success"=>false, "error"=>"an_account_with_the_same_email_was_found"]);
            exit;
        }

        $stmt->close();

        // insert values
        $sql = "INSERT INTO accounts (email, password, name, surname, username, public) VALUES (?, ?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"save_account_data"]);
            exit;
        }

        $zero = 0; // Private account for default

        $stmt->bind_param("sssssi", $email, $passwordhash, $firstName, $lastName, $username, $zero);

        $stmt->execute();
        $stmt->close();

        // login
        $stmt = $conn->prepare("SELECT * FROM accounts WHERE email = ?;");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            if (password_verify($password, $row['password'])) {
                $_SESSION['account']['id'] = $row['id'];
                $_SESSION['account']['email'] = $row['email'];
                $_SESSION['account']['name'] = $row['name'];
                $_SESSION['account']['surname'] = $row['surname'];

                if (isset($row['userimage'])) {
                    $row['userimage'] = base64_encode($row['userimage']);
                    $_SESSION['account']['userimage'] = $row['userimage'];
                }
                else {
                    $_SESSION['account']['userimage'] = null;
                }

                $_SESSION['account']['description'] = $row['description'];
                $_SESSION['account']['username'] = $row['username'];
                $_SESSION['account']['public'] = $row['public'];

                $stmt->close();

                // add default notification
                $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                $stmt = $conn->prepare($sql);

                if (!$stmt) {
                    echo json_encode(["success"=>false, "error"=>"create_default_notification"]);
                    exit;
                }

                $zero = 0; // Not read for default
                $today = date("Y-m-d");
                $id = $_SESSION['account']['id'];
                $title = "Welcome to FreeIdeas, " . $_SESSION['account']['username'] . "!";
                $description = "Welcome to FreeIdeas, " . $_SESSION['account']['username'] . "! We're thrilled to welcome you to our community! We hope you enjoy your stay. If you have any questions or concerns, please visit the Contact Us section of this website!";

                $stmt->bind_param("isssi", $id, $title, $description, $today, $zero);

                $stmt->execute();
                $stmt->close();

                /* Notifications loading */
                $stmt = $conn->prepare("SELECT * FROM notifications WHERE accountid = ?;");
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();

                $notifications = [];

                while ($row = $result->fetch_assoc()) {
                    $notifications[] = $row;
                }
                
                $_SESSION['account']['notifications'] = $notifications;

                $stmt->close();
                $conn->close();

                echo json_encode(["success"=>true]);
                exit;
            }
        }

        $stmt->close();
        $conn->close();

        echo json_encode(["success"=>false, "error"=>"generic_error"]);
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