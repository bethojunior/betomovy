import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("data/movy.sqlite");
const city = db.prepare("SELECT city_id AS id FROM trip_types WHERE name = 'Movy Go' LIMIT 1").get();
const places = db.prepare("SELECT name, latitude AS lat, longitude AS lng FROM places WHERE city_id = ? AND latitude != 0 LIMIT 5").all(city.id);
const origins = db.prepare("SELECT origin, origin_lat AS lat, origin_lng AS lng FROM trips WHERE city_id = ? AND origin_lat IS NOT NULL AND origin_lng != 0 GROUP BY origin_lat, origin_lng LIMIT 2").all(city.id);
console.log(JSON.stringify({ places, origins }));
process.exit(0);
