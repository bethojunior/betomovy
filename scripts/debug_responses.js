const https = require('https');

function getUrl(path) {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com' + path, {
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
        resolve({ status: res.statusCode, data: data.substring(0, 300) });
      });
    });
  });
}

async function check() {
  const c1 = await getUrl('/cancellationReasonsType');
  console.log('/cancellationReasonsType:', c1);

  const c2 = await getUrl('/deliveryCallConfig');
  console.log('/deliveryCallConfig:', c2);

  const c3 = await getUrl('/appConfig');
  console.log('/appConfig (500 detail):', c3);

  const c4 = await getUrl('/cancellationReasons');
  console.log('/cancellationReasons (500 detail):', c4);
}

check();
