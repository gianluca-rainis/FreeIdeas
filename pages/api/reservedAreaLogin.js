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

        const username = getInput(fields.username?.[0]) || '';
        const password1 = fields.password1?.[0] || '';
        const password2 = fields.password2?.[0] || '';
        const password3 = fields.password3?.[0] || '';
        const password4 = fields.password4?.[0] || '';
        const password5 = fields.password5?.[0] || '';

        req.session.destroy();

        if (!username || !password1 || !password2 || !password3 || !password4 || !password5) {
            return res.status(400).json({ success: false, error: 'Username and 5 passwords required' });
        }

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM reservedareaaccounts WHERE username=?;',
            [username]
        );

        if (accounts.length === 0) {
            return res.status(401).json({ success: false, error: 'Account not found in database' });
        }

        const bcrypt = require('bcrypt');
        let foundAccount = false;

        accounts.forEach(async account => {
            let passwordMatch1 = await bcrypt.compare(password1, account.password1);
            let passwordMatch2 = await bcrypt.compare(password2, account.password2);
            let passwordMatch3 = await bcrypt.compare(password3, account.password3);
            let passwordMatch4 = await bcrypt.compare(password4, account.password4);
            let passwordMatch5 = await bcrypt.compare(password5, account.password5);

            if (passwordMatch1 && passwordMatch2 && passwordMatch3 && passwordMatch4 && passwordMatch5) {
                req.session.administrator = req.session.administrator || {};
                req.session.administrator.id = account.id;
                req.session.administrator.username = account.username;
                foundAccount = true;
            }
        });

        if (!foundAccount) {
            return res.status(401).json({ success: false, error: 'Account not found' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);