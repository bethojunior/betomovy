import fs from "node:fs";
import readline from "node:readline";

const known = new Set("user customer driver company city estate trip price origin destination tripPaymentForm balance discountCoupon driverCommission tripCancellationCustomerFee withdraw manager partner advertising toll userPenalty userPenaltiesType cancellationReasons cancellationReasonsType appVersion termsUsePolicy doc docUser docStatus priceDynamic central centralUser centralNeighborhood neighborhood company_delivery category product deliveryOrder route contactUs car balanceFlow balanceFlowType removeAccountRequest notification riskArea chatBotTrip chatBotTripType places userType driver".split(" "));
const interest = /rating|tax|cash|station|waypoint|prepaid|group|role|config|payment|banner|suggest|phone|bonus|flag|radius|module|service|webhook|voucher|promotion|freight|zone|heat|area|call|split|fee|policy|chat|message|credit|worker|indication|accessibility|appConfig|formOf|reason|block|log|report|item/i;
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]), crlfDelay: Infinity });
const cols = {};
let table = "";
let buf = [];
const bytes = {};
for await (const line of rl) {
  const start = line.match(/^CREATE TABLE `([^`]+)`/);
  if (start) { table = start[1]; buf = []; continue; }
  if (table) {
    const col = line.match(/^  `([^`]+)` /);
    if (col) buf.push(col[1]);
    if (line.startsWith(") ENGINE")) { cols[table] = buf; table = ""; }
    continue;
  }
  const insert = line.match(/^INSERT INTO `([^`]+)`/);
  if (insert) bytes[insert[1]] = (bytes[insert[1]] || 0) + line.length;
}
const rows = Object.entries(bytes)
  .filter(([name, size]) => !known.has(name) && interest.test(name) && size > 40)
  .sort((a, b) => b[1] - a[1]);
for (const [name, size] of rows) console.log(`${name}\t${size}\t${(cols[name] || []).join(",")}`);
