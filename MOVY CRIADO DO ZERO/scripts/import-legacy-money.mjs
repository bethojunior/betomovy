import fs from "node:fs";
import readline from "node:readline";
import { DatabaseSync } from "node:sqlite";

const dump = process.argv[2];
const dbPath = process.argv[3];
const wanted = new Set([
  "balance", "customer", "driver", "company", "discountCoupon", "tripPaymentForm", "driverCommission", "price",
  "tripCancellationCustomerFee", "withdraw", "manager", "partner", "user", "advertising", "toll",
  "userPenaltiesType", "userPenalty", "cancellationReasons", "cancellationReasonsType", "appVersion",
  "termsUsePolicy", "doc", "docUser", "docStatus", "priceDynamic",
]);
const columns = {};
let creating = "";
let createCols = [];
const bucket = {
  discountCoupon: [], tripPaymentForm: [], driverCommission: [], tripCancellationCustomerFee: [], withdraw: [],
  manager: [], partner: [], advertising: [], toll: [], userPenaltiesType: [], userPenalty: [],
  cancellationReasons: [], cancellationReasonsType: [], appVersion: [], termsUsePolicy: [], doc: [],
  docUser: [], docStatus: [], priceDynamic: [],
};
const balances = new Map();
const customerBalance = new Map();
const driverBalance = new Map();
const companyBalance = new Map();
const users = new Map();
const priceType = new Map();

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
  delete row.password;
  delete row.api_token;
  delete row.deviceToken;
  delete row.confirmationCode;
  delete row.bankAccount;
  if (table === "balance") {
    const amount = money(row.balance);
    if (amount != null && row.idBalance) balances.set(row.idBalance, amount);
    return;
  }
  if (table === "customer") { customerBalance.set(row.idCustomer, row.balanceId); return; }
  if (table === "driver") { driverBalance.set(row.idDriver, row.balanceId); return; }
  if (table === "company") { companyBalance.set(row.id, row.balanceId); return; }
  if (table === "user") {
    users.set(row.idUser, { name: row.name, email: row.email, phone: row.phone, cityId: row.cityId });
    return;
  }
  if (table === "price") {
    const key = `${row.cityId}:${row.tripTypeId}`;
    if (row.id && row.cityId && !priceType.has(key)) priceType.set(key, `legacy-price-${row.id}`);
    return;
  }
  if (table === "toll") delete row.polygon;
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
const cityKey = (id) => (id ? `legacy-city-${id}` : null);
const when = (value) => {
  const parsed = Date.parse(String(value || "").replace(" ", "T") + "Z");
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
};
function pay(name) {
  const text = String(name || "").toLowerCase();
  if (!text) return "any";
  if (text.includes("dinheiro") || text.includes("cash") || text.includes("espec")) return "cash";
  if (text.includes("voucher") || text.includes("carteira") || text.includes("wallet")) return "wallet";
  if (text.includes("fatur") || text.includes("invoice")) return "invoice";
  if (text.includes("cart") || text.includes("card") || text.includes("cred") || text.includes("deb")) return "card";
  return "any";
}
function audience(name) {
  const text = String(name || "").toLowerCase();
  if (text.includes("motor") || text.includes("driver")) return "driver";
  if (text.includes("client") || text.includes("pass") || text.includes("customer") || text.includes("usu")) return "rider";
  return "";
}
function docState(name) {
  const text = String(name || "").toLowerCase();
  if (text.includes("aprov") || text.includes("approv")) return "approved";
  if (text.includes("recus") || text.includes("reprov") || text.includes("reject")) return "rejected";
  if (text.includes("pend") || text.includes("anali") || text.includes("aguard")) return "pending";
  return "";
}

const db = new DatabaseSync(dbPath);
const cities = new Set(db.prepare("SELECT id FROM cities").all().map((row) => row.id));
const tripByRef = new Map(db.prepare("SELECT id, reference FROM trips WHERE id LIKE 'legacy-trip-%'").all().map((row) => [row.reference, row.id]));
const driverByUser = new Map();
for (const row of db.prepare("SELECT id, account_id FROM drivers WHERE account_id LIKE 'legacy-user-%'").all()) driverByUser.set(row.account_id.slice("legacy-user-".length), row.id);
const forms = new Map(bucket.tripPaymentForm.map((row) => [row.idTripPaymentForm, pay(row.name)]));
const reasonType = new Map(bucket.cancellationReasonsType.map((row) => [row.id, row.name || row.type || ""]));
const docStatus = new Map(bucket.docStatus.map((row) => [row.id, docState(row.name || row.label || "")]));
const docName = new Map(bucket.doc.filter((row) => !row.deleted_at).map((row) => [row.id, String(row.label || "").trim()]));

db.exec("BEGIN");
const customerStmt = db.prepare("UPDATE customers SET balance_cents = ? WHERE id = ?");
const driverStmt = db.prepare("UPDATE drivers SET balance_cents = ? WHERE id = ?");
const companyStmt = db.prepare("UPDATE companies SET balance_cents = ? WHERE id = ?");
let customerBalances = 0;
let driverBalances = 0;
let companyBalances = 0;
for (const [id, balanceId] of customerBalance) {
  if (!balances.has(balanceId)) continue;
  if (customerStmt.run(balances.get(balanceId), `legacy-customer-${id}`).changes) customerBalances += 1;
}
for (const [id, balanceId] of driverBalance) {
  if (!balances.has(balanceId)) continue;
  if (driverStmt.run(balances.get(balanceId), `legacy-driver-${id}`).changes) driverBalances += 1;
}
for (const [id, balanceId] of companyBalance) {
  if (!balances.has(balanceId)) continue;
  if (companyStmt.run(balances.get(balanceId), `legacy-company-${id}`).changes) companyBalances += 1;
}

