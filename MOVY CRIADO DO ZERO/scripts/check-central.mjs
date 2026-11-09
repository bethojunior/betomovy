const password = process.argv[2];
const page = await fetch("http://localhost:4173/central");
const html = await page.text();
const login = await fetch("http://localhost:4173/api/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ email: "admin@movy.com", password, franchiseId: "miami" })
});
const session = await login.json();
const centrals = await fetch("http://localhost:4173/api/centrals", { headers: { authorization: `Bearer ${session.token}` } });
const list = await centrals.json();
const first = (list.items || []).find((item) => item.status === "active");
const deskResponse = await fetch(`http://localhost:4173/api/central/desk?centralId=${encodeURIComponent(first.id)}`, { headers: { authorization: `Bearer ${session.token}` } });
const desk = await deskResponse.json();
console.log(JSON.stringify({
  page: page.status,
  title: html.includes("Movy Central"),
  login: login.status,
  centrals: (list.items || []).length,
  desk: deskResponse.status,
  name: desk.central?.name || desk.error,
  trips: desk.tripCount,
  drivers: desk.driverCount,
  tariffs: (desk.tariffs || []).length,
  statuses: (desk.byStatus || []).length,
  gross: desk.gross,
  net: desk.net,
  unanswered: desk.unanswered,
  active: (desk.activeTrips || []).length,
  pins: (desk.pins || []).length
}));
const fields = await fetch(`http://localhost:4173/api/central/fields?centralId=${encodeURIComponent(first.id)}`, { headers: { authorization: `Bearer ${session.token}` } });
const groups = await fetch("http://localhost:4173/api/whatsapp/groups", { headers: { authorization: `Bearer ${session.token}` } });
const trips = await fetch(`http://localhost:4173/api/central/trips?centralId=${encodeURIComponent(first.id)}`, { headers: { authorization: `Bearer ${session.token}` } });
console.log(JSON.stringify({ fields: fields.status, groups: groups.status, trips: trips.status, tripRows: ((await trips.json()).items || []).length }));
