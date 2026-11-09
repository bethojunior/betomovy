import { bindCore, corePath, renderCore } from "./core.js?v=30";

const copy = {
  en: {
    kicker: "Urban mobility",
    headline: "See every car, trip and dollar in one place.",
    signIn: "Sign in",
    email: "Email",
    password: "Password",
    continue: "Continue",
    search: "Search",
    menu: "Menu",
    new: "New",
    save: "Save",
    close: "Close",
    edit: "Edit",
    delete: "Delete",
    signOut: "Logout",
    changePassword: "Change password",
    clearCache: "Clear Cache",
    empty: "Nothing here yet. Create the first record.",
    current: "Current password",
    next: "New password",
    portuguese: "Portuguese",
    portugueseHelp: "English is the official language. Portuguese can be turned on or off. When it is on, people can choose it. English remains the default.",
    enabled: "Portuguese is available",
    disabled: "Portuguese is off",
    importHelp: "One person per line: name, phone, email",
    import: "Import",
    documents: "Documents, phones or emails",
    apply: "Apply",
    confirmReset: "This updates every driver. Continue?",
    run: "Run",
    test: "Test route",
    gross: "Gross volume",
    trips: "Trips",
    online: "Online drivers",
    acceptance: "Acceptance",
    available: "Available",
    en_route: "On the way",
    on_trip: "On a trip",
    offline: "Offline",
    todayTrips: "Today's trips",
    todayRevenue: "Today's revenue",
    averageTicket: "Average ticket",
    activeVehicles: "Active vehicles",
    driverTypes: "Driver types",
    passengers: "Passengers",
    payments: "Payment methods",
    tripStatus: "Trip status",
    cancellations: "Cancellations",
    topDrivers: "Top drivers",
    topRiders: "Top passengers",
    private: "Private driver",
    delivery: "Delivery",
    active: "Active",
    waiting: "Waiting",
    pending: "Pending",
    blocked: "Blocked",
    total: "Total",
    cash: "Cash",
    voucher: "Voucher",
    card: "Card",
    accepted: "Accepted",
    finished: "Finished",
    byDriver: "By driver",
    byRider: "By passenger",
    all: "All",
    account: "Account",
    accessTitle: "Access your account",
    accessHelp: "Enter your fleet manager credentials",
    workEmail: "Work email",
    forgot: "Forgot your password?",
    captcha: "Security check",
    captchaResult: "Result",
    confirm: "Confirm",
    captchaWrong: "That result is wrong. Try again.",
    enterPanel: "Enter the monitor",
    signingIn: "Signing in...",
    secure: "Secure connection · IP and location audit",
    location: "Location",
    forgotTitle: "Can't sign in?",
    recoveryEmail: "Enter your email",
    recoveryCode: "Enter the recovery code",
    newPassword: "New password",
    confirmPassword: "Confirm the new password",
    passwordsDontMatch: "The passwords do not match.",
    passwordChanged: "Password changed. You can sign in now.",
    talkToSupport: "Talk to support",
    chooseOperation: "Choose the operation",
    back: "Back",
    show: "Show",
    hide: "Hide",
    liveSync: "Live Sync Active",
    soundOn: "Sound On",
    soundOff: "Sound Muted",
    tripDetails: "Trip Details",
    viewOnMap: "View on map",
  },
  pt: {
    kicker: "Mobilidade urbana",
    headline: "Veja cada carro, viagem e dólar em um só lugar.",
    signIn: "Entrar",
    email: "E-mail",
    password: "Senha",
    continue: "Continuar",
    search: "Buscar",
    menu: "Menu",
    new: "Novo",
    save: "Salvar",
    close: "Fechar",
    edit: "Editar",
    delete: "Excluir",
    signOut: "Sair",
    changePassword: "Alterar senha",
    clearCache: "Limpar cache",
    empty: "Nada por aqui ainda. Crie o primeiro registro.",
    current: "Senha atual",
    next: "Nova senha",
    portuguese: "Português",
    portugueseHelp: "O inglês é o idioma oficial. O português pode ser ativado ou desativado. Quando está ativo, as pessoas podem escolhê-lo. O inglês continua sendo o padrão.",
    enabled: "Português disponível",
    disabled: "Português desativado",
    importHelp: "Uma pessoa por linha: nome, telefone, e-mail",
    import: "Importar",
    documents: "Documentos, telefones ou e-mails",
    apply: "Aplicar",
    confirmReset: "Isso altera todos os motoristas. Continuar?",
    run: "Gerar",
    test: "Testar rota",
    gross: "Volume bruto",
    trips: "Viagens",
    online: "Motoristas online",
    acceptance: "Aceite",
    available: "Disponível",
    en_route: "A caminho",
    on_trip: "Em viagem",
    offline: "Offline",
    todayTrips: "Viagens de hoje",
    todayRevenue: "Receita de hoje",
    averageTicket: "Ticket médio",
    activeVehicles: "Veículos ativos",
    driverTypes: "Tipos de motorista",
    passengers: "Passageiros",
    payments: "Formas de pagamento",
    tripStatus: "Status das viagens",
    cancellations: "Cancelamentos",
    topDrivers: "Motoristas em destaque",
    topRiders: "Passageiros em destaque",
    private: "Motorista particular",
    delivery: "Delivery",
    active: "Ativos",
    waiting: "Aguardando",
    pending: "Pendentes",
    blocked: "Bloqueados",
    total: "Total",
    cash: "Dinheiro",
    voucher: "Voucher",
    card: "Cartão",
    accepted: "Aceitas",
    finished: "Finalizadas",
    byDriver: "Pelo motorista",
    byRider: "Pelo passageiro",
    all: "Todas",
    account: "Conta",
    accessTitle: "Acesse sua conta",
    accessHelp: "Insira suas credenciais de gestor de frota",
    workEmail: "E-mail de acesso",
    forgot: "Esqueceu sua senha de acesso?",
    captcha: "Segurança",
    captchaResult: "Resultado",
    confirm: "Confirmar",
    captchaWrong: "Resultado incorreto. Tente novamente.",
    enterPanel: "Entrar no painel",
    signingIn: "Autenticando...",
    secure: "Conexão segura · Auditoria de IP e localização",
    location: "Localização",
    forgotTitle: "Não consegue acessar?",
    recoveryEmail: "Insira seu e-mail",
    recoveryCode: "Digite o código de recuperação",
    newPassword: "Digite sua nova senha",
    confirmPassword: "Confirme sua nova senha",
    passwordsDontMatch: "As senhas não coincidem.",
    passwordChanged: "Senha alterada. Você já pode entrar.",
    talkToSupport: "Falar com suporte",
    chooseOperation: "Escolha a operação",
    back: "Voltar",
    show: "Mostrar",
    hide: "Ocultar",
    liveSync: "Ao Vivo Ativo",
    soundOn: "Som Ativo",
    soundOff: "Som Mudo",
    tripDetails: "Detalhes da Viagem",
    viewOnMap: "Ver no mapa",
  },
};

