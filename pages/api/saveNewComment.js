import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { allowRequest, getClientIp, isPositiveIntegerId } from '../../lib/security';

export const config = {
    api: {
        bodyParser: false,
    },
};

function getInput(data) {
    return String(data).trim();
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        const description = getInput(fields.description?.[0] || '');
        const ideaId = fields.ideaid?.[0] || '';
        const superCommentId = fields.superCommentid?.[0] ? getInput(fields.superCommentid[0]) : null;

        if (!description || !isPositiveIntegerId(ideaId) || description.length > 5000
            || (superCommentId !== null && !isPositiveIntegerId(superCommentId))) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (!session || (!session.account && !session.administrator)) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        const clientIp = getClientIp(req);

        if (!allowRequest(`comment-ip:${clientIp}`, 30, 60 * 1000)
            || !allowRequest(`comment-account:${session.account?.id || session.administrator.id}`, 10, 60 * 1000)) {
            return res.status(429).json({ success: false, error: 'Too many requests' });
        }

        const idea = await query(
            'SELECT id FROM ideas WHERE id=?;',
            [ideaId]
        );

        if (idea.length === 0) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }

        if (superCommentId !== null) {
            const parentComment = await query(
                'SELECT id FROM comments WHERE id=? AND ideaid=?;',
                [superCommentId, ideaId]
            );

            if (parentComment.length === 0) {
                return res.status(404).json({ success: false, error: 'Parent comment not found' });
            }
        }

        let authorId = null;

        if (session.account) {
            authorId = session.account.id;
        }

        // Create the comment
        const newComment = await query(
            'INSERT INTO comments (authorid, data, description, ideaid, superCommentid) VALUES (?, ?, ?, ?, ?);',
            [authorId, formatDate(new Date()), description, ideaId, superCommentId]
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