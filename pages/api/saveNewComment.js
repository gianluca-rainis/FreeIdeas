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
        const { date, description, ideaId, superCommentId } = req.body;
        const session = await getIronSession(req, res, sessionOptions);

        if (!date || !description || !ideaId || !superCommentId) {
            return res.status(400).json({ success: false, error: 'Not filled al the required fields' });
        }

        if (!session || (!session.account && !session.administrator)) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        let authorId = null;

        if (session.account) {
            authorId = session.account.id;
        }

        const sanitizedDate = getInput(date);
        const sanitizedDescription = getInput(description);
        const sanitizedIdeaId = getInput(ideaId);
        const sanitizedSuperCommentId = getInput(superCommentId)==""?null:getInput(superCommentId);

        // Create the comment
        const newComment = await query(
            'INSERT INTO comments (authorid, data, description, ideaid, superCommentid) VALUES (?, ?, ?, ?, ?);',
            [authorId, sanitizedDate, sanitizedDescription, sanitizedIdeaId, sanitizedSuperCommentId]
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