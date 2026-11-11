const https = require('https');

function checkController(name) {
  return new Promise((resolve) => {
    https.get(`https://api.movymob.com/test-controller?name=${name}`, {
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
        let json = null;
        try { json = JSON.parse(data); } catch(e) {}
        resolve({ statusCode: res.statusCode, data: json || data.substring(0, 300) });
      });
    }).on('error', (err) => resolve({ statusCode: 0, error: err.message }));
  });
}

async function loop() {
  console.log('Verificando com headers de autenticação...');
  const resApp = await checkController('AppConfigController');
  console.log('AppConfigController:', resApp);

  const resCanc = await checkController('CancellationReasonsController');
  console.log('CancellationReasonsController:', resCanc);

  const resDeliv = await checkController('DeliveryCallConfigController');
  console.log('DeliveryCallConfigController:', resDeliv);
}

loop();
