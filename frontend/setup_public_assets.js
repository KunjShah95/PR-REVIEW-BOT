import fs from 'fs';
import path from 'path';

const logFile = path.resolve('setup_log.txt');
const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

const uploadedImagePath = 'C:/Users/jksha/.gemini/antigravity/brain/97fc03c7-7d1d-4e7f-8d21-701abb891d57/uploaded_image_1766554154551.png';
const publicDir = path.resolve('public');
const destPath = path.join(publicDir, 'sentinel-preview.png');

log('Starting setup...');

try {
    if (!fs.existsSync(publicDir)) {
        log('Creating public directory...');
        fs.mkdirSync(publicDir, { recursive: true });
        log('Public directory created.');
    } else {
        log('Public directory already exists.');
    }

    if (fs.existsSync(uploadedImagePath)) {
        log(`Copying image from ${uploadedImagePath} to ${destPath}...`);
        fs.copyFileSync(uploadedImagePath, destPath);
        log('Image copied successfully!');
    } else {
        log(`ERROR: Source image not found at ${uploadedImagePath}`);
        // Listing folder content of parent of uploaded image to see what's there?
        // Unlikely to help if I can't access it, but retry logic might be good?
    }
} catch (err) {
    log(`CRITICAL ERROR: ${err.message}`);
}
