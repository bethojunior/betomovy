const https = require('https');

function testController() {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com/test-controller?name=AppConfigController', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ code: res.statusCode, data: data.substring(0, 300) });
      });
    }).on('error', err => resolve({ code: 0, data: err.message }));
  });
}

async function run() {
  console.log('Aguardando deploy da correção GenericDao...');
  for (let i = 1; i <= 25; i++) {
    const res = await testController();
    console.log(`[Tentativa ${i}] Code: ${res.code} | Resposta: ${res.data.replace(/\r?\n/g, ' ')}`);
    if (res.data.includes('"status":true') || (!res.data.includes('Fatal error') && res.code === 200)) {
      console.log('>>> CORREÇÃO NO AR COM SUCESSO! <<<');
      return;
    }
    await new Promise(r => setTimeout(r, 6000));
  }
}

run();
