import { createServer } from "node:http";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { publicCatalog, screens } from "./catalog.mjs";
import { googleRoute, calculateRoute } from "./maps.mjs";
import { checkPassword, openDatabase, seed } from "./db.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const db = await openDatabase();
seed(db);
upgrade();
const sessions = new Map();
const riderSessions = new Map();
const driverSessions = new Map();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
};
const recoveryCodes = new Map();

function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = Buffer.isBuffer(body) || typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function userFrom(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = sessions.get(token);
  if (!session) return null;
  return { token, ...session };
}

function moneyOf(record) {
  return ["fare", "balance", "amount", "gross", "commission", "net", "total", "price", "fee", "creditLimit", "flatFare", "base", "perKm", "perMin", "minimum", "fixed", "reward"].reduce(
    (sum, key) => sum + (Number(record[key]) || 0),
    0
  );
}

function metrics() {
  const trips = db.listTrips ? db.listTrips() : db.list("trips");
  const drivers = db.listDrivers ? db.listDrivers() : db.list("drivers");
  const people = db.listCustomers ? [...db.listCustomers(), ...db.listCompanies()] : [...db.list("riders"), ...db.list("companies")];
  const today = new Date().toISOString().slice(0, 10);
  const todayTrips = trips.filter((trip) => String(trip.day || "").startsWith(today));
  const completedToday = todayTrips.filter((trip) => trip.status === "completed");
  const grossToday = completedToday.reduce((sum, trip) => sum + Number(trip.fare || 0), 0);
  const completed = trips.filter((trip) => trip.status === "completed");
  const cancelled = trips.filter((trip) => trip.status === "cancelled");
  const types = ["private", "delivery"].map((service) => {
    const group = drivers.filter((driver) => (driver.service || "private") === service);
    return {
      service,
      total: group.length,
      active: group.filter((driver) => driver.presence && driver.presence !== "offline" && driver.status === "approved").length,
      waiting: group.filter((driver) => driver.presence === "offline" && driver.status === "approved").length,
      pending: group.filter((driver) => driver.status === "pending").length,
      blocked: group.filter((driver) => driver.status === "blocked").length,
    };
  });
  const byDriver = {};
  const byRider = {};
  completed.forEach((trip) => {
    byDriver[trip.driver] = byDriver[trip.driver] || { name: trip.driver, trips: 0, gross: 0 };
    byDriver[trip.driver].trips += 1;
    byDriver[trip.driver].gross += Number(trip.fare || 0);
    byRider[trip.rider] = byRider[trip.rider] || { name: trip.rider, trips: 0, gross: 0 };
    byRider[trip.rider].trips += 1;
    byRider[trip.rider].gross += Number(trip.fare || 0);
  });
  const rank = (map) => Object.values(map).sort((a, b) => b.gross - a.gross).slice(0, 5);
  return {
    trips: trips.length,
    completed: completed.length,
    cancelled: cancelled.length,
    gross: completed.reduce((sum, trip) => sum + Number(trip.fare || 0), 0),
    todayTrips: todayTrips.length,
    todayRevenue: grossToday,
    averageTicket: completedToday.length ? Math.round(grossToday / completedToday.length) : 0,
    activeVehicles: drivers.filter((driver) => driver.presence && driver.presence !== "offline").length,
    registeredVehicles: drivers.length,
    online: drivers.filter((driver) => driver.presence && driver.presence !== "offline").length,
    drivers: drivers.length,
    acceptance: trips.length ? Math.round(((trips.length - cancelled.length) / trips.length) * 100) : 0,
    passengers: {
      total: people.length,
      active: people.filter((person) => person.status === "active").length,
      pending: people.filter((person) => person.status === "pending").length,
      blocked: people.filter((person) => person.status === "blocked").length,
    },
    payments: {
      cash: trips.filter((trip) => trip.payment === "cash").length,
      voucher: trips.filter((trip) => trip.payment === "invoice" || trip.payment === "voucher").length,
      card: trips.filter((trip) => trip.payment === "card").length,
    },
    statuses: {
      accepted: trips.filter((trip) => ["accepted", "arriving", "in_progress"].includes(trip.status)).length,
      finished: completed.length,
      total: trips.length,
    },
    cancellations: {
      driver: cancelled.filter((trip) => trip.cancelledBy === "driver").length,
      rider: cancelled.filter((trip) => trip.cancelledBy !== "driver").length,
      total: cancelled.length,
    },
    types,
    topDrivers: rank(byDriver),
    topRiders: rank(byRider),
  };
}

function sampleFor(screen) {
  const body = { city: "Miami", status: "active", active: "yes" };
  screen.fields.forEach((field) => {
    if (body[field.key] != null) return;
    if (field.type === "money") body[field.key] = 1000;
    else if (field.type === "number") body[field.key] = 1;
    else if (field.type === "select") body[field.key] = field.options[0];
    else if (field.type === "email") body[field.key] = "ops@movy.com";
    else if (field.type === "phone") body[field.key] = "+13055550100";
    else body[field.key] = screen.en;
  });
  return body;
}

function applyLedger(entry) {
  if (!entry || entry.status === "void" || !entry.driver) return;
  const driver = db.list("drivers").find((item) => String(item.name).toLowerCase() === String(entry.driver).toLowerCase());
  if (!driver) return;
  const amount = Number(entry.amount || 0);
  const balance = Number(driver.balance || 0) + (entry.direction === "debit" ? -amount : amount);
  db.save("drivers", { ...driver, balance });
}

function upgrade() {
  const version = Number(db.getSetting("modelVersion", 1) || 1);
  if (version < 2) {
    const today = new Date().toISOString().slice(0, 10);
    db.list("drivers").forEach((driver, index) => {
      db.save("drivers", { ...driver, service: index === 3 ? "delivery" : "private" });
    });
    db.list("trips").forEach((trip, index) => {
      db.save("trips", {
        ...trip,
        day: index === 0 ? today : "2026-11-01",
        cancelledBy: trip.status === "cancelled" ? "rider" : "",
      });
    });
  }
  if (version < 3) {
    screens.forEach((item) => {
      if (!item.fields.length || db.list(item.key).length) return;
      db.save(item.key, sampleFor(item));
    });
    db.setSetting("modelVersion", 3);
  }
}

function fleet() {
  const now = Date.now() / 60000;
  const source = db.listDrivers ? db.listDrivers() : db.list("drivers");
  return source.map((driver) => {
    const lat = Number(driver.lat || 25.77);
    const lng = Number(driver.lng || -80.19);
    const moving = driver.presence && driver.presence !== "offline";
    const wobble = driver.presence === "available" ? 0.003 : 0.006;
    const seed = driver.name ? driver.name.length : 1;
    return {
      ...driver,
      lat: moving ? lat + Math.sin(now + seed) * wobble : lat,
      lng: moving ? lng + Math.cos(now + seed) * wobble : lng,
    };
  });
}

