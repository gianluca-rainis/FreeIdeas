<?php
    include($_SERVER['DOCUMENT_ROOT'] . "/api/db_connection.php");

    function getIdeaTitleFromDatabase($id) {
        global $conn;

        $title = "";

        try {
            $stmt = $conn->prepare("SELECT title FROM ideas WHERE id = ?;");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $title = $row['title'];
            }
            else {
                throw new Exception("not_get_a_valid_return", 1);
            }

            $stmt->close();

            return $title;
        } catch (\Throwable $th) {
            return "";
        }
    }
?>