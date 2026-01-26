import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const notificationId = getInput(fields.id?.[0] || '');

        if (!notificationId) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        // Check if the notification exists and the user can set it as read
        const notification = await query(
            'SELECT accountid FROM notifications WHERE id=?',
            [notificationId]
        );

        if (notification.length === 0) {
            return res.status(401).json({ success: false, error: 'Notification not found in database' });
        }
        
        if (!req.session.account || req.session.account.id != notification[0].accountid) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Update
        const updateNotification = await query(
            'UPDATE notifications SET status=? WHERE id=?;',
            [1, notificationId]
        );

        if (!updateNotification) {
            return res.status(401).json({ success: false, error: 'Error setting the notification as read' });
        }

        const accountNotifications = await query(
            'SELECT * FROM notifications WHERE accountid=?;',
            [req.session.account.id]
        );

        let notif = [];
        
        accountNotifications.forEach(accountNotification => {
            notif.push(accountNotification);
        });
        
        req.session.account.notifications = notif;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error: ', err);
                return res.status(500).json({ success: false, error: 'Session save failed' });
            }

            return res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);