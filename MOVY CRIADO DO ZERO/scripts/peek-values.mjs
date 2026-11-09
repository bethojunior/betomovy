import fs from "node:fs";
import readline from "node:readline";

const dump = process.argv[2];
const want = process.argv[3];
const rl = readline.createInterface({ input: fs.createReadStream(dump), crlfDelay: Infinity });
for await (const line of rl) {
  if (!line.startsWith(`INSERT INTO \`${want}\``)) continue;
  const at = line.indexOf("VALUES");
  const sample = line.slice(at, at + 12000).replace(/'(?:[^'\\]|\\.)*'/g, "''").replace(/0x[0-9A-Fa-f]+/g, "0xHEX");
  console.log(sample.slice(0, 700));
  break;
}