const state = {
  token: sessionStorage.getItem("movy-token") || "",
  locale: sessionStorage.getItem("movy-locale") || "en",
  audioEnabled: localStorage.getItem("movy-audio") !== "false",
  bootstrap: null,
  path: location.pathname === "/" ? "/" : location.pathname,
  query: "",
  navQuery: "",
  items: [],
  metrics: null,
  fleet: [],
  drawer: null,
  error: "",
  notice: "",
  menu: false,
  tripStatus: "",
  openMenus: [],
  selectedTrip: null,
  lastTripCount: 0,
};

const words = {
  en: { active: "Active", pending: "Pending", blocked: "Blocked", approved: "Approved", rejected: "Rejected", yes: "Yes", no: "No", completed: "Completed", cancelled: "Canceled", requested: "Requested", accepted: "Accepted", arriving: "Arriving", in_progress: "In progress", card: "Card", cash: "Cash", wallet: "Wallet", invoice: "Invoice", name: "Name", phone: "Phone", email: "Email", document: "Document", city: "City", status: "Status", balance: "Balance", notes: "Notes", vehicle: "Vehicle", plate: "Plate", rating: "Rating", presence: "Presence", fare: "Fare", payment: "Payment", origin: "Origin", destination: "Destination", driver: "Driver", rider: "Rider", reference: "Reference", credit: "Credit", debit: "Debit", posted: "Posted", void: "Void", paid: "Paid", charged: "Charged" },
  pt: { active: "Ativo", pending: "Pendente", blocked: "Bloqueado", approved: "Aprovado", rejected: "Recusado", yes: "Sim", no: "Não", completed: "Concluída", cancelled: "Cancelada", requested: "Solicitada", accepted: "Aceita", arriving: "Chegando", in_progress: "Em andamento", card: "Cartão", cash: "Dinheiro", wallet: "Carteira", invoice: "Faturado", name: "Nome", phone: "Telefone", email: "E-mail", document: "Documento", city: "Cidade", status: "Status", balance: "Saldo", notes: "Observações", vehicle: "Veículo", plate: "Placa", rating: "Nota", presence: "Presença", fare: "Tarifa", payment: "Pagamento", origin: "Origem", destination: "Destino", driver: "Motorista", rider: "Passageiro", reference: "Referência" },
};

function word(value) {
  return words[state.locale]?.[value] || words.en[value] || value;
}

const t = (key) => copy[state.locale]?.[key] || copy.en[key] || key;
const money = (cents) =>
  new Intl.NumberFormat(state.locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: "USD",
  }).format((Number(cents) || 0) / 100);

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      authorization: state.token ? `Bearer ${state.token}` : "",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    state.token = "";
    sessionStorage.removeItem("movy-token");
    state.bootstrap = null;
  }
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function screen() {
  return state.bootstrap.catalog.screens.find((item) => item.path === state.path) || state.bootstrap.catalog.screens[0];
}

function titleOf(item) {
  return state.locale === "pt" && state.bootstrap.settings.portugueseEnabled ? item.pt : item.en;
}

function go(path) {
  history.pushState({}, "", path);
  state.path = path;
  state.query = "";
  state.drawer = null;
  state.menu = false;
  render();
}

function renderMenu() {
  const tree = state.bootstrap.catalog.menu || [];
  return tree.map((node) => renderMenuNode(node, 0, "root")).join("");
}

function renderMenuNode(node, depth, prefix) {
  const query = state.navQuery.toLowerCase();
  if (node.key) {
    const item = state.bootstrap.catalog.screens.find((screenItem) => screenItem.key === node.key);
    if (!item) return "";
    if (query && !titleOf(item).toLowerCase().includes(query)) return "";
    return `<button class="nav-btn depth-${Math.min(depth, 4)} ${item.path === state.path ? "active" : ""}" data-path="${item.path}">${titleOf(item)}</button>`;
  }
  const id = `${prefix}/${node.en}`;
  const children = node.children.map((child) => renderMenuNode(child, depth + 1, id)).join("");
  if (!children) return "";
  const open = state.openMenus.includes(id) || Boolean(query);
  const label = state.locale === "pt" && state.bootstrap.settings.portugueseEnabled ? node.pt : node.en;
  return `<div class="nest"><button class="nav-btn depth-${Math.min(depth, 4)} sub-toggle" data-menu="${escapeHtml(id)}">${label}</button><div class="${open ? "nest-children" : "nest-children hidden"}">${children}</div></div>`;
}

function fieldValue(record, field) {
  const value = record?.[field.key];
  if (field.type === "money") return money(value);
  if (field.type === "select") return word(value);
  return value ?? "";
}

function app() {
  return document.getElementById("app");
}

