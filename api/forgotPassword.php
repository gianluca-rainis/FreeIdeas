<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $email = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $email = getInput($_POST["email"]);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(null);
            exit;
        }

        $stmt = $conn->prepare("SELECT username FROM accounts WHERE email = ?;");
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        $stmt->close();
        echo json_encode(null);
        $conn->close();

        $to = $email;
        $subject = "Reset password";
        $message = `
        <html>
            <head>
                <title>Reset password FreeIdeas</title>
            </head>

            <body>
                <h1>Hello $result</h1>
                <p>This email was sended because you pressed the "Forgot your password?" button.</p>
                <p><strong>If you haven't asked for reset your password report it immediatly.</strong></p>
                <h2>To reset your password press here:</h2>
                <button>Reset your password</button>
            </body>
        </html>
        `;

        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: <free_ideas@yahoo.com>";

        if (!mail($to,$subject,$message,$headers)) {
            echo json_encode(null);
            exit;
        }

        echo json_encode(['done'=>true]);
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