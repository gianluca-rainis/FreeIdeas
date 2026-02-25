import { query } from '../../lib/db_connection';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/session';
import formidable from 'formidable';
import bcrypt from 'bcrypt';

export const config = {
    api: {
        bodyParser: false,
    },
};

function getInput(data) {
    if (!data) {
        return data;
    }

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

        const email = getInput(fields.email?.[0]);
        const token = getInput(fields.token?.[0]);
        const password = getInput(fields.password?.[0]);
        const confirmPassword = getInput(fields.confirmPassword?.[0]);

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        if (!token) {
            const accountInfo = await query(
                'SELECT username, id FROM accounts WHERE email=?;',
                [email]
            );

            let username = accountInfo[0].username;
            let idIfNoSession = accountInfo[0].id;
            let tempid;

            let randomToken = Math.random().toString(36).substring(2, 21) + Math.random().toString(36).substring(2, 21);

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
                                            <h1 style="margin:0; font-size:24px;">Change the password of your FreeIdeas account</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0;">
                                            <h2 style="margin:0; font-size:18px;">Hello ${username}</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0; font-size:14px;">
                                            This email was sent automatically because you requested a password change or because you forgot your password.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:8px 0; font-size:14px;">
                                            <strong>If you haven't asked for change your password report it immediatly.</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:12px 0;">
                                            <h2 style="margin:0; font-size:18px;">To change your password press here:</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:4px 0 14px 0;">
                                            <a href="https://www.freeideas.pro/changePassword?email=${email}&token=${randomToken}" style="
                                                display:inline-block;
                                                text-decoration:none;
                                                background-color:#a2f16e;
                                                border:1px solid #2c3d27;
                                                border-radius:5px;
                                                color:#000000;
                                                padding:9px 16px;
                                                font-size:14px;
                                            ">Change your password</a>
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

            session.resetPassword = {
                email: email,
                token: randomToken,
                expires: Date.now() + 3600000 // 1 hour
            }

            await session.save();
        }
        else {
            if (!password || !confirmPassword) {
                return res.status(400).json({ success: false, error: 'Password and confirm password are required' });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({ success: false, error: 'Passwords do not match' });
            }

            const resetData = session?.resetPassword;
            
            if (!resetData) {
                return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
            }

            if (resetData.email !== email) {
                return res.status(400).json({ success: false, error: 'Invalid email for reset token' });
            }

            if (resetData.token !== token) {
                return res.status(400).json({ success: false, error: 'Invalid reset token' });
            }

            if (Date.now() > resetData.expires) {
                session.resetPassword = null;

                await session.save();

                return res.status(400).json({ success: false, error: 'Reset token has expired' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await query(
                'UPDATE accounts SET password=? WHERE email=?;',
                [hashedPassword, email]
            );

            session.resetPassword = null;

            await session.save();
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}