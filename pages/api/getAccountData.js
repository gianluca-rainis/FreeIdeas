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

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const id = getInput(fields.id?.[0]) || '';
        let data = {};

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }

        const account = await query(
            'SELECT * FROM accounts WHERE id=?;',
            [id]
        );

        if (account.length === 0) {
            return res.status(401).json({ success: false, error: 'Account not found in database' });
        }
        
        data['id'] = account[0]['id'];
        data['email'] = account[0]['email'];
        data['name'] = account[0]['name'];
        data['surname'] = account[0]['surname'];
        data['userimage'] = account[0]['userimage'];
        data['description'] = account[0]['description'];
        data['username'] = account[0]['username'];
        data['public'] = account[0]['public'];

        if (data['public'] == 0 && (!req.session.account || req.session.account.id != data.id) && !req.session.administrator) {
            return res.status(401).json({ success: false, error: 'User or administrator not logged in and the account is private' });
        }

        // Get saved ideas
        const savedIdeas = await query(
            'SELECT ideas.id, ideas.title, ideas.ideaimage, accounts.username FROM accountideadata JOIN ideas ON ideas.id=accountideadata.ideaid JOIN accounts ON accounts.id=ideas.authorid WHERE accountideadata.accountid=? AND accountideadata.saved=1;',
            [id]
        );

        data['saved'] = [];
        let indexForSaved = 0;

        savedIdeas.forEach(ideaSaved => {
            data['saved'][indexForSaved] = {};
            data['saved'][indexForSaved]['id'] = ideaSaved['id'];
            data['saved'][indexForSaved]['title'] = ideaSaved['title'];
            data['saved'][indexForSaved]['image'] = ideaSaved['ideaimage'];
            data['saved'][indexForSaved]['username'] = ideaSaved['username'];

            indexForSaved++;
        });

        // Get published ideas
        const publishedIdeas = await query(
            'SELECT ideas.id, ideas.title, ideas.ideaimage, accounts.username FROM ideas JOIN accounts ON accounts.id=ideas.authorid WHERE ideas.authorid=? ORDER BY ideas.data DESC;',
            [id]
        );

        data['published'] = [];
        indexForSaved = 0;

        publishedIdeas.forEach(ideaPublished => {
            data['published'][indexForSaved] = {};
            data['published'][indexForSaved]['id'] = ideaPublished['id'];
            data['published'][indexForSaved]['title'] = ideaPublished['title'];
            data['published'][indexForSaved]['image'] = ideaPublished['ideaimage'];
            data['published'][indexForSaved]['username'] = ideaPublished['username'];

            indexForSaved++;
        });

        // If logged in check follow
        if (req.session.account) {
            const followData = await query(
                'SELECT * FROM follow WHERE follow.followaccountid=? AND follow.followedaccountid=?;',
                [req.session.account.id, id]
            );

            data['followed'] = false;

            if (followData.length != 0) {
                data['followed'] = true;
            }
        }

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: String(error) });
    }
}

export default withSession(handler);