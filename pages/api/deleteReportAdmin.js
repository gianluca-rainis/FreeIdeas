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

        if (!session.account || !session.administrator) {
            return res.status(401).json({ success: false, error: 'Administrator not logged in' });
        }

        // Delete report
        const deleteReport = await query(
            'DELETE FROM reports WHERE id=?;',
            [sanitizedId]
        );

        if (!deleteReport) {
            return res.status(401).json({ success: false, error: 'Error deleting the report' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}