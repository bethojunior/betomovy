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

const OrderService = require("../services/OrderService");

const table = "orders";

module.exports = {
  trackOrders(socket, callback) {
    rethink
      .connect(configRethink)
      .then((conn) => {
        return rethink.table(table).changes().run(conn);
      })
      .then((cursor) => {
        callback(cursor);
        cursor.each((err, now) => {
          if (err) throw err;
          
          OrderService.realtime(socket, now.new_val);
        });
      });
  },
  checkDriverSearch(socket, driverId) {
    rethink
      .connect(configRethink)
      .then((conn) => {
        return rethink
          .table(table)
          .filter((order) => {
            return order("delivery_order_status")("id").eq(4);
          })
          .run(conn);
      })
      .then((cursor) => {
        let order = null;
        cursor.each((err, now) => {
          if (err) throw err;

          if (order == null && Array.isArray(now.callingDriver)) {
            order =
              now.callingDriver.find((id) => id === driverId) != null
                ? now
                : null;
            if (order != null)
              socket.emit(`searchDriverOrder_${driverId}`, order);
          }
        });
      });
  },
};
