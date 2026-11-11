const https = require('https');

const uniqueDoc = String(Math.floor(100000000 + Math.random() * 900000000));
const payload = {
  stdObject: {
    driver: {
      name: 'Test Driver Debug',
      email: 'testdriver' + Date.now() + '@movytest.com',
      document: uniqueDoc,
      dateOfBirth: '1990-01-01',
      phone: '119888' + Math.floor(1000 + Math.random() * 9000),
      password: 'password123',
      userTypeId: 2,
      registered_in: 'mobilidade',
      cityId: 5605,
      docs: [
        { docId: 1, text: "Driver's License" },
        { docId: 2, text: "Vehicle insurance and registration" },
        { docId: 6, text: "Proof of residence" },
        { docId: 10, text: "SCN" }
      ]
    },
    car: {
      licensePlate: 'MOV' + Math.floor(1000 + Math.random() * 9000),
      model: 'Toyota Camry',
      brand: 'Toyota',
      color: 'Black',
      year: '2022'
    }
  }
};

const postData = JSON.stringify(payload);

const req = https.request('https://api.movymob.com/Driver/Register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', body);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(postData);
req.end();
