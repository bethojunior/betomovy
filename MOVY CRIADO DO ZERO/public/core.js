export const corePath = {
  riders: "/api/customers",
  companies: "/api/companies",
  drivers: "/api/drivers",
  "driver-signup": "/api/drivers",
  trips: "/api/trips",
  tariffs: "/api/trip-types",
  cities: "/api/cities",
  "edit-city": "/api/cities",
  "driver-production": "/api/driver-production",
  "vehicle-changes": "/api/vehicle-changes",
  "driver-documents": "/api/driver-documents",
  "rider-deletions": "/api/account-deletions/customer",
  "driver-deletions": "/api/account-deletions/driver",
  commissions: "/api/commissions",
  ledger: "/api/ledger",
  payouts: "/api/payouts",
  "cancellation-fees": "/api/cancellation-fees",
  credits: "/api/credits",
  "tariff-flags": "/api/tariff-flags",
  "tariff-triggers": "/api/tariff-triggers",
  "dynamic-areas": "/api/dynamic-areas",
  tolls: "/api/tolls",
  coupons: "/api/coupons",
  radius: "/api/call-radius",
  "map-keys": "/api/map-keys",
  "delivery-orders": "/api/delivery/orders",
  "establishment-categories": "/api/delivery/categories",
  establishments: "/api/delivery/establishments",
  "delivery-zones": "/api/delivery/zones",
  "freight-items": "/api/freight/items",
  "freight-register": "/api/freight/quotes",
  "freight-extras": "/api/freight/extras",
  "freight-access": "/api/freight/access",
  "call-groups": "/api/call-groups",
  "call-group-drivers": "/api/call-group-drivers",
  "cancel-reasons": "/api/cancel-reasons",
  "payment-methods": "/api/payment-methods",
  penalties: "/api/penalties",
  modules: "/api/modules",
  vouchers: "/api/vouchers",
  "risk-areas": "/api/risk-areas",
  "route-items": "/api/route-items",
  "route-register": "/api/routes",
  routes: "/api/routes",
  "route-drivers": "/api/route-drivers",
  "route-banners": "/api/route-banners",
  managers: "/api/managers",
  "manager-drivers": "/api/manager-drivers",
  partners: "/api/partners",
  "partner-messages": "/api/partner-messages",
  "trip-promotions": "/api/trip-promotions",
  ads: "/api/ads",
  "external-links": "/api/external-links",
  "app-ads": "/api/app-ads",
  "app-ad-create": "/api/app-ads",
  "support-riders": "/api/support/rider",
  "support-trips": "/api/support/trip",
  notifications: "/api/notifications",
  roles: "/api/roles",
  staff: "/api/staff",
  centrals: "/api/centrals",
  "central-users": "/api/central-users",
  neighborhoods: "/api/neighborhoods",
  "central-settings": "/api/central-settings",
  reports: "/api/reports",
  places: "/api/places",
  "irregular-addresses": "/api/irregular-addresses",
  "address-cache": "/api/address-cache",
  "heat-areas": "/api/heat-areas",
  "monitoring-areas": "/api/monitoring-areas",
  "map-sequencer": "/api/map-sequence",
  birthdays: "/api/birthdays",
  "whatsapp-session": "/api/whatsapp/session",
  "whatsapp-keys": "/api/whatsapp/keys",
  "whatsapp-scheduled": "/api/whatsapp/notices",
  smtp: "/api/smtp/outbox",
  "confirmation-codes": "/api/confirmation-codes",
  terms: "/api/terms",
  firebase: "/api/firebase",
  versions: "/api/versions",
  "app-config": "/api/app-config",
  "delivery-general": "/api/delivery-settings",
  "driver-registration": "/api/driver-signup-config",
  "delivery-sections": "/api/delivery/sections",
  "delivery-accessories": "/api/delivery/accessories",
  "delivery-finance": "/api/delivery/settlements",
  "delivery-configuration": "/api/delivery/config",
  asaas: "/api/delivery/asaas",
  "delivery-calls": "/api/delivery/calls",
  acquirer: "/api/acquirer",
  "acquirer-cities": "/api/acquirer/cities",
  "acquirer-dashboard": "/api/acquirer/transactions",
  "acquirer-transactions": "/api/acquirer/transactions",
  "acquirer-reports": "/api/acquirer/transactions",
  dispatch: "/api/dispatch",
  "finance-reports": "/api/finance-reports",
  "admin-alerts": "/api/admin-alerts",
  "external-services": "/api/external-services",
  "external-city": "/api/external-city-services",
  webhooks: "/api/webhooks",
  "app-documents": "/api/app-documents",
  "documents-by-category": "/api/document-requirements",
  "rider-documents": "/api/app-documents",
  phones: "/api/phones",
  "usage-policy": "/api/usage-policy",
  "driver-chat": "/api/driver-chat",
  "suggestion-text": "/api/suggestions",
  "app-keys": "/api/app-keys",
  credentials: "/api/credentials",
  "city-settings": "/api/city-settings",
  additional: "/api/additional-settings",
  "partner-apps": "/api/partner-apps",
  services: "/api/services",
  "delivery-items": "/api/delivery-items",
  logs: "/api/logs",
  "map-general": "/api/map-general",
  "map-cities": "/api/map-cities",
  "route-optimization": "/api/route-optimizations",
  layout: "/api/layout",
};

const dollars = (cents) => ((Number(cents) || 0) / 100).toFixed(2);
const options = (rows, selected, label) =>
  rows.map((row) => `<option value="${row.id}" ${row.id === selected ? "selected" : ""}>${label(row)}</option>`).join("");

