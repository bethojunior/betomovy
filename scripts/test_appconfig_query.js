const https = require('https');

const sql = `SELECT a.idApp AS appId,
                     a.name AS appName,
                     COALESCE(c.id, a.idApp) AS id,
                     COALESCE(c.mainColor, '#00C48C') AS mainColor,
                     COALESCE(c.mainColorText, '#FFFFFF') AS mainColorText,
                     COALESCE(c.secondaryColor, '#0A2540') AS secondaryColor,
                     COALESCE(c.secondaryColorText, '#FFFFFF') AS secondaryColorText,
                     COALESCE(c.logo, '') AS logo,
                     COALESCE(c.name, a.name) AS name
              FROM app a
              LEFT JOIN appConfig c ON c.appId = a.idApp AND c.deleted_at IS NULL
              WHERE a.statusId = 1`;

const req = https.request('https://api.movymob.com/db-migrate.php?secret=movy-migrate-2026&action=query', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Query result:', data);
  });
});

req.write(sql);
req.end();
