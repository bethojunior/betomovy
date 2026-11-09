import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["zone", "tripReport", "tripReportType"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { zone: [], tripReport: [], tripReportType: [] };

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

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT id FROM cities").all().map((row) => row.id));
const trips = new Map(db.prepare("SELECT reference, id FROM trips").all().map((row) => [row.reference, row.id]));
const now = new Date().toISOString();
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? now : new Date(parsed).toISOString();
};

const best = new Map();
let skippedZones = 0;
const radii = [];
for (const row of bucket.zone) {
  if (String(row.statusId) !== "1" || Number(row.order) !== 1) { skippedZones += 1; continue; }
  const cityId = cities.has(`legacy-city-${row.cityId}`) ? `legacy-city-${row.cityId}` : "";
  const radius = Number(row.radius);
  const order = Number(row.order);
  if (!cityId || !Number.isFinite(radius) || !(radius > 0) || !Number.isFinite(order)) { skippedZones += 1; continue; }
  const km = radius > 200 ? radius / 1000 : radius;
  if (!(km > 0)) { skippedZones += 1; continue; }
  radii.push(radius);
  const current = best.get(cityId);
  if (!current || order < current.order) best.set(cityId, { order, km });
}
const radiusStmt = db.prepare("INSERT INTO call_radius (city_id, radius_km, updated_at) VALUES (?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET radius_km = excluded.radius_km, updated_at = excluded.updated_at");
let radiiUpdated = 0;
for (const [cityId, row] of best) {
  if (radiusStmt.run(cityId, row.km, now).changes) radiiUpdated += 1;
}
const removeRadius = db.prepare("DELETE FROM call_radius WHERE city_id = ?");
let radiiRemoved = 0;
for (const row of db.prepare("SELECT city_id FROM call_radius WHERE city_id LIKE 'legacy-city-%'").all()) {
  if (!best.has(row.city_id) && removeRadius.run(row.city_id).changes) radiiRemoved += 1;
}

const typeName = new Map(bucket.tripReportType.map((row) => [String(row.idTripReportType || row.id), String(row.name || "").trim()]));
const ticketStmt = db.prepare("INSERT OR IGNORE INTO support_tickets (id, kind, customer_id, trip_id, subject, message, status, created_at) VALUES (?, 'trip', NULL, ?, ?, ?, ?, ?)");
let tickets = 0;
let skippedTickets = 0;
for (const row of bucket.tripReport) {
  const message = String(row.message || "").trim();
  const tripId = trips.get(String(row.tripReference || ""));
  const id = row.idTripReport || row.id;
  if (!message || !tripId || !id) { skippedTickets += 1; continue; }
  const subject = (typeName.get(String(row.tripReportTypeId)) || message).slice(0, 80);
  const status = String(row.statusId) === "1" ? "open" : "closed";
  if (ticketStmt.run(`legacy-trip-report-${id}`, tripId, subject, message, status, when(row.created_at)).changes) tickets += 1;
}

console.log(JSON.stringify({
  zones: bucket.zone.length,
  skippedZones,
  radiiUpdated,
  radiusCities: best.size,
  radiiRemoved,
  radiusMin: radii.length ? Math.min(...radii) : null,
  radiusMax: radii.length ? Math.max(...radii) : null,
  tickets,
  skippedTickets,
  ticketRows: bucket.tripReport.length,
  ticketTypes: bucket.tripReportType.length,
  zoneKeys: columns.zone,
  ticketKeys: columns.tripReport
}));
