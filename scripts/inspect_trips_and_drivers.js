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
    console.log('=== LATEST TRIPS ===');
    const trips = await queryDb("SELECT idTrip, tripReference, status, date, driverId, userId, tripTypeId, price, distance, isCalling, callingDriver FROM trip ORDER BY idTrip DESC LIMIT 10");
    console.log(trips.data);

    if (trips.data && trips.data.length > 0) {
        for (let i = 0; i < Math.min(3, trips.data.length); i++) {
            const ref = trips.data[i].tripReference;
            console.log(`\n=== DRIVER CALLED PARA TRIP ${ref} (status=${trips.data[i].status}) ===`);
            const dc = await queryDb(`SELECT * FROM driverCalled WHERE tripReference = '${ref}'`);
            console.log(dc.data);
        }
    }

    console.log('\n=== DRIVERS COM STATUS ATIVO / ONLINE ===');
    const drivers = await queryDb(`
        SELECT d.idDriver, d.userId, u.name, u.email, d.cityId, d.status, d.last_lat, d.last_lon, d.last_position_update, d.appIsOpen
        FROM driver d
        LEFT JOIN user u ON u.idUser = d.userId
        ORDER BY d.last_position_update DESC LIMIT 10
    `);
    console.log(drivers.data);
}

run();
