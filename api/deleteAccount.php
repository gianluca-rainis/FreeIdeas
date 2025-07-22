<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    session_start();

    $id = "";

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $id = getInput($_POST["id"]);
    }

    try {
        // accountideadata clear
        $sql = "DELETE FROM accountideadata WHERE accountid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"accountideadata_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();

        // accountideadata clear
        $sql = "SELECT id FROM ideas WHERE authorid=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"get_ideas_ids_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        $result = $state->get_result();

        $ideasId = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $ideasId[] = $row['id'];
            }
        }
        
        $state->close();

        for ($i=0; $i < count($ideasId); $i++) { 
            // idealabels clear
            $sql = "DELETE FROM idealabels WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"idealabels_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // comments clear
            // Delete all the comments from the deeper
            function deleteAllIdsSubComments($conn, $id) {
                try {
                    $sql = "SELECT * FROM comments WHERE superCommentid=?;";
                    $state = $conn->prepare($sql);

                    if (!$state) {
                        echo json_encode(["success"=>false, "error"=>"database_connection"]);
                        exit;
                    }

                    $state->bind_param("i", $id);
                    
                    if (!$state->execute()) {
                        echo json_encode(["success"=>false, "error"=>"execution_command_delete_subcomments"]);
                        exit;
                    }

                    $result = $state->get_result();

                    $data = [];

                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }

                    $state->close();

                    // $data contains all the subcomments
                    foreach ($data as $row) {
                        deleteAllIdsSubComments($conn, $row['id']);
                    }

                    // This is the deeper ($id comment)
                    // Delete the subcomment
                    $sql = "DELETE FROM comments WHERE id=?;";
                    $state = $conn->prepare($sql);

                    if (!$state) {
                        echo json_encode(["success"=>false, "error"=>"database_connection"]);
                        exit;
                    }

                    $state->bind_param("i", $id);
                    
                    if (!$state->execute()) {
                        echo json_encode(["success"=>false, "error"=>"execution_command_delete_subcomments"]);
                        exit;
                    }

                    $state->close();
                } catch (\Throwable $th) {
                    global $fatalError;
                    $fatalError = $th;
                }
                
                return;
            }

            deleteAllIdsSubComments($conn, $ideasId[$i]);

            $sql = "SELECT id FROM comments WHERE ideaid=? AND superCommentid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"comments_error"]);
                exit;
            }

            $superCommentid = null;
            $state->bind_param("ii", $ideasId[$i], $superCommentid);

            $state->execute();
            
            $state->close();

            // authorupdates clear
            $sql = "DELETE FROM authorupdates WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"authorupdates_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // additionalinfo clear
            $sql = "DELETE FROM additionalinfo WHERE ideaid=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"additionalinfo_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();

            // ideas clear
            $sql = "DELETE FROM ideas WHERE id=?;";
            $state = $conn->prepare($sql);

            if (!$state) {
                echo json_encode(["success"=>false, "error"=>"ideas_error"]);
                exit;
            }

            $state->bind_param("i", $ideasId[$i]);

            $state->execute();
            
            $state->close();
        }

        // accounts clear
        $sql = "DELETE FROM accounts WHERE id=?;";
        $state = $conn->prepare($sql);

        if (!$state) {
            echo json_encode(["success"=>false, "error"=>"accounts_error"]);
            exit;
        }

        $state->bind_param("i", $id);

        $state->execute();
        
        $state->close();
    } catch (\Throwable $th) {
        echo json_encode(["success"=>false, "error"=>$th->__toString()]);
        exit;
    }

    session_unset();
    session_destroy();

    $conn->close();

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    echo json_encode(["success"=>true]);
    exit;
?>