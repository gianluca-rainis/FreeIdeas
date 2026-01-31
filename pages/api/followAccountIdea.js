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

        const followedaccountid = fields.followedaccountid?.[0] || '';
        const followedideaid = fields.followedideaid?.[0] || '';
        let data = [];
        let isNowFollowed = false;

        if (!followedaccountid && !followedideaid) {
            return res.status(400).json({ success: false, error: 'Account id or idea id required' });
        }

        const sanitizedFollowedAccountId = followedaccountid?getInput(followedaccountid):null;
        const sanitizedFollowedIdeaId = followedideaid?getInput(followedideaid):null;

        if (!session.account) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        let sql = "";
        let idNotNull = null;

        if (sanitizedFollowedAccountId) {
            sql = "SELECT * FROM follow WHERE followaccountid=? AND followedaccountid=?;";
            idNotNull = sanitizedFollowedAccountId;
        }
        else if (sanitizedFollowedIdeaId) {
            sql = "SELECT * FROM follow WHERE followaccountid=? AND followedideaid=?;";
            idNotNull = sanitizedFollowedIdeaId;
        }

        // Get follows
        const getFollows = await query(
            sql,
            [session.account.id, idNotNull]
        );

        if (getFollows.length != 0) {
            getFollows.forEach(follow => {
                data.push(follow);
            });
        }

        if (data.length == 0) {
            const followNow = await query(
                "INSERT INTO follow (followaccountid, followedaccountid, followedideaid) VALUES (?, ?, ?);",
                [session.account.id, sanitizedFollowedAccountId, sanitizedFollowedIdeaId]
            );

            if (!followNow) {
                return res.status(400).json({ success: false, error: 'Error following the account or idea.' });
            }

            isNowFollowed = true;
        }
        else {
            if (sanitizedFollowedAccountId) {
                sql = "DELETE FROM follow WHERE followaccountid=? AND followedaccountid=?;";
                idNotNull = sanitizedFollowedAccountId;
            }
            else if (sanitizedFollowedIdeaId) {
                sql = "DELETE FROM follow WHERE followaccountid=? AND followedideaid=?;";
                idNotNull = sanitizedFollowedIdeaId;
            }

            const deleteFollows = await query(
                sql,
                [session.account.id, idNotNull]
            );

            if (!deleteFollows) {
                return res.status(400).json({ success: false, error: 'Error unfollowing the account or idea.' });
            }

            isNowFollowed = false;
        }

        return res.status(200).json({ success: true, isNowFollowed: isNowFollowed });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}