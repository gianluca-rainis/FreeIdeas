import { withSession } from '../../lib/withSession';

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

        if (sanitizedData == "account") {
            if (req.session.account) {
                ret = req.session.account;
            }
        }
        else if (sanitizedData == "administrator") {
            if (req.session.administrator) {
                ret = req.session.administrator;
            }
        }

        return res.status(200).json(ret);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json(null);
    }
}

export default withSession(handler);