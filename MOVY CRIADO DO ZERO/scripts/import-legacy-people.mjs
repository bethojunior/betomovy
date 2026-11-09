import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["places", "removeAccountRequest", "car", "notification", "userType", "balanceFlow", "balanceFlowType", "driver"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { places: [], removeAccountRequest: [], notification: [], userType: [], balanceFlow: [], balanceFlowType: [] };
const cars = new Map();
const driverBalance = new Map();

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
  delete row.renavam;
  delete row.document;
  delete row.rentalCompanyDocument;
  delete row.ip;
  if (table === "driver") { driverBalance.set(row.balanceId, row.idDriver); return; }
  if (table === "car") {
    if (row.deleted_at || !row.driverId) return;
    const current = cars.get(row.driverId);
    if (!current || (String(current.pending) === "1" && String(row.pending) !== "1")) cars.set(row.driverId, row);
    return;
  }
  bucket[table].push(row);
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
  return Number.isFinite(number) ? Math.round(Math.abs(number) * 100) : null;
}
const now = new Date().toISOString();
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? now : new Date(parsed).toISOString();
};
function direction(name) {
  const text = String(name || "").toLowerCase();
  if (text.includes("entrada") || text.includes("crédito") || text.includes("credito")) return "credit";
  if (text.includes("saida") || text.includes("saída") || text.includes("saque") || text.includes("débito") || text.includes("debito")) return "debit";
  return "";
}
function audience(row) {
  if (!row) return "";
  const text = String(row.name || "").toLowerCase();
  if (String(row.isDriver) === "1" || text.includes("motor") || text.includes("driver")) return "drivers";
  if (text.includes("client") || text.includes("pass")) return "riders";
  return "";
}

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT id FROM cities").all().map((row) => row.id));
const drivers = new Set(db.prepare("SELECT id FROM drivers WHERE id LIKE 'legacy-driver-%'").all().map((row) => row.id));
const customerByUser = new Map();
const driverByUser = new Map();
for (const row of db.prepare("SELECT id, account_id FROM customers WHERE account_id LIKE 'legacy-user-%'").all()) customerByUser.set(row.account_id.slice("legacy-user-".length), row.id);
for (const row of db.prepare("SELECT id, account_id FROM drivers WHERE account_id LIKE 'legacy-user-%'").all()) driverByUser.set(row.account_id.slice("legacy-user-".length), row.id);
const types = new Map(bucket.userType.map((row) => [String(row.idUserType), row]));
const flowTypes = new Map(bucket.balanceFlowType.map((row) => [row.idBalanceFlowType, row.name || ""]));

db.exec("BEGIN");
const placeStmt = db.prepare("INSERT OR IGNORE INTO places (id, name, address, city_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)");
let places = 0;
let placeNamed = 0;
let placeCity = 0;
let placeCoord = 0;
let placeWithCity = 0;
let placeCitySample = "";
for (const row of bucket.places) {
  const address = [row.address, row.number].filter(Boolean).join(", ").trim();
  const name = String(row.alias || "").trim() || address;
  const city = row.cityId ? `legacy-city-${row.cityId}` : "";
  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  if (row.cityId) { placeWithCity += 1; if (!placeCitySample) placeCitySample = city; }
  if (name) placeNamed += 1;
  if (cities.has(city)) placeCity += 1;
  if (Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)) placeCoord += 1;
  if (!name || !address || !cities.has(city) || !Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) continue;
  placeStmt.run(`legacy-place-${row.idPlace}`, name.slice(0, 120), address.slice(0, 240), city, lat, lng);
  places += 1;
}

const carStmt = db.prepare("UPDATE drivers SET vehicle = ?, plate = ? WHERE id = ? AND vehicle = ''");
let vehicles = 0;
let plates = 0;
let driverHit = 0;
let withPlate = 0;
let withBrand = 0;
for (const [driverId, row] of cars) {
  const id = drivers.has(`legacy-driver-${driverId}`) ? `legacy-driver-${driverId}` : driverByUser.get(String(driverId)) || "";
  const plate = String(row.plate || "").trim();
  const vehicle = [row.brand, row.model, row.color].filter(Boolean).join(" ").trim();
  if (plate) withPlate += 1;
  if (vehicle) withBrand += 1;
  if (!id || !drivers.has(id) || !vehicle) continue;
  driverHit += 1;
  if (carStmt.run(vehicle.slice(0, 80), plate.slice(0, 16), id).changes) {
    vehicles += 1;
    if (plate) plates += 1;
  }
}

const deletionStmt = db.prepare("INSERT OR IGNORE INTO account_deletions (id, subject, customer_id, driver_id, reason, status, requested_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
let deletions = 0;
for (const row of bucket.removeAccountRequest) {
  if (row.deleted_at) continue;
  const kind = String(row.type || "").toLowerCase();
  const driver = kind.includes("motor") || kind.includes("driver") ? driverByUser.get(row.userId) : null;
  const customer = kind.includes("client") || kind.includes("pass") || kind.includes("usu") || kind.includes("customer") ? customerByUser.get(row.userId) : null;
  const reason = String(row.reason || row.details || "").trim();
  if ((!driver && !customer) || !reason) continue;
  deletionStmt.run(`legacy-deletion-${row.id}`, driver ? "driver" : "customer", customer, driver, reason.slice(0, 240), row.userIdWhoDeleted ? "approved" : "pending", when(row.created_at));
  deletions += 1;
}

const noteStmt = db.prepare("INSERT OR IGNORE INTO notifications (id, audience, title, body, city_id, status, sent_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
let notes = 0;
let noteRows = bucket.notification.length;
let noteMatch = 0;
for (const row of bucket.notification) {
  const who = audience(types.get(String(row.userTypeId)));
  if (who) noteMatch += 1;
  const title = String(row.title || "").trim();
  const body = String(row.message || "").trim();
  if (!who || !title || !body) continue;
  const city = row.cityId ? `legacy-city-${row.cityId}` : null;
  const sent = row.dateSend || (String(row.statusId) === "1" ? row.date || row.created_at : null);
  noteStmt.run(`legacy-note-${row.idNotification}`, who, title.slice(0, 120), body, city && cities.has(city) ? city : null, sent ? "sent" : "draft", sent ? when(sent) : null);
  notes += 1;
}

const ledgerStmt = db.prepare("INSERT OR IGNORE INTO ledger_entries (id, driver_id, direction, amount_cents, reason, status, created_at) VALUES (?, ?, ?, ?, ?, 'posted', ?)");
let ledger = 0;
let skippedFlows = 0;
for (const row of bucket.balanceFlow) {
  const driverId = driverBalance.get(row.balanceId);
  const driver = driverId ? `legacy-driver-${driverId}` : "";
  const way = direction(flowTypes.get(row.balanceFlowTypeId));
  const amount = money(row.value);
  const reason = String(row.observation || flowTypes.get(row.balanceFlowTypeId) || "").trim();
  if (!drivers.has(driver) || !way || !amount || !reason) { skippedFlows += 1; continue; }
  ledgerStmt.run(`legacy-flow-${row.idBalanceFlow}`, driver, way, amount, reason.slice(0, 180), when(row.date));
  ledger += 1;
}

db.exec("COMMIT");
console.log(JSON.stringify({
  places, placeWithCity, placeCoord, driverHit, deletions, notes, noteRows, ledger, skippedFlows,
  userTypeKeys: Object.keys(bucket.userType[0] || {}),
  noteKeys: Object.keys(bucket.notification[0] || {}),
  carKeys: Object.keys(cars.values().next().value || {}),
  noteMatch,
  typeIds: [...types.keys()].slice(0, 15),
  noteTypeIds: [...new Set(bucket.notification.map((row) => row.userTypeId))].slice(0, 15),
}));
db.close();