function handleDomain(req, res, url) {
  if (!db.listCustomers) return false;
  const q = url.searchParams.get("q") || "";
  const cityId = url.searchParams.get("cityId") || "";
  const fail = (error) => send(res, 400, { error: error.message || "Request failed." });
  const run = async (action) => {
    try {
      await action();
    } catch (error) {
      fail(error);
    }
  };
  if (req.method === "GET" && url.pathname === "/api/lookups") {
    send(res, 200, { cities: db.listCities(), customers: db.listCustomers(), companies: db.listCompanies(), drivers: db.listDrivers(), tripTypes: db.listTripTypes(), trips: db.listTrips(), establishments: db.listEstablishments(), categories: db.listCategories(), freightItems: db.listFreightItems(), freightExtras: db.listFreightExtras(), freightAccess: db.listFreightAccess(), callGroups: db.listCallGroups(), cancelReasons: db.listCancelReasons(), penalties: db.listPenalties(), routes: db.listRoutes(), routeItems: db.listRouteItems(), managers: db.listManagers(), partners: db.listPartners(), roles: db.listRoles(), centrals: db.listCentrals(), neighborhoods: db.listNeighborhoods(), deliverySections: db.listSections(), deliveryAccessories: db.listAccessories(), staff: db.listStaff(), externalServices: db.listExternalServices(), appDocuments: db.listAppDocuments(), deliveryItems: db.listDeliveryItems(), places: db.listPlaces() });
    return true;
  }
  if (req.method === "GET" && url.pathname === "/api/cities") return send(res, 200, { items: db.listCities() }), true;
  if (req.method === "POST" && url.pathname === "/api/cities") return run(async () => send(res, 201, db.saveCity(await readBody(req)))), true;
  let match = url.pathname.match(/^\/api\/cities\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveCity({ ...(await readBody(req)), id: match[1] }))), true;
  if (match && req.method === "DELETE") return run(() => { db.removeCity(match[1]); send(res, 200, { ok: true }); }), true;
  if (req.method === "GET" && url.pathname === "/api/customers") return send(res, 200, { items: db.listCustomers(q) }), true;
  if (req.method === "POST" && url.pathname === "/api/customers") return run(async () => send(res, 201, db.saveCustomer(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/customers\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveCustomer({ ...(await readBody(req)), id: match[1] }))), true;
  if (req.method === "GET" && url.pathname === "/api/companies") return send(res, 200, { items: db.listCompanies(q) }), true;
  if (req.method === "POST" && url.pathname === "/api/companies") return run(async () => send(res, 201, db.saveCompany(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/companies\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveCompany({ ...(await readBody(req)), id: match[1] }))), true;
  if (req.method === "GET" && url.pathname === "/api/drivers") return send(res, 200, { items: db.listDrivers(q) }), true;
  if (req.method === "POST" && url.pathname === "/api/drivers") return run(async () => send(res, 201, db.saveDriver(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/drivers\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveDriver({ ...(await readBody(req)), id: match[1] }))), true;
  if (req.method === "GET" && url.pathname === "/api/trip-types") return send(res, 200, { items: db.listTripTypes() }), true;
  if (req.method === "POST" && url.pathname === "/api/trip-types") return run(async () => send(res, 201, db.saveTripType(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/trip-types\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveTripType({ ...(await readBody(req)), id: match[1] }))), true;
  if (req.method === "GET" && url.pathname === "/api/trips") return send(res, 200, { items: db.listTrips(q) }), true;
  if (req.method === "POST" && url.pathname === "/api/trips") return run(async () => send(res, 201, db.saveTrip(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/trips\/([^/]+)$/);
  if (match && req.method === "PATCH") return run(async () => send(res, 200, db.saveTrip({ ...(await readBody(req)), id: match[1] }))), true;
  if (req.method === "GET" && url.pathname === "/api/vehicle-changes") return send(res, 200, { items: db.listVehicleChanges() }), true;
  if (req.method === "POST" && url.pathname === "/api/vehicle-changes") return run(async () => send(res, 201, db.saveVehicleChange(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/vehicle-changes\/([^/]+)\/decision$/);
  if (match && req.method === "POST") return run(async () => send(res, 200, db.decideVehicleChange(match[1], (await readBody(req)).status))), true;
  if (req.method === "GET" && url.pathname === "/api/driver-documents") return send(res, 200, { items: db.listDriverDocuments() }), true;
  if (req.method === "POST" && url.pathname === "/api/driver-documents") return run(async () => send(res, 201, db.saveDriverDocument(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/driver-documents\/([^/]+)\/review$/);
  if (match && req.method === "POST") return run(async () => send(res, 200, db.reviewDriverDocument(match[1], (await readBody(req)).status))), true;
  match = url.pathname.match(/^\/api\/account-deletions\/(customer|driver)$/);
  if (match && req.method === "GET") return send(res, 200, { items: db.listDeletions(match[1]) }), true;
  if (req.method === "POST" && url.pathname === "/api/account-deletions") return run(async () => send(res, 201, db.requestDeletion(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/account-deletions\/([^/]+)\/decision$/);
  if (match && req.method === "POST") return run(async () => { db.decideDeletion(match[1], (await readBody(req)).status); send(res, 200, { ok: true }); }), true;
  if (req.method === "GET" && url.pathname === "/api/driver-production") return send(res, 200, { items: db.driverProduction(cityId) }), true;
  if (req.method === "GET" && url.pathname === "/api/tariff-flags") return send(res, 200, { items: db.listFlags() }), true;
  if (req.method === "POST" && url.pathname === "/api/tariff-flags") return run(async () => send(res, 201, db.saveFlag(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/tariff-triggers") return send(res, 200, { items: db.listTriggers() }), true;
  if (req.method === "POST" && url.pathname === "/api/tariff-triggers") return run(async () => send(res, 201, db.saveTrigger(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/dynamic-areas") return send(res, 200, { items: db.listDynamicAreas() }), true;
  if (req.method === "POST" && url.pathname === "/api/dynamic-areas") return run(async () => send(res, 201, db.saveDynamicArea(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/tolls") return send(res, 200, { items: db.listTolls() }), true;
  if (req.method === "POST" && url.pathname === "/api/tolls") return run(async () => send(res, 201, db.saveToll(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/coupons") return send(res, 200, { items: db.listCoupons() }), true;
  if (req.method === "POST" && url.pathname === "/api/coupons") return run(async () => send(res, 201, db.saveCoupon(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/call-radius") return send(res, 200, { items: db.listRadius() }), true;
  if (req.method === "POST" && url.pathname === "/api/call-radius") return run(async () => send(res, 201, db.saveRadius(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/map-keys") return send(res, 200, db.mapKeyStatus()), true;
  if (req.method === "POST" && url.pathname === "/api/map-keys") return run(async () => send(res, 201, db.saveMapKey(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/categories") return send(res, 200, { items: db.listCategories() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/categories") return run(async () => send(res, 201, db.saveCategory(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/establishments") return send(res, 200, { items: db.listEstablishments() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/establishments") return run(async () => send(res, 201, db.saveEstablishment(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/zones") return send(res, 200, { items: db.listZones() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/zones") return run(async () => send(res, 201, db.saveZone(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/orders") return send(res, 200, { items: db.listOrders() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/orders") return run(async () => send(res, 201, db.placeOrder(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/freight/items") return send(res, 200, { items: db.listFreightItems() }), true;
  if (req.method === "POST" && url.pathname === "/api/freight/items") return run(async () => send(res, 201, db.saveFreightItem(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/freight/extras") return send(res, 200, { items: db.listFreightExtras() }), true;
  if (req.method === "POST" && url.pathname === "/api/freight/extras") return run(async () => send(res, 201, db.saveFreightExtra(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/freight/access") return send(res, 200, { items: db.listFreightAccess() }), true;
  if (req.method === "POST" && url.pathname === "/api/freight/access") return run(async () => send(res, 201, db.saveFreightAccess(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/freight/quotes") return send(res, 200, { items: db.listFreightQuotes() }), true;
  if (req.method === "POST" && url.pathname === "/api/freight/quotes") return run(async () => send(res, 201, db.quoteFreight(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/call-groups") return send(res, 200, { items: db.listCallGroups() }), true;
  if (req.method === "POST" && url.pathname === "/api/call-groups") return run(async () => send(res, 201, db.saveCallGroup(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/call-group-drivers") return send(res, 200, { items: db.listCallGroupDrivers() }), true;
  if (req.method === "POST" && url.pathname === "/api/call-group-drivers") return run(async () => send(res, 201, db.linkCallGroupDriver(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/cancel-reasons") return send(res, 200, { items: db.listCancelReasons() }), true;
  if (req.method === "POST" && url.pathname === "/api/cancel-reasons") return run(async () => send(res, 201, db.saveCancelReason(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/payment-methods") return send(res, 200, { items: db.listPaymentMethods() }), true;
  if (req.method === "POST" && url.pathname === "/api/payment-methods") return run(async () => send(res, 201, db.savePaymentMethod(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/penalties") return send(res, 200, { items: db.listDriverPenalties() }), true;
  if (req.method === "POST" && url.pathname === "/api/penalties") return run(async () => send(res, 201, db.savePenalty(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/penalties/apply") return run(async () => send(res, 201, db.applyPenalty(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/penalties\/([^/]+)\/release$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.releasePenalty(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/modules") return send(res, 200, { items: db.listModules() }), true;
  if (req.method === "POST" && url.pathname === "/api/modules") return run(async () => send(res, 201, db.saveModule(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/vouchers") return send(res, 200, { items: db.listVouchers() }), true;
  if (req.method === "POST" && url.pathname === "/api/vouchers") return run(async () => send(res, 201, db.saveVoucher(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/risk-areas") return send(res, 200, { items: db.listRiskAreas() }), true;
  if (req.method === "POST" && url.pathname === "/api/risk-areas") return run(async () => send(res, 201, db.saveRiskArea(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/routes") return send(res, 200, { items: db.listRoutes(), bookings: db.listRouteBookings() }), true;
  if (req.method === "POST" && url.pathname === "/api/routes") return run(async () => send(res, 201, db.saveRoute(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/route-items") return send(res, 200, { items: db.listRouteItems() }), true;
  if (req.method === "POST" && url.pathname === "/api/route-items") return run(async () => send(res, 201, db.saveRouteItem(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/route-drivers") return send(res, 200, { items: db.listRouteDrivers() }), true;
  if (req.method === "POST" && url.pathname === "/api/route-drivers") return run(async () => send(res, 201, db.releaseRouteDriver(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/route-banners") return send(res, 200, { items: db.listRouteBanners() }), true;
  if (req.method === "POST" && url.pathname === "/api/route-banners") return run(async () => send(res, 201, db.saveRouteBanner(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/route-bookings") return run(async () => send(res, 201, db.bookRoute(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/managers") return send(res, 200, { items: db.listManagers() }), true;
  if (req.method === "POST" && url.pathname === "/api/managers") return run(async () => send(res, 201, db.saveManager(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/manager-drivers") return send(res, 200, { items: db.listManagerDrivers(), earnings: db.listManagerEarnings() }), true;
  if (req.method === "POST" && url.pathname === "/api/manager-drivers") return run(async () => send(res, 201, db.linkManagerDriver(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/partners") return send(res, 200, { items: db.listPartners() }), true;
  if (req.method === "POST" && url.pathname === "/api/partners") return run(async () => send(res, 201, db.savePartner(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/partner-messages") return send(res, 200, { items: db.listPartnerMessages() }), true;
  if (req.method === "POST" && url.pathname === "/api/partner-messages") return run(async () => send(res, 201, db.openPartnerMessage(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/partner-messages\/([^/]+)\/close$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.closePartnerMessage(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/trip-promotions") return send(res, 200, { items: db.listTripPromotions(), grants: db.listPromotionGrants() }), true;
  if (req.method === "POST" && url.pathname === "/api/trip-promotions") return run(async () => send(res, 201, db.saveTripPromotion(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/ads") return send(res, 200, { items: db.listAds() }), true;
  if (req.method === "POST" && url.pathname === "/api/ads") return run(async () => send(res, 201, db.saveAd(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/external-links") return send(res, 200, { items: db.listExternalLinks() }), true;
  if (req.method === "POST" && url.pathname === "/api/external-links") return run(async () => send(res, 201, db.saveExternalLink(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/app-ads") return send(res, 200, { items: db.listAppAds() }), true;
  if (req.method === "POST" && url.pathname === "/api/app-ads") return run(async () => send(res, 201, db.saveAppAd(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/support/rider") return send(res, 200, { items: db.listTickets("rider") }), true;
  if (req.method === "POST" && url.pathname === "/api/support/rider") return run(async () => send(res, 201, db.openRiderTicket(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/support/trip") return send(res, 200, { items: db.listTickets("trip") }), true;
  if (req.method === "POST" && url.pathname === "/api/support/trip") return run(async () => send(res, 201, db.openTripTicket(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/support\/([^/]+)\/close$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.closeTicket(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/notifications") return send(res, 200, { items: db.listNotifications() }), true;
  if (req.method === "POST" && url.pathname === "/api/notifications") return run(async () => send(res, 201, db.saveNotification(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/notifications\/([^/]+)\/send$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.sendNotification(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/roles") return send(res, 200, { items: db.listRoles() }), true;
  if (req.method === "POST" && url.pathname === "/api/roles") return run(async () => send(res, 201, db.saveRole(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/roles\/([^/]+)$/);
  if (match && req.method === "DELETE") return run(() => { db.removeRole(match[1]); send(res, 200, { ok: true }); }), true;
  if (req.method === "GET" && url.pathname === "/api/staff") return send(res, 200, { items: db.listStaff() }), true;
  if (req.method === "POST" && url.pathname === "/api/staff") return run(async () => send(res, 201, db.saveStaff(await readBody(req)))), true;
      if (req.method === "GET" && url.pathname === "/api/centrals") return send(res, 200, { items: db.listCentrals() }), true;
      if (req.method === "GET" && url.pathname === "/api/central/desk") return run(() => send(res, 200, db.centralDesk(url.searchParams.get("centralId")))), true;
      if (req.method === "GET" && url.pathname === "/api/central/trips") return run(() => send(res, 200, { items: db.listCentralTrips(url.searchParams.get("centralId"), q, url.searchParams.get("status") || "", url.searchParams.get("from") || "", url.searchParams.get("to") || "") })), true;
      if (req.method === "POST" && url.pathname === "/api/central/trips/cancel") return run(async () => send(res, 200, db.cancelCentralTrip(await readBody(req)))), true;
      if (req.method === "GET" && url.pathname === "/api/central/trip") return run(() => send(res, 200, db.centralTrip(url.searchParams.get("centralId"), url.searchParams.get("tripId")))), true;
      if (req.method === "POST" && url.pathname === "/api/central/trip-status") return run(async () => send(res, 200, db.setCentralTripStatus(await readBody(req)))), true;
      if (req.method === "GET" && url.pathname === "/api/central/addresses") return run(() => send(res, 200, { items: db.searchAddresses(url.searchParams.get("cityId"), q) })), true;
      if (req.method === "POST" && url.pathname === "/api/central/favorites") return run(async () => send(res, 200, db.toggleFavorite(await readBody(req)))), true;
      if (req.method === "POST" && url.pathname === "/api/central/messages") return run(async () => send(res, 201, db.saveCentralMessage(await readBody(req)))), true;
      if (req.method === "POST" && url.pathname === "/api/central/neighborhood-rides") return run(async () => send(res, 200, db.setNeighborhoodRides(await readBody(req)))), true;
      if (req.method === "POST" && url.pathname === "/api/routes/active") return run(async () => send(res, 200, db.setRouteActive(await readBody(req)))), true;
      if (req.method === "GET" && url.pathname === "/api/central/routes") return run(() => send(res, 200, { items: db.listCityRoutes(url.searchParams.get("cityId")) })), true;
      if (req.method === "GET" && url.pathname === "/api/central/tariffs") return run(() => send(res, 200, { items: db.listCityTariffs(url.searchParams.get("cityId")) })), true;
      if (req.method === "GET" && url.pathname === "/api/central/fields") return run(() => send(res, 200, { items: db.listCentralFields(url.searchParams.get("centralId")) })), true;
      if (req.method === "POST" && url.pathname === "/api/central/fields") return run(async () => send(res, 201, db.saveCentralField(await readBody(req)))), true;
      if (req.method === "GET" && url.pathname === "/api/whatsapp/groups") return send(res, 200, { items: db.listWhatsappGroups() }), true;
      if (req.method === "POST" && url.pathname === "/api/whatsapp/groups") return run(async () => send(res, 201, db.saveWhatsappGroup(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/centrals") return run(async () => send(res, 201, db.saveCentral(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/central-users") return send(res, 200, { items: db.listCentralUsers() }), true;
  if (req.method === "POST" && url.pathname === "/api/central-users") return run(async () => send(res, 201, db.saveCentralUser(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/neighborhoods") return send(res, 200, { items: db.listNeighborhoods() }), true;
  if (req.method === "POST" && url.pathname === "/api/neighborhoods") return run(async () => send(res, 201, db.saveNeighborhood(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/central-settings") return send(res, 200, { items: db.listCentralSettings() }), true;
  if (req.method === "POST" && url.pathname === "/api/central-settings") return run(async () => send(res, 201, db.saveCentralSettings(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/reports") return send(res, 200, { items: db.listReports() }), true;
  if (req.method === "POST" && url.pathname === "/api/reports/run") return run(async () => send(res, 201, db.runReport(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/reports\/([^/]+)\/file$/);
  if (match && req.method === "GET") return run(() => { const file = db.reportFile(match[1]); res.writeHead(200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="${file.name}.csv"` }); res.end(file.csv); }), true;
  match = url.pathname.match(/^\/api\/import\/(riders|drivers)$/);
  if (match && req.method === "POST") return run(async () => send(res, 200, db.importPeople(match[1] === "drivers" ? "drivers" : "riders", (await readBody(req)).csv))), true;
  if (req.method === "GET" && url.pathname === "/api/places") return send(res, 200, { items: db.listPlaces() }), true;
  if (req.method === "POST" && url.pathname === "/api/places") return run(async () => send(res, 201, db.savePlace(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/irregular-addresses") return send(res, 200, { items: db.listIrregular() }), true;
  if (req.method === "POST" && url.pathname === "/api/irregular-addresses") return run(async () => send(res, 201, db.saveIrregular(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/irregular-addresses\/([^/]+)\/resolve$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.resolveIrregular(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/address-cache") return send(res, 200, { items: db.listAddressCache() }), true;
  if (req.method === "GET" && url.pathname === "/api/heat-areas") return send(res, 200, { items: db.listHeatAreas() }), true;
  if (req.method === "POST" && url.pathname === "/api/heat-areas") return run(async () => send(res, 201, db.saveHeatArea(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/monitoring-areas") return send(res, 200, { items: db.listMonitoringAreas() }), true;
  if (req.method === "POST" && url.pathname === "/api/monitoring-areas") return run(async () => send(res, 201, db.saveMonitoringArea(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/map-sequence") return send(res, 200, { items: db.listSequence() }), true;
  if (req.method === "POST" && url.pathname === "/api/map-sequence") return run(async () => send(res, 201, db.saveSequence(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/birthdays") return send(res, 200, { items: db.listBirthdays() }), true;
  if (req.method === "POST" && url.pathname === "/api/birthdays") return run(async () => send(res, 201, db.saveBirthday(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/birthdays/run") return run(() => send(res, 200, db.runBirthdays())), true;
  if (req.method === "GET" && url.pathname === "/api/whatsapp/session") return send(res, 200, { items: [db.whatsappStatus()] }), true;
  if (req.method === "POST" && url.pathname === "/api/whatsapp/session") return run(async () => send(res, 200, db.saveWhatsappSession(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/whatsapp/keys") return send(res, 200, { items: db.listWhatsappKeys() }), true;
  if (req.method === "POST" && url.pathname === "/api/whatsapp/keys") return run(async () => send(res, 201, db.saveWhatsappKey(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/whatsapp/notices") return send(res, 200, { items: db.listWhatsappNotices() }), true;
  if (req.method === "POST" && url.pathname === "/api/whatsapp/notices") return run(async () => send(res, 201, db.saveWhatsappNotice(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/whatsapp\/trips\/([^/]+)\/send$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.sendTripWhatsapp(match[1]))), true;
  if (req.method === "POST" && url.pathname === "/api/smtp") return run(async () => send(res, 200, db.saveSmtp(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/smtp/outbox") return send(res, 200, { items: db.listOutbox() }), true;
  if (req.method === "GET" && url.pathname === "/api/confirmation-codes") return send(res, 200, { items: db.confirmationStatus() }), true;
  if (req.method === "POST" && url.pathname === "/api/confirmation-codes") return run(async () => send(res, 200, db.saveConfirmation(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/terms") return send(res, 200, { items: db.listTerms() }), true;
  if (req.method === "POST" && url.pathname === "/api/terms") return run(async () => send(res, 201, db.saveTerm(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/terms/accept") return run(async () => send(res, 200, db.acceptTerms(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/firebase") return send(res, 200, { items: db.firebaseStatus() }), true;
  if (req.method === "POST" && url.pathname === "/api/firebase") return run(async () => send(res, 200, db.saveFirebase(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/versions") return send(res, 200, { items: db.listVersions() }), true;
  if (req.method === "POST" && url.pathname === "/api/versions") return run(async () => send(res, 201, db.saveVersion(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/app-config") return send(res, 200, { items: db.listAppConfig() }), true;
  if (req.method === "POST" && url.pathname === "/api/app-config") return run(async () => send(res, 200, db.saveAppConfig(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery-settings") return send(res, 200, { items: db.listDeliverySettings() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery-settings") return run(async () => send(res, 200, db.saveDeliverySettings(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/driver-signup-config") return send(res, 200, { items: db.driverSignupStatus() }), true;
  if (req.method === "POST" && url.pathname === "/api/driver-signup-config") return run(async () => send(res, 200, db.saveDriverSignup(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/sections") return send(res, 200, { items: db.listSections() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/sections") return run(async () => send(res, 201, db.saveSection(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/sections/link") return run(async () => send(res, 200, db.linkSection(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/accessories") return send(res, 200, { items: db.listAccessories() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/accessories") return run(async () => send(res, 201, db.saveAccessory(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/config") return send(res, 200, { items: db.deliveryConfig() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/config") return run(async () => send(res, 200, db.saveDeliveryConfig(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/asaas") return send(res, 200, { items: db.asaasStatus() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/asaas") return run(async () => send(res, 200, db.saveAsaas(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/calls") return send(res, 200, { items: db.listDeliveryCalls() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/calls") return run(async () => send(res, 200, db.saveDeliveryCall(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery/settlements") return send(res, 200, { items: db.listSettlements() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery/settlements") return run(async () => send(res, 201, db.settleDelivery(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/acquirer") return send(res, 200, { items: db.acquirerAccount() }), true;
  if (req.method === "POST" && url.pathname === "/api/acquirer") return run(async () => send(res, 200, db.saveAcquirer(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/acquirer/cities") return send(res, 200, { items: db.listCityAcquirers() }), true;
  if (req.method === "POST" && url.pathname === "/api/acquirer/cities") return run(async () => send(res, 200, db.saveCityAcquirer(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/acquirer/transactions") return send(res, 200, { items: db.listAcquirerTransactions() }), true;
  if (req.method === "POST" && url.pathname === "/api/acquirer/charges") return run(async () => send(res, 201, db.chargeAcquirer(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/dispatch") return send(res, 200, { items: db.dispatchStatus() }), true;
  if (req.method === "POST" && url.pathname === "/api/dispatch") return run(async () => send(res, 200, db.saveDispatch(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/finance-reports") return send(res, 200, { items: db.listFinanceReports() }), true;
  if (req.method === "POST" && url.pathname === "/api/finance-reports") return run(async () => send(res, 201, db.runFinanceReport(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/admin-alerts") return send(res, 200, { items: db.listAlerts() }), true;
  if (req.method === "POST" && url.pathname === "/api/admin-alerts") return run(async () => send(res, 201, db.saveAlert(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/admin-alerts\/([^/]+)\/read$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.readAlert(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/external-services") return send(res, 200, { items: db.listExternalServices() }), true;
  if (req.method === "POST" && url.pathname === "/api/external-services") return run(async () => send(res, 201, db.saveExternalService(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/external-city-services") return send(res, 200, { items: db.listExternalCityServices() }), true;
  if (req.method === "POST" && url.pathname === "/api/external-city-services") return run(async () => send(res, 200, db.saveExternalCityService(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/webhooks") return send(res, 200, { items: db.listWebhooks(), deliveries: db.listWebhookDeliveries() }), true;
  if (req.method === "POST" && url.pathname === "/api/webhooks") return run(async () => send(res, 201, db.saveWebhook(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/webhook-deliveries") return send(res, 200, { items: db.listWebhookDeliveries() }), true;
  if (req.method === "GET" && url.pathname === "/api/app-documents") return send(res, 200, { items: db.listAppDocuments() }), true;
  if (req.method === "POST" && url.pathname === "/api/app-documents") return run(async () => send(res, 201, db.saveAppDocument(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/document-requirements") return send(res, 200, { items: db.listDocumentRequirements() }), true;
  if (req.method === "POST" && url.pathname === "/api/document-requirements") return run(async () => send(res, 201, db.saveDocumentRequirement(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/document-files") return run(async () => send(res, 201, db.submitDocument(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/phones") return send(res, 200, { items: db.listPhones() }), true;
  if (req.method === "POST" && url.pathname === "/api/phones") return run(async () => send(res, 201, db.savePhone(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/usage-policy") return send(res, 200, { items: db.listPolicies() }), true;
  if (req.method === "POST" && url.pathname === "/api/usage-policy") return run(async () => send(res, 201, db.savePolicy(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/usage-policy/accept") return run(async () => send(res, 200, db.acceptPolicy(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/driver-chat") return send(res, 200, { items: db.listChatMessages() }), true;
  if (req.method === "POST" && url.pathname === "/api/driver-chat") return run(async () => send(res, 201, db.saveChatMessage(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/driver-chat/send") return run(async () => send(res, 201, db.sendDriverChat(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/suggestions") return send(res, 200, { items: db.listSuggestions() }), true;
  if (req.method === "POST" && url.pathname === "/api/suggestions") return run(async () => send(res, 201, db.saveSuggestion(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/app-keys") return send(res, 200, { items: db.listAppKeys() }), true;
  if (req.method === "POST" && url.pathname === "/api/app-keys") return run(async () => send(res, 201, db.saveAppKey(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/credentials") return send(res, 200, { items: db.listCredentials() }), true;
  if (req.method === "POST" && url.pathname === "/api/credentials") return run(async () => send(res, 201, db.saveCredential(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/city-settings") return send(res, 200, { items: db.listCitySettings() }), true;
  if (req.method === "POST" && url.pathname === "/api/city-settings") return run(async () => send(res, 200, db.saveCitySetting(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/additional-settings") return send(res, 200, { items: db.listAdditional() }), true;
  if (req.method === "POST" && url.pathname === "/api/additional-settings") return run(async () => send(res, 200, db.saveAdditional(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/partner-apps") return send(res, 200, { items: db.listPartnerApps() }), true;
  if (req.method === "POST" && url.pathname === "/api/partner-apps") return run(async () => send(res, 201, db.savePartnerApp(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/services") return send(res, 200, { items: db.listServices() }), true;
  if (req.method === "POST" && url.pathname === "/api/services") return run(async () => send(res, 201, db.saveService(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/delivery-items") return send(res, 200, { items: db.listDeliveryItems() }), true;
  if (req.method === "POST" && url.pathname === "/api/delivery-items") return run(async () => send(res, 201, db.saveDeliveryItem(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/logs") return send(res, 200, { items: db.listLogs() }), true;
  if (req.method === "GET" && url.pathname === "/api/map-general") return send(res, 200, { items: db.mapGeneral() }), true;
  if (req.method === "POST" && url.pathname === "/api/map-general") return run(async () => send(res, 200, db.saveMapGeneral(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/map-cities") return send(res, 200, { items: db.listMapCities() }), true;
  if (req.method === "POST" && url.pathname === "/api/map-cities") return run(async () => send(res, 200, db.saveMapCity(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/route-optimizations") return send(res, 200, { items: db.listOptimizations() }), true;
  if (req.method === "POST" && url.pathname === "/api/route-optimizations") return run(async () => send(res, 201, db.optimizeRoute(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/layout") return send(res, 200, db.layoutStatus()), true;
  if (req.method === "POST" && url.pathname === "/api/layout") return run(async () => send(res, 200, db.saveLayout(await readBody(req)))), true;
  if (req.method === "POST" && url.pathname === "/api/actions/bulk-drivers") return run(async () => { const body = await readBody(req); send(res, 200, db.bulkDrivers(body.documents, body.mode)); }), true;
  if (req.method === "POST" && url.pathname === "/api/maps/test") {
    return run(async () => {
      const body = await readBody(req);
      const key = db.googleMapKey ? db.googleMapKey() : "";
      try {
        return send(res, 200, await calculateRoute(key, body.origin || "", body.destination || ""));
      } catch (error) {
        return send(res, 400, { error: error.message });
      }
    }), true;
  }
  if (req.method === "GET" && url.pathname === "/api/commissions") return send(res, 200, { items: db.listCommissions() }), true;
  if (req.method === "POST" && url.pathname === "/api/commissions") return run(async () => send(res, 201, db.saveCommission(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/ledger") return send(res, 200, { items: db.listLedger() }), true;
  if (req.method === "POST" && url.pathname === "/api/ledger") return run(async () => send(res, 201, db.postLedger(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/ledger\/([^/]+)\/void$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.voidLedger(match[1]))), true;
  if (req.method === "GET" && url.pathname === "/api/payouts") return send(res, 200, { items: db.listPayouts() }), true;
  if (req.method === "POST" && url.pathname === "/api/payouts") return run(async () => send(res, 201, db.requestPayout(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/payouts\/([^/]+)\/decision$/);
  if (match && req.method === "POST") return run(async () => send(res, 200, db.decidePayout(match[1], (await readBody(req)).status))), true;
  if (req.method === "GET" && url.pathname === "/api/cancellation-fees") return send(res, 200, { items: db.listCancellationFees() }), true;
  if (req.method === "POST" && url.pathname === "/api/cancellation-fees") return run(async () => send(res, 201, db.chargeCancellation(await readBody(req)))), true;
  if (req.method === "GET" && url.pathname === "/api/credits") return send(res, 200, { items: db.listCredits() }), true;
  if (req.method === "POST" && url.pathname === "/api/credits") return run(async () => send(res, 201, db.requestCredit(await readBody(req)))), true;
  match = url.pathname.match(/^\/api\/credits\/([^/]+)\/pay$/);
  if (match && req.method === "POST") return run(() => send(res, 200, db.payCredit(match[1]))), true;
  return false;
}

function sanitize(screen, body) {
  const next = {};
  for (const field of screen.fields) {
    const value = body[field.key];
    if (value === undefined || value === null) continue;
    if (field.type === "money" || field.type === "number") next[field.key] = Number(value) || 0;
    else next[field.key] = String(value).slice(0, 4000);
  }
  if (body.lat) next.lat = Number(body.lat);
  if (body.lng) next.lng = Number(body.lng);
  return next;
}

function matches(record, query) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return JSON.stringify(record).toLowerCase().includes(needle);
}

function franchisesFor(email) {
  const all = db.getSetting("franchises", [
    { id: "miami", name: "Miami" },
    { id: "orlando", name: "Orlando" },
  ]);
  if (!db.getSetting("franchises", null)) db.setSetting("franchises", all);
  const access = db.getSetting("userFranchises", { "admin@movy.com": ["miami", "orlando"] });
  if (!db.getSetting("userFranchises", null)) db.setSetting("userFranchises", access);
  const allowed = access[String(email).toLowerCase()] || all.map((item) => item.id);
  return all.filter((item) => allowed.includes(item.id));
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      if (req.method === "POST" && url.pathname === "/api/login") {
        const body = await readBody(req);
        const user = db.findUser(body.email || "");
        if (!checkPassword(user, body.password || "")) return send(res, 401, { error: "Invalid email or password." });
        const franchises = franchisesFor(user.email);
        if (franchises.length > 1 && !body.franchiseId) return send(res, 200, { chooseFranchise: true, franchises });
        const franchise = franchises.find((item) => item.id === body.franchiseId) || franchises[0] || null;
        if (body.franchiseId && !franchise) return send(res, 400, { error: "Choose a valid operation." });
        const token = randomBytes(24).toString("hex");
        sessions.set(token, { id: user.id, email: user.email, name: user.name, role: user.role, franchise });
        db.setSetting("lastAccess", {
          email: user.email,
          at: new Date().toISOString(),
          ip: req.socket.remoteAddress || "",
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          franchise: franchise?.name || "",
        });
        return send(res, 200, { token, user: sessions.get(token) });
      }
      if (req.method === "POST" && url.pathname === "/api/rider/register") {
        const body = await readBody(req);
        const password = String(body.password || "");
        if (password.length < 8) return send(res, 400, { error: "Use at least 8 characters." });
        const salt = randomBytes(16).toString("hex");
        const passwordHash = `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
        try {
          const rider = db.registerRider({ ...body, passwordHash });
          const token = randomBytes(24).toString("hex");
          riderSessions.set(token, rider);
          return send(res, 201, { token, rider });
        } catch (error) {
          return send(res, 400, { error: error.message });
        }
      }
      if (req.method === "POST" && url.pathname === "/api/rider/login") {
        const body = await readBody(req);
        const rider = db.findRiderLogin(body.email || "");
        const password = String(body.password || "");
        const [salt, hash] = String(rider?.password || "").split(":");
        const current = hash ? Buffer.from(hash, "hex") : Buffer.alloc(32);
        const attempt = salt ? scryptSync(password, salt, 32) : Buffer.alloc(32);
        if (!rider || current.length !== attempt.length || !timingSafeEqual(current, attempt)) return send(res, 401, { error: "Invalid email or password." });
        const token = randomBytes(24).toString("hex");
        const session = { id: rider.id, name: rider.name, email: rider.email, cityId: rider.cityId, balance: rider.balance };
        riderSessions.set(token, session);
        return send(res, 200, { token, rider: session });
      }
      if (url.pathname.startsWith("/api/rider/")) {
        const token = String(req.headers.authorization || "").replace("Bearer ", "");
        const rider = riderSessions.get(token);
        if (!rider) return send(res, 401, { error: "Sign in required." });
        if (req.method === "GET" && url.pathname === "/api/rider/me") {
          const fresh = db.findRiderLogin(rider.email);
          return send(res, 200, { rider: { id: fresh.id, name: fresh.name, email: fresh.email, cityId: fresh.cityId, balance: fresh.balance } });
        }
        if (req.method === "GET" && url.pathname === "/api/rider/tariffs") return send(res, 200, { items: db.listCityTariffs(rider.cityId).filter((item) => item.active) });
        if (req.method === "GET" && url.pathname === "/api/rider/places") return send(res, 200, { items: db.riderPlaces(rider.cityId, url.searchParams.get("q") || "") });
        if (req.method === "GET" && url.pathname === "/api/rider/coupons") return send(res, 200, { items: db.riderCoupons(rider.cityId) });
        if (req.method === "GET" && url.pathname === "/api/rider/payments") return send(res, 200, { items: db.listPaymentMethods().filter((item) => item.cityId === rider.cityId && item.active && item.code !== "invoice") });
        if (req.method === "GET" && url.pathname === "/api/rider/delivery") {
          const places = db.listEstablishments().filter((item) => item.cityId === rider.cityId && item.status === "open");
          const ids = new Set(places.map((item) => item.id));
          const items = db.listDeliveryItems().filter((item) => ids.has(item.establishmentId) && item.active);
          return send(res, 200, { places, items });
        }
        if (req.method === "GET" && url.pathname === "/api/rider/trips") return send(res, 200, { items: db.riderTrips(rider.id) });
        if (req.method === "POST" && url.pathname === "/api/rider/quote") {
          try { return send(res, 200, db.quoteRider({ ...(await readBody(req)), cityId: rider.cityId })); }
          catch (error) { return send(res, 400, { error: error.message }); }
        }
        if (req.method === "POST" && url.pathname === "/api/rider/trips") {
          try { return send(res, 201, db.requestRiderTrip({ ...(await readBody(req)), customerId: rider.id, cityId: rider.cityId })); }
          catch (error) { return send(res, 400, { error: error.message }); }
        }
        if (req.method === "POST" && url.pathname === "/api/rider/rate") {
          try { return send(res, 200, db.rateRiderTrip({ ...(await readBody(req)), customerId: rider.id })); }
          catch (error) { return send(res, 400, { error: error.message }); }
        }
        if (req.method === "POST" && url.pathname === "/api/rider/support") {
          try { return send(res, 201, db.openRiderTicket({ ...(await readBody(req)), customerId: rider.id })); }
          catch (error) { return send(res, 400, { error: error.message }); }
        }
        return send(res, 404, { error: "Not found." });
      }
      if (req.method === "POST" && url.pathname === "/api/driver/register") {
        const body = await readBody(req);
        const password = String(body.password || "");
        if (password.length < 8) return send(res, 400, { error: "Use at least 8 characters." });
        const salt = randomBytes(16).toString("hex");
        const passwordHash = `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
        try {
          const driver = db.driverPublic(db.registerDriver({ ...body, passwordHash }).email);
          const token = randomBytes(24).toString("hex");
          driverSessions.set(token, { id: driver.id, email: driver.email });
          return send(res, 201, { token, driver });
        } catch (error) {
          return send(res, 400, { error: error.message });
        }
      }
      if (req.method === "POST" && url.pathname === "/api/driver/login") {
        const body = await readBody(req);
        const driver = db.findDriverLogin(body.email || "");
        const password = String(body.password || "");
        const [salt, hash] = String(driver?.password || "").split(":");
        const current = hash ? Buffer.from(hash, "hex") : Buffer.alloc(32);
        const attempt = salt ? scryptSync(password, salt, 32) : Buffer.alloc(32);
        if (!driver || current.length !== attempt.length || !timingSafeEqual(current, attempt)) return send(res, 401, { error: "Invalid email or password." });
        const token = randomBytes(24).toString("hex");
        const session = db.driverPublic(driver.email);
        driverSessions.set(token, { id: session.id, email: session.email });
        return send(res, 200, { token, driver: session });
      }
      if (url.pathname.startsWith("/api/driver/")) {
        const token = String(req.headers.authorization || "").replace("Bearer ", "");
        const session = driverSessions.get(token);
        if (!session) return send(res, 401, { error: "Sign in required." });
        const driver = db.driverPublic(session.email);
        if (!driver) return send(res, 401, { error: "Sign in required." });
        try {
          if (req.method === "GET" && url.pathname === "/api/driver/me") return send(res, 200, { driver });
          if (req.method === "POST" && url.pathname === "/api/driver/presence") return send(res, 200, db.setDriverPresence({ ...(await readBody(req)), driverId: driver.id }));
          if (req.method === "GET" && url.pathname === "/api/driver/offers") return send(res, 200, db.driverOffers(driver.id));
          if (req.method === "POST" && url.pathname === "/api/driver/act") return send(res, 200, db.driverAct({ ...(await readBody(req)), driverId: driver.id }));
          if (req.method === "GET" && url.pathname === "/api/driver/trips") return send(res, 200, { items: db.driverTrips(driver.id) });
          if (req.method === "GET" && url.pathname === "/api/driver/earnings") return send(res, 200, db.driverEarnings(driver.id));
          if (req.method === "GET" && url.pathname === "/api/driver/documents") return send(res, 200, { items: db.driverDocuments(driver.id) });
          if (req.method === "POST" && url.pathname === "/api/driver/documents") return send(res, 201, { items: db.submitDriverFile({ ...(await readBody(req)), driverId: driver.id }) });
          if (req.method === "GET" && url.pathname === "/api/driver/zones") return send(res, 200, { items: db.driverZones(driver.cityId) });
          if (req.method === "GET" && url.pathname === "/api/driver/delivery") return send(res, 200, { items: db.driverDeliveries(driver.id) });
          if (req.method === "GET" && url.pathname === "/api/driver/schedule") return send(res, 200, { items: db.driverSchedule(driver.id) });
          if (req.method === "GET" && url.pathname === "/api/driver/ads") return send(res, 200, { items: db.driverAds(driver.cityId) });
          if (req.method === "GET" && url.pathname === "/api/driver/messages") return send(res, 200, { items: db.driverMessages() });
          if (req.method === "GET" && url.pathname === "/api/driver/reasons") return send(res, 200, { items: db.driverReasons() });
          if (req.method === "POST" && url.pathname === "/api/driver/chat") {
            const body = await readBody(req);
            const trip = db.driverTrips(driver.id).find((item) => item.id === body.tripId);
            if (!trip) return send(res, 400, { error: "Choose your trip." });
            return send(res, 201, db.sendDriverChat(body));
          }
          if (req.method === "POST" && url.pathname === "/api/driver/support") return send(res, 201, db.openDriverSupport({ ...(await readBody(req)), driverId: driver.id }));
          return send(res, 404, { error: "Not found." });
        } catch (error) {
          return send(res, 400, { error: error.message });
        }
      }
      if (req.method === "GET" && url.pathname === "/api/city-search") {
        return send(res, 200, { items: db.searchCities(url.searchParams.get("q") || "") });
      }
      if (req.method === "POST" && url.pathname === "/api/central/register") {
        const body = await readBody(req);
        const name = String(body.name || "").trim();
        const userName = String(body.userName || "").trim();
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        if (!name || !body.cityId || !userName || !email || password.length < 8) return send(res, 400, { error: "Name, city, responsible, email and a password of 8 characters are required." });
        if (db.findUser(email)) return send(res, 400, { error: "This email is already in use." });
        const central = db.saveCentral({ name, cityId: body.cityId, phone: body.phone || "", address: body.address || "", status: "active" });
        db.saveCentralUser({ centralId: central.id, name: userName, email, role: "operator" });
        db.insertUser({ id: randomBytes(16).toString("hex"), email, name: userName, password, role: "operator" });
        return send(res, 201, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/api/recovery/request") {
        const body = await readBody(req);
        const user = db.findUser(body.email || "");
        if (!user) return send(res, 404, { error: "This email is not on record." });
        const issued = db.issueRecovery(user.email);
        recoveryCodes.set(user.email, { code: issued.code, userId: user.id });
        if (issued.queued) return send(res, 200, { ok: true, queued: true });
        return send(res, 200, { ok: true, code: issued.code });
      }
      if (req.method === "POST" && url.pathname === "/api/recovery/confirm") {
        const body = await readBody(req);
        const user = db.findUser(body.email || "");
        const pending = user && recoveryCodes.get(user.email);
        if (!pending || pending.code !== String(body.code || "")) return send(res, 400, { error: "The recovery code is invalid." });
        if (!body.password || String(body.password).length < 8) return send(res, 400, { error: "Use at least 8 characters." });
        db.updatePassword(user.id, body.password);
        recoveryCodes.delete(user.email);
        return send(res, 200, { ok: true });
      }
      const auth = userFrom(req);
      if (!auth) return send(res, 401, { error: "Sign in required." });
      if (req.method === "POST" && url.pathname === "/api/logout") {
        sessions.delete(auth.token);
        return send(res, 200, { ok: true });
      }
      if (req.method === "GET" && url.pathname === "/api/bootstrap") {
        return send(res, 200, {
          user: auth,
          catalog: publicCatalog(),
          settings: {
            portugueseEnabled: db.getSetting("portugueseEnabled", false),
            currency: "USD",
            defaultLocale: "en",
            layout: db.layoutStatus(),
          },
          metrics: metrics(),
        });
      }
      if (req.method === "GET" && url.pathname === "/api/fleet") return send(res, 200, { drivers: fleet() });
      if (req.method === "GET" && url.pathname === "/api/metrics") return send(res, 200, metrics());
      if (req.method === "PATCH" && url.pathname === "/api/settings") {
        const body = await readBody(req);
        if (typeof body.portugueseEnabled === "boolean") db.setSetting("portugueseEnabled", body.portugueseEnabled);
        return send(res, 200, { portugueseEnabled: db.getSetting("portugueseEnabled", false), currency: "USD", defaultLocale: "en" });
      }
      if (req.method === "POST" && url.pathname === "/api/account/password") {
        const body = await readBody(req);
        const user = db.findUser(auth.email);
        if (!checkPassword(user, body.current || "")) return send(res, 400, { error: "Current password is wrong." });
        if (!body.next || String(body.next).length < 8) return send(res, 400, { error: "Use at least 8 characters." });
        db.updatePassword(user.id, body.next);
        return send(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/api/actions/clear-cache") {
        db.setSetting("cacheClearedAt", new Date().toISOString());
        return send(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/api/actions/reset-balances") {
        if (db.resetDriverBalances) db.resetDriverBalances();
        else db.list("drivers").forEach((driver) => db.save("drivers", { ...driver, balance: 0 }));
        return send(res, 200, { ok: true });
      }
      if (req.method === "POST" && url.pathname === "/api/actions/reset-ratings") {
        if (db.resetDriverRatings) db.resetDriverRatings();
        else db.list("drivers").forEach((driver) => db.save("drivers", { ...driver, rating: 5 }));
        return send(res, 200, { ok: true });
      }
      if (handleDomain(req, res, url)) return;
      const resourceMatch = url.pathname.match(/^\/api\/resources\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/i);
      if (resourceMatch) {
        const key = resourceMatch[1];
        const id = resourceMatch[2];
        const screen = screens.find((item) => item.key === key);
        if (!screen) return send(res, 404, { error: "Unknown resource." });
        if (req.method === "GET" && !id) {
          const q = url.searchParams.get("q") || "";
          return send(res, 200, { items: db.list(key).filter((item) => matches(item, q)) });
        }
        if (req.method === "POST" && !id) {
          const body = sanitize(screen, await readBody(req));
          const saved = db.save(key, body);
          if (key === "ledger") applyLedger(saved);
          return send(res, 201, saved);
        }
        if (req.method === "POST" && url.pathname.endsWith("/import")) {
          return send(res, 404, { error: "Not found." });
        }
        if (req.method === "PATCH" && id) {
          const current = db.list(key).find((item) => item.id === id);
          if (!current) return send(res, 404, { error: "Not found." });
          return send(res, 200, db.save(key, { ...current, ...sanitize(screen, await readBody(req)), id }));
        }
        if (req.method === "DELETE" && id) {
          db.remove(id);
          return send(res, 200, { ok: true });
        }
      }
      const importMatch = url.pathname.match(/^\/api\/import\/([a-z0-9-]+)$/i);
      if (req.method === "POST" && importMatch) {
        const target = importMatch[1] === "drivers" ? "drivers" : "riders";
        const body = await readBody(req);
        const lines = String(body.csv || "")
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);
        let count = 0;
        lines.forEach((line) => {
          const [name, phone, email] = line.split(",").map((part) => part.trim());
          if (!name) return;
          db.save(target, {
            name,
            phone: phone || "",
            email: email || "",
            city: "Miami",
            status: target === "drivers" ? "pending" : "active",
            presence: "offline",
            balance: 0,
            rating: 5,
          });
          count += 1;
        });
        return send(res, 200, { count });
      }
      if (req.method === "POST" && url.pathname === "/api/actions/bulk-drivers") {
        const body = await readBody(req);
        const documents = String(body.documents || "")
          .split(/[\s,;]+/)
          .map((item) => item.trim())
          .filter(Boolean);
        const status = body.mode === "unblock" ? "approved" : "blocked";
        let count = 0;
        db.list("drivers").forEach((driver) => {
          if (documents.includes(driver.document) || documents.includes(driver.phone) || documents.includes(driver.email)) {
            db.save("drivers", { ...driver, status, presence: status === "blocked" ? "offline" : driver.presence });
            count += 1;
          }
        });
        return send(res, 200, { count });
      }
      if (req.method === "POST" && url.pathname === "/api/reports/run") {
        const body = await readBody(req);
        const source = body.source || "trips";
        const items = db.list(source === "finance" ? "ledger" : source);
        const report = db.save("reports", {
          name: body.name || `${source} report`,
          source,
          period: body.period || "Today",
          format: body.format || "csv",
          status: "ready",
          rows: items.length,
          total: items.reduce((sum, item) => sum + moneyOf(item), 0),
        });
        return send(res, 201, report);
      }
      if (req.method === "POST" && url.pathname === "/api/maps/test") {
        const body = await readBody(req);
        const key = db.googleMapKey ? db.googleMapKey() : "";
        try {
          return send(res, 200, await calculateRoute(key, body.origin || "", body.destination || ""));
        } catch (error) {
          return send(res, 400, { error: error.message });
        }
      }
      return send(res, 404, { error: "Not found." });
    }

    if (url.pathname === "/central" || url.pathname === "/central/") {
      return send(res, 200, readFileSync(join(publicDir, "central", "index.html")), types[".html"]);
    }
    if (url.pathname === "/rider" || url.pathname === "/rider/") {
      return send(res, 200, readFileSync(join(publicDir, "rider", "index.html")), types[".html"]);
    }
    if (url.pathname === "/driver" || url.pathname === "/driver/") {
      return send(res, 200, readFileSync(join(publicDir, "driver", "index.html")), types[".html"]);
    }
    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(publicDir, requested));
    if (!filePath.startsWith(publicDir) || !existsSync(filePath) || extname(filePath) === "") {
      return send(res, 200, readFileSync(join(publicDir, "index.html")), types[".html"]);
    }
    return send(res, 200, readFileSync(filePath), types[extname(filePath)] || "application/octet-stream");
  } catch (error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    return send(res, 500, { error: "The monitor could not complete that action." });
  }
});

server.listen(port, () => {
  process.stdout.write(`Movy Monitor http://localhost:${port} (${db.engine})\n`);
});
