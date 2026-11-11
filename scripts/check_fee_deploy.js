const https = require('https');

function checkFee() {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com/trip/fee', {
      headers: {
        'token': 'MTc5MjQzMDc1Mzg=',
        'userid': '8',
        'cityid': '5695',
        'platform': '1'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data.substring(0, 200) });
        }
      });
    }).on('error', err => resolve({ status: 0, error: err.message }));
  });
}

async function loop() {
  console.log('Monitorando deploy de /trip/fee...');
  for (let i = 1; i <= 25; i++) {
    const res = await checkFee();
    if (res.json && res.json.status === true && res.json.message === 'Taxa da central recuperada') {
      console.log('>>> SUCESSO ABSOLUTO! /trip/fee RESPONDENDO COM SUCESSO! <<<');
      console.log(JSON.stringify(res.json, null, 2));
      return true;
    }
    console.log(`[Tentativa ${i}] HTTP ${res.status}:`, res.json ? res.json.message : res.raw);
    await new Promise(r => setTimeout(r, 6000));
  }
  return false;
}

loop();
