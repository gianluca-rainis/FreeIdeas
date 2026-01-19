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
        const { ideaId, accountId, feedback } = req.body;
        const session = await getIronSession(req, res, sessionOptions);

        if (!ideaId || !accountId || !feedback) {
            return res.status(400).json({ success: false, error: 'Idea id, account id and feedback required' });
        }

        if (!session || !session.account) {
            return res.status(400).json({ success: false, error: 'Account not logged in' });
        }

        const sanitizedIdeaId = getInput(ideaId);
        const sanitizedAccountId = getInput(accountId);
        const sanitizedFeedback = getInput(feedback);

        // Create the new report
        await query(
            'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
            [session.account.id, sanitizedIdeaId, sanitizedAccountId, sanitizedFeedback]
        );

        // Control if the author have done too much reports on the same thing
        const getReports = await query(
            'SELECT * FROM reports WHERE authorid=? AND ideaid=? AND accountid=?;',
            [session.account.id, sanitizedIdeaId, sanitizedAccountId]
        );

        // If the same author have report the same account/idea more than 5 times, report the author
        if (getReports && getReports.length > 5) {
            await query(
                'INSERT INTO reports (authorid, ideaid, accountid, feedback) VALUES (?, ?, ?, ?);',
                [1, null, session.account.id, "The user have reported too much times the same account/idea. This is an auto-generated report."]
            );
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}