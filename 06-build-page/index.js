const path = require('path');
const FS = require('fs/promises');

const assetsFolder = path.join(__dirname, 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const htmlTemplateFile = path.join(__dirname, 'template.html');
const projectFolder = path.join(__dirname, 'project-dist');
const cssFile = path.join(projectFolder, 'style.css');
const htmlFile = path.join(projectFolder, 'index.html');

async function createHTML() {
  const templateContent = await FS.readFile(htmlTemplateFile, 'utf-8');
  let htmlContent = templateContent;
  const matches = templateContent.match(/{{\s*[\w-]+\s*}}/g) || [];
  for (const match of matches) {
    const tagName = match.replace(/{{\s*|\s*}}/g, '');
    const componentPath = path.join(componentsFolder, `${tagName}.html`);
    try {
      const componentContent = await FS.readFile(componentPath, 'utf-8');
      htmlContent = htmlContent.replace(match, componentContent);
    } catch (err) {
      console.warn(`Component not found for tag: ${tagName}`);
    }
  }
  await FS.writeFile(htmlFile, htmlContent, 'utf-8');
  console.log('index.html has been created!');
}
async function copyDir(source, destination) {
  try {
    await FS.mkdir(destination, { recursive: true });
    const entries = await FS.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);
      if (entry.isDirectory()) {
        await copyDir(sourcePath, destinationPath);
      } else if (entry.isFile()) {
        await FS.copyFile(sourcePath, destinationPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}
async function mergeStyles() {
  try {
    await FS.mkdir(projectFolder, { recursive: true });
    await FS.writeFile(cssFile, '', 'utf-8');
    const files = await FS.readdir(stylesFolder, { withFileTypes: true });
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    let mergedContent = '';
    for (const file of cssFiles) {
      const filePath = path.join(stylesFolder, file.name);
      const fileContent = await FS.readFile(filePath, 'utf-8');
      mergedContent += fileContent + '\n';
    }
    await FS.writeFile(cssFile, mergedContent, 'utf-8');
    console.log('Styles merged');
  } catch (err) {
    console.error('Styles not merged', err);
  }
}

mergeStyles();
copyDir(assetsFolder, path.join(projectFolder, 'assets'));
createHTML();