import fs from "node:fs";
import readline from "node:readline";

const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]), crlfDelay: Infinity });
const names = [];
for await (const line of rl) {
  const start = line.match(/^CREATE TABLE `([^`]+)`/);
  if (start) names.push(start[1]);
}
console.log(names.join("\n"));
