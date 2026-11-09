const tokenKey = "movy-central-token";
const state = {
  token: sessionStorage.getItem(tokenKey) || "",
  user: null,
  portuguese: false,
  centrals: [],
  centralId: "",
  desk: null,
  page: "home",
  error: "",
  franchises: [],
  extra: {},
  audioEnabled: localStorage.getItem("movy-central-audio") !== "false",
  lastTripCount: 0,
};

const copy = {
  en: {
    title: "Movy Central", sign: "Sign in", email: "Email", password: "Password", operation: "Operation",
    access: "Sign in to your central", lede: "Enter the corporate manager credentials", enter: "Enter the panel", register: "No business account? Register your central", secure: "Secure connection · Access and IP audit", rights: "MOVY Global Technologies · All rights reserved",
    accept: "Accept", board: "Start trip", finish: "Finish", vehicle: "Vehicle", plate: "Plate", code: "Code", sender: "Sender", template: "Template", minutes: "Minutes before", detail: "Trip", cancel: "Cancel trip", stop: "Add stop", schedule: "Schedule", favorite: "Favorite drivers", restrict: "Restrict to selected drivers", delivery: "Delivery", forMe: "For me", forOther: "For someone else", individual: "Individual", company: "Company", international: "International", gross: "Gross", net: "Net", unanswered: "Unanswered", note: "Pickup note", drop: "Drop-off note", activate: "Turn neighborhood rides on", city: "City", responsible: "Responsible", address: "Address",
    setup: "Central setup", off: "Turn off", operators: "Operators", role: "Role", tax: "Tax", seats: "Seats", document: "Document", finishOnly: "Only the central finishes the trip", home: "Home", trips: "Trips", districts: "Neighborhoods", hops: "Neighborhood to neighborhood", riders: "Riders", signup: "New rider", vouchers: "Vouchers", drivers: "Drivers", driverNew: "New driver", tariffs: "Tariffs", radius: "Service radius", keys: "Integration keys", fields: "Dynamic fields", language: "Languages", cache: "Clear cache", whatsapp: "WhatsApp", groups: "Groups", out: "Sign out",
    origin: "Origin", destination: "Destination", km: "Kilometers", minutes: "Minutes", payment: "Payment", type: "Tariff", send: "Open trip", empty: "Nothing in this list.", balance: "Balance", name: "Name", phone: "Phone", birth: "Birth date", save: "Save", status: "Status", search: "Search", rider: "Rider", driver: "Driver", neighborhood: "Neighborhood", value: "Amount", round: "Return trip", nominal: "Nominal radius", extended: "Extended radius", titleField: "Question", required: "Required", optional: "Optional", message: "Message to the group", driverMessage: "Message to the driver",
    calcRoute: "Calculate Route & Fare", liveSync: "Live Sync Active", soundOn: "Sound On", soundOff: "Sound Muted", waTrack: "WhatsApp Rider"
  },
  pt: {
    title: "Movy Central", sign: "Entrar", email: "E-mail", password: "Senha", operation: "Operação",
    access: "Acesse sua central", lede: "Insira suas credenciais de gestor corporativo", enter: "Entrar no painel", register: "Não possui conta empresarial? Cadastre sua central", secure: "Conexão segura · Auditoria de acesso e IP", rights: "MOVY Global Technologies · Todos os direitos reservados",
    accept: "Aceitar", board: "Iniciar", finish: "Finalizar", vehicle: "Veículo", plate: "Placa", code: "Código", sender: "Remetente", template: "Mensagem", minutes: "Minutos antes", detail: "Viagem", cancel: "Cancelar viagem", stop: "Adicionar parada", schedule: "Agendar", favorite: "Motoristas favoritos", restrict: "Restringir a motoristas específicos", delivery: "Entrega", forMe: "Para mim", forOther: "Para outra pessoa", individual: "Pessoa física", company: "Pessoa jurídica", international: "Cadastro internacional", gross: "Total", net: "Líquido", unanswered: "Não atendidas", note: "Observações na coleta", drop: "Observações na entrega", activate: "Ativar bairro para bairro", city: "Cidade", responsible: "Responsável", address: "Endereço",
    setup: "Ajustes da central", off: "Desligar", operators: "Operadores", role: "Função", tax: "Taxa", seats: "Lugares", document: "Documento", finishOnly: "Só a central finaliza a viagem", home: "Início", trips: "Viagens", districts: "Bairros", hops: "Bairro para bairro", riders: "Clientes", signup: "Cadastro", vouchers: "Voucher", drivers: "Motoristas", driverNew: "Novo motorista", tariffs: "Tarifas", radius: "Raio de atendimento", keys: "Chaves de integração", fields: "Campos dinâmicos", language: "Idiomas da plataforma", cache: "Limpar cache", whatsapp: "WhatsApp", groups: "Grupos", out: "Sair",
    origin: "Origem", destination: "Destino", km: "Quilômetros", minutes: "Minutos", payment: "Pagamento", type: "Tarifa", send: "Abrir viagem", empty: "Nada nesta lista.", balance: "Saldo", name: "Nome", phone: "Telefone", birth: "Data de nascimento", save: "Salvar", status: "Status", search: "Buscar", rider: "Cliente", driver: "Motorista", neighborhood: "Bairro", value: "Valor", round: "Volta", nominal: "Raio nominal", extended: "Raio bloco", titleField: "Pergunta", required: "Obrigatória", optional: "Opcional", message: "Mensagem para o grupo", driverMessage: "Mensagem para o motorista",
    calcRoute: "Calcular Rota & Tarifa", liveSync: "Ao Vivo Ativo", soundOn: "Som Ativo", soundOff: "Som Mudo", waTrack: "WhatsApp Passageiro"
  }
};

const pages = ["home", "trips", "districts", "hops", "riders", "signup", "vouchers", "drivers", "driverNew", "tariffs", "radius", "keys", "fields", "setup", "language", "cache", "whatsapp", "groups"];
const t = (key) => (state.portuguese ? copy.pt : copy.en)[key] || key;
const money = (cents) => `US$ ${(Number(cents || 0) / 100).toFixed(2)}`;
const app = document.querySelector("#app");
const cityId = () => state.desk?.central.cityId || "";

let centralMapInstance = null;
let centralLiveSyncTimer = null;

function playDispatchBeep() {
  if (!state.audioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (_) {}
}

async function api(path, options = {}) {
  const headers = { ...(options.body ? { "content-type": "application/json" } : {}), ...(state.token ? { authorization: `Bearer ${state.token}` } : {}) };
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed.");
  return body;
}

function field(label, html) { return `<label>${label}</label>${html}`; }
function options(rows, label) { return rows.map((item) => `<option value="${item.id}">${label(item)}</option>`).join(""); }
function table(headers, rows) {
  if (!rows.length) return `<p class="muted">${t("empty")}</p>`;
  return `<table><thead><tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
}
function tariffs() { return state.desk?.tariffs || []; }

function renderLogin() {
  if (state.extra.mode === "register") {
    app.innerHTML = `<main class="login"><form class="card" id="register">
      <img class="login-logo" src="/logo-movy.png" alt="Movy" />
      <h1>${t("register")}</h1>
      ${field(t("name"), `<input id="name" required>`)}
      ${field(t("city"), `<input id="city" required>`)}<div id="cities" class="sugg-box"></div>
      ${field(t("address"), `<input id="address">`)}
      ${field(t("phone"), `<input id="phone">`)}
      ${field(t("responsible"), `<input id="user" required>`)}
      ${field(t("email"), `<input id="email" type="email" required>`)}
      ${field(t("password"), `<input id="password" type="password" required>`)}
      <p class="error">${state.error}</p>
      <button class="primary">${t("save")}</button>
      <button class="register" type="button" id="back">${t("sign")}</button>
    </form></main>`;
    const form = app.querySelector("#register");
    form.querySelector("#city").oninput = async () => {
      const q = form.querySelector("#city").value.trim();
      if (q.length < 2) return;
      const result = await api(`/api/city-search?q=${encodeURIComponent(q)}`);
      form.querySelector("#cities").innerHTML = (result.items || []).map((item) => `<button class="sugg-btn" type="button" data-city="${item.id}">${item.name}${item.state ? `, ${item.state}` : ""}</button>`).join("");
      form.querySelectorAll("[data-city]").forEach((button) => {
        button.onclick = () => {
          state.extra.cityId = button.dataset.city;
          form.querySelector("#city").value = button.textContent;
          form.querySelector("#cities").innerHTML = "";
        };
      });
    };
    form.querySelector("#back").onclick = () => { state.extra.mode = ""; renderLogin(); };
    form.onsubmit = async (event) => {
      event.preventDefault();
      state.error = "";
      try {
        await api("/api/central/register", { method: "POST", body: JSON.stringify({ name: form.querySelector("#name").value, cityId: state.extra.cityId, address: form.querySelector("#address").value, phone: form.querySelector("#phone").value, userName: form.querySelector("#user").value, email: form.querySelector("#email").value, password: form.querySelector("#password").value }) });
        state.extra.mode = "";
        state.error = "";
        renderLogin();
      } catch (error) { state.error = error.message; renderLogin(); }
    };
    return;
  }
  const franchise = state.franchises.length ? field(t("operation"), `<select id="franchise">${state.franchises.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")}</select>`) : "";
  const place = state.extra.place ? `<div class="muted">${state.extra.place}</div>` : "";
  app.innerHTML = `<main class="login"><form class="card" id="login">
    <img class="login-logo" src="/logo-movy.png" alt="Movy" />
    <h1>${t("access")}</h1>
    <p class="lede">${t("lede")}</p>
    ${field(t("email"), `<input id="email" type="email" placeholder="name@company.com" autocomplete="username" required>`)}
    ${field(t("password"), `<input id="password" type="password" placeholder="••••••••" autocomplete="current-password" required>`)}
    ${franchise}<p class="error">${state.error}</p><button class="primary">${t("enter")}</button>
    <button class="register" type="button" id="open-register">${t("register")}</button>
    <div class="security"><span>${t("secure")}</span>${place}<small class="rights">© ${new Date().getFullYear()} ${t("rights")}</small></div>
  </form></main>`;
  if (!state.extra.asked) {
    state.extra.asked = true;
    navigator.geolocation?.getCurrentPosition((position) => {
      state.extra.place = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
      if (!state.token) renderLogin();
    });
  }
  app.querySelector("#open-register").onclick = () => { state.extra.mode = "register"; state.error = ""; renderLogin(); };
  app.querySelector("#login").onsubmit = async (event) => {
    event.preventDefault();
    state.error = "";
    try {
      const body = { email: app.querySelector("#email").value, password: app.querySelector("#password").value };
      const franchiseId = app.querySelector("#franchise")?.value;
      if (franchiseId) body.franchiseId = franchiseId;
      const result = await api("/api/login", { method: "POST", body: JSON.stringify(body) });
      if (result.chooseFranchise) { state.franchises = result.franchises; renderLogin(); return; }
      state.token = result.token;
      sessionStorage.setItem(tokenKey, state.token);
      state.user = result.user;
      await boot();
    } catch (error) { state.error = error.message; renderLogin(); }
  };
}

function pageBody() {
  const desk = state.desk;
  if (!desk) return `<p class="muted">${t("empty")}</p>`;
  if (state.page === "home") {
    const counts = (desk.byStatus || []).map((item) => `<div class="stat"><span>${item.status}</span><b>${item.total}</b></div>`).join("");
    const pay = (desk.byPayment || []).map((item) => `<div class="stat"><span>${item.payment}</span><b>${item.total}</b></div>`).join("");
    const hours = ["06:00", "07:00", "08:00", "12:00", "17:00", "18:00", "20:00", "22:00"].map((hour) => `<button type="button" class="hour ${state.extra.hour === hour ? "on" : ""}" data-hour="${hour}">${hour}</button>`).join("");
    
    return `
      <div class="stats">
        ${counts}${pay}
        <div class="stat"><span>${t("unanswered")}</span><b>${desk.unanswered || 0}</b></div>
        <div class="stat"><span>${t("gross")}</span><b>${money(desk.gross)}</b></div>
        <div class="stat"><span>${t("net")}</span><b>${money(desk.net)}</b></div>
        <div class="stat"><span>${t("balance")}</span><b>${money(desk.central.balance)}</b></div>
      </div>
      <div class="desk">
        <div id="central-map"></div>
        <form id="call" class="card">
          <h3 style="margin-top:0;">⚡ Despacho Rápido de Chamado</h3>
          ${field(t("search"), `<input id="find" placeholder="${t("rider")} (Name / Phone)" autocomplete="off">`)}
          <div id="found"></div>
          <div class="row">
            ${field(t("forMe"), `<select id="who"><option value="self">${t("forMe")}</option><option value="other">${t("forOther")}</option></select>`)}
            ${field(t("individual"), `<select id="kind"><option value="individual">${t("individual")}</option><option value="company">${t("company")}</option><option value="international">${t("international")}</option></select>`)}
          </div>
          ${field(t("type"), `<select id="type">${options(tariffs(), (item) => item.name)}</select>`)}
          ${field(t("neighborhood"), `<select id="hood"><option value=""></option>${options(desk.neighborhoods || [], (item) => `${item.name} ${money(item.flatFare)}`)}</select>`)}
          ${field(t("origin"), `<input id="origin" required placeholder="Pickup address">`)}
          <div id="origin-list" class="sugg-box"></div>
          ${field(t("destination"), `<input id="destination" required placeholder="Dropoff address">`)}
          <div id="destination-list" class="sugg-box"></div>
          <button type="button" id="calc-route" class="route-calc-btn">⚡ ${t("calcRoute")}</button>
          <div style="display:flex;gap:8px;margin:8px 0;">
            <button type="button" id="swap" class="ghost-btn" style="flex:1;">${t("origin")} ↔ ${t("destination")}</button>
            <button type="button" id="add-stop" class="ghost-btn">${t("stop")}</button>
          </div>
          ${field(t("stop"), `<input id="stop" placeholder="Add intermediate stop">`)}
          <ul>${(state.extra.stops || []).map((item) => `<li>${item}</li>`).join("")}</ul>
          <div class="row">
            ${field(t("km"), `<input id="km" type="number" min="0.1" step="0.1" required>`)}
            ${field(t("minutes"), `<input id="minutes" type="number" min="1" step="1" required>`)}
          </div>
          ${field(t("payment"), `<select id="payment"><option value="cash">Cash</option><option value="card">Card</option><option value="wallet">Wallet</option><option value="invoice">Invoice</option></select>`)}
          ${field(t("driver"), `<select id="driver"><option value=""></option>${options(desk.drivers || [], (item) => item.name)}</select>`)}
          <div style="margin:8px 0;">
            <label><input id="restrict" type="checkbox"> ${t("restrict")}</label>
            <label><input id="favoriteOnly" type="checkbox"> ${t("favorite")}</label>
            <label><input id="round" type="checkbox"> ${t("round")} ${desk.settings ? money(desk.settings.returnFee) : ""}</label>
          </div>
          <p style="margin:6px 0 2px;font-weight:600;font-size:13px;">${t("schedule")}</p>
          <div class="hours">${hours}</div>
          ${field(t("schedule"), `<input id="day" type="date">`)}
          ${field(t("delivery"), `<input id="delivery" placeholder="Delivery packages / instructions">`)}
          ${field(t("note"), `<input id="pickup" placeholder="Notes for pickup">`)}
          ${field(t("drop"), `<input id="drop" placeholder="Notes for drop-off">`)}
          <p class="error">${state.error}</p>
          <button class="primary">${t("send")}</button>
        </form>
      </div>
      <div style="margin-top:24px;">
        <h3>${t("trips")} Ativas da Central</h3>
        ${table(
          [t("trips"), t("status"), t("balance"), "Ações"],
          (desk.activeTrips || []).map((trip) => `
            <tr>
              <td><strong>${trip.reference}</strong><br><span class="muted">${trip.origin} → ${trip.destination}</span></td>
              <td><span class="pill ${trip.status}">${trip.status}</span></td>
              <td><strong>${money(trip.fare)}</strong></td>
              <td style="display:flex;gap:6px;align-items:center;">
                <a class="wa-btn" target="_blank" href="https://wa.me/?text=${encodeURIComponent(`MOVY: Viagem ${trip.reference}. Origem: ${trip.origin} Destino: ${trip.destination}. Acompanhe: https://movymonitor.com/track/${trip.reference}`)}">${t("waTrack")}</a>
                <button type="button" class="ghost-btn" data-cancel="${trip.id}">${t("cancel")}</button>
              </td>
            </tr>
          `)
        )}
      </div>
      <form id="wa-box" class="card" style="margin-top:20px;">
        <h3>Mensagens Internas da Central</h3>
        ${(desk.messages || []).map((item) => `<p style="margin:4px 0;font-size:13px;"><strong>•</strong> ${item.body}</p>`).join("")}
        ${field(t("message"), `<input id="message" placeholder="Aviso rápido para os motoristas da central">`)}
        <button class="primary">${t("send")}</button>
      </form>
    `;
  }
  if (state.page === "trips") {
    const rows = state.extra.trips || desk.trips || [];
    return `<form id="filter" class="card"><div class="row">${field(t("status"), `<select id="status"><option value=""></option>${(desk.byStatus || []).map((item) => `<option>${item.status}</option>`).join("")}</select>`)}${field(t("search"), `<input id="q" placeholder="Reference, driver or rider">`)}</div><div class="row">${field(t("schedule"), `<input id="from" type="date">`)}${field(t("schedule"), `<input id="to" type="date">`)}</div><button class="primary">${t("search")}</button></form>
      ${state.extra.detail ? `<section class="card" style="margin-top:16px;border-left:4px solid var(--accent);"><h3>${state.extra.detail.reference}</h3><p><strong>${state.extra.detail.origin} → ${state.extra.detail.destination}</strong></p><p>${state.extra.detail.status} · ${money(state.extra.detail.fare)} · ${state.extra.detail.payment}</p><p>Rider: ${state.extra.detail.rider || "N/A"} · Driver: ${state.extra.detail.driver || "Unassigned"}</p>${field(t("driver"), `<select id="detail-driver"><option value=""></option>${options(desk.drivers || [], (item) => item.name)}</select>`)}<div style="display:flex;gap:6px;margin-top:10px;">${[["accepted", t("accept")], ["in_progress", t("board")], ["completed", t("finish")], ["cancelled", t("cancel")]].map(([status, label]) => `<button type="button" class="ghost-btn" data-status="${status}">${label}</button>`).join("")}</div></section>` : ""}
      <div style="margin-top:16px;">${table([t("trips"), t("rider"), t("driver"), t("status"), t("balance")], rows.map((trip) => `<tr><td><button type="button" class="ghost-btn" data-open="${trip.id}">${trip.reference}</button><br><span class="muted">${trip.origin} → ${trip.destination}</span></td><td>${trip.rider || ""}</td><td>${trip.driver || ""}</td><td><span class="pill ${trip.status}">${trip.status}</span></td><td>${money(trip.fare)}</td></tr>`))}</div>`;
  }
  if (state.page === "districts") {
    const editing = state.extra.hood || {};
    return `<form id="hood" class="card">${field(t("name"), `<input id="name" value="${editing.name || ""}" required>`)}${field(t("type"), `<select id="type"><option value=""></option>${options(tariffs(), (item) => item.name)}</select>`)}${field(t("value"), `<input id="fare" type="number" min="0.01" step="0.01" value="${editing.flatFare ? (editing.flatFare / 100).toFixed(2) : ""}" required>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("neighborhood"), t("type"), t("value"), ""], (desk.neighborhoods || []).map((item) => `<tr><td><button type="button" class="ghost-btn" data-hood="${item.id}">${item.name}</button></td><td>${item.tripType || ""}</td><td>${money(item.flatFare)}</td><td><button type="button" class="ghost-btn" data-off="${item.id}">${t("off")}</button></td></tr>`))}`;
  }
  if (state.page === "hops") {
    return `<form id="rides" class="card"><button class="primary">${desk.neighborhoodRides ? t("activate") : t("activate")}</button></form>
      <form id="hop" class="card"><div class="row">${field(t("origin"), `<input id="origin" required>`)}${field(t("destination"), `<input id="destination" required>`)}</div>${field(t("type"), `<select id="type"><option value=""></option>${options(tariffs(), (item) => item.name)}</select>`)}${field(t("value"), `<input id="price" type="number" min="0.01" step="0.01" required>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("origin"), t("destination"), t("type"), t("value"), t("status")], (state.extra.routes || []).map((item) => `<tr><td>${item.origin}</td><td>${item.destination}</td><td>${item.tripType || ""}</td><td>${money(item.pricePerPerson)}</td><td><button type="button" class="ghost-btn" data-route="${item.id}" data-on="${item.active ? 0 : 1}">${item.active ? "on" : "off"}</button></td></tr>`))}`;
  }
  if (state.page === "riders") {
    return `<form id="people" class="card">${field(t("search"), `<input id="q" placeholder="Name, phone or document">`)}<button class="primary">${t("search")}</button></form>
      ${table([t("name"), t("phone"), t("document"), t("balance")], (state.extra.people || desk.riders || []).map((item) => `<tr><td><button type="button" class="ghost-btn" data-customer="${item.id}">${item.name}</button></td><td>${item.phone || ""}</td><td>${item.document || ""}</td><td>${money(item.balance)}</td></tr>`))}`;
  }
  if (state.page === "signup") {
    const person = state.extra.customer || {};
    return `<form id="rider" class="card">${field(t("individual"), `<select id="kind"><option value="individual">${t("individual")}</option><option value="company">${t("company")}</option><option value="international">${t("international")}</option></select>`)}${field(t("name"), `<input id="name" value="${person.name || ""}" required>`)}${field(t("phone"), `<input id="phone" value="${person.phone || ""}" required>`)}${field(t("email"), `<input id="email" type="email" value="${person.email || ""}" required>`)}${field(t("birth"), `<input id="birth" type="date" value="${person.birthDate || ""}">`)}${field(t("document"), `<input id="document" value="${person.document || ""}">`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>`;
  }
  if (state.page === "vouchers") return `<p><strong>${t("balance")}:</strong> ${money(desk.central.balance)}</p><form id="voucher" class="card">${field(t("company"), `<select id="company">${options(state.extra.companies || [], (item) => item.name)}</select>`)}${field(t("code"), `<input id="code" required>`)}${field(t("value"), `<input id="amount" type="number" min="0.01" step="0.01" required>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>${table([t("code"), t("balance")], (state.extra.vouchers || []).map((item) => `<tr><td>${item.code}</td><td>${money(item.balance)}</td></tr>`))}`;
  if (state.page === "drivers") return `<form id="fleet" class="card">${field(t("search"), `<input id="q" placeholder="Search driver">`)}<button class="primary">${t("search")}</button></form>${table([t("name"), t("email"), t("phone"), t("vehicle"), t("plate"), t("status")], (state.extra.fleet || desk.drivers || []).map((item) => `<tr><td>${item.name}</td><td>${item.email || ""}</td><td>${item.phone || ""}</td><td>${item.vehicle || ""}</td><td>${item.plate || ""}</td><td><span class="pill ${item.presence || "offline"}">${item.presence || item.status || ""}</span></td></tr>`))}`;
  if (state.page === "driverNew") return `<form id="driver" class="card">${field(t("name"), `<input id="name" required>`)}${field(t("phone"), `<input id="phone" required>`)}${field(t("email"), `<input id="email" type="email" required>`)}${field(t("vehicle"), `<input id="vehicle">`)}${field(t("plate"), `<input id="plate">`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>`;
  if (state.page === "tariffs") {
    const editing = state.extra.tariff || {};
    const rows = state.extra.cityTariffs || tariffs();
    const dollars = (cents) => cents ? (Number(cents) / 100).toFixed(2) : "";
    return `<form id="tariff" class="card">${field(t("name"), `<input id="name" value="${editing.name || ""}" required>`)}<div class="row">${field("Base", `<input id="base" type="number" min="0" step="0.01" value="${dollars(editing.base)}" required>`)}${field("Km", `<input id="km" type="number" min="0" step="0.01" value="${dollars(editing.perKm)}" required>`)}</div><div class="row">${field("Min", `<input id="min" type="number" min="0" step="0.01" value="${dollars(editing.perMin)}" required>`)}${field("Minimum", `<input id="minimum" type="number" min="0" step="0.01" value="${dollars(editing.minimum)}" required>`)}</div><div class="row">${field(t("tax"), `<input id="tax" type="number" min="0" step="0.01" value="${dollars(editing.tax)}">`)}${field(t("seats"), `<input id="seats" type="number" min="1" step="1" value="${editing.seats || 4}">`)}</div><p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>${table([t("name"), "Base", "Km", "Min", "Minimum"], rows.map((item) => `<tr><td><button type="button" class="ghost-btn" data-tariff="${item.id}">${item.name}</button></td><td>${money(item.base)}</td><td>${money(item.perKm)}</td><td>${money(item.perMin)}</td><td>${money(item.minimum)}</td></tr>`))}`;
  }
  if (state.page === "radius") {
    const row = state.extra.radius || {};
    return `<form id="radius" class="card">${field(t("nominal"), `<input id="km" type="number" min="1" step="1" value="${row.radiusKm || ""}" required>`)}${field(t("extended"), `<input id="greater" type="number" min="1" step="1" value="${row.greaterKm || ""}">`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>`;
  }
  if (state.page === "keys") {
    return `<form id="key" class="card">${field(t("name"), `<input id="name" required>`)}${field("https", `<input id="url" required>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("name"), "URL"], (state.extra.services || []).map((item) => `<tr><td>${item.name}</td><td>${item.baseUrl}</td></tr>`))}`;
  }
  if (state.page === "fields") {
    return `<form id="field" class="card">${field(t("titleField"), `<input id="title" required>`)}${field(t("status"), `<select id="required"><option value="no">${t("optional")}</option><option value="yes">${t("required")}</option></select>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("titleField"), t("status")], (state.extra.fields || []).map((item) => `<tr><td>${item.title}</td><td>${item.required ? t("required") : t("optional")}</td></tr>`))}`;
  }
  if (state.page === "setup") {
    const settings = desk.settings || {};
    return `<form id="setup" class="card">${field(t("round"), `<input id="returnFee" type="number" min="0" step="0.01" value="${settings.returnFee ? (settings.returnFee / 100).toFixed(2) : "0"}">`)}${field(t("payment"), `<select id="payment"><option value="cash">Cash</option><option value="card">Card</option><option value="wallet">Wallet</option><option value="invoice">Invoice</option></select>`)}<label><input id="finish" type="checkbox" ${settings.finishOnly ? "checked" : ""}> ${t("finishOnly")}</label><button class="primary">${t("save")}</button></form>
      <form id="operator" class="card">${field(t("name"), `<input id="name" required>`)}${field(t("email"), `<input id="email" type="email" required>`)}${field(t("role"), `<select id="role"><option value="operator">operator</option><option value="supervisor">supervisor</option></select>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("name"), t("email"), t("role")], (desk.operators || []).map((item) => `<tr><td>${item.name}</td><td>${item.email}</td><td>${item.role}</td></tr>`))}`;
  }
  if (state.page === "language") return `<form id="lang" class="card"><p>English</p><label><input id="pt" type="checkbox" ${state.portuguese ? "checked" : ""}> Português</label><button class="primary">${t("save")}</button></form>`;
  if (state.page === "cache") return `<form id="cache" class="card"><p>${state.portuguese ? "Ao confirmar, a sessão desta central é encerrada." : "Confirming ends this central session."}</p><button class="primary">${t("cache")}</button></form>`;
  if (state.page === "whatsapp") {
    const row = state.extra.whatsapp || {};
    return `<form id="wa" class="card">${field(t("phone"), `<input id="phone" value="${row.phone || ""}">`)}${field(t("status"), `<select id="status"><option ${row.status === "disconnected" ? "selected" : ""}>disconnected</option><option ${row.status === "connecting" ? "selected" : ""}>connecting</option><option ${row.status === "connected" ? "selected" : ""}>connected</option></select>`)}<button class="primary">${t("save")}</button></form>
      <form id="wa-key" class="card">${field(t("name"), `<input id="name" required>`)}${field(t("sender"), `<input id="sender" required>`)}<button class="primary">${t("save")}</button></form>
      ${table([t("name"), t("sender")], (state.extra.keys || []).map((item) => `<tr><td>${item.name}</td><td>${item.sender}</td></tr>`))}
      <form id="wa-notice" class="card">${field(t("template"), `<input id="template" required>`)}${field(t("minutes"), `<input id="minutes" type="number" min="0" step="1" required>`)}<p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
      ${table([t("template"), t("minutes")], (state.extra.notices || []).map((item) => `<tr><td>${item.template}</td><td>${item.minutesBefore}</td></tr>`))}`;
  }
  return `<form id="group" class="card">${field(t("name"), `<input id="name" required>`)}${field(t("message"), `<input id="message">`)}${field(t("driverMessage"), `<input id="driverMessage">`)}<label><input id="autoGroup" type="checkbox"> ${t("groups")}</label><label><input id="autoDriver" type="checkbox"> ${t("driver")}</label><p class="error">${state.error}</p><button class="primary">${t("save")}</button></form>
    ${table([t("name"), t("message")], (state.extra.groups || []).map((item) => `<tr><td>${item.name}</td><td>${item.message || ""}</td></tr>`))}`;
}

function renderDesk() {
  const desk = state.desk;
  app.innerHTML = `
    <div class="shell">
      <aside class="side">
        <div class="side-brand-box"><img src="/logo-movy.png" alt="Movy" /></div>
        <h1>${t("title")}</h1>
        <p class="muted" style="margin:4px 0 16px;">${state.user?.name || ""}</p>
        ${pages.map((page) => `<button data-page="${page}" class="${page === state.page ? "on" : ""}">${t(page)}</button>`).join("")}
        <button id="out">${t("out")}</button>
      </aside>
      <main class="main">
        <div class="top">
          <div>
            <h2>${desk ? desk.central.name : ""}</h2>
            <p class="muted" style="margin:2px 0 0;">${desk ? desk.central.city : ""}</p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span class="live-badge"><span class="live-dot"></span> ${t("liveSync")}</span>
            <button class="audio-toggle ${state.audioEnabled ? "active" : ""}" id="toggle-audio">${state.audioEnabled ? `🔊 ${t("soundOn")}` : `🔇 ${t("soundOff")}`}</button>
            <select id="central">${state.centrals.map((item) => `<option value="${item.id}" ${item.id === state.centralId ? "selected" : ""}>${item.name} — ${item.city}</option>`).join("")}</select>
          </div>
        </div>
        ${pageBody()}
      </main>
    </div>`;

  app.querySelectorAll("[data-page]").forEach((button) => {
    button.onclick = async () => {
      state.page = button.dataset.page;
      state.error = "";
      await openPage();
    };
  });
  app.querySelector("#central").onchange = async (event) => {
    state.centralId = event.target.value;
    state.extra = {};
    await loadDesk();
  };
  const toggleAudio = app.querySelector("#toggle-audio");
  if (toggleAudio) {
    toggleAudio.onclick = () => {
      state.audioEnabled = !state.audioEnabled;
      localStorage.setItem("movy-central-audio", state.audioEnabled);
      renderDesk();
      if (state.audioEnabled) playDispatchBeep();
    };
  }
  app.querySelector("#out").onclick = () => {
    sessionStorage.removeItem(tokenKey);
    state.token = "";
    location.reload();
  };
  bind();
}

function bind() {
  const mapNode = app.querySelector("#central-map");
  if (mapNode && window.L) {
    if (centralMapInstance) {
      centralMapInstance.remove();
      centralMapInstance = null;
    }
    const pins = (state.desk?.pins || []).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
    const defaultCenter = pins.length ? [pins[0].lat, pins[0].lng] : [25.7743, -80.1937];
    const map = window.L.map(mapNode).setView(defaultCenter, pins.length ? 13 : 11);
    centralMapInstance = map;

    window.L.tileLayer("https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      attribution: "CARTO",
      maxZoom: 18,
    }).addTo(map);

    pins.forEach((pin) => {
      window.L.circleMarker([pin.lat, pin.lng], {
        radius: 8,
        fillColor: "#04f3fa",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map).bindPopup(`<b>${pin.name || "Station / Vehicle"}</b>`);
    });
  }

  const call = app.querySelector("#call");
  if (call) {
    call.querySelector("#find").oninput = async () => {
      const q = call.querySelector("#find").value.trim();
      if (q.length < 2) {
        call.querySelector("#found").innerHTML = "";
        return;
      }
      const result = await api(`/api/customers?q=${encodeURIComponent(q)}`);
      const allPeople = result.items || [];
      const sameCity = allPeople.filter((item) => item.cityId === cityId());
      const people = (sameCity.length ? sameCity : allPeople).slice(0, 6);
      call.querySelector("#found").innerHTML = `<div class="sugg-box">${people.map((item) => `<button class="sugg-btn" type="button" data-rider="${item.id}" data-name="${item.name}" data-phone="${item.phone || ""}">${item.name} (${item.phone || "No phone"})</button>`).join("")}</div>`;
      call.querySelectorAll("[data-rider]").forEach((button) => {
        button.onclick = () => {
          state.extra.riderId = button.dataset.rider;
          call.querySelector("#find").value = button.dataset.name;
          call.querySelector("#found").innerHTML = "";
        };
      });
    };

    const suggest = async (input, listId) => {
      const q = input.value.trim();
      if (q.length < 2) return;
      const result = await api(`/api/central/addresses?cityId=${encodeURIComponent(cityId())}&q=${encodeURIComponent(q)}`);
      call.querySelector(listId).innerHTML = (result.items || []).map((item) => `<button class="sugg-btn" type="button" data-pick="${item.name}">${item.name}</button>`).join("");
      call.querySelectorAll(`${listId} [data-pick]`).forEach((button) => {
        button.onclick = () => {
          input.value = button.dataset.pick;
          call.querySelector(listId).innerHTML = "";
        };
      });
    };
    call.querySelector("#origin").oninput = () => suggest(call.querySelector("#origin"), "#origin-list");
    call.querySelector("#destination").oninput = () => suggest(call.querySelector("#destination"), "#destination-list");

    const calcBtn = call.querySelector("#calc-route");
    if (calcBtn) {
      calcBtn.onclick = async () => {
        const origin = call.querySelector("#origin").value.trim();
        const destination = call.querySelector("#destination").value.trim();
        if (!origin || !destination) {
          state.error = state.portuguese ? "Preencha origem e destino primeiro." : "Please enter both origin and destination.";
          renderDesk();
          return;
        }
        calcBtn.textContent = "Calculando...";
        try {
          const result = await api("/api/maps/test", { method: "POST", body: JSON.stringify({ origin, destination }) });
          call.querySelector("#km").value = result.distanceKm || 5.0;
          call.querySelector("#minutes").value = result.durationMin || 12;
          calcBtn.textContent = `✓ ${result.distanceKm} km · ${result.durationMin} min`;
          state.error = "";
        } catch (err) {
          calcBtn.textContent = t("calcRoute");
          state.error = err.message;
        }
      };
    }

    call.querySelector("#swap").onclick = () => {
      const origin = call.querySelector("#origin").value;
      call.querySelector("#origin").value = call.querySelector("#destination").value;
      call.querySelector("#destination").value = origin;
    };
    call.querySelector("#add-stop").onclick = () => {
      const stop = call.querySelector("#stop").value.trim();
      if (!stop) return;
      state.extra.stops = [...(state.extra.stops || []), stop].slice(0, 4);
      renderDesk();
    };
    call.querySelectorAll("[data-hour]").forEach((button) => {
      button.onclick = () => {
        state.extra.hour = button.dataset.hour;
        renderDesk();
      };
    });
    call.querySelector("#fav").onclick = async () => {
      const driverId = call.querySelector("#driver").value;
      if (!driverId) return;
      await api("/api/central/favorites", { method: "POST", body: JSON.stringify({ centralId: state.centralId, driverId }) });
      await loadDesk();
    };
    call.onsubmit = async (event) => {
      event.preventDefault();
      state.error = "";
      const body = {
        centralId: state.centralId,
        tripTypeId: call.querySelector("#type").value,
        origin: call.querySelector("#origin").value,
        destination: call.querySelector("#destination").value,
        distanceKm: Number(call.querySelector("#km").value),
        durationMin: Number(call.querySelector("#minutes").value),
        payment: call.querySelector("#payment").value,
        roundTrip: call.querySelector("#round").checked ? "yes" : "no",
        riderFor: call.querySelector("#who").value,
        personKind: call.querySelector("#kind").value,
        stops: state.extra.stops || [],
        scheduledTime: state.extra.hour || "",
        scheduledDate: call.querySelector("#day").value,
        deliveryType: call.querySelector("#delivery").value,
        pickupNote: call.querySelector("#pickup").value,
        dropoffNote: call.querySelector("#drop").value,
        restrictDrivers: call.querySelector("#restrict").checked,
        favoriteOnly: call.querySelector("#favoriteOnly").checked
      };
      if (state.extra.riderId) body.customerId = state.extra.riderId;
      if (call.querySelector("#hood").value) body.neighborhoodId = call.querySelector("#hood").value;
      if (call.querySelector("#driver").value) body.driverId = call.querySelector("#driver").value;
      try {
        await api("/api/trips", { method: "POST", body: JSON.stringify(body) });
        state.extra.stops = [];
        state.page = "trips";
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }

  app.querySelectorAll("[data-cancel]").forEach((button) => {
    button.onclick = async () => {
      await api("/api/central/trips/cancel", { method: "POST", body: JSON.stringify({ centralId: state.centralId, tripId: button.dataset.cancel }) });
      await loadDesk();
    };
  });
  const box = app.querySelector("#wa-box");
  if (box) {
    box.onsubmit = async (event) => {
      event.preventDefault();
      await api("/api/central/messages", { method: "POST", body: JSON.stringify({ centralId: state.centralId, body: box.querySelector("#message").value }) });
      const trip = (state.desk?.activeTrips || [])[0];
      if (trip) await api(`/api/whatsapp/trips/${trip.id}/send`, { method: "POST", body: "{}" }).catch(() => {});
      await loadDesk();
    };
  }
  const filter = app.querySelector("#filter");
  if (filter) {
    filter.onsubmit = async (event) => {
      event.preventDefault();
      const status = filter.querySelector("#status").value;
      const q = filter.querySelector("#q").value;
      const from = filter.querySelector("#from").value;
      const to = filter.querySelector("#to").value;
      const result = await api(`/api/central/trips?centralId=${encodeURIComponent(state.centralId)}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      state.extra.trips = result.items || [];
      renderDesk();
    };
  }
  const hood = app.querySelector("#hood");
  if (hood && state.page === "districts") {
    hood.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/neighborhoods", { method: "POST", body: JSON.stringify({ id: state.extra.hood?.id, centralId: state.centralId, name: hood.querySelector("#name").value, tripTypeId: hood.querySelector("#type").value, flatFare: Number(hood.querySelector("#fare").value) }) });
        state.extra.hood = null;
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const hop = app.querySelector("#hop");
  if (hop) {
    hop.onsubmit = async (event) => {
      event.preventDefault();
      const origin = hop.querySelector("#origin").value;
      const destination = hop.querySelector("#destination").value;
      try {
        await api("/api/routes", { method: "POST", body: JSON.stringify({ cityId: cityId(), name: `${origin} → ${destination}`, origin, destination, pricePerPerson: Number(hop.querySelector("#price").value), tripTypeId: hop.querySelector("#type").value }) });
        state.extra.routes = null;
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const rides = app.querySelector("#rides");
  if (rides) {
    rides.onsubmit = async (event) => {
      event.preventDefault();
      await api("/api/central/neighborhood-rides", { method: "POST", body: JSON.stringify({ centralId: state.centralId, active: !state.desk.neighborhoodRides }) });
      await loadDesk();
    };
  }
  app.querySelectorAll("[data-route]").forEach((button) => {
    button.onclick = async () => {
      await api("/api/routes/active", { method: "POST", body: JSON.stringify({ id: button.dataset.route, active: button.dataset.on === "1" }) });
      state.extra.routes = null;
      await openPage();
    };
  });
  const tariff = app.querySelector("#tariff");
  if (tariff) {
    tariff.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/trip-types", { method: "POST", body: JSON.stringify({ id: state.extra.tariff?.id, cityId: cityId(), name: tariff.querySelector("#name").value, base: Number(tariff.querySelector("#base").value), perKm: Number(tariff.querySelector("#km").value), perMin: Number(tariff.querySelector("#min").value), minimum: Number(tariff.querySelector("#minimum").value), tax: Number(tariff.querySelector("#tax").value || 0), seats: Number(tariff.querySelector("#seats").value || 4), active: "yes" }) });
        state.extra.tariff = null;
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const people = app.querySelector("#people");
  if (people) {
    people.onsubmit = async (event) => {
      event.preventDefault();
      const result = await api(`/api/customers?q=${encodeURIComponent(people.querySelector("#q").value)}`);
      state.extra.people = result.items || [];
      renderDesk();
    };
  }
  const rider = app.querySelector("#rider");
  if (rider) {
    rider.onsubmit = async (event) => {
      event.preventDefault();
      try {
        const payload = { id: state.extra.customer?.id, name: rider.querySelector("#name").value, phone: rider.querySelector("#phone").value, email: rider.querySelector("#email").value, birthDate: rider.querySelector("#birth").value, document: rider.querySelector("#document").value, cityId: cityId(), status: "active" };
        if (rider.querySelector("#kind").value === "company") await api("/api/companies", { method: "POST", body: JSON.stringify(payload) });
        else await api("/api/customers", { method: "POST", body: JSON.stringify(payload) });
        state.extra.customer = null;
        state.page = "riders";
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  app.querySelectorAll("[data-open]").forEach((button) => {
    button.onclick = async () => {
      state.extra.detail = await api(`/api/central/trip?centralId=${encodeURIComponent(state.centralId)}&tripId=${encodeURIComponent(button.dataset.open)}`);
      renderDesk();
    };
  });
  app.querySelectorAll("[data-status]").forEach((button) => {
    button.onclick = async () => {
      try {
        state.extra.detail = await api("/api/central/trip-status", { method: "POST", body: JSON.stringify({ centralId: state.centralId, tripId: state.extra.detail.id, status: button.dataset.status, driverId: document.querySelector("#detail-driver")?.value }) });
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  });
  app.querySelectorAll("[data-hood]").forEach((button) => {
    button.onclick = () => {
      state.extra.hood = (state.desk.neighborhoods || []).find((item) => item.id === button.dataset.hood);
      renderDesk();
    };
  });
  app.querySelectorAll("[data-off]").forEach((button) => {
    button.onclick = async () => {
      await api("/api/neighborhoods", { method: "POST", body: JSON.stringify({ id: button.dataset.off, centralId: state.centralId, active: "no" }) });
      await loadDesk();
    };
  });
  app.querySelectorAll("[data-customer]").forEach((button) => {
    button.onclick = () => {
      state.extra.customer = (state.extra.people || state.desk.riders).find((item) => item.id === button.dataset.customer);
      state.page = "signup";
      renderDesk();
    };
  });
  app.querySelectorAll("[data-tariff]").forEach((button) => {
    button.onclick = () => {
      state.extra.tariff = (state.extra.cityTariffs || []).find((item) => item.id === button.dataset.tariff);
      renderDesk();
    };
  });
  const setup = app.querySelector("#setup");
  if (setup) {
    setup.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/central-settings", { method: "POST", body: JSON.stringify({ centralId: state.centralId, returnFee: Number(setup.querySelector("#returnFee").value), paymentMethod: setup.querySelector("#payment").value, finishOnly: setup.querySelector("#finish").checked ? "yes" : "no" }) });
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const operator = app.querySelector("#operator");
  if (operator) {
    operator.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/central-users", { method: "POST", body: JSON.stringify({ centralId: state.centralId, name: operator.querySelector("#name").value, email: operator.querySelector("#email").value, role: operator.querySelector("#role").value }) });
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const voucher = app.querySelector("#voucher");
  if (voucher) {
    voucher.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/vouchers", { method: "POST", body: JSON.stringify({ companyId: voucher.querySelector("#company").value, code: voucher.querySelector("#code").value, balance: Number(voucher.querySelector("#amount").value) }) });
        state.extra.vouchers = null;
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const fleet = app.querySelector("#fleet");
  if (fleet) {
    fleet.onsubmit = async (event) => {
      event.preventDefault();
      const result = await api(`/api/drivers?q=${encodeURIComponent(fleet.querySelector("#q").value)}`);
      state.extra.fleet = (result.items || []).filter((item) => item.cityId === cityId());
      renderDesk();
    };
  }
  const driver = app.querySelector("#driver");
  if (driver) {
    driver.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/drivers", { method: "POST", body: JSON.stringify({ name: driver.querySelector("#name").value, phone: driver.querySelector("#phone").value, email: driver.querySelector("#email").value, vehicle: driver.querySelector("#vehicle").value, plate: driver.querySelector("#plate").value, cityId: cityId(), status: "pending", presence: "offline", service: "private" }) });
        state.page = "drivers";
        await loadDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const radius = app.querySelector("#radius");
  if (radius) {
    radius.onsubmit = async (event) => {
      event.preventDefault();
      try {
        state.extra.radius = await api("/api/call-radius", { method: "POST", body: JSON.stringify({ cityId: cityId(), radiusKm: Number(radius.querySelector("#km").value), greaterKm: radius.querySelector("#greater").value }) });
        state.error = "";
        renderDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const key = app.querySelector("#key");
  if (key) {
    key.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/external-services", { method: "POST", body: JSON.stringify({ name: key.querySelector("#name").value, baseUrl: key.querySelector("#url").value, active: "yes" }) });
        state.extra.services = null;
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const fieldForm = app.querySelector("#field");
  if (fieldForm) {
    fieldForm.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/central/fields", { method: "POST", body: JSON.stringify({ centralId: state.centralId, title: fieldForm.querySelector("#title").value, required: fieldForm.querySelector("#required").value }) });
        state.extra.fields = null;
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const lang = app.querySelector("#lang");
  if (lang) {
    lang.onsubmit = async (event) => {
      event.preventDefault();
      const result = await api("/api/settings", { method: "PATCH", body: JSON.stringify({ portugueseEnabled: lang.querySelector("#pt").checked }) });
      state.portuguese = result.portugueseEnabled;
      renderDesk();
    };
  }
  const cache = app.querySelector("#cache");
  if (cache) {
    cache.onsubmit = async (event) => {
      event.preventDefault();
      await api("/api/actions/clear-cache", { method: "POST", body: "{}" });
      sessionStorage.removeItem(tokenKey);
      location.reload();
    };
  }
  const wa = app.querySelector("#wa");
  if (wa) {
    wa.onsubmit = async (event) => {
      event.preventDefault();
      try {
        state.extra.whatsapp = await api("/api/whatsapp/session", { method: "POST", body: JSON.stringify({ phone: wa.querySelector("#phone").value, status: wa.querySelector("#status").value }) });
        state.error = "";
        renderDesk();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const waKey = app.querySelector("#wa-key");
  if (waKey) {
    waKey.onsubmit = async (event) => {
      event.preventDefault();
      await api("/api/whatsapp/keys", { method: "POST", body: JSON.stringify({ name: waKey.querySelector("#name").value, sender: waKey.querySelector("#sender").value, active: "yes" }) });
      await openPage();
    };
  }
  const waNotice = app.querySelector("#wa-notice");
  if (waNotice) {
    waNotice.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/whatsapp/notices", { method: "POST", body: JSON.stringify({ template: waNotice.querySelector("#template").value, minutesBefore: Number(waNotice.querySelector("#minutes").value), active: "yes" }) });
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
  const group = app.querySelector("#group");
  if (group) {
    group.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await api("/api/whatsapp/groups", { method: "POST", body: JSON.stringify({ name: group.querySelector("#name").value, message: group.querySelector("#message").value, driverMessage: group.querySelector("#driverMessage").value, autoGroup: group.querySelector("#autoGroup").checked, autoDriver: group.querySelector("#autoDriver").checked }) });
        state.extra.groups = null;
        await openPage();
      } catch (error) {
        state.error = error.message;
        renderDesk();
      }
    };
  }
}

async function openPage() {
  if (state.page === "hops") state.extra.routes = (await api(`/api/central/routes?cityId=${encodeURIComponent(cityId())}`)).items || [];
  if (state.page === "vouchers") {
    if (!state.extra.vouchers) state.extra.vouchers = (await api("/api/vouchers")).items || [];
    if (!state.extra.companies) state.extra.companies = ((await api("/api/companies")).items || []).filter((item) => item.cityId === cityId());
  }
  if (state.page === "radius" && !state.extra.radius) state.extra.radius = ((await api("/api/call-radius")).items || []).find((item) => item.cityId === cityId()) || {};
  if (state.page === "keys" && !state.extra.services) state.extra.services = (await api("/api/external-services")).items || [];
  if (state.page === "fields") state.extra.fields = (await api(`/api/central/fields?centralId=${encodeURIComponent(state.centralId)}`)).items || [];
  if (state.page === "tariffs") state.extra.cityTariffs = (await api(`/api/central/tariffs?cityId=${encodeURIComponent(cityId())}`)).items || [];
  if (state.page === "whatsapp") {
    if (!state.extra.whatsapp) state.extra.whatsapp = (await api("/api/whatsapp/session")).items?.[0] || {};
    state.extra.keys = (await api("/api/whatsapp/keys")).items || [];
    state.extra.notices = (await api("/api/whatsapp/notices")).items || [];
  }
  if (state.page === "groups") state.extra.groups = (await api("/api/whatsapp/groups")).items || [];
  renderDesk();
}

function startCentralLiveSync() {
  if (centralLiveSyncTimer) clearInterval(centralLiveSyncTimer);
  centralLiveSyncTimer = setInterval(async () => {
    if (!state.token || !state.centralId) return;
    if (state.page === "home") {
      try {
        const freshDesk = await api(`/api/central/desk?centralId=${encodeURIComponent(state.centralId)}`);
        const currentActiveCount = freshDesk.activeTrips?.length || 0;
        if (state.lastTripCount > 0 && currentActiveCount > state.lastTripCount) {
          playDispatchBeep();
        }
        state.lastTripCount = currentActiveCount;
        state.desk = freshDesk;
        renderDesk();
      } catch (_) {}
    }
  }, 6000);
}

async function loadDesk() {
  state.desk = await api(`/api/central/desk?centralId=${encodeURIComponent(state.centralId)}`);
  state.lastTripCount = (state.desk?.activeTrips || []).length;
  await openPage();
  startCentralLiveSync();
}

async function boot() {
  const bootstrap = await api("/api/bootstrap");
  state.user = bootstrap.user;
  state.portuguese = Boolean(bootstrap.settings?.portugueseEnabled);
  state.centrals = ((await api("/api/centrals")).items || []).filter((item) => item.status === "active");
  state.centralId = state.centralId || state.centrals[0]?.id || "";
  if (!state.centralId) {
    state.error = t("empty");
    renderLogin();
    return;
  }
  await loadDesk();
}

if (state.token) boot().catch(() => { state.token = ""; renderLogin(); });
else renderLogin();
