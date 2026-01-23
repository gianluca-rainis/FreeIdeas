import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { search } = req.body;
        let data = {};

        if (!req.session || !req.session.administrator) {
            return res.status(401).json({ success: false, error: 'Administrator not logged in' });
        }

        const searchParam = "%"+getInput(search)+"%";

        if (search == "") {
            const notifications = await query(
                'SELECT * FROM notifications ORDER BY id DESC;',
                []
            );

            if (notifications) {
                notifications.forEach(notification => {
                    data.push(notification);
                });
            }
        }
        else {
            const notifications = await query(
                'SELECT * FROM notifications WHERE (notifications.title LIKE ? OR notifications.id LIKE ? OR notifications.accountid LIKE ? OR notifications.data LIKE ? OR notifications.description LIKE ?) ORDER BY id DESC;',
                [searchParam, searchParam, searchParam, searchParam, searchParam]
            );

            if (notifications) {
                notifications.forEach(notification => {
                    data.push(notification);
                });
            }
        }

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: String(error) });
    }
}

export default withSession(handler);