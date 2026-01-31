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

        const date = fields.data?.[0] || '';
        const description = fields.description?.[0] || '';
        const ideaId = fields.ideaid?.[0] || '';
        const superCommentId = fields.superCommentid?.[0] || null;

        if (!date || !description || !ideaId) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (!session || (!session.account && !session.administrator)) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        let authorId = null;

        if (session.account) {
            authorId = session.account.id;
        }

        // Create the comment
        const newComment = await query(
            'INSERT INTO comments (authorid, data, description, ideaid, superCommentid) VALUES (?, ?, ?, ?, ?);',
            [authorId, date, description, ideaId, superCommentId]
        );

        if (!newComment) {
            return res.status(401).json({ success: false, error: 'Error creating the new comment' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}