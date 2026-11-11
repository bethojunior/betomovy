const https = require('https');

const sql = `SELECT * FROM centralFee WHERE statusId = 1 ORDER BY id DESC LIMIT 5`;

const req = https.request('https://api.movymob.com/db-migrate.php?secret=movy-migrate-2026&action=query', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Active centralFee rows:', data);
  });
});

req.write(sql);
req.end();