const loginUi = {
  a: 1 + Math.floor(Math.random() * 9),
  b: 1 + Math.floor(Math.random() * 9),
  passed: false,
  captchaError: false,
  mode: "sign-in",
  recoveryStep: 1,
  recoveryEmail: "",
  issuedCode: "",
  franchises: [],
  credentials: null,
  location: null,
  asked: false,
  success: "",
  busy: false,
};

function freshCaptcha() {
  loginUi.a = 1 + Math.floor(Math.random() * 9);
  loginUi.b = 1 + Math.floor(Math.random() * 9);
  loginUi.passed = false;
  loginUi.captchaError = false;
}

function render() {
  if (!state.token || !state.bootstrap) {
    app().innerHTML = loginHtml();
    bindLogin();
    return;
  }
  if (!state.bootstrap.settings.portugueseEnabled) state.locale = "en";
  const layout = state.bootstrap.settings.layout || {};
  const layoutOn = layout.active !== 0 && layout.active !== false;
  document.body.dataset.density = layoutOn && layout.density === "compact" ? "compact" : "comfortable";
  document.body.dataset.map = layoutOn && layout.mapStyle === "night" ? "night" : "day";
  document.documentElement.lang = state.locale === "pt" ? "pt-BR" : "en";
  const current = screen();
  app().innerHTML = `
    <div class="shell">
      <aside class="sidebar ${state.menu ? "open" : ""}">
        <div class="side-brand"><img src="/logo-movy.png" alt="Movy" /></div>
        <input class="side-search" id="nav-search" placeholder="${t("search")}" value="${escapeHtml(state.navQuery)}" />
        ${renderMenu()}
      </aside>
      <section class="main">
        <header class="topbar">
            <div>
            <button class="ghost" id="open-menu">${t("menu")}</button>
            <h1>${titleOf(current)}</h1>
            ${state.bootstrap.user.franchise ? `<p class="hint">${state.bootstrap.user.franchise.name}</p>` : ""}
          </div>
          <div class="top-actions">
            <span class="live-badge" title="${t("liveSync")}"><span class="live-dot"></span> ${t("liveSync")}</span>
            <button class="audio-toggle ${state.audioEnabled ? "active" : ""}" id="toggle-audio">${state.audioEnabled ? `🔊 ${t("soundOn")}` : `🔇 ${t("soundOff")}`}</button>
            ${state.bootstrap.settings.portugueseEnabled ? `<div class="lang"><button class="ghost" data-locale="en">EN</button><button class="ghost" data-locale="pt">PT</button></div>` : ""}
            <button class="ghost" id="password">${t("changePassword")}</button>
            <button class="ghost" id="cache">${t("clearCache")}</button>
            <button class="ghost" id="logout">${t("signOut")}</button>
          </div>
        </header>
        <div class="content">
          <p class="error">${state.error}</p>
          <p class="hint">${state.notice}</p>
          ${view(current)}
        </div>
      </section>
    </div>
    ${state.drawer ? drawer(current) : ""}`;
  bindShell(current);
}

function loginHtml() {
  const location = loginUi.location
    ? `<div class="coords">${t("location")}: ${loginUi.location.latitude.toFixed(4)}, ${loginUi.location.longitude.toFixed(4)}</div>`
    : "";
  const body =
    loginUi.mode === "recovery"
      ? recoveryHtml()
      : loginUi.mode === "franchise"
        ? `<h2>${t("chooseOperation")}</h2><label>${t("chooseOperation")}</label><select id="franchise">${loginUi.franchises
            .map((item) => `<option value="${item.id}">${item.name}</option>`)
            .join("")}</select><button class="primary full" type="button" id="enter-franchise">${t("enterPanel")}</button><button class="ghost full" type="button" id="back-login">${t("back")}</button>`
        : `<h2>${t("accessTitle")}</h2><p class="hint">${t("accessHelp")}</p>
          <label>${t("workEmail")}</label><input name="email" type="email" placeholder="name@company.com" value="${escapeHtml(loginUi.credentials?.email || "")}" required />
          <label>${t("password")}</label><input id="inputPassword" name="password" type="password" placeholder="••••••••" value="${escapeHtml(loginUi.credentials?.password || "")}" required />
          ${
            loginUi.passed
              ? `<button class="primary full" ${loginUi.busy ? "disabled" : ""}>${loginUi.busy ? t("signingIn") : t("enterPanel")}</button>`
              : `<div class="captcha ${loginUi.captchaError ? "has-error" : ""}"><label>${t("captcha")}: <strong>${loginUi.a} + ${loginUi.b}</strong></label><div class="captcha-row"><input name="captcha" type="number" placeholder="${t("captchaResult")}" /><button class="primary" type="button" id="check-captcha">${t("confirm")}</button></div>${loginUi.captchaError ? `<span class="error">${t("captchaWrong")}</span>` : ""}</div>`
          }
          <button class="text-link" type="button" id="forgot">${t("forgot")}</button>`;
  return `<div class="login"><section class="login-brand"><p>${t("headline")}</p><span>${t("kicker")}</span></section>
    <section class="login-panel"><form class="card" id="login"><img class="login-logo" src="/logo-movy.png" alt="Movy" />${body}<p class="error">${state.error}</p><p class="hint">${loginUi.success}</p><div class="security"><span>${t("secure")}</span>${location}</div></form></section></div>`;
}

function recoveryHtml() {
  if (loginUi.recoveryStep === 1) return `<h2>${t("forgotTitle")}</h2><p>${t("recoveryEmail")}</p><input id="recovery-email" type="email" value="${escapeHtml(loginUi.recoveryEmail)}" />`;
  if (loginUi.recoveryStep === 2) return `<h2>${t("forgotTitle")}</h2><p>${t("recoveryCode")}</p><p class="hint">${loginUi.issuedCode}</p><input id="recovery-code" inputmode="numeric" maxlength="4" />`;
  return `<h2>${t("forgotTitle")}</h2><label>${t("newPassword")}</label><input id="recovery-password" type="password" /><label>${t("confirmPassword")}</label><input id="recovery-confirm" type="password" />`;
}

