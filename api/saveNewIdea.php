<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $title = $author = $data = $description = $mainImage = $type = $creativity = 
    $status = $additionalInfo = $additionalInfoImages = $link = $license = $logs = $mainImageConverted = "";

    $additionalInfoImagesConverted = [];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get data
        $title = getInput($_POST["title"]);
        $author = getInput($_POST["author"]);
        $data = getInput($_POST["data"]);
        $description = getInput($_POST["description"]);
        $link = getInput($_POST["link"]);
        $type = getInput($_POST["type"]);
        $creativity = getInput($_POST["creativity"]);
        $status = getInput($_POST["status"]);
        $additionalInfo = json_decode($_POST["additionalInfo"], true);
        $logs = json_decode($_POST["logs"], true);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }
    
    try {
        if (isset($_FILES["mainImage"]) && $_FILES["mainImage"]['error'] === UPLOAD_ERR_OK) {
            $mainImage = $_FILES["mainImage"];

            $mainImageConverted = getConvertedImage($mainImage);

            if (!$mainImageConverted) {
                throw new Exception("MAIN_IMAGE_NULL", 1);
            }
        }
        else {
            throw new Exception("Error in mainImage", 1);
        }

        if (isset($_FILES['additionalInfoImages']) && count($_FILES["additionalInfoImages"]['name']) > 0) {
            $additionalInfoImages = $_FILES['additionalInfoImages'];

            for ($i=0; $i < count($additionalInfoImages['name']); $i++) {
                $singleImage = [
                    'name' => $additionalInfoImages['name'][$i],
                    'type' => $additionalInfoImages['type'][$i],
                    'tmp_name' => $additionalInfoImages['tmp_name'][$i],
                    'error' => $additionalInfoImages['error'][$i],
                    'size' => $additionalInfoImages['size'][$i],
                ];

                $additionalInfoImagesConverted[] = getConvertedImage($singleImage);

                if (!$additionalInfoImagesConverted[$i]) {
                    throw new Exception("ADDITIONAL_INFO_IMAGE_NULL", 1);
                }

                $additionalInfo['titles'][$i] = getInput($additionalInfo['titles'][$i]);
                $additionalInfo['descriptions'][$i] = getInput($additionalInfo['descriptions'][$i]);
            }
        } else {
            if (count($additionalInfo['titles']) != 0) {
                throw new Exception("Error in additionalInfoImages", 1);
            }
        }

        if (isset($_FILES['license']) && $_FILES['license']['error'] === UPLOAD_ERR_OK) {
            $license = $_FILES['license'];

            $license = getConvertedPdf($license);
        }
        else {
            $license = null;
        }

        // Send idea data
        $stmt = $conn->prepare("INSERT INTO ideas (authorid, title, data, ideaimage, description, downloadlink, license) VALUES (?, ?, ?, ?, ?, ?, ?);");
        $stmt->bind_param("sssssss", $author, $title, $data, $mainImageConverted, $description, $link, $license);
        
        $stmt->execute();

        $ideaId = $stmt->insert_id;

        $stmt->close();

        // Send all additional info data
        if (count($additionalInfo['titles']) != 0 && count($additionalInfo['descriptions']) != 0) {
            for ($i=0; $i < count($additionalInfo['titles']); $i++) { 
                $stmt = $conn->prepare("INSERT INTO additionalinfo (title, updtimage, description, ideaid) VALUES (?, ?, ?, ?);");
                $stmt->bind_param("sssi", $additionalInfo['titles'][$i], $additionalInfoImagesConverted[$i], $additionalInfo['descriptions'][$i], $ideaId);
                
                $stmt->execute();
                $stmt->close();
            }
        }

        // Send all author logs data
        if (count($logs['dates']) != 0 && count($logs['titles']) != 0 && count($logs['descriptions']) != 0) {
            for ($i=0; $i < count($logs['dates']); $i++) { 
                $logs['dates'][$i] = getInput($logs['dates'][$i]);
                $logs['titles'][$i] = getInput($logs['titles'][$i]);
                $logs['descriptions'][$i] = getInput($logs['descriptions'][$i]);
            }
        }

        if (count($logs['dates']) != 0 && count($logs['titles']) != 0 && count($logs['descriptions']) != 0) {
            for ($i=0; $i < count($logs['dates']); $i++) { 
                $stmt = $conn->prepare("INSERT INTO authorupdates (title, description, ideaid, data) VALUES (?, ?, ?, ?);");
                $stmt->bind_param("ssis", $logs['titles'][$i], $logs['descriptions'][$i], $ideaId, $logs['dates'][$i]);
                
                $stmt->execute();
                $stmt->close();
            }
        }

        // Send idealabels
        $zero = 0;

        $stmt = $conn->prepare("INSERT INTO idealabels (ideaid, type, creativity, status, saves, likes, dislike) VALUES (?, ?, ?, ?, ?, ?, ?);");
        $stmt->bind_param("isssiii", $ideaId, $type, $creativity, $status, $zero, $zero, $zero);
        
        $stmt->execute();
        $stmt->close();

        // add default notification
        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"connect_to_database"]);
            exit;
        }

        $zero = 0; // Not read for default
        $today = date("Y-m-d");
        $id = $_SESSION['account']['id'];
        $titleNot = "You have published a new idea!";
        $description = "Congratulations on posting a new idea: " . $title . "! We're so glad you feel inspired! We wish your idea the success it deserves.";

        $stmt->bind_param("isssi", $id, $titleNot, $description, $today, $zero);

        $stmt->execute();
        $stmt->close();

        // Send notification to followers
        $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $state->bind_param("i", $_SESSION['account']['id']);

        $state->execute();
        $result = $state->get_result();

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // add default notification
                $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                $stmt = $conn->prepare($sql);

                if (!$stmt) {
                    echo json_encode(["success"=>false, "error"=>"follow_error"]);
                    exit;
                }

                $zero = 0; // Not read for default
                $today = date("Y-m-d");
                $idNot = $row['followaccountid'];
                $titleNot = $_SESSION['account']['username'] . " has published a new idea!";
                $description = $_SESSION['account']['username'] . " has published a new idea! The idea's title is " . $title . ". You can see it in the last ideas, search it or see it from the account page of " . $_SESSION['account']['username'] . "!";

                $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);

                $stmt->execute();
                $stmt->close();
            }
        }
        
        $state->close();

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

        echo json_encode(['success'=>true]);
        exit;
    } catch (\Throwable $th) {
        echo json_encode(['success'=>false, "error"=>strval($th)]);
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

    function getConvertedPdf($pdf) {
        $return = "";

        if ($pdf && file_exists($pdf['tmp_name'])) {
            if ($pdf['type'] === 'application/pdf') {
                $return = 'data:application/pdf;base64,' . base64_encode(file_get_contents($pdf['tmp_name']));
            }
            else {
                $return = null;
            }
        }
        else {
            $return = null;
        }

        return $return;
    }
?>