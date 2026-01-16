import { getIronSession } from "iron-session";
import { sessionOptions } from '../../lib/session';

export default async function handler(req, res) {
    try {
        const session = await getIronSession(req, res, sessionOptions);
        session.destroy();

        return res.status(200).json({});
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}