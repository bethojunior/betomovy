const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.js') || file.endsWith('.php')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

const jsFiles = getAllFiles('mobilidade-central-master/public/webfiles/js');
const apiCalls = new Set();

const regexes = [
    /\$\.ajax\(\s*\{[^}]*url:\s*['"`]([^'"`]+)['"`]/g,
    /\$\.post\(\s*['"`]([^'"`]+)['"`]/g,
    /\$\.get\(\s*['"`]([^'"`]+)['"`]/g,
    /fetch\(\s*['"`]([^'"`]+)['"`]/g,
    /url:\s*Host\.get(?:Api|Local|Central)\(\)\s*\+\s*['"`]([^'"`]+)['"`]/g,
    /Host\.get(?:Api|Local|Central)\(\)\s*\+\s*['"`]([^'"`]+)['"`]/g,
    /url:\s*['"`]\/([^'"`]+)['"`]/g
];

jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    regexes.forEach(re => {
        let m;
        while ((m = re.exec(content)) !== null) {
            let u = m[1].trim();
            if (u.startsWith('http')) {
                try {
                    u = new URL(u).pathname;
                } catch(e) {}
            }
            if (u && !u.includes('.css') && !u.includes('.png') && !u.includes('.js')) {
                apiCalls.add({ url: u, file: path.relative('mobilidade-central-master', file) });
            }
        }
    });
});

console.log('Total de chamadas API/rotas encontradas em JS da Central:', apiCalls.size);
fs.writeFileSync('scripts/central_js_calls.json', JSON.stringify([...apiCalls], null, 2));
