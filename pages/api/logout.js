import { withSession } from '../../lib/withSession';

async function handler(req, res) {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Error destroying session' });
            }

            return res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);