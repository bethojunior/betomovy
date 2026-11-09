import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";

const db = new DatabaseSync("data/movy.sqlite");
const city = db.prepare("SELECT city_id AS id FROM trip_types WHERE name = 'Movy Go' LIMIT 1").get();
const required = db.prepare("SELECT COUNT(*) AS total FROM app_documents WHERE audience = 'driver' AND required = 1 AND active = 1").get().total;
const password = randomBytes(12).toString("hex");
const email = `driver-${Date.now()}@movy.test`;
const page = await fetch("http://localhost:4173/driver");
const registered = await fetch("http://localhost:4173/api/driver/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Driver Proof", phone: "3055550188", email, password, cityId: city.id, vehicle: "Toyota Camry", plate: "FLA-2040", acceptedTerms: true }),
});
const session = await registered.json();
if (!registered.ok) throw new Error(session.error || "register failed");
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` };
const report = { page: page.status, required, status: session.driver.status, hasPassword: Object.hasOwn(session.driver, "password") };
if (session.driver.status === "approved") {
  const online = await (await fetch("http://localhost:4173/api/driver/presence", { method: "POST", headers, body: JSON.stringify({ presence: "available", lat: 25.77, lng: -80.19 }) })).json();
  const group = db.prepare("SELECT id FROM call_groups WHERE city_id = ? AND active = 1 LIMIT 1").get(city.id);
  if (group) db.prepare("INSERT OR IGNORE INTO call_group_drivers (group_id, driver_id, priority) VALUES (?, ?, 1)").run(group.id, session.driver.id);
  const riderPassword = randomBytes(12).toString("hex");
  const rider = await (await fetch("http://localhost:4173/api/rider/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Rider For Driver", phone: "3055550189", email: `rider-for-driver-${Date.now()}@movy.test`, password: riderPassword, cityId: city.id, acceptedTerms: true }),
  })).json();
  const riderHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${rider.token}` };
  const tariffs = await (await fetch("http://localhost:4173/api/rider/tariffs", { headers: riderHeaders })).json();
  const type = tariffs.items.find((item) => item.name === "Movy Go");
  const trip = await (await fetch("http://localhost:4173/api/rider/trips", {
    method: "POST",
    headers: riderHeaders,
    body: JSON.stringify({ origin: "GPS", destination: "Opt North", originLat: 25.77, originLng: -80.19, destinationLat: 25.8, destinationLng: -80.19, tripTypeId: type.id, payment: "cash" }),
  })).json();
  let offers = await (await fetch("http://localhost:4173/api/driver/offers", { headers })).json();
  const mine = offers.items.find((item) => item.id === trip.id);
  const steps = [];
  if (mine && mine.driverId === session.driver.id && mine.status === "accepted") {
    for (const action of ["arrive", "start", "finish"]) {
      offers = await (await fetch("http://localhost:4173/api/driver/act", { method: "POST", headers, body: JSON.stringify({ action, tripId: trip.id }) })).json();
      steps.push(action);
    }
  }
  const earnings = await (await fetch("http://localhost:4173/api/driver/earnings", { headers })).json();
  report.online = online.presence;
  report.trip = trip.status;
  report.mine = mine?.status || "";
  report.steps = steps;
  report.net = earnings.net;
  report.balance = earnings.balance;
}
console.log(JSON.stringify(report));
process.exit(0);
