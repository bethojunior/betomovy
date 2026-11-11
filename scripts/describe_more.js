const https = require('https');

async function desc(table) {
  return new Promise((resolve) => {
    const req = https.request('https://api.movymob.com/db-migrate.php?secret=movy-migrate-2026&action=query', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.write(`DESCRIBE ${table}`);
    req.end();
  });
}

async function run() {
  const d1 = await desc('companyDeliveryConfig');
  console.log('companyDeliveryConfig:', d1.rows ? d1.rows.map(r => r.Field) : d1);

  const d2 = await desc('companyAddress');
  console.log('companyAddress:', d2.rows ? d2.rows.map(r => r.Field) : d2);
}

run();
