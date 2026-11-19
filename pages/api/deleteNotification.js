import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';

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
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        const id = getInput(fields.id?.[0] || '');

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        // Check if the notification exists
        const notification = await query(
            'SELECT accountid FROM notifications WHERE id=?;',
            [id]
        );

        if (notification.length === 0) {
            return res.status(401).json({ success: false, error: 'Notification not found in the database' });
        }

        if (!session.account || session.account.id != notification[0].accountid) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Delete
        const deleteNotification = await query(
            'DELETE FROM notifications WHERE id=?;',
            [id]
        );

        if (!deleteNotification) {
            return res.status(401).json({ success: false, error: 'Error deleting notification' });
        }

        await session.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}