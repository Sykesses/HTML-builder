const path = require('path');
const FS = require('fs');
const pathToFolder = path.join(__dirname, 'secret-folder');

FS.readdir(pathToFolder, { withFileTypes:true }, (err, files) => {
  if (err) {
    return console.error(err);
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const pathToFile = path.join(file.path, file.name);
      const extention = path.extname(file.name).slice(1);
      const name = path.basename(file.name, path.extname(file.name));
      FS.stat(pathToFile, (err, stats) => {
        if (err) {
          console.error(err);
        }
        console.log(`${name} - ${extention} - ${(stats.size / 1024).toFixed(2)}kb`);
      });
    } 
  });
});