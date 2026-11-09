import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set([
  "central", "centralUser", "centralNeighborhood", "neighborhood", "company", "companyAddress",
  "deliveryCategory", "deliveryProduct", "deliveryOrder", "deliveryOrderStatus", "deliveryOrderPlace",
  "places", "user", "trip",
]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = {
  central: [], centralUser: [], centralNeighborhood: [], neighborhood: [], company: [], companyAddress: [],
  deliveryCategory: [], deliveryProduct: [], deliveryOrder: [], deliveryOrderStatus: [],
};
const places = new Map();
const orderPlace = new Map();
const users = new Map();
const tripCityCount = new Map();

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
  return value === "NULL" ? null : value;
}

function record(table, values, names) {
  const fields = names || columns[table];
  if (!fields || values.length < fields.length) return;
  const row = {};
  for (let index = 0; index < fields.length; index += 1) row[fields[index]] = values[index];
  if (table === "user") {
    users.set(row.idUser, { name: row.name, email: row.email, cityId: row.cityId });
    return;
  }
  if (table === "trip") {
    if (!row.centralId || !row.cityId) return;
    const counts = tripCityCount.get(row.centralId) || new Map();
    counts.set(row.cityId, (counts.get(row.cityId) || 0) + 1);
    tripCityCount.set(row.centralId, counts);
    return;
  }
  if (table === "places") {
    places.set(row.idPlace, { address: row.address || "", lat: Number(row.latitude), lng: Number(row.longitude) });
    return;
  }
  if (table === "deliveryOrderPlace") {
    if (!orderPlace.has(row.deliveryOrderId)) orderPlace.set(row.deliveryOrderId, row.placeId);
    return;
  }
  bucket[table].push(row);
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
    if (!wanted.has(table)) continue;
    const listed = chunk.match(/^INSERT INTO `[^`]+` \(([^)]*)\) VALUES/);
    const names = listed ? [...listed[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]) : columns[table];
    for (const values of tuples(chunk)) record(table, values, names);
  }
}

console.log(JSON.stringify({
  parsed: {
    central: bucket.central.length,
    centralUser: bucket.centralUser.length,
    centralNeighborhood: bucket.centralNeighborhood.length,
    neighborhood: bucket.neighborhood.length,
    company: bucket.company.length,
    category: bucket.deliveryCategory.length,
    product: bucket.deliveryProduct.length,
    order: bucket.deliveryOrder.length,
    status: bucket.deliveryOrderStatus.length,
    places: places.size,
    orderPlace: orderPlace.size,
    users: users.size,
    usersWithCity: [...users.values()].filter((row) => row.cityId).length,
  },
}));
const cents = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number * 100);
};
const now = new Date().toISOString();
const cityKey = (id) => (id ? `legacy-city-${id}` : null);
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? now : new Date(parsed).toISOString();
};

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT id FROM cities").all().map((row) => row.id));
const drivers = new Set(db.prepare("SELECT id FROM drivers").all().map((row) => row.id));
const customerByUser = new Map();
for (const row of db.prepare("SELECT id, account_id FROM customers").all()) {
  const match = String(row.account_id).match(/^legacy-user-(\d+)$/);
  if (match) customerByUser.set(match[1], row.id);
}
const userCity = new Map();
for (const row of db.prepare("SELECT id, city_id FROM accounts WHERE id LIKE 'legacy-user-%'").all()) {
  userCity.set(row.id.slice("legacy-user-".length), row.city_id);
}

const neighborhood = new Map(bucket.neighborhood.filter((row) => !row.deleted_at).map((row) => [row.id, row]));
const statusName = new Map(bucket.deliveryOrderStatus.map((row) => [row.id, `${row.name || ""} ${row.label || ""}`]));
const companyCity = new Map(bucket.company.map((row) => [row.id, row.cityId]));
const addressByCompany = new Map();
for (const row of bucket.companyAddress) {
  if (row.deleted_at) continue;
  const current = addressByCompany.get(row.companyId);
  if (!current || row.isDefault === "1") addressByCompany.set(row.companyId, row);
}

function orderStatus(id) {
  const name = String(statusName.get(id) || "").toLowerCase();
  if (name.includes("cancel")) return "cancelled";
  if (name.includes("entreg") || name.includes("deliver") || name.includes("final") || name.includes("conclu")) return "delivered";
  if (name.includes("retira") || name.includes("pick") || name.includes("saiu") || name.includes("caminho")) return "picked_up";
  if (name.includes("prepar") || name.includes("produz") || name.includes("cozinha")) return "preparing";
  return "placed";
}

function mode(ids) {
  const count = new Map();
  for (const id of ids) {
    if (!id || !cities.has(id)) continue;
    count.set(id, (count.get(id) || 0) + 1);
  }
  let best = null;
  let wins = 0;
  for (const [id, total] of count) if (total > wins) {
    best = id;
    wins = total;
  }
  return best;
}

db.exec("BEGIN");
const centralStmt = db.prepare("INSERT OR IGNORE INTO centrals (id, name, address, city_id, phone, balance_cents, status) VALUES (?, ?, ?, ?, NULL, 0, ?)");
const centralUserStmt = db.prepare("INSERT OR IGNORE INTO central_users (id, central_id, name, email, role, active) VALUES (?, ?, ?, ?, ?, ?)");
const hoodStmt = db.prepare("INSERT OR IGNORE INTO neighborhoods (id, central_id, name, flat_cents, active) VALUES (?, ?, ?, ?, 1)");
const categoryStmt = db.prepare("INSERT OR IGNORE INTO delivery_categories (id, name, city_id, active) VALUES (?, ?, ?, 1)");
const placeStmt = db.prepare("INSERT OR IGNORE INTO establishments (id, name, category_id, city_id, phone, address, latitude, longitude, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
const itemStmt = db.prepare("INSERT OR IGNORE INTO delivery_menu_items (id, establishment_id, name, price_cents, active) VALUES (?, ?, ?, ?, ?)");
const orderStmt = db.prepare("INSERT OR IGNORE INTO delivery_orders (id, code, establishment_id, customer_id, driver_id, address, latitude, longitude, subtotal_cents, fee_cents, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

const hoodsByCentral = new Map();
for (const row of bucket.centralNeighborhood) {
  if (row.deleted_at) continue;
  const place = neighborhood.get(row.neighborhoodId);
  if (!place) continue;
  const list = hoodsByCentral.get(row.centralId) || [];
  list.push({ id: row.id, name: String(place.name || "").trim(), cityId: place.cityId, cents: cents(row.value) });
  hoodsByCentral.set(row.centralId, list);
}

let centrals = 0;
let skippedCentrals = 0;
let namedCentrals = 0;
let cityHits = 0;
const centralCity = new Map();
for (const row of bucket.central) {
  const name = String(row.name || "").trim();
  const fromHoods = (hoodsByCentral.get(row.id) || []).map((item) => cityKey(item.cityId));
  const fromUsers = bucket.centralUser.filter((item) => item.centralId === row.id).map((item) => userCity.get(item.userId) || cityKey(users.get(item.userId)?.cityId));
  const fromTrips = [];
  const counts = tripCityCount.get(row.id);
  if (counts) for (const [id, total] of counts) for (let n = 0; n < total; n += 1) fromTrips.push(cityKey(id));
  const city = mode([...fromHoods, ...fromUsers, ...fromTrips]);
  if (name) namedCentrals += 1;
  if (city) cityHits += 1;
  if (!name || !city) {
    skippedCentrals += 1;
    continue;
  }
  centralStmt.run(`legacy-central-${row.id}`, name, row.address || null, city, String(row.active) === "1" ? "active" : "paused");
  centralCity.set(row.id, city);
  centrals += 1;
}

let centralUsers = 0;
for (const row of bucket.centralUser) {
  if (!centralCity.has(row.centralId)) continue;
  const user = users.get(row.userId);
  const name = String(user?.name || "").trim();
  const email = String(user?.email || "").trim();
  if (!name || !email) continue;
  centralUserStmt.run(`legacy-central-user-${row.id}`, `legacy-central-${row.centralId}`, name, email, String(row.isAdmin) === "1" ? "supervisor" : "operator", String(row.statusId) === "1" ? 1 : 0);
  centralUsers += 1;
}

let hoods = 0;
for (const [central, list] of hoodsByCentral) {
  if (!centralCity.has(central)) continue;
  for (const item of list) {
    if (!item.name) continue;
    hoodStmt.run(`legacy-hood-${item.id}`, `legacy-central-${central}`, item.name, item.cents);
    hoods += 1;
  }
}

const categoryByCompany = new Map();
let categories = 0;
for (const row of bucket.deliveryCategory) {
  if (row.deleted_at) continue;
  const city = cityKey(companyCity.get(row.companyId));
  const name = String(row.name || "").trim();
  if (!name || !city || !cities.has(city)) continue;
  const id = `legacy-delivery-cat-${row.id}`;
  categoryStmt.run(id, name, city);
  if (!categoryByCompany.has(row.companyId)) categoryByCompany.set(row.companyId, id);
  categories += 1;
}

let establishments = 0;
let skippedPlaces = 0;
const establishmentReady = new Set();
for (const row of bucket.company) {
  const category = categoryByCompany.get(row.id);
  const city = cityKey(row.cityId);
  const fallback = addressByCompany.get(row.id);
  const lat = Number(row.latitude ?? fallback?.latitude);
  const lng = Number(row.longitude ?? fallback?.longitude);
  if (!category || !city || !cities.has(city) || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    skippedPlaces += 1;
    continue;
  }
  placeStmt.run(`legacy-establishment-${row.id}`, String(row.fantasyName || row.name).trim(), category, city, row.phone || null, row.address || fallback?.address || null, lat, lng, String(row.statusId) === "1" ? "open" : "closed", now);
  establishmentReady.add(row.id);
  establishments += 1;
}

let items = 0;
for (const row of bucket.deliveryProduct) {
  if (!establishmentReady.has(row.companyId) || row.deleted_at) continue;
  const name = String(row.name || "").trim();
  if (!name) continue;
  itemStmt.run(`legacy-item-${row.id}`, `legacy-establishment-${row.companyId}`, name, cents(row.price), String(row.active) === "0" ? 0 : 1);
  items += 1;
}

let orders = 0;
let skippedOrders = 0;
const seenCode = new Set();
for (const row of bucket.deliveryOrder) {
  const place = places.get(orderPlace.get(row.id));
  const customer = customerByUser.get(row.userId);
  const address = String(place?.address || "").trim();
  if (!establishmentReady.has(String(row.companyId)) || !customer || !address || !Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
    skippedOrders += 1;
    continue;
  }
  let code = String(row.verificationCode || `DO-${row.id}`);
  if (seenCode.has(code)) code = `${code}-${row.id}`;
  seenCode.add(code);
  const driver = drivers.has(`legacy-driver-${row.driverId}`) ? `legacy-driver-${row.driverId}` : null;
  const subtotal = cents(row.value);
  const fee = cents(row.deliveryFee);
  orderStmt.run(`legacy-order-${row.id}`, code, `legacy-establishment-${row.companyId}`, customer, driver, address.slice(0, 240), place.lat, place.lng, subtotal, fee, subtotal + fee, orderStatus(row.deliveryOrderStatusId), when(row.created_at));
  orders += 1;
}

db.exec("COMMIT");
console.log(JSON.stringify({
  centrals, namedCentrals, cityHits, skippedCentrals, centralUsers, hoods, categories, establishments, skippedPlaces, items, orders, skippedOrders,
  linkedUsers: bucket.centralUser.filter((row) => users.has(row.userId)).length,
  knownCity: bucket.centralUser.filter((row) => cities.has(userCity.get(row.userId) || cityKey(users.get(row.userId)?.cityId) || "")).length,
}));
db.close();
