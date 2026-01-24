import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';

function getInput(data) {
    return String(data).trim();
}

async function deleteAllIdsSubComments(id) {
    try {
        const result = await query(
            "SELECT id FROM comments WHERE superCommentid=?;",
            [id]
        );

        // Delete all the subcomments
        result.forEach(row => {
            deleteAllIdsSubComments(row.id);
        });

        // This is the deeper (id comment)
        // Delete the subcomment
        await query(
            "DELETE FROM comments WHERE id=?;",
            [id]
        );
    } catch (error) {
        console.error('Error: ', error);
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

        // Check if the ides exists
        const idea = await query(
            'SELECT authorid FROM ideas WHERE id=?;',
            [sanitizedId]
        );

        if (idea.length === 0) {
            return res.status(404).json({ success: false, error: 'Idea not found in the database' });
        }

        if ((!req.session.account || req.session.account.id != ides[0].authorid) && !req.session.administrator) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Delete some data
        {
            const result = await query(
                "DELETE FROM authorupdates WHERE ideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting some data");
            }
        }

        {
            const result = await query(
                "DELETE FROM reports WHERE ideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting some data");
            }
        }

        {
            const result = await query(
                "DELETE FROM additionalinfo WHERE ideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting some data");
            }
        }

        {
            const result = await query(
                "DELETE FROM idealabels WHERE ideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting some data");
            }
        }

        {
            const result = await query(
                "DELETE FROM accountideadata WHERE ideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting some data");
            }
        }

        // Delete comments
        {
            const result = await query(
                "SELECT id FROM comments WHERE ideaid=? AND superCommentid IS NULL;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error getting comments info");
            }
            else {
                result.forEach(row => {
                    deleteAllIdsSubComments(row.id);
                });
            }
        }

        // Prepare the notifications for the followers
        {
            const result = await query(
                "SELECT title, authorid FROM ideas WHERE id=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error getting idea info");
            }
            
            let title = result[0].title;
            let authorid = result[0].authorid;
            const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();

            result = await query(
                "SELECT followaccountid FROM follow WHERE followedaccountid=? OR followedideaid=?;",
                [authorid, sanitizedId]
            );

            if (result) {
                let titleNot = "";
                let description = "";

                if (req.session.administrator) {
                    titleNot = "The administrator has deleted " + title + ".";
                    description = "The administrator of FreeIdeas has deleted " + title + ". You can no longer visit its idea page.";
                }
                else {
                    titleNot = req.session.account.username + " has deleted " + title + ".";
                    description = req.session.account.username + " has deleted " + title + ". You can no longer visit its idea page.";
                }

                result.forEach(async follower => {
                    await query(
                        "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                        [follower.followaccountid, titleNot, description, today, 0]
                    );
                });
            }
        }

        // Delete followers
        {
            const result = await query(
                "DELETE FROM follow WHERE followedideaid=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting followers");
            }
        }

        // Delete the idea
        {
            const result = await query(
                "DELETE FROM ideas WHERE id=?;",
                [sanitizedId]
            );

            if (!result) {
                throw new Error("Error deleting the idea");
            }
        }

        // Create the default notification (to the author)
        {
            let titleNot = "";
            let description = "";

                if (req.session.administrator) {
                    titleNot = "The administrator have deleted one of your ideas!";
                    description = "The administrator have just deleted an idea: " + title + "! If you want more informations about this action, feel free to contact us.";
                }
                else {
                    titleNot = "You have deleted an idea!";
                    description = "You have just deleted an old idea: " + title + "! We're sorry you've decided to remove one of your amazing ideas. If you encountered any issues, feel free to contact us.";
                }

            const result = await query(
                "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                [req.session.account.id, titleNot, description, today, 0]
            );

            if (!result) {
                throw new Error("Error inserting the default notification");
            }
        }

        if (req.session.account && req.session.account.id == authorId) {
            const result = await query(
                "SELECT * FROM notifications WHERE accountid=?;",
                [req.session.account.id]
            );

            req.session.account.notifications = result;
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);