require('dotenv').config();
var cors = require("cors");
var app = require("express")();
var cron = require("node-cron");

app.options("*", cors({ credentials: true }));

var https = require("http").createServer(app);

const io = require("socket.io")(https);

const { ensureDatabaseAndUser } = require("./config/CreateDb");
const { trackOrders, checkDriverSearch } = require("./src/tables/Order");
const { trackMessages } = require("./src/tables/Messages");
const { checkAndCreateTables } = require("./src/tables/CheckTables");

let connectionMessages = null;
let connectionOrder = null;
let dateStartSession = null;

io.on("connection", function (socket) {
  const driverId = socket.handshake.query.driverId;

  console.log(`Um usuário conectado`);

  if (driverId) {
    checkDriverSearch(io, driverId);
  }

  console.log(dateStartSession)

  if (checkTimeConnection()) openConnection();

  socket.on("disconnect", function () {
    console.log("Usuário desconectado");
  });
});

function checkTimeConnection() {
  if (!dateStartSession) {
    dateStartSession = new Date();
    return true;
  }

  const now = new Date();

  const result = (now - dateStartSession) / 1000;

  if (result > 1800) {
    dateStartSession = new Date();
    return true;
  }

  return false;
}

function openConnection() {
  closeConnection();

  trackMessages(
    (message) => {
      if (message.companyId) {
        io.emit("deliveryChatCompany_" + message.companyId, message);
      }

      if (message.deliveryOrderId) {
        io.emit("deliveryChat_" + message.deliveryOrderId, message);
        return;
      }

      io.emit("chatTrip_" + message.tripReference, message);
    },
    (connection) => {
      connectionMessages = connection;
    }
  );

  trackOrders(io, (connection) => {
    connectionOrder = connection;
  });
}

function closeConnection() {
  if (connectionOrder)
    connectionOrder.close(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Conexão fechada");
      }
    });

  if (connectionMessages)
    connectionMessages.close(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Conexão fechada");
      }
    });
}

const port = Number(process.env.APP_PORT) || 3000;

ensureDatabaseAndUser()
  .then(() => checkAndCreateTables())
  .then(() => {
    cron.schedule("* * * * *", checkAndCreateTables);
    https.listen(port, "0.0.0.0", () => {
      console.log("Iniciando serviço na porta " + port);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });