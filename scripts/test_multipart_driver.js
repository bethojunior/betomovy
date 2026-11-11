const https = require('https');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const uniqueDoc = String(Math.floor(100000000 + Math.random() * 900000000));
const stdObject = JSON.stringify({
  driver: {
    name: 'Test Driver Multipart',
    email: 'testmultipart' + Date.now() + '@movytest.com',
    document: uniqueDoc,
    dateOfBirth: '1990-01-01',
    phone: '119777' + Math.floor(1000 + Math.random() * 9000),
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
    model: 'Honda Civic',
    brand: 'Honda',
    color: 'White',
    year: '2023'
  }
});

let body = '';
body += `--${boundary}\r\n`;
body += `Content-Disposition: form-data; name="stdObject"\r\n\r\n`;
body += `${stdObject}\r\n`;
body += `--${boundary}--\r\n`;

const req = https.request('https://api.movymob.com/Driver/Register', {
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body)
  }
}, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', responseData);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(body);
req.end();
