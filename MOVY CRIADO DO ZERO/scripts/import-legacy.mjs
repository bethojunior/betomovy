import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set([
  "estate", "city", "customer", "driver", "user", "company", "tripType", "price",
  "origin", "destination", "trip", "tripPaymentForm",
]);

const columns = {};
let creating = "";
let createCols = [];
const bucket = {
  estate: [], city: [], customer: [], driver: [], user: [], company: [],
  tripType: [], price: [], trip: [], tripPaymentForm: [],
};
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
        if (char === "'" && input[i + 1] === "'") {
          cur += "'";
          i += 2;
          continue;
        }
        if (char === "'") {
          inString = false;
          i += 1;
          continue;
        }
        cur += char;
        i += 1;
        continue;
      }
      if (char === "'") {
        inString = true;
        i += 1;
        continue;
      }
      if (char === ",") {
        row.push(clean(cur));
        cur = "";
        i += 1;
        continue;
      }
      if (char === ")") {
        row.push(clean(cur));
        i += 1;
        yield row;
        break;
      }
      cur += char;
      i += 1;
    }
  }
}

function clean(raw) {
  const value = raw.trim();
  if (value === "NULL") return null;
  return value;
}

function record(table, values, names) {
  const fields = names || columns[table];
  if (!fields || values.length < fields.length) return;
  const row = {};
  for (let index = 0; index < fields.length; index += 1) row[fields[index]] = values[index];
  delete row.password;
  delete row.api_token;
  delete row.deviceToken;
  if (table === "origin" && row.idOrigin) origin.set(row.idOrigin, row.address || "");
  else if (table === "destination" && row.idDestination) destination.set(row.idDestination, row.address || "");
  else bucket[table].push(row);
}

const rl = readline.createInterface({ input: fs.createReadStream(dump), crlfDelay: Infinity });
let pending = "";
let pendingTable = "";
for await (const line of rl) {
  const start = line.match(/^CREATE TABLE `([^`]+)`/);
  if (start) {
    creating = wanted.has(start[1]) ? start[1] : "";
    createCols = [];
    continue;
  }
  if (creating) {
    const column = line.match(/^  `([^`]+)` /);
    if (column) createCols.push(column[1]);
    if (line.startsWith(") ENGINE")) {
      columns[creating] = createCols;
      creating = "";
    }
    continue;
  }
  const insert = line.match(/^INSERT INTO `([^`]+)` /);
  if (insert || pending) {
    const table = insert ? insert[1] : pendingTable;
    const chunk = pending ? `${pending}\n${line}` : line;
    if (!chunk.endsWith(";")) {
      pending = chunk;
      pendingTable = table;
      continue;
    }
    pending = "";
    if (wanted.has(table)) {
      const listed = chunk.match(/^INSERT INTO `[^`]+` \(([^)]*)\) VALUES/);
      const names = listed ? [...listed[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]) : columns[table];
      for (const values of tuples(chunk)) record(table, values, names);
    }
  }
}

const cents = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number * 100);
};
const now = new Date().toISOString();
const cityId = (id) => (id ? `legacy-city-${id}` : null);
const userId = (id) => (id ? `legacy-user-${id}` : null);
const estates = new Map(bucket.estate.map((row) => [row.id, row.sigla || row.nome || ""]));
const users = new Map(bucket.user.map((row) => [row.idUser, row]));
const types = new Map(bucket.tripType.map((row) => [row.idTripType, row.type || "Trip"]));
const payments = new Map(bucket.tripPaymentForm.map((row) => [row.idTripPaymentForm, row.name || ""]));

function personStatus(user) {
  if (!user) return "pending";
  if (user.blocked === "1" || user.blocked === 1) return "blocked";
  return String(user.statusId) === "1" ? "active" : "pending";
}

function driverStatus(driver, user) {
  const raw = String(driver.status || "").toLowerCase();
  if (personStatus(user) === "blocked" || raw.includes("block") || raw.includes("bloq")) return "blocked";
  if (raw === "ativo" || raw === "active" || raw === "available" || personStatus(user) === "active") return "approved";
  return "pending";
}

function payCode(id) {
  const name = String(payments.get(id) || "").toLowerCase();
  if (name.includes("dinheiro") || name.includes("cash") || name.includes("espec")) return "cash";
  if (name.includes("voucher") || name.includes("carteira") || name.includes("wallet")) return "wallet";
  if (name.includes("fatur")) return "invoice";
  return "card";
}

function tripStatus(value) {
  const status = String(value || "").toLowerCase();
  if (status.includes("finish") || status.includes("final") || status === "completed" || status === "done") return "completed";
  if (status.includes("cancel")) return "cancelled";
  if (status.includes("board") || status.includes("arriv") || status.includes("wait")) return "arriving";
  if (status.includes("progress") || status.includes("start")) return "in_progress";
  if (status.includes("accept")) return "accepted";
  return "requested";
}

