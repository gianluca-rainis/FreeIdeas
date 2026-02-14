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
        const session = await getIronSession(req, res, sessionOptions);
        
        const form = formidable();
        const [fields] = await form.parse(req);

        const email = getInput(fields.email?.[0]) || '';

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const accountInfo = await query(
            'SELECT username, id FROM accounts WHERE email=?;',
            [email]
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
            const today = formatDate(new Date());
            
            let titleNot = "You have requested to change your password!";
            let description = "You have requested to change your password. Check your inbox for the password reset email. If you didn't have requested to change your password, it's possible your account has been compromised. In this case, we recommend to contact us immediately.";

            await query(
                'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                [tempid, titleNot, description, today, 0]
            );
        }

        // EMAIL
        let to = email;
        let subject = "FreeIdeas - Change the password of your account";
        let message = `
        <!DOCTYPE html>
        <html lang="en-US">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Change password FreeIdeas</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    
                    body {
                        background-color: #f6ffd7;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        font-family: Arial, sans-serif;
                        width: 100%;
                        height: 100%;
                        gap: 20px;
                    }

                    button {
                        cursor: pointer;
                        align-self: center;
                        box-sizing: border-box;
                        background-color: #a2f16e;
                        border: 1px solid #2c3d27;
                        border-radius: 5px;
                        width: 30%;
                        height: 30px;
                        margin-bottom: 10px;
                    }

                    button:hover {
                        background-color: #81d54a
                    }

                    #signature {
                        width: 30%;
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }

                    #signature h1 {
                        font-size: 20px;
                    }

                    #signature p {
                        padding: 10px;
                        font-family: cursive;
                    }

                    #signature ul {
                        gap: 10px;
                        display: flex;
                        flex-direction: column;
                        font-size: 12px;
                        text-align: left;
                        padding: 10px;
                        list-style-type: none;
                    }

                    #signature img {
                        width: 100%
                    }
                </style>
            </head>

            <body>
                <h1>Change the password of your FreeIdeas account</h1>
                <h2>Hello ${username}</h2>
                <p>This email was sent automatically because you requested a password change or because you forgot your password.</p>
                <p><strong>If you haven't asked for change your password report it immediatly.</strong></p>
                <h2>To change your password press here:</h2>
                <button>Change your password</button>

                <div id="signature">
                    <img src="https://www.freeideas.pro/images/FreeIdeas.svg" alt="FreeIdeas logo">
                    <h1>
                        A place where <strong>your</strong>
                        <span style="color: #ffcf00">I</span>
                        <span style="color: #f4d54b">d</span>
                        <span style="color: #e4c53d">e</span>
                        <span style="color: #c0a634">a</span>
                        <span style="color: #a28710">s</span>
                         can be 
                        <span style="color: #59ff97">F</span>
                        <span style="color: #47dc55">r</span>
                        <span style="color: #05a814">e</span>
                        <span style="color: #106d19">e</span>
                    </h1>
                    <p>The FreeIdeas team.</p>
                    <ul>
                        <li>For generic comunications: <a href="mailto:freeideas@freeideas.pro">freeideas@freeideas.pro</a></li>
                        <li>For technical support: <a href="mailto:customer_service@freeideas.pro">customer_service@freeideas.pro</a></li>
                        <li>For the site administrator: <a href="mailto:administrator@freeideas.pro">administrator@freeideas.pro</a></li>
                    </ul>
                </div>
            </body>
        </html>`;

        let nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_NODE_MAILER,
                pass: process.env.PASSWORD_NODE_MAILER
            }
        });

        let mailOptions = {
            from: "freeideas@freeideas.pro",
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