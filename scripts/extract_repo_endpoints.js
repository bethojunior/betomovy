const fs = require('fs');
const path = require('path');

const repoDir = 'mobilidade-central-master/public/webfiles/js/repositories';
const files = fs.readdirSync(repoDir);

const calls = [];
files.forEach(f => {
    const content = fs.readFileSync(path.join(repoDir, f), 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
        const m = l.match(/Host\.getApi\(\)\s*\+\s*['"`]([^'"`]+)['"`]/) ||
                  l.match(/url:\s*['"`]([^'"`]+)['"`]/) ||
                  l.match(/['"`]\/(central|trip|driver|customer|city|config|monitoring)[^'"`]*['"`]/);
        if (m) {
            calls.push({ file: f, line: idx + 1, endpoint: m[1] || m[0] });
        }
    });
});

console.log('Endpoints chamados pelos repositórios da Central:');
console.log(JSON.stringify(calls, null, 2));
