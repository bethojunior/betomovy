import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";

const db = new DatabaseSync("data/movy.sqlite");
const city = db.prepare("SELECT city_id AS id FROM trip_types WHERE name = 'Movy Go' LIMIT 1").get();
const password = randomBytes(12).toString("hex");
const email = `rider-fare-${Date.now()}@movy.test`;
const registered = await fetch("http://localhost:4173/api/rider/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Fare Proof", phone: "3055550119", email, password, cityId: city.id, acceptedTerms: true }),
});
const session = await registered.json();
if (!registered.ok) throw new Error(session.error || "register failed");
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` };
const tariffs = await (await fetch("http://localhost:4173/api/rider/tariffs", { headers })).json();
const type = tariffs.items.find((item) => item.name === "Movy Go");
const body = {
  origin: "GPS",
  destination: "Opt North",
  originLat: 25.77,
  originLng: -80.19,
  destinationLat: 25.8,
  destinationLng: -80.19,
  tripTypeId: type.id,
  payment: "cash",
};
const quote = await (await fetch("http://localhost:4173/api/rider/quote", { method: "POST", headers, body: JSON.stringify(body) })).json();
const trip = await (await fetch("http://localhost:4173/api/rider/trips", { method: "POST", headers, body: JSON.stringify(body) })).json();
console.log(JSON.stringify({ quote: quote.fare, charged: trip.fare, status: trip.status, match: quote.fare === trip.fare, km: quote.distanceKm, min: quote.durationMin }));
process.exit(quote.fare === trip.fare ? 0 : 1);
