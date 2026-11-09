import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("data/movy.sqlite");
const one = (sql) => db.prepare(sql).get().c;
console.log(JSON.stringify({
  plates: one("SELECT COUNT(*) c FROM drivers WHERE id LIKE 'legacy-driver-%' AND plate IS NOT NULL AND plate != ''"),
  vehicles: one("SELECT COUNT(*) c FROM drivers WHERE id LIKE 'legacy-driver-%' AND vehicle IS NOT NULL AND vehicle != ''"),
  places: one("SELECT COUNT(*) c FROM places WHERE id LIKE 'legacy-place-%'"),
  notes: one("SELECT COUNT(*) c FROM notifications WHERE id LIKE 'legacy-note-%'"),
  ledger: one("SELECT COUNT(*) c FROM ledger_entries WHERE id LIKE 'legacy-flow-%'"),
  deletions: one("SELECT COUNT(*) c FROM account_deletions WHERE id LIKE 'legacy-deletion-%'"),
}));
db.close();
