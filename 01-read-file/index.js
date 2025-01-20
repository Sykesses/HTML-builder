const path = require('path');
const FS = require('fs');

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = FS.createReadStream(pathToFile, 'utf-8');

readStream.on('data', (chunk) => console.log(chunk))