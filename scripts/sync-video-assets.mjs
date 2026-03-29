/**
 * Copie chaque sous-dossier de assets/video/ vers public/<meme-nom>/
 * (recursif : sous-dossiers type app_mobile/Gbonhi/ preserves).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcRoot = path.join(root, 'assets', 'video');
const pubRoot = path.join(root, 'public');

function copyDirRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true });
  let n = 0;
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, ent.name);
    const destPath = path.join(to, ent.name);
    if (ent.isDirectory()) {
      n += copyDirRecursive(srcPath, destPath);
    } else if (ent.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      n += 1;
    }
  }
  return n;
}

if (!fs.existsSync(srcRoot)) {
  fs.mkdirSync(srcRoot, { recursive: true });
  console.log('Created empty assets/video (ajoutez un dossier par projet).');
  process.exit(0);
}

let copied = 0;
for (const name of fs.readdirSync(srcRoot)) {
  const p = path.join(srcRoot, name);
  if (!fs.statSync(p).isDirectory()) continue;
  const dest = path.join(pubRoot, name);
  const n = copyDirRecursive(p, dest);
  copied += n;
  console.log(`  ${name}/ -> public/${name}/ (${n} fichiers)`);
}
console.log(`Sync terminé (${copied} fichiers).`);
