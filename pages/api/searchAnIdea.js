import { query } from '../../lib/db_connection';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getInput(data) {
    return String(data).trim();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const search = getInput(fields.search?.[0] || '');
        const type = getInput(fields.type?.[0] || '');
        const creativity = getInput(fields.creativity?.[0] || '');
        const status = getInput(fields.status?.[0] || '');
        const order = getInput(fields.order?.[0] || '');

        let sql = "";
        let sqlEnd = "";
        let typeOfQuery = "";
        let searchParam = "";

        let result;
        let output = {};

        if (search != "" && type == "" && creativity == "" && status == "" && order == "") {
            sql = "SELECT accounts.id, accounts.name, accounts.surname, accounts.username, accounts.userimage FROM accounts WHERE (accounts.username LIKE ? OR accounts.name LIKE ? OR accounts.surname LIKE ?) AND accounts.public=1;";
            typeOfQuery = "account";
            searchParam = "%" + search + "%";

            result = await query(
                sql,
                [searchParam, searchParam, searchParam]
            );
        }
        else if (!(search == "" && type == "" && creativity == "" && status == "")) {
            if (order == "") {
                sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                sqlEnd = ";";
            }
            else {
                if (order == "Most voted") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, idealabels.likes FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    sqlEnd = " ORDER BY idealabels.likes;";
                }
                else if (order == "Newest") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id";
                    sqlEnd = " ORDER BY ideas.data DESC;";
                }
                else if (order == "Most discussed") {
                    sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username, COUNT(comments.ideaid) AS comment_num FROM ideas JOIN accounts ON accounts.id=ideas.authorid LEFT JOIN idealabels ON idealabels.ideaid=ideas.id LEFT JOIN comments ON comments.ideaid=ideas.id";
                    sqlEnd = " GROUP BY ideas.id ORDER BY comment_num DESC;";
                }
            }

            let controlFirstTemp = true;
            let params = [];

            if (type != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.type=?";
                params.push(type);
            }

            if (creativity != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.creativity=?";
                params.push(creativity);
            }

            if (status != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "idealabels.status=?";
                params.push(status);
            }

            if (search != "") {
                if (controlFirstTemp) {
                    sql += " WHERE ";
                    controlFirstTemp = false;
                }
                else {
                    sql += " AND ";
                }

                sql += "(accounts.username LIKE ? OR ideas.title LIKE ?)";
                
                params.push("%" + search + "%");
                params.push("%" + search + "%");
            }

            sql += sqlEnd;
            
            typeOfQuery = "ideas";

            result = await query(
                sql,
                params
            );
        }
        else {
            if (order == "") {
                sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id;";
            }
            else {
                if (order == "Most voted") {
                    sql = "SELECT accounts.username, recentIdeas.*, idealabels.likes FROM (SELECT id, authorid, title, ideaimage FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id JOIN idealabels ON idealabels.ideaid=recentIdeas.id ORDER BY idealabels.likes;";
                }
                else if (order == "Newest") {
                    sql = "SELECT accounts.username, recentIdeas.* FROM (SELECT id, authorid, title, ideaimage, data FROM ideas ORDER BY id DESC LIMIT 20) AS recentIdeas INNER JOIN accounts ON recentIdeas.authorid=accounts.id ORDER BY recentIdeas.data DESC;";
                }
                else if (order == "Most discussed") {
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

            output.data.forEach(idea => {
                idea.ideaimage = idea.ideaimage?Buffer.from(idea.ideaimage).toString():null;
            });

            output.data.forEach(account => {
                account.userimage = account.userimage?Buffer.from(account.userimage).toString():null;
            });

            if (search != "" && type == "" && creativity == "" && status == "" && order == "") {
                sql = "SELECT ideas.id, ideas.title, ideas.ideaimage, ideas.data, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.title LIKE ?;";
                typeOfQuery = "ideas";

                searchParam = "%" + search + "%";

                result = await query(
                    sql,
                    [searchParam]
                );

                if (result) {
                    result.forEach(idea => {
                        idea.ideaimage = idea.ideaimage?Buffer.from(idea.ideaimage).toString():null;
                    });

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