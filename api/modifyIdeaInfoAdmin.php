<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $ideaid = $title = $authorid = $type = $creativity = $status = $saves = $likes = $dislikes = $description = $mainImage = 
    $link = $license = $mainImageConverted = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $ideaid = getInput($_POST["id"]);
        $title = getInput($_POST["title"]);
        $authorid = getInput($_POST["authorid"]);
        $type = getInput($_POST["type"]);
        $creativity = getInput($_POST["creativity"]);
        $status = getInput($_POST["status"]);
        $saves = getInput($_POST["saves"]);
        $likes = getInput($_POST["likes"]);
        $dislikes = getInput($_POST["dislikes"]);
        $description = getInput($_POST["description"]);
        $link = getInput($_POST["link"]);

        try {
            if (isset($_FILES["mainImageFile"]) && $_FILES["mainImageFile"]['error'] === UPLOAD_ERR_OK) {
                $mainImage = $_FILES["mainImageFile"];

                $mainImageConverted = getConvertedImage($mainImage);

                if (!$mainImageConverted) {
                    throw new Exception("MAIN_IMAGE_NULL", 1);
                }
            }
            else {
                $mainImage = $_POST["mainImageData"];
                $mainImageConverted = $mainImage;
            }

            if (isset($_FILES["license"]) && $_FILES["license"]['error'] === UPLOAD_ERR_OK) {
                $license = $_FILES["license"];

                $license = getConvertedPdf($license);

                if (!$license) {
                    throw new Exception("LICENSE_CONVERSION_ERROR", 1);
                }
            }
            else {
                $license = $_POST["licenseData"]==="null"?null:$_POST["licenseData"];
            }
        } catch (\Throwable $th) {
            echo json_encode(['success'=>false, 'error'=>strval($th)]);
            exit;
        }
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    try {
        // Send idea data
        $stmt = $conn->prepare("UPDATE ideas SET title=?, ideaimage=?, description=?, downloadlink=?, license=?, authorid=? WHERE id=?;");
        $stmt->bind_param("sssssii", $title, $mainImageConverted, $description, $link, $license, $authorid, $ideaid);
        
        $stmt->execute();
        $stmt->close();

        // Send idealabels
        $stmt = $conn->prepare("UPDATE idealabels SET type=?, creativity=?, status=?, saves=?, likes=?, dislike=? WHERE ideaid=?;");
        $stmt->bind_param("sssiiii", $type, $creativity, $status, $saves, $likes, $dislikes, $ideaid);
        
        $stmt->execute();
        $stmt->close();

        // Send notification to followers
        $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=? OR followedideaid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $stmt->bind_param("ii", $authorid, $ideaid);

        $stmt->execute();
        $result = $stmt->get_result();

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
                $titleNot = "The administrator has updated " . $title . "!";
                $description = "The administrator of FreeIdeas has updated " . $title . ". You can see the change in the idea's page!";

                $stmt->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);

                $stmt->execute();
                $stmt->close();
            }
        }
        
        $stmt->close();

        $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $zero = 0; // Not read for default
        $today = date("Y-m-d");
        $titleNot = "The administrator has updated " . $title . "!";
        $description = "The administrator of FreeIdeas has updated " . $title . ". You can see the change in the idea's page!";

        $stmt->bind_param("isssi", $authorid, $titleNot, $description, $today, $zero);

        $stmt->execute();

        $stmt->close();
        $conn->close();

        echo json_encode(['success'=>true]);
        exit;
    } catch (\Throwable $th) {
        echo json_encode(['success'=>false, 'error'=>strval($th)]);
        exit;
    }

    function getInput($data) {
        if (!is_array($data)) {
            $data = trim($data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
        }

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