import { query } from '../../lib/db_connection';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/session';
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

export default async function handler(req, res) {
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
            return res.status(400).json({ success: false, error: 'Not all the required fields are filled.' });
        }

        // Check if the email exists
        const accountCheck = await query(
            'SELECT id FROM accounts WHERE email=?;',
            [email]
        );

        if (accountCheck.length > 0) {
            return res.status(401).json({ success: false, error: 'Already exist an account with the same email.' });
        }

        // Check if the username exists
        const accountCheck2 = await query(
            'SELECT id FROM accounts WHERE username=?;',
            [username]
        );

        if (accountCheck2.length > 0) {
            return res.status(401).json({ success: false, error: 'Already exist an account with the same username.' });
        }

        // The 6 numbers verification code
        let emailVerificationCode = String(Math.floor(Math.random() * 10))+String(Math.floor(Math.random() * 10))+String(Math.floor(Math.random() * 10))+String(Math.floor(Math.random() * 10))+String(Math.floor(Math.random() * 10))+String(Math.floor(Math.random() * 10));
        
        // EMAIL
        let to = email;
        let subject = "FreeIdeas - Certify your email address";
        let message = `
        <!DOCTYPE html>
        <html lang="en-US">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Certify your email address FreeIdeas</title>
            </head>

            <body style="
                margin:0;
                padding:0;
                background-color:#f6ffd7;
            ">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f6ffd7;">
                    <tr>
                        <td align="center" style="padding:20px 10px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="
                                max-width:600px;
                                font-family: Arial, sans-serif;
                                text-align:center;
                            ">
                                <tr>
                                    <td style="padding:10px 0;">
                                        <h1 style="margin:0; font-size:24px;">Certify the email address of your new FreeIdeas account</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <h2 style="margin:0; font-size:18px;">Hello ${username}</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0; font-size:14px;">
                                        This email was automatically sent to complete the creation of your account.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0; font-size:14px;">
                                        <strong>If you did not request to create a new account with this email address, please report this immediately.</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;">
                                        <h2 style="margin:0; font-size:18px;">This is the code to complete the account creation:</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:4px 0 14px 0;">
                                        <a style="
                                            display:inline-block;
                                            text-decoration:none;
                                            background-color:#a2f16e;
                                            border:1px solid #2c3d27;
                                            border-radius:5px;
                                            color:#000000;
                                            padding:9px 16px;
                                            font-size:14px;
                                        ">${emailVerificationCode}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;">
                                        <table role="presentation" cellpadding="0" cellspacing="0" width="50%" style="max-width:340px;">
                                            <tr>
                                                <td style="text-align:center; padding:6px 0;">
                                                    <a href="https://www.freeideas.pro">
                                                    <img src="https://www.freeideas.pro/images/FreeIdeas.svg" alt="FreeIdeas logo" style="
                                                        display:block;
                                                        width:100%;
                                                        max-width:240px;
                                                        height:auto;
                                                        margin:0 auto;
                                                        border:0;
                                                    " /></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:center; padding:6px 0;">
                                                    <h1 style="margin:0; font-size:18px; line-height:1.4;">
                                                        A place where <strong>your</strong>
                                                        <span style="color:#ffcf00;">I</span>
                                                        <span style="color:#f4d54b;">d</span>
                                                        <span style="color:#e4c53d;">e</span>
                                                        <span style="color:#c0a634;">a</span>
                                                        <span style="color:#a28710;">s</span>
                                                        can be
                                                        <span style="color:#59ff97;">F</span>
                                                        <span style="color:#47dc55;">r</span>
                                                        <span style="color:#05a814;">e</span>
                                                        <span style="color:#106d19;">e</span>
                                                    </h1>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:center; padding:6px 0; font-family:cursive;">
                                                    The FreeIdeas team.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="text-align:left; padding:6px 0; font-size:10px;">
                                                    <ul style="margin:0; padding:0; list-style-type:none;">
                                                        <li style="margin:0 0 6px 0;">For generic comunications: <a href="mailto:freeideas@freeideas.pro">freeideas@freeideas.pro</a></li>
                                                        <li style="margin:0 0 6px 0;">For technical support: <a href="mailto:customer_service@freeideas.pro">customer_service@freeideas.pro</a></li>
                                                        <li style="margin:0;">For the site administrator: <a href="mailto:administrator@freeideas.pro">administrator@freeideas.pro</a></li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
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

        // Save session
        const session = await getIronSession(req, res, sessionOptions);

        session.otp = {
            email: email,
            code: emailVerificationCode
        };

        await session.save();
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}