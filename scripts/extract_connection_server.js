const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.js')) {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

const jsFiles = getAllFiles('mobilidade-central-master/public/webfiles/js');
const endpoints = [];

jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /ConnectionServer\.(?:sendRequest|sendRequestMain)\(\s*[`'"]([^`'"]+)[`'"],\s*[`'"]([^`'"]+)[`'"]/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
        endpoints.push({
            endpoint: m[1],
            method: m[2],
            file: path.relative('mobilidade-central-master', file)
        });
    }
});

console.log('Total de endpoints chamados via ConnectionServer:', endpoints.length);
fs.writeFileSync('scripts/central_connection_server_endpoints.json', JSON.stringify(endpoints, null, 2));
console.log(JSON.stringify(endpoints.slice(0, 30), null, 2));
