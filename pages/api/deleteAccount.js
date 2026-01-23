import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';

function getInput(data) {
    return String(data).trim();
}

// Delete all the comments from the deeper
async function deleteAllIdsSubComments(id) {
    try {
        const comments = await query(
            "SELECT id FROM comments WHERE superCommentid=?;",
            [id]
        );

        // Delete all the subcomments
        comments.forEach(comment => {
            deleteAllIdsSubComments(comment.id);
        });

        // This is the deeper comment
        // Delete the subcomment
        await query(
            "DELETE FROM comments WHERE id=?;",
            [id]
        );
    } catch (error) {
        console.error(error);
    }

    return;
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        const sanitizedId = getInput(id);

        if (!req.session || ((!req.session.account || req.session.account.id != sanitizedId) && !req.session.administrator)) {
            return res.status(400).json({ success: false, error: 'User not authorized' });
        }

        // Get the username
        const accountUsername = await query(
            "SELECT username FROM accounts WHERE id=?;",
            [sanitizedId]
        );

        // Get the followers
        const followers = await query(
            "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
            [sanitizedId]
        );

        followers.forEach(async follower => {
            const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();
            let titleNot = "";
            let description = "";

            if (req.session.administrator) {
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
        });

        // Delete followers
        await query(
            "DELETE FROM follow WHERE followaccountid=? OR followedaccountid=?;",
            [sanitizedId, sanitizedId]
        );

        // Account idea data clear
        await query(
            "DELETE FROM accountideadata WHERE accountid=?;",
            [sanitizedId]
        );

        // Reports clear
        await query(
            "DELETE FROM reports WHERE accountid=? OR authorid=?;",
            [sanitizedId, sanitizedId]
        );

        // Notifications clear
        await query(
            "DELETE FROM notifications WHERE accountid=?;",
            [sanitizedId]
        );

        // Get ideas id
        const ideasId = await query(
            "SELECT id FROM ideas WHERE authorid=?;",
            [sanitizedId]
        );

        ideasId.forEach(async idea => {
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

            rootComments.forEach(rootComment => {
                deleteAllIdsSubComments(rootComment.id);
            });

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
        });

        // Comments clear
        const comments = await query(
            "SELECT id FROM comments WHERE authorid=?;",
            [sanitizedId]
        );

        comments.forEach(async comment => {
            const commentId = comment.id;

            deleteAllIdsSubComments(commentId);
        });

        // Account clear
        await query(
            "DELETE FROM accounts WHERE id=?;",
            [sanitizedId]
        );

        if (req.session && req.session.account) {
            req.session.destroy();
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}