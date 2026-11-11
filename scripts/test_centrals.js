const https = require('https');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.movymob.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body.substring(0, 300) });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  for (let cid of [1, 2, 3, 4, 5]) {
    const res = await testEndpoint(`/central/${cid}/driver?page=1`);
    console.log(`Central ${cid}: total =`, res.total ?? res.response?.total ?? 0);
  }

  const resAll = await testEndpoint(`/central/0/driver?page=1`);
  console.log(`Central 0: total =`, resAll.total ?? resAll.response?.total ?? 0);
}

run().catch(console.error);
