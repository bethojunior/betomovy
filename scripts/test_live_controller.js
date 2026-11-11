const https = require('https');

function testController(name) {
  return new Promise((resolve) => {
    https.get(`https://api.movymob.com/db-migrate.php?secret=movy-migrate-2026&action=test_controller&c=${name}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });
  });
}

async function run() {
  console.log('Testing AppConfigController:');
  const r1 = await testController('AppConfigController');
  console.log(r1);

  console.log('Testing DeliveryCallConfigController:');
  const r2 = await testController('DeliveryCallConfigController');
  console.log(r2);
}

run();
