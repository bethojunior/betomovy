import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["deliveryCallConfig", "companyDeliveryOrderConfig", "companyDeliveryConfig"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { deliveryCallConfig: [], companyDeliveryOrderConfig: [], companyDeliveryConfig: [] };

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

const found = { radius: null, timeout: null, auto: null };
const callRows = bucket.deliveryCallConfig.map((row) => {
  const text = `${row.key || ""} ${row.description || ""}`.toLowerCase();
  const value = String(row.value ?? "");
  if (found.radius == null && /raio|radius/.test(text)) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) found.radius = /metro|meter/.test(text) ? number / 1000 : number;
  }
  if (found.timeout == null && /timeout|tempo|segund|minut/.test(text)) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) found.timeout = /minut/.test(text) ? Math.round(number * 60) : Math.round(number);
  }
  if (found.auto == null && /auto/.test(text)) found.auto = /^(1|true|sim|yes)$/i.test(value) ? 1 : 0;
  return { key: row.key, fieldType: row.fieldType, value: value.slice(0, 40) };
});

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT DISTINCT city_id AS id FROM establishments UNION SELECT DISTINCT city_id AS id FROM delivery_categories").all().map((row) => row.id));
let calls = 0;
if (found.radius > 0 && found.timeout >= 15) {
  const stmt = db.prepare("INSERT INTO delivery_calls (city_id, radius_km, timeout_seconds, auto_accept) VALUES (?, ?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET radius_km = excluded.radius_km, timeout_seconds = excluded.timeout_seconds, auto_accept = excluded.auto_accept");
  for (const cityId of cities) if (stmt.run(cityId, found.radius, found.timeout, found.auto == null ? 0 : found.auto).changes) calls += 1;
}

const companyCity = new Map(db.prepare("SELECT id, city_id FROM companies").all().map((row) => [row.id, row.city_id]));
function cityOf(companyId) {
  return companyCity.get(`legacy-company-${companyId}`) || "";
}
function cents(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : null;
}

const minimum = new Map();
const prep = new Map();
let skippedOrders = 0;
for (const row of bucket.companyDeliveryOrderConfig) {
  const cityId = cityOf(row.companyId);
  const min = cents(row.minimumOrderValue);
  if (!cityId) { skippedOrders += 1; continue; }
  if (min != null) {
    const current = minimum.get(cityId);
    if (current == null) minimum.set(cityId, min);
    else if (current !== min) minimum.set(cityId, null);
  }
  const open = row.isOpen == null ? "" : String(row.isOpen) === "1" ? "open" : "closed";
  if (open) db.prepare("UPDATE establishments SET status = ? WHERE id = ?").run(open, `legacy-establishment-${row.companyId}`);
}

const fee = new Map();
let skippedFees = 0;
for (const row of bucket.companyDeliveryConfig) {
  const cityId = cityOf(row.companyId);
  const fixed = cents(row.chargeFixedValue);
  const percent = Number(row.chargePercentageValue);
  if (!cityId || fixed == null || (Number.isFinite(percent) && percent > 0)) { skippedFees += 1; continue; }
  const current = fee.get(cityId);
  if (current == null) fee.set(cityId, fixed);
  else if (current !== fixed) fee.set(cityId, null);
}

const minStmt = db.prepare("INSERT INTO delivery_settings (city_id, min_order_cents) VALUES (?, ?) ON CONFLICT(city_id) DO UPDATE SET min_order_cents = excluded.min_order_cents");
let minimums = 0;
for (const [cityId, value] of minimum) if (value != null && minStmt.run(cityId, value).changes) minimums += 1;

const prepStmt = db.prepare("INSERT INTO delivery_prep (city_id, default_fee_cents, prep_minutes) VALUES (?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET prep_minutes = excluded.prep_minutes, default_fee_cents = CASE WHEN excluded.default_fee_cents > 0 THEN excluded.default_fee_cents ELSE default_fee_cents END");
let preps = 0;
const citiesTouched = new Set([...prep.keys(), ...fee.keys()]);
for (const cityId of citiesTouched) {
  const minutes = prep.get(cityId);
  const amount = fee.get(cityId);
  if (minutes == null && amount == null) continue;
  if (prepStmt.run(cityId, amount > 0 ? amount : 0, minutes > 0 ? minutes : 0).changes) preps += 1;
}

console.log(JSON.stringify({
  callRows,
  found,
  calls,
  deliveryCities: cities.size,
  minimums,
  preps,
  skippedOrders,
  skippedFees,
  orderRows: bucket.companyDeliveryOrderConfig.length,
  configRows: bucket.companyDeliveryConfig.length,
  orderKeys: columns.companyDeliveryOrderConfig,
  feeKeys: columns.companyDeliveryConfig
}));
