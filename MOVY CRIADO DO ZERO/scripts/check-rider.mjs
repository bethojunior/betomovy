import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";

const db = new DatabaseSync("data/movy.sqlite");
const city = db.prepare(`
  SELECT cities.id, cities.name
  FROM cities
  JOIN trip_types ON trip_types.city_id = cities.id AND trip_types.active = 1
  JOIN payment_methods ON payment_methods.city_id = cities.id AND payment_methods.code = 'cash' AND payment_methods.active = 1
  WHERE cities.active = 1
    AND (SELECT COUNT(*) FROM trips WHERE trips.city_id = cities.id AND origin_lat IS NOT NULL AND origin_lng != 0) >= 2
  ORDER BY CASE WHEN cities.name = 'Miami' THEN 0 ELSE 1 END, cities.name
  LIMIT 1
`).get();
if (!city) throw new Error("No city with a tariff, cash, and two mapped origins.");
const points = db.prepare(`
  SELECT origin AS name, origin_lat AS lat, origin_lng AS lng
  FROM trips
  WHERE city_id = ? AND origin_lat IS NOT NULL AND origin_lng != 0
  GROUP BY origin_lat, origin_lng
  LIMIT 2
`).all(city.id);
const password = randomBytes(12).toString("hex");
const email = `rider-${Date.now()}@movy.test`;
const page = await fetch("http://localhost:4173/rider");
const registered = await fetch("http://localhost:4173/api/rider/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Rider Proof", phone: "3055550199", email, password, cityId: city.id, acceptedTerms: true }),
});
const session = await registered.json();
if (!registered.ok) throw new Error(session.error || "register failed");
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` };
const tariffs = await (await fetch("http://localhost:4173/api/rider/tariffs", { headers })).json();
const type = tariffs.items?.[0];
if (!type) throw new Error("No active tariff for the rider city.");
const body = {
  origin: points[0].name,
  destination: points[1].name,
  originLat: points[0].lat,
  originLng: points[0].lng,
  destinationLat: points[1].lat,
  destinationLng: points[1].lng,
  tripTypeId: type.id,
  payment: "cash",
};
const quote = await (await fetch("http://localhost:4173/api/rider/quote", { method: "POST", headers, body: JSON.stringify(body) })).json();
const trip = await (await fetch("http://localhost:4173/api/rider/trips", { method: "POST", headers, body: JSON.stringify(body) })).json();
const trips = await (await fetch("http://localhost:4173/api/rider/trips", { headers })).json();
const delivery = await (await fetch("http://localhost:4173/api/rider/delivery", { headers })).json();
const wallet = await (await fetch("http://localhost:4173/api/rider/me", { headers })).json();
console.log(JSON.stringify({
  page: page.status,
  city: city.name,
  service: type.name,
  quoteError: quote.error || "",
  tripError: trip.error || "",
  distanceKm: quote.distanceKm,
  durationMin: quote.durationMin,
  fare: quote.fare,
  status: trip.status,
  reference: trip.reference,
  listed: trips.items?.[0]?.reference || "",
  balance: wallet.rider?.balance,
  deliveryPlaces: delivery.places?.length ?? 0,
  samePoint: points[0].lat === points[1].lat && points[0].lng === points[1].lng,
}));
process.exit(0);
