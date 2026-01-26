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

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const firstName = getInput(fields.firstName?.[0] || '');
        const lastName = getInput(fields.lastName?.[0] || '');
        const username = getInput(fields.userName?.[0] || '');
        const email = getInput(fields.email?.[0] || '');
        const password = getInput(fields.password?.[0] || '');

        if (!firstName || !lastName || !email || !password || !username) {
            return res.status(400).json({ success: false, error: 'Not all the required fields are filled' });
        }
        
        const bcrypt = require('bcrypt');

        // Check if the account exists
        const accountCheck = await query(
            'SELECT id FROM accounts WHERE email=?;',
            [email]
        );

        if (accountCheck.length > 0) {
            return res.status(401).json({ success: false, error: 'Already exist an account with the same email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the account
        const newAccount = await query(
            'INSERT INTO accounts (email, password, name, surname, username, public) VALUES (?, ?, ?, ?, ?, ?);',
            [email, hashedPassword, firstName, lastName, username, 0]
        );

        if (!newAccount) {
            return res.status(401).json({ success: false, error: 'Error creating the account' });
        }

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM accounts WHERE email=?;',
            [email]
        );

        if (accounts.length === 0) {
            return res.status(401).json({ success: false, error: 'Account not found in database' });
        }

        const account = accounts[0];
        
        // Check the password
        let passwordMatch = false;
        
        passwordMatch = await bcrypt.compare(password, account.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Wrong password' });
        }

        // Load default notification
        const title = "Welcome to FreeIdeas, "+account.username+"!";
        const description = "Welcome to FreeIdeas, "+account.username+"! We're thrilled to welcome you to our community! We hope you enjoy your stay. If you have any questions or concerns, please visit the Contact Us section of this website!";
        const today = formatDate(new Date());
        
        const defaultNotification = await query(
            'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
            [account.id, title, description, today, 0]
        );

        if (!defaultNotification) {
            return res.status(401).json({ success: false, error: 'Error creating the default notification' });
        }

        // Load notifications
        const notifications = await query(
            'SELECT * FROM notifications WHERE accountid=?',
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

        // Save session
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