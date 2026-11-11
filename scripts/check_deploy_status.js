const https = require('https');

function checkRemoveAccount() {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com/user/removeAccountsRequest?type=CUSTOMER&page=1', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: data.includes('"status":true'),
          sample: data.slice(0, 300)
        });
      });
    }).on('error', err => resolve({ ok: false, sample: err.message }));
  });
}

function checkActiveTrips() {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com/dashboard/activeTrips', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: data.includes('"scheduledTotal"'),
          sample: data.slice(0, 300)
        });
      });
    }).on('error', err => resolve({ ok: false, sample: err.message }));
  });
}

async function loop() {
  console.log('Verificando deploy na DigitalOcean para commit 9ecc7bd90...');
  for (let i = 1; i <= 25; i++) {
    const acc = await checkRemoveAccount();
    const trips = await checkActiveTrips();
    console.log(`[Tentativa ${i}] removeAccountsRequest: ${acc.ok ? 'ONLINE (SUCESSO)' : 'compilando...'} | activeTrips com paginação: ${trips.ok ? 'ONLINE (SUCESSO)' : 'compilando...'}`);
    if (acc.ok && trips.ok) {
      console.log('>>> DEPLOY 100% CONCLUÍDO E ONLINE NA PRODUÇÃO! <<<');
      console.log('Amostra removeAccountsRequest:', acc.sample);
      console.log('Amostra activeTrips:', trips.sample);
      return;
    }
    await new Promise(r => setTimeout(r, 7000));
  }
}

loop();
