import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["riskArea", "chatBotTrip", "chatBotTripType", "role", "appModules", "appActiveModules", "userGroup"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { riskArea: [], chatBotTrip: [], chatBotTripType: [], role: [], appModules: [], appActiveModules: [], userGroup: [] };

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
const riskStmt = db.prepare("INSERT OR IGNORE INTO risk_areas (id, name, city_id, latitude, longitude, radius_km, level, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
const chatStmt = db.prepare("INSERT OR IGNORE INTO driver_chat_messages (id, code, message, active) VALUES (?, ?, ?, ?)");

const typeName = new Map(bucket.chatBotTripType.map((row) => [String(row.id), String(row.name || "").trim()]));
const statusCount = {};
let risks = 0;
let skippedRisks = 0;
let chats = 0;
let skippedChats = 0;
const radii = [];

for (const row of bucket.riskArea) {
  const status = String(row.status || "").trim().toLowerCase();
  statusCount[status || "empty"] = (statusCount[status || "empty"] || 0) + 1;
  if (row.deleted_at) { skippedRisks += 1; continue; }
  if (status !== "confirmed") { skippedRisks += 1; continue; }
  const name = String(row.address || "").trim();
  const cityId = cities.has(`legacy-city-${row.cityId}`) ? `legacy-city-${row.cityId}` : "";
  const lat = Number(row.latitude);
  const lng = Number(row.longitude);
  const radius = Number(row.radius);
  if (!name || !cityId || !Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0 || !(radius > 0)) {
    skippedRisks += 1;
    continue;
  }
  radii.push(radius);
  const km = radius > 20 ? radius / 1000 : radius;
  if (!(km > 0)) { skippedRisks += 1; continue; }
  if (riskStmt.run(`legacy-risk-${row.id}`, name.slice(0, 180), cityId, lat, lng, km, "high", 1).changes) risks += 1;
}

const usedCodes = new Set();
for (const row of bucket.chatBotTrip) {
  const message = String(row.message || "").trim();
  const id = row.idChatBotTrip || row.id;
  if (!message || !id) { skippedChats += 1; continue; }
  const type = typeName.get(String(row.chatBotTripTypeId)) || "CHAT";
  let code = `${type}-${id}`.toUpperCase().replace(/\s+/g, "-").slice(0, 40);
  if (usedCodes.has(code)) code = `CHAT-${id}`.slice(0, 40);
  usedCodes.add(code);
  const active = String(row.statusId) === "1" ? 1 : 0;
  if (chatStmt.run(`legacy-chat-${id}`, code, message, active).changes) chats += 1;
}

const roleStmt = db.prepare("INSERT OR IGNORE INTO roles (id, name, description, active) VALUES (?, ?, '', ?)");
let roles = 0;
let skippedRoles = 0;
for (const row of bucket.role) {
  const name = String(row.name || "").trim();
  if (!name || !row.id) { skippedRoles += 1; continue; }
  const active = String(row.statusId) === "1" ? 1 : 0;
  if (roleStmt.run(`legacy-role-${row.id}`, name.slice(0, 80), active).changes) roles += 1;
  else skippedRoles += 1;
}
const moduleName = {
  trip: "trips", trips: "trips", viagem: "trips", viagens: "trips",
  delivery: "delivery", entrega: "delivery", entregas: "delivery",
  freight: "freight", frete: "freight",
  route: "routes", routes: "routes", rota: "routes", rotas: "routes",
  corporate: "corporate", corporativo: "corporate"
};
const activeByModule = new Map(bucket.appActiveModules.map((row) => [String(row.appModuleId), String(row.isActive)]));
let modules = 0;
const moduleLabels = [];
for (const row of bucket.appModules) {
  const label = String(row.name || "").trim();
  moduleLabels.push(`${label}:${activeByModule.get(String(row.id)) ?? ""}`);
  if (moduleName[label.toLowerCase()]) modules += 1;
}
db.prepare("UPDATE modules SET active = 1").run();
const plate = db.prepare("SELECT plate FROM drivers WHERE id = 'legacy-driver-3'").get();
console.log(JSON.stringify({
  risks,
  skippedRisks,
  riskRows: bucket.riskArea.length,
  statusCount,
  radiusMin: radii.length ? Math.min(...radii) : null,
  radiusMax: radii.length ? Math.max(...radii) : null,
  chats,
  skippedChats,
  chatRows: bucket.chatBotTrip.length,
  chatTypes: bucket.chatBotTripType.length,
  riskKeys: columns.riskArea,
  chatKeys: columns.chatBotTrip,
  roles,
  skippedRoles,
  roleRows: bucket.role.length,
  groups: bucket.userGroup.map((row) => row.name),
  modules,
  moduleLabels,
  plate: plate?.plate ?? null
}));
