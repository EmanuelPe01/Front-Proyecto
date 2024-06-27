export const endpoint = 'http://localhost:8080'

export const validateFileType = (fileName) => {
    const allowedExtensions = ['mp3', 'mp4', 'jpg', 'png'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension) ? fileExtension : '';
};