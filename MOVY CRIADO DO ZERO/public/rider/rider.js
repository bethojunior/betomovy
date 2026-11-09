const copy = {
  en: {
    enter: "Enter", create: "Create account", email: "Email", password: "Password", name: "Name", phone: "Phone",
    city: "City", terms: "I accept the terms and the usage policy", ride: "Ride", trips: "Trips", wallet: "Wallet",
    delivery: "Delivery", help: "Help", where: "Where to?", origin: "Pickup", destination: "Destination",
    locate: "Use my location", service: "Service", pay: "Payment", coupon: "Coupon", quote: "See fare",
    request: "Request trip", fare: "Fare", straight: "Straight-line estimate", none: "Nothing open in this city.",
    subject: "Subject", message: "Message", send: "Send", balance: "Wallet balance", rate: "Rate",
    waiting: "Looking for a driver", accepted: "Driver accepted", arriving: "Driver is arriving",
    progress: "Trip in progress", done: "Trip finished", cancelled: "Trip cancelled", offered: "Offer sent",
    requested: "Requested", empty: "No trips yet.", support: "Tell us what happened", sent: "Message received.",
    signOut: "Sign out", lang: "Português", have: "I already have an account", need: "Create an account",
    places: "Saved places with coordinates", noPlace: "No saved place with coordinates matches this search.",
  },
  pt: {
    enter: "Entrar", create: "Criar conta", email: "E-mail", password: "Senha", name: "Nome", phone: "Telefone",
    city: "Cidade", terms: "Aceito os termos e a política de uso", ride: "Corrida", trips: "Viagens", wallet: "Carteira",
    delivery: "Entrega", help: "Ajuda", where: "Para onde?", origin: "Embarque", destination: "Destino",
    locate: "Usar minha localização", service: "Serviço", pay: "Pagamento", coupon: "Cupom", quote: "Ver preço",
    request: "Pedir viagem", fare: "Preço", straight: "Estimativa em linha reta", none: "Nada aberto nesta cidade.",
    subject: "Assunto", message: "Mensagem", send: "Enviar", balance: "Saldo da carteira", rate: "Avaliar",
    waiting: "Procurando motorista", accepted: "Motorista aceitou", arriving: "Motorista a caminho",
    progress: "Viagem em andamento", done: "Viagem concluída", cancelled: "Viagem cancelada", offered: "Oferta enviada",
    requested: "Solicitada", empty: "Nenhuma viagem ainda.", support: "Conte o que aconteceu", sent: "Mensagem recebida.",
    signOut: "Sair", lang: "English", have: "Já tenho conta", need: "Criar uma conta",
    places: "Lugares salvos com coordenada", noPlace: "Nenhum lugar salvo com coordenada corresponde a esta busca.",
  },
};

const statusKey = { requested: "waiting", offered: "offered", accepted: "accepted", arriving: "arriving", in_progress: "progress", completed: "done", cancelled: "cancelled" };
const app = document.querySelector("#app");
const state = {
  lang: localStorage.getItem("movy-rider-lang") || "en",
  token: localStorage.getItem("movy-rider-token") || "",
  rider: null,
  page: "ride",
  mode: "login",
  cities: [],
  tariffs: [],
  payments: [],
  places: [],
  trips: [],
  coupons: [],
  delivery: { places: [], items: [] },
  origin: null,
  destination: null,
  quote: null,
  error: "",
  note: "",
};

const t = (key) => copy[state.lang][key] || key;
const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(cents || 0) / 100);

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}

function paint() {
  const open = state.trips.find((trip) => ["requested", "offered", "accepted", "arriving", "in_progress"].includes(trip.status));
  app.innerHTML = state.token && state.rider ? shell(open) : gate();
  bind();
}

