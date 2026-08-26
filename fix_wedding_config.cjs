const fs = require('fs');

let content = fs.readFileSync('src/weddingConfig.ts', 'utf8');

const importStatement = "import configData from './data/wedding_config.json';\n\n";

if (!content.includes('import configData')) {
  content = importStatement + content;
}

const startIndex = content.indexOf('export const weddingConfig: WeddingConfig = {');
if (startIndex !== -1) {
  content = content.substring(0, startIndex) + 'export const weddingConfig: WeddingConfig = configData as unknown as WeddingConfig;\n';
  fs.writeFileSync('src/weddingConfig.ts', content, 'utf8');
  console.log('Fixed src/weddingConfig.ts');
}
