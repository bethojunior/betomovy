import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { attachDomain } from "./domain.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
mkdirSync(dataDir, { recursive: true });

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  return `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
}

export function checkPassword(user, password) {
  if (!user) return false;
  const [salt, hash] = String(user.password).split(":");
  const next = scryptSync(password, salt, 32);
  const current = Buffer.from(hash, "hex");
  return current.length === next.length && timingSafeEqual(current, next);
}

function sqliteStore(DatabaseSync) {
  const db = new DatabaseSync(join(dataDir, "movy.sqlite"));
  db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      resource TEXT NOT NULL,
      body TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS records_resource ON records(resource);
  `);
  const domain = attachDomain(db);
  return {
    engine: "sqlite",
    list(resource) {
      return db
        .prepare("SELECT id, body, updated_at FROM records WHERE resource = ? ORDER BY updated_at DESC")
        .all(resource)
        .map((row) => ({ ...JSON.parse(row.body), id: row.id, updatedAt: row.updated_at }));
    },
    save(resource, body) {
      const id = body.id || randomUUID();
      const updatedAt = new Date().toISOString();
      const stored = { ...body, id };
      delete stored.updatedAt;
      db.prepare(
        `INSERT INTO records (id, resource, body, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at, resource = excluded.resource`
      ).run(id, resource, JSON.stringify(stored), updatedAt);
      return { ...stored, updatedAt };
    },
    remove(id) {
      db.prepare("DELETE FROM records WHERE id = ?").run(id);
    },
    findUser(email) {
      return db.prepare("SELECT * FROM users WHERE email = ?").get(String(email || "").toLowerCase());
    },
    insertUser(user) {
      const row = { ...user, email: user.email.toLowerCase(), password: hashPassword(user.password) };
      db.prepare("INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)").run(
        row.id,
        row.email,
        row.name,
        row.password,
        row.role
      );
    },
    updatePassword(id, password) {
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashPassword(password), id);
    },
    userCount() {
      return db.prepare("SELECT COUNT(*) AS c FROM users").get().c;
    },
    getSetting(key, fallback) {
      const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
      return row ? JSON.parse(row.value) : fallback;
    },
    setSetting(key, value) {
      db.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
      ).run(key, JSON.stringify(value));
    },
    ...domain,
  };
}

function jsonStore() {
  const file = join(dataDir, "store.json");
  const read = () => {
    try {
      return JSON.parse(readFileSync(file, "utf8"));
    } catch {
      return { records: [], users: [], settings: {} };
    }
  };
  const write = (state) => writeFileSync(file, JSON.stringify(state));
  return {
    engine: "json",
    list(resource) {
      return read()
        .records.filter((row) => row.resource === resource)
        .map(({ resource: _resource, ...row }) => row);
    },
    save(resource, body) {
      const state = read();
      const id = body.id || randomUUID();
      const updatedAt = new Date().toISOString();
      const stored = { ...body, id, updatedAt, resource };
      const index = state.records.findIndex((row) => row.id === id);
      if (index >= 0) state.records[index] = stored;
      else state.records.push(stored);
      write(state);
      return stored;
    },
    remove(id) {
      const state = read();
      state.records = state.records.filter((row) => row.id !== id);
      write(state);
    },
    findUser(email) {
      return read().users.find((user) => user.email === String(email || "").toLowerCase());
    },
    insertUser(user) {
      const state = read();
      state.users.push({ ...user, email: user.email.toLowerCase(), password: hashPassword(user.password) });
      write(state);
    },
    updatePassword(id, password) {
      const state = read();
      const user = state.users.find((item) => item.id === id);
      if (user) user.password = hashPassword(password);
      write(state);
    },
    userCount() {
      return read().users.length;
    },
    getSetting(key, fallback) {
      const state = read();
      return key in state.settings ? state.settings[key] : fallback;
    },
    setSetting(key, value) {
      const state = read();
      state.settings[key] = value;
      write(state);
    },
  };
}

export async function openDatabase() {
  try {
    const { DatabaseSync } = await import("node:sqlite");
    return sqliteStore(DatabaseSync);
  } catch {
    return jsonStore();
  }
}

export function seed(db) {
  if (db.userCount() === 0) {
    db.insertUser({
      id: randomUUID(),
      email: "admin@movy.com",
      name: "Movy Owner",
      password: "MovyAdmin#2026",
      role: "owner",
    });
  }
  if (db.seedCore) db.seedCore();
  if (db.seedFinance) db.seedFinance();
  if (db.seedRules) db.seedRules();
  if (db.seedDelivery) db.seedDelivery();
  if (db.getSetting("ready", false)) return;
  db.setSetting("portugueseEnabled", false);
  db.setSetting("currency", "USD");
  db.setSetting("defaultLocale", "en");
  db.setSetting("cacheClearedAt", null);

  const city = "Miami";
  [
    ["Ava Collins", "+1 305 555 0142", "ava@example.com", "active", 2450, false],
    ["Liam Brooks", "+1 305 555 0177", "liam@example.com", "active", 800, false],
    ["Northwind Hotels", "+1 305 555 0100", "travel@northwind.example", "active", 15000, true],
  ].forEach(([name, phone, email, status, balance, company], index) => {
    db.save(company ? "companies" : "riders", {
      name,
      phone,
      email,
      document: company ? "59-2048812" : `S${10000000 + index}`,
      city,
      status,
      balance,
      notes: "",
      tradeName: company ? "Northwind" : "",
      creditLimit: company ? 50000 : 0,
    });
  });

  [
    ["Maya Chen", "available", 25.774, -80.19, "Toyota Camry", "FLA-1021", 4.96],
    ["Andre Silva", "en_route", 25.781, -80.21, "Honda Accord", "FLA-2280", 4.88],
    ["Noah Patel", "on_trip", 25.768, -80.18, "Hyundai Sonata", "FLA-4412", 4.91],
    ["Elena Rossi", "available", 25.755, -80.205, "Kia K5", "FLA-8831", 4.84],
    ["Chris Alvarez", "offline", 25.79, -80.17, "Nissan Altima", "FLA-3004", 4.79],
  ].forEach(([name, presence, lat, lng, vehicle, plate, rating], index) => {
    db.save("drivers", {
      name,
      phone: `+1 305 555 02${10 + index}`,
      email: `${name.split(" ")[0].toLowerCase()}@drivers.movy.com`,
      document: `D${20000000 + index}`,
      city,
      vehicle,
      plate,
      rating,
      presence,
      status: "approved",
      balance: 12800 + index * 2400,
      lat,
      lng,
    });
    db.save("driver-production", {
      driver: name,
      trips: 18 + index * 3,
      gross: 42000 + index * 8000,
      commission: 8400 + index * 1600,
      net: 33600 + index * 6400,
      period: "This week",
    });
  });

  [
    ["MV-10421", "Ava Collins", "Maya Chen", "Brickell City Centre", "Miami Beach", "completed", 1860, "card", 7.4],
    ["MV-10428", "Liam Brooks", "Noah Patel", "Wynwood", "MIA Airport", "in_progress", 3240, "card", 14.2],
    ["MV-10433", "Ava Collins", "Andre Silva", "Design District", "Coral Gables", "arriving", 2120, "wallet", 8.1],
    ["MV-10402", "Northwind Hotels", "Elena Rossi", "Downtown", "Port of Miami", "cancelled", 0, "invoice", 3.2],
  ].forEach(([reference, rider, driver, origin, destination, status, fare, payment, distanceKm]) => {
    db.save("trips", { reference, rider, driver, origin, destination, city, status, fare, payment, distanceKm });
  });

  db.save("tariffs", { name: "Movy Go", base: 250, perKm: 140, perMin: 30, minimum: 700, seats: 4, active: "yes" });
  db.save("tariffs", { name: "Movy Comfort", base: 400, perKm: 190, perMin: 40, minimum: 1100, seats: 4, active: "yes" });
  db.save("services", { name: "City", tariff: "Movy Go", city, active: "yes" });
  ["card", "cash", "wallet", "invoice"].forEach((code) => {
    db.save("payment-methods", { name: code[0].toUpperCase() + code.slice(1), code, city, active: "yes" });
  });
  db.save("cities", { name: city, state: "FL", country: "United States", timezone: "America/New_York", active: "yes" });
  db.save("centrals", { name: "Miami Dispatch", city, phone: "+1 305 555 0199", status: "active" });
  db.save("neighborhoods", { central: "Miami Dispatch", name: "Brickell", city, flatFare: 1500, active: "yes" });
  db.save("coupons", { code: "WELCOME", kind: "fixed", value: 500, city, active: "yes" });
  db.save("commissions", { city, service: "City", percent: 20, fixed: 0, active: "yes" });
  db.save("cancel-reasons", { audience: "rider", reason: "Driver is too far", fee: "no", active: "yes" });
  db.save("cancel-reasons", { audience: "driver", reason: "Rider did not show", fee: "yes", active: "yes" });
  db.save("call-groups", { name: "Airport queue", city, strategy: "queue", active: "yes" });
  db.save("establishments", { name: "Harbor Kitchen", category: "Food", phone: "+1 305 555 0133", city, address: "120 Biscayne Blvd", status: "open" });
  db.save("delivery-orders", { code: "DL-220", establishment: "Harbor Kitchen", rider: "Ava Collins", driver: "Elena Rossi", address: "Brickell", status: "preparing", total: 2480 });
  db.save("delivery-sections", { name: "Food", city, sort: 1, active: "yes" });
  db.save("roles", { name: "Owner", description: "Full access to the monitor", active: "yes" });
  db.save("roles", { name: "Operations", description: "Fleet, trips and support", active: "yes" });
  ["trips", "delivery", "freight", "routes", "corporate"].forEach((module) => db.save("modules", { module, active: "yes" }));
  db.save("dispatch", { mode: "nearest", offerSeconds: 20, maxDrivers: 6, active: "yes" });
  db.save("terms", { audience: "both", title: "Terms of use", version: "1.0", body: "Movy provides urban mobility services. Fares are charged in US dollars.", active: "yes" });
  db.save("usage-policy", { title: "Usage policy", version: "1.0", body: "Drivers and riders must follow local traffic law and the Movy community rules.", active: "yes" });
  db.setSetting("ready", true);
}
