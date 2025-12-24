import fs from 'fs';
import path from 'path';

const localImage = 'stage-1766553006795.png'; // In current directory
const publicDir = 'public';
const destImage = path.join(publicDir, 'sentinel-preview.png');

try {
    if (!fs.existsSync(publicDir)) {
        console.log('Creating public directory...');
        fs.mkdirSync(publicDir, { recursive: true });
    }

    if (fs.existsSync(localImage)) {
        console.log('Copying local image...');
        fs.copyFileSync(localImage, destImage);
        fs.writeFileSync('setup_complete.txt', 'Image copied successfully.');
        console.log('Success!');
    } else {
        fs.writeFileSync('setup_error.txt', 'Local image not found: ' + localImage);
        console.error('Local image not found.');
    }
} catch (error) {
    fs.writeFileSync('setup_error.txt', 'Exception: ' + error.message);
    console.error(error);
}
