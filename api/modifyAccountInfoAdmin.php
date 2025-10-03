<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    $firstName = $lastName = $description = $username = $public = $email = "";
    $image = null;
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
        $firstName = getInput($_POST["name"]);
        $lastName = getInput($_POST["surname"]);
        $description = getInput($_POST["description"]);
        $username = getInput($_POST["username"]);
        $email = getInput($_POST["email"]);
        $public = getInput($_POST["public"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $image = $_FILES['image'];

            if ($image) {
                $image = getConvertedImage($image);
            }
        }

        if ($image !== null) {
            $sql = "UPDATE accounts SET name=?, surname=?, username=?, userimage=?, description=?, email=?, public=? WHERE id=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"image_database_connection"]);
                exit;
            }
            
            $stmt->bind_param("ssssssii", $firstName, $lastName, $username, $image, $description, $email, $public, $id);
        }
        else {
            $sql = "UPDATE accounts SET name=?, surname=?, username=?, description=?, email=?, public=? WHERE id=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"database_connection"]);
                exit;
            }

            $stmt->bind_param("sssssii", $firstName, $lastName, $username, $description, $email, $public, $id);
        }

        if (!$stmt->execute()) {
            echo json_encode(["success"=>false, "error"=>"execution_command"]);
            exit;
        }

        $stmt->close();

        // add default notification
        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"insert_notification_default"]);
            exit;
        }

        $zero = 0; // Not read for default
        $today = date("Y-m-d");
        $titleNot = "IMPORTANT: Your account info was updated by the Admin!";
        $description = "Your account info was updated by the Admin! For more information about this changes contact us.";

        $stmt->bind_param("isssi", $id, $titleNot, $description, $today, $zero);

        $stmt->execute();
        $stmt->close();

        if ($public == 1) {
            // get followers id
            $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"get_follow_error"]);
                exit;
            }

            $stmt->bind_param("i", $id);

            $stmt->execute();
            $result = $stmt->get_result();

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    // add default notification
                    $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                    $stmt = $conn->prepare($sql);

                    if (!$stmt) {
                        echo json_encode(["success"=>false, "error"=>"load_default_notification"]);
                        exit;
                    }

                    $zero = 0; // Not read for default
                    $today = date("Y-m-d");
                    $idNot = $row['followaccountid'];
                    $titleNot = $username . " has updated his account information.";
                    $description = $username . " has updated his account information. Visit his account page to see the changes!";

                    $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);

                    $stmt->execute();
                    $stmt->close();
                }
            }
            
            $stmt->close();
        } else {
            // get followers id
            $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"get_follow_error"]);
                exit;
            }

            $stmt->bind_param("i", $id);

            $stmt->execute();
            $result = $stmt->get_result();

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    // add default notification
                    $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                    $stmt = $conn->prepare($sql);

                    if (!$stmt) {
                        echo json_encode(["success"=>false, "error"=>"insert_notification_default"]);
                        exit;
                    }

                    $zero = 0; // Not read for default
                    $today = date("Y-m-d");
                    $idNot = $row['followaccountid'];
                    $titleNot = $username . " has made his account private.";
                    $description = $username . " has updated his account information. Now his account is set to private. You can no longer visit his account page and you will no longer receive notifications regarding activity on this account.";

                    $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);

                    $stmt->execute();
                    $stmt->close();
                }
            }
            
            $stmt->close();

            // delete followers
            $sql = "DELETE FROM follow WHERE followedaccountid=?;";
            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                echo json_encode(["success"=>false, "error"=>"delete_follow_error"]);
                exit;
            }

            $stmt->bind_param("i", $id);

            $stmt->execute();
            $stmt->close();
        }

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

    function getConvertedImage($image) {
        $return = "";

        if ($image && file_exists($image['tmp_name'])) {
            switch (exif_imagetype($image['tmp_name'])) {
                case IMAGETYPE_PNG:
                    $return = 'data:image/png;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;

                case IMAGETYPE_GIF:
                    $return = 'data:image/gif;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;

                case IMAGETYPE_JPEG:
                    $return = 'data:image/jpeg;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;

                case IMAGETYPE_ICO:
                    $return = 'data:image/x-icon;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;

                case IMAGETYPE_WEBP:
                    $return = 'data:image/webp;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;

                case IMAGETYPE_BMP:
                    $return = 'data:image/bmp;base64,' . base64_encode(file_get_contents($image['tmp_name']));
                    break;
                
                default:
                    $return = null;
                    break;
            }
        }
        else {
            $return = null;
        }

        return $return;
    }
?>