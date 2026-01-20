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
        const { email } = req.body;
        const session = await getIronSession(req, res, sessionOptions);

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const sanitizedEmail = getInput(email);

        const accountInfo = await query(
            'SELECT username, id FROM accounts WHERE email=?;',
            [sanitizedEmail]
        );

        let username = accountInfo[0].username;
        let idIfNoSession = accountInfo[0].id;
        let tempid;

        if (!session || !session.account) {
            tempid = idIfNoSession;
        }
        else {
            tempid = session.account.id;
        }

        {
            const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();
            
            let titleNot = "You have requested to change your password!";
            let description = "You have requested to change your password. Check your inbox for the password reset email. If you didn't have requested to change your password, it's possible your account has been compromised. In this case, we recommend to contact us immediately.";

            await query(
                'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                [tempid, titleNot, description, today, 0]
            );
        }

        if (session && session.account) {
            const loadNotific = await query(
                'SELECT * FROM notifications WHERE accountid=?;',
                [tempid]
            );

            session.account.notifications = loadNotific;
        }

        // EMAIL
        let to = sanitizedEmail;
        let subject = "Change password FreeIdeas account.";
        let message = `
        <html lang="en-US">
            <head>
                <title>Change password FreeIdeas</title>
            </head>

            <body>
                <h1>Change the password of your FreeIdeas account</h1>
                <h2>Hello ${username}</h2>
                <p>This email was sent automatically because you requested a password change or because you forgot your password.</p>
                <p><strong>If you haven't asked for change your password report it immediatly.</strong></p>
                <h2>To change your password press here:</h2>
                <button>Change your password</button>
                <img src="https://freeideas.duckdns.org/images/FreeIdeas.svg" alt="FreeIdeas logo">
            </body>
        </html>`;

        let nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_NODE_MAILER,
                pass: process.end.PASSWORD_NODE_MAILER
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_NODE_MAILER,
            to: to,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}