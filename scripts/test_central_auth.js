const https = require('https');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.movymob.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': 'jayW2RMJUY7f6T3sXoVXrL8tg',
        'cityid': '5605',
        'platform': 'android'
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
  console.log('Testing with auth headers:');
  const res1 = await testEndpoint('/central/1/driver?page=1');
  console.log('central/1/driver result:', res1);
  if (res1.response?.data) {
    console.log('Sample drivers:', res1.response.data.slice(0, 3));
  }
}

run().catch(console.error);
