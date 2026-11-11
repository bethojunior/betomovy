const fs = require('fs');
const path = require('path');
const https = require('https');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    });
    return results;
}

const dirs = [
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Advanced',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Dashboard',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Monitoring',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Client',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Driver',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Financial',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Trip',
    'd:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages/Delivery'
];

const found = [];

dirs.forEach(d => {
    const files = walk(d);
    files.forEach(f => {
        const content = fs.readFileSync(f, 'utf8');
        const regex = /api\.(get|post|put|delete)\(\s*[`'"]([^`'"$]+)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            found.push({
                file: path.relative('d:/APLICATIVO MOVY/mobilidade-monitor-new-main/src/pages', f),
                method: match[1].toUpperCase(),
                url: match[2].trim()
            });
        }
    });
});

console.log(`Found ${found.length} endpoint references in frontend.`);

// Agrupar por rota única
const unique = {};
found.forEach(item => {
    const key = `${item.method} ${item.url}`;
    if (!unique[key]) {
        unique[key] = { ...item, callers: [] };
    }
    unique[key].callers.push(item.file);
});

fs.writeFileSync('d:/APLICATIVO MOVY/scripts/endpoints_found.json', JSON.stringify(unique, null, 2));
console.log(`Saved ${Object.keys(unique).length} unique endpoints to d:/APLICATIVO MOVY/scripts/endpoints_found.json`);
