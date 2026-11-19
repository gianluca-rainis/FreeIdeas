import formidable from 'formidable';
import { cleanupUploadFiles } from './uploadValidation';

const FORM_LIMITS = {
    maxFileSize: 2 * 1024 * 1024,
    maxTotalFileSize: 5 * 1024 * 1024,
    maxFiles: 10,
    maxFields: 100,
    maxFieldsSize: 5 * 1024 * 1024,
};

export function parseForm(req, options = {}) {
    const { allowFiles = false, ...formOptions } = options;
    let rejectedFile = false;
    const form = formidable({
        ...FORM_LIMITS,
        ...formOptions,
        filter: () => {
            if (!allowFiles) {
                rejectedFile = true;
                return false;
            }

            return true;
        },
    });
    const uploadedFiles = [];

    form.on('fileBegin', (fieldName, file) => {
        uploadedFiles.push(file);
    });

    return form.parse(req)
        .then(result => {
            if (rejectedFile) {
                throw new Error('File uploads are not allowed for this endpoint');
            }

            return result;
        })
        .catch(async error => {
            await cleanupUploadFiles(uploadedFiles);
            throw error;
        });
}
