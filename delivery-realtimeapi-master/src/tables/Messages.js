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

const table = "messages";

module.exports = {
  trackMessages(callback,callbackConnection) {
    rethink
      .connect(configRethink)
      .then((conn) => {
        return rethink.table(table).changes().run(conn);
      })
      .then((cursor) => {
        callbackConnection(cursor);
        cursor.each((err, now) => {
          if (err) throw err;

          if (callback) callback(now.new_val);
        });
      });
  },
};
