import { query } from '../../lib/db_connection';
import { getSession } from '../../lib/session';
import { parseForm } from '../../lib/formParser';
import { cleanupUploadFiles, convertImageUpload, convertPdfUpload, isValidImageDataUrl } from '../../lib/uploadValidation';
import { isPositiveIntegerId, isValidHttpUrl, validateTextList } from '../../lib/security';

export const config = {
    api: {
        bodyParser: false, // Disable parsing
    },
};

function getInput(data) {
    return String(data).trim();
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    let uploadedFiles = [];

    try {
        const session = await getSession(req, res);
        
        if (!session || (!session.account && !session.administrator)) {
            return res.status(401).json({ success: false, error: 'User not logged in' });
        }

        // Parse form data to handle the files
        const [fields, files] = await parseForm(req, { allowFiles: true });
        uploadedFiles = Object.values(files);

        const title = getInput(fields.title?.[0] || '');
        const ideaid = getInput(fields.ideaid?.[0] || '');
        const date = formatDate(new Date());
        const description = getInput(fields.description?.[0] || '');
        const link = getInput(fields.link?.[0] || '');
        const type = getInput(fields.type?.[0] || '');
        const creativity = getInput(fields.creativity?.[0] || '');
        const status = getInput(fields.status?.[0] || '');
        let additionalInfo;
        const additionalInfoImagesData = fields['additionalInfoImagesData[]'] || [];
        let logs;

        try {
            additionalInfo = fields.additionalInfo?.[0]
                ? JSON.parse(fields.additionalInfo[0])
                : { titles: [], descriptions: [], types: [] };
            logs = fields.logs?.[0] ? JSON.parse(fields.logs[0]) : { dates: [], titles: [], descriptions: [] };
        } catch {
            return res.status(400).json({ success: false, error: 'Invalid additional idea data' });
        }

        if (!title || !isPositiveIntegerId(ideaid) || !date || !description || !type || !creativity || !status) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        if (title.length > 200 || description.length > 10000 || (link && !isValidHttpUrl(link))
            || !validateTextList(additionalInfo.titles, 20, 200)
            || !validateTextList(additionalInfo.descriptions, 20, 5000)
            || !validateTextList(additionalInfo.types, 20, 4)
            || additionalInfo.titles.length !== additionalInfo.descriptions.length
            || additionalInfo.titles.length !== additionalInfo.types.length
            || !additionalInfo.types.every(type => type === 'file' || type === 'data')
            || !validateTextList(logs.titles, 100, 200)
            || !validateTextList(logs.descriptions, 100, 5000)
            || !validateTextList(logs.dates, 100, 30)
            || logs.titles.length !== logs.descriptions.length
            || logs.titles.length !== logs.dates.length) {
            return res.status(400).json({ success: false, error: 'Invalid idea data' });
        }

        const existingIdea = await query(
            'SELECT authorid FROM ideas WHERE id=?;',
            [ideaid]
        );

        if (existingIdea.length === 0) {
            return res.status(404).json({ success: false, error: 'Idea not found' });
        }

        const authorId = existingIdea[0].authorid;

        if (!session.administrator && String(session.account.id) !== String(authorId)) {
            return res.status(403).json({ success: false, error: 'Not authorized to edit this idea' });
        }

        // Handle MainImage
        let mainImageConverted = null;

        if (files.mainImageFile?.[0]) {
            mainImageConverted = await convertImageUpload(files.mainImageFile[0]);

            if (!mainImageConverted) {
                return res.status(400).json({ success: false, error: 'MAIN_IMAGE_NULL' });
            }
        }
        else if (fields.mainImageData?.[0]) {
            mainImageConverted = fields.mainImageData[0];

            if (!isValidImageDataUrl(mainImageConverted)) {
                return res.status(400).json({ success: false, error: 'Invalid main image' });
            }
        }
        else {
            return res.status(400).json({ success: false, error: 'Main image is required' });
        }

        // Handle additional info images
        const additionalInfoImagesConverted = [];

        if (additionalInfo.titles?.length > 0) {
            let iFile = 0;
            let iData = 0;

            for (let i = 0; i < additionalInfo.types.length; i++) {
                if (additionalInfo.types[i] == "file") {
                    const converted = await convertImageUpload(files['additionalInfoImagesFile[]']?.[iFile]);

                    if (!converted) {
                        return res.status(400).json({ success: false, error: 'ADDITIONAL_INFO_IMAGE_NULL' });
                    }

                    additionalInfoImagesConverted.push(converted);

                    iFile++;
                }
                else {
                    if (additionalInfoImagesData) {
                        const imageData = additionalInfoImagesData[iData];

                        if (!isValidImageDataUrl(imageData)) {
                            return res.status(400).json({ success: false, error: 'Invalid additional image' });
                        }

                        additionalInfoImagesConverted.push(imageData);
                    }

                    iData++;
                }
            }
        }

        // Handle the license
        let licenseConverted = null;

        if (files.license?.[0]) {
            licenseConverted = await convertPdfUpload(files.license[0]);

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
                [logs.titles[i], logs.descriptions[i], date, ideaid]
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
            [authorId, ideaid]
        );

        if (followers) {
            for (const follower of followers) {
                let titleNot = "";
                let descrNot = "";
                const today = formatDate(new Date());

                if (session.account) {
                    titleNot = session.account.username + " has updated " + title + "!";
                    descrNot = session.account.username + " has updated " + title + ". You can see the change in the idea's page!";
                }
                else {
                    titleNot = "The Administrator has updated " + title + "!";
                    descrNot = "The Administrator has updated " + title + ". You can see the change in the idea's page!";
                }
                
                await query(
                    'INSERT INTO notifications (accountid, title, description, data, status) VALUES (?, ?, ?, ?, ?);',
                    [follower.followaccountid, titleNot, descrNot, today, 0]
                );
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        await cleanupUploadFiles(uploadedFiles).catch(error => {
            console.error('Failed to clean up uploaded files:', error);
        });
    }
}