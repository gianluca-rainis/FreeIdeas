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

        const search = fields.search?.[0] || '';
        let data = [];

        if (!req.session || !req.session.administrator) {
            return res.status(401).json({ success: false, error: 'Administrator not logged in' });
        }

        const searchParam = "%"+getInput(search)+"%";

        if (search == "") {
            const ideas = await query(
                'SELECT * FROM ideas ORDER BY id DESC;',
                []
            );

            if (ideas) {
                ideas.forEach(idea => {
                    data.push(idea);
                });
            }
        }
        else {
            const ideas = await query(
                'SELECT * FROM ideas WHERE (ideas.title LIKE ? OR ideas.id LIKE ? OR ideas.authorid LIKE ? OR ideas.data LIKE ? OR ideas.description LIKE ? OR ideas.downloadlink LIKE ?) ORDER BY id DESC;',
                [searchParam, searchParam, searchParam, searchParam, searchParam, searchParam]
            );

            if (ideas) {
                ideas.forEach(idea => {
                    data.push(idea);
                });
            }
        }

        for (const idea of data) {
            idea.ideaimage = idea.ideaimage?Buffer.from(idea.ideaimage).toString():null;
        }

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: String(error) });
    }
}

export default withSession(handler);