function gate() {
  const register = state.mode === "register";
  return `<header class="top"><img src="/logo-movy.png" alt="Movy"><button class="lang" id="lang">${t("lang")}</button></header>
    <section class="screen">
      <h1>Movy</h1>
      <p class="lead">${register ? t("create") : t("enter")}</p>
      ${register ? `<label>${t("name")}</label><input id="name">` : ""}
      ${register ? `<label>${t("phone")}</label><input id="phone">` : ""}
      <label>${t("email")}</label><input id="email" type="email" autocomplete="username">
      <label>${t("password")}</label><input id="password" type="password" autocomplete="${register ? "new-password" : "current-password"}">
      ${register ? `<label>${t("city")}</label><input id="city"><div class="suggest" id="cities"></div>` : ""}
      ${register ? `<label class="check"><input id="terms" type="checkbox">${t("terms")}</label>` : ""}
      <p class="error">${escape(state.error)}</p>
      <button class="primary" id="submit">${register ? t("create") : t("enter")}</button>
      <button class="ghost" id="switch">${register ? t("have") : t("need")}</button>
    </section>`;
}

function shell(open) {
  const pages = { ride: ride(open), trips: history(), wallet: wallet(), delivery: delivery(), help: help() };
  return `<header class="top"><img src="/logo-movy.png" alt="Movy"><button class="lang" id="lang">${t("lang")}</button></header>
    <section class="screen">${pages[state.page]}</section>
    <nav class="nav">
      ${["ride", "trips", "wallet", "delivery", "help"].map((page) => `<button data-page="${page}" class="${state.page === page ? "on" : ""}">${t(page)}</button>`).join("")}
    </nav>`;
}

function ride(open) {
  const map = state.origin ? `<iframe class="map" title="map" src="https://www.openstreetmap.org/export/embed.html?bbox=${state.origin.lng - 0.03}%2C${state.origin.lat - 0.03}%2C${state.origin.lng + 0.03}%2C${state.origin.lat + 0.03}&amp;marker=${state.origin.lat}%2C${state.origin.lng}"></iframe>` : "";
  return `<h1>${t("where")}</h1>${map}
    <button class="ghost" id="locate">${t("locate")}</button>
    <label>${t("origin")}</label><input id="origin" value="${escape(state.origin?.name || "")}" readonly>
    <label>${t("destination")}</label><input id="destination" value="${escape(state.destination?.name || "")}" placeholder="${t("places")}">
    <div class="suggest" id="places"></div>
    <label>${t("service")}</label><select id="service">${state.tariffs.map((item) => `<option value="${item.id}"${item.id === state.serviceId ? " selected" : ""}>${escape(item.name)}</option>`).join("")}</select>
    <div class="row"><div><label>${t("pay")}</label><select id="payment">${state.payments.map((item) => `<option value="${item.code}"${item.code === state.payment ? " selected" : ""}>${escape(item.name)}</option>`).join("")}</select></div>
    <div><label>${t("coupon")}</label><input id="coupon" value="${escape(state.coupon || "")}" placeholder="${state.coupons.map((item) => item.code).join(", ")}"></div></div>
    <p class="error">${escape(state.error)}</p>
    <p class="muted">${state.note}</p>
    <button class="primary" id="quote">${t("quote")}</button>
    ${state.quote ? `<article class="card"><span class="muted">${t("fare")} · ${t("straight")}</span><strong>${money(state.quote.fare)}</strong><span class="muted">${state.quote.distanceKm} km · ${state.quote.durationMin} min</span><button class="primary" id="request">${t("request")}</button></article>` : ""}
    ${open ? `<article class="card"><strong>${escape(open.reference)}</strong><span>${t(statusKey[open.status] || "requested")}</span><span class="muted">${escape(open.origin)} → ${escape(open.destination)}</span><strong>${money(open.fare)}</strong>${open.driver ? `<span class="muted">${escape(open.driver)}</span>` : ""}</article>` : ""}`;
}

function history() {
  if (!state.trips.length) return `<h1>${t("trips")}</h1><p class="lead">${t("empty")}</p>`;
  return `<h1>${t("trips")}</h1>${state.trips.map((trip) => `<article class="card"><strong>${escape(trip.reference)} · ${t(statusKey[trip.status] || "requested")}</strong><span class="muted">${escape(trip.origin)} → ${escape(trip.destination)}</span><strong>${money(trip.fare)}</strong>${trip.status === "completed" && !trip.stars ? `<div class="stars">${[1, 2, 3, 4, 5].map((star) => `<button data-rate="${trip.id}" data-stars="${star}">${star}</button>`).join("")}</div>` : ""}${trip.stars ? `<span class="muted">${trip.stars}/5</span>` : ""}</article>`).join("")}<p class="error">${escape(state.error)}</p>`;
}

function wallet() {
  return `<h1>${t("wallet")}</h1><article class="card"><span class="muted">${t("balance")}</span><strong>${money(state.rider.balance)}</strong></article>
    ${state.coupons.map((item) => `<article class="card"><strong>${escape(item.code)}</strong><span class="muted">${item.kind === "percent" ? `${item.percent}%` : money(item.fixed)} · ${escape(item.validUntil || "")}</span></article>`).join("")}
    <button class="ghost" id="out">${t("signOut")}</button>`;
}

function delivery() {
  if (!state.delivery.places.length) return `<h1>${t("delivery")}</h1><p class="lead">${t("none")}</p>`;
  return `<h1>${t("delivery")}</h1>${state.delivery.places.map((place) => `<article class="card"><strong>${escape(place.name)}</strong><span class="muted">${escape(place.address || "")}</span>${state.delivery.items.filter((item) => item.establishmentId === place.id).map((item) => `<span>${escape(item.name)} · ${money(item.price)}</span>`).join("")}</article>`).join("")}`;
}

function help() {
  return `<h1>${t("help")}</h1><p class="lead">${t("support")}</p>
    <label>${t("subject")}</label><input id="subject"><label>${t("message")}</label><input id="message">
    <p class="error">${escape(state.error)}</p><p class="muted">${state.note}</p><button class="primary" id="support">${t("send")}</button>`;
}

function bind() {
  const on = (id, action) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.onclick = action;
  };
  on("lang", () => {
    state.lang = state.lang === "en" ? "pt" : "en";
    localStorage.setItem("movy-rider-lang", state.lang);
    paint();
  });
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.onclick = async () => {
      state.page = button.dataset.page;
      state.error = "";
      state.note = "";
      if (state.page === "trips") state.trips = (await api("/api/rider/trips")).items;
      if (state.page === "delivery") state.delivery = await api("/api/rider/delivery");
      if (state.page === "wallet") state.rider = (await api("/api/rider/me")).rider;
      paint();
    };
  });
  on("switch", () => { state.mode = state.mode === "login" ? "register" : "login"; state.error = ""; paint(); });
  const city = document.querySelector("#city");
  if (city) city.oninput = async (event) => {
    state.cities = event.target.value.trim().length < 2 ? [] : (await api(`/api/city-search?q=${encodeURIComponent(event.target.value)}`)).items;
    const box = document.querySelector("#cities");
    box.innerHTML = state.cities.map((item) => `<button type="button" data-city="${item.id}">${escape(item.name)}${item.state ? ` · ${escape(item.state)}` : ""}</button>`).join("");
    box.querySelectorAll("[data-city]").forEach((button) => {
      button.onclick = () => {
        state.cityId = button.dataset.city;
        document.querySelector("#city").value = button.textContent;
        box.innerHTML = "";
      };
    });
  };
  on("submit", submitAccount);
  on("locate", locate);
  on("quote", quote);
  on("request", requestTrip);
  on("support", sendSupport);
  on("out", () => { localStorage.removeItem("movy-rider-token"); state.token = ""; state.rider = null; paint(); });
  const destination = document.querySelector("#destination");
  if (destination) destination.oninput = searchPlaces;
  document.querySelectorAll("[data-rate]").forEach((button) => {
    button.onclick = () => rate(button.dataset.rate, button.dataset.stars);
  });
}

async function submitAccount() {
  state.error = "";
  try {
    const email = value("email");
    const password = value("password");
    const body = state.mode === "register"
      ? { name: value("name"), phone: value("phone"), email, password, cityId: state.cityId, acceptedTerms: document.querySelector("#terms").checked }
      : { email, password };
    const result = await api(state.mode === "register" ? "/api/rider/register" : "/api/rider/login", { method: "POST", body: JSON.stringify(body) });
    state.token = result.token;
    state.rider = result.rider;
    localStorage.setItem("movy-rider-token", state.token);
    await loadHome();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}

async function loadHome() {
  const [tariffs, payments, coupons, trips] = await Promise.all([
    api("/api/rider/tariffs"), api("/api/rider/payments"), api("/api/rider/coupons"), api("/api/rider/trips"),
  ]);
  state.tariffs = tariffs.items;
  state.payments = payments.items;
  state.coupons = coupons.items;
  state.trips = trips.items;
  state.page = "ride";
  paint();
}

function locate() {
  navigator.geolocation.getCurrentPosition((position) => {
    state.origin = { name: "GPS", lat: position.coords.latitude, lng: position.coords.longitude };
    state.quote = null;
    paint();
  }, () => { state.error = "Location is unavailable."; paint(); });
}

async function searchPlaces(event) {
  const q = event.target.value.trim();
  state.places = q.length < 2 ? [] : (await api(`/api/rider/places?q=${encodeURIComponent(q)}`)).items;
  const box = document.querySelector("#places");
  box.innerHTML = state.places.length ? state.places.map((place, index) => `<button type="button" data-place="${index}">${escape(place.name)}</button>`).join("") : (q.length < 2 ? "" : `<span class="muted">${t("noPlace")}</span>`);
  box.querySelectorAll("[data-place]").forEach((button) => {
    button.onclick = () => {
      const place = state.places[Number(button.dataset.place)];
      state.destination = { name: place.name, lat: Number(place.lat), lng: Number(place.lng) };
      state.quote = null;
      event.target.value = place.name;
      box.innerHTML = "";
    };
  });
}

async function quote() {
  rememberRide();
  state.error = "";
  state.note = "";
  try {
    state.quote = await api("/api/rider/quote", { method: "POST", body: JSON.stringify(points()) });
    paint();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}

async function requestTrip() {
  rememberRide();
  state.error = "";
  try {
    await api("/api/rider/trips", { method: "POST", body: JSON.stringify(points()) });
    state.quote = null;
    state.trips = (await api("/api/rider/trips")).items;
    paint();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}

function rememberRide() {
  const service = value("service");
  const payment = value("payment");
  if (service) state.serviceId = service;
  if (payment) state.payment = payment;
  if (document.querySelector("#coupon")) state.coupon = value("coupon");
}

function points() {
  return {
    origin: state.origin?.name || "",
    destination: state.destination?.name || "",
    originLat: state.origin?.lat,
    originLng: state.origin?.lng,
    destinationLat: state.destination?.lat,
    destinationLng: state.destination?.lng,
    tripTypeId: value("service"),
    payment: value("payment") || "cash",
    coupon: value("coupon"),
  };
}

async function sendSupport() {
  state.error = "";
  state.note = "";
  try {
    await api("/api/rider/support", { method: "POST", body: JSON.stringify({ subject: value("subject"), message: value("message") }) });
    state.note = t("sent");
    paint();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}

async function rate(tripId, stars) {
  try {
    await api("/api/rider/rate", { method: "POST", body: JSON.stringify({ tripId, stars: Number(stars) }) });
    state.trips = (await api("/api/rider/trips")).items;
    state.error = "";
    paint();
  } catch (error) {
    state.error = error.message;
    paint();
  }
}

function value(id) { return document.querySelector(`#${id}`)?.value?.trim() || ""; }
function escape(text) { return String(text || "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char])); }

setInterval(async () => {
  if (!state.token || state.page !== "ride") return;
  const open = state.trips.some((trip) => ["requested", "offered", "accepted", "arriving", "in_progress"].includes(trip.status));
  if (!open) return;
  try {
    state.trips = (await api("/api/rider/trips")).items;
    paint();
  } catch { /* keep the last trip on screen */ }
}, 4000);

if (state.token) api("/api/rider/me").then((body) => { state.rider = body.rider; return loadHome(); }).catch(() => { state.token = ""; paint(); });
else paint();
