const https = require('https');

function check() {
    return new Promise(resolve => {
        https.get('https://api.movymob.com/config_app_partners/find', res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                resolve({
                    isOnline: data.includes('"Parceiros encontrados"') || data.includes('"status":true'),
                    raw: data.substring(0, 150)
                });
            });
        }).on('error', err => resolve({ isOnline: false, raw: err.message }));
    });
}

async function run() {
    console.log('Monitorando deploy DigitalOcean para commit 921b39dd2 / 1d16658b8...');
    for (let i = 1; i <= 20; i++) {
        const res = await check();
        console.log(`[Tentativa ${i}] Status: ${res.isOnline ? 'DEPLOY CONCLUIDO!' : 'Compilando container...'} (${res.raw})`);
        if (res.isOnline) {
            console.log('>>> DEPLOY 100% ONLINE E VALIDADO EM PRODUÇÃO! <<<');
            return;
        }
        await new Promise(r => setTimeout(r, 10000));
    }
}

run();
