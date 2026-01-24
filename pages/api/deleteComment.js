import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
};

function getInput(data) {
    return String(data).trim();
}

// Control if the comment have subcomments
async function controlIfHaveSubcomments(id) {
    let ret = false;

    const result = await query(
        "SELECT * FROM comments WHERE superCommentid=?;",
        [id]
    );

    if (result.length > 0) {
        ret = true;
    }

    return ret;
}

// Get the superCommentid
async function getSuperCommentid(id) {
    let ret = null;

    const superComment = await query(
        "SELECT superCommentid FROM comments WHERE id=?;",
        [id]
    );

    if (superComment && superComment.length > 0) {
        ret = superComment[0].superCommentid;
    }

    return ret;
}

// Get the authorid of the comment
async function getAuthorId(id) {
    let ret = null;

    const authorId = await query(
        "SELECT authorid FROM comments WHERE id=?;",
        [id]
    );

    if (authorId && authorId.length > 0) {
        ret = authorId[0].authorid;
    }

    return ret;
}

// Delete the comment and all the supercomments without comment
async function deleteCommentAndSuperCommentsWithoutSubComments(id) {
    let superCommentId = getSuperCommentid(id);
    let authorId = getAuthorId(superCommentId);

    await query(
        "DELETE FROM comments WHERE id=?;",
        [id]
    );

    if (superCommentId !== null && !controlIfHaveSubcomments(superCommentId) && authorId === null) {
        deleteCommentAndSuperCommentsWithoutSubComments(superCommentId);
    }
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const id = getInput(fields.id?.[0]) || '';

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        // Check if the user is authorized
        const authorId = await query(
            'SELECT authorid FROM comments WHERE id=?;',
            [id]
        );

        if (authorId.length === 0) {
            return res.status(401).json({ success: false, error: 'Comment not found in the database' });
        }

        if (!req.session.account || (req.session.account.id != authorId[0].authorid && !req.session.administrator)) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        if (!controlIfHaveSubcomments(id)) {
            deleteCommentAndSuperCommentsWithoutSubComments(id);
        }
        else {
            let description = "";

            if (req.session.administrator) {
                description = "This comment was deleted by the administrator.";
            }
            else {
                description = "This comment was deleted by the author.";
            }

            await query(
                "UPDATE comments SET authorid=?, description=? WHERE id=?;",
                [null, description, id]
            );
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);