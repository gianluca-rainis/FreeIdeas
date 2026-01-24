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
        const { title, accountId, date, description, status } = req.body;

        if (!title || !accountId || !date || !description || !status) {
            return res.status(400).json({ success: false, error: 'Not filled al the required fields' });
        }

        if (!req.session || !req.session.administrator) {
            return res.status(400).json({ success: false, error: 'Administrator not logged in' });
        }

        const sanitizedTitle = getInput(title);
        const sanitizedAccountId = getInput(accountId);
        const sanitizedDate = getInput(date);
        const sanitizedDescription = getInput(description);
        const sanitizedStatus = getInput(status);

        // Create the notification
        const createNotif = await query(
            'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
            [sanitizedAccountId, sanitizedTitle, sanitizedDescription, sanitizedDate, sanitizedStatus]
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

export default withSession(handler);