import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
const insert = db.prepare("INSERT OR IGNORE INTO payment_methods (id, city_id, code, name, active) VALUES (?, ?, ?, ?, 1)");
const names = { cash: "Cash", card: "Card", wallet: "Wallet" };
let added = 0;
db.exec("BEGIN");
for (const city of db.prepare("SELECT id FROM cities").all()) {
  for (const code of Object.keys(names)) {
    if (insert.run(`pay-${city.id}-${code}`, city.id, code, names[code]).changes) added += 1;
  }
}
db.exec("COMMIT");
console.log(JSON.stringify({
  added,
  methods: db.prepare("SELECT COUNT(*) AS n FROM payment_methods").get().n,
  offer: db.prepare("SELECT offer_seconds AS offer, active FROM dispatch_settings WHERE id = 'default'").get(),
  firestore: db.prepare("SELECT firestore_on AS firestore, auth_on AS auth FROM firebase_status WHERE id = 'default'").get(),
  notes: db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE id LIKE 'legacy-push-%'").get().n,
  services: db.prepare("SELECT COUNT(*) AS n FROM external_services").get().n
}));
