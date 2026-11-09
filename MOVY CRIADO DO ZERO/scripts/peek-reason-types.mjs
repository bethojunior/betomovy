import fs from "node:fs";
import readline from "node:readline";

const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]), crlfDelay: Infinity });
let pending = "";
for await (const line of rl) {
  const chunk = pending ? `${pending}\n${line}` : line;
  if (!chunk.startsWith("INSERT INTO `cancellationReasonsType`") && !pending) continue;
  if (!chunk.endsWith(";")) { pending = chunk; continue; }
  console.log(chunk.slice(0, 500));
  break;
}
