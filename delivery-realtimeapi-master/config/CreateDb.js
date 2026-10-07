require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const fs = require("fs");
const path = require("path");
const rethink = require("rethinkdb");

function getConfig() {
  const rethinkFile = path.join(__dirname, "rethink.js");
  if (fs.existsSync(rethinkFile)) {
    return require("./rethink");
  }
  return {
    db: process.env.RETHINK_DBNAME,
    host: process.env.RETHINK_HOST,
    port: process.env.RETHINK_PORT,
    user: process.env.RETHINK_USER,
    password: process.env.RETHINK_PASSWORD || "",
  };
}

function parsePort(port) {
  const n = typeof port === "number" ? port : parseInt(String(port || "28015"), 10);
  return Number.isNaN(n) ? 28015 : n;
}

function run(conn, q) {
  return new Promise((resolve, reject) => {
    q.run(conn, (err, res) => (err ? reject(err) : resolve(res)));
  });
}

function connectHostPort(host, port) {
  return new Promise((resolve, reject) => {
    rethink.connect(
      { host, port: parsePort(port), db: "rethinkdb" },
      (err, c) => (err ? reject(err) : resolve(c)),
    );
  });
}

async function ensureDatabaseAndUser() {
  const c = getConfig();
  if (!c.db || !c.host || !c.user) {
    throw new Error("Defina RETHINK_DBNAME, RETHINK_HOST e RETHINK_USER no .env ou config/rethink.js.");
  }
  let conn;
  try {
    conn = await connectHostPort(c.host, c.port);
    const dbs = await run(conn, rethink.dbList());
    if (dbs.indexOf(c.db) === -1) {
      await run(conn, rethink.dbCreate(c.db));
      console.log(`Banco "${c.db}" criado.`);
    }
    const row = await run(conn, rethink.db("rethinkdb").table("users").get(c.user));
    if (!row) {
      await run(
        conn,
        rethink.db("rethinkdb").table("users").insert({ id: c.user, password: c.password || "" }),
      );
      console.log(`Usuário "${c.user}" criado.`);
    }
    await run(
      conn,
      rethink.db(c.db).grant(c.user, { read: true, write: true, config: true }),
    );
    console.log(`Permissões em "${c.db}" para "${c.user}" garantidas.`);
  } finally {
    if (conn) await new Promise((r) => conn.close(() => r()));
  }
}

module.exports = { ensureDatabaseAndUser };

if (require.main === module) {
  ensureDatabaseAndUser().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
