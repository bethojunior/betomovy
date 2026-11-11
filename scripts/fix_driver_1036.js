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
    // 1. Update driver 1036 and user 4652 cityId to 5676
    const u1 = await queryDb("UPDATE driver SET cityId = '5676', status = 'disponivel' WHERE idDriver = '1036'");
    console.log('Update driver 1036:', u1);

    const u2 = await queryDb("UPDATE user SET cityId = '5676' WHERE idUser = '4652'");
    console.log('Update user 4652:', u2);

    // 2. Add to centralDriver for centralId 32 (Everett) if not exists
    const cd = await queryDb("SELECT * FROM centralDriver WHERE driverId = '1036' AND centralId = '32'");
    if (!cd.data || cd.data.length === 0) {
        const ins = await queryDb("INSERT INTO centralDriver (centralId, driverId, statusId, isFavorite, created_at, updated_at) VALUES ('32', '1036', '1', '1', NOW(), NOW())");
        console.log('Insert centralDriver for 1036:', ins);
    } else {
        console.log('Already in centralDriver:', cd.data);
    }
}

run();
