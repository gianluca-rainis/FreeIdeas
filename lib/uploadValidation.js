import fs from 'node:fs/promises';

function getImageMimeType(buffer) {
    if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return 'image/png';
    }

    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
    }

    if (buffer.subarray(0, 4).toString() === 'GIF8') {
        return 'image/gif';
    }

    if (buffer.subarray(0, 4).toString() === 'RIFF'
        && buffer.subarray(8, 12).toString() === 'WEBP') {
        return 'image/webp';
    }

    return null;
}

export async function cleanupUploadFiles(files) {
    const paths = files
        .flatMap(file => Array.isArray(file) ? file : [file])
        .filter(file => file?.filepath)
        .map(file => file.filepath);

    await Promise.all(paths.map(async path => {
        try {
            await fs.unlink(path);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }));
}

export async function convertImageUpload(file) {
    if (!file?.filepath) {
        return null;
    }

    try {
        const buffer = await fs.readFile(file.filepath);
        const mimeType = getImageMimeType(buffer);

        return mimeType ? `data:${mimeType};base64,${buffer.toString('base64')}` : null;
    } finally {
        await cleanupUploadFiles([file]);
    }
}

export async function convertPdfUpload(file) {
    if (!file?.filepath) {
        return null;
    }

    try {
        const buffer = await fs.readFile(file.filepath);

        if (buffer.subarray(0, 5).toString() !== '%PDF-') {
            return null;
        }

        return `data:application/pdf;base64,${buffer.toString('base64')}`;
    } finally {
        await cleanupUploadFiles([file]);
    }
}

export function isValidImageDataUrl(value) {
    if (typeof value !== 'string' || value.length > 3 * 1024 * 1024) {
        return false;
    }

    const match = value.match(/^data:(image\/(?:png|jpeg|gif|webp));base64,([A-Za-z0-9+/]+={0,2})$/);

    if (!match) {
        return false;
    }

    const buffer = Buffer.from(match[2], 'base64');
    return getImageMimeType(buffer) === match[1];
}

export function isValidPdfDataUrl(value) {
    if (typeof value !== 'string' || value.length > 8 * 1024 * 1024) {
        return false;
    }

    const match = value.match(/^data:application\/pdf;base64,([A-Za-z0-9+/]+={0,2})$/);

    return Boolean(match && Buffer.from(match[1], 'base64').subarray(0, 5).toString() === '%PDF-');
}
