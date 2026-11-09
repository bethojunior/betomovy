import fs from "node:fs";
import readline from "node:readline";

const want = process.argv[3];
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]), crlfDelay: Infinity });
let pending = "";
let rows = 0;
let named = 0;
let city = 0;
for await (const line of rl) {
  const chunk = pending ? `${pending}\n${line}` : line;
  if (!chunk.startsWith(`INSERT INTO \`${want}\``) && !pending) continue;
  if (!chunk.endsWith(";")) { pending = chunk; continue; }
  pending = "";
  const re = /\((\d+),'((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)',(-?\d+(?:\.\d+)?),0x[0-9A-Fa-f]+,(\d|NULL),'((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)',(NULL|'[^']*'),(\d+)\)/g;
  for (const match of chunk.matchAll(re)) {
    rows += 1;
    if (match[2].trim()) named += 1;
    if (match[9] !== "0") city += 1;
  }
}
console.log(JSON.stringify({ rows, named, city }));
