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

        const ideaid = fields.ideaid?.[0];
        const saved = fields.saved?.[0];
        const dislike = fields.dislike?.[0];
        const liked = fields.liked?.[0];
        const existRowYet = fields.existRowYet?.[0];

        if (!ideaid || !saved || !dislike || !liked || !existRowYet) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (!session || !session.account) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        let oldSaved = 0;
        let oldDislike = 0;
        let oldLiked = 0;

        let sql = "";

        if (existRowYet == "1") {
            const oldAccountIdeaData = await query(
                'SELECT saved, liked, dislike FROM accountideadata WHERE accountid=? AND ideaid=?;',
                [session.account.id, ideaid]
            );

            oldSaved = parseInt(oldAccountIdeaData[0].saved, 10) || 0;
            oldDislike = parseInt(oldAccountIdeaData[0].dislike, 10) || 0;
            oldLiked = parseInt(oldAccountIdeaData[0].liked, 10) || 0;

            sql = "UPDATE accountideadata SET saved=?, dislike=?, liked=? WHERE accountid=? AND ideaid=?;";
        }
        else {
            sql = "INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);";
        }

        await query(
            sql,
            [saved, dislike, liked, session.account.id, ideaid]
        );

        const getIdeaLabels = await query(
            'SELECT saves, likes, dislike FROM idealabels WHERE ideaid=?;',
            [ideaid]
        );
        
        const currentSaves = parseInt(getIdeaLabels[0].saves, 10) || 0;
        const currentLikes = parseInt(getIdeaLabels[0].likes, 10) || 0;
        const currentDislikes = parseInt(getIdeaLabels[0].dislike, 10) || 0;
        const nextSaved = parseInt(saved, 10) || 0;
        const nextLiked = parseInt(liked, 10) || 0;
        const nextDisliked = parseInt(dislike, 10) || 0;

        let secondSaved = Math.max(0, currentSaves + nextSaved - oldSaved);
        let secondLiked = Math.max(0, currentLikes + nextLiked - oldLiked);
        let secondDislike = Math.max(0, currentDislikes + nextDisliked - oldDislike);

        await query(
            "UPDATE idealabels SET saves=?, likes=?, dislike=? WHERE ideaid=?;",
            [secondSaved, secondLiked, secondDislike, ideaid]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}