export function renderCore(ui, current) {
  const { t, money, word, escapeHtml, state } = ui;
  const rows = state.items || [];
  const look = state.lookups || { cities: [], customers: [], drivers: [], companies: [], tripTypes: [], trips: [], establishments: [], categories: [], deliveryAccessories: [], deliverySections: [], staff: [] };
  const citySelect = (selected) => `<label>City</label><select name="cityId"><option value="">${t("all")}</option>${options(look.cities, selected, (city) => `${city.name} - ${city.state}`)}</select>`;
  if (current.key === "driver-production") {
    return `<div class="toolbar"><select id="production-city"><option value="">${t("all")}</option>${options(look.cities, state.productionCity, (city) => city.name)}</select></div>
      <table><thead><tr><th>Driver</th><th>Trips</th><th>Gross</th><th>Commission</th><th>Net</th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${row.trips}</td><td>${money(row.gross)}</td><td>${money(row.commission)}</td><td>${money(row.net)}</td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "cities" || current.key === "edit-city") {
    const form = `<form class="panel" id="city-form"><label>Name</label><input name="name" required /><label>State</label><input name="state" required /><label>Country</label><input name="country" value="United States" /><label>Timezone</label><input name="timezone" value="America/New_York" /><button class="primary">${t("save")}</button></form>`;
    const table = `<table><thead><tr><th>Name</th><th>State</th><th>Timezone</th><th></th></tr></thead><tbody>${rows
      .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.state)}</td><td>${escapeHtml(row.timezone)}</td><td><button class="ghost" data-city-edit="${row.id}">${t("edit")}</button></td></tr>`)
      .join("")}</tbody></table>`;
    return current.key === "cities" ? form + table : table + form;
  }
  if (current.key === "riders") {
    return `<form class="panel" id="customer-form">${citySelect()}<label>Name</label><input name="name" required /><label>Phone</label><input name="phone" /><label>Email</label><input name="email" type="email" /><label>Document</label><input name="document" /><label>Status</label><select name="status"><option value="active">Active</option><option value="pending">Pending</option><option value="blocked">Blocked</option></select><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Document</th><th>City</th><th>Balance</th><th>Status</th><th></th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.phone || "")}</td><td>${escapeHtml(row.email || "")}</td><td>${escapeHtml(row.document || "")}</td><td>${escapeHtml(row.city || "")}</td><td>${money(row.balance)}</td><td>${word(row.status)}</td><td><button class="ghost" data-customer-edit="${row.id}">${t("edit")}</button></td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "companies") {
    return `<form class="panel" id="company-form">${citySelect()}<label>Legal name</label><input name="name" required /><label>Trade name</label><input name="tradeName" /><label>Document</label><input name="document" /><label>Email</label><input name="email" /><label>Phone</label><input name="phone" /><label>Address</label><input name="address" /><label>Credit limit USD</label><input name="creditLimit" type="number" step="0.01" value="0" /><label>Status</label><select name="status"><option value="active">Active</option><option value="pending">Pending</option><option value="blocked">Blocked</option></select><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Legal name</th><th>Trade name</th><th>Document</th><th>City</th><th>Balance</th><th>Credit limit</th><th>Status</th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.tradeName || "")}</td><td>${escapeHtml(row.document || "")}</td><td>${escapeHtml(row.city || "")}</td><td>${money(row.balance)}</td><td>${money(row.creditLimit)}</td><td>${word(row.status)}</td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "drivers" || current.key === "driver-signup") {
    const visible = current.key === "driver-signup" ? rows.filter((row) => row.status === "pending") : rows;
    const docLabel = state.locale === "pt" ? "Documento (CPF / ID)" : "Document (SSN / Tax ID)";
    const licenseLabel = state.locale === "pt" ? "CNH" : "Driver's License (DL)";
    return `<form class="panel" id="driver-form">${citySelect()}<label>Name</label><input name="name" required /><label>Phone</label><input name="phone" /><label>Email</label><input name="email" type="email" /><label>${docLabel}</label><input name="document" /><label>${licenseLabel}</label><input name="cnh" /><label>Vehicle</label><input name="vehicle" /><label>Plate</label><input name="plate" /><label>Service</label><select name="service"><option value="private">Private</option><option value="delivery">Delivery</option></select><label>Presence</label><select name="presence"><option value="offline">Offline</option><option value="available">Available</option></select><input type="hidden" name="status" value="${current.key === "driver-signup" ? "pending" : "approved"}" /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Vehicle</th><th>Plate</th><th>${licenseLabel}</th><th>Rating</th><th>Balance</th><th>Presence</th><th>Status</th><th></th></tr></thead><tbody>${visible
        .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.phone || "")}</td><td>${escapeHtml(row.city || "")}</td><td>${escapeHtml(row.vehicle || "")}</td><td>${escapeHtml(row.plate || "")}</td><td>${escapeHtml(row.cnh || "")}</td><td>${row.rating}</td><td>${money(row.balance)}</td><td>${word(row.presence)}</td><td>${word(row.status)}</td><td><button class="ghost" data-driver-edit="${row.id}">${t("edit")}</button></td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "tariffs") {
    return `<form class="panel" id="tariff-form">${citySelect()}<label>Name</label><input name="name" required /><label>Base USD</label><input name="base" type="number" step="0.01" required /><label>Per km USD</label><input name="perKm" type="number" step="0.01" required /><label>Per minute USD</label><input name="perMin" type="number" step="0.01" required /><label>Minimum USD</label><input name="minimum" type="number" step="0.01" required /><label>Tax USD</label><input name="tax" type="number" step="0.01" value="0" /><label>Seats</label><input name="seats" type="number" value="4" /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>City</th><th>Name</th><th>Base</th><th>Per km</th><th>Per minute</th><th>Minimum</th><th>Seats</th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${money(row.base)}</td><td>${money(row.perKm)}</td><td>${money(row.perMin)}</td><td>${money(row.minimum)}</td><td>${row.seats}</td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "trips") {
    return `<form class="panel" id="trip-form"><label>Customer</label><select name="customerId">${options(look.customers, "", (row) => row.name)}</select><label>Driver</label><select name="driverId"><option value=""></option>${options(look.drivers, "", (row) => row.name)}</select><label>Trip type</label><select name="tripTypeId">${options(look.tripTypes, "", (row) => `${row.city} · ${row.name}`)}</select><label>Origin</label><input name="origin" required /><label>Destination</label><input name="destination" required /><label>Distance km</label><input name="distanceKm" type="number" step="0.1" required /><label>Duration min</label><input name="durationMin" type="number" step="1" required /><label>Origin latitude</label><input name="originLat" type="number" step="0.0001" /><label>Origin longitude</label><input name="originLng" type="number" step="0.0001" /><label>Coupon</label><input name="coupon" /><label>Payment</label><select name="payment"><option value="card">Card</option><option value="cash">Cash</option><option value="wallet">Wallet</option><option value="invoice">Invoice</option></select><label>Central</label><select name="centralId"><option value=""></option>${options(look.centrals || [], "", (row) => `${row.name} · ${row.city}`)}</select><label>Neighborhood</label><select name="neighborhoodId"><option value=""></option>${options(look.neighborhoods || [], "", (row) => `${row.name} · ${money(row.flatFare)}`)}</select><label>Round trip</label><select name="roundTrip"><option value="no">No</option><option value="yes">Yes</option></select><label>Finished by</label><select name="finishedBy"><option value="driver">Driver</option><option value="central">Central</option></select><label>Status</label><select name="status"><option value="requested">Requested</option><option value="accepted">Accepted</option><option value="arriving">Arriving</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Canceled</option></select><p class="hint">The fare is calculated from the trip type. It is not typed.</p><button class="primary">${t("save")}</button></form>
      <div class="toolbar"><select id="status-filter"><option value="">${t("all")}</option>${["requested", "accepted", "arriving", "in_progress", "completed", "cancelled"].map((status) => `<option value="${status}" ${state.tripStatus === status ? "selected" : ""}>${word(status)}</option>`).join("")}</select></div>
      <table><thead><tr><th>Reference</th><th>Rider</th><th>Driver</th><th>Type</th><th>Origin</th><th>Destination</th><th>Km</th><th>Fare</th><th>Payment</th><th>Status</th></tr></thead><tbody>${rows
        .filter((row) => !state.tripStatus || row.status === state.tripStatus)
        .map((row) => `<tr><td>${escapeHtml(row.reference)}</td><td>${escapeHtml(row.rider || "")}</td><td>${escapeHtml(row.driver || "")}</td><td>${escapeHtml(row.tripType || "")}</td><td>${escapeHtml(row.origin)}</td><td>${escapeHtml(row.destination)}</td><td>${row.distanceKm}</td><td>${money(row.fare)}</td><td>${word(row.payment)}</td><td>${word(row.status)}</td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "vehicle-changes") {
    return `<form class="panel" id="vehicle-form"><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => row.name)}</select><label>Requested vehicle</label><input name="requestedVehicle" required /><label>Plate</label><input name="plate" required /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Driver</th><th>Current</th><th>Requested</th><th>Plate</th><th>Status</th><th></th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${escapeHtml(row.currentVehicle || "")}</td><td>${escapeHtml(row.requestedVehicle)}</td><td>${escapeHtml(row.plate)}</td><td>${word(row.status)}</td><td>${row.status === "pending" ? `<button class="ghost" data-vehicle="${row.id}" data-decision="approved">Approve</button><button class="ghost" data-vehicle="${row.id}" data-decision="rejected">Reject</button>` : ""}</td></tr>`)
        .join("")}</tbody></table>`;
  }
  if (current.key === "driver-documents") {
    const docModal = state.docPreview ? `
      <div class="modal-overlay" id="close-doc-modal">
        <div class="modal-card" onclick="event.stopPropagation()">
          <h3>${state.locale === "pt" ? "Conferência de Documento" : "Document Verification"}</h3>
          <p><strong>${t("driver")}:</strong> ${escapeHtml(state.docPreview.driver)}</p>
          <p><strong>${t("documents")}:</strong> ${escapeHtml(state.docPreview.document)}</p>
          <div class="doc-preview-box">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            <p style="margin:0;font-size:14px;color:#04f3fa;font-weight:700;">MOVY OFFICIAL VERIFIED ATTACHMENT</p>
            <p style="margin:4px 0 0;font-size:12px;color:#8194ad;">Format: PDF/IMAGE Secure Hash: SHA-256 Validated</p>
          </div>
          <div class="row-actions" style="margin-top:20px;justify-content:flex-end;">
            <button class="ghost" id="dismiss-doc-modal">${t("close")}</button>
            <button class="primary" data-doc-action="approved" data-doc-id="${state.docPreview.id}">${state.locale === "pt" ? "Aprovar Documento" : "Approve Document"}</button>
            <button class="danger" data-doc-action="rejected" data-doc-id="${state.docPreview.id}">${state.locale === "pt" ? "Reprovar Documento" : "Reject Document"}</button>
          </div>
        </div>
      </div>
    ` : "";
    return `<form class="panel" id="document-form"><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => row.name)}</select><label>Document</label><input name="document" required /><label>Due</label><input name="dueAt" type="date" /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Driver</th><th>Document</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${rows
        .map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${escapeHtml(row.document)}</td><td>${escapeHtml(row.dueAt || "")}</td><td>${word(row.status)}</td><td class="row-actions"><button class="ghost" data-preview-doc="${row.id}" data-driver="${escapeHtml(row.driver)}" data-document="${escapeHtml(row.document)}">🔍 View</button><button class="ghost" data-document="${row.id}" data-review="approved">Approve</button><button class="ghost" data-document="${row.id}" data-review="rejected">Reject</button></td></tr>`)
        .join("")}</tbody></table>${docModal}`;
  }
  if (current.key === "tariff-flags") {
    return `<form class="panel" id="flag-form">${citySelect()}<label>Name</label><input name="name" required /><label>Multiplier</label><input name="multiplier" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${row.multiplier}x</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "tariff-triggers") {
    return `<form class="panel" id="trigger-form">${citySelect()}<label>Name</label><input name="name" required /><label>From</label><input name="startsAt" type="time" required /><label>Until</label><input name="endsAt" type="time" required /><label>Multiplier</label><input name="multiplier" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${row.startsAt}–${row.endsAt}</td><td>${row.multiplier}x</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "dynamic-areas") {
    return `<form class="panel" id="surge-form">${citySelect()}<label>Name</label><input name="name" required /><label>Latitude</label><input name="latitude" type="number" step="0.0001" required /><label>Longitude</label><input name="longitude" type="number" step="0.0001" required /><label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><label>Multiplier</label><input name="multiplier" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${row.radiusKm} km</td><td>${row.multiplier}x</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "tolls") {
    return `<form class="panel" id="toll-form">${citySelect()}<label>Name</label><input name="name" required /><label>Amount USD</label><input name="amount" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${money(row.amount)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "coupons") {
    return `<form class="panel" id="coupon-form">${citySelect()}<label>Code</label><input name="code" required /><label>Kind</label><select name="kind"><option value="fixed">Fixed USD</option><option value="percent">Percent</option></select><label>Value</label><input name="value" type="number" step="0.01" required /><label>Max USD</label><input name="maxValue" type="number" step="0.01" value="0" /><label>Payment</label><select name="payment"><option value="any">Any</option><option value="card">Card</option><option value="cash">Cash</option><option value="wallet">Wallet</option></select><label>Valid until</label><input name="validUntil" type="date" /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.city || "Any")}</td><td>${row.kind === "percent" ? `${row.percent}%` : money(row.fixed)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "radius") {
    return `<form class="panel" id="radius-form">${citySelect()}<label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${row.radiusKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "freight-items" || current.key === "freight-register") {
    const quote = current.key === "freight-register"
      ? `<form class="panel" id="freight-quote-form"><label>Item</label><select name="itemId">${options(look.freightItems || [], "", (row) => row.name)}</select><label>Extra</label><select name="extraId"><option value=""></option>${options(look.freightExtras || [], "", (row) => row.name)}</select><label>Floors</label><input name="floors" type="number" min="0" value="0" /><button class="primary">Quote</button></form>
        <table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.item)}</td><td>${escapeHtml(row.extra || "")}</td><td>${row.floors} floors</td><td>${money(row.total)}</td></tr>`).join("")}</tbody></table>`
      : "";
    const editor = `<form class="panel" id="freight-item-form"><label>Name</label><input name="name" required /><label>Height cm</label><input name="heightCm" type="number" step="0.1" /><label>Width cm</label><input name="widthCm" type="number" step="0.1" /><label>Depth cm</label><input name="depthCm" type="number" step="0.1" /><label>Weight kg</label><input name="weightKg" type="number" step="0.1" /><label>Price USD</label><input name="price" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form>
      <table><tbody>${(current.key === "freight-items" ? rows : look.freightItems || []).map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.heightCm}×${row.widthCm}×${row.depthCm} cm</td><td>${row.weightKg} kg</td><td>${money(row.price)}</td></tr>`).join("")}</tbody></table>`;
    return current.key === "freight-register" ? quote : editor;
  }
  if (current.key === "freight-extras") {
    return `<form class="panel" id="freight-extra-form"><label>Name</label><input name="name" required /><label>Price USD</label><input name="price" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${money(row.price)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "freight-access") {
    return `<form class="panel" id="freight-access-form"><label>Name</label><input name="name" required /><label>Price per floor USD</label><input name="pricePerFloor" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${money(row.pricePerFloor)} / floor</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-orders") {
    return `<form class="panel" id="order-form"><label>Establishment</label><select name="establishmentId">${options(look.establishments.filter((item) => item.status === "open"), "", (row) => row.name)}</select><label>Customer</label><select name="customerId">${options(look.customers, "", (row) => row.name)}</select><label>Accessory</label><select name="accessoryId"><option value="">None</option>${options((look.deliveryAccessories || []).filter((item) => item.active), "", (row) => row.name)}</select><label>Address</label><input name="address" required /><label>Latitude</label><input name="latitude" type="number" step="0.0001" required /><label>Longitude</label><input name="longitude" type="number" step="0.0001" required /><label>Subtotal USD</label><input name="subtotal" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Code</th><th>Place</th><th>Rider</th><th>Driver</th><th>Fee</th><th>Total</th><th>Status</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.establishment)}</td><td>${escapeHtml(row.rider || "")}</td><td>${escapeHtml(row.driver || "")}</td><td>${money(row.fee)}</td><td>${money(row.total)}</td><td>${word(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "establishments") {
    return `<form class="panel" id="place-form">${citySelect()}<label>Category</label><select name="categoryId">${options(look.categories, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Phone</label><input name="phone" /><label>Address</label><input name="address" /><label>Latitude</label><input name="latitude" type="number" step="0.0001" required /><label>Longitude</label><input name="longitude" type="number" step="0.0001" required /><label>Status</label><select name="status"><option value="open">Open</option><option value="closed">Closed</option></select><button class="primary">${t("save")}</button></form>
      <table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.city)}</td><td>${word(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "establishment-categories") {
    return `<form class="panel" id="category-form">${citySelect()}<label>Name</label><input name="name" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-zones") {
    return `<form class="panel" id="zone-form">${citySelect()}<label>Name</label><input name="name" required /><label>Fee USD</label><input name="fee" type="number" step="0.01" required /><label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${money(row.fee)}</td><td>${row.radiusKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "map-keys") {
    const status = state.mapKey || {};
    return `<form class="panel" id="map-key-form"><p>${status.configured ? `Google key saved, ending ${escapeHtml(status.last4)}.` : "No Google Maps key saved. A route test will not invent a distance."}</p><label>Google Maps key</label><input name="secret" type="password" required /><input type="hidden" name="provider" value="google" /><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "commissions") {
    return `<form class="panel" id="commission-form">${citySelect()}<label>Trip type</label><select name="tripTypeId"><option value="">All types in the city</option>${options(look.tripTypes, "", (row) => `${row.city} · ${row.name}`)}</select><label>Percent</label><input name="percent" type="number" step="0.01" min="0" max="100" required /><label>Fixed USD</label><input name="fixed" type="number" step="0.01" value="0" /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>City</th><th>Trip type</th><th>Percent</th><th>Fixed</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.tripType || "All")}</td><td>${row.percent}%</td><td>${money(row.fixed)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "ledger") {
    return `<form class="panel" id="ledger-form"><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => `${row.name} · ${money(row.balance)}`)}</select><label>Direction</label><select name="direction"><option value="credit">Credit</option><option value="debit">Debit</option></select><label>Amount USD</label><input name="amount" type="number" step="0.01" required /><label>Reason</label><input name="reason" required /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Driver</th><th>Direction</th><th>Amount</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${word(row.direction)}</td><td>${money(row.amount)}</td><td>${escapeHtml(row.reason)}</td><td>${word(row.status)}</td><td>${row.status === "posted" ? `<button class="ghost" data-void="${row.id}">Void</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "payouts") {
    return `<form class="panel" id="payout-form"><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => `${row.name} · ${money(row.balance)}`)}</select><label>Amount USD</label><input name="amount" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Driver</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${money(row.amount)}</td><td>${word(row.status)}</td><td>${row.status === "requested" ? `<button class="ghost" data-payout="${row.id}" data-decision="paid">Pay</button><button class="ghost" data-payout="${row.id}" data-decision="rejected">Reject</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "cancellation-fees") {
    const canceled = (look.trips || []).filter((trip) => trip.status === "cancelled");
    return `<form class="panel" id="fee-form"><label>Canceled trip</label><select name="tripId">${options(canceled, "", (row) => row.reference)}</select><label>Charge</label><select name="chargedTo"><option value="rider">Rider</option><option value="driver">Driver</option></select><label>Amount USD</label><input name="amount" type="number" step="0.01" required /><label>Reason</label><select name="reasonId">${options((look.cancelReasons || []).filter((row) => row.chargesFee), "", (row) => `${row.reason} · ${row.audience}`)}</select><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Trip</th><th>Charged to</th><th>Amount</th><th>Reason</th><th>Status</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.trip)}</td><td>${word(row.chargedTo)}</td><td>${money(row.amount)}</td><td>${escapeHtml(row.reason)}</td><td>${word(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "credits") {
    return `<form class="panel" id="credit-form"><label>Company</label><select name="companyId">${options(look.companies, "", (row) => row.name)}</select><label>Buy price USD</label><input name="buyPrice" type="number" step="0.01" required /><label>Credit USD</label><input name="sellPrice" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form>
      <table><thead><tr><th>Company</th><th>Buy</th><th>Credit</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.company)}</td><td>${money(row.buyPrice)}</td><td>${money(row.sellPrice)}</td><td>${word(row.status)}</td><td>${row.status === "pending" ? `<button class="ghost" data-credit="${row.id}">Mark paid</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "payment-methods") {
    return `<form class="panel" id="payment-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Code</label><select name="code"><option value="card">Card</option><option value="cash">Cash</option><option value="wallet">Wallet</option><option value="invoice">Invoice</option></select><label>Name</label><input name="name" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.code)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "penalties") {
    return `<form class="panel" id="penalty-form"><label>Name</label><input name="name" required /><label>Points</label><input name="points" type="number" min="0" required /><label>Suspension hours</label><input name="suspensionHours" type="number" min="0" required /><button class="primary">${t("save")}</button></form>
      <form class="panel" id="penalty-apply-form"><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => row.name)}</select><label>Penalty</label><select name="penaltyId">${options(look.penalties || [], "", (row) => `${row.name} · ${row.suspensionHours}h`)}</select><button class="primary">Apply</button></form>
      <table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.driver)}</td><td>${escapeHtml(row.penalty)}</td><td>${row.points}</td><td>${escapeHtml(row.suspendedUntil || "")}</td><td>${row.suspendedUntil ? `<button class="ghost" data-release="${row.id}">Release</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "modules") {
    return `<form class="panel" id="module-form"><label>Module</label><select name="name"><option value="trips">Trips</option><option value="delivery">Delivery</option><option value="freight">Freight</option><option value="routes">Routes</option><option value="corporate">Corporate</option></select><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.active ? "on" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "vouchers") {
    return `<form class="panel" id="voucher-form"><label>Company</label><select name="companyId">${options(look.companies, "", (row) => row.name)}</select><label>Code</label><input name="code" required /><label>Balance USD</label><input name="balance" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.company)}</td><td>${money(row.balance)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "risk-areas") {
    return `<form class="panel" id="risk-form"><label>Name</label><input name="name" required /><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Latitude</label><input name="lat" required /><label>Longitude</label><input name="lng" required /><label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><label>Level</label><select name="level"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.level)}</td><td>${row.radiusKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "route-items") {
    return `<form class="panel" id="route-item-form"><label>Name</label><input name="name" required /><label>Price USD</label><input name="price" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${money(row.price)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "route-register" || current.key === "routes") {
    const booking = current.key === "routes"
      ? `<form class="panel" id="route-book-form"><label>Route</label><select name="routeId">${options(rows, "", (row) => row.name)}</select><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => row.name)}</select><label>Passengers</label><input name="passengers" type="number" min="1" value="1" /><label>Item</label><select name="itemId"><option value=""></option>${options(look.routeItems || [], "", (row) => row.name)}</select><button class="primary">Book</button></form><table><tbody>${(ui.state.routeBookings || []).map((row) => `<tr><td>${escapeHtml(row.route)}</td><td>${escapeHtml(row.driver)}</td><td>${row.passengers}</td><td>${money(row.total)}</td></tr>`).join("")}</tbody></table>`
      : "";
    return `<form class="panel" id="route-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Origin</label><input name="origin" required /><label>Destination</label><input name="destination" required /><label>Price per person USD</label><input name="pricePerPerson" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.origin)} → ${escapeHtml(row.destination)}</td><td>${money(row.pricePerPerson)}</td></tr>`).join("")}</tbody></table>${booking}`;
  }
  if (current.key === "route-drivers") {
    return `<form class="panel" id="route-driver-form"><label>Route</label><select name="routeId">${options(look.routes || [], "", (row) => row.name)}</select><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => `${row.name} · ${row.city}`)}</select><button class="primary">Release</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.route)}</td><td>${escapeHtml(row.driver)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "route-banners") {
    return `<form class="panel" id="route-banner-form"><label>Route</label><select name="routeId">${options(look.routes || [], "", (row) => row.name)}</select><label>Title</label><input name="title" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.route)}</td><td>${escapeHtml(row.title)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "managers") {
    return `<form class="panel" id="manager-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Email</label><input name="email" type="email" /><label>Phone</label><input name="phone" /><label>Commission %</label><input name="commission" type="number" min="0" max="100" step="0.1" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${row.commission}%</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "manager-drivers") {
    return `<form class="panel" id="manager-driver-form"><label>Manager</label><select name="managerId">${options(look.managers || [], "", (row) => `${row.name} · ${row.city}`)}</select><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => `${row.name} · ${row.city}`)}</select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.manager)}</td><td>${escapeHtml(row.driver)}</td></tr>`).join("")}</tbody></table><table><tbody>${(ui.state.managerEarnings || []).map((row) => `<tr><td>${escapeHtml(row.manager)}</td><td>${escapeHtml(row.trip)}</td><td>${money(row.amount)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "partners") {
    return `<form class="panel" id="partner-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Contact</label><input name="contact" /><label>Phone</label><input name="phone" /><label>Status</label><select name="status"><option value="active">Active</option><option value="paused">Paused</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "partner-messages") {
    return `<form class="panel" id="partner-message-form"><label>Partner</label><select name="partnerId">${options((look.partners || []).filter((row) => row.status === "active"), "", (row) => row.name)}</select><label>Subject</label><input name="subject" required /><label>Message</label><textarea name="message" required></textarea><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.partner)}</td><td>${escapeHtml(row.subject)}</td><td>${escapeHtml(row.status)}</td><td>${row.status === "open" ? `<button class="ghost" data-close-message="${row.id}">Close</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "trip-promotions") {
    return `<form class="panel" id="promotion-form"><label>Name</label><input name="name" required /><label>Trips required</label><input name="tripsRequired" type="number" min="1" required /><label>Reward USD</label><input name="reward" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.tripsRequired} trips</td><td>${money(row.reward)}</td></tr>`).join("")}</tbody></table><table><tbody>${(ui.state.promotionGrants || []).map((row) => `<tr><td>${escapeHtml(row.customer)}</td><td>${escapeHtml(row.promotion)}</td><td>${money(row.reward)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "ads") {
    return `<form class="panel" id="ad-form"><label>Title</label><input name="title" required /><label>Audience</label><select name="audience"><option value="rider">Rider</option><option value="driver">Driver</option><option value="delivery">Delivery</option></select><label>Placement</label><select name="placement"><option value="home">Home</option><option value="waiting">Waiting</option><option value="receipt">Receipt</option></select><label>Link</label><input name="link" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.placement)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "external-links") {
    return `<form class="panel" id="link-form"><label>Label</label><input name="label" required /><label>URL</label><input name="url" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td>${escapeHtml(row.url)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "app-ads" || current.key === "app-ad-create") {
    return `<form class="panel" id="app-ad-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Title</label><input name="title" required /><label>Audience</label><select name="audience"><option value="rider">Rider</option><option value="driver">Driver</option></select><label>Link</label><input name="link" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.audience)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "support-riders" || current.key === "support-trips") {
    const trip = current.key === "support-trips";
    return `<form class="panel" id="ticket-form"><label>${trip ? "Trip" : "Customer"}</label><select name="${trip ? "tripId" : "customerId"}">${options(trip ? look.trips : look.customers, "", (row) => row.reference || row.name)}</select><label>Subject</label><input name="subject" required /><label>Message</label><textarea name="message" required></textarea><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.trip || row.customer || "")}</td><td>${escapeHtml(row.subject)}</td><td>${escapeHtml(row.status)}</td><td>${row.status === "open" ? `<button class="ghost" data-close-ticket="${row.id}">Close</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "notifications") {
    return `<form class="panel" id="notice-form"><label>Audience</label><select name="audience"><option value="riders">Riders</option><option value="drivers">Drivers</option><option value="both">Both</option></select><label>City</label><select name="cityId"><option value=""></option>${options(look.cities, "", (row) => row.name)}</select><label>Title</label><input name="title" required /><label>Message</label><textarea name="body" required></textarea><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.status)}</td><td>${row.status === "draft" ? `<button class="ghost" data-send="${row.id}">Send</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "roles") {
    return `<form class="panel" id="role-form"><label>Name</label><input name="name" required /><label>Description</label><textarea name="description"></textarea><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.description || "")}</td><td><button class="ghost" data-remove-role="${row.id}">Delete</button></td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "staff") {
    return `<form class="panel" id="staff-form"><label>Name</label><input name="name" required /><label>Email</label><input name="email" type="email" required /><label>Profile</label><select name="roleId">${options((look.roles || []).filter((row) => row.active), "", (row) => row.name)}</select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.email)}</td><td>${escapeHtml(row.role)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "places") {
    return `<form class="panel" id="map-place-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Address</label><input name="address" required /><label>Latitude</label><input name="lat" required /><label>Longitude</label><input name="lng" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${row.lat}, ${row.lng}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "irregular-addresses") {
    return `<form class="panel" id="irregular-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Address</label><input name="query" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.query)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.status)}</td><td>${row.status === "open" ? `<button class="ghost" data-resolve="${row.id}">Resolve</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "heat-areas") {
    return `<form class="panel" id="heat-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Latitude</label><input name="lat" required /><label>Longitude</label><input name="lng" required /><label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><label>Intensity</label><input name="intensity" type="number" step="0.1" min="1" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${row.intensity}×</td><td>${row.radiusKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "smtp") {
    return `<form class="panel" id="smtp-form"><label>Host</label><input name="host" /><label>Port</label><input name="port" type="number" value="587" /><label>From</label><input name="from" type="email" /><label>Encryption</label><select name="encryption"><option value="starttls">STARTTLS</option><option value="ssl">SSL</option><option value="none">None</option></select><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.email)}</td><td>${escapeHtml(row.createdAt)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "confirmation-codes") {
    return `<form class="panel" id="code-form"><label>Channel</label><select name="channel"><option value="email">Email</option><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option></select><label>Length</label><input name="length" type="number" min="4" max="8" value="4" /><label>TTL seconds</label><input name="ttlSeconds" type="number" min="30" value="300" /><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "terms") {
    return `<form class="panel" id="terms-form"><label>Audience</label><select name="audience"><option value="rider">Rider</option><option value="driver">Driver</option><option value="both">Both</option></select><label>Title</label><input name="title" required /><label>Version</label><input name="version" required /><label>Body</label><textarea name="body" required></textarea><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.version)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "firebase") {
    return `<form class="panel" id="firebase-form"><label>Project id</label><input name="projectId" /><label>Auth</label><select name="auth"><option value="no">No</option><option value="yes">Yes</option></select><label>Firestore</label><select name="firestore"><option value="no">No</option><option value="yes">Yes</option></select><label>Messaging</label><select name="messaging"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "versions") {
    return `<form class="panel" id="version-form"><label>Platform</label><select name="platform"><option value="android">Android</option><option value="ios">iOS</option></select><label>Version</label><input name="version" placeholder="1.0.0" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.platform)}</td><td>${escapeHtml(row.version)}</td><td>${row.current ? "current" : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "app-config") {
    return `<form class="panel" id="app-config-form"><label>Platform</label><select name="platform"><option value="android">Android</option><option value="ios">iOS</option></select><label>Minimum version</label><input name="minVersion" required /><label>Force update</label><select name="forceUpdate"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.platform)}</td><td>${escapeHtml(row.minVersion)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-general") {
    return `<form class="panel" id="delivery-settings-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Minimum order USD</label><input name="minOrder" type="number" step="0.01" required /><label>Default fee USD</label><input name="defaultFee" type="number" step="0.01" value="0" /><label>Prep minutes</label><input name="prepMinutes" type="number" min="0" max="180" value="0" /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${money(row.minOrder)}</td><td>${money(row.defaultFee)}</td><td>${row.prepMinutes} min</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "driver-registration") {
    return `<form class="panel" id="signup-config-form"><label>Require vehicle</label><select name="requireVehicle"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "delivery-sections") {
    return `<form class="panel" id="section-form">${citySelect()}<label>Name</label><input name="name" required /><label>Order</label><input name="sort" type="number" min="1" required /><button class="primary">${t("save")}</button></form><form class="panel" id="section-link-form"><label>Section</label><select name="sectionId">${options(rows, "", (row) => row.name)}</select><label>Establishment</label><select name="establishmentId">${options(look.establishments, "", (row) => row.name)}</select><button class="primary">Link</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${row.sort}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-accessories") {
    return `<form class="panel" id="accessory-form"><label>Name</label><input name="name" required /><label>Price USD</label><input name="price" type="number" step="0.01" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${money(row.price)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-finance") {
    return `<form class="panel" id="settlement-form"><label>Establishment</label><select name="establishmentId">${options(look.establishments, "", (row) => row.name)}</select><button class="primary">Settle</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.establishment)}</td><td>${money(row.gross)}</td><td>${money(row.net)}</td><td>${money(row.driverCut)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-configuration") {
    return `<form class="panel" id="delivery-config-form"><label>Dispatch</label><select name="dispatchMode"><option value="nearest">Nearest</option><option value="queue">Queue</option><option value="manual">Manual</option></select><label>Max radius km</label><input name="maxRadiusKm" type="number" step="0.1" value="0" /><label>Driver share %</label><input name="driverShare" type="number" min="0" max="100" value="0" /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "asaas") {
    return `<form class="panel" id="asaas-form"><label>Environment</label><select name="environment"><option value="sandbox">Sandbox</option><option value="production">Production</option></select><label>Wallet id</label><input name="walletId" /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "delivery-calls") {
    return `<form class="panel" id="delivery-call-form">${citySelect()}<label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><label>Timeout seconds</label><input name="timeoutSeconds" type="number" min="15" required /><label>Auto accept</label><select name="autoAccept"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${row.radiusKm} km</td><td>${row.timeoutSeconds}s</td><td>${row.autoAccept ? "auto" : "offer"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "acquirer") {
    return `<form class="panel" id="acquirer-form"><label>Provider</label><select name="provider"><option value="stripe">Stripe</option><option value="asaas">ASAAS</option><option value="other">Other</option></select><label>Environment</label><select name="environment"><option value="test">Test</option><option value="live">Live</option></select><label>Public key</label><input name="publicKey" /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "acquirer-cities") {
    return `<form class="panel" id="acquirer-city-form">${citySelect()}<label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.provider)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "acquirer-dashboard" || current.key === "acquirer-reports") {
    const gross = rows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    return `<p>Authorized ${money(gross)} across ${rows.length} card charges.</p><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${money(row.amount)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "acquirer-transactions") {
    const cards = (look.trips || []).filter((row) => row.payment === "card");
    return `<form class="panel" id="acquirer-charge-form"><label>Card trip</label><select name="tripId">${options(cards, "", (row) => row.reference)}</select><button class="primary">Authorize</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.tripId)}</td><td>${money(row.amount)}</td><td>${escapeHtml(row.status)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "dispatch") {
    return `<form class="panel" id="dispatch-form"><label>Mode</label><select name="mode"><option value="nearest">Nearest</option><option value="queue">Queue</option><option value="manual">Manual</option></select><label>Offer seconds</label><input name="offerSeconds" type="number" min="10" value="20" /><label>Max drivers</label><input name="maxDrivers" type="number" min="1" value="1" /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "finance-reports") {
    return `<form class="panel" id="finance-report-form"><label>Name</label><input name="name" required /><label>Period</label><input name="period" placeholder="2026-11" required /><button class="primary">Generate</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.period)}</td><td>${money(row.gross)}</td><td>${money(row.net)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "admin-alerts") {
    return `<form class="panel" id="alert-form"><label>User</label><select name="staffId">${options(look.staff || [], "", (row) => row.name)}</select><label>Message</label><textarea name="message" required></textarea><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.user)}</td><td>${escapeHtml(row.message)}</td><td>${escapeHtml(row.status)}</td><td>${row.status === "open" ? `<button type="button" data-read-alert="${row.id}">Read</button>` : ""}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "external-services") {
    return `<form class="panel" id="external-form"><label>Name</label><input name="name" required /><label>Base URL</label><input name="baseUrl" placeholder="https://" required /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.baseUrl)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "external-city") {
    return `<form class="panel" id="external-city-form">${citySelect()}<label>Service</label><select name="serviceId">${options(look.externalServices || [], "", (row) => row.name)}</select><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.service)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "webhooks") {
    const sent = state.webhookDeliveries || [];
    return `<form class="panel" id="webhook-form"><label>Event</label><select name="event"><option value="trip.completed">Trip completed</option><option value="trip.cancelled">Trip cancelled</option></select><label>URL</label><input name="url" placeholder="https://" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.event)}</td><td>${escapeHtml(row.url)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table><table><tbody>${sent.map((row) => `<tr><td>${escapeHtml(row.event)}</td><td>${escapeHtml(row.tripId)}</td><td>${escapeHtml(row.createdAt)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "app-documents") {
    return `<form class="panel" id="app-document-form"><label>Name</label><input name="name" required /><label>Audience</label><select name="audience"><option value="driver">Driver</option><option value="rider">Rider</option></select><label>Required</label><select name="required"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.name)}</td><td>${row.required ? "required" : "optional"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "documents-by-category") {
    const docs = (look.appDocuments || []).filter((row) => row.audience === "driver");
    return `<form class="panel" id="requirement-form"><label>Category</label><select name="category"><option value="private">Private</option><option value="delivery">Delivery</option><option value="freight">Freight</option></select><label>Document</label><select name="documentId">${options(docs, "", (row) => row.name)}</select><label>Required</label><select name="required"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.category)}</td><td>${escapeHtml(row.document)}</td><td>${row.required ? "required" : "optional"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "rider-documents") {
    const docs = (look.appDocuments || []).filter((row) => row.audience === "rider");
    return `<form class="panel" id="rider-document-form"><label>Rider</label><select name="customerId">${options(look.customers, "", (row) => row.name)}</select><label>Document</label><select name="documentId">${options(docs, "", (row) => row.name)}</select><label>Status</label><select name="status"><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "phones") {
    return `<form class="panel" id="phone-form">${citySelect()}<label>Name</label><input name="name" required /><label>Phone</label><input name="phone" required /><label>Department</label><input name="department" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.phone)}</td><td>${escapeHtml(row.department)}</td><td>${escapeHtml(row.city)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "usage-policy") {
    return `<form class="panel" id="policy-form"><label>Title</label><input name="title" required /><label>Version</label><input name="version" required /><label>Body</label><textarea name="body" required></textarea><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.version)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "driver-chat") {
    return `<form class="panel" id="chat-form"><label>Code</label><input name="code" required /><label>Message</label><textarea name="message" required></textarea><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><form class="panel" id="chat-send-form"><label>Trip</label><select name="tripId">${options(look.trips || [], "", (row) => row.reference)}</select><label>Message</label><select name="messageId">${options(rows.filter((row) => row.active), "", (row) => row.code)}</select><button class="primary">Send</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.message)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "suggestion-text") {
    return `<form class="panel" id="suggestion-form"><label>Context</label><select name="context"><option value="chat">Chat</option><option value="cancel">Cancel</option><option value="rating">Rating</option></select><label>Text</label><textarea name="text" required></textarea><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.context)}</td><td>${escapeHtml(row.text)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "app-keys") {
    return `<form class="panel" id="app-key-form"><label>Name</label><input name="name" required /><label>Owner</label><input name="owner" required /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.owner)}</td><td>…${escapeHtml(row.last4)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "credentials") {
    return `<form class="panel" id="credential-form"><label>Name</label><input name="name" required /><label>Owner</label><input name="owner" /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.owner)}</td><td>…${escapeHtml(row.last4)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "city-settings") {
    return `<form class="panel" id="city-setting-form">${citySelect()}<input type="hidden" name="key" value="cash_enabled" /><label>Cash</label><select name="value"><option value="yes">Enabled</option><option value="no">Disabled</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.key)}</td><td>${escapeHtml(row.value)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "additional") {
    return `<form class="panel" id="additional-form"><input type="hidden" name="key" value="max_open_trips" /><label>Max open trips per rider</label><input name="value" type="number" min="0" value="0" /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.key)}</td><td>${escapeHtml(row.value)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "partner-apps") {
    return `<form class="panel" id="partner-app-form"><label>Partner</label><select name="partnerId">${options((look.partners || []).filter((row) => row.status === "active"), "", (row) => row.name)}</select><label>API base</label><input name="apiBase" placeholder="https://" required /><label>Active</label><select name="active"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.partner)}</td><td>${escapeHtml(row.apiBase)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "services") {
    return `<form class="panel" id="service-form">${citySelect()}<label>Name</label><input name="name" required /><label>Trip type</label><select name="tripTypeId">${options(look.tripTypes, "", (row) => `${row.name} · ${row.city}`)}</select><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.tripType)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "delivery-items") {
    return `<form class="panel" id="delivery-item-form"><label>Establishment</label><select name="establishmentId">${options(look.establishments, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Price USD</label><input name="price" type="number" step="0.01" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.establishment)}</td><td>${escapeHtml(row.name)}</td><td>${money(row.price)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "logs") {
    return `<table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.level)}</td><td>${escapeHtml(row.source)}</td><td>${escapeHtml(row.message)}</td><td>${escapeHtml(row.createdAt)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "map-general") {
    return `<form class="panel" id="map-general-form"><label>Provider</label><select name="provider"><option value="osm">OpenStreetMap</option><option value="google">Google</option><option value="mapbox">Mapbox</option></select><label>Traffic</label><select name="traffic"><option value="no">No</option><option value="yes">Yes</option></select><label>Clustering</label><select name="clustering"><option value="no">No</option><option value="yes">Yes</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.provider)}</td><td>${row.traffic ? "traffic" : "no traffic"}</td><td>${row.clustering ? "clusters" : "points"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "map-cities") {
    return `<form class="panel" id="map-city-form">${citySelect()}<label>Provider</label><select name="provider"><option value="osm">OpenStreetMap</option><option value="google">Google</option></select><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.provider)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "route-optimization") {
    return `<form class="panel" id="optimize-form"><label>Name</label><input name="name" required />${citySelect()}<label>Places</label><select name="placeIds" multiple size="4">${options(look.places || [], "", (row) => `${row.name} · ${row.city}`)}</select><button class="primary">Optimize</button></form><p>OpenStreetMap returns the straight-line order. A driving route is not invented.</p><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${row.stops} stops</td><td>${row.straightKm} km</td><td>saves ${row.savingsKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "layout") {
    return `<form class="panel" id="layout-form"><label>Density</label><select name="density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select><label>Map</label><select name="mapStyle"><option value="day">Day</option><option value="night">Night</option></select><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form>`;
  }
  if (current.key === "birthdays") {
    return `<form class="panel" id="birthday-form"><label>Audience</label><select name="audience"><option value="riders">Riders</option><option value="drivers">Drivers</option></select><label>Send time</label><input name="sendTime" placeholder="09:00" required /><label>Message</label><textarea name="message"></textarea><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><button class="ghost" id="run-birthdays">Send today's birthdays</button><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.sendTime)}</td><td>${row.active ? "on" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "whatsapp-session") {
    return `<form class="panel" id="whatsapp-session-form"><label>Phone</label><input name="phone" /><label>Status</label><select name="status"><option value="disconnected">Disconnected</option><option value="connecting">Connecting</option><option value="connected">Connected</option></select><button class="primary">${t("save")}</button></form><p>${escapeHtml(rows[0]?.status || "disconnected")} ${escapeHtml(rows[0]?.phone || "")}</p>`;
  }
  if (current.key === "whatsapp-keys") {
    return `<form class="panel" id="whatsapp-key-form"><label>Name</label><input name="name" required /><label>Sender</label><input name="sender" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.sender)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "whatsapp-scheduled") {
    return `<form class="panel" id="whatsapp-notice-form"><label>Template</label><textarea name="template" required></textarea><label>Minutes before</label><input name="minutesBefore" type="number" min="0" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.template)}</td><td>${row.minutesBefore} min</td><td>${row.active ? "on" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "map-sequencer") {
    return `<form class="panel" id="sequence-form"><label>Provider</label><select name="provider"><option value="google">Google</option><option value="here">Here</option><option value="mapbox">Mapbox</option><option value="osm">OSM</option></select><label>Order</label><input name="order" type="number" min="1" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${row.sortOrder}</td><td>${escapeHtml(row.provider)}</td><td>${row.active ? "active" : "off"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "monitoring-areas") {
    return `<form class="panel" id="monitoring-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Latitude</label><input name="lat" required /><label>Longitude</label><input name="lng" required /><label>Radius km</label><input name="radiusKm" type="number" step="0.1" required /><label>Active</label><select name="active"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${row.radiusKm} km</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "address-cache") {
    return `<table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.query)}</td><td>${escapeHtml(row.formatted)}</td><td>${escapeHtml(row.city)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "reports") {
    return `<table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.source)}</td><td>${row.rows} rows</td><td><button class="ghost" data-report="${row.id}">CSV</button></td></tr>`).join("")}</tbody></table><pre id="report-file"></pre>`;
  }
  if (current.key === "centrals") {
    return `<form class="panel" id="central-form"><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Address</label><input name="address" /><label>Phone</label><input name="phone" /><label>Status</label><select name="status"><option value="active">Active</option><option value="paused">Paused</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.status)}</td><td>${money(row.balance)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "central-users") {
    return `<form class="panel" id="central-user-form"><label>Central</label><select name="centralId">${options((look.centrals || []).filter((row) => row.status === "active"), "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Email</label><input name="email" type="email" required /><label>Role</label><select name="role"><option value="operator">Operator</option><option value="supervisor">Supervisor</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.central)}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.role)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "neighborhoods") {
    return `<form class="panel" id="neighborhood-form"><label>Central</label><select name="centralId">${options((look.centrals || []).filter((row) => row.status === "active"), "", (row) => row.name)}</select><label>Name</label><input name="name" required /><label>Flat fare USD</label><input name="flatFare" type="number" step="0.01" required /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.central)}</td><td>${escapeHtml(row.name)}</td><td>${money(row.flatFare)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "central-settings") {
    return `<form class="panel" id="central-settings-form"><label>Central</label><select name="centralId">${options((look.centrals || []).filter((row) => row.status === "active"), "", (row) => row.name)}</select><label>Return fee USD</label><input name="returnFee" type="number" step="0.01" value="0" /><label>Finish only by central</label><select name="finishOnly"><option value="no">No</option><option value="yes">Yes</option></select><label>Payment</label><select name="paymentMethod"><option value="card">Card</option><option value="cash">Cash</option><option value="wallet">Wallet</option><option value="invoice">Invoice</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.central)}</td><td>${money(row.returnFee)}</td><td>${row.finishOnly ? "central" : "driver"}</td><td>${escapeHtml(row.paymentMethod)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "call-groups") {
    return `<form class="panel" id="call-group-form"><label>Name</label><input name="name" required /><label>City</label><select name="cityId">${options(look.cities, "", (row) => row.name)}</select><label>Strategy</label><select name="strategy"><option value="nearest">Nearest</option><option value="queue">Queue</option><option value="broadcast">Broadcast</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.city)}</td><td>${escapeHtml(row.strategy)}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "call-group-drivers") {
    return `<form class="panel" id="call-group-driver-form"><label>Group</label><select name="groupId">${options(look.callGroups || [], "", (row) => `${row.name} · ${row.city}`)}</select><label>Driver</label><select name="driverId">${options(look.drivers, "", (row) => `${row.name} · ${row.city}`)}</select><label>Priority</label><input name="priority" type="number" min="1" value="1" /><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.group)}</td><td>${escapeHtml(row.driver)}</td><td>${row.priority}</td></tr>`).join("")}</tbody></table>`;
  }
  if (current.key === "cancel-reasons") {
    return `<form class="panel" id="cancel-reason-form"><label>Audience</label><select name="audience"><option value="rider">Rider</option><option value="driver">Driver</option><option value="operator">Operator</option></select><label>Reason</label><input name="reason" required /><label>Charge fee</label><select name="fee"><option value="yes">Yes</option><option value="no">No</option></select><button class="primary">${t("save")}</button></form><table><tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.audience)}</td><td>${escapeHtml(row.reason)}</td><td>${row.chargesFee ? "fee" : "no fee"}</td></tr>`).join("")}</tbody></table>`;
  }
  const subject = current.key === "driver-deletions" ? "driver" : "customer";
  const people = subject === "driver" ? look.drivers : look.customers;
  return `<form class="panel" id="deletion-form"><label>${subject === "driver" ? "Driver" : "Customer"}</label><select name="${subject === "driver" ? "driverId" : "customerId"}">${options(people, "", (row) => row.name)}</select><input type="hidden" name="subject" value="${subject}" /><label>Reason</label><textarea name="reason" required></textarea><button class="primary">${t("save")}</button></form>
    <table><thead><tr><th>Name</th><th>Phone</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>${rows
      .map((row) => `<tr><td>${escapeHtml(row.name || "")}</td><td>${escapeHtml(row.phone || "")}</td><td>${escapeHtml(row.reason)}</td><td>${word(row.status)}</td><td>${row.status === "pending" ? `<button class="ghost" data-deletion="${row.id}" data-decision="approved">Approve</button><button class="ghost" data-deletion="${row.id}" data-decision="rejected">Reject</button>` : ""}</td></tr>`)
      .join("")}</tbody></table>`;
}

