const path = require("path");
const rethink = require("rethinkdb");
const fs = require("fs");
const rethinkFile = path.join(__dirname, "../../config/rethink.js");
const configRethink = fs.existsSync(rethinkFile)
  ? require("../../config/rethink")
  : {
      db: process.env.RETHINK_DBNAME,
      host: process.env.RETHINK_HOST,
      port: process.env.RETHINK_PORT,
      user: process.env.RETHINK_USER,
      password: process.env.RETHINK_PASSWORD,
    };

const tables = ["messages", "orders"];

module.exports = {
  checkAndCreateTables() {
    return new Promise((resolve, reject) => {
      rethink.connect(configRethink, (connErr, conn) => {
        if (connErr) {
          reject(connErr);
          return;
        }
        rethink
          .db(configRethink.db)
          .tableList()
          .run(conn, (err, existing) => {
            if (err) {
              conn.close(() => reject(err));
              return;
            }
            const missing = tables.filter((t) => existing.indexOf(t) === -1);
            if (missing.length === 0) {
              conn.close(() => resolve());
              return;
            }
            let left = missing.length;
            let firstErr = null;
            missing.forEach((table) => {
              rethink
                .db(configRethink.db)
                .tableCreate(table)
                .run(conn, (createErr) => {
                  if (createErr && !firstErr) firstErr = createErr;
                  else if (!createErr) console.log(`Table ${table} created!`);
                  left -= 1;
                  if (left === 0) {
                    conn.close(() => (firstErr ? reject(firstErr) : resolve()));
                  }
                });
            });
          });
      });
    });
  },
};
