import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
console.log(JSON.stringify({
  settings: db.prepare("SELECT city_id, min_order_cents FROM delivery_settings").all(),
  prep: db.prepare("SELECT city_id, default_fee_cents, prep_minutes FROM delivery_prep").all(),
  places: db.prepare("SELECT id, status FROM establishments").all(),
  calls: db.prepare("SELECT COUNT(*) AS n FROM delivery_calls").get().n
}));
