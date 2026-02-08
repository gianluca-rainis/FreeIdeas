import { query } from '../../lib/db_connection';
import { withCors } from '../../lib/cors';

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        // Get the random id
        const randomId = await query(
            'SELECT id FROM ideas ORDER BY RAND() LIMIT 1;',
            []
        );

        const data = {};
        data['id'] = randomId[0].id;

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withCors(handler);