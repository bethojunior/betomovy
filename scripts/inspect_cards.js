const mysql = require('mysql2/promise');

async function test() {
  const conn = await mysql.createConnection('mysql://doadmin:AVNS_ODYdiYw4rvg6gfvKYOO@movy-mysql-do-user-17937402-0.c.db.ondigitalocean.com:25060/movy_db?ssl={"rejectUnauthorized":false}');
  const [rows] = await conn.execute('SELECT * FROM card ORDER BY idCard DESC LIMIT 5');
  console.log('CARDS:', JSON.stringify(rows, null, 2));
  const [cardInfo] = await conn.execute('SELECT * FROM cardInfo ORDER BY id DESC LIMIT 5');
  console.log('CARD_INFO:', JSON.stringify(cardInfo, null, 2));
  await conn.end();
}

test().catch(console.error);