const couponStmt = db.prepare("INSERT OR IGNORE INTO coupons (id, code, city_id, kind, percent, fixed_cents, max_cents, payment, valid_until, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
const seenCode = new Set(db.prepare("SELECT code FROM coupons").all().map((row) => row.code));
let coupons = 0;
for (const row of bucket.discountCoupon) {
  const code = String(row.code || "").trim();
  if (!code || seenCode.has(code)) continue;
  const city = cityKey(row.cityId);
  const fixed = String(row.valueType || "") === "$";
  const amount = money(row.value) || 0;
  couponStmt.run(`legacy-coupon-${row.id}`, code, city && cities.has(city) ? city : null, fixed ? "fixed" : "percent", fixed ? 0 : Number(row.value) || 0, fixed ? amount : 0, money(row.maxDiscountValue) || 0, forms.get(row.tripPaymentFormId) || "any", when(row.dateEnd), String(row.active) === "1" && String(row.statusId) === "1" ? 1 : 0, now);
  seenCode.add(code);
  coupons += 1;
}

const commissionStmt = db.prepare("INSERT OR IGNORE INTO commissions (id, city_id, trip_type_id, percent, fixed_cents, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
let commissions = 0;
for (const row of bucket.driverCommission) {
  const city = cityKey(row.cityId);
  if (!city || !cities.has(city)) continue;
  const typeId = row.tripTypeId ? priceType.get(`${row.cityId}:${row.tripTypeId}`) || null : null;
  if (row.tripTypeId && !typeId) continue;
  const fixed = String(row.valueType || "") === "$";
  commissionStmt.run(`legacy-commission-${row.idDriverCommission}`, city, typeId, fixed ? 0 : Number(row.value) || 0, fixed ? money(row.value) || 0 : 0, String(row.statusId) === "1" ? 1 : 0, now);
  commissions += 1;
}

const feeStmt = db.prepare("INSERT OR IGNORE INTO cancellation_fees (id, trip_id, charged_to, amount_cents, reason, status, created_at) VALUES (?, ?, 'rider', ?, ?, ?, ?)");
let fees = 0;
for (const row of bucket.tripCancellationCustomerFee) {
  const trip = tripByRef.get(row.tripReference);
  const amount = money(row.feeValue);
  if (!trip || amount == null) continue;
  const billing = String(row.billing_status || "").toLowerCase();
  const status = billing.includes("paid") || billing.includes("pago") ? "paid" : billing.includes("cancel") ? "cancelled" : "pending";
  feeStmt.run(`legacy-fee-${row.id}`, trip, amount, billing || "cancellation", status, when(row.created_at) || now);
  fees += 1;
}

const payoutStmt = db.prepare("INSERT OR IGNORE INTO payouts (id, driver_id, amount_cents, status, created_at) VALUES (?, ?, ?, ?, ?)");
let payouts = 0;
for (const row of bucket.withdraw) {
  const driver = driverByUser.get(row.userId);
  const amount = money(row.value);
  if (!driver || amount == null || amount <= 0) continue;
  const status = String(row.recused) === "1" ? "refused" : String(row.paid) === "1" ? "paid" : "pending";
  payoutStmt.run(`legacy-payout-${row.idWithdraw}`, driver, amount, status, when(row.created_at) || now);
  payouts += 1;
}

const managerStmt = db.prepare("INSERT OR IGNORE INTO managers (id, name, email, phone, city_id, commission_percent, active) VALUES (?, ?, ?, ?, ?, ?, ?)");
const managerCity = new Map();
let managers = 0;
for (const row of bucket.manager) {
  const user = users.get(row.userId);
  const city = cityKey(row.cityId);
  const name = String(user?.name || "").trim();
  if (!name || !city || !cities.has(city) || String(row.valueTypeCommission || "%") === "$") continue;
  managerStmt.run(`legacy-manager-${row.id}`, name, user.email || null, user.phone || null, city, Number(row.valueCommission) || 0, String(row.managerRegisterStatusId) === "1" ? 1 : 0);
  managerCity.set(row.id, city);
  managers += 1;
}

const partnerStmt = db.prepare("INSERT OR IGNORE INTO partners (id, name, contact, phone, city_id, status) VALUES (?, ?, ?, ?, ?, ?)");
let partners = 0;
for (const row of bucket.partner) {
  const user = users.get(row.userId);
  const city = managerCity.get(row.managerId) || (cityKey(user?.cityId));
  const name = String(row.nameEstablishment || user?.name || "").trim();
  if (!name || !city || !cities.has(city)) continue;
  partnerStmt.run(`legacy-partner-${row.idPartner}`, name, user?.email || null, user?.phone || null, city, String(row.statusId) === "1" ? "active" : "paused");
  partners += 1;
}

const adStmt = db.prepare("INSERT OR IGNORE INTO ads (id, title, audience, placement, link, active) VALUES (?, ?, 'all', ?, ?, ?)");
let ads = 0;
for (const row of bucket.advertising) {
  if (row.genderId && row.genderId !== "0") continue;
  const title = String(row.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
  const link = String(row.link || "");
  if (!title || !/^https?:\/\//i.test(link)) continue;
  adStmt.run(`legacy-ad-${row.id}`, title, row.banner ? "banner" : "link", link, String(row.statusId) === "1" ? 1 : 0);
  ads += 1;
}

const tollStmt = db.prepare("INSERT OR IGNORE INTO tolls (id, city_id, name, amount_cents, active, updated_at) VALUES (?, ?, ?, ?, ?, ?)");
let tolls = 0;
for (const row of bucket.toll) {
  const city = cityKey(row.cityId);
  const name = String(row.name || "").trim();
  const amount = money(row.value);
  if (!name || !city || !cities.has(city) || amount == null || row.deleted_at) continue;
  tollStmt.run(`legacy-toll-${row.id}`, city, name, amount, String(row.active) === "1" ? 1 : 0, now);
  tolls += 1;
}

const penaltyStmt = db.prepare("INSERT OR IGNORE INTO penalties (id, name, points, suspension_hours, active) VALUES (?, ?, ?, 0, ?)");
const penaltyPoints = new Map();
let penalties = 0;
for (const row of bucket.userPenaltiesType) {
  const name = String(row.name || "").trim();
  const points = Math.round(Number(row.valueRating));
  if (!name || !Number.isFinite(points)) continue;
  penaltyStmt.run(`legacy-penalty-${row.idUserPenaltyType}`, name, points, String(row.statusId) === "1" ? 1 : 0);
  penaltyPoints.set(row.idUserPenaltyType, points);
  penalties += 1;
}
const driverPenaltyStmt = db.prepare("INSERT OR IGNORE INTO driver_penalties (id, driver_id, penalty_id, points, suspended_until, created_at) VALUES (?, ?, ?, ?, NULL, ?)");
let driverPenalties = 0;
for (const row of bucket.userPenalty) {
  const driver = driverByUser.get(row.userId);
  if (!driver || !penaltyPoints.has(row.userPenaltyTypeId)) continue;
  driverPenaltyStmt.run(`legacy-driver-penalty-${row.idUserPenalty}`, driver, `legacy-penalty-${row.userPenaltyTypeId}`, penaltyPoints.get(row.userPenaltyTypeId), when(row.created_at) || now);
  driverPenalties += 1;
}

const reasonStmt = db.prepare("INSERT OR IGNORE INTO cancel_reasons (id, audience, reason, charges_fee, active) VALUES (?, ?, ?, ?, ?)");
let reasons = 0;
for (const row of bucket.cancellationReasons) {
  const who = audience(reasonType.get(row.cancellationReasonsTypeId));
  const reason = String(row.name || "").trim();
  if (!who || !reason) continue;
  reasonStmt.run(`legacy-reason-${row.idCancellationReasons}`, who, reason, String(row.monetized) === "1" ? 1 : 0, String(row.statusId) === "1" ? 1 : 0);
  reasons += 1;
}

const versionStmt = db.prepare("INSERT OR IGNORE INTO app_versions (id, platform, version, is_current) VALUES (?, ?, ?, ?)");
let versions = 0;
for (const row of bucket.appVersion) {
  const platform = String(row.platform || "").toLowerCase() === "ios" || String(row.platform || "").toLowerCase() === "apple" ? "ios" : String(row.platform || "").toLowerCase() === "android" ? "android" : "";
  const version = String(row.version || "").trim();
  if (!platform || !version) continue;
  versionStmt.run(`legacy-version-${row.id}`, platform, version, String(row.statusId) === "1" ? 1 : 0);
  versions += 1;
}

const termStmt = db.prepare("INSERT OR IGNORE INTO terms (id, audience, title, version, body, active) VALUES (?, ?, ?, '1', ?, 1)");
let terms = 0;
for (const row of bucket.termsUsePolicy) {
  const who = audience(row.type) || (String(row.type || "").length < 40 ? String(row.type || "").trim() : "");
  const body = String(row.description || "").trim();
  if (!who || !body) continue;
  termStmt.run(`legacy-term-${row.id}`, who, String(row.type).slice(0, 80), body);
  terms += 1;
}

const documentStmt = db.prepare("INSERT OR IGNORE INTO driver_documents (id, driver_id, document_name, due_at, status, updated_at) VALUES (?, ?, ?, NULL, ?, ?)");
let documents = 0;
for (const row of bucket.docUser) {
  if (row.deleted_at) continue;
  const driver = driverByUser.get(row.userId);
  const name = docName.get(row.docId);
  const status = docStatus.get(row.docStatusId);
  if (!driver || !name || !status) continue;
  documentStmt.run(`legacy-doc-${row.id}`, driver, name, status, now);
  documents += 1;
}

const triggerStmt = db.prepare("INSERT OR IGNORE INTO tariff_triggers (id, city_id, name, starts_at, ends_at, multiplier, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
let triggers = 0;
for (const row of bucket.priceDynamic) {
  const city = cityKey(row.cityId);
  const multiplier = Number(row.multiplierValue);
  if (!city || !cities.has(city) || !row.timeStart || !row.timeEnd || !Number.isFinite(multiplier)) continue;
  triggerStmt.run(`legacy-trigger-${row.idPriceDynamic}`, city, `day-${row.dayOfWeek}-${row.timeStart}`, row.timeStart, row.timeEnd, multiplier, String(row.active) === "1" && String(row.statusId) === "1" ? 1 : 0, now);
  triggers += 1;
}

db.exec("COMMIT");
console.log(JSON.stringify({ customerBalances, driverBalances, companyBalances, coupons, commissions, fees, payouts, managers, partners, ads, tolls, penalties, driverPenalties, reasons, versions, terms, documents, triggers }));
db.close();
