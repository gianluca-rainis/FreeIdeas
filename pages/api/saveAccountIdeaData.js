import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { isPositiveIntegerId } from '../../lib/security';

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
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        const ideaid = fields.ideaid?.[0];
        const saved = fields.saved?.[0];
        const dislike = fields.dislike?.[0];
        const liked = fields.liked?.[0];
        if (!isPositiveIntegerId(ideaid) || !['0', '1'].includes(saved)
            || !['0', '1'].includes(dislike) || !['0', '1'].includes(liked)) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (liked === '1' && dislike === '1') {
            return res.status(400).json({ success: false, error: 'An idea cannot be liked and disliked at the same time' });
        }

        if (!session || !session.account) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        const idea = await query(
            'SELECT id FROM ideas WHERE id=?;',
            [ideaid]
        );

        if (idea.length === 0) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }

        const existingRows = await query(
            'SELECT accountid FROM accountideadata WHERE accountid=? AND ideaid=? LIMIT 1;',
            [session.account.id, ideaid]
        );

        if (existingRows.length > 0) {
            await query(
                'UPDATE accountideadata SET saved=?, dislike=?, liked=? WHERE accountid=? AND ideaid=?;',
                [saved, dislike, liked, session.account.id, ideaid]
            );
        }
        else {
            await query(
                'INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);',
                [saved, dislike, liked, session.account.id, ideaid]
            );
        }

        await query(
            `UPDATE idealabels
            SET saves=(SELECT COUNT(DISTINCT accountid) FROM accountideadata WHERE ideaid=? AND saved=1),
                likes=(SELECT COUNT(DISTINCT accountid) FROM accountideadata WHERE ideaid=? AND liked=1),
                dislike=(SELECT COUNT(DISTINCT accountid) FROM accountideadata WHERE ideaid=? AND dislike=1)
            WHERE ideaid=?;`,
            [ideaid, ideaid, ideaid, ideaid]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}