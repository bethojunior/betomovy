import fs from "node:fs";
import readline from "node:readline";

const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]), crlfDelay: Infinity });
for await (const line of rl) {
  if (line.startsWith("INSERT INTO `toll`")) {
    const match = line.match(/VALUES \((\d+),'((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)',/);
    const hex = line.indexOf(",0x");
    const hexEnd = line.indexOf(",", hex + 3);
    console.log(JSON.stringify({
      nameLength: match ? match[2].length : -1,
      addressLength: match ? match[3].length : -1,
      tail: line.slice(hexEnd, hexEnd + 80),
      bytes: line.length,
    }));
  }
  if (line.startsWith("INSERT INTO `cancellationReasons`")) {
    console.log(JSON.stringify({ reasonsBytes: line.length, head: line.slice(0, 180) }));
  }
}
