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
  console.log('Testing /central/1/driver?page=1 ...');
  const res1 = await testEndpoint('/central/1/driver?page=1');
  console.log('Result /central/1/driver: status =', res1.status, 'total =', res1.total || res1.response?.total);
  const list1 = res1.response?.data || res1.data || [];
  console.log('Sample drivers in central 1:');
  list1.slice(0, 5).forEach(d => console.log(' - ID:', d.idDriver, '| Name:', d.name, '| Phone:', d.user?.phone || d.phone, '| Created:', d.user?.created_at, '| StatusId:', d.driverRegisterStatusId));

  console.log('\nTesting /driver?page=1 ...');
  const res2 = await testEndpoint('/driver?page=1');
  console.log('Result /driver: status =', res2.status, 'total =', res2.response?.total);
  const list2 = res2.response?.data || [];
  console.log('Sample drivers in /driver:');
  list2.slice(0, 5).forEach(d => console.log(' - ID:', d.idDriver, '| Name:', d.name, '| Status:', d.registerStatus, '| City:', d.city, '| Created:', d.created_at));

  console.log('\nTesting /customer?page=1 ...');
  const res3 = await testEndpoint('/customer?page=1');
  console.log('Result /customer: status =', res3.status, 'total =', res3.response?.total || res3.total);
  const list3 = res3.response?.data || res3.data || [];
  console.log('Sample customers in /customer:');
  list3.slice(0, 5).forEach(c => console.log(' - ID:', c.idCustomer || c.idUser, '| Name:', c.name || c.user?.name, '| Email:', c.email || c.user?.email, '| Created:', c.created_at || c.user?.created_at));
}

run().catch(console.error);
