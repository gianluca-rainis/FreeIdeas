import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getInput(data) {
    return String(data).trim();
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields] = await form.parse(req);

        const id = getInput(fields.id?.[0] || '');

        if (!id) {
            return res.status(400).json({ success: false, error: 'Id required' });
        }
        
        let ret = {};

        ret['idea'] = await query("SELECT ideas.*, accounts.username AS accountName, accounts.id AS accountId, accounts.public AS accountPublic FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;", [id]);
        ret['info'] = await query("SELECT * FROM additionalinfo WHERE ideaid=?;", [id]); // Return the info with image
        ret['log'] = await query("SELECT * FROM authorupdates WHERE ideaid=?;", [id]); // Logs
        ret['comment'] = await query("SELECT comments.*, accounts.username, accounts.userimage, accounts.public FROM comments LEFT JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;", [id]); // Comments
        ret['idealabels'] = await query("SELECT idealabels.* FROM idealabels WHERE idealabels.ideaid=?;", [id]); // Labels
        ret['accountdata'] = req.session.account?await query("SELECT accountideadata.* FROM accountideadata WHERE accountideadata.ideaid=? AND accountideadata.accountid=?;", [id, req.session.account.id]):[]; // Labels
        ret['followAccountData'] = req.session.account?await query("SELECT follow.* FROM follow WHERE follow.followedideaid=? AND follow.followaccountid=?;", [id, req.session.account.id]):[]; // Follow

        ret['comment'].forEach(comment => {
            const image = comment.userimage?Buffer.from(comment.userimage).toString():null;
            comment.userimage = image;
            
            // Convert date to YYYY-MM-DD
            if (comment.data instanceof Date) {
                const year = comment.data.getFullYear();
                const month = String(comment.data.getMonth() + 1).padStart(2, '0');
                const day = String(comment.data.getDate()).padStart(2, '0');

                comment.data = `${year}-${month}-${day}`;
            }
        });

        ret['log'].forEach(log => {
            // Convert date to YYYY-MM-DD
            if (log.data instanceof Date) {
                const year = log.data.getFullYear();
                const month = String(log.data.getMonth() + 1).padStart(2, '0');
                const day = String(log.data.getDate()).padStart(2, '0');

                log.data = `${year}-${month}-${day}`;
            }
        });

        if (ret['idea'][0]['ideaimage']) {
            ret['idea'][0]['ideaimage'] = ret['idea'][0]['ideaimage']?Buffer.from(ret['idea'][0]['ideaimage']).toString():null;
        }

        if (ret['idea'][0]['license']) {
            ret['idea'][0]['license'] = ret['idea'][0]['license']?Buffer.from(ret['idea'][0]['license']).toString():null;
        }

        ret['info'].forEach(info => {
            info.updtimage = info.updtimage?Buffer.from(info.updtimage).toString():null;
        });

        return res.status(200).json(ret);
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);