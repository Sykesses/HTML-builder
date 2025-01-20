const path = require('path');
const FS = require('fs/promises');
const pathToFolder = path.join(__dirname, 'styles');
const newPathToFolder = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    await FS.writeFile(newPathToFolder, '', 'utf-8');
    const stylesFiles = await FS.readdir(pathToFolder, { withFileTypes: true });
    const cssFiles = stylesFiles.filter(file => file.isFile() && path.extname(file.name) === '.css');
    
    let mergedFile = '';
    for (const file of cssFiles) {
      const filePath = path.join(pathToFolder, file.name);
      const fileContentStyles = await FS.readFile(filePath, 'utf-8');
      mergedFile += fileContentStyles + '\n';
    }
    await FS.writeFile(newPathToFolder, mergedFile, 'utf-8');
    console.log('Styles merged');
  } catch (err) {
    console.error('Styles not merged', err);
  }
}

mergeStyles();