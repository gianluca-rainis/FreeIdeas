import { getIronSession } from 'iron-session';
import { query } from '../../lib/db_connection';
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

async function readFileBuffer(file) {
    const chunks = [];
    
    return new Promise((resolve, reject) => {
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('end', () => resolve(Buffer.concat(chunks)));
        file.on('error', reject);
    });
}

async function getConvertedImage(file) {
    try {
        const mimeType = file.mimetype;

        if (!mimeType) {
            return null;
        }

        const buffer = await readFileBuffer(file);

        return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const session = await getIronSession(req, res, sessionOptions);

        if (!session || (!session.account && !session.administrator)) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        const form = formidable();
        const [fields, files] = await form.parse(req);

        const id = getInput(fields.id?.[0] || session.account.id);
        const firstName = getInput(fields.firstName?.[0] || '');
        const lastName = getInput(fields.lastName?.[0] || '');
        const description = getInput(fields.description?.[0] || '');
        const username = getInput(fields.username?.[0] || '');
        const email = getInput(fields.email?.[0] || session.account.email);
        const ispublic = getInput(fields.public?.[0] || '');
        let image = null;

        if (files.image?.[0]) {
            image = await getConvertedImage(files.image[0]);
        }

        // Update the data (update image only if given)
        if (!image) {
            await query(
                "UPDATE accounts SET name=?, surname=?, username=?, userimage=?, description=?, email=?, public=? WHERE id=?;",
                [firstName, lastName, username, image, description, email, ispublic, id]
            );
        }
        else {
            await query(
                "UPDATE accounts SET name=?, surname=?, username=?, description=?, email=?, public=? WHERE id=?;",
                [firstName, lastName, username, description, email, ispublic, id]
            );
        }

        if (session.account) {
            const accountData = {
                id: id,
                email: email,
                name: firstName,
                surname: lastName,
                userimage: image || null,
                description: description,
                username: username,
                public: ispublic,
                notifications: notifications
            };

            session.account = accountData;
            await session.save();
        }

        // Add the default notification
        const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();
        
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

        if (ispublic == 1) {
            const followers = await query(
                "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
                [id]
            );

            followers.forEach(async follower => {
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
            });
        }
        else {
            const followers = await query(
                "SELECT followaccountid FROM follow WHERE followedaccountid=?;",
                [id]
            );

            followers.forEach(async follower => {
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
            });

            await query(
                "DELETE FROM follow WHERE followedaccountid=?;",
                [id]
            );
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}