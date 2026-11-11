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
    const cust = await queryDb("SELECT * FROM customer WHERE userId = '4634'");
    console.log('Customer for userId 4634 (Central Everett):', cust.data);

    const user = await queryDb("SELECT idUser, name, email FROM user WHERE idUser = '4634'");
    console.log('User 4634:', user.data);
}

run();
