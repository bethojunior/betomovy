const copy = {
  en: {
    enter: "Enter", create: "Create account", email: "Email", password: "Password", name: "Name", phone: "Phone",
    city: "City", vehicle: "Vehicle", plate: "Plate", terms: "I accept the terms", work: "Work", trips: "Trips",
    earnings: "Earnings", documents: "Documents", more: "More", online: "Go online", offline: "Go offline",
    pending: "Waiting for approval", accept: "Accept", arrive: "I arrived", start: "Start trip", finish: "Finish",
    decline: "Decline", cancel: "Cancel", locate: "Update my location", none: "No trip in your radius.",
    group: "An operator still has to place you in a call group.",
    balance: "Balance", gross: "Gross", commission: "Commission", net: "Net", send: "Send", subject: "Subject",
    message: "Message", support: "Support", zones: "Zones", delivery: "Delivery", schedule: "Schedule",
    ads: "Notices", signOut: "Sign out", have: "I already have an account", need: "Create an account",
    lang: "Português", empty: "Nothing here yet.", submit: "Submit document", sent: "Sent.",
  },
  pt: {
    enter: "Entrar", create: "Criar conta", email: "E-mail", password: "Senha", name: "Nome", phone: "Telefone",
    city: "Cidade", vehicle: "Veículo", plate: "Placa", terms: "Aceito os termos", work: "Trabalho", trips: "Viagens",
    earnings: "Ganhos", documents: "Documentos", more: "Mais", online: "Ficar disponível", offline: "Ficar offline",
    pending: "Aguardando aprovação", accept: "Aceitar", arrive: "Cheguei", start: "Iniciar", finish: "Finalizar",
    decline: "Recusar", cancel: "Cancelar", locate: "Atualizar minha localização", none: "Nenhuma corrida no seu raio.",
    group: "Um operador ainda precisa colocar você em um grupo de chamada.",
    balance: "Saldo", gross: "Bruto", commission: "Comissão", net: "Líquido", send: "Enviar", subject: "Assunto",
    message: "Mensagem", support: "Suporte", zones: "Zonas", delivery: "Entrega", schedule: "Agenda",
    ads: "Avisos", signOut: "Sair", have: "Já tenho conta", need: "Criar uma conta",
    lang: "English", empty: "Nada por aqui.", submit: "Enviar documento", sent: "Enviado.",
  },
};
const app = document.querySelector("#app");
const state = {
  lang: localStorage.getItem("movy-driver-lang") || "en",
  token: localStorage.getItem("movy-driver-token") || "",
  driver: null, page: "work", mode: "login", cities: [], offers: [], meta: { grouped: false, inGroup: true }, trips: [], earnings: null,
  documents: [], zones: [], delivery: [], schedule: [], ads: [], reasons: [], error: "", note: "",
};
const t = (key) => copy[state.lang][key] || key;
const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(cents || 0) / 100);
const escapeHtml = (text) => String(text || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}
function paint() {
  app.innerHTML = state.token && state.driver ? shell() : gate();
  bind();
}
function gate() {
  const register = state.mode === "register";
  return `<header class="top"><img src="/logo-movy.png" alt="Movy"><button class="lang" id="lang">${t("lang")}</button></header>
    <section class="screen"><h1>Movy</h1>
      ${register ? `<label>${t("name")}</label><input id="name"><label>${t("phone")}</label><input id="phone"><label>${t("vehicle")}</label><input id="vehicle"><label>${t("plate")}</label><input id="plate">` : ""}
      <label>${t("email")}</label><input id="email" type="email">
      <label>${t("password")}</label><input id="password" type="password">
      ${register ? `<label>${t("city")}</label><input id="city"><div class="suggest" id="cities"></div><label class="check"><input id="terms" type="checkbox">${t("terms")}</label>` : ""}
      <p class="error">${escapeHtml(state.error)}</p>
      <button class="primary" id="submit">${register ? t("create") : t("enter")}</button>
      <button class="ghost" id="switch">${register ? t("have") : t("need")}</button>
    </section>`;
}
function shell() {
  const pages = { work: work(), trips: list(state.trips, (trip) => `${escapeHtml(trip.reference)} · ${escapeHtml(trip.status)}<span class="muted">${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</span><strong>${money(trip.fare)}</strong>`), earnings: earnings(), documents: documents(), more: more() };
  return `<header class="top"><img src="/logo-movy.png" alt="Movy"><button class="lang" id="lang">${t("lang")}</button></header>
    <section class="screen">${pages[state.page]}</section>
    <nav class="nav">${["work", "trips", "earnings", "documents", "more"].map((page) => `<button data-page="${page}" class="${state.page === page ? "on" : ""}">${t(page)}</button>`).join("")}</nav>`;
}
function work() {
  const online = state.driver.presence && state.driver.presence !== "offline";
  const map = state.driver.lat ? `<iframe class="map" title="map" src="https://www.openstreetmap.org/export/embed.html?bbox=${state.driver.lng - 0.03}%2C${state.driver.lat - 0.03}%2C${state.driver.lng + 0.03}%2C${state.driver.lat + 0.03}&amp;marker=${state.driver.lat}%2C${state.driver.lng}"></iframe>` : "";
  const cards = state.offers.length ? state.offers.map((trip) => `<article class="card"><strong>${escapeHtml(trip.reference)} · ${escapeHtml(trip.status)}</strong><span class="muted">${escapeHtml(trip.origin)} → ${escapeHtml(trip.destination)}</span><strong>${money(trip.fare)}</strong><span class="muted">${trip.distanceKm} km · ${trip.durationMin} min</span><div class="actions">${actions(trip)}</div></article>`).join("") : `<p>${state.meta.grouped && !state.meta.inGroup ? t("group") : t("none")}</p>`;
  return `<h1>${state.driver.status === "approved" ? escapeHtml(state.driver.name) : t("pending")}</h1>${map}
    <button class="online ${online ? "on" : ""}" id="presence">${online ? t("offline") : t("online")}</button>
    <p class="error">${escapeHtml(state.error)}</p><p class="muted">${escapeHtml(state.note)}</p>${cards}`;
}
function actions(trip) {
  const button = (action, label) => `<button class="primary" data-act="${action}" data-trip="${trip.id}">${label}</button>`;
  if (["requested", "offered"].includes(trip.status)) return button("accept", t("accept")) + button("decline", t("decline"));
  if (trip.status === "accepted") return button("arrive", t("arrive")) + button("start", t("start")) + button("decline", t("decline"));
  if (trip.status === "arriving") return button("start", t("start"));
  if (trip.status === "in_progress") return button("finish", t("finish"));
  return "";
}
function list(items, render) {
  if (!items.length) return `<h1>${t(state.page)}</h1><p>${t("empty")}</p>`;
  return `<h1>${t(state.page)}</h1>${items.map((item) => `<article class="card">${render(item)}</article>`).join("")}`;
}
function earnings() {
  const data = state.earnings || { gross: 0, commission: 0, net: 0, balance: state.driver.balance, items: [] };
  return `<h1>${t("earnings")}</h1><article class="card"><span class="muted">${t("balance")}</span><strong>${money(data.balance)}</strong><span class="muted">${t("gross")} ${money(data.gross)} · ${t("commission")} ${money(data.commission)} · ${t("net")} ${money(data.net)}</span></article>${data.items.map((item) => `<article class="card"><strong>${escapeHtml(item.reference)}</strong><span class="muted">${escapeHtml(item.origin)} → ${escapeHtml(item.destination)}</span><strong>${money(item.net)}</strong></article>`).join("")}`;
}
function documents() {
  if (!state.documents.length) return `<h1>${t("documents")}</h1><p>${t("empty")}</p>`;
  return `<h1>${t("documents")}</h1>${state.documents.map((item) => `<article class="card"><strong>${escapeHtml(item.name)}</strong><span class="muted">${escapeHtml(item.status || "missing")}</span>${item.status === "approved" ? "" : `<button class="primary" data-doc="${item.id}">${t("submit")}</button>`}</article>`).join("")}<p class="muted">${escapeHtml(state.note)}</p>`;
}
function more() {
  const blocks = [
    [t("zones"), state.zones.map((item) => `${escapeHtml(item.name)} · ${item.radiusKm} km · x${item.multiplier}`).join("<br>")],
    [t("delivery"), state.delivery.map((item) => `${escapeHtml(item.place)} · ${money(item.total)} · ${escapeHtml(item.status)}`).join("<br>")],
    [t("schedule"), state.schedule.map((item) => `${escapeHtml(item.scheduledAt)} · ${escapeHtml(item.origin)}`).join("<br>")],
    [t("ads"), state.ads.map((item) => escapeHtml(item.title)).join("<br>")],
  ];
  return `<h1>${t("more")}</h1><article class="card"><strong>${escapeHtml(state.driver.vehicle)} · ${escapeHtml(state.driver.plate)}</strong><span class="muted">${state.driver.rating}</span></article>
    ${blocks.map(([title, body]) => `<article class="card"><strong>${title}</strong><span class="muted">${body || t("empty")}</span></article>`).join("")}
    <label>${t("subject")}</label><input id="subject"><label>${t("message")}</label><input id="message">
    <p class="error">${escapeHtml(state.error)}</p><p class="muted">${escapeHtml(state.note)}</p>
    <button class="primary" id="support">${t("send")}</button><button class="ghost" id="out">${t("signOut")}</button>`;
}
function bind() {
  const on = (id, action) => { const node = document.querySelector(`#${id}`); if (node) node.onclick = action; };
  on("lang", () => { state.lang = state.lang === "en" ? "pt" : "en"; localStorage.setItem("movy-driver-lang", state.lang); paint(); });
  on("switch", () => { state.mode = state.mode === "login" ? "register" : "login"; state.error = ""; paint(); });
  on("submit", submitAccount);
  on("presence", togglePresence);
  on("support", sendSupport);
  on("out", () => { localStorage.removeItem("movy-driver-token"); state.token = ""; state.driver = null; paint(); });
  const city = document.querySelector("#city");
  if (city) city.oninput = searchCities;
  document.querySelectorAll("[data-page]").forEach((button) => { button.onclick = () => openPage(button.dataset.page); });
  document.querySelectorAll("[data-act]").forEach((button) => { button.onclick = () => act(button.dataset.act, button.dataset.trip); });
  document.querySelectorAll("[data-doc]").forEach((button) => { button.onclick = () => submitDocument(button.dataset.doc); });
}
async function searchCities(event) {
  state.cities = event.target.value.trim().length < 2 ? [] : (await api(`/api/city-search?q=${encodeURIComponent(event.target.value)}`)).items;
  const box = document.querySelector("#cities");
  box.innerHTML = state.cities.map((city) => `<button type="button" data-city="${city.id}">${escapeHtml(city.name)}</button>`).join("");
  box.querySelectorAll("[data-city]").forEach((button) => { button.onclick = () => { state.cityId = button.dataset.city; event.target.value = button.textContent; box.innerHTML = ""; }; });
}
async function submitAccount() {
  state.error = "";
  try {
    const email = value("email");
    const password = value("password");
    const body = state.mode === "register"
      ? { name: value("name"), phone: value("phone"), email, password, cityId: state.cityId, vehicle: value("vehicle"), plate: value("plate"), acceptedTerms: document.querySelector("#terms").checked }
      : { email, password };
    const result = await api(state.mode === "register" ? "/api/driver/register" : "/api/driver/login", { method: "POST", body: JSON.stringify(body) });
    state.token = result.token;
    state.driver = result.driver;
    localStorage.setItem("movy-driver-token", state.token);
    await refresh();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}
async function refresh() {
  state.driver = (await api("/api/driver/me")).driver;
  const offers = await api("/api/driver/offers");
  state.offers = offers.items;
  state.meta = offers;
  paint();
}
async function openPage(page) {
  state.page = page;
  state.error = "";
  state.note = "";
  if (page === "trips") state.trips = (await api("/api/driver/trips")).items;
  if (page === "earnings") state.earnings = await api("/api/driver/earnings");
  if (page === "documents") state.documents = (await api("/api/driver/documents")).items;
  if (page === "more") {
    state.zones = (await api("/api/driver/zones")).items;
    state.delivery = (await api("/api/driver/delivery")).items;
    state.schedule = (await api("/api/driver/schedule")).items;
    state.ads = (await api("/api/driver/ads")).items;
  }
  if (page === "work") await refresh();
  else paint();
}
function togglePresence() {
  const online = state.driver.presence && state.driver.presence !== "offline";
  if (online) return api("/api/driver/presence", { method: "POST", body: JSON.stringify({ presence: "offline" }) }).then(refresh).catch(fail);
  navigator.geolocation.getCurrentPosition((position) => {
    api("/api/driver/presence", { method: "POST", body: JSON.stringify({ presence: "available", lat: position.coords.latitude, lng: position.coords.longitude }) }).then(refresh).catch(fail);
  }, () => fail(new Error("Location is unavailable.")));
}
async function act(action, tripId) {
  try {
    const result = await api("/api/driver/act", { method: "POST", body: JSON.stringify({ action, tripId }) });
    state.offers = result.items;
    state.meta = result;
    state.driver = (await api("/api/driver/me")).driver;
    state.error = "";
    paint();
  } catch (error) { fail(error); }
}
async function submitDocument(documentId) {
  try {
    state.documents = (await api("/api/driver/documents", { method: "POST", body: JSON.stringify({ documentId }) })).items;
    state.note = t("sent");
    paint();
  } catch (error) { fail(error); }
}
async function sendSupport() {
  try {
    await api("/api/driver/support", { method: "POST", body: JSON.stringify({ subject: value("subject"), message: value("message") }) });
    state.note = t("sent");
    state.error = "";
    paint();
  } catch (error) { fail(error); }
}
function fail(error) { state.error = error.message; paint(); }
function value(id) { return document.querySelector(`#${id}`)?.value?.trim() || ""; }
if (state.token) api("/api/driver/me").then((body) => { state.driver = body.driver; return refresh(); }).catch(() => { state.token = ""; paint(); });
else paint();
