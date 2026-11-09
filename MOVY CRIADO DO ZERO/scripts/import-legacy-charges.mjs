import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["tripCardPayment"]);
const columns = {};
let creating = "";
let createCols = [];
const payments = [];

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

function record(values, names) {
  const fields = names || columns.tripCardPayment;
  if (!fields || values.length < fields.length) return;
  const row = {};
  for (let index = 0; index < fields.length; index += 1) row[fields[index]] = values[index];
  delete row.cardId;
  delete row.transactionId;
  delete row.intermediaryId;
  delete row.userId;
  payments.push(row);
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
    for (const values of tuples(chunk)) record(values, names);
  }
}

const db = new DatabaseSync(dbPath);
const trips = new Map(db.prepare("SELECT reference, id, city_id, fare_cents FROM trips").all().map((row) => [row.reference, row]));
const now = new Date().toISOString();
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? now : new Date(parsed).toISOString();
};

function chargeStatus(row) {
  const text = String(row.status || "").trim().toLowerCase();
  if (String(row.captured) === "1") return "captured";
  if (text.includes("reject") || text.includes("recus") || text.includes("cancel") || text.includes("fail") || text.includes("denied")) return "refused";
  if (text) return text.slice(0, 40);
  return "";
}

const chosen = new Map();
const statusCount = {};
let skipped = 0;
let floatHits = 0;
let rawHits = 0;
for (const row of payments) {
  const trip = trips.get(String(row.tripReference || ""));
  const amount = Number(row.amount);
  const id = row.idTripCardPayment || row.id;
  const status = chargeStatus(row);
  statusCount[status || "empty"] = (statusCount[status || "empty"] || 0) + 1;
  if (!trip || !trip.city_id || !id || !Number.isFinite(amount) || amount < 0 || !status) { skipped += 1; continue; }
  const asFloat = Math.round(amount * 100);
  const asRaw = Math.round(amount);
  if (Math.abs(asFloat - trip.fare_cents) <= 1) floatHits += 1;
  if (Math.abs(asRaw - trip.fare_cents) <= 1) rawHits += 1;
  const current = chosen.get(trip.id);
  const rank = status === "captured" ? 2 : 1;
  if (!current || rank > current.rank || (rank === current.rank && Number(id) > Number(current.id))) {
    chosen.set(trip.id, { id, trip, amount, status, at: when(row.created_at), rank });
  }
}

const useRaw = rawHits > floatHits;
const stmt = db.prepare("INSERT OR IGNORE INTO acquirer_transactions (id, trip_id, city_id, amount_cents, method, status, created_at) VALUES (?, ?, ?, ?, 'card', ?, ?)");
let charges = 0;
for (const row of chosen.values()) {
  const cents = useRaw ? Math.round(row.amount) : Math.round(row.amount * 100);
  if (stmt.run(`legacy-card-${row.id}`, row.trip.id, row.trip.city_id, cents, row.status, row.at).changes) charges += 1;
}

console.log(JSON.stringify({
  rows: payments.length,
  skipped,
  charges,
  trips: chosen.size,
  floatHits,
  rawHits,
  useRaw,
  statusCount,
  keys: columns.tripCardPayment
}));
