import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(process.argv[2]);
const n = (sql) => db.prepare(sql).get().n;
console.log(JSON.stringify({
  cities: n("SELECT COUNT(*) AS n FROM cities"),
  legacyCities: n("SELECT COUNT(*) AS n FROM cities WHERE id LIKE 'legacy-city-%'"),
  customers: n("SELECT COUNT(*) AS n FROM customers"),
  legacyCustomers: n("SELECT COUNT(*) AS n FROM customers WHERE id LIKE 'legacy-customer-%'"),
  drivers: n("SELECT COUNT(*) AS n FROM drivers"),
  legacyDrivers: n("SELECT COUNT(*) AS n FROM drivers WHERE id LIKE 'legacy-driver-%'"),
  trips: n("SELECT COUNT(*) AS n FROM trips"),
  legacyTrips: n("SELECT COUNT(*) AS n FROM trips WHERE id LIKE 'legacy-trip-%'"),
  tariffs: n("SELECT COUNT(*) AS n FROM trip_types"),
  legacyTariffs: n("SELECT COUNT(*) AS n FROM trip_types WHERE id LIKE 'legacy-price-%'"),
  charges: n("SELECT COUNT(*) AS n FROM acquirer_transactions"),
  legacyCharges: n("SELECT COUNT(*) AS n FROM acquirer_transactions WHERE id LIKE 'legacy-card-%'")
}));
