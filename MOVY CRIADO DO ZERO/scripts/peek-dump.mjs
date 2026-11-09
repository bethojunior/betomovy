import fs from "node:fs";
import readline from "node:readline";

const dump = process.argv[2];
const want = new Set(["places", "addressBlacklist", "removeAccountRequest", "car", "carType", "notification", "balanceFlow", "serviceType", "companyServiceType"]);
const rl = readline.createInterface({ input: fs.createReadStream(dump), crlfDelay: Infinity });
let table = "";
let buf = [];
for await (const line of rl) {
  const start = line.match(/^CREATE TABLE `([^`]+)`/);
  if (start) {
    table = want.has(start[1]) ? start[1] : "";
    buf = [];
    continue;
  }
  if (!table) continue;
  const col = line.match(/^  `([^`]+)` (\w+)/);
  if (col) buf.push(`${col[1]}:${col[2]}`);
  if (line.startsWith(") ENGINE")) {
    console.log(table);
    console.log(buf.join(", "));
    console.log("---");
    table = "";
  }
}
