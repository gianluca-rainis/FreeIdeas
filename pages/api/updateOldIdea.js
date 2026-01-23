import { query } from '../../lib/db_connection';
import { withSession } from '../../lib/withSession';
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

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        if (!req.session || (!req.session.account && !req.session.administrator)) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Parse form data to handle the files
        const form = formidable();
        const [fields, files] = await form.parse(req);

        const title = getInput(fields.title?.[0] || '');
        const ideaid = getInput(fields.ideaid?.[0] || '');
        const author = getInput(fields.author?.[0] || '');
        const date = getInput(fields.date?.[0] || '');
        const description = getInput(fields.description?.[0] || '');
        const link = getInput(fields.link?.[0] || '');
        const type = getInput(fields.type?.[0] || '');
        const creativity = getInput(fields.creativity?.[0] || '');
        const status = getInput(fields.status?.[0] || '');
        const additionalInfo = fields.additionalInfo?.[0]?JSON.parse(fields.additionalInfo[0]):{ titles: [], descriptions: [] };
        const additionalInfoImagesData = fields.additionalInfoImagesData?.[0] || {};
        const logs = fields.logs?.[0]?JSON.parse(fields.logs[0]):{ dates: [], titles: [], descriptions: [] };

        if (!title || !ideaid || !author || !date || !description || !type || !creativity || !status) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        // Handle MainImage
        let mainImageConverted = null;

        if (files.mainImageFile?.[0]) {
            mainImageConverted = await getConvertedImage(files.mainImageFile[0]);

            if (!mainImageConverted) {
                return res.status(400).json({ success: false, error: 'MAIN_IMAGE_NULL' });
            }
        }
        else {
            return res.status(400).json({ success: false, error: 'Main image is required' });
        }

        // Handle additional info images
        const additionalInfoImagesConverted = [];

        if (additionalInfo.length > 0) {
            let iFile = 0;
            let iData = 0;

            for (let i = 0; i < additionalInfo.length; i++) {
                if (additionalInfo.types[i] == "file") {
                    const converted = await getConvertedImage(files.additionalInfoImagesFile[i]);

                    if (!converted) {
                        return res.status(400).json({ success: false, error: 'ADDITIONAL_INFO_IMAGE_NULL' });
                    }

                    additionalInfoImagesConverted.push(converted);

                    iFile++;
                }
                else {
                    if (additionalInfoImagesData) {
                        additionalInfoImagesConverted.push(additionalInfoImagesData[iData]);
                    }

                    iData++;
                }
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

        // Update the idea
        await query(
            'UPDATE ideas SET title=?, data=?, ideaimage=?, description=?, downloadlink=?, license=? WHERE id=?;',
            [title, date, mainImageConverted, description, link || null, licenseConverted, ideaid]
        );

        // Delete all the old additional info
        await query(
            "DELETE FROM additionalinfo WHERE ideaid=?;",
            [ideaid]
        );

        // Save the new additionalInfo
        for (let i = 0; i < additionalInfo.titles.length; i++) {
            await query(
                'INSERT INTO additionalinfo (title, updtimage, description, ideaid) VALUES (?, ?, ?, ?);',
                [additionalInfo.titles[i], additionalInfoImagesConverted[i], additionalInfo.descriptions[i], ideaid]
            );
        }

        // Delete all the old logs
        await query(
            "DELETE FROM authorupdates WHERE ideaid=?;",
            [ideaid]
        );

        // Save the new logs
        for (let i = 0; i < logs.titles.length; i++) {
            await query(
                'INSERT INTO authorupdates (title, description, data, ideaid) VALUES (?, ?, ?, ?);',
                [logs.titles[i], logs.descriptions[i], logs.dates[i], ideaid]
            );
        }

        // Update idealabels
        await query(
            'UPDATE idealabels SET type=?, creativity=?, status=? WHERE ideaid=?;',
            [type, creativity, status, ideaid]
        );

        // Send notification to followers
        const followers = await query(
            'SELECT followaccountid FROM follow WHERE followedaccountid=? OR followedideaid=?;',
            [author, ideaid]
        );

        if (followers) {
            followers.forEach(async follower => {
                let titleNot = "";
                let descrNot = "";

                if (req.session.account) {
                    titleNot = req.session.account.username + " has updated " + title + "!";
                    descrNot = req.session.account.username + " has updated " + title + ". You can see the change in the idea's page!";
                }
                else {
                    titleNot = "The Administrator has updated " + title + "!";
                    descrNot = "The Administrator has updated " + title + ". You can see the change in the idea's page!";
                }
                
                await query(
                    'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                    [follower.followaccountid, titleNot, descrNot, today, 0]
                );
            });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

export default withSession(handler);