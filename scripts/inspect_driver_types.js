const https = require('https');

function queryDb(sql) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.movymob.com',
            port: 443,
            path: '/db-mig?secret=movy-migrate-2026&action=query',
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': Buffer.byteLength(sql)
            }
        }, res => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch(e) {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        req.write(sql);
        req.end();
    });
}

async function run() {
    const c1 = await queryDb("SELECT id, nome, estado FROM city WHERE id IN (1, 5676, 5586)");
    console.log('Cities:', c1.data);
}

run();