function bindLogin() {
  if (!loginUi.asked) {
    loginUi.asked = true;
    navigator.geolocation?.getCurrentPosition((position) => {
      loginUi.location = position.coords;
      if (!state.token) render();
    });
  }
  const form = document.getElementById("login");
  form.onsubmit = async (event) => {
    event.preventDefault();
    if (loginUi.mode !== "sign-in" || !loginUi.passed) return;
    const data = Object.fromEntries(new FormData(form));
    await submitLogin(data.email, data.password, loginUi.credentials?.franchiseId);
  };
  document.getElementById("check-captcha")?.addEventListener("click", () => {
    const data = Object.fromEntries(new FormData(form));
    loginUi.credentials = { email: data.email, password: data.password };
    if (Number(data.captcha) !== loginUi.a + loginUi.b) {
      loginUi.captchaError = true;
      freshCaptcha();
      loginUi.captchaError = true;
      render();
      return;
    }
    loginUi.passed = true;
    loginUi.captchaError = false;
    render();
  });
  document.getElementById("forgot")?.addEventListener("click", () => {
    loginUi.mode = "recovery";
    loginUi.recoveryStep = 1;
    state.error = "";
    render();
  });
  document.getElementById("back-login")?.addEventListener("click", () => {
    loginUi.mode = "sign-in";
    loginUi.passed = false;
    freshCaptcha();
    render();
  });
  document.getElementById("enter-franchise")?.addEventListener("click", async () => {
    const franchiseId = document.getElementById("franchise").value;
    await submitLogin(loginUi.credentials.email, loginUi.credentials.password, franchiseId);
  });
  const recoveryButton = document.getElementById("recovery-next");
  if (loginUi.mode === "recovery" && !recoveryButton) {
    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.innerHTML = `<button class="primary" type="button" id="recovery-next">${t("confirm")}</button><a class="ghost" href="https://wa.me/558520280633" target="_blank" rel="noreferrer">${t("talkToSupport")}</a><button class="ghost" type="button" id="back-login">${t("back")}</button>`;
    form.insertBefore(actions, form.querySelector(".security"));
    document.getElementById("back-login").onclick = () => {
      loginUi.mode = "sign-in";
      loginUi.success = "";
      render();
    };
    document.getElementById("recovery-next").onclick = async () => {
      try {
        if (loginUi.recoveryStep === 1) {
          loginUi.recoveryEmail = document.getElementById("recovery-email").value;
          const result = await api("/api/recovery/request", { method: "POST", body: { email: loginUi.recoveryEmail } });
          loginUi.issuedCode = result.code;
          loginUi.recoveryStep = 2;
          state.error = "";
        } else if (loginUi.recoveryStep === 2) {
          loginUi.recoveryCode = document.getElementById("recovery-code").value;
          if (loginUi.recoveryCode !== loginUi.issuedCode) throw new Error(state.locale === "pt" ? "O código informado é inválido." : "The recovery code is invalid.");
          loginUi.recoveryStep = 3;
          state.error = "";
        } else {
          const password = document.getElementById("recovery-password").value;
          const confirm = document.getElementById("recovery-confirm").value;
          if (password !== confirm) throw new Error(t("passwordsDontMatch"));
          await api("/api/recovery/confirm", { method: "POST", body: { email: loginUi.recoveryEmail, code: loginUi.recoveryCode, password } });
          loginUi.mode = "sign-in";
          loginUi.success = t("passwordChanged");
          loginUi.passed = false;
          freshCaptcha();
        }
        render();
      } catch (error) {
        state.error = error.message;
        render();
      }
    };
  }
}

async function submitLogin(email, password, franchiseId) {
  loginUi.busy = true;
  try {
    const session = await api("/api/login", {
      method: "POST",
      body: {
        email,
        password,
        franchiseId,
        latitude: loginUi.location?.latitude,
        longitude: loginUi.location?.longitude,
      },
    });
    if (session.chooseFranchise) {
      loginUi.credentials = { email, password };
      loginUi.franchises = session.franchises;
      loginUi.mode = "franchise";
      loginUi.busy = false;
      state.error = "";
      render();
      return;
    }
    state.token = session.token;
    sessionStorage.setItem("movy-token", session.token);
    state.error = "";
    loginUi.busy = false;
    await load();
  } catch (error) {
    loginUi.busy = false;
    state.error = error.message;
    render();
  }
}

function view(current) {
  if (current.view === "dashboard") return dashboard();
  if (current.view === "fleet") return fleetView();
  if (current.view === "language") return languageView();
  if (current.view === "import") return importView(current);
  if (current.view === "bulk") return bulkView(current);
  if (current.view === "danger") return dangerView(current);
  if (current.view === "report") return reportView();
  if (current.view === "map-test") return mapTestView();
  if (corePath[current.key]) return renderCore({ t, money, word, escapeHtml, state }, current);
  if (current.view === "settings") return settingsView(current);
  return registry(current);
}

