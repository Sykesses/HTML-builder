const path = require('path');
const FS = require('fs');
const pathToFile = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;

stdout.write('Hi, type your message here....\n');

const writeStream = FS.createWriteStream(pathToFile, 'utf-8');

stdin.on('data',(data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  writeStream.write(data);
});

process.on('exit', () => stdout.write('Your message saved to file'));