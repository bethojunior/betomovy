const fs = require('fs');
const https = require('https');

const endpoints = JSON.parse(fs.readFileSync('d:/APLICATIVO MOVY/scripts/endpoints_found.json', 'utf8'));

// Testar endpoints GET que não têm parâmetros dinâmicos de template literal não resolvidos
const toTest = [];
for (const key of Object.keys(endpoints)) {
    const item = endpoints[key];
    if (item.method === 'GET' && !item.url.includes('${') && !item.url.endsWith('/')) {
        toTest.push(item);
    }
}

console.log(`Total GET endpoints to test: ${toTest.length}`);

const headers = {
    'token': 'MTc5NDE1Njg0MDg=',
    'userid': '8',
    'cityid': '5695',
    'platform': '1',
    'User-Agent': 'MovyAuditor/1.0'
};

async function testEndpoint(item) {
    return new Promise(resolve => {
        let urlPath = item.url;
        if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;

        const options = {
            hostname: 'api.movymob.com',
            port: 443,
            path: encodeURI(urlPath),
            method: 'GET',
            headers: headers,
            timeout: 8000
        };

        const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(body);
                } catch (e) {}

                resolve({
                    url: item.url,
                    file: item.file,
                    statusCode: res.statusCode,
                    bodyLength: body.length,
                    parsedStatus: parsed ? parsed.status : null,
                    parsedMessage: parsed ? (parsed.message || parsed.error) : null,
                    rawSnippet: body.substring(0, 150)
                });
            });
        });

        req.on('error', err => {
            resolve({
                url: item.url,
                file: item.file,
                statusCode: 0,
                error: err.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                url: item.url,
                file: item.file,
                statusCode: 408,
                error: 'Timeout'
            });
        });

        req.end();
    });
}

async function run() {
    const results = [];
    // Rodar em lotes de 5 para não sobrecarregar
    for (let i = 0; i < toTest.length; i += 5) {
        const batch = toTest.slice(i, i + 5);
        const batchResults = await Promise.all(batch.map(testEndpoint));
        results.push(...batchResults);
        process.stdout.write(`Tested ${Math.min(i + 5, toTest.length)} / ${toTest.length}...\r`);
    }

    fs.writeFileSync('d:/APLICATIVO MOVY/scripts/endpoints_audit_report.json', JSON.stringify(results, null, 2));

    // Filtrar falhas
    const failures = results.filter(r => r.statusCode >= 400 || r.parsedStatus === false || r.error);
    console.log(`\n\n--- AUDIT SUMMARY ---`);
    console.log(`Total Tested: ${results.length}`);
    console.log(`Total Success: ${results.length - failures.length}`);
    console.log(`Total Failures/Errors: ${failures.length}`);
    console.log(`\nFailures:`);
    failures.forEach(f => {
        console.log(`[${f.statusCode}] ${f.url} (used in ${f.file}) -> msg: ${f.parsedMessage || f.error || f.rawSnippet}`);
    });
}

run();
