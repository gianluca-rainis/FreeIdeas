import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { cleanupUploadFiles, convertImageUpload } from '../../lib/uploadValidation';
import bcrypt from 'bcrypt';
import { isPositiveIntegerId, validateEmail, validateUsername } from '../../lib/security';

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

    let uploadedFiles = [];

    try {
        const session = await getSession(req, res);
        
        if (!session || (!session.account && !session.administrator)) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        const [fields, files] = await parseForm(req, { allowFiles: true });
        uploadedFiles = Object.values(files);

        const requestedId = getInput(fields.id?.[0] || '');
        const id = session.administrator ? requestedId : String(session.account.id);
        const firstName = getInput(fields.name?.[0] || '');
        const lastName = getInput(fields.surname?.[0] || '');
        const description = getInput(fields.description?.[0] || '');
        const username = getInput(fields.username?.[0] || '');
        const email = getInput(fields.email?.[0] || '');
        const currentPassword = fields.currentPassword?.[0] || '';
        const publicValue = getInput(fields.public?.[0] || '');
        const isPublic = Number(publicValue);
        let image = null;

        if (!isPositiveIntegerId(id)
            || !validateUsername(username)
            || !validateEmail(email)
            || firstName.length > 50
            || lastName.length > 50
            || description.length > 1000
            || !['0', '1'].includes(publicValue)) {
            return res.status(400).json({ success: false, error: 'Invalid account data' });
        }

        const currentAccount = await query(
            'SELECT id, password, email FROM accounts WHERE id=?;',
            [id]
        );

        if (currentAccount.length === 0) {
            return res.status(404).json({ success: false, error: 'Account not found' });
        }

        const emailChanged = email !== currentAccount[0].email;

        if (!session.administrator && emailChanged) {
            if (!currentPassword || !(await bcrypt.compare(currentPassword, currentAccount[0].password))) {
                return res.status(401).json({ success: false, error: 'Current password is required to change email' });
            }
        }

        const duplicateUsername = await query(
            'SELECT id FROM accounts WHERE username=? AND id<>?;',
            [username, id]
        );
        const duplicateEmail = await query(
            'SELECT id FROM accounts WHERE email=? AND id<>?;',
            [email, id]
        );

        if (duplicateUsername.length > 0 || duplicateEmail.length > 0) {
            return res.status(409).json({ success: false, error: 'Username or email is already in use' });
        }

        if (files.image?.[0]) {
            image = await convertImageUpload(files.image[0]);

            if (!image) {
                return res.status(400).json({ success: false, error: 'Invalid profile image' });
            }
        }

        // Update the data (update image only if given)
        const sessionVersionUpdate = emailChanged ? ', sessionVersion=sessionVersion+1' : '';

        if (image) {
            await query(
                `UPDATE accounts SET name=?, surname=?, username=?, userimage=?, description=?, email=?, public=?${sessionVersionUpdate} WHERE id=?;`,
                [firstName, lastName, username, image, description, email, isPublic, id]
            );
        }
        else {
            await query(
                `UPDATE accounts SET name=?, surname=?, username=?, description=?, email=?, public=?${sessionVersionUpdate} WHERE id=?;`,
                [firstName, lastName, username, description, email, isPublic, id]
            );
        }

        // Add the default notification
        const today = formatDate(new Date());
        
        {
            let titleNot = "";
            let descNot = "";

            if (session.administrator) {
                titleNot = "IMPORTANT: Your account info was updated by the Admin!";
                descNot = "Your account info was updated by the Admin! For more information about this changes contact us.";
            }
            else {
                titleNot = "You have updated your account!";
                descNot = "You have updated your account information! Now is the time to post some new ideas to increase your popularity! If you didn't update your account information, it's possible your account has been compromised. In this case, we recommend changing your password as soon as possible. If you experience any major issues, please contact us immediately.";
            }

            await query(
                "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                [id, titleNot, descNot, today, 0]
            );
        }

        if (isPublic === 1) {
            const followers = await query(
                "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
                [id]
            );

            for (const follower of followers) {
                let titleNot = "";
                let descNot = "";

                if (session.administrator) {
                    titleNot = "The administrator has updated " + username + "'s account information.";
                    descNot = "The administrator has updated " + username + "'s account information. Visit his account page to see the changes!";
                }
                else {
                    titleNot = username + " has updated his account information.";
                    descNot = username + " has updated his account information. Visit his account page to see the changes!";
                }

                await query(
                    "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                    [follower.followaccountid, titleNot, descNot, today, 0]
                );
            }
        }
        else {
            const followers = await query(
                "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
                [id]
            );

            for (const follower of followers) {
                let titleNot = "";
                let descNot = "";

                if (session.administrator) {
                    titleNot = "The administrator has made " + username + "'s account private.";
                    descNot = "The administrator has updated " + username + "'s account information. Now his account is set to private. You can no longer visit his account page and you will no longer receive notifications regarding activity on this account.";
                }
                else {
                    titleNot = username + " has made his account private.";
                    descNot = username + " has updated his account information. Now his account is set to private. You can no longer visit his account page and you will no longer receive notifications regarding activity on this account.";
                }

                await query(
                    "INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);",
                    [follower.followaccountid, titleNot, descNot, today, 0]
                );
            }

            await query(
                "DELETE FROM follow WHERE followedaccountid=?;",
                [id]
            );
        }

        if (session.account) {
            const updatedAccount = await query(
                "SELECT id, username, sessionVersion FROM accounts WHERE id=?;",
                [id]
            );

            if (updatedAccount && updatedAccount[0]) {
                session.account = {
                    id: updatedAccount[0].id,
                    username: updatedAccount[0].username,
                    sessionVersion: Number(updatedAccount[0].sessionVersion || 0)
                };

                await session.save();
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        await cleanupUploadFiles(uploadedFiles).catch(error => {
            console.error('Failed to clean up uploaded files:', error);
        });
    }
}