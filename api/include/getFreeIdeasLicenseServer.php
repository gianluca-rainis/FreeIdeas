<?php
    include($_SERVER['DOCUMENT_ROOT'] . "/api/include/db_connection.php");

    function getFreeIdeasLicense($title, $author) {
        $FreeIdeasLicense = null;
        $FreeIdeasLicensePath = $_SERVER['DOCUMENT_ROOT'] . "/FreeIdeasLicense.md";

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
            return ['success'=>false, 'error'=>strval($th)];
        }

        return ['success'=>true, 'data'=>$FreeIdeasLicense];
    }
?>