function dashboard() {
  const m = state.metrics || {};
  const passengers = m.passengers || {};
  const payments = m.payments || {};
  const statuses = m.statuses || {};
  const cancellations = m.cancellations || {};
  const types = m.types || [];
  const rank = (rows) =>
    rows && rows.length
      ? `<table><tbody>${rows
          .map(
            (row) =>
              `<tr><td>${escapeHtml(row.name || "")}</td><td>${row.trips}</td><td>${money(row.gross)}</td><td>${row.trips ? money(Math.round(row.gross / row.trips)) : money(0)}</td></tr>`
          )
          .join("")}</tbody></table>`
      : `<p class="muted">${t("empty")}</p>`;
  return `<div class="metrics">
    <article class="metric"><span>${t("todayTrips")}</span><strong>${m.todayTrips || 0}</strong></article>
    <article class="metric"><span>${t("todayRevenue")}</span><strong>${money(m.todayRevenue)}</strong></article>
    <article class="metric"><span>${t("averageTicket")}</span><strong>${money(m.averageTicket)}</strong></article>
    <article class="metric"><span>${t("activeVehicles")}</span><strong>${m.activeVehicles || 0}</strong><span>${m.registeredVehicles || 0}</span></article>
  </div>
  <div class="grid-2">
    <article class="panel"><h3>${t("driverTypes")}</h3>${types
      .map(
        (type) =>
          `<p><strong>${t(type.service)}</strong> ${type.total}</p><p class="muted">${t("active")} ${type.active} · ${t("waiting")} ${type.waiting} · ${t("pending")} ${type.pending} · ${t("blocked")} ${type.blocked}</p>`
      )
      .join("")}</article>
    <article class="panel"><h3>${t("passengers")}</h3><p>${t("total")} ${passengers.total || 0}</p><p class="muted">${t("active")} ${passengers.active || 0} · ${t("pending")} ${passengers.pending || 0} · ${t("blocked")} ${passengers.blocked || 0}</p><h3>${t("payments")}</h3><p class="muted">${t("cash")} ${payments.cash || 0} · ${t("voucher")} ${payments.voucher || 0} · ${t("card")} ${payments.card || 0}</p></article>
  </div>
  <div class="grid-2">
    <article class="panel"><h3>${t("tripStatus")}</h3><p class="muted">${t("accepted")} ${statuses.accepted || 0} · ${t("finished")} ${statuses.finished || 0} · ${t("total")} ${statuses.total || 0}</p><h3>${t("cancellations")}</h3><p class="muted">${t("byDriver")} ${cancellations.driver || 0} · ${t("byRider")} ${cancellations.rider || 0} · ${t("total")} ${cancellations.total || 0}</p></article>
    <article class="panel"><h3>${t("topDrivers")}</h3>${rank(m.topDrivers)}<h3>${t("topRiders")}</h3>${rank(m.topRiders)}</article>
  </div>`;
}

let activeMapInstance = null;
let activeMapMarkers = new Map();
let liveSyncTimer = null;

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

function carIconHtml(presence) {
  return `<div class="movy-car-pin ${presence || "offline"}">
    <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-4.66l.12-.34h13.77l.11.34V17zM7.5 13c-.83 0-1.5.67-1.5 1.5S6.67 16 7.5 16s1.5-.67 1.5-1.5S8.33 13 7.5 13zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>
  </div>`;
}

function driverPopupHtml(driver) {
  return `<div class="driver-popup">
    <h4>${escapeHtml(driver.name || "Driver")}</h4>
    <p class="rating">★ ${(Number(driver.rating) || 5.0).toFixed(1)}</p>
    <p><strong>${escapeHtml(driver.vehicle || "Vehicle")}</strong> · ${escapeHtml(driver.plate || "")}</p>
    <p>Status: <span class="pill ${driver.presence || "offline"}">${word(driver.presence || "offline")}</span></p>
  </div>`;
}

function renderFleetTripRows(items) {
  const rows = items.filter((item) => item.resource === "trips" || item.reference);
  if (!rows.length) return `<tr><td colspan="5" class="muted">${t("empty")}</td></tr>`;
  return rows.slice(0, 10).map((row) => `
    <tr class="clickable-row" data-focus-trip="${row.id || row.reference}">
      <td><strong>${escapeHtml(row.reference || "")}</strong></td>
      <td><span class="pill ${row.status || ""}">${word(row.status || "")}</span></td>
      <td>${escapeHtml(row.rider || "Passenger")}</td>
      <td>${escapeHtml(row.origin || "")} → ${escapeHtml(row.destination || "")}</td>
      <td><strong>${money(row.fare)}</strong></td>
    </tr>
  `).join("");
}

