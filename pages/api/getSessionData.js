import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/session';
import { query } from '../../lib/db_connection';
import { withCors } from '../../lib/cors';

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json(null);
    }

    try {
        const { data } = req.query;
        let ret = null;

        if (!data) {
            return res.status(400).json(null);
        }

        const sanitizedData = getInput(data);
        const session = await getIronSession(req, res, sessionOptions);

        if (sanitizedData == "account") {
            if (session.account) {
                const accounts = await query(
                    'SELECT * FROM accounts WHERE id=?;',
                    [session.account.id]
                );

                if (accounts.length === 0) {
                    throw new Error("Account not found");
                }

                const account = accounts[0];

                const image = account.userimage?Buffer.from(account.userimage).toString():null;
                
                const accountNotifications = await query(
                    'SELECT * FROM notifications WHERE accountid=?;',
                    [session.account.id]
                );

                let notif = [];
                
                accountNotifications.forEach(accountNotification => {
                    notif.push(accountNotification);
                });

                ret = {
                    id: session.account.id,
                    email: account.email,
                    name: account.name,
                    surname: account.surname,
                    userimage: image,
                    description: account.description,
                    username: session.account.username,
                    public: account.public,
                    notifications: notif
                };
            }
        }
        else if (sanitizedData == "administrator") {
            if (session.administrator) {
                ret = session.administrator;
            }
        }

        return res.status(200).json(ret);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json(null);
    }
}

export default withCors(handler);