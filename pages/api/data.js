import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { getIdeaData } from '@/lib/data';
import formidable from 'formidable';

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
        const session = await getIronSession(req, res, sessionOptions);
        const form = formidable();
        const [fields] = await form.parse(req);

        const id = getInput(fields.id?.[0] || '');

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }
        
        const ret = await getIdeaData(id, session);

        return res.status(200).json(ret);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
