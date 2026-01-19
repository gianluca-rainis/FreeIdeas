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
        const { username, password1, password2, password3, password4, password5 } = req.body;

        const session = await getIronSession(req, res, sessionOptions);
        session.destroy();

        if (!username || !password1 || !password2 || !password3 || !password4 || !password5) {
            return res.status(400).json({ success: false, error: 'Username and 5 passwords required' });
        }

        const sanitizedUsername = getInput(username);

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM reservedareaaccounts WHERE username=?;',
            [sanitizedUsername]
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
                session.administrator['id'] = account['id'];
                session.administrator['username'] = account['username'];
                
                foundAccount = true;
            }
        });

        if (!foundAccount) {
            return res.status(401).json({ success: false, error: 'Account not found' });
        }
        
        await session.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}