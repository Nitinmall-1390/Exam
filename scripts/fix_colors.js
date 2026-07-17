import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const colorReplacements = [
  { from: /slate-150/g, to: 'slate-200' },
  { from: /slate-250/g, to: 'slate-300' },
  { from: /slate-350/g, to: 'slate-400' },
  { from: /slate-450/g, to: 'slate-500' },
  { from: /slate-750/g, to: 'slate-700' },
  { from: /slate-850/g, to: 'slate-800' }
];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    colorReplacements.forEach(rep => {
      content = content.replace(rep.from, rep.to);
    });
    
    // Also explicitly fix the question text color in ExamScreen
    if (filePath.includes('ExamScreen.tsx')) {
      content = content.replace('text-slate-800 dark:text-slate-200', 'text-slate-900 dark:text-slate-100');
      content = content.replace('text-slate-800 dark:text-slate-100', 'text-slate-900 dark:text-slate-100');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed colors in: ${filePath}`);
    }
  }
});

console.log('Color cleaning complete.');
