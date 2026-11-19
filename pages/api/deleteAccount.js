import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import bcrypt from 'bcrypt';
import { isPositiveIntegerId } from '../../lib/security';

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

// Delete all the comments from the deeper
async function deleteAllIdsSubComments(id) {
    const comments = await query(
        "SELECT id FROM comments WHERE superCommentid=?;",
        [id]
    );

    for (const comment of comments) {
        await deleteAllIdsSubComments(comment.id);
    }

    await query(
        "DELETE FROM comments WHERE id=?;",
        [id]
    );
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        if (!session.account && !session.administrator) {
            return res.status(401).json({ success: false, error: 'User not authorized' });
        }

        const requestedId = getInput(fields.id?.[0]) || '';
        const id = session.administrator ? requestedId : String(session.account?.id || '');
        const currentPassword = fields.currentPassword?.[0] || '';

        if (!isPositiveIntegerId(id)) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        if (!session || ((!session.account || session.account.id != id) && !session.administrator)) {
            return res.status(400).json({ success: false, error: 'User not authorized' });
        }

        const account = await query(
            "SELECT id, username, password FROM accounts WHERE id=?;",
            [id]
        );

        if (account.length === 0) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        if (!session.administrator
            && (!currentPassword || !(await bcrypt.compare(currentPassword, account[0].password)))) {
            return res.status(401).json({ success: false, error: 'Current password is required' });
        }

        // Get the username
        const accountUsername = account[0].username;

        // Get the followers
        const followers = await query(
            "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
            [id]
        );

        for (const follower of followers) {
            const today = formatDate(new Date());
            let titleNot = "";
            let description = "";

            if (session.administrator) {
                titleNot = accountUsername + "'s account has been deleted by the administrator.";
                description = "We are sorry to inform you that " + accountUsername + "'s account has beed deleted by the FreeIdeas administrator, due to a violation of our Terms and Conditions. You see this notification because you were following it. You will no longer receive notifications about activity on this account.";
            }
            else {
                titleNot = accountUsername + " has deleted his account.";
                description = "We are sorry to inform you that " + accountUsername + " has deleted his account. You see this notification because you were following it. You will no longer receive notifications about activity on this account.";
            }

            await query(
                "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                [follower.followaccountid, titleNot, description, today, 0]
            );
        }

        // Delete followers
        await query(
            "DELETE FROM follow WHERE followaccountid=? OR followedaccountid=?;",
            [id, id]
        );

        // Account idea data clear
        await query(
            "DELETE FROM accountideadata WHERE accountid=?;",
            [id]
        );

        // Reports clear
        await query(
            "DELETE FROM reports WHERE accountid=? OR authorid=?;",
            [id, id]
        );

        // Notifications clear
        await query(
            "DELETE FROM notifications WHERE accountid=?;",
            [id]
        );

        // Get ideas id
        const ideasId = await query(
            "SELECT id FROM ideas WHERE authorid=?;",
            [id]
        );

        for (const idea of ideasId) {
            const ideaId = idea.id;

            // Idea labels clear
            await query(
                "DELETE FROM idealabels WHERE ideaid=?;",
                [ideaId]
            );

            // Reports clear
            await query(
                "DELETE FROM reports WHERE ideaid=?;",
                [ideaId]
            );

            // Follow clear
            await query(
                "DELETE FROM follow WHERE followedideaid=?;",
                [ideaId]
            );

            // Idea comments clear
            const rootComments = await query(
                "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;",
                [ideaId]
            );

            for (const rootComment of rootComments) {
                await deleteAllIdsSubComments(rootComment.id);
            }

            // Author updates clear
            await query(
                "DELETE FROM authorupdates WHERE ideaid=?;",
                [ideaId]
            );

            // Additional info clear
            await query(
                "DELETE FROM additionalinfo WHERE ideaid=?;",
                [ideaId]
            );

            // Idea clear
            await query(
                "DELETE FROM ideas WHERE id=?;",
                [ideaId]
            );
        }

        // Comments clear
        const comments = await query(
            "SELECT id FROM comments WHERE authorid=?;",
            [id]
        );

        for (const comment of comments) {
            const commentId = comment.id;

            await deleteAllIdsSubComments(commentId);
        }

        // Account clear
        await query(
            "DELETE FROM accounts WHERE id=?;",
            [id]
        );

        if (session && session.account) {
            session.destroy();
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}