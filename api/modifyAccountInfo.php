<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = $_SESSION['account']['id'];

    $firstName = $lastName = $description = $username = $public = "";
    $image = null;
    $error = false;
    $errorLog = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $firstName = getInput($_POST["name"]);
        $lastName = getInput($_POST["surname"]);
        $description = getInput($_POST["description"]);
        $username = getInput($_POST["username"]);
        $public = getInput($_POST["public"]);
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = $_FILES['image'];

        if ($image) {
            $image = getConvertedImage($image);
        }
    }

    if ($image !== null) {
        $sql = "UPDATE accounts SET name=?, surname=?, username=?, userimage=?, description=?, public=? WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"image_database_connection"]);
            exit;
        }

        $userImage = null;
        
        $state->bind_param("sssbsii", $firstName, $lastName, $username, $userImage, $description, $public, $id);

        $state->send_long_data(4, $image);
    }
    else {
        $sql = "UPDATE accounts SET name=?, surname=?, username=?, description=?, public=? WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"database_connection"]);
            exit;
        }

        $state->bind_param("ssssii", $firstName, $lastName, $username, $description, $public, $id);
    }

    if (!$state->execute()) {
        echo json_encode(["success"=>false, "error"=>"execution_command"]);
        exit;
    }

    $state->close();
    $conn->close();

    $_SESSION['account']['id'] = $id;
    $_SESSION['account']['name'] = $firstName;
    $_SESSION['account']['surname'] = $lastName;

    if ($image) {
        $_SESSION['account']['userimage'] = $image;
    }

    $_SESSION['account']['description'] = $description;
    $_SESSION['account']['username'] = $username;
    $_SESSION['account']['public'] = $public;

    echo json_encode(["success"=>true]);

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

    exit;
?>