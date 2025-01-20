const path = require('path');
const FS = require('fs/promises');
const pathToFolder = path.join(__dirname, 'files');

async function copyDir() {
  try {
    const newPathToFolder = path.join(__dirname, 'files-copy');
    await FS.mkdir(newPathToFolder, { recursive: true });

    const files = await FS.readdir(newPathToFolder);
    for (const file of files) {
      await FS.rm(path.join(newPathToFolder, file), { force: true });
    }

    const filesNeedtoCopy = await FS.readdir(pathToFolder);
    for (const file of filesNeedtoCopy) {
      const oldfile = path.join(pathToFolder, file);
      const newfile = path.join(newPathToFolder, file);
      await FS.copyFile(oldfile, newfile);
    }
    console.log('Files copyed')
  } catch (err) {
    console.error('Files not copyed', err)
  }
}
copyDir();