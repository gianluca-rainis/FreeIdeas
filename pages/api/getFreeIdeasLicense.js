import { promises as fs } from 'fs';
import path from 'path';

function getInput(data) {
    return String(data).trim();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { title, author } = req.body;

        if (!title || !author) {
            return res.status(400).json({ success: false, error: 'Not filled all the required fields' });
        }

        const sanitizedTitle = getInput(title);
        const sanitizedAuthor = getInput(author);

        const replacements = {
            '{AUTHOR}': sanitizedAuthor,
            '{TITLE}': sanitizedTitle,
            '{YEAR}': new Date().getFullYear(),
        };

        // Get license file
        const licensePath = path.join(process.cwd(), 'FreeIdeasLicense.md');
        let licenseContent = await fs.readFile(licensePath, 'utf-8');

        // Replace
        Object.keys(replacements).forEach(key => {
            licenseContent = licenseContent.replace(new RegExp(key, 'g'), replacements[key]);
        });

        // Convert in base 64
        const encodedLicense = Buffer.from(licenseContent).toString('base64');
        const dataUrl = `data:text/markdown;base64,${encodedLicense}`;

        return res.status(200).json({ success: true, license: dataUrl });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}