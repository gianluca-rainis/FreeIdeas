import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { ideaid, saved, dislike, liked, existRowYet } = req.body;

        if (!ideaid || !saved || !dislike || !liked || !existRowYet) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (!req.session || !req.session.account) {
            return res.status(400).json({ success: false, error: 'User not logged in' });
        }

        const sanitizedIdeaId = getInput(ideaid);
        const sanitizedSaved = getInput(saved);
        const sanitizedDislike = getInput(dislike);
        const sanitizedLiked = getInput(liked);
        const sanitizedExistRowYet = getInput(existRowYet);

        let oldSaved;
        let oldDislike;
        let oldLiked;

        let sql = "";

        if (sanitizedExistRowYet == "1") {
            const oldAccountIdeaData = await query(
                'SELECT saved, liked, dislike FROM accountideadata WHERE accountid=? AND ideaid=?;',
                [req.session.account.id, sanitizedIdeaId]
            );

            oldSaved = oldAccountIdeaData[0].saved;
            oldDislike = oldAccountIdeaData[0].dislike;
            oldLiked = oldAccountIdeaData[0].liked;

            sql = "UPDATE accountideadata SET saved=?, dislike=?, liked=? WHERE accountid=? AND ideaid=?;";
        }
        else {
            sql = "INSERT INTO accountideadata (saved, dislike, liked, accountid, ideaid) VALUES (?, ?, ?, ?, ?);";
        }

        await query(
            sql,
            [sanitizedSaved, sanitizedDislike, sanitizedLiked, req.session.account.id, sanitizedIdeaId]
        );

        const getIdeaLabels = await query(
            'SELECT saves, likes, dislike FROM idealabels WHERE ideaid=?;',
            [sanitizedIdeaId]
        );
        
        let secondSaved = Math.max(0, (parseInt(getIdeaLabels[0].saves) + parseInt(sanitizedSaved) - parseInt(oldSaved)));
        let secondLiked = Math.max(0, (parseInt(getIdeaLabels[0].likes) + parseInt(sanitizedLiked) - parseInt(oldLiked)));
        let secondDislike = Math.max(0, (parseInt(getIdeaLabels[0].dislike) + parseInt(sanitizedDislike) - parseInt(oldDislike)));

        await query(
            "UPDATE idealabels SET saves=?, likes=?, dislike=? WHERE ideaid=?;",
            [secondSaved, secondLiked, secondDislike, sanitizedIdeaId]
        );

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);