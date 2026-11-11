const https = require('https');

function get(path) {
  return new Promise((resolve) => {
    https.get('https://api.movymob.com' + path, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(d); }
      });
    });
  });
}

async function run() {
  const custRes = await get('/Customer/index?page=1&limit=20');
  const custList = custRes?.data?.data || custRes?.response?.data || custRes?.data || [];
  console.log('--- RECENT CUSTOMERS ---');
  custList.slice(0, 10).forEach(c => {
    console.log(`idCustomer: ${c.idCustomer}, idUser: ${c.idUser}, name: ${c.name}, email: ${c.email}, phone: ${c.phone}, doc: ${c.document}, created_at: ${c.created_at}`);
  });

  const driverRes = await get('/driver?page=1&allCities=1&limit=20');
  const driverList = driverRes?.data?.data || driverRes?.response?.data || driverRes?.data || [];
  console.log('\n--- RECENT DRIVERS ---');
  driverList.slice(0, 10).forEach(d => {
    console.log(`idDriver: ${d.idDriver}, idUser: ${d.idUser}, name: ${d.name}, email: ${d.email}, phone: ${d.phone}, doc: ${d.document}, plate: ${d.carPlate}, created_at: ${d.created_at}`);
  });
}

run();