export function bindCore(ui, current, reload) {
  const formOf = async (id, url, extra = {}) => {
    const form = document.getElementById(id);
    if (!form) return;
    form.onsubmit = async (event) => {
      event.preventDefault();
      const body = { ...extra, ...Object.fromEntries(new FormData(form)) };
      if (id === "optimize-form") body.placeIds = [...form.querySelectorAll("[name=placeIds] option:checked")].map((option) => option.value).join(",");
      if (form.dataset.id) body.id = form.dataset.id;
      const patch = body.id && ["city-form", "customer-form", "company-form", "driver-form", "tariff-form"].includes(id);
      await ui.api(patch ? `${url}/${body.id}` : url, { method: patch ? "PATCH" : "POST", body });
      form.dataset.id = "";
      await reload();
    };
  };
  formOf("city-form", "/api/cities");
  formOf("customer-form", "/api/customers");
  formOf("company-form", "/api/companies");
  formOf("driver-form", "/api/drivers");
  formOf("tariff-form", "/api/trip-types");
  formOf("trip-form", "/api/trips");
  formOf("vehicle-form", "/api/vehicle-changes");
  formOf("document-form", "/api/driver-documents");
  formOf("deletion-form", "/api/account-deletions");
  formOf("commission-form", "/api/commissions");
  formOf("ledger-form", "/api/ledger");
  formOf("payout-form", "/api/payouts");
  formOf("fee-form", "/api/cancellation-fees");
  formOf("credit-form", "/api/credits");
  formOf("flag-form", "/api/tariff-flags");
  formOf("trigger-form", "/api/tariff-triggers");
  formOf("surge-form", "/api/dynamic-areas");
  formOf("toll-form", "/api/tolls");
  formOf("coupon-form", "/api/coupons");
  formOf("radius-form", "/api/call-radius");
  formOf("map-key-form", "/api/map-keys");
  formOf("order-form", "/api/delivery/orders");
  formOf("place-form", "/api/delivery/establishments");
  formOf("category-form", "/api/delivery/categories");
  formOf("zone-form", "/api/delivery/zones");
  formOf("freight-item-form", "/api/freight/items");
  formOf("freight-extra-form", "/api/freight/extras");
  formOf("freight-access-form", "/api/freight/access");
  formOf("freight-quote-form", "/api/freight/quotes");
  formOf("call-group-form", "/api/call-groups");
  formOf("call-group-driver-form", "/api/call-group-drivers");
  formOf("cancel-reason-form", "/api/cancel-reasons");
  formOf("payment-form", "/api/payment-methods");
  formOf("penalty-form", "/api/penalties");
  formOf("penalty-apply-form", "/api/penalties/apply");
  formOf("module-form", "/api/modules");
  formOf("voucher-form", "/api/vouchers");
  formOf("risk-form", "/api/risk-areas");
  formOf("route-item-form", "/api/route-items");
  formOf("route-form", "/api/routes");
  formOf("route-driver-form", "/api/route-drivers");
  formOf("route-banner-form", "/api/route-banners");
  formOf("route-book-form", "/api/route-bookings");
  formOf("manager-form", "/api/managers");
  formOf("manager-driver-form", "/api/manager-drivers");
  formOf("partner-form", "/api/partners");
  formOf("partner-message-form", "/api/partner-messages");
  formOf("promotion-form", "/api/trip-promotions");
  formOf("ad-form", "/api/ads");
  formOf("link-form", "/api/external-links");
  formOf("app-ad-form", "/api/app-ads");
  formOf("ticket-form", current.key === "support-trips" ? "/api/support/trip" : "/api/support/rider");
  formOf("notice-form", "/api/notifications");
  formOf("role-form", "/api/roles");
  formOf("staff-form", "/api/staff");
  formOf("central-form", "/api/centrals");
  formOf("central-user-form", "/api/central-users");
  formOf("neighborhood-form", "/api/neighborhoods");
  formOf("central-settings-form", "/api/central-settings");
  formOf("map-place-form", "/api/places");
  formOf("irregular-form", "/api/irregular-addresses");
  formOf("heat-form", "/api/heat-areas");
  formOf("monitoring-form", "/api/monitoring-areas");
  formOf("sequence-form", "/api/map-sequence");
  formOf("birthday-form", "/api/birthdays");
  formOf("smtp-form", "/api/smtp");
  formOf("code-form", "/api/confirmation-codes");
  formOf("terms-form", "/api/terms");
  formOf("firebase-form", "/api/firebase");
  formOf("version-form", "/api/versions");
  formOf("app-config-form", "/api/app-config");
  formOf("delivery-settings-form", "/api/delivery-settings");
  formOf("signup-config-form", "/api/driver-signup-config");
  formOf("section-form", "/api/delivery/sections");
  formOf("section-link-form", "/api/delivery/sections/link");
  formOf("accessory-form", "/api/delivery/accessories");
  formOf("settlement-form", "/api/delivery/settlements");
  formOf("delivery-config-form", "/api/delivery/config");
  formOf("asaas-form", "/api/delivery/asaas");
  formOf("delivery-call-form", "/api/delivery/calls");
  formOf("acquirer-form", "/api/acquirer");
  formOf("acquirer-city-form", "/api/acquirer/cities");
  formOf("acquirer-charge-form", "/api/acquirer/charges");
  formOf("dispatch-form", "/api/dispatch");
  formOf("finance-report-form", "/api/finance-reports");
  formOf("alert-form", "/api/admin-alerts");
  formOf("external-form", "/api/external-services");
  formOf("external-city-form", "/api/external-city-services");
  formOf("webhook-form", "/api/webhooks");
  formOf("app-document-form", "/api/app-documents");
  formOf("requirement-form", "/api/document-requirements");
  formOf("rider-document-form", "/api/document-files");
  formOf("phone-form", "/api/phones");
  formOf("policy-form", "/api/usage-policy");
  formOf("chat-form", "/api/driver-chat");
  formOf("chat-send-form", "/api/driver-chat/send");
  formOf("suggestion-form", "/api/suggestions");
  formOf("app-key-form", "/api/app-keys");
  formOf("credential-form", "/api/credentials");
  formOf("city-setting-form", "/api/city-settings");
  formOf("additional-form", "/api/additional-settings");
  formOf("partner-app-form", "/api/partner-apps");
  formOf("service-form", "/api/services");
  formOf("delivery-item-form", "/api/delivery-items");
  formOf("map-general-form", "/api/map-general");
  formOf("map-city-form", "/api/map-cities");
  formOf("optimize-form", "/api/route-optimizations");
  formOf("layout-form", "/api/layout");
  formOf("whatsapp-session-form", "/api/whatsapp/session");
  formOf("whatsapp-key-form", "/api/whatsapp/keys");
  formOf("whatsapp-notice-form", "/api/whatsapp/notices");
  document.querySelectorAll("[data-customer-edit], [data-driver-edit], [data-city-edit]").forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.customerEdit || button.dataset.driverEdit || button.dataset.cityEdit;
      const row = ui.state.items.find((item) => item.id === id);
      const form = document.querySelector("form");
      if (!row || !form) return;
      form.dataset.id = row.id;
      [...form.elements].forEach((field) => {
        if (!field.name || row[field.name] == null) return;
        field.value = ["base", "perKm", "perMin", "minimum", "tax", "creditLimit"].includes(field.name) ? dollars(row[field.name]) : row[field.name];
      });
      if (row.cityId) form.elements.cityId && (form.elements.cityId.value = row.cityId);
    };
  });
  document.querySelectorAll("[data-vehicle]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/vehicle-changes/${button.dataset.vehicle}/decision`, { method: "POST", body: { status: button.dataset.decision } });
      await reload();
    };
  });
  document.querySelectorAll("[data-document]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/driver-documents/${button.dataset.document}/review`, { method: "POST", body: { status: button.dataset.review } });
      await reload();
    };
  });
  document.querySelectorAll("[data-deletion]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/account-deletions/${button.dataset.deletion}/decision`, { method: "POST", body: { status: button.dataset.decision } });
      await reload();
    };
  });
  document.querySelectorAll("[data-void]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/ledger/${button.dataset.void}/void`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-payout]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/payouts/${button.dataset.payout}/decision`, { method: "POST", body: { status: button.dataset.decision } });
      await reload();
    };
  });
  document.querySelectorAll("[data-close-message]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/partner-messages/${button.dataset.closeMessage}/close`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-release]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/penalties/${button.dataset.release}/release`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-credit]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/credits/${button.dataset.credit}/pay`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-close-ticket]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/support/${button.dataset.closeTicket}/close`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-send]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/notifications/${button.dataset.send}/send`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-resolve]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/irregular-addresses/${button.dataset.resolve}/resolve`, { method: "POST", body: {} });
      await reload();
    };
  });
  document.querySelectorAll("[data-report]").forEach((button) => {
    button.onclick = async () => {
      try {
        const response = await fetch(`/api/reports/${button.dataset.report}/file`, { headers: { authorization: `Bearer ${ui.state.token}` } });
        const text = await response.text();
        const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report-${button.dataset.report}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Report download failed:", err);
      }
    };
  });
  document.querySelectorAll("[data-preview-doc]").forEach((button) => {
    button.onclick = () => {
      ui.state.docPreview = {
        id: button.dataset.previewDoc,
        driver: button.dataset.driver,
        document: button.dataset.document,
      };
      reload();
    };
  });
  const dismissModal = document.getElementById("dismiss-doc-modal") || document.getElementById("close-doc-modal");
  if (dismissModal) {
    dismissModal.onclick = () => {
      ui.state.docPreview = null;
      reload();
    };
  }
  document.querySelectorAll("[data-doc-action]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/driver-documents/${button.dataset.docId}/review`, { method: "POST", body: { status: button.dataset.docAction } });
      ui.state.docPreview = null;
      await reload();
    };
  });
  document.querySelectorAll("[data-remove-role]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/roles/${button.dataset.removeRole}`, { method: "DELETE" });
      await reload();
    };
  });
  document.querySelectorAll("[data-read-alert]").forEach((button) => {
    button.onclick = async () => {
      await ui.api(`/api/admin-alerts/${button.dataset.readAlert}/read`, { method: "POST", body: {} });
      await reload();
    };
  });
  const birthdays = document.getElementById("run-birthdays");
  if (birthdays) {
    birthdays.onclick = async () => {
      await ui.api("/api/birthdays/run", { method: "POST", body: {} });
      await reload();
    };
  }
  const production = document.getElementById("production-city");
  if (production) {
    production.onchange = async () => {
      ui.state.productionCity = production.value;
      await reload();
    };
  }
}
