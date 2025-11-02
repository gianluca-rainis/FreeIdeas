<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    $email = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = getInput($_POST["email"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success'=>false, 'error'=>"invalid_email"]);
            exit;
        }

        $stmt = $conn->prepare("SELECT username, id FROM accounts WHERE email = ?;");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        $username = "";
        $idIfNoSession = "";

        if ($row = $result->fetch_assoc()) {
            $username = $row['username'];
            $idIfNoSession = $row['id'];
        }

        if (!$result) {
            echo json_encode(['success'=>false, 'error'=>"get_account_information_from_database"]);
            exit;
        }

        $stmt->close();

        // add default notification
        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(['success'=>false, 'error'=>"add_notification"]);
            exit;
        }

        $zero = 0; // Not read for default
        $today = date("Y-m-d");

        if (!isset($_SESSION['account'])) {
            $id = $idIfNoSession;
        }
        else {
            $id = $_SESSION['account']['id'];
        }
        
        $titleNot = "You have requested to change your password!";
        $description = "You have requested to change your password. Check your inbox for the password reset email. If you didn't have requested to change your password, it's possible your account has been compromised. In this case, we recommend to contact us immediately.";

        $stmt->bind_param("isssi", $id, $titleNot, $description, $today, $zero);

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

        $stmt->close();

        if (isset($_SESSION['account'])) {
            $_SESSION['account']['notifications'] = $notifications;
        }
        
        $conn->close();

        /* SEND MAIL */
        $to = $email;
        $subject = "Change password FreeIdeas account.";
        $message = <<<EOT
        <html lang="en-US">
            <head>
                <title>Change password FreeIdeas</title>
            </head>

            <body>
                <h1>Change the password of your FreeIdeas account</h1>
                <h2>Hello $username</h2>
                <p>This email was sent automatically because you requested a password change or because you forgot your password.</p>
                <p><strong>If you haven't asked for change your password report it immediatly.</strong></p>
                <h2>To change your password press here:</h2>
                <button>Change your password</button>
                <img src="https://freeideas.duckdns.org/images/FreeIdeas.svg" alt="FreeIdeas logo">
            </body>
        </html>
        EOT;

        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: <noreply@freeideas.duckdns.org>";

        if (!mail($to, $subject, $message, $headers)) {
            echo json_encode(['success'=>false, 'error'=>"error_in_send_email"]);
            exit;
        }

        echo json_encode(['success'=>true]);
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