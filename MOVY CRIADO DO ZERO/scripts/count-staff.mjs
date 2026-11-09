import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
console.log(JSON.stringify({
  staff: db.prepare("SELECT COUNT(*) AS n FROM staff").get().n,
  roles: db.prepare("SELECT name FROM roles ORDER BY name").all().map((row) => row.name),
  links: db.prepare("SELECT COUNT(*) AS n FROM external_links").get().n
}));
