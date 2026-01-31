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

        const ideaId = fields.ideaid?.[0] ? parseInt(getInput(fields.ideaid[0]), 10) : null;
        const accountId = fields.accountid?.[0] ? parseInt(getInput(fields.accountid[0]), 10) : null;
        const feedback = getInput(fields.feedback?.[0]) || '';

        if ((!ideaId && !accountId) || !feedback) {
            return res.status(400).json({ success: false, error: 'Idea id, account id and feedback required' });
        }

        if (!session || !session.account) {
            return res.status(400).json({ success: false, error: 'Account not logged in' });
        }

        // Create the new report
        const newReport = await query(
            'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
            [session.account.id, ideaId, accountId, feedback]
        );

        if (!newReport) {
            return res.status(401).json({ success: false, error: 'Error creating the new report' });
        }

        // Control if the author have done too much reports on the same thing
        const getReports = await query(
            'SELECT * FROM reports WHERE authorid=? AND ideaid=? AND accountid=?;',
            [session.account.id, ideaId, accountId]
        );

        // If the same author have report the same account/idea more than 5 times, report the author
        if (getReports && getReports.length > 5) {
            const authorReport = await query(
                'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
                [1, null, session.account.id, "The user have reported too much times the same account/idea. This is an auto-generated report."]
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