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

async function main() {
    const res = await queryDb('SELECT config.key, config.value FROM config');
    if (res.data) {
        const interesting = res.data.filter(r => 
            /call|renew|second|finger|expire|time|limit|radius|distance/i.test(r.key)
        );
        console.log('Configs:', interesting);
    } else {
        console.log('Error/Result:', res);
    }
}

main();
