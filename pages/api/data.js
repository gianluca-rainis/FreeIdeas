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
        let ret = {};

        ret['idea'] = await query("SELECT ideas.*, accounts.username AS accountName, accounts.id AS accountId, accounts.public AS accountPublic FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;", [sanitizedId]);
        ret['info'] = await query("SELECT * FROM additionalinfo WHERE ideaid=?;", [sanitizedId]); // Return the info with image
        ret['log'] = await query("SELECT * FROM authorupdates WHERE ideaid=?;", [sanitizedId]); // Logs
        ret['comment'] = await query("SELECT comments.*, accounts.username, accounts.userimage, accounts.public FROM comments LEFT JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;", [sanitizedId]); // Comments
        ret['idealabels'] = await query("SELECT idealabels.* FROM idealabels WHERE idealabels.ideaid=?;", [sanitizedId]); // Labels
        ret['accountdata'] = session.account?await query("SELECT accountideadata.* FROM accountideadata WHERE accountideadata.ideaid=? AND accountideadata.accountid=?;", [sanitizedId, session.account.id]):[]; // Labels
        ret['followAccountData'] = session.account?await query("SELECT follow.* FROM follow WHERE follow.followedideaid=? AND follow.followaccountid=?;", [sanitizedId, session.account.id]):[]; // Follow

        return res.status(200).json(ret);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}