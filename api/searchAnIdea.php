<?php
    header("Content-Type: application/json");

    include("./db_connection.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $search = getInput($_POST["search"]);
        $type = getInput($_POST["type"]);
        $creativity = getInput($_POST["creativity"]);
        $status = getInput($_POST["status"]);
        $order = getInput($_POST["order"]);
        
        // SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.title LIKE '%$search%';
        // SELECT accounts.id, accounts.name, accounts.surname, accounts.email, accounts.username, accounts.userimage FROM accounts WHERE accounts.username LIKE '%$search%' OR accounts.name LIKE '%$search%' OR accounts.surname LIKE '%$search%' OR accounts.email LIKE '%$search%';
        // SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid JOIN idealabels ON idealabels.ideaid=ideas.id WHERE idealabels.type=$type OR idealabels.creativity=$creativity OR idealabels.status=$status;

        if ($search != "" && $type == "" && $creativity == "" && $status == "" && $order == "") {
            $sql = "SELECT accounts.id, accounts.name, accounts.surname, accounts.email, accounts.username, accounts.userimage FROM accounts WHERE accounts.username LIKE ? OR accounts.name LIKE ? OR accounts.surname LIKE ? OR accounts.email LIKE ?;";
            $typeOfQuery = "account";

            $searchParam = "%" . $search . "%";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ssss", $searchParam, $searchParam, $searchParam, $searchParam);
        } else if (!($search == "" && $type == "" && $creativity == "" && $status == "")) {
            if ($order == "") {
                $sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                $sqlEnd = ";";
            }
            else {
                if ($order == "Most voted") {
                    $sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, idealabels.likes FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    $sqlEnd = " ORDER BY idealabels.likes;";
                }
                else if ($order == "Newest") {
                    $sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    $sqlEnd = " ORDER BY ideas.data DESC;";
                }
                else if ($order == "Most discussed") {
                    $sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, COUNT(comments.ideaid) AS comment_num FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id LEFT JOIN comments ON comments.ideaid=ideas.id";
                    $sqlEnd = " GROUP BY ideas.id ORDER BY comment_num DESC;";
                }
            }

            $controlFirstTemp = true;
            $params = [];

            if ($type != "") {
                if ($controlFirstTemp) {
                    $sql .= " WHERE ";
                    $controlFirstTemp = false;
                }
                else {
                    $sql .= " AND ";
                }

                $sql .= "idealabels.type=?";
                $params[] = $type;
            }

            if ($creativity != "") {
                if ($controlFirstTemp) {
                    $sql .= " WHERE ";
                    $controlFirstTemp = false;
                }
                else {
                    $sql .= " AND ";
                }

                $sql .= "idealabels.creativity=?";
                $params[] = $creativity;
            }

            if ($status != "") {
                if ($controlFirstTemp) {
                    $sql .= " WHERE ";
                    $controlFirstTemp = false;
                }
                else {
                    $sql .= " AND ";
                }

                $sql .= "idealabels.status=?";
                $params[] = $status;
            }

            if ($search != "") {
                if ($controlFirstTemp) {
                    $sql .= " WHERE ";
                    $controlFirstTemp = false;
                }
                else {
                    $sql .= " AND ";
                }

                $sql .= "(accounts.username LIKE ? OR ideas.title LIKE ?)";
                
                $params[] = "%" . $search . "%";
                $params[] = "%" . $search . "%";
            }

            $sql .= $sqlEnd;
            
            $typeOfQuery = "ideas";

            $stmt = $conn->prepare($sql);

            if (count($params) == 1) {
                $stmt->bind_param("s", $params[0]);
            }
            else if (count($params) == 2) {
                $stmt->bind_param("ss", $params[0], $params[1]);
            }
            else if (count($params) == 3) {
                $stmt->bind_param("sss", $params[0], $params[1], $params[2]);
            }
            else if (count($params) == 4) {
                $stmt->bind_param("ssss", $params[0], $params[1], $params[2], $params[3]);
            }
            else if (count($params) == 5) {
                $stmt->bind_param("sssss", $params[0], $params[1], $params[2], $params[3], $params[4]);
            }
        }
        else {
            if ($order == "") {
                $sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id;";
            }
            else {
                if ($order == "Most voted") {
                    $sql = "SELECT accounts.username, recentIdeas.*, idealabels.likes FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id JOIN idealabels ON idealabels.ideaid=recentIdeas.id ORDER BY idealabels.likes;";
                }
                else if ($order == "Newest") {
                    $sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage, data FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id ORDER BY recentIdeas.data DESC;";
                }
                else if ($order == "Most discussed") {
                    $sql = "SELECT accounts.username, recentIdeas.*, COUNT(comments.ideaid) AS comment_num FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id LEFT JOIN comments ON comments.ideaid=recentIdeas.id GROUP BY recentIdeas.id ORDER BY comment_num DESC;";
                }
            }

            $typeOfQuery = "void";

            $stmt = $conn->prepare($sql);
        }
        
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            $output = ["data"=>$data, "type"=>$typeOfQuery, "format"=>"mono"];

            $stmt->close();

            if ($search != "" && $type == "" && $creativity == "" && $status == "" && $order == "") {
                $sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.title LIKE ?;";
                $typeOfQuery = "ideas";

                $searchParam = "%" . $search . "%";

                $stmt = $conn->prepare($sql);
                $stmt->bind_param("s", $searchParam);
                $stmt->execute();
                $result = $stmt->get_result();

                $data = [];

                if ($result) {
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }

                    $output = ["data"=>["data"=>$output['data'], "type"=>$output['type']], "subdata"=>["data"=>$data, "type"=>$typeOfQuery], "format"=>"double"];
                }

                $stmt->close();
            }

            echo json_encode($output);
        }
        else {
            $stmt->close();
            echo json_encode(null);
        }
    }
    else {
        echo json_encode(null);
    }

    $conn->close();

    function getInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }

    exit;
?>