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
    console.log('=== DESCRIBE driver ===');
    const descDriver = await queryDb("DESCRIBE driver");
    console.log((descDriver.data || []).map(c => c.Field));

    console.log('\n=== DESCRIBE centralDriver ===');
    const descCD = await queryDb("DESCRIBE centralDriver");
    console.log((descCD.data || []).map(c => c.Field));

    console.log('\n=== COUNT centralDriver ===');
    const countCD = await queryDb("SELECT centralId, count(*) as cnt FROM centralDriver GROUP BY centralId");
    console.log(countCD.data);

    console.log('\n=== TEST CentralController count query ===');
    const testCount = await queryDb("SELECT COUNT(*) as total FROM driver d INNER JOIN user u ON d.userId = u.idUser WHERE (u.statusId IS NULL OR u.statusId != 2)");
    console.log(testCount.data);
}

run().catch(console.error);
