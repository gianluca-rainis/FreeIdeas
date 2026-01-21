import { getIronSession } from 'iron-session';
import { query } from '../../lib/db_connection';
import { sessionOptions } from '../../lib/session';
import formidable from 'formidable';

function getInput(data) {
    return String(data).trim();
}

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

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

async function getConvertedPdf(file) {
    try {
        if (file.mimetype !== 'application/pdf') {
            return null;
        }

        const buffer = await readFileBuffer(file);
        
        return `data:application/pdf;base64,${buffer.toString('base64')}`;
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

        if (!session || !session.account) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Parse form data to handle the files
        const form = formidable();
        const [fields, files] = await form.parse(req);

        const title = getInput(fields.title?.[0] || '');
        const author = getInput(fields.author?.[0] || '');
        const date = getInput(fields.date?.[0] || '');
        const description = getInput(fields.description?.[0] || '');
        const link = getInput(fields.link?.[0] || '');
        const type = getInput(fields.type?.[0] || '');
        const creativity = getInput(fields.creativity?.[0] || '');
        const status = getInput(fields.status?.[0] || '');
        const additionalInfo = fields.additionalInfo?.[0]?JSON.parse(fields.additionalInfo[0]):{ titles: [], descriptions: [] };
        const logs = fields.logs?.[0]?JSON.parse(fields.logs[0]):{ dates: [], titles: [], descriptions: [] };

        if (!title || !author || !date || !description || !type || !creativity || !status) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        // Handle MainImage
        let mainImageConverted = null;

        if (files.mainImage?.[0]) {
            mainImageConverted = await getConvertedImage(files.mainImage[0]);

            if (!mainImageConverted) {
                return res.status(400).json({ success: false, error: 'MAIN_IMAGE_NULL' });
            }
        }
        else {
            return res.status(400).json({ success: false, error: 'Main image is required' });
        }

        // Handle additional info images
        const additionalInfoImagesConverted = [];

        if (files.additionalInfoImages?.length > 0) {
            for (let i = 0; i < files.additionalInfoImages.length; i++) {
                const converted = await getConvertedImage(files.additionalInfoImages[i]);

                if (!converted) {
                    return res.status(400).json({ success: false, error: 'ADDITIONAL_INFO_IMAGE_NULL' });
                }

                additionalInfoImagesConverted.push(converted);
            }
        }
        else if (additionalInfo.titles?.length > 0) {
            return res.status(400).json({ success: false, error: 'Additional images required' });
        }

        // Handle the license
        let licenseConverted = null;

        if (files.license?.[0]) {
            licenseConverted = await getConvertedPdf(files.license[0]);

            if (!licenseConverted) {
                return res.status(400).json({ success: false, error: 'Invalid license PDF' });
            }
        }

        // Save in DB
        const insertIdea = await query(
            'INSERT INTO ideas (authorid, title, data, ideaimage, description, downloadlink, license) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [session.account.id, title, date, mainImageConverted, description, link || null, licenseConverted]
        );

        const ideaId = insertIdea.insertId;

        // Save additionalInfo
        if (additionalInfo.titles?.length > 0) {
            for (let i = 0; i < additionalInfo.titles.length; i++) {
                await query(
                    'INSERT INTO additionalinfo (title, updtimage, description, ideaid) VALUES (?, ?, ?, ?)',
                    [additionalInfo.titles[i], additionalInfoImagesConverted[i], additionalInfo.descriptions[i], ideaId]
                );
            }
        }

        // Save logs
        if (logs.dates?.length > 0) {
            for (let i = 0; i < logs.dates.length; i++) {
                await query(
                    'INSERT INTO authorupdates (title, description, ideaid, data) VALUES (?, ?, ?, ?)',
                    [logs.titles[i], logs.descriptions[i], ideaId, logs.dates[i]]
                );
            }
        }

        // Save idealabels
        await query(
            'INSERT INTO idealabels (ideaid, type, creativity, status, saves, likes, dislike) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ideaId, type, creativity, status, 0, 0, 0]
        );

        // Save default notifications
        const today = new Date().getFullYear()+"-"+(new Date().getMonth()+1)<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1)+"-"+new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate();
        
        {
            const titleNot = "You have published a new idea!";
            const descrNot = "Congratulations on posting a new idea: " + title + "! We're so glad you feel inspired! We wish your idea the success it deserves.";

            await query(
                'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                [session.account.id, titleNot, descrNot, today, 0]
            );
        }

        // Send notification to followers
        const followers = await query(
            'SELECT followaccountid FROM follow WHERE followedaccountid=?;',
            [session.account.id]
        );

        if (followers) {
            followers.forEach(async follower => {
                const titleNot = session.account.username + " has published a new idea!";
                const descrNot = session.account.username + " has published a new idea! The idea's title is " + title + ". You can see it in the last ideas, search it or see it from the account page of " + session.account.username + "!";
                
                await query(
                    'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                    [follower.followaccountid, titleNot, descrNot, today, 0]
                );
            });
        }

        // Reload notifications
        const result = await query(
            "SELECT * FROM notifications WHERE accountid=?;",
            [session.account.id]
        );

        session.account.notifications = result;

        await session.save();

        return res.status(200).json({ success: true, ideaId: ideaId });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}