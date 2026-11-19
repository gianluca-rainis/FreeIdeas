import { query } from '@/lib/db_connection';

function getImage(data) {
    return data ? (Buffer.isBuffer(data) ? Buffer.from(data).toString() : data) : null;
}

export async function getIdeaData(id, session) {
    const ret = {};

    ret['idea'] = await query("SELECT ideas.*, accounts.username AS accountName, accounts.id AS accountId, accounts.public AS accountPublic FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;", [id]);
    ret['info'] = await query("SELECT * FROM additionalinfo WHERE ideaid=?;", [id]);
    ret['log'] = await query("SELECT * FROM authorupdates WHERE ideaid=?;", [id]);
    ret['comment'] = await query("SELECT comments.*, accounts.username, accounts.userimage, accounts.public FROM comments LEFT JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;", [id]);
    ret['idealabels'] = await query("SELECT idealabels.* FROM idealabels WHERE idealabels.ideaid=?;", [id]);
    ret['accountdata'] = session.account ? await query("SELECT accountideadata.* FROM accountideadata WHERE accountideadata.ideaid=? AND accountideadata.accountid=?;", [id, session.account.id]) : [];
    ret['followAccountData'] = session.account ? await query("SELECT follow.* FROM follow WHERE follow.followedideaid=? AND follow.followaccountid=?;", [id, session.account.id]) : [];

    ret['comment'].forEach(comment => {
        const image = getImage(comment.userimage);
        comment.userimage = image;

        if (comment.data instanceof Date) {
            const year = comment.data.getFullYear();
            const month = String(comment.data.getMonth() + 1).padStart(2, '0');
            const day = String(comment.data.getDate()).padStart(2, '0');

            comment.data = `${year}-${month}-${day}`;
        }
    });

    ret['log'].forEach(log => {
        if (log.data instanceof Date) {
            const year = log.data.getFullYear();
            const month = String(log.data.getMonth() + 1).padStart(2, '0');
            const day = String(log.data.getDate()).padStart(2, '0');

            log.data = `${year}-${month}-${day}`;
        }
    });

    if (ret['idea'][0]['ideaimage']) {
        ret['idea'][0]['ideaimage'] = getImage(ret['idea'][0]['ideaimage']);
    }

    if (ret['idea'][0]['license']) {
        ret['idea'][0]['license'] = getImage(ret['idea'][0]['license']);
    }

    ret['info'].forEach(info => {
        info.updtimage = getImage(info.updtimage);
    });

    return ret;
}
