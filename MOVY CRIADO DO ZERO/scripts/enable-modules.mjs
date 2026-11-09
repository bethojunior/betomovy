import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
db.prepare("UPDATE modules SET active = 1").run();
console.log(JSON.stringify(db.prepare("SELECT name, active FROM modules").all()));
