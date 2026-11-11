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
    console.log('=== TRIP TYPES / CATEGORIAS ===');
    const tt = await queryDb("SELECT idTripType, name, type, isDefault FROM tripType");
    console.log(tt.data);

    console.log('\n=== DRIVER 501 E 1036 DETAILS ===');
    const d501 = await queryDb("SELECT d.*, u.name as userName, u.email FROM driver d JOIN user u ON u.idUser = d.userId WHERE d.idDriver IN (501, 1036)");
    console.log(d501.data);

    console.log('\n=== CARS DOS MOTORISTAS ===');
    const cars = await queryDb("SELECT * FROM car WHERE driverId IN (501, 1036)");
    console.log(cars.data);

    console.log('\n=== DRIVER CATEGORIES / CAR TRIP TYPE ===');
    const carTrip = await queryDb("SELECT * FROM carTripType WHERE carId IN (SELECT idCar FROM car WHERE driverId IN (501, 1036))");
    console.log(carTrip.data);
}

run();
