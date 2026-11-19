import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import bcrypt from 'bcrypt';
import { allowRequest, getClientIp, validateEmail } from '../../lib/security';

const dummyPasswordHash = bcrypt.hash('FreeIdeas timing padding only', 12);

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getImage(data) {
    return data?(Buffer.isBuffer(data)?Buffer.from(data).toString():data):null;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const [fields] = await parseForm(req);

        const email = fields.email?.[0] || '';
        const password = fields.password?.[0] || '';

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }

        if (!validateEmail(email)) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const clientIp = getClientIp(req);

        if (!allowRequest(`login-ip:${clientIp}`, 10, 15 * 60 * 1000)
            || !allowRequest(`login-email:${email.toLowerCase()}`, 8, 15 * 60 * 1000)) {
            return res.status(429).json({ success: false, error: 'Too many requests' });
        }

        // Check if the account exists
        const accounts = await query(
            'SELECT * FROM accounts WHERE email=?;',
            [email]
        );

        if (accounts.length === 0) {
            await bcrypt.compare(password, await dummyPasswordHash);
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const account = accounts[0];
        
        // Check the password
        let passwordMatch = false;

        // Convert $2y$ (PHP) to $2b$ (Node.js bcrypt)
        const hashToCompare = account.password.replace(/^\$2y\$/, '$2b$');
        
        passwordMatch = await bcrypt.compare(password, hashToCompare);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Load notifications
        const notifications = await query(
            'SELECT * FROM notifications WHERE accountid=?;',
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
        const session = await getSession(req, res);

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