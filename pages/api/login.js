import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
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

        const email = getInput(fields.email?.[0] || '');
        const password = getInput(fields.password?.[0] || '');

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
            return res.status(400).json({ success: false, error: 'Account not found' });
        }

        const account = accounts[0];
        
        // Check the password
        let passwordMatch = false;
        
        const bcrypt = require('bcrypt');

        // Convert $2y$ (PHP) to $2b$ (Node.js bcrypt)
        const hashToCompare = account.password.replace(/^\$2y\$/, '$2b$');
        
        passwordMatch = await bcrypt.compare(password, hashToCompare);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Wrong password' });
        }

        // Load notifications
        const notifications = await query(
            'SELECT * FROM notifications WHERE accountid=?;',
            [account.id]
        );

        // Prepare data
        const image = account.userimage?Buffer.from(account.userimage).toString():null;

        const accountData = {
            id: account.id,
            email: account.email,
            name: account.name,
            surname: account.surname,
            userimage: image,
            description: account.description,
            username: account.username,
            public: account.public,
            notifications: notifications
        };

        // Save session with Redis
        req.session.account = accountData;

        req.session.save((err) => {
            if (err) {
                console.error('Session save error: ', err);
                return res.status(500).json({ success: false, error: 'Session save failed' });
            }

            return res.status(200).json({ success: true, data: accountData });
        });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);