const fs = require('fs');
const path = require('path');

const targetDirs = [
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Customer',
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Driver',
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Trip',
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Delivery',
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Financial',
  'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Vehicle'
];

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const apiRegex = /api\.(get|post|put|delete)\s*\(\s*[`'"]([^`'"]+)[`'"]/g;
const endpoints = new Set();

for (const d of targetDirs) {
  const files = getFiles(d);
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = apiRegex.exec(content)) !== null) {
      endpoints.add(`${match[1].toUpperCase()} ${match[2]}`);
    }
  }
}

console.log('Endpoints encontrados nas páginas do MovyMonitor:');
Array.from(endpoints).sort().forEach(e => console.log(e));
