import { query } from '../../lib/db_connection';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/session';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
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
        const session = await getIronSession(req, res, sessionOptions);
        
        const form = formidable();
        const [fields] = await form.parse(req);

        const title = getInput(fields.title?.[0]) || '';
        const accountId = getInput(fields.accountId?.[0]) || '';
        const date = getInput(fields.date?.[0]) || '';
        const description = getInput(fields.description?.[0]) || '';
        const status = getInput(fields.status?.[0]) || '';

        if (!title || !accountId || !date || !description || !status) {
            return res.status(400).json({ success: false, error: 'Not filled al the required fields' });
        }

        if (!session || !session.administrator) {
            return res.status(400).json({ success: false, error: 'Administrator not logged in' });
        }

        // Create the notification
        const createNotif = await query(
            'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
            [accountId, title, description, date, status]
        );

        if (!createNotif) {
            return res.status(401).json({ success: false, error: 'Error creating notification' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}