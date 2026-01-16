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
        const session = await getIronSession(req, res, sessionOptions);
        session.destroy();

        const { firstName, lastName, email, password, username } = req.body;

        if (!firstName || !lastName || !email || !password || !username) {
            return res.status(400).json({ success: false, error: 'Not all the required fields are filled' });
        }

        const sanitizedFirstName = getInput(firstName);
        const sanitizedLastName = getInput(lastName);
        const sanitizedEmail = getInput(email);
        const sanitizedUsername = getInput(username);

        // Check if the account exists
        const accountCheck = await query(
            'SELECT id FROM accounts WHERE email=?;',
            [sanitizedEmail]
        );

        if (accountCheck.length > 0) {
            return res.status(401).json({ success: false, error: 'found_account_in_database' });
        }

        // Create the account
        await query(
            'INSERT INTO accounts (email, password, name, surname, username, public) VALUES (?, ?, ?, ?, ?, ?);',
            [sanitizedEmail, bcrypt.hash(password), sanitizedFirstName, sanitizedLastName, sanitizedUsername, 0]
        );

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

        // Load default notification
        const title = "Welcome to FreeIdeas, "+account.username+"!";
        const description = "Welcome to FreeIdeas, "+account.username+"! We're thrilled to welcome you to our community! We hope you enjoy your stay. If you have any questions or concerns, please visit the Contact Us section of this website!";
        const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();

        await query(
            'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
            [account.id, title, description, today, 0]
        );

        // Load notifications
        const notifications = await query(
            'SELECT * FROM notifications WHERE accountid=?',
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
        session.account = accountData;
        await session.save();

        return res.status(200).json({ success: true, data: accountData });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}