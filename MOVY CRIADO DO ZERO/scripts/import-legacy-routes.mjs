import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["origin", "destination", "route", "routeDriverAccepted", "contactUs", "userType"]);
const columns = {};
let creating = "";
let createCols = [];
const routes = [];
const routeDrivers = [];
const contacts = [];
const userTypes = new Map();
const origin = new Map();
const destination = new Map();

function* tuples(input) {
  let i = input.indexOf("VALUES");
  if (i < 0) return;
  i = input.indexOf("(", i);
  const n = input.length;
  while (i < n) {
    while (i < n && input[i] !== "(") i += 1;
    if (i >= n) break;
    i += 1;
    const row = [];
    let cur = "";
    let inString = false;
    while (i < n) {
      const char = input[i];
      if (inString) {
        if (char === "\\" && i + 1 < n) {
          const next = input[i + 1];
          cur += next === "n" ? "\n" : next === "r" ? "\r" : next === "t" ? "\t" : next;
          i += 2;
          continue;
        }
        if (char === "'" && input[i + 1] === "'") { cur += "'"; i += 2; continue; }
        if (char === "'") { inString = false; i += 1; continue; }
        cur += char;
        i += 1;
        continue;
      }
      if (char === "'") { inString = true; i += 1; continue; }
      if (char === ",") { row.push(clean(cur)); cur = ""; i += 1; continue; }
      if (char === ")") { row.push(clean(cur)); i += 1; yield row; break; }
      cur += char;
      i += 1;
    }
  }
}

function clean(raw) {
  const value = raw.trim();
  return value === "NULL" ? null : value;
}

function record(table, values, names) {
  const fields = names || columns[table];
  if (!fields || values.length < fields.length) return;
  const row = {};
  for (let index = 0; index < fields.length; index += 1) row[fields[index]] = values[index];
  if (table === "origin") { if (row.idOrigin && row.address) origin.set(row.idOrigin, String(row.address).trim()); return; }
  if (table === "destination") { if (row.idDestination && row.address) destination.set(row.idDestination, String(row.address).trim()); return; }
  if (table === "userType") { userTypes.set(row.idUserType || row.id, row.name || ""); return; }
  if (table === "route") routes.push(row);
  else if (table === "routeDriverAccepted") routeDrivers.push(row);
  else contacts.push(row);
}

const rl = readline.createInterface({ input: fs.createReadStream(dump), crlfDelay: Infinity });
let pending = "";
let pendingTable = "";
for await (const line of rl) {
  const start = line.match(/^CREATE TABLE `([^`]+)`/);
  if (start) { creating = wanted.has(start[1]) ? start[1] : ""; createCols = []; continue; }
  if (creating) {
    const column = line.match(/^  `([^`]+)` /);
    if (column) createCols.push(column[1]);
    if (line.startsWith(") ENGINE")) { columns[creating] = createCols; creating = ""; }
    continue;
  }
  const insert = line.match(/^INSERT INTO `([^`]+)` /);
  if (insert || pending) {
    const table = insert ? insert[1] : pendingTable;
    const chunk = pending ? `${pending}\n${line}` : line;
    if (!chunk.endsWith(";")) { pending = chunk; pendingTable = table; continue; }
    pending = "";
    if (!wanted.has(table)) continue;
    const listed = chunk.match(/^INSERT INTO `[^`]+` \(([^)]*)\) VALUES/);
    const names = listed ? [...listed[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]) : columns[table];
    for (const values of tuples(chunk)) record(table, values, names);
  }
}

function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) : null;
}
const now = new Date().toISOString();
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? now : new Date(parsed).toISOString();
};

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT id FROM cities").all().map((row) => row.id));
const drivers = new Set(db.prepare("SELECT id FROM drivers").all().map((row) => row.id));
const customerByUser = new Map();
for (const row of db.prepare("SELECT id, account_id FROM customers WHERE account_id LIKE 'legacy-user-%'").all()) customerByUser.set(row.account_id.slice("legacy-user-".length), row.id);

db.exec("BEGIN");
const routeStmt = db.prepare("INSERT OR IGNORE INTO routes (id, city_id, name, origin, destination, price_cents, active) VALUES (?, ?, ?, ?, ?, ?, ?)");
const ready = new Set();
let savedRoutes = 0;
let skippedRoutes = 0;
for (const row of routes) {
  const city = row.cityId ? `legacy-city-${row.cityId}` : "";
  const from = origin.get(row.originId);
  const to = destination.get(row.destinationId);
  const price = money(row.price);
  const name = String(row.name || "").trim();
  if (!name || !from || !to || price == null || !cities.has(city)) { skippedRoutes += 1; continue; }
  routeStmt.run(`legacy-route-${row.id}`, city, name, from.slice(0, 240), to.slice(0, 240), price, String(row.active) === "1" && String(row.statusId) === "1" ? 1 : 0);
  ready.add(row.id);
  savedRoutes += 1;
}
const driverStmt = db.prepare("INSERT OR IGNORE INTO route_drivers (route_id, driver_id, active) VALUES (?, ?, ?)");
let savedDrivers = 0;
for (const row of routeDrivers) {
  const driver = `legacy-driver-${row.driverId}`;
  if (!ready.has(row.routeId) || !drivers.has(driver)) continue;
  driverStmt.run(`legacy-route-${row.routeId}`, driver, String(row.active) === "1" ? 1 : 0);
  savedDrivers += 1;
}
const ticketStmt = db.prepare("INSERT OR IGNORE INTO support_tickets (id, kind, customer_id, trip_id, subject, message, status, created_at) VALUES (?, 'rider', ?, NULL, ?, ?, ?, ?)");
let tickets = 0;
for (const row of contacts) {
  const message = String(row.message || "").trim();
  const who = String(userTypes.get(row.userTypeId) || "").toLowerCase();
  if (!message || (who && !who.includes("client") && !who.includes("pass") && !who.includes("usu"))) continue;
  const customer = customerByUser.get(row.userId) || null;
  ticketStmt.run(`legacy-ticket-${row.idContactUs}`, customer, message.slice(0, 80), message, String(row.statusId) === "1" ? "open" : "closed", when(row.created_at));
  tickets += 1;
}
db.exec("COMMIT");
console.log(JSON.stringify({ routes: savedRoutes, skippedRoutes, routeDrivers: savedDrivers, tickets, origins: origin.size, destinations: destination.size }));
db.close();
