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
        const { id } = req.body;
        const session = await getIronSession(req, res, sessionOptions);

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        const sanitizedId = getInput(id);

        // Check if the notification exists
        const notification = await query(
            'SELECT accountid FROM notifications WHERE id=?',
            [sanitizedId]
        );

        if (notification.length === 0) {
            return res.status(401).json({ success: false, error: 'Notification not found in the database' });
        }

        if (!session.account || session.account.id != notification[0].accoutId) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Delete
        const deleteNotification = await query(
            'DELETE FROM notifications WHERE id=?;',
            [sanitizedId]
        );

        if (!deleteNotification) {
            return res.status(401).json({ success: false, error: 'Error deleting notification' });
        }

        const accountNotifications = await query(
            'SELECT * FROM notifications WHERE accountid=?;',
            [session.account.id]
        );

        let notif = [];
        
        accountNotifications.forEach(accountNotification => {
            notif.push(accountNotification);
        });
        
        session.account.notifications = notif;

        await session.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}