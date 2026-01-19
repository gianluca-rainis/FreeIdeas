import { getIronSession } from 'iron-session';
import { query } from '../../lib/db_connection';
import { sessionOptions } from '../../lib/session';

function getInput(data) {
    return String(data).trim();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { search } = req.body;
        const session = await getIronSession(req, res, sessionOptions);
        let data = {};

        if (!session || !session.administrator) {
            return res.status(401).json({ success: false, error: 'Administrator not logged in' });
        }

        const searchParam = "%"+getInput(search)+"%";

        if (search == "") {
            const accounts = await query(
                'SELECT * FROM accounts ORDER BY id DESC;',
                []
            );

            if (accounts) {
                accounts.forEach(account => {
                    data.push(account);
                });
            }
        }
        else {
            const accounts = await query(
                'SELECT * FROM accounts WHERE (accounts.username LIKE ? OR accounts.name LIKE ? OR accounts.surname LIKE ? OR accounts.id LIKE ? OR accounts.email LIKE ?) ORDER BY id DESC;',
                [searchParam, searchParam, searchParam, searchParam, searchParam]
            );

            if (accounts) {
                accounts.forEach(account => {
                    data.push(account);
                });
            }
        }

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: String(error) });
    }
}