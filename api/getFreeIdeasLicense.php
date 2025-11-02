<?php
    header('Content-Type: application/json');

    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    session_start();

    $FreeIdeasLicense = null;
    $FreeIdeasLicensePath = "../FreeIdeasLicense.md";
    $title = $author = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $title = getInput($_POST["title"]);
        $author = getInput($_POST["author"]);
    }
    else {
        echo json_encode(['success'=>false, 'error'=>"method_not_post"]);
        exit;
    }

    $replacements = [
        '{AUTHOR}' => $author,
        '{TITLE}' => $title,
        '{YEAR}' => date("Y"),
    ];

    try {
        if (file_exists($FreeIdeasLicensePath)) {
            $FreeIdeasLicense = file_get_contents($FreeIdeasLicensePath);
            $FreeIdeasLicense = str_replace(array_keys($replacements), array_values($replacements), $FreeIdeasLicense);
            $FreeIdeasLicense = base64_encode($FreeIdeasLicense);
            $FreeIdeasLicense = "data:text/markdown;base64," . $FreeIdeasLicense;
        }
        else {
            throw new Exception("FreeIdeasLicense_not_found", 1);
        }
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>strval($th)]);
        exit;
    }

    echo json_encode([$FreeIdeasLicense]);
    exit;

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>