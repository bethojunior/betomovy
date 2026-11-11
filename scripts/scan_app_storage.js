const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.git', 'android', 'ios'].includes(file)) continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full, fileList);
    else if (/\.(tsx?|jsx?)$/.test(file)) fileList.push(full);
  }
  return fileList;
}

const files = walk('d:/APLICATIVO MOVY/mobility-pro-app-rota101-pro/src');
const storageKeys = new Set();
const regex = /(?:AsyncStorage|storage)\s*\.\s*(?:getItem|setItem|removeItem|getString|set|delete)\s*\(\s*['"`]([^'"`]+)/g;

for (const f of files) {
  try {
    const c = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = regex.exec(c)) !== null) {
      storageKeys.add(m[1]);
    }
  } catch (e) {}
}

const sorted = Array.from(storageKeys).sort();
fs.writeFileSync('d:/APLICATIVO MOVY/docs/reconstrucao-movy/STORAGE_KEYS.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Chaves encontradas:', sorted.length);
console.log(sorted.join('\n'));
