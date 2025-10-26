<?php
    header("Content-Type: application/json");

    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    session_start();

    $ideaid = $title = $author = $data = $description = $mainImage = $type = $creativity = 
    $status = $additionalInfo = $additionalInfoImages = $link = $license = $logs = $mainImageConverted = "";

    $additionalInfoImagesConverted = [];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $title = getInput($_POST["title"]);
        $ideaid = getInput($_POST["ideaid"]);
        $author = getInput($_POST["author"]);
        $data = getInput($_POST["data"]);
        $description = getInput($_POST["description"]);
        $link = getInput($_POST["link"]);
        $type = getInput($_POST["type"]);
        $creativity = getInput($_POST["creativity"]);
        $status = getInput($_POST["status"]);
        $additionalInfo = json_decode($_POST["additionalInfo"], true);
        $logs = json_decode($_POST["logs"], true);

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
            }
            else {
                $license = null;
            }

            if (count($additionalInfo['titles']) != 0) {
                $iFile = $iData = 0;

                for ($i=0; $i < count($additionalInfo['types']); $i++) { 
                    if ($additionalInfo['types'][$i] == "file") {
                        if (isset($_FILES['additionalInfoImagesFile']) && count($_FILES["additionalInfoImagesFile"]['name']) > 0) {
                            $additionalInfoImages = $_FILES['additionalInfoImagesFile'];

                            $singleImage = [
                                'name' => $additionalInfoImages['name'][$iFile],
                                'type' => $additionalInfoImages['type'][$iFile],
                                'tmp_name' => $additionalInfoImages['tmp_name'][$iFile],
                                'error' => $additionalInfoImages['error'][$iFile],
                                'size' => $additionalInfoImages['size'][$iFile],
                            ];

                            $additionalInfoImagesConverted[] = getConvertedImage($singleImage);

                            $iFile++;
                        }
                    } else {
                        if (isset($_POST["additionalInfoImagesData"])) {
                            $additionalInfoImages = $_POST["additionalInfoImagesData"];

                            $additionalInfoImagesConverted[] = $additionalInfoImages[$iData];
                        }

                        $iData++;
                    }

                    $additionalInfo['titles'][$i] = getInput($additionalInfo['titles'][$i]);
                    $additionalInfo['descriptions'][$i] = getInput($additionalInfo['descriptions'][$i]);
                }
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
        $stmt = $conn->prepare("UPDATE ideas SET title=?, data=?, ideaimage=?, description=?, downloadlink=?, license=? WHERE id=?;");
        $stmt->bind_param("ssssssi", $title, $data, $mainImageConverted, $description, $link, $license, $ideaid);
        
        $stmt->execute();
        $stmt->close();

        // Send all additional info data (delete all the old and send all the new)
        $stmt = $conn->prepare("DELETE FROM additionalinfo WHERE ideaid=?;");
        $stmt->bind_param("i", $ideaid);
        
        $stmt->execute();
        $stmt->close();
        
        for ($i=0; $i < count($additionalInfo['titles']); $i++) {
            $stmt = $conn->prepare("INSERT INTO additionalinfo (title, updtimage, description, ideaid) VALUES (?, ?, ?, ?);");
            $stmt->bind_param("sssi", $additionalInfo['titles'][$i], $additionalInfoImagesConverted[$i], $additionalInfo['descriptions'][$i], $ideaid);
            
            $stmt->execute();
            $stmt->close();
        }

        // Send all author logs data (delete all the old and send all the new)
        $stmt = $conn->prepare("DELETE FROM authorupdates WHERE ideaid=?;");
        $stmt->bind_param("i", $ideaid);
        
        $stmt->execute();
        $stmt->close();
        
        for ($i=0; $i < count($logs['dates']); $i++) {
            $stmt = $conn->prepare("INSERT INTO authorupdates (title, description, data, ideaid) VALUES (?, ?, ?, ?);");
            $stmt->bind_param("sssi", $logs['titles'][$i], $logs['descriptions'][$i], $logs['dates'][$i], $ideaid);
            
            $stmt->execute();
            $stmt->close();
        }

        // Send idealabels
        $stmt = $conn->prepare("UPDATE idealabels SET type=?, creativity=?, status=? WHERE ideaid=?;");
        $stmt->bind_param("sssi", $type, $creativity, $status, $ideaid);
        
        $stmt->execute();
        $stmt->close();

        // Send notification to followers
        $sql = "SELECT followaccountid FROM follow WHERE followedaccountid=? OR followedideaid=?;";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(["success"=>false, "error"=>"follow_error"]);
            exit;
        }

        $stmt->bind_param("ii", $_SESSION['account']['id'], $ideaid);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // add default notification
                $sql = "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);";
                $stmt1 = $conn->prepare($sql);

                if (!$stmt1) {
                    echo json_encode(["success"=>false, "error"=>"follow_error"]);
                    exit;
                }

                $zero = 0; // Not read for default
                $today = date("Y-m-d");
                $idNot = $row['followaccountid'];
                $titleNot = $_SESSION['account']['username'] . " has updated " . $title . "!";
                $description = $_SESSION['account']['username'] . " has updated " . $title . ". You can see the change in the idea's page!";

                $stmt1->bind_param("isssi", $idNot, $titleNot, $description, $today, $zero);

                $stmt1->execute();
                $stmt1->close();
            }
        }
        
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