const db = new DatabaseSync(dbPath);
db.exec("BEGIN");
const cityStmt = db.prepare("INSERT OR IGNORE INTO cities (id, name, state, country, timezone, active, updated_at) VALUES (?, ?, ?, 'Brazil', 'America/Sao_Paulo', ?, ?)");
const accountStmt = db.prepare("INSERT OR IGNORE INTO accounts (id, name, document, phone, email, birth_date, gender, status, blocked, city_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
const customerStmt = db.prepare("INSERT OR IGNORE INTO customers (id, account_id, balance_cents, register_status, updated_at) VALUES (?, ?, 0, ?, ?)");
const driverStmt = db.prepare("INSERT OR IGNORE INTO drivers (id, account_id, city_id, register_status, presence, service, cnh, vehicle, plate, rating, balance_cents, latitude, longitude, updated_at) VALUES (?, ?, ?, ?, 'offline', 'private', ?, '', '', ?, 0, ?, ?, ?)");
const companyStmt = db.prepare("INSERT OR IGNORE INTO companies (id, legal_name, trade_name, document, email, phone, address, city_id, balance_cents, credit_limit_cents, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)");
const typeStmt = db.prepare("INSERT OR IGNORE INTO trip_types (id, city_id, name, base_cents, per_km_cents, per_minute_cents, minimum_cents, tax_cents, seats, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4, ?, ?)");
const tripStmt = db.prepare("INSERT OR IGNORE INTO trips (id, reference, status, customer_id, company_id, driver_id, city_id, trip_type_id, origin, destination, distance_km, duration_min, fare_cents, payment, cancelled_by, created_at, updated_at) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
const tripPayStmt = db.prepare("UPDATE trips SET payment = ? WHERE id = ?");

let cities = 0;
for (const row of bucket.city) {
  const name = String(row.nome || "").trim();
  if (!name) continue;
  cityStmt.run(cityId(row.id), name, estates.get(row.estado) || "", String(row.statusId) === "1" ? 1 : 0, now);
  cities += 1;
}

const customerUsers = new Set();
let customers = 0;
for (const row of bucket.customer) {
  const user = users.get(row.userId);
  const name = String(user?.name || row.name || "").trim();
  if (!name) continue;
  const account = user ? userId(user.idUser) : `legacy-customer-${row.idCustomer}`;
  if (user) customerUsers.add(user.idUser);
  accountStmt.run(account, name, user?.document || null, user?.phone || row.phone || null, user?.email || null, user?.dateOfBirth || null, user?.gender || null, personStatus(user), personStatus(user) === "blocked" ? 1 : 0, cityId(user?.cityId), user?.created_at || now, now);
  customerStmt.run(`legacy-customer-${row.idCustomer}`, account, personStatus(user), now);
  customers += 1;
}

let drivers = 0;
for (const row of bucket.driver) {
  const user = users.get(row.userId);
  const name = String(user?.name || "").trim();
  if (!name) continue;
  const account = userId(user.idUser);
  if (!customerUsers.has(user.idUser)) {
    accountStmt.run(account, name, user.document || null, user.phone || null, user.email || null, user.dateOfBirth || null, user.gender || null, personStatus(user), personStatus(user) === "blocked" ? 1 : 0, cityId(row.cityId || user.cityId), user.created_at || now, now);
  }
  const rating = Number(user.rating || row.performanceGrade || 5);
  const lat = Number(row.last_lat);
  const lng = Number(row.last_lon);
  driverStmt.run(`legacy-driver-${row.idDriver}`, account, cityId(row.cityId || user.cityId), driverStatus(row, user), row.cnh || null, Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 5, Number.isFinite(lat) ? lat : null, Number.isFinite(lng) ? lng : null, now);
  drivers += 1;
}

let companies = 0;
for (const row of bucket.company) {
  const name = String(row.name || "").trim();
  if (!name) continue;
  companyStmt.run(`legacy-company-${row.id}`, name, row.fantasyName || null, row.document || null, row.email || null, row.phone || null, row.address || null, cityId(row.cityId), cents(row.voucherLimit), String(row.statusId) === "1" ? "active" : "pending", now);
  companies += 1;
}

const typeByCity = new Map();
let tariffs = 0;
for (const row of bucket.price) {
  if (!row.cityId) continue;
  const id = `legacy-price-${row.id}`;
  typeStmt.run(id, cityId(row.cityId), String(row.name || types.get(row.tripTypeId) || "Trip").slice(0, 80), cents(row.base_price), cents(row.km_price), cents(row.minute_price), cents(row.min_price), String(row.tax_price_type || "").includes("%") ? 0 : cents(row.tax_price), String(row.statusId) === "1" ? 1 : 0, now);
  typeByCity.set(`${row.cityId}:${row.tripTypeId}`, id);
  tariffs += 1;
}

let trips = 0;
let skippedTrips = 0;
const seenRef = new Set();
for (const row of bucket.trip) {
  const from = String(origin.get(row.originId) || "").trim();
  const to = String(destination.get(row.destinationId) || "").trim();
  const typeId = typeByCity.get(`${row.cityId}:${row.tripTypeId}`);
  if (!from || !to || !typeId || !row.cityId) {
    skippedTrips += 1;
    continue;
  }
  let reference = String(row.tripReference || `LEG-${row.idTrip}`);
  if (seenRef.has(reference)) reference = `${reference}-${row.idTrip}`;
  seenRef.add(reference);
  const when = row.date ? new Date(String(row.date).replace(" ", "T") + "Z").toISOString() : now;
  const cancelled = tripStatus(row.status) === "cancelled" ? (String(row.canceledBy || "").toLowerCase().includes("driver") ? "driver" : "rider") : null;
  tripStmt.run(`legacy-trip-${row.idTrip}`, reference, tripStatus(row.status), row.customerId ? `legacy-customer-${row.customerId}` : null, row.driverId ? `legacy-driver-${row.driverId}` : null, cityId(row.cityId), typeId, from.slice(0, 240), to.slice(0, 240), Number(row.distance) || 0, Number(row.estimatedTripTime) || 0, cents(row.price), payCode(row.tripPaymentFormId), cancelled, Number.isNaN(Date.parse(when)) ? now : when, now);
  tripPayStmt.run(payCode(row.tripPaymentFormId), `legacy-trip-${row.idTrip}`);
  trips += 1;
}

db.exec("COMMIT");
console.log(JSON.stringify({ cities, customers, drivers, companies, tariffs, trips, skippedTrips, users: bucket.user.length, origins: origin.size, destinations: destination.size }));
db.close();
