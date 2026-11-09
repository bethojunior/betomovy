import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set(["user", "userType", "cityConfig"]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = { user: [], userType: [], cityConfig: [] };
const extra = {};
const secret = /key|token|secret|password|senha/i;

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
    if (secret.test(fields[index])) continue;
    row[fields[index]] = values[index];
  }
  delete row.password;
  delete row.api_token;
  delete row.deviceToken;
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
    if (!wanted.has(table)) {
      if (/admin|monitor|usuario|userRole|role_user|roleUser/i.test(table)) extra[table] = (extra[table] || 0) + chunk.length;
      continue;
    }
    const listed = chunk.match(/^INSERT INTO `[^`]+` \(([^)]*)\) VALUES/);
    const names = listed ? [...listed[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]) : columns[table];
    for (const values of tuples(chunk)) record(table, values, names);
  }
}

const db = new DatabaseSync(dbPath);
const roles = db.prepare("SELECT id, name FROM roles").all();
const roleIds = new Set(roles.map((row) => row.id));
const adminTypes = new Map();
for (const row of bucket.userType) {
  const name = String(row.name || "").trim();
  if (name.toLowerCase().includes("admin")) adminTypes.set(String(row.idUserType || row.id), name);
}
const staffStmt = db.prepare("INSERT OR IGNORE INTO staff (id, name, email, role_id, active) VALUES (?, ?, ?, ?, ?)");
const usedEmails = new Set(db.prepare("SELECT email FROM staff").all().map((row) => row.email));
let staff = 0;
let skippedStaff = 0;
const skippedWhy = { type: 0, email: 0, role: 0, name: 0 };
for (const row of bucket.user) {
  const roleId = row.roleId && roleIds.has(`legacy-role-${row.roleId}`) ? `legacy-role-${row.roleId}` : "";
  if (!roleId) { skippedWhy.role += 1; continue; }
  const name = String(row.name || "").trim();
  const email = String(row.email || "").trim().toLowerCase();
  if (!name) { skippedWhy.name += 1; skippedStaff += 1; continue; }
  if (!email || !email.includes("@") || usedEmails.has(email)) { skippedWhy.email += 1; skippedStaff += 1; continue; }
  const active = String(row.statusId) === "1" && String(row.blocked) !== "1" ? 1 : 0;
  if (staffStmt.run(`legacy-staff-${row.idUser}`, name.slice(0, 80), email, roleId, active).changes) {
    usedEmails.add(email);
    staff += 1;
  }
}

const linkStmt = db.prepare("INSERT OR IGNORE INTO external_links (id, label, url, active) VALUES (?, ?, ?, 1)");
const linkFields = [
  ["urlFacebook", "Facebook"],
  ["urlInstagram", "Instagram"],
  ["urlPartner", "Partner"]
];
let links = 0;
const seenUrls = new Set();
for (const row of bucket.cityConfig) {
  for (const [field, label] of linkFields) {
    const url = String(row[field] || "").trim();
    if (!/^https?:\/\//i.test(url) || seenUrls.has(url)) continue;
    seenUrls.add(url);
    const city = row.cityId || row.idCityConfig || links;
    if (linkStmt.run(`legacy-link-${field}-${city}`, label, url, ).changes) links += 1;
  }
}

console.log(JSON.stringify({
  staff,
  skippedStaff,
  skippedWhy,
  adminTypes: [...adminTypes.values()],
  users: bucket.user.length,
  userKeys: columns.user,
  links,
  configs: bucket.cityConfig.length,
  extra
}));
