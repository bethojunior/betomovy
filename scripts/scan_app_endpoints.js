const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'android' || file === 'ios') continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, fileList);
    else if (/\.(tsx?|jsx?)$/.test(file)) fileList.push(full);
  }
  return fileList;
}

const files = walk('d:/APLICATIVO MOVY/mobility-pro-app-rota101-pro/src');
const endpoints = new Set();
const regex = /(?:apiMain|apiMainDriver|api)\s*\.\s*(?:get|post|put|delete)\s*\(\s*['"`]([^'"`?]+)/g;

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = regex.exec(content)) !== null) {
      endpoints.add(m[1]);
    }
  } catch (e) {}
}

const sorted = Array.from(endpoints).sort();
fs.writeFileSync('d:/APLICATIVO MOVY/docs/reconstrucao-movy/ENDPOINTS_MAPEADOS.json', JSON.stringify(sorted, null, 2), 'utf8');
console.log('Total endpoints encontrados:', sorted.length);
console.log(sorted.slice(0, 30).join('\n'));
