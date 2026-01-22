import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/session';

function getInput(data) {
    return String(data).trim();
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json(null);
    }

    try {
        const { data } = req.query;
        const session = await getIronSession(req, res, sessionOptions);
        let ret = null;

        if (!data) {
            return res.status(400).json(null);
        }

        const sanitizedData = getInput(data);

        if (sanitizedData == "account") {
            if (session.account) {
                ret = session.account;
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