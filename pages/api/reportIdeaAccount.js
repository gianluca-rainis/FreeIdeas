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

        const ideaId = getInput(fields.ideaid?.[0]) || null;
        const accountId = getInput(fields.accountid?.[0]) || null;
        const feedback = getInput(fields.feedback?.[0]) || '';

        if ((!ideaId && !accountId) || !feedback) {
            return res.status(400).json({ success: false, error: 'Idea id, account id and feedback required' });
        }

        if (!req.session || !req.session.account) {
            return res.status(400).json({ success: false, error: 'Account not logged in' });
        }

        // Create the new report
        const newReport = await query(
            'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
            [req.session.account.id, ideaId, accountId, feedback]
        );

        if (!newReport) {
            return res.status(401).json({ success: false, error: 'Error creating the new report' });
        }

        // Control if the author have done too much reports on the same thing
        const getReports = await query(
            'SELECT * FROM reports WHERE authorid=? AND ideaid=? AND accountid=?;',
            [req.session.account.id, ideaId, accountId]
        );

        // If the same author have report the same account/idea more than 5 times, report the author
        if (getReports && getReports.length > 5) {
            const authorReport = await query(
                'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
                [1, null, req.session.account.id, "The user have reported too much times the same account/idea. This is an auto-generated report."]
            );

            if (!authorReport) {
                return res.status(401).json({ success: false, error: 'Error creating author report' });
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);