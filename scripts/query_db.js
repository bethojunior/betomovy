const https = require('https');

const query = process.argv[2] || 'SHOW TABLES';

const req = https.request({
    hostname: 'api.movymob.com',
    port: 443,
    path: '/db-mig?secret=movy-migrate-2026&action=query',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(query)
    }
}, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        try {
            console.log(JSON.stringify(JSON.parse(body), null, 2));
        } catch(e) {
            console.log(body);
        }
    });
});

req.write(query);
req.end();