function fleetView() {
  const tripDetailsModal = state.selectedTrip ? `
    <div class="panel" style="margin-top:16px;border-left:4px solid var(--accent);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h3 style="margin:0;">${t("tripDetails")} · ${escapeHtml(state.selectedTrip.reference || "")}</h3>
        <button class="ghost" id="close-selected-trip">${t("close")}</button>
      </div>
      <div class="grid-2" style="margin-top:12px;">
        <div>
          <p><strong>${word("origin")}:</strong> ${escapeHtml(state.selectedTrip.origin || "")}</p>
          <p><strong>${word("destination")}:</strong> ${escapeHtml(state.selectedTrip.destination || "")}</p>
          <p><strong>${word("fare")}:</strong> ${money(state.selectedTrip.fare)} · <strong>${word("payment")}:</strong> ${word(state.selectedTrip.payment || "card")}</p>
        </div>
        <div>
          <p><strong>${word("rider")}:</strong> ${escapeHtml(state.selectedTrip.rider || "N/A")}</p>
          <p><strong>${word("driver")}:</strong> ${escapeHtml(state.selectedTrip.driver || "Unassigned")}</p>
          <p><strong>Status:</strong> <span class="pill ${state.selectedTrip.status || ""}">${word(state.selectedTrip.status || "")}</span></p>
        </div>
      </div>
    </div>
  ` : "";

  return `
    ${fleetMap()}
    <div class="legend">
      <div class="legend-item"><span class="legend-dot available"></span> ${t("available")}</div>
      <div class="legend-item"><span class="legend-dot en_route"></span> ${t("en_route")}</div>
      <div class="legend-item"><span class="legend-dot on_trip"></span> ${t("on_trip")}</div>
      <div class="legend-item"><span class="legend-dot offline"></span> ${t("offline")}</div>
    </div>
    ${tripDetailsModal}
    <article class="panel" style="margin-top:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="margin:0;">${t("trips")}</h3>
        <span class="live-badge"><span class="live-dot"></span> Live</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${word("reference")}</th>
              <th>${word("status")}</th>
              <th>${word("rider")}</th>
              <th>${word("origin")} / ${word("destination")}</th>
              <th>${word("fare")}</th>
            </tr>
          </thead>
          <tbody id="fleet-trips-body">
            ${renderFleetTripRows(state.items)}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function fleetMap() {
  return `<div id="fleet-map"></div>`;
}

function miniTable(key) {
  const screenItem = state.bootstrap.catalog.screens.find((item) => item.key === key);
  const rows = state.items.filter((item) => item.resource === key).slice(0, 5);
  if (!rows.length) return `<p class="muted">${t("empty")}</p>`;
  return `<table><tbody>${rows
    .map((row) => `<tr><td>${row.reference || row.name}</td><td>${row.status || ""}</td><td>${row.fare ? money(row.fare) : ""}</td></tr>`)
    .join("")}</tbody></table>`;
}

function registry(current) {
  const columns = current.fields;
  const statusFilter = current.key === "trips" ? `<select id="status-filter"><option value="">${t("all")}</option>${["requested", "accepted", "arriving", "in_progress", "completed", "cancelled"].map((status) => `<option value="${status}" ${state.tripStatus === status ? "selected" : ""}>${word(status)}</option>`).join("")}</select>` : "";
  const rows = current.key === "trips" && state.tripStatus ? state.items.filter((item) => item.status === state.tripStatus) : state.items;
  return `<div class="toolbar"><input id="filter" placeholder="${t("search")}" value="${escapeHtml(state.query)}" />${statusFilter}<button class="primary" id="create">${t("new")}</button></div>
    ${rows.length ? `<div class="table-wrap"><table><thead><tr>${columns.map((field) => `<th>${label(current, field)}</th>`).join("")}<th></th></tr></thead><tbody>
      ${rows
        .map(
          (row) => `<tr>${columns.map((field) => `<td>${pill(field, row)}</td>`).join("")}<td class="row-actions"><button class="ghost" data-edit="${row.id}">${t("edit")}</button><button class="ghost" data-delete="${row.id}">${t("delete")}</button></td></tr>`
        )
        .join("")}
    </tbody></table></div>` : `<article class="panel">${t("empty")}</article>`}`;
}

function settingsView(current) {
  const record = state.items[0] || {};
  return `<form class="panel" id="settings-form">${formFields(current, record)}<button class="primary" type="button" id="save-settings">${t("save")}</button></form>`;
}

function languageView() {
  const on = state.bootstrap.settings.portugueseEnabled;
  return `<article class="panel"><h2>${t("portuguese")}</h2><p>${t("portugueseHelp")}</p><div class="switch"><strong>${on ? t("enabled") : t("disabled")}</strong><button class="primary" id="toggle-language">${on ? "Off" : "On"}</button></div></article>`;
}

function importView() {
  return `<article class="panel"><p>${t("importHelp")}</p><textarea id="csv"></textarea><button class="primary" id="run-import">${t("import")}</button></article>`;
}

function bulkView(current) {
  return `<article class="panel"><label>${t("documents")}</label><textarea id="documents"></textarea><button class="primary" id="run-bulk" data-mode="${current.key === "bulk-unblock" ? "unblock" : "block"}">${t("apply")}</button></article>`;
}

function dangerView(current) {
  return `<article class="panel"><p>${titleOf(current)}</p><button class="danger" id="run-danger" data-action="${current.key}">${t("apply")}</button></article>`;
}

function reportView() {
  return `<article class="panel"><label>Name</label><input id="report-name" /><label>Source</label><select id="report-source"><option>trips</option><option>drivers</option><option>riders</option><option>delivery-orders</option></select><button class="primary" id="run-report">${t("run")}</button></article>`;
}

function mapTestView() {
  return `<article class="panel"><label>Origin</label><input id="origin" /><label>Destination</label><input id="destination" /><button class="primary" id="run-map">${t("test")}</button><p id="map-result"></p></article>`;
}

function label(_current, field) {
  return word(field.key);
}

function pill(field, row) {
  const text = fieldValue(row, field);
  if (["status", "presence", "active"].includes(field.key)) return `<span class="pill ${row[field.key] || ""}">${text}</span>`;
  return escapeHtml(String(text));
}

function drawer(current) {
  const body = state.drawer.password
    ? `<h2>${t("changePassword")}</h2><label>${t("current")}</label><input name="current" type="password" /><label>${t("next")}</label><input name="next" type="password" />`
    : `<h2>${state.drawer.id ? t("edit") : t("new")}</h2>${formFields(current, state.drawer)}`;
  return `<div class="drawer-back"><form class="drawer" id="record-form">${body}<div class="row-actions"><button class="primary" type="submit">${t("save")}</button><button class="ghost" type="button" id="close-drawer">${t("close")}</button></div></form></div>`;
}

function formFields(current, record) {
  return current.fields
    .map((field) => {
      const raw = record?.[field.key] ?? "";
      const value = field.type === "money" ? ((Number(raw) || 0) / 100).toFixed(2) : raw;
      if (field.type === "textarea") return `<label>${word(field.key)}</label><textarea name="${field.key}">${escapeHtml(value)}</textarea>`;
      if (field.type === "select") return `<label>${word(field.key)}</label><select name="${field.key}">${field.options.map((option) => `<option value="${option}" ${option === raw ? "selected" : ""}>${word(option)}</option>`).join("")}</select>`;
      const type = field.type === "number" || field.type === "money" ? "number" : field.type === "email" ? "email" : "text";
      const step = field.type === "money" ? "0.01" : "any";
      return `<label>${word(field.key)}</label><input name="${field.key}" type="${type}" step="${step}" value="${escapeHtml(value)}" />`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function payloadFrom(form, current) {
  const data = Object.fromEntries(new FormData(form));
  current.fields.forEach((field) => {
    if (field.type === "money") data[field.key] = Math.round(Number(data[field.key] || 0) * 100);
    if (field.type === "number") data[field.key] = Number(data[field.key] || 0);
  });
  return data;
}

function bindShell(current) {
  document.querySelectorAll("[data-path]").forEach((button) => (button.onclick = () => go(button.dataset.path)));
  document.querySelectorAll("[data-menu]").forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.menu;
      state.openMenus = state.openMenus.includes(id) ? state.openMenus.filter((item) => item !== id) : [...state.openMenus, id];
      state.menu = true;
      render();
    };
  });
  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.onclick = () => {
      state.locale = button.dataset.locale;
      sessionStorage.setItem("movy-locale", state.locale);
      render();
    };
  });
  const menu = document.getElementById("open-menu");
  if (menu) menu.onclick = () => {
    state.menu = !state.menu;
    render();
  };
  document.getElementById("logout").onclick = async () => {
    await api("/api/logout", { method: "POST", body: {} }).catch(() => {});
    state.token = "";
    sessionStorage.removeItem("movy-token");
    render();
  };
  document.getElementById("cache").onclick = async () => {
    await api("/api/actions/clear-cache", { method: "POST", body: {} });
    state.notice = t("saved");
    render();
  };
  document.getElementById("password").onclick = () => {
    state.drawer = { password: true };
    render();
  };
  const filter = document.getElementById("filter");
  if (filter) {
    filter.oninput = async (event) => {
      state.query = event.target.value;
      await loadItems();
      render();
      document.getElementById("filter")?.focus();
    };
  }
  const statusFilter = document.getElementById("status-filter");
  if (statusFilter) {
    statusFilter.onchange = (event) => {
      state.tripStatus = event.target.value;
      render();
    };
  }
  const create = document.getElementById("create");
  if (create) create.onclick = () => {
    state.drawer = {};
    render();
  };
  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.onclick = () => {
      state.drawer = state.items.find((item) => item.id === button.dataset.edit);
      render();
    };
  });
  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.onclick = async () => {
      await api(`/api/resources/${current.key}/${button.dataset.delete}`, { method: "DELETE" });
      await loadItems();
      render();
    };
  });
  const form = document.getElementById("record-form");
  if (form && state.drawer?.password) {
    form.onsubmit = async (event) => {
      event.preventDefault();
      const body = Object.fromEntries(new FormData(form));
      try {
        await api("/api/account/password", { method: "POST", body });
        state.drawer = null;
        state.notice = t("saved");
        state.error = "";
      } catch (error) {
        state.error = error.message;
      }
      render();
    };
  } else if (form) {
    form.onsubmit = async (event) => {
      event.preventDefault();
      const body = payloadFrom(form, current);
      if (state.drawer.id) await api(`/api/resources/${current.key}/${state.drawer.id}`, { method: "PATCH", body });
      else await api(`/api/resources/${current.key}`, { method: "POST", body });
      state.drawer = null;
      await loadItems();
      render();
    };
  }
  const close = document.getElementById("close-drawer");
  if (close) close.onclick = () => {
    state.drawer = null;
    render();
  };
  const saveSettings = document.getElementById("save-settings");
  if (saveSettings) {
    saveSettings.onclick = async () => {
      const body = payloadFrom(document.getElementById("settings-form"), current);
      if (state.items[0]?.id) await api(`/api/resources/${current.key}/${state.items[0].id}`, { method: "PATCH", body });
      else await api(`/api/resources/${current.key}`, { method: "POST", body });
      state.notice = t("saved");
      await loadItems();
      render();
    };
  }
  const toggle = document.getElementById("toggle-language");
  if (toggle) {
    toggle.onclick = async () => {
      const settings = await api("/api/settings", { method: "PATCH", body: { portugueseEnabled: !state.bootstrap.settings.portugueseEnabled } });
      state.bootstrap.settings = settings;
      if (!settings.portugueseEnabled) state.locale = "en";
      render();
    };
  }
  const runImport = document.getElementById("run-import");
  if (runImport) {
    runImport.onclick = async () => {
      const target = current.key === "import-drivers" ? "drivers" : "riders";
      const result = await api(`/api/import/${target}`, { method: "POST", body: { csv: document.getElementById("csv").value } });
      state.notice = `${result.count}`;
      render();
    };
  }
  const runBulk = document.getElementById("run-bulk");
  if (runBulk) {
    runBulk.onclick = async () => {
      const result = await api("/api/actions/bulk-drivers", { method: "POST", body: { documents: document.getElementById("documents").value, mode: runBulk.dataset.mode } });
      state.notice = `${result.count}`;
      render();
    };
  }
  const runDanger = document.getElementById("run-danger");
  if (runDanger) {
    runDanger.onclick = async () => {
      if (!confirm(t("confirmReset"))) return;
      const action = runDanger.dataset.action === "reset-rating" ? "reset-ratings" : "reset-balances";
      await api(`/api/actions/${action}`, { method: "POST", body: {} });
      state.notice = t("saved");
      render();
    };
  }
  const runReport = document.getElementById("run-report");
  if (runReport) {
    runReport.onclick = async () => {
      await api("/api/reports/run", { method: "POST", body: { name: document.getElementById("report-name").value, source: document.getElementById("report-source").value } });
      state.notice = t("saved");
      go("/reports");
    };
  }
  const runMap = document.getElementById("run-map");
  if (runMap) {
    runMap.onclick = async () => {
      try {
        const result = await api("/api/maps/test", { method: "POST", body: { origin: document.getElementById("origin").value, destination: document.getElementById("destination").value } });
        document.getElementById("map-result").textContent = `${result.provider} · ${result.distanceKm} km · ${result.durationMin} min`;
      } catch (error) {
        document.getElementById("map-result").textContent = error.message;
      }
    };
  }
  const toggleAudio = document.getElementById("toggle-audio");
  if (toggleAudio) {
    toggleAudio.onclick = () => {
      state.audioEnabled = !state.audioEnabled;
      localStorage.setItem("movy-audio", state.audioEnabled);
      render();
      if (state.audioEnabled) playDispatchBeep();
    };
  }
  const closeTrip = document.getElementById("close-selected-trip");
  if (closeTrip) {
    closeTrip.onclick = () => {
      state.selectedTrip = null;
      render();
    };
  }
  document.querySelectorAll("[data-focus-trip]").forEach((row) => {
    row.onclick = () => {
      const tripId = row.dataset.focusTrip;
      state.selectedTrip = state.items.find((item) => (item.id === tripId || item.reference === tripId));
      render();
    };
  });
  const fleetMapNode = document.getElementById("fleet-map");
  if (fleetMapNode && window.L) {
    if (activeMapInstance) {
      activeMapInstance.remove();
      activeMapInstance = null;
      activeMapMarkers.clear();
    }
    const franchise = state.bootstrap?.user?.franchise?.id;
    const center = franchise === "orlando" ? [28.5383, -81.3792] : [25.7743, -80.1937];
    const map = window.L.map(fleetMapNode).setView(center, 12);
    activeMapInstance = map;
    const night = document.body.dataset.map === "night";
    window.L.tileLayer(
      night ? "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" : "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: night ? "CARTO" : "OpenStreetMap", maxZoom: 18 }
    ).addTo(map);

    state.fleet.forEach((driver) => {
      if (driver.lat == null || driver.lng == null) return;
      const icon = window.L.divIcon({
        className: "movy-marker-container",
        html: carIconHtml(driver.presence),
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -18],
      });
      const marker = window.L.marker([driver.lat, driver.lng], { icon })
        .addTo(map)
        .bindPopup(driverPopupHtml(driver));
      activeMapMarkers.set(driver.id || driver.name, marker);
    });
  }
  if (corePath[current.key]) {
    bindCore({ api, state }, current, async () => {
      await loadItems();
      render();
    });
  }
  const navSearch = document.getElementById("nav-search");
  if (navSearch) {
    navSearch.oninput = (event) => {
      state.navQuery = event.target.value;
      render();
      const next = document.getElementById("nav-search");
      next.focus();
      next.setSelectionRange(state.navQuery.length, state.navQuery.length);
    };
  }
}

async function loadItems() {
  const current = screen();
  if (["dashboard", "fleet", "language", "import", "bulk", "danger", "report"].includes(current.view)) {
    if (current.view === "dashboard") {
      state.metrics = await api("/api/metrics");
      state.fleet = (await api("/api/fleet")).drivers;
      const trips = await api("/api/trips");
      state.items = trips.items.map((item) => ({ ...item, resource: "trips" }));
    }
    if (current.view === "fleet") {
      state.fleet = (await api("/api/fleet")).drivers;
      const trips = await api("/api/trips");
      state.items = trips.items;
    }
    return;
  }
  if (corePath[current.key]) {
    const path = current.key === "driver-production" ? `${corePath[current.key]}?cityId=${encodeURIComponent(state.productionCity || "")}` : `${corePath[current.key]}?q=${encodeURIComponent(state.query)}`;
    const data = await api(path);
    state.items = data.items || [];
    state.routeBookings = data.bookings || [];
    state.managerEarnings = data.earnings || [];
    state.promotionGrants = data.grants || [];
    state.webhookDeliveries = data.deliveries || [];
    if (current.key === "map-keys") state.mapKey = data;
    state.lookups = await api("/api/lookups");
    return;
  }
  const key = current.key;
  if (current.view === "map-test") return;
  const data = await api(`/api/resources/${key}?q=${encodeURIComponent(state.query)}`);
  state.items = data.items;
}

function startLiveSync() {
  if (liveSyncTimer) clearInterval(liveSyncTimer);
  liveSyncTimer = setInterval(async () => {
    if (!state.token || !state.bootstrap) return;
    if (state.path === "/fleet" || state.path === "/") {
      try {
        const fleetData = await api("/api/fleet");
        state.fleet = fleetData.drivers || [];
        if (activeMapInstance && activeMapMarkers.size) {
          state.fleet.forEach((driver) => {
            const key = driver.id || driver.name;
            const marker = activeMapMarkers.get(key);
            if (marker && driver.lat != null && driver.lng != null) {
              marker.setLatLng([driver.lat, driver.lng]);
            }
          });
        }
        const tripsData = await api("/api/trips");
        const currentCount = tripsData.items?.length || 0;
        if (state.lastTripCount > 0 && currentCount > state.lastTripCount) {
          playDispatchBeep();
        }
        state.lastTripCount = currentCount;

        if (state.path === "/fleet") {
          state.items = tripsData.items || [];
          const tripBody = document.getElementById("fleet-trips-body");
          if (tripBody) {
            tripBody.innerHTML = renderFleetTripRows(state.items);
            document.querySelectorAll("[data-focus-trip]").forEach((row) => {
              row.onclick = () => {
                const tripId = row.dataset.focusTrip;
                state.selectedTrip = state.items.find((item) => item.id === tripId || item.reference === tripId);
                render();
              };
            });
          }
        }
        if (state.path === "/") {
          state.metrics = await api("/api/metrics");
          const m = state.metrics || {};
          const mToday = document.getElementById("m-today-trips");
          if (mToday) mToday.textContent = m.todayTrips || 0;
          const mRev = document.getElementById("m-today-revenue");
          if (mRev) mRev.textContent = money(m.todayRevenue);
          const mAct = document.getElementById("m-active-vehicles");
          if (mAct) mAct.textContent = m.activeVehicles || 0;
        }
      } catch (_) {}
    }
  }, 5000);
}

async function load() {
  state.bootstrap = await api("/api/bootstrap");
  if (!state.bootstrap.settings.portugueseEnabled) state.locale = "en";
  await loadItems();
  state.lastTripCount = (state.items || []).length;
  render();
  startLiveSync();
}

window.onpopstate = () => {
  state.path = location.pathname;
  loadItems().then(render);
};

if (state.token) load().catch(() => render());
else render();
