import fs from 'fs';
import path from 'path';

const source = 'C:/Users/jksha/.gemini/antigravity/brain/97fc03c7-7d1d-4e7f-8d21-701abb891d57/uploaded_image_1766554154551.png';
const dest = 'public/sentinel-preview.png';

try {
    if (!fs.existsSync('public')) {
        fs.mkdirSync('public');
    }
    fs.copyFileSync(source, dest);
    console.log('Copied successfully');
} catch (e) {
    console.error(e);
}
