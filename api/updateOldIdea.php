<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $ideaid = $title = $author = $data = $description = $mainImage = $type = $creativity = 
    $status = $additionalInfo = $additionalInfoImages = $link = $logs = $mainImageConverted = "";

    $additionalInfoImagesConverted = [];

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        try {
            // Get data ideaid
            $title = getInput($_POST["title"]);
            $ideaid = getInput($_POST["ideaid"]);
            $author = getInput($_POST["author"]);
            $data = getInput($_POST["data"]);
            $description = getInput($_POST["description"]);
            
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

            $link = getInput($_POST["link"]);

            $type = getInput($_POST["type"]);
            $creativity = getInput($_POST["creativity"]);
            $status = getInput($_POST["status"]);

            $additionalInfo = json_decode($_POST["additionalInfo"], true);

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

            $logs = json_decode($_POST["logs"], true);

            // Send idea data
            $stmt = $conn->prepare("UPDATE ideas SET title=?, data=?, ideaimage=?, description=?, downloadlink=? WHERE id=?;");
            $stmt->bind_param("sssssi", $title, $data, $mainImageConverted, $description, $link, $ideaid);
            
            $stmt->execute();

            $stmt->close();

            // Send all additional info data
            if (count($additionalInfo['titles']) != 0 && count($additionalInfo['descriptions']) != 0) {
                $stmt = $conn->prepare("SELECT id FROM additionalinfo WHERE ideaid=?;");
                $stmt->bind_param("i", $ideaid);
                $stmt->execute();

                $result = $stmt->get_result();

                $idOfAdditionalInfo = [];

                while ($row = $result->fetch_assoc()) {
                    $idOfAdditionalInfo[] = $row['id'];
                }

                $stmt->close();

                if (count($additionalInfo['titles']) != count($idOfAdditionalInfo)) {
                    for ($i=0; $i < count($idOfAdditionalInfo); $i++) { 
                        $stmt = $conn->prepare("DELETE FROM additionalinfo WHERE id=?;");
                        $stmt->bind_param("i", $idOfAdditionalInfo[$i]);
                        $stmt->execute();

                        $stmt->close();
                    }

                    for ($i=0; $i < count($additionalInfo['titles']); $i++) {
                        $stmt = $conn->prepare("INSERT INTO additionalinfo (title, updtimage, description, ideaid) VALUES (?, ?, ?, ?);");
                        $stmt->bind_param("sssi", $additionalInfo['titles'][$i], $additionalInfoImagesConverted[$i], $additionalInfo['descriptions'][$i], $ideaid);
                        $stmt->execute();

                        $stmt->close();
                    }
                } else {
                    for ($i=0; $i < count($additionalInfo['titles']); $i++) {
                        $stmt = $conn->prepare("UPDATE additionalinfo SET title=?, updtimage=?, description=? WHERE id=?;");
                        $stmt->bind_param("sssi", $additionalInfo['titles'][$i], $additionalInfoImagesConverted[$i], $additionalInfo['descriptions'][$i], $idOfAdditionalInfo[$i]);
                        
                        $stmt->execute();

                        $stmt->close();
                    }
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
                $stmt = $conn->prepare("SELECT id FROM authorupdates WHERE ideaid=?;");
                $stmt->bind_param("i", $ideaid);
                $stmt->execute();

                $result = $stmt->get_result();

                $idOfLogs = [];

                while ($row = $result->fetch_assoc()) {
                    $idOfLogs[] = $row['id'];
                }

                $stmt->close();

                if (count($logs['dates']) != count($idOfLogs)) {
                    for ($i=0; $i < count($idOfLogs); $i++) { 
                        $stmt = $conn->prepare("DELETE FROM authorupdates WHERE id=?;");
                        $stmt->bind_param("i", $idOfLogs[$i]);
                        $stmt->execute();

                        $stmt->close();
                    }

                    for ($i=0; $i < count($logs['dates']); $i++) {
                        $stmt = $conn->prepare("INSERT INTO authorupdates (title, description, data, ideaid) VALUES (?, ?, ?, ?);");
                        $stmt->bind_param("sssi", $logs['titles'][$i], $logs['descriptions'][$i], $logs['dates'][$i], $ideaid);
                        $stmt->execute();

                        $stmt->close();
                    }
                } else {
                    for ($i=0; $i < count($logs['dates']); $i++) {
                        $stmt = $conn->prepare("UPDATE authorupdates SET title=?, description=?, data=? WHERE id=?;");
                        $stmt->bind_param("sssi", $logs['titles'][$i], $logs['descriptions'][$i], $logs['dates'][$i], $idOfLogs[$i]);
                        $stmt->execute();

                        $stmt->close();
                    }
                }
            }

            // Send idealabels
            $stmt = $conn->prepare("UPDATE idealabels SET type=?, creativity=?, status=? WHERE ideaid=?;");
            $stmt->bind_param("sssi", $type, $creativity, $status, $ideaid);
            $stmt->execute();

            $stmt->close();

            $conn->close();

            echo json_encode(['success'=>true]);
            exit;
        } catch (\Throwable $th) {
            echo json_encode(['success'=>false, 'error'=>$th->getMessage()]);
            exit;
        }
    }
    else {
        echo json_encode(null);
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

    exit;
?>