import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
const info = db.prepare("UPDATE delivery_prep SET prep_minutes = 0 WHERE city_id = 'legacy-city-5575' AND prep_minutes = 60").run();
console.log(JSON.stringify({ cleared: info.changes, prep: db.prepare("SELECT city_id, default_fee_cents, prep_minutes FROM delivery_prep").all(), min: db.prepare("SELECT city_id, min_order_cents FROM delivery_settings WHERE city_id LIKE 'legacy-%'").all() }));
