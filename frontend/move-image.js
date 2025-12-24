const fs = require('fs');
const path = require('path');

const src = path.resolve('stage-1766553006795.png');
const dest = path.resolve('public', 'sentinel-preview.png');

try {
    fs.copyFileSync(src, dest);
    console.log('File copied successfully');
} catch (err) {
    console.error('Error copying file:', err);
}
