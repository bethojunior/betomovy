const https = require('https');

function checkCentralHome() {
  return new Promise((resolve) => {
    https.get('https://movycentral.com/webfiles/js/modules/default/home.js?nocache=' + Date.now(), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve(data.includes('returnFee || 0'));
      });
    }).on('error', () => resolve(false));
  });
}

function checkApiFee() {
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
        resolve(data.includes('"status":true'));
      });
    }).on('error', () => resolve(false));
  });
}

async function loop() {
  console.log('Acompanhando deploy na DigitalOcean...');
  for (let i = 1; i <= 30; i++) {
    const centralUpdated = await checkCentralHome();
    const apiUpdated = await checkApiFee();
    console.log(`[Tentativa ${i}] Central: ${centralUpdated ? 'ATUALIZADO (NO AR)' : 'compilando...'} | API /trip/fee: ${apiUpdated ? 'ATUALIZADO (NO AR)' : 'compilando...'}`);
    if (centralUpdated || apiUpdated) {
      console.log('>>> DEPLOY DETECTADO! <<<');
      if (centralUpdated && apiUpdated) {
        console.log('>>> AMBOS 100% ONLINE! <<<');
        return;
      }
    }
    await new Promise(r => setTimeout(r, 6000));
  }
}

loop();
