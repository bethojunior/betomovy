import fs from "node:fs";
import readline from "node:readline";

const dump = process.argv[2];
const rl = readline.createInterface({ input: fs.createReadStream(dump), crlfDelay: Infinity });
const interest = new Set(["places", "addressBlacklist", "removeAccountRequest", "car", "notification", "balanceFlow", "serviceType"]);
for await (const line of rl) {
  const insert = line.match(/^INSERT INTO `([^`]+)`/);
  if (!insert || !interest.has(insert[1])) continue;
  const valuesAt = line.indexOf("VALUES");
  const head = line.slice(0, Math.min(valuesAt, 180));
  console.log(insert[1], "bytes", line.length, "head", head.replace(/\s+/g, " "));
}
