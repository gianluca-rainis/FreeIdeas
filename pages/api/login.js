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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }

        const sanitizedEmail = getInput(email);

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM accounts WHERE email=?;',
            [sanitizedEmail]
        );

        if (accounts.length === 0) {
            return res.status(401).json({ success: false, error: 'not_found_account_in_database' });
        }

        const account = accounts[0];
        
        // Check the password
        let passwordMatch = false;
        
        const bcrypt = require('bcrypt');
        passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'password_does_not_match' });
        }

        // Load notifications
        const notifications = await query(
            'SELECT * FROM notifications WHERE accountid=?;',
            [account.id]
        );

        // Prepare data
        const accountData = {
            id: account.id,
            email: account.email,
            name: account.name,
            surname: account.surname,
            userimage: account.userimage || null,
            description: account.description,
            username: account.username,
            public: account.public,
            notifications: notifications
        };

        // Save session
        const session = await getIronSession(req, res, sessionOptions);
        session.account = accountData;
        await session.save();

        return res.status(200).json({ success: true, data: accountData });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}