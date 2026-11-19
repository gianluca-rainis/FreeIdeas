import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { allowRequest, getClientIp, isPositiveIntegerId } from '../../lib/security';

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
        const session = await getSession(req, res);
        
        const [fields] = await parseForm(req);

        const rawIdeaId = fields.ideaid?.[0] ? getInput(fields.ideaid[0]) : null;
        const rawAccountId = fields.accountid?.[0] ? getInput(fields.accountid[0]) : null;
        const ideaId = rawIdeaId === null ? null : Number(rawIdeaId);
        const accountId = rawAccountId === null ? null : Number(rawAccountId);
        const feedback = getInput(fields.feedback?.[0]) || '';

        if ((ideaId === null && accountId === null)
            || (ideaId !== null && !isPositiveIntegerId(ideaId))
            || (accountId !== null && !isPositiveIntegerId(accountId))
            || !feedback || feedback.length > 3000) {
            return res.status(400).json({ success: false, error: 'Idea id, account id and feedback required' });
        }

        if (!session || !session.account) {
            return res.status(400).json({ success: false, error: 'Account not logged in' });
        }

        const clientIp = getClientIp(req);

        if (!allowRequest(`report-ip:${clientIp}`, 10, 60 * 60 * 1000)
            || !allowRequest(`report-account:${session.account.id}`, 5, 60 * 60 * 1000)) {
            return res.status(429).json({ success: false, error: 'Too many requests' });
        }

        if (ideaId !== null) {
            const idea = await query('SELECT id FROM ideas WHERE id=?;', [ideaId]);

            if (idea.length === 0) {
                return res.status(404).json({ success: false, error: 'Idea not found' });
            }
        }

        if (accountId !== null) {
            const account = await query('SELECT id FROM accounts WHERE id=?;', [accountId]);

            if (account.length === 0) {
                return res.status(404).json({ success: false, error: 'Account not found' });
            }
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
            'SELECT id FROM reports WHERE authorid=? AND ideaid IS ? AND accountid IS ?;',
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