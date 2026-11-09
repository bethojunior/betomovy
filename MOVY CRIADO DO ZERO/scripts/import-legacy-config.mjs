import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["config", "pushConfig", "tripPaymentForm", "externalService", "externalServiceMetaData"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { config: [], pushConfig: [], tripPaymentForm: [], externalService: [], externalServiceMetaData: [] };
const secretKey = /token|secret|password|senha|private|smtp|json|api_?key|access/i;

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
  for (let index = 0; index < fields.length; index += 1) {
    if (table === "externalServiceMetaData" && fields[index] === "value" && secretKey.test(String(values[fields.indexOf("key")] || ""))) continue;
    if (table === "config" && fields[index] === "value" && secretKey.test(String(values[fields.indexOf("key")] || ""))) continue;
    row[fields[index]] = values[index];
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

const db = new DatabaseSync(dbPath);
const config = new Map();
let hiddenConfig = 0;
for (const row of bucket.config) {
  const key = String(row.key || "");
  if (!key) continue;
  if (secretKey.test(key) || row.value == null) { hiddenConfig += 1; continue; }
  config.set(key, String(row.value));
}

const offer = Number(config.get("time_in_seconds_to_call_driver"));
let offerUpdated = 0;
if (Number.isFinite(offer) && offer > 0 && db.prepare("SELECT id FROM dispatch_settings WHERE id = 'default'").get()) {
  offerUpdated = db.prepare("UPDATE dispatch_settings SET offer_seconds = ? WHERE id = 'default'").run(Math.round(offer)).changes;
}
const firestore = config.get("cloud_firestore");
let firestoreUpdated = 0;
if (firestore != null && db.prepare("SELECT id FROM firebase_status WHERE id = 'default'").get()) {
  const on = /^(1|true|yes|sim)$/i.test(firestore) ? 1 : 0;
  firestoreUpdated = db.prepare("UPDATE firebase_status SET firestore_on = ? WHERE id = 'default'").run(on).changes;
}

function payCode(name) {
  const text = String(name || "").toLowerCase();
  if (text.includes("dinheiro") || text.includes("cash") || text.includes("espec")) return "cash";
  if (text.includes("voucher") || text.includes("carteira") || text.includes("wallet")) return "wallet";
  if (text.includes("fatur")) return "invoice";
  if (text.includes("cart") || text.includes("card") || text.includes("cr[eé]dito") || text.includes("credito") || text.includes("d[eé]bito") || text.includes("debito")) return "card";
  return "";
}
function isOn(row) {
  if (row.active != null) return String(row.active) === "1";
  if (row.statusId != null) return String(row.statusId) === "1";
  return false;
}
const payState = {};
const payNames = [];
for (const row of bucket.tripPaymentForm) {
  const name = String(row.name || "").trim();
  payNames.push(name);
  const code = payCode(name);
  if (!code) continue;
  if (isOn(row)) payState[code] = 1;
  else if (payState[code] !== 1) payState[code] = 0;
}
const payStmt = db.prepare("UPDATE payment_methods SET active = ? WHERE code = ?");
let payments = 0;
for (const [code, active] of Object.entries(payState)) {
  payments += payStmt.run(active, code).changes;
}

function audience(row) {
  const text = `${row.key || ""} ${row.tag || ""}`.toLowerCase();
  const driver = text.includes("motor") || text.includes("driver");
  const rider = text.includes("client") || text.includes("pass") || text.includes("rider") || text.includes("customer") || text.includes("usuario") || text.includes("usuário");
  if (driver && rider) return "both";
  if (driver) return "drivers";
  if (rider) return "riders";
  return "";
}
const noteStmt = db.prepare("INSERT OR IGNORE INTO notifications (id, audience, title, body, city_id, status, sent_at) VALUES (?, ?, ?, ?, NULL, 'draft', NULL)");
let notes = 0;
let skippedNotes = 0;
const noteKeys = [];
for (const row of bucket.pushConfig) {
  const title = String(row.title || "").trim();
  const body = String(row.message || "").trim();
  const who = audience(row);
  noteKeys.push(String(row.key || ""));
  if (!title || !body || !who || !row.id) { skippedNotes += 1; continue; }
  if (noteStmt.run(`legacy-push-${row.id}`, who, title.slice(0, 120), body, ).changes) notes += 1;
}

const urlByService = new Map();
for (const row of bucket.externalServiceMetaData) {
  const key = String(row.key || "");
  const value = String(row.value || "").trim();
  if (secretKey.test(key) || !/^https:\/\//i.test(value)) continue;
  if (!/url|endpoint|host|base/i.test(key)) continue;
  if (!urlByService.has(String(row.externalServiceId))) urlByService.set(String(row.externalServiceId), value);
}
const serviceStmt = db.prepare("INSERT OR IGNORE INTO external_services (id, name, base_url, active) VALUES (?, ?, ?, ?)");
let services = 0;
let skippedServices = 0;
for (const row of bucket.externalService) {
  const name = String(row.name || "").trim();
  const url = urlByService.get(String(row.id));
  if (!name || !url) { skippedServices += 1; continue; }
  const active = String(row.active) === "1" || String(row.statusId) === "1" ? 1 : 0;
  if (serviceStmt.run(`legacy-service-${row.id}`, name.slice(0, 80), url, active).changes) services += 1;
}

console.log(JSON.stringify({
  offerUpdated,
  offer: Number.isFinite(offer) ? Math.round(offer) : null,
  firestoreUpdated,
  payments,
  payState,
  payNames,
  notes,
  skippedNotes,
  noteKeys,
  services,
  skippedServices,
  serviceRows: bucket.externalService.length,
  hiddenConfig,
  configKeys: columns.config,
  payKeys: columns.tripPaymentForm,
  pushKeys: columns.pushConfig,
  metaKeys: columns.externalServiceMetaData
}));
