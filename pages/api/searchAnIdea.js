import { query } from '../../lib/db_connection';

function getInput(data) {
    return String(data).trim();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { search, type, creativity, status, order } = req.body;

        if (!search || !type || !creativity || !status || !order) {
            return res.status(400).json({ success: false, error: 'Not given all the required data' });
        }

        const sanitizedSearch = getInput(search);
        const sanitizedType = getInput(type);
        const sanitizedCreativity = getInput(creativity);
        const sanitizedStatus = getInput(status);
        const sanitizedOrder = getInput(order);

        let sql = "";
        let sqlEnd = "";
        let typeOfQuery = "";
        let searchParam = "";

        let result;
        let output = {};

        if (sanitizedSearch != "" && sanitizedType == "" && sanitizedCreativity == "" && sanitizedStatus == "" && sanitizedOrder == "") {
            sql = "SELECT accounts.id, accounts.name, accounts.surname, accounts.username, accounts.userimage FROM accounts WHERE (accounts.username LIKE ? OR accounts.name LIKE ? OR accounts.surname LIKE ?) AND accounts.public=1;";
            typeOfQuery = "account";
            searchParam = "%" + sanitizedSearch + "%";

            result = await query(
                sql,
                [searchParam, searchParam, searchParam]
            );
        }
        else if (!(sanitizedSearch == "" && sanitizedType == "" && sanitizedCreativity == "" && sanitizedStatus == "")) {
            if (sanitizedOrder == "") {
                sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                sqlEnd = ";";
            }
            else {
                if (sanitizedOrder == "Most voted") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, idealabels.likes FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    sqlEnd = " ORDER BY idealabels.likes;";
                }
                else if (sanitizedOrder == "Newest") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    sqlEnd = " ORDER BY ideas.data DESC;";
                }
                else if (sanitizedOrder == "Most discussed") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, COUNT(comments.ideaid) AS comment_num FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id LEFT JOIN comments ON comments.ideaid=ideas.id";
                    sqlEnd = " GROUP BY ideas.id ORDER BY comment_num DESC;";
                }
            }

            let controlFirstTemp = true;
            let params = [];

            if (sanitizedType != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.type=?";
                params.push(sanitizedType);
            }

            if (sanitizedCreativity != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.creativity=?";
                params.push(sanitizedCreativity);
            }

            if (sanitizedStatus != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.status=?";
                params.push(sanitizedStatus);
            }

            if (sanitizedSearch != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "(accounts.username LIKE ? OR ideas.title LIKE ?)";
                
                params.push("%" + sanitizedSearch + "%");
                params.push("%" + sanitizedSearch + "%");
            }

            sql += sqlEnd;
            
            typeOfQuery = "ideas";

            result = await query(
                sql,
                params
            );
        }
        else {
            if (sanitizedOrder == "") {
                sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id;";
            }
            else {
                if (sanitizedOrder == "Most voted") {
                    sql = "SELECT accounts.username, recentIdeas.*, idealabels.likes FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id JOIN idealabels ON idealabels.ideaid=recentIdeas.id ORDER BY idealabels.likes;";
                }
                else if (sanitizedOrder == "Newest") {
                    sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage, data FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id ORDER BY recentIdeas.data DESC;";
                }
                else if (sanitizedOrder == "Most discussed") {
                    sql = "SELECT accounts.username, recentIdeas.*, COUNT(comments.ideaid) AS comment_num FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id LEFT JOIN comments ON comments.ideaid=recentIdeas.id GROUP BY recentIdeas.id ORDER BY comment_num DESC;";
                }
            }

            typeOfQuery = "void";

            result = await query(
                sql,
                []
            );
        }

        if (result) {
            output = {data: result, type: typeOfQuery, format: "mono"};

            if (sanitizedSearch != "" && sanitizedType == "" && sanitizedCreativity == "" && sanitizedStatus == "" && sanitizedOrder == "") {
                sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.title LIKE ?;";
                typeOfQuery = "ideas";

                searchParam = "%" + sanitizedSearch + "%";

                result = await query(
                    sql,
                    [searchParam]
                );

                if (result) {
                    output = {data: {data: output.data, type: output.type}, subdata: {data: result, type: typeOfQuery}, format: "double"};
                }
            }
        }
        else {
            return res.status(400).json({ success: false, error: 'Error getting ideas and accounts' });
        }

        return res.status(200).json({ success: true, data: output });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}