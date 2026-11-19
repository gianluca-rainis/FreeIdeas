import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { timingSafeEqual } from 'node:crypto';
import { validateEmail, validatePassword, validateUsername } from '../../lib/security';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getInput(data) {
    return String(data).trim();
}

function getImage(data) {
    return data?(Buffer.isBuffer(data)?Buffer.from(data).toString():data):null;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const session = await getSession(req, res);

        const [fields] = await parseForm(req);

        const firstName = getInput(fields.firstName?.[0] || '');
        const lastName = getInput(fields.lastName?.[0] || '');
        const username = getInput(fields.userName?.[0] || '');
        const email = getInput(fields.email?.[0] || '');
        const password = fields.password?.[0] || '';
        const otp = getInput(fields.otp?.[0] || '');

        if (!firstName || !lastName || !email || !password || !username || !otp) {
            return res.status(400).json({ success: false, error: 'Not all the required fields are filled.' });
        }
        
        if (!validateEmail(email) || !validateUsername(username) || !validatePassword(password)
            || firstName.length > 50 || lastName.length > 50) {
            return res.status(400).json({ success: false, error: 'Invalid account data' });
        }

        const bcrypt = require('bcrypt');

        // Check if the account exists
        const accountCheck = await query(
            'SELECT id FROM accounts WHERE email=? or username=?;',
            [email, username]
        );

        if (accountCheck.length > 0) {
            return res.status(401).json({ success: false, error: 'Already exist an account with the same email or the same username.' });
        }
        
        const otpData = session.otp;
        const otpMatches = otpData
            && otpData.email === email
            && otpData.expiresAt > Date.now()
            && otpData.attempts < 5
            && /^\d{6}$/.test(otp)
            && /^\d{6}$/.test(otpData.code)
            && timingSafeEqual(Buffer.from(otp), Buffer.from(otpData.code));

        if (!otpMatches) {
            if (otpData?.email === email) {
                otpData.attempts++;

                if (otpData.attempts >= 5 || otpData.expiresAt <= Date.now()) {
                    session.otp = null;
                }

                await session.save();
            }

            return res.status(401).json({ success: false, error: 'The otp code is wrong. Please retry the create account process.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

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
        const image = getImage(account.userimage);

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
        for (const key of Object.keys(session)) {
            delete session[key];
        }

        session.account = {
            id: accountData.id,
            username: accountData.username,
            sessionVersion: Number(account.sessionVersion || 0)
        };

        await session.save();

        return res.status(200).json({ success: true, data: accountData });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}