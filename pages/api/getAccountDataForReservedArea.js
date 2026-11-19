import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';

export const config = {
    api: {
        bodyParser: false,
    },
};

function getInput(data) {
    return String(data).trim();
}

function getImage(data) {
    return data?(Buffer.isBuffer(data)?Buffer.from(data).toString():data):null;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        const search = fields.search?.[0] || '';
        let data = [];

        if (!session || !session.administrator) {
            return res.status(401).json({ success: false, error: 'Administrator not logged in' });
        }

        const searchParam = "%"+getInput(search)+"%";

        if (search == "") {
            const accounts = await query(
                'SELECT id, email, name, surname, userimage, description, username, public FROM accounts ORDER BY id DESC;',
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
                'SELECT id, email, name, surname, userimage, description, username, public FROM accounts WHERE (accounts.username LIKE ? OR accounts.name LIKE ? OR accounts.surname LIKE ? OR accounts.id LIKE ? OR accounts.email LIKE ?) ORDER BY id DESC;',
                [searchParam, searchParam, searchParam, searchParam, searchParam]
            );

            if (accounts) {
                accounts.forEach(account => {
                    data.push(account);
                });
            }
        }

        for (const account of data) {
            account.userimage = getImage(account.userimage);
        }

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}