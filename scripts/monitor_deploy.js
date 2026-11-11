const https = require('https');

function getDiag() {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com/test-diag', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function monitor() {
  console.log('Monitorando deploy do DigitalOcean...');
  for (let i = 1; i <= 30; i++) {
    const diag = await getDiag();
    console.log(`[${new Date().toLocaleTimeString()}] Check ${i}: mtime = ${diag.trip_dao_mtime || 'unknown'}`);
    if (diag.trip_dao_mtime && diag.trip_dao_mtime > '2026-10-20 10:28:33') {
      console.log('>>> NOVO DEPLOY DETECTADO! <<<');
      return true;
    }
    await new Promise(r => setTimeout(r, 8000));
  }
  return false;
}

monitor();
