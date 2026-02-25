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
    if (Array.isArray(data)) {
        return String(data[0] ?? '').trim();
    }

    if (data === undefined || data === null) {
        return;
    }

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

        const ideaid = getInput(fields.ideaid);
        const saved = getInput(fields.saved);
        const dislike = getInput(fields.dislike);
        const liked = getInput(fields.liked);
        const existRowYet = getInput(fields.existRowYet);

        if (!ideaid || saved === '' || dislike === '' || liked === '' || existRowYet === '') {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (!['0', '1'].includes(saved) || !['0', '1'].includes(dislike) || !['0', '1'].includes(liked) || !['0', '1'].includes(existRowYet)) {
            return res.status(400).json({ success: false, error: 'Invalid input values' });
        }

        if (!session || !session.account) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        let oldSaved = 0;
        let oldDislike = 0;
        let oldLiked = 0;

        let sql = "";

        if (existRowYet === "1") {
            const oldAccountIdeaData = await query(
                'SELECT saved, liked, dislike FROM accountideadata WHERE accountid=? AND ideaid=?;',
                [session.account.id, ideaid]
            );

            if (oldAccountIdeaData.length > 0) {
                oldSaved = parseInt(oldAccountIdeaData[0].saved, 10) || 0;
                oldDislike = parseInt(oldAccountIdeaData[0].dislike, 10) || 0;
                oldLiked = parseInt(oldAccountIdeaData[0].liked, 10) || 0;
                sql = "UPDATE accountideadata SET saved=?, dislike=?, liked=? WHERE accountid=? AND ideaid=?;";
            }
            else {
                sql = "INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);";
            }
        }
        else {
            sql = "INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);";
        }

        await query(
            sql,
            [saved, dislike, liked, session.account.id, ideaid]
        );

        const nextSaved = parseInt(saved, 10) || 0;
        const nextLiked = parseInt(liked, 10) || 0;
        const nextDisliked = parseInt(dislike, 10) || 0;
        const savesDelta = nextSaved - oldSaved;
        const likesDelta = nextLiked - oldLiked;
        const dislikeDelta = nextDisliked - oldDislike;

        const updateResult = await query(
            "UPDATE idealabels SET saves=GREATEST(0, saves + ?), likes=GREATEST(0, likes + ?), dislike=GREATEST(0, dislike + ?) WHERE ideaid=?;",
            [savesDelta, likesDelta, dislikeDelta, ideaid]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Idea labels not found' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}