import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/movy.sqlite");
const one = (sql) => db.prepare(sql).get().c;
console.log(JSON.stringify({
  cities: one("SELECT COUNT(*) c FROM cities WHERE id LIKE 'legacy-city-%'"),
  customers: one("SELECT COUNT(*) c FROM customers WHERE id LIKE 'legacy-customer-%'"),
  drivers: one("SELECT COUNT(*) c FROM drivers WHERE id LIKE 'legacy-driver-%'"),
  companies: one("SELECT COUNT(*) c FROM companies WHERE id LIKE 'legacy-company-%'"),
  tariffs: one("SELECT COUNT(*) c FROM trip_types WHERE id LIKE 'legacy-price-%'"),
  trips: one("SELECT COUNT(*) c FROM trips WHERE id LIKE 'legacy-trip-%'"),
  cash: one("SELECT COUNT(*) c FROM trips WHERE id LIKE 'legacy-trip-%' AND payment = 'cash'"),
  card: one("SELECT COUNT(*) c FROM trips WHERE id LIKE 'legacy-trip-%' AND payment = 'card'"),
  wallet: one("SELECT COUNT(*) c FROM trips WHERE id LIKE 'legacy-trip-%' AND payment = 'wallet'"),
  invoice: one("SELECT COUNT(*) c FROM trips WHERE id LIKE 'legacy-trip-%' AND payment = 'invoice'"),
  centrals: one("SELECT COUNT(*) c FROM centrals WHERE id LIKE 'legacy-central-%'"),
  centralUsers: one("SELECT COUNT(*) c FROM central_users WHERE id LIKE 'legacy-central-user-%'"),
  categories: one("SELECT COUNT(*) c FROM delivery_categories WHERE id LIKE 'legacy-delivery-cat-%'"),
  establishments: one("SELECT COUNT(*) c FROM establishments WHERE id LIKE 'legacy-establishment-%'"),
  items: one("SELECT COUNT(*) c FROM delivery_menu_items WHERE id LIKE 'legacy-item-%'"),
}));
db.close();
