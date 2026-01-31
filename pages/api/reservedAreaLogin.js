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
        const form = formidable();
        const [fields] = await form.parse(req);

        const username = getInput(fields.username?.[0]) || '';
        const password1 = fields.password1?.[0] || '';
        const password2 = fields.password2?.[0] || '';
        const password3 = fields.password3?.[0] || '';
        const password4 = fields.password4?.[0] || '';
        const password5 = fields.password5?.[0] || '';

        if (!username || !password1 || !password2 || !password3 || !password4 || !password5) {
            return res.status(400).json({ success: false, error: 'Username and 5 passwords required' });
        }

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM reservedareaaccounts WHERE username=?;',
            [username]
        );

        if (accounts.length === 0) {
            return res.status(400).json({ success: false, error: 'Account not found in database' });
        }

        const bcrypt = require('bcrypt');
        let foundAccount = false;
        let adminData = null;

        await Promise.all(accounts.map(async account => {
            // Convert $2y$ (PHP) to $2b$ (Node.js bcrypt)
            let passwordMatch1 = await bcrypt.compare(password1, account.password1.replace(/^\$2y\$/, '$2b$'));
            let passwordMatch2 = await bcrypt.compare(password2, account.password2.replace(/^\$2y\$/, '$2b$'));
            let passwordMatch3 = await bcrypt.compare(password3, account.password3.replace(/^\$2y\$/, '$2b$'));
            let passwordMatch4 = await bcrypt.compare(password4, account.password4.replace(/^\$2y\$/, '$2b$'));
            let passwordMatch5 = await bcrypt.compare(password5, account.password5.replace(/^\$2y\$/, '$2b$'));

            if (passwordMatch1 && passwordMatch2 && passwordMatch3 && passwordMatch4 && passwordMatch5) {
                adminData = {
                    id: account.id,
                    username: account.username
                };

                foundAccount = true;
            }
        }));

        if (!foundAccount) {
            return res.status(401).json({ success: false, error: 'Wrong passwords' });
        }

        const session = await getIronSession(req, res, sessionOptions);
        
        session.administrator = adminData;

        await session.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}