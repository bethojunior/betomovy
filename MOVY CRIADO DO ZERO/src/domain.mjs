import { randomUUID } from "node:crypto";

const schema = `
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  timezone TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  email TEXT,
  birth_date TEXT,
  gender TEXT,
  status TEXT NOT NULL,
  blocked INTEGER NOT NULL DEFAULT 0,
  city_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  register_status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  legal_name TEXT NOT NULL,
  trade_name TEXT,
  document TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city_id TEXT,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  credit_limit_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS drivers (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  city_id TEXT,
  register_status TEXT NOT NULL,
  presence TEXT NOT NULL,
  service TEXT NOT NULL,
  cnh TEXT,
  vehicle TEXT,
  plate TEXT,
  rating REAL NOT NULL DEFAULT 5,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  latitude REAL,
  longitude REAL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS trip_types (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  base_cents INTEGER NOT NULL,
  per_km_cents INTEGER NOT NULL,
  per_minute_cents INTEGER NOT NULL,
  minimum_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  seats INTEGER NOT NULL DEFAULT 4,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  customer_id TEXT,
  company_id TEXT,
  driver_id TEXT,
  city_id TEXT,
  trip_type_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km REAL NOT NULL,
  duration_min REAL NOT NULL,
  fare_cents INTEGER NOT NULL,
  payment TEXT NOT NULL,
  cancelled_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS vehicle_changes (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  current_vehicle TEXT NOT NULL,
  requested_vehicle TEXT NOT NULL,
  plate TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS driver_documents (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  due_at TEXT,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS commissions (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  trip_type_id TEXT,
  percent REAL NOT NULL,
  fixed_cents INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS ledger_entries (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS payouts (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cancellation_fees (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  charged_to TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tariff_flags (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  multiplier REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tariff_triggers (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  multiplier REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS dynamic_areas (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius_km REAL NOT NULL,
  multiplier REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tolls (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  city_id TEXT,
  kind TEXT NOT NULL,
  percent REAL NOT NULL DEFAULT 0,
  fixed_cents INTEGER NOT NULL DEFAULT 0,
  max_cents INTEGER NOT NULL DEFAULT 0,
  payment TEXT NOT NULL DEFAULT 'any',
  valid_until TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS call_radius (
  city_id TEXT PRIMARY KEY,
  radius_km REAL NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS call_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  strategy TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS call_group_drivers (
  group_id TEXT NOT NULL,
  driver_id TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (group_id, driver_id)
);
CREATE TABLE IF NOT EXISTS cancel_reasons (
  id TEXT PRIMARY KEY,
  audience TEXT NOT NULL,
  reason TEXT NOT NULL,
  charges_fee INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  UNIQUE (city_id, code)
);
CREATE TABLE IF NOT EXISTS penalties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  suspension_hours INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS driver_penalties (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  penalty_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  suspended_until TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS modules (
  name TEXT PRIMARY KEY,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  company_id TEXT NOT NULL,
  balance_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS risk_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius_km REAL NOT NULL,
  level TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS route_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS route_drivers (
  route_id TEXT NOT NULL,
  driver_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (route_id, driver_id)
);
CREATE TABLE IF NOT EXISTS route_banners (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  title TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS route_bookings (
  id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL,
  driver_id TEXT NOT NULL,
  passengers INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS managers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city_id TEXT NOT NULL,
  commission_percent REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS manager_drivers (
  manager_id TEXT NOT NULL,
  driver_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (manager_id, driver_id)
);
CREATE TABLE IF NOT EXISTS manager_earnings (
  id TEXT PRIMARY KEY,
  manager_id TEXT NOT NULL,
  trip_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  phone TEXT,
  city_id TEXT NOT NULL,
  status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS partner_messages (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS trip_promotions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trips_required INTEGER NOT NULL,
  reward_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS promotion_grants (
  id TEXT PRIMARY KEY,
  promotion_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  reward_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (promotion_id, customer_id)
);
CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  audience TEXT NOT NULL,
  placement TEXT NOT NULL,
  link TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS external_links (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS app_ads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  audience TEXT NOT NULL,
  city_id TEXT NOT NULL,
  link TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  customer_id TEXT,
  trip_id TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  audience TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  city_id TEXT,
  status TEXT NOT NULL,
  sent_at TEXT
);
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS centrals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city_id TEXT NOT NULL,
  phone TEXT,
  balance_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS central_users (
  id TEXT PRIMARY KEY,
  central_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS neighborhoods (
  id TEXT PRIMARY KEY,
  central_id TEXT NOT NULL,
  name TEXT NOT NULL,
  flat_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS central_settings (
  central_id TEXT PRIMARY KEY,
  return_fee_cents INTEGER NOT NULL DEFAULT 0,
  finish_only_by_central INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source TEXT NOT NULL,
  row_count INTEGER NOT NULL,
  csv TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS irregular_addresses (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  city_id TEXT NOT NULL,
  status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS address_cache (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  formatted TEXT NOT NULL,
  city_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS heat_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius_km REAL NOT NULL,
  intensity REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS monitoring_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius_km REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS map_sequence (
  provider TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS birthday_notices (
  audience TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  send_time TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS birthday_sends (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  year TEXT NOT NULL,
  UNIQUE (account_id, year)
);
CREATE TABLE IF NOT EXISTS whatsapp_session (
  id TEXT PRIMARY KEY,
  phone TEXT,
  status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS whatsapp_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sender TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS whatsapp_notices (
  id TEXT PRIMARY KEY,
  template TEXT NOT NULL,
  minutes_before INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS whatsapp_deliveries (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL UNIQUE,
  sent_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS smtp_settings (
  id TEXT PRIMARY KEY,
  host TEXT,
  port INTEGER,
  from_email TEXT,
  encryption TEXT,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS mail_outbox (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS confirmation_codes (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  length INTEGER NOT NULL,
  ttl_seconds INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS terms (
  id TEXT PRIMARY KEY,
  audience TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  body TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS term_acceptances (
  term_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  accepted_at TEXT NOT NULL,
  PRIMARY KEY (term_id, customer_id)
);
CREATE TABLE IF NOT EXISTS firebase_status (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  auth_on INTEGER NOT NULL DEFAULT 0,
  firestore_on INTEGER NOT NULL DEFAULT 0,
  messaging_on INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS app_versions (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  version TEXT NOT NULL,
  is_current INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS app_config (
  platform TEXT PRIMARY KEY,
  min_version TEXT NOT NULL,
  force_update INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS delivery_settings (
  city_id TEXT PRIMARY KEY,
  min_order_cents INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS driver_signup_config (
  id TEXT PRIMARY KEY,
  require_vehicle INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS delivery_sections (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS establishment_sections (
  establishment_id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_accessories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS delivery_order_accessories (
  order_id TEXT NOT NULL,
  accessory_id TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  PRIMARY KEY (order_id, accessory_id)
);
CREATE TABLE IF NOT EXISTS delivery_config (
  id TEXT PRIMARY KEY,
  dispatch_mode TEXT NOT NULL,
  max_radius_km REAL NOT NULL DEFAULT 0,
  driver_share_percent INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS asaas_settings (
  id TEXT PRIMARY KEY,
  environment TEXT NOT NULL,
  wallet_id TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS delivery_calls (
  city_id TEXT PRIMARY KEY,
  radius_km REAL NOT NULL,
  timeout_seconds INTEGER NOT NULL,
  auto_accept INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS delivery_settlements (
  id TEXT PRIMARY KEY,
  establishment_id TEXT NOT NULL,
  gross_cents INTEGER NOT NULL,
  fee_cents INTEGER NOT NULL,
  net_cents INTEGER NOT NULL,
  driver_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_settlement_orders (
  order_id TEXT PRIMARY KEY,
  settlement_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS acquirer_accounts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  public_key TEXT NOT NULL DEFAULT '',
  environment TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS acquirer_cities (
  city_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS acquirer_transactions (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL UNIQUE,
  city_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS dispatch_settings (
  id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  offer_seconds INTEGER NOT NULL,
  max_drivers INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS finance_report_snapshots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  period TEXT NOT NULL,
  gross_cents INTEGER NOT NULL,
  net_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_alerts (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS external_services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS external_city_services (
  city_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (city_id, service_id)
);
CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  url TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id TEXT PRIMARY KEY,
  webhook_id TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (webhook_id, trip_id)
);
CREATE TABLE IF NOT EXISTS app_documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  audience TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS document_requirements (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  document_id TEXT NOT NULL,
  required INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS document_files (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  driver_id TEXT,
  customer_id TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS phone_book (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT NOT NULL,
  city_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS usage_policies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  body TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS policy_acceptances (
  policy_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  accepted_at TEXT NOT NULL,
  PRIMARY KEY (policy_id, customer_id)
);
CREATE TABLE IF NOT EXISTS driver_chat_messages (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS driver_chat_log (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS suggestion_texts (
  id TEXT PRIMARY KEY,
  context TEXT NOT NULL,
  text TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS app_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  secret TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS integration_credentials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  secret TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS city_settings (
  city_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (city_id, key)
);
CREATE TABLE IF NOT EXISTS additional_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS partner_apps (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL UNIQUE,
  api_base TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS service_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  trip_type_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS delivery_menu_items (
  id TEXT PRIMARY KEY,
  establishment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS monitor_logs (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS map_general (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  traffic INTEGER NOT NULL DEFAULT 0,
  clustering INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS map_city_settings (
  city_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS route_optimizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  stops INTEGER NOT NULL,
  straight_km REAL NOT NULL,
  savings_km REAL NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_prep (
  city_id TEXT PRIMARY KEY,
  default_fee_cents INTEGER NOT NULL DEFAULT 0,
  prep_minutes INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS layout_settings (
  id TEXT PRIMARY KEY,
  density TEXT NOT NULL,
  map_style TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS map_keys (
  provider TEXT PRIMARY KEY,
  secret TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS establishments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS delivery_zones (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL,
  name TEXT NOT NULL,
  fee_cents INTEGER NOT NULL,
  radius_km REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS delivery_orders (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  establishment_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  driver_id TEXT,
  address TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  fee_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS freight_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  height_cm REAL NOT NULL,
  width_cm REAL NOT NULL,
  depth_cm REAL NOT NULL,
  weight_kg REAL NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS freight_extras (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS freight_access (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_floor_cents INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS freight_quotes (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  extra_id TEXT,
  floors INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS credit_purchases (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  buy_cents INTEGER NOT NULL,
  sell_cents INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS account_deletions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  customer_id TEXT,
  driver_id TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  requested_at TEXT NOT NULL
);
`;

const now = () => new Date().toISOString();
const cents = (value) => Math.round(Number(value) || 0);
const dollarsToCents = (value) => Math.round(Number(value || 0) * 100);

export function quoteFare(type, distanceKm, durationMin) {
  const amount =
    Number(type.base_cents) +
    Math.round(Number(distanceKm) * Number(type.per_km_cents)) +
    Math.round(Number(durationMin) * Number(type.per_minute_cents)) +
    Number(type.tax_cents || 0);
  return Math.max(Number(type.minimum_cents), amount);
}

export function attachDomain(sql) {
  sql.exec(schema);
  for (const [column, type] of [["origin_lat", "REAL"], ["origin_lng", "REAL"], ["fare_breakdown", "TEXT"]]) {
    const columns = sql.prepare("PRAGMA table_info(trips)").all().map((item) => item.name);
    if (!columns.includes(column)) sql.exec(`ALTER TABLE trips ADD COLUMN ${column} ${type}`);
  }
  const ensure = (table, column, type) => {
    const columns = sql.prepare(`PRAGMA table_info(${table})`).all().map((item) => item.name);
    if (!columns.includes(column)) sql.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  };
  ensure("call_radius", "greater_km", "REAL");
  ensure("neighborhoods", "trip_type_id", "TEXT");
  ensure("routes", "trip_type_id", "TEXT");
  for (const [column, type] of [["stops", "TEXT"], ["scheduled_at", "TEXT"], ["rider_for", "TEXT"], ["person_kind", "TEXT"], ["delivery_type", "TEXT"], ["pickup_note", "TEXT"], ["dropoff_note", "TEXT"]]) ensure("trips", column, type);
  sql.exec(`CREATE TABLE IF NOT EXISTS central_fields (
    id TEXT PRIMARY KEY,
    central_id TEXT NOT NULL,
    title TEXT NOT NULL,
    required INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS central_favorites (
    central_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    PRIMARY KEY (central_id, driver_id)
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS central_messages (
    id TEXT PRIMARY KEY,
    central_id TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS rider_logins (
    customer_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS driver_logins (
    driver_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS driver_declines (
    driver_id TEXT NOT NULL,
    trip_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (driver_id, trip_id)
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS driver_term_acceptances (
    term_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    accepted_at TEXT NOT NULL,
    PRIMARY KEY (term_id, driver_id)
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS driver_support (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS trip_ratings (
    trip_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    driver_id TEXT,
    stars INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS central_flags (
    central_id TEXT PRIMARY KEY,
    neighborhood_rides INTEGER NOT NULL DEFAULT 0
  )`);
  sql.exec(`CREATE TABLE IF NOT EXISTS whatsapp_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    driver_message TEXT NOT NULL DEFAULT '',
    auto_group INTEGER NOT NULL DEFAULT 0,
    auto_driver INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  )`);

  const one = (query, ...args) => sql.prepare(query).get(...args);
  const many = (query, ...args) => sql.prepare(query).all(...args);
  const run = (query, ...args) => sql.prepare(query).run(...args);

  function listCities() {
    return many("SELECT id, name, state, country, timezone, active, updated_at AS updatedAt FROM cities ORDER BY name");
  }

  function saveCity(body) {
    const id = body.id || randomUUID();
    const row = {
      id,
      name: String(body.name || "").trim(),
      state: String(body.state || "").trim(),
      country: String(body.country || "United States").trim(),
      timezone: String(body.timezone || "America/New_York").trim(),
      active: body.active === "no" || body.active === 0 ? 0 : 1,
      updatedAt: now(),
    };
    if (!row.name || !row.state) throw new Error("City name and state are required.");
    run(
      `INSERT INTO cities (id, name, state, country, timezone, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, state = excluded.state, country = excluded.country,
         timezone = excluded.timezone, active = excluded.active, updated_at = excluded.updated_at`,
      row.id, row.name, row.state, row.country, row.timezone, row.active, row.updatedAt
    );
    return row;
  }

  function saveAccount(body, id = body.accountId) {
    const accountId = id || randomUUID();
    const stamp = now();
    run(
      `INSERT INTO accounts (id, name, document, phone, email, birth_date, gender, status, blocked, city_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, document = excluded.document, phone = excluded.phone,
         email = excluded.email, birth_date = excluded.birth_date, gender = excluded.gender, status = excluded.status,
         blocked = excluded.blocked, city_id = excluded.city_id, updated_at = excluded.updated_at`,
      accountId,
      String(body.name || "").trim(),
      body.document || "",
      body.phone || "",
      String(body.email || "").trim().toLowerCase(),
      body.birthDate || "",
      body.gender || "",
      body.status || "active",
      body.status === "blocked" ? 1 : 0,
      body.cityId || null,
      stamp,
      stamp
    );
    return accountId;
  }

  function listCustomers(q = "") {
    const like = `%${q.toLowerCase()}%`;
    return many(
      `SELECT c.id, a.name, a.phone, a.email, a.document, a.gender, a.birth_date AS birthDate,
              c.balance_cents AS balance, c.register_status AS status, cities.name AS city, cities.id AS cityId, a.id AS accountId
       FROM customers c
       JOIN accounts a ON a.id = c.account_id
       LEFT JOIN cities ON cities.id = a.city_id
       WHERE lower(a.name) LIKE ? OR lower(a.email) LIKE ? OR lower(a.phone) LIKE ? OR lower(COALESCE(a.document, '')) LIKE ?
       ORDER BY a.name`,
      like, like, like, like
    );
  }

  function saveCustomer(body) {
    if (!String(body.name || "").trim()) throw new Error("Customer name is required.");
    const existing = body.id ? one("SELECT account_id FROM customers WHERE id = ?", body.id) : null;
    const accountId = saveAccount(body, existing?.account_id);
    const id = body.id || randomUUID();
    if ((body.status || "active") === "active" && one("SELECT id FROM app_documents WHERE audience = 'rider' AND required = 1 AND active = 1 AND NOT EXISTS (SELECT 1 FROM document_files f WHERE f.document_id = app_documents.id AND f.customer_id = ? AND f.status = 'approved')", id)) throw new Error("This rider is missing a required document.");
    run(
      `INSERT INTO customers (id, account_id, balance_cents, register_status, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET register_status = excluded.register_status, updated_at = excluded.updated_at`,
      id, accountId, existing ? one("SELECT balance_cents FROM customers WHERE id = ?", id).balance_cents : 0, body.status || "active", now()
    );
    return listCustomers().find((item) => item.id === id);
  }

  function registerRider(body) {
    const email = String(body.email || "").trim().toLowerCase();
    if (!body.acceptedTerms) throw new Error("Accept the terms to create an account.");
    if (!email || !body.passwordHash || !body.cityId || !String(body.name || "").trim() || !String(body.phone || "").trim()) throw new Error("Name, phone, email, city and password are required.");
    if (String(body.password || "").length > 0 && String(body.password).length < 8) throw new Error("Use at least 8 characters.");
    if (one("SELECT customer_id FROM rider_logins WHERE email = ?", email)) throw new Error("This email is already in use.");
    const customer = saveCustomer({ name: body.name, phone: body.phone, email, cityId: body.cityId, birthDate: body.birthDate || "", document: body.document || "", status: "active" });
    many("SELECT id FROM terms WHERE active = 1 AND audience IN ('rider', 'both')").forEach((term) => acceptTerms({ termId: term.id, customerId: customer.id }));
    const policy = one("SELECT id FROM usage_policies WHERE active = 1");
    if (policy) acceptPolicy({ policyId: policy.id, customerId: customer.id });
    run("INSERT INTO rider_logins (customer_id, email, password) VALUES (?, ?, ?)", customer.id, email, body.passwordHash);
    return { id: customer.id, name: customer.name, email, cityId: customer.cityId, balance: customer.balance };
  }
  function findRiderLogin(email) {
    return one(
      `SELECT rider_logins.customer_id AS id, rider_logins.email, rider_logins.password, accounts.name, accounts.city_id AS cityId, customers.balance_cents AS balance
       FROM rider_logins
       JOIN customers ON customers.id = rider_logins.customer_id
       JOIN accounts ON accounts.id = customers.account_id
       WHERE rider_logins.email = ?`,
      String(email || "").trim().toLowerCase()
    );
  }
  function quoteRider(body) {
    const type = one("SELECT * FROM trip_types WHERE id = ? AND city_id = ? AND active = 1", body.tripTypeId, body.cityId);
    if (!type) throw new Error("Choose an active trip type.");
    const originLat = Number(body.originLat);
    const originLng = Number(body.originLng);
    const destinationLat = Number(body.destinationLat);
    const destinationLng = Number(body.destinationLng);
    if (![originLat, originLng, destinationLat, destinationLng].every((value) => Number.isFinite(value))) throw new Error("Origin and destination coordinates are required.");
    const distanceKm = Math.round(haversine(originLat, originLng, destinationLat, destinationLng) * 10) / 10;
    if (!(distanceKm > 0)) throw new Error("The destination must be away from the origin.");
    const durationMin = Math.max(1, Math.round((distanceKm / 25) * 60));
    const priced = priceTrip(type, { distanceKm, durationMin, coupon: body.coupon, payment: body.payment || "cash", originLat, originLng });
    let fare = priced.fare;
    const heat = many("SELECT latitude, longitude, radius_km, intensity FROM heat_areas WHERE city_id = ? AND active = 1", type.city_id)
      .find((area) => haversine(originLat, originLng, area.latitude, area.longitude) <= Number(area.radius_km));
    if (heat) fare = Math.round(fare * Number(heat.intensity));
    return { tripTypeId: type.id, name: type.name, distanceKm, durationMin, fare };
  }
  function requestRiderTrip(body) {
    const quote = quoteRider(body);
    if ((body.payment || "cash") === "wallet") {
      const wallet = one("SELECT balance_cents FROM customers WHERE id = ?", body.customerId);
      if (!wallet || wallet.balance_cents < quote.fare) throw new Error("Wallet balance is not enough for this fare.");
    }
    return saveTrip({
      customerId: body.customerId,
      tripTypeId: quote.tripTypeId,
      origin: String(body.origin || "").trim(),
      destination: String(body.destination || "").trim(),
      distanceKm: quote.distanceKm,
      durationMin: quote.durationMin,
      payment: body.payment || "cash",
      coupon: body.coupon || "",
      originLat: Number(body.originLat),
      originLng: Number(body.originLng),
      status: "requested",
    });
  }
  function riderTrips(customerId) {
    return many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare, trips.payment,
              trips.distance_km AS distanceKm, trips.duration_min AS durationMin, driverAccount.name AS driver, drivers.rating,
              (SELECT stars FROM trip_ratings WHERE trip_id = trips.id) AS stars
       FROM trips
       LEFT JOIN drivers ON drivers.id = trips.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       WHERE trips.customer_id = ?
       ORDER BY trips.created_at DESC LIMIT 30`,
      customerId
    );
  }
  function rateRiderTrip(body) {
    const stars = Number(body.stars);
    const trip = one("SELECT id, status, customer_id AS customerId, driver_id AS driverId FROM trips WHERE id = ?", body.tripId);
    if (!trip || trip.customerId !== body.customerId) throw new Error("Choose your completed trip.");
    if (trip.status !== "completed") throw new Error("Rate the trip after it is finished.");
    if (!(stars >= 1 && stars <= 5)) throw new Error("Choose a rating from 1 to 5.");
    if (one("SELECT trip_id FROM trip_ratings WHERE trip_id = ?", trip.id)) throw new Error("This trip is already rated.");
    run("INSERT INTO trip_ratings (trip_id, customer_id, driver_id, stars, created_at) VALUES (?, ?, ?, ?, ?)", trip.id, body.customerId, trip.driverId, stars, now());
    if (trip.driverId) {
      const average = one("SELECT AVG(stars) AS rating FROM trip_ratings WHERE driver_id = ?", trip.driverId);
      run("UPDATE drivers SET rating = ?, updated_at = ? WHERE id = ?", Number(average.rating), now(), trip.driverId);
    }
    return { tripId: trip.id, stars };
  }
  function riderCoupons(cityId) {
    return many("SELECT code, kind, percent, fixed_cents AS fixed, substr(valid_until, 1, 10) AS validUntil FROM coupons WHERE active = 1 AND (city_id IS NULL OR city_id = ?) ORDER BY code", cityId);
  }
  function riderPlaces(cityId, q = "") {
    const text = String(q || "").trim().toLowerCase();
    const named = searchAddresses(cityId, q).filter((item) => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)) && Number(item.lat) !== 0);
    if (!cityId || text.length < 2) return named;
    const pinned = many(
      `SELECT origin AS name, origin AS address, origin_lat AS lat, origin_lng AS lng
       FROM trips
       WHERE city_id = ? AND origin_lat IS NOT NULL AND origin_lng != 0 AND lower(origin) LIKE ?
       GROUP BY origin, origin_lat, origin_lng
       LIMIT 8`,
      cityId, `%${text}%`
    );
    return [...named, ...pinned];
  }

  function listCompanies(q = "") {
    const like = `%${q.toLowerCase()}%`;
    return many(
      `SELECT companies.id, legal_name AS name, trade_name AS tradeName, document, email, phone, address,
              balance_cents AS balance, credit_limit_cents AS creditLimit, status, cities.name AS city, city_id AS cityId
       FROM companies LEFT JOIN cities ON cities.id = companies.city_id
       WHERE lower(legal_name) LIKE ? OR lower(trade_name) LIKE ? OR lower(document) LIKE ?
       ORDER BY legal_name`,
      like, like, like
    );
  }

  function saveCompany(body) {
    if (!String(body.name || "").trim()) throw new Error("Legal name is required.");
    const id = body.id || randomUUID();
    const current = body.id ? one("SELECT balance_cents FROM companies WHERE id = ?", id) : null;
    run(
      `INSERT INTO companies (id, legal_name, trade_name, document, email, phone, address, city_id, balance_cents, credit_limit_cents, status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET legal_name = excluded.legal_name, trade_name = excluded.trade_name, document = excluded.document,
         email = excluded.email, phone = excluded.phone, address = excluded.address, city_id = excluded.city_id,
         credit_limit_cents = excluded.credit_limit_cents, status = excluded.status, updated_at = excluded.updated_at`,
      id, body.name.trim(), body.tradeName || "", body.document || "", body.email || "", body.phone || "", body.address || "",
      body.cityId || null, current?.balance_cents || 0, dollarsToCents(body.creditLimit), body.status || "active", now()
    );
    return listCompanies().find((item) => item.id === id);
  }

  function listDrivers(q = "") {
    const like = `%${q.toLowerCase()}%`;
    return many(
      `SELECT d.id, a.name, a.phone, a.email, a.document, d.cnh, d.vehicle, d.plate, d.rating, d.presence,
              d.register_status AS status, d.service, d.balance_cents AS balance, d.latitude AS lat, d.longitude AS lng,
              cities.name AS city, d.city_id AS cityId, a.id AS accountId
       FROM drivers d
       JOIN accounts a ON a.id = d.account_id
       LEFT JOIN cities ON cities.id = d.city_id
       WHERE lower(a.name) LIKE ? OR lower(a.email) LIKE ? OR lower(d.plate) LIKE ?
       ORDER BY a.name`,
      like, like, like
    );
  }

  function saveDriver(body) {
    if (!String(body.name || "").trim()) throw new Error("Driver name is required.");
    if (one("SELECT require_vehicle FROM driver_signup_config WHERE id = 'default'")?.require_vehicle && !String(body.vehicle || "").trim()) throw new Error("This signup requires a vehicle.");
    const existing = body.id ? one("SELECT account_id, balance_cents, rating, latitude, longitude FROM drivers WHERE id = ?", body.id) : null;
    const accountId = saveAccount({ ...body, status: body.status || "pending" }, existing?.account_id);
    const id = body.id || randomUUID();
    if ((body.status || "pending") === "approved" && missingDriverDocument(id, body.service || "private")) throw new Error("This driver is missing a required document.");
    run(
      `INSERT INTO drivers (id, account_id, city_id, register_status, presence, service, cnh, vehicle, plate, rating, balance_cents, latitude, longitude, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET city_id = excluded.city_id, register_status = excluded.register_status, presence = excluded.presence,
         service = excluded.service, cnh = excluded.cnh, vehicle = excluded.vehicle, plate = excluded.plate, rating = excluded.rating,
         latitude = excluded.latitude, longitude = excluded.longitude, updated_at = excluded.updated_at`,
      id, accountId, body.cityId || null, body.status || "pending", body.presence || "offline", body.service || "private",
      body.cnh || "", body.vehicle || "", body.plate || "", Number(body.rating || existing?.rating || 5),
      existing?.balance_cents || 0,
      body.lat === undefined || body.lat === "" ? Number(existing?.latitude || 0) : Number(body.lat),
      body.lng === undefined || body.lng === "" ? Number(existing?.longitude || 0) : Number(body.lng),
      now()
    );
    return listDrivers().find((item) => item.id === id);
  }

  function registerDriver(body) {
    const email = String(body.email || "").trim().toLowerCase();
    if (!body.acceptedTerms) throw new Error("Accept the terms to create an account.");
    if (!email || !body.passwordHash || !body.cityId || !String(body.name || "").trim() || !String(body.phone || "").trim() || !String(body.vehicle || "").trim() || !String(body.plate || "").trim()) throw new Error("Name, phone, email, city, vehicle and plate are required.");
    if (one("SELECT driver_id FROM driver_logins WHERE email = ?", email)) throw new Error("This email is already in use.");
    const driver = saveDriver({ name: body.name, phone: body.phone, email, cityId: body.cityId, vehicle: body.vehicle.trim(), plate: body.plate.trim(), status: "pending", presence: "offline", service: "private" });
    const approved = !missingDriverDocument(driver.id, "private");
    if (approved) run("UPDATE drivers SET register_status = 'approved', updated_at = ? WHERE id = ?", now(), driver.id);
    many("SELECT id FROM terms WHERE active = 1 AND audience IN ('driver', 'both')").forEach((term) => {
      run("INSERT INTO driver_term_acceptances (term_id, driver_id, accepted_at) VALUES (?, ?, ?) ON CONFLICT(term_id, driver_id) DO UPDATE SET accepted_at = excluded.accepted_at", term.id, driver.id, now());
    });
    run("INSERT INTO driver_logins (driver_id, email, password) VALUES (?, ?, ?)", driver.id, email, body.passwordHash);
    return findDriverLogin(email);
  }
  function findDriverLogin(email) {
    const row = one(
      `SELECT driver_logins.driver_id AS id, driver_logins.email, driver_logins.password, accounts.name, accounts.phone, accounts.city_id AS cityId,
              drivers.balance_cents AS balance, drivers.presence, drivers.register_status AS status, drivers.vehicle, drivers.plate, drivers.rating,
              drivers.latitude AS lat, drivers.longitude AS lng, cities.name AS city
       FROM driver_logins
       JOIN drivers ON drivers.id = driver_logins.driver_id
       JOIN accounts ON accounts.id = drivers.account_id
       LEFT JOIN cities ON cities.id = drivers.city_id
       WHERE driver_logins.email = ?`,
      String(email || "").trim().toLowerCase()
    );
    if (!row) return null;
    const { password, ...driver } = row;
    driver.password = password;
    return driver;
  }
  function driverPublic(email) {
    const driver = findDriverLogin(email);
    if (!driver) return null;
    delete driver.password;
    return driver;
  }
  function setDriverPresence(body) {
    const driver = one("SELECT * FROM drivers WHERE id = ?", body.driverId);
    if (!driver) throw new Error("Choose a driver.");
    if (body.presence === "available") {
      if (driver.register_status !== "approved") throw new Error("This driver is not approved.");
      if (missingDriverDocument(driver.id, driver.service)) throw new Error("This driver is missing a required document.");
      const lat = Number(body.lat);
      const lng = Number(body.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error("Location is required to go online.");
      run("UPDATE drivers SET presence = 'available', latitude = ?, longitude = ?, updated_at = ? WHERE id = ?", lat, lng, now(), driver.id);
    } else {
      if (one("SELECT id FROM trips WHERE driver_id = ? AND status IN ('accepted', 'arriving', 'in_progress')", driver.id)) throw new Error("Finish the current trip before going offline.");
      run("UPDATE drivers SET presence = 'offline', updated_at = ? WHERE id = ?", now(), driver.id);
    }
    return one("SELECT presence, latitude AS lat, longitude AS lng, register_status AS status FROM drivers WHERE id = ?", driver.id);
  }
  function driverOffers(driverId) {
    const driver = one("SELECT * FROM drivers WHERE id = ?", driverId);
    if (!driver) throw new Error("Choose a driver.");
    const radius = Number(one("SELECT radius_km FROM call_radius WHERE city_id = ?", driver.city_id)?.radius_km || 0);
    const offerSeconds = Number(one("SELECT offer_seconds FROM dispatch_settings WHERE id = 'default'")?.offer_seconds || 0);
    const rows = many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare, trips.payment,
              trips.distance_km AS distanceKm, trips.duration_min AS durationMin, trips.origin_lat AS lat, trips.origin_lng AS lng,
              trips.scheduled_at AS scheduledAt, trips.driver_id AS driverId, accounts.name AS rider
       FROM trips
       LEFT JOIN customers ON customers.id = trips.customer_id
       LEFT JOIN accounts ON accounts.id = customers.account_id
       WHERE trips.city_id = ?
         AND trips.status IN ('requested', 'offered', 'accepted', 'arriving', 'in_progress')
         AND NOT EXISTS (SELECT 1 FROM driver_declines WHERE driver_id = ? AND trip_id = trips.id)
         AND (trips.driver_id = ? OR (trips.driver_id IS NULL AND trips.status = 'requested'))
       ORDER BY trips.created_at DESC LIMIT 20`,
      driver.city_id, driverId, driverId
    );
    const items = rows.filter((trip) => {
      if (trip.driverId) return true;
      if (!(radius > 0) || !Number(driver.latitude) || !Number(driver.longitude) || trip.lat == null) return false;
      return haversine(Number(driver.latitude), Number(driver.longitude), Number(trip.lat), Number(trip.lng)) <= radius;
    });
    const grouped = Boolean(one("SELECT call_groups.id FROM call_groups WHERE city_id = ? AND active = 1", driver.city_id));
    const inGroup = Boolean(one("SELECT call_group_drivers.driver_id FROM call_group_drivers JOIN call_groups ON call_groups.id = call_group_drivers.group_id WHERE call_group_drivers.driver_id = ? AND call_groups.city_id = ? AND call_groups.active = 1", driverId, driver.city_id));
    return { items, radiusKm: radius, offerSeconds, grouped, inGroup };
  }
  function driverAct(body) {
    const driver = one("SELECT * FROM drivers WHERE id = ?", body.driverId);
    const trip = one("SELECT * FROM trips WHERE id = ?", body.tripId);
    if (!driver || !trip || trip.city_id !== driver.city_id) throw new Error("This trip is not in your city.");
    const action = body.action;
    if (driver.register_status !== "approved") throw new Error("This driver is not approved.");
    const owns = trip.driver_id === driver.id;
    if (action === "accept") {
      if (driver.presence === "offline") throw new Error("Go online before accepting a trip.");
      if (!["requested", "offered"].includes(trip.status)) throw new Error("This trip is no longer available.");
      if (trip.driver_id && !owns) throw new Error("Another driver has this trip.");
      if (one("SELECT id FROM trips WHERE driver_id = ? AND status IN ('accepted', 'arriving', 'in_progress') AND id != ?", driver.id, trip.id)) throw new Error("Finish the current trip first.");
      const radius = Number(one("SELECT radius_km FROM call_radius WHERE city_id = ?", driver.city_id)?.radius_km || 0);
      if (trip.status === "requested" && radius > 0 && trip.origin_lat != null && haversine(Number(driver.latitude), Number(driver.longitude), Number(trip.origin_lat), Number(trip.origin_lng)) > radius) throw new Error("This trip is outside your service radius.");
      run("UPDATE trips SET status = 'accepted', driver_id = ?, updated_at = ? WHERE id = ?", driver.id, now(), trip.id);
      run("UPDATE drivers SET presence = 'on_trip', updated_at = ? WHERE id = ?", now(), driver.id);
    } else if (action === "arrive") {
      if (!owns || trip.status !== "accepted") throw new Error("Arrive only after you accept the trip.");
      run("UPDATE trips SET status = 'arriving', updated_at = ? WHERE id = ?", now(), trip.id);
      run("UPDATE drivers SET presence = 'en_route', updated_at = ? WHERE id = ?", now(), driver.id);
    } else if (action === "start") {
      if (!owns || !["accepted", "arriving"].includes(trip.status)) throw new Error("Start the trip after you reach the rider.");
      run("UPDATE trips SET status = 'in_progress', updated_at = ? WHERE id = ?", now(), trip.id);
      run("UPDATE drivers SET presence = 'on_trip', updated_at = ? WHERE id = ?", now(), driver.id);
    } else if (action === "finish") {
      if (!owns || trip.status !== "in_progress") throw new Error("Finish the trip only while it is in progress.");
      if (trip.payment === "wallet" && trip.customer_id) {
        const customer = one("SELECT balance_cents FROM customers WHERE id = ?", trip.customer_id);
        if (!customer || customer.balance_cents < trip.fare_cents) throw new Error("Wallet balance is not enough for this fare.");
        run("UPDATE customers SET balance_cents = balance_cents - ?, updated_at = ? WHERE id = ?", trip.fare_cents, now(), trip.customer_id);
      }
      run("UPDATE trips SET status = 'completed', updated_at = ? WHERE id = ?", now(), trip.id);
      adjustDriverBalance(driver.id, Number(trip.fare_cents) - commissionAmount(trip));
      payManager(trip.id, driver.id, trip.fare_cents);
      run("UPDATE drivers SET presence = 'available', updated_at = ? WHERE id = ?", now(), driver.id);
    } else if (action === "decline") {
      if (owns && ["in_progress", "completed"].includes(trip.status)) throw new Error("This trip can no longer be declined.");
      if (trip.driver_id && !owns) throw new Error("This trip belongs to another driver.");
      run("INSERT INTO driver_declines (driver_id, trip_id, created_at) VALUES (?, ?, ?) ON CONFLICT(driver_id, trip_id) DO UPDATE SET created_at = excluded.created_at", driver.id, trip.id, now());
      if (owns && ["offered", "accepted", "arriving"].includes(trip.status)) {
        run("UPDATE trips SET status = 'requested', driver_id = NULL, updated_at = ? WHERE id = ?", now(), trip.id);
        run("UPDATE drivers SET presence = 'available', updated_at = ? WHERE id = ?", now(), driver.id);
      }
    } else if (action === "cancel") {
      if (!owns || !["accepted", "arriving"].includes(trip.status)) throw new Error("This trip cannot be canceled now.");
      const reason = one("SELECT id FROM cancel_reasons WHERE id = ? AND active = 1 AND audience = 'driver'", body.reasonId);
      if (!reason) throw new Error("Choose an active cancellation reason.");
      run("UPDATE trips SET status = 'cancelled', cancelled_by = 'driver', updated_at = ? WHERE id = ?", now(), trip.id);
      run("UPDATE drivers SET presence = 'available', updated_at = ? WHERE id = ?", now(), driver.id);
    } else throw new Error("Choose a trip action.");
    return driverOffers(driver.id);
  }
  function driverTrips(driverId) {
    return many(
      `SELECT id, reference, status, origin, destination, fare_cents AS fare, payment, distance_km AS distanceKm, duration_min AS durationMin
       FROM trips WHERE driver_id = ? ORDER BY created_at DESC LIMIT 30`,
      driverId
    );
  }
  function driverEarnings(driverId) {
    const trips = many("SELECT id, reference, origin, destination, fare_cents, city_id, trip_type_id FROM trips WHERE driver_id = ? AND status = 'completed' ORDER BY created_at DESC LIMIT 30", driverId);
    const items = trips.map((trip) => {
      const commission = commissionAmount(trip);
      return { id: trip.id, reference: trip.reference, origin: trip.origin, destination: trip.destination, gross: Number(trip.fare_cents), commission, net: Number(trip.fare_cents) - commission };
    });
    const gross = items.reduce((sum, item) => sum + item.gross, 0);
    const commission = items.reduce((sum, item) => sum + item.commission, 0);
    return { items, gross, commission, net: gross - commission, balance: Number(one("SELECT balance_cents FROM drivers WHERE id = ?", driverId)?.balance_cents || 0) };
  }
  function driverDocuments(driverId) {
    return many(
      `SELECT app_documents.id, app_documents.name, app_documents.required,
              (SELECT status FROM document_files WHERE document_id = app_documents.id AND driver_id = ? ORDER BY created_at DESC LIMIT 1) AS status
       FROM app_documents WHERE audience = 'driver' AND active = 1 ORDER BY name`,
      driverId
    );
  }
  function submitDriverFile(body) {
    const doc = one("SELECT id FROM app_documents WHERE id = ? AND audience = 'driver' AND active = 1", body.documentId);
    if (!doc || !body.driverId) throw new Error("Choose an active document.");
    run("INSERT INTO document_files (id, document_id, driver_id, customer_id, status, created_at) VALUES (?, ?, ?, NULL, 'submitted', ?)", randomUUID(), doc.id, body.driverId, now());
    return driverDocuments(body.driverId);
  }
  function driverZones(cityId) {
    return many("SELECT name, radius_km AS radiusKm, multiplier FROM dynamic_areas WHERE city_id = ? AND active = 1 ORDER BY name", cityId);
  }
  function driverDeliveries(driverId) {
    return many(
      `SELECT delivery_orders.id, delivery_orders.code, establishments.name AS place, delivery_orders.address, delivery_orders.total_cents AS total, delivery_orders.status
       FROM delivery_orders JOIN establishments ON establishments.id = delivery_orders.establishment_id
       WHERE delivery_orders.driver_id = ? ORDER BY delivery_orders.created_at DESC LIMIT 20`,
      driverId
    );
  }
  function driverSchedule(driverId) {
    const driver = one("SELECT city_id FROM drivers WHERE id = ?", driverId);
    if (!driver) throw new Error("Choose a driver.");
    return many(
      `SELECT id, reference, origin, destination, scheduled_at AS scheduledAt, status, fare_cents AS fare
       FROM trips WHERE city_id = ? AND scheduled_at != '' AND status IN ('requested', 'offered', 'accepted') AND (driver_id = ? OR driver_id IS NULL)
       ORDER BY scheduled_at LIMIT 20`,
      driver.city_id, driverId
    );
  }
  function driverAds(cityId) {
    return many("SELECT title, link FROM app_ads WHERE active = 1 AND audience = 'driver' AND (city_id IS NULL OR city_id = ?) ORDER BY title", cityId);
  }
  function driverMessages() {
    return many("SELECT id, code, message FROM driver_chat_messages WHERE active = 1 ORDER BY code");
  }
  function driverReasons() {
    return many("SELECT id, reason FROM cancel_reasons WHERE active = 1 AND audience = 'driver' ORDER BY reason");
  }
  function openDriverSupport(body) {
    if (!body.driverId || !String(body.subject || "").trim() || !String(body.message || "").trim()) throw new Error("Subject and message are required.");
    if (one("SELECT id FROM driver_support WHERE driver_id = ? AND status = 'open'", body.driverId)) throw new Error("This driver already has an open ticket.");
    const id = randomUUID();
    run("INSERT INTO driver_support (id, driver_id, subject, message, status, created_at) VALUES (?, ?, ?, ?, 'open', ?)", id, body.driverId, body.subject.trim(), body.message.trim(), now());
    return { id, status: "open" };
  }

  function listTripTypes() {
    return many(
      `SELECT t.id, t.name, t.base_cents AS base, t.per_km_cents AS perKm, t.per_minute_cents AS perMin,
              t.minimum_cents AS minimum, t.tax_cents AS tax, t.seats, t.active, cities.name AS city, t.city_id AS cityId
       FROM trip_types t JOIN cities ON cities.id = t.city_id ORDER BY cities.name, t.name`
    );
  }

  function saveTripType(body) {
    if (!body.name || !body.cityId) throw new Error("Trip type needs a name and a city.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO trip_types (id, city_id, name, base_cents, per_km_cents, per_minute_cents, minimum_cents, tax_cents, seats, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET city_id = excluded.city_id, name = excluded.name, base_cents = excluded.base_cents,
         per_km_cents = excluded.per_km_cents, per_minute_cents = excluded.per_minute_cents, minimum_cents = excluded.minimum_cents,
         tax_cents = excluded.tax_cents, seats = excluded.seats, active = excluded.active, updated_at = excluded.updated_at`,
      id, body.cityId, body.name.trim(), dollarsToCents(body.base), dollarsToCents(body.perKm), dollarsToCents(body.perMin),
      dollarsToCents(body.minimum), dollarsToCents(body.tax), Number(body.seats || 4), body.active === "no" ? 0 : 1, now()
    );
    return listTripTypes().find((item) => item.id === id);
  }
  function listCityTariffs(cityId) {
    let list = many("SELECT id, name, base_cents AS base, per_km_cents AS perKm, per_minute_cents AS perMin, minimum_cents AS minimum, tax_cents AS tax, seats, active FROM trip_types WHERE city_id = ? ORDER BY name", cityId);
    if (!list.length) {
      list = many("SELECT id, name, base_cents AS base, per_km_cents AS perKm, per_minute_cents AS perMin, minimum_cents AS minimum, tax_cents AS tax, seats, active FROM trip_types WHERE active = 1 ORDER BY name LIMIT 10");
    }
    return list;
  }

  function listTrips(q = "") {
    const like = `%${q.toLowerCase()}%`;
    return many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.distance_km AS distanceKm,
              trips.duration_min AS durationMin, trips.fare_cents AS fare, trips.payment, trips.cancelled_by AS cancelledBy,
              substr(trips.created_at, 1, 10) AS day, customerAccount.name AS rider, driverAccount.name AS driver,
              cities.name AS city, trip_types.name AS tripType, trips.customer_id AS customerId, trips.driver_id AS driverId,
              trips.city_id AS cityId, trips.trip_type_id AS tripTypeId, trips.company_id AS companyId
       FROM trips
       LEFT JOIN customers ON customers.id = trips.customer_id
       LEFT JOIN accounts customerAccount ON customerAccount.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = trips.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       LEFT JOIN cities ON cities.id = trips.city_id
       JOIN trip_types ON trip_types.id = trips.trip_type_id
       WHERE lower(trips.reference) LIKE ? OR lower(COALESCE(customerAccount.name, '')) LIKE ? OR lower(trips.origin) LIKE ?
       ORDER BY trips.created_at DESC`,
      like, like, like
    );
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const earth = 6371;
    const lat = ((lat2 - lat1) * Math.PI) / 180;
    const lon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(lat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(lon / 2) ** 2;
    return 2 * earth * Math.asin(Math.sqrt(a));
  }

  function localTime(cityId) {
    const city = one("SELECT timezone FROM cities WHERE id = ?", cityId);
    return new Date().toLocaleTimeString("en-GB", { timeZone: city?.timezone || "America/New_York", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  }

  function priceTrip(type, body) {
    let fare = quoteFare(type, body.distanceKm, body.durationMin);
    const parts = [{ name: "tariff", cents: fare }];
    const apply = (name, next) => {
      parts.push({ name, cents: next - fare });
      fare = next;
    };
    const flag = one("SELECT multiplier FROM tariff_flags WHERE city_id = ? AND active = 1 ORDER BY updated_at DESC LIMIT 1", type.city_id);
    if (flag && Number(flag.multiplier) > 0 && Number(flag.multiplier) !== 1) apply("flag", Math.round(fare * Number(flag.multiplier)));
    const clock = localTime(type.city_id);
    const trigger = many("SELECT starts_at, ends_at, multiplier FROM tariff_triggers WHERE city_id = ? AND active = 1", type.city_id).find((item) => item.starts_at <= clock && clock <= item.ends_at);
    if (trigger) apply("trigger", Math.round(fare * Number(trigger.multiplier)));
    const lat = body.originLat === "" || body.originLat == null ? null : Number(body.originLat);
    const lng = body.originLng === "" || body.originLng == null ? null : Number(body.originLng);
    if (lat != null && lng != null) {
      const area = many("SELECT latitude, longitude, radius_km, multiplier FROM dynamic_areas WHERE city_id = ? AND active = 1", type.city_id).find(
        (item) => haversine(lat, lng, item.latitude, item.longitude) <= Number(item.radius_km)
      );
      if (area) apply("surge", Math.round(fare * Number(area.multiplier)));
    }
    const toll = many("SELECT amount_cents FROM tolls WHERE city_id = ? AND active = 1", type.city_id).reduce((sum, item) => sum + Number(item.amount_cents), 0);
    if (toll) apply("toll", fare + toll);
    if (String(body.coupon || "").trim()) {
      const coupon = one("SELECT * FROM coupons WHERE upper(code) = ? AND active = 1", String(body.coupon).trim().toUpperCase());
      if (!coupon) throw new Error("Coupon is not active.");
      if (coupon.city_id && coupon.city_id !== type.city_id) throw new Error("Coupon does not apply in this city.");
      if (coupon.payment !== "any" && coupon.payment !== (body.payment || "card")) throw new Error("Coupon does not apply to this payment method.");
      if (coupon.valid_until && coupon.valid_until < now().slice(0, 10)) throw new Error("Coupon is expired.");
      let discount = coupon.kind === "percent" ? Math.round(fare * Number(coupon.percent) / 100) : Number(coupon.fixed_cents);
      if (coupon.max_cents) discount = Math.min(discount, Number(coupon.max_cents));
      discount = Math.min(discount, fare);
      apply("coupon", fare - discount);
    }
    return { fare, parts };
  }

  function assignDriver(cityId, lat, lng, service, radiusOverride) {
    const radius = radiusOverride > 0 ? Number(radiusOverride) : Number(one("SELECT radius_km FROM call_radius WHERE city_id = ?", cityId)?.radius_km || 0);
    if (radius <= 0) return null;
    const groups = many("SELECT id, strategy FROM call_groups WHERE city_id = ? AND active = 1", cityId);
    const grouped = groups.length > 0;
    const drivers = many(
      `SELECT d.id, d.latitude, d.longitude, MIN(cgd.priority) AS priority
       FROM drivers d
       LEFT JOIN call_group_drivers cgd ON cgd.driver_id = d.id
       LEFT JOIN call_groups cg ON cg.id = cgd.group_id AND cg.city_id = d.city_id AND cg.active = 1
       WHERE d.city_id = ? AND d.register_status = 'approved' AND d.presence = 'available' AND d.service = ?
         AND (? = 0 OR cg.id IS NOT NULL)
         AND NOT EXISTS (SELECT 1 FROM driver_penalties p WHERE p.driver_id = d.id AND p.suspended_until IS NOT NULL AND p.suspended_until > ?)
       GROUP BY d.id`,
      cityId,
      service,
      grouped ? 1 : 0,
      now()
    );
    const queue = grouped && groups.every((group) => group.strategy === "queue");
    const strategy = queue ? "queue" : groups.some((group) => group.strategy === "broadcast") && groups.every((group) => group.strategy !== "nearest") ? "broadcast" : "nearest";
    const zones = many("SELECT latitude, longitude, radius_km FROM monitoring_areas WHERE city_id = ? AND active = 1", cityId);
    let best = null;
    drivers.forEach((driver) => {
      if (driver.latitude == null || driver.longitude == null) return;
      if (zones.length && !zones.some((zone) => haversine(driver.latitude, driver.longitude, zone.latitude, zone.longitude) <= Number(zone.radius_km))) return;
      const km = haversine(lat, lng, driver.latitude, driver.longitude);
      if (km > radius) return;
      const better = !best || (queue ? driver.priority < best.priority || (driver.priority === best.priority && km < best.km) : km < best.km);
      if (better) best = { id: driver.id, km, priority: driver.priority, strategy: queue ? "queue" : strategy };
    });
    return best;
  }

  function saveTrip(body) {
    let type = one("SELECT * FROM trip_types WHERE id = ? AND active = 1", body.tripTypeId);
    if (!type) {
      type = one("SELECT * FROM trip_types WHERE id = ?", body.tripTypeId);
    }
    if (!type) throw new Error("Choose an active trip type.");
    if (!body.origin || !body.destination) throw new Error("Origin and destination are required.");
    const distanceKm = Number(body.distanceKm || 0);
    const durationMin = Number(body.durationMin || 0);
    if (distanceKm <= 0) throw new Error("Distance must be greater than zero.");
    const currentTerms = one("SELECT id FROM terms WHERE active = 1 AND audience IN ('rider', 'both')");
    if (currentTerms && body.customerId && !one("SELECT term_id FROM term_acceptances WHERE term_id = ? AND customer_id = ?", currentTerms.id, body.customerId)) throw new Error("The rider has not accepted the current terms.");
    const policy = one("SELECT id FROM usage_policies WHERE active = 1");
    if (policy && body.customerId && !one("SELECT policy_id FROM policy_acceptances WHERE policy_id = ? AND customer_id = ?", policy.id, body.customerId)) throw new Error("The rider has not accepted the usage policy.");
    if (body.customerId && one("SELECT id FROM app_documents WHERE audience = 'rider' AND required = 1 AND active = 1 AND NOT EXISTS (SELECT 1 FROM document_files f WHERE f.document_id = app_documents.id AND f.customer_id = ? AND f.status = 'approved')", body.customerId)) throw new Error("The rider is missing a required document.");
    if (one("SELECT id FROM service_types WHERE city_id = ? AND active = 1", type.city_id) && !one("SELECT id FROM service_types WHERE city_id = ? AND trip_type_id = ? AND active = 1", type.city_id, type.id)) throw new Error("This trip type is not an active service in the city.");
    const id = body.id || randomUUID();
    const existing = body.id ? one("SELECT reference, created_at, status FROM trips WHERE id = ?", id) : null;
    const reference = existing?.reference || `MV-${Date.now().toString().slice(-6)}`;
    assertModule("trips");
    const payment = body.payment || "card";
    const hasPayConfig = one("SELECT id FROM payment_methods WHERE city_id = ?", type.city_id);
    if (hasPayConfig && !one("SELECT id FROM payment_methods WHERE city_id = ? AND code = ? AND active = 1", type.city_id, payment)) throw new Error("This payment method is not active in the city.");
    if (payment === "cash" && one("SELECT value FROM city_settings WHERE city_id = ? AND key = 'cash_enabled'", type.city_id)?.value === "no") throw new Error("Cash is turned off in this city.");
    if (!body.id && body.customerId) {
      const limit = Number(one("SELECT value FROM additional_settings WHERE key = 'max_open_trips'")?.value || 0);
      const open = Number(one("SELECT COUNT(*) AS total FROM trips WHERE customer_id = ? AND status IN ('requested', 'accepted', 'offered', 'in_progress')", body.customerId)?.total || 0);
      if (limit > 0 && open >= limit) throw new Error("This rider already has an open trip.");
    }
    const priced = priceTrip(type, { ...body, distanceKm, durationMin });
    let fare = priced.fare;
    if (body.centralId) {
      const central = one("SELECT * FROM centrals WHERE id = ?", body.centralId);
      if (!central || central.status !== "active") throw new Error("Choose an active central.");
      if (central.city_id !== type.city_id) throw new Error("Central must belong to the trip city.");
      const settings = one("SELECT * FROM central_settings WHERE central_id = ?", central.id);
      if (settings && settings.payment_method !== payment) throw new Error("This central does not accept that payment method.");
      if (body.neighborhoodId) {
        const neighborhood = one("SELECT flat_cents FROM neighborhoods WHERE id = ? AND central_id = ? AND active = 1", body.neighborhoodId, central.id);
        if (!neighborhood) throw new Error("Choose a neighborhood of this central.");
        fare = neighborhood.flat_cents;
      }
      if ((body.roundTrip === "yes" || body.roundTrip === true) && settings?.return_fee_cents) fare += settings.return_fee_cents;
    }
    const originLatInput = body.originLat === "" || body.originLat == null ? null : Number(body.originLat);
    const originLngInput = body.originLng === "" || body.originLng == null ? null : Number(body.originLng);
    if (one("SELECT id FROM irregular_addresses WHERE city_id = ? AND lower(query) = ? AND status = 'open'", type.city_id, body.origin.trim().toLowerCase())) {
      throw new Error("This origin is an unresolved irregular address.");
    }
    const place = originLatInput == null || originLngInput == null
      ? one("SELECT latitude, longitude FROM places WHERE city_id = ? AND lower(name) = ?", type.city_id, body.origin.trim().toLowerCase())
      : null;
    const originLat = place ? place.latitude : originLatInput;
    const originLng = place ? place.longitude : originLngInput;
    if (originLat != null && originLng != null) {
      const blocked = many("SELECT latitude, longitude, radius_km FROM risk_areas WHERE city_id = ? AND active = 1 AND level = 'high'", type.city_id)
        .find((area) => haversine(originLat, originLng, area.latitude, area.longitude) <= Number(area.radius_km));
      if (blocked) throw new Error("Origin is inside a high risk area.");
      const heat = many("SELECT latitude, longitude, radius_km, intensity FROM heat_areas WHERE city_id = ? AND active = 1", type.city_id)
        .find((area) => haversine(originLat, originLng, area.latitude, area.longitude) <= Number(area.radius_km));
      if (heat) fare = Math.round(fare * Number(heat.intensity));
    }
    if (!body.id && String(body.voucher || "").trim()) {
      const voucher = one("SELECT * FROM vouchers WHERE upper(code) = ? AND active = 1", String(body.voucher).trim().toUpperCase());
      if (!voucher || voucher.balance_cents <= 0) throw new Error("Voucher is not active or has no balance.");
      const used = Math.min(voucher.balance_cents, fare);
      run("UPDATE vouchers SET balance_cents = balance_cents - ? WHERE id = ?", used, voucher.id);
      fare -= used;
    }
    let driverId = body.driverId || null;
    let status = body.status || "requested";
    const dispatch = one("SELECT * FROM dispatch_settings WHERE id = 'default'");
    const manualDispatch = dispatch?.active && dispatch.mode === "manual";
    if (!driverId && status === "requested" && originLat != null && originLng != null && !manualDispatch) {
      const assigned = assignDriver(type.city_id, originLat, originLng, "private");
      if (assigned) {
        driverId = assigned.id;
        status = assigned.strategy === "broadcast" || (dispatch?.active && dispatch.mode === "queue") ? "offered" : "accepted";
      }
    }
    if (status === "completed" && body.centralId && one("SELECT finish_only_by_central FROM central_settings WHERE central_id = ?", body.centralId)?.finish_only_by_central && body.finishedBy !== "central") {
      throw new Error("Only the central can finish this trip.");
    }
    const stops = Array.isArray(body.stops) ? body.stops.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4) : [];
    const hours = ["06:00", "07:00", "08:00", "12:00", "17:00", "18:00", "20:00", "22:00"];
    let scheduled = "";
    if (body.scheduledDate || body.scheduledTime) {
      if (!hours.includes(body.scheduledTime) || !/^\d{4}-\d{2}-\d{2}$/.test(String(body.scheduledDate || ""))) throw new Error("Choose a central hour and a date.");
      scheduled = `${body.scheduledDate}T${body.scheduledTime}`;
    }
    if (body.restrictDrivers && !driverId) throw new Error("Choose a driver to restrict this trip.");
    if (body.favoriteOnly && (!driverId || !one("SELECT driver_id FROM central_favorites WHERE central_id = ? AND driver_id = ?", body.centralId, driverId))) {
      throw new Error("No favorite driver is available for this trip.");
    }
    if (payment === "wallet" && body.customerId && status === "completed" && existing?.status !== "completed") {
      const wallet = one("SELECT balance_cents FROM customers WHERE id = ?", body.customerId);
      if (!wallet || wallet.balance_cents < fare) throw new Error("Wallet balance is not enough for this fare.");
    }
    const stamp = now();
    run(
      `INSERT INTO trips (id, reference, status, customer_id, company_id, driver_id, city_id, trip_type_id, origin, destination, distance_km, duration_min, fare_cents, payment, cancelled_by, origin_lat, origin_lng, fare_breakdown, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET status = excluded.status, customer_id = excluded.customer_id, company_id = excluded.company_id,
         driver_id = excluded.driver_id, city_id = excluded.city_id, trip_type_id = excluded.trip_type_id, origin = excluded.origin,
         destination = excluded.destination, distance_km = excluded.distance_km, duration_min = excluded.duration_min,
         fare_cents = excluded.fare_cents, payment = excluded.payment, cancelled_by = excluded.cancelled_by,
         origin_lat = excluded.origin_lat, origin_lng = excluded.origin_lng, fare_breakdown = excluded.fare_breakdown, updated_at = excluded.updated_at`,
      id, reference, status, body.customerId || null, body.companyId || null, driverId,
      type.city_id, type.id, body.origin.trim(), body.destination.trim(), distanceKm, durationMin, fare, payment,
      status === "cancelled" ? body.cancelledBy || "rider" : "", originLat, originLng, JSON.stringify(priced.parts), existing?.created_at || stamp, stamp
    );
    const riderFor = body.riderFor === "other" ? "other" : "self";
    const personKind = ["individual", "company", "international"].includes(body.personKind) ? body.personKind : "individual";
    run(
      "UPDATE trips SET stops = ?, scheduled_at = ?, rider_for = ?, person_kind = ?, delivery_type = ?, pickup_note = ?, dropoff_note = ? WHERE id = ?",
      JSON.stringify(stops), scheduled, riderFor, personKind, String(body.deliveryType || "").trim(), String(body.pickupNote || "").trim(), String(body.dropoffNote || "").trim(), id
    );
    if (payment === "wallet" && body.customerId && status === "completed" && existing?.status !== "completed") {
      run("UPDATE customers SET balance_cents = balance_cents - ?, updated_at = ? WHERE id = ?", fare, now(), body.customerId);
    }
    if (status === "completed" && driverId) payManager(id, driverId, fare);
    if (status === "completed" && body.customerId) grantTripPromotions(body.customerId);
    if (status === "completed" || status === "cancelled") {
      const hooks = many("SELECT id FROM webhooks WHERE event = ? AND active = 1", status === "completed" ? "trip.completed" : "trip.cancelled");
      hooks.forEach((hook) => {
        if (!one("SELECT id FROM webhook_deliveries WHERE webhook_id = ? AND trip_id = ?", hook.id, id)) {
          run("INSERT INTO webhook_deliveries (id, webhook_id, trip_id, created_at) VALUES (?, ?, ?, ?)", randomUUID(), hook.id, id, now());
        }
      });
    }
    return listTrips().find((item) => item.id === id);
  }

  function listVehicleChanges() {
    return many(
      `SELECT v.id, a.name AS driver, v.driver_id AS driverId, v.current_vehicle AS currentVehicle,
              v.requested_vehicle AS requestedVehicle, v.plate, v.status
       FROM vehicle_changes v JOIN drivers d ON d.id = v.driver_id JOIN accounts a ON a.id = d.account_id
       ORDER BY v.updated_at DESC`
    );
  }

  function saveVehicleChange(body) {
    const driver = one("SELECT id, vehicle FROM drivers WHERE id = ?", body.driverId);
    if (!driver) throw new Error("Choose a driver.");
    if (!body.requestedVehicle || !body.plate) throw new Error("Vehicle and plate are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO vehicle_changes (id, driver_id, current_vehicle, requested_vehicle, plate, status, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      id, driver.id, driver.vehicle || "", body.requestedVehicle.trim(), body.plate.trim().toUpperCase(), now()
    );
    return listVehicleChanges().find((item) => item.id === id);
  }

  function decideVehicleChange(id, status) {
    const row = one("SELECT * FROM vehicle_changes WHERE id = ?", id);
    if (!row || row.status !== "pending") throw new Error("This request is no longer pending.");
    if (!["approved", "rejected"].includes(status)) throw new Error("Decision must be approved or rejected.");
    run("UPDATE vehicle_changes SET status = ?, updated_at = ? WHERE id = ?", status, now(), id);
    if (status === "approved") {
      run("UPDATE drivers SET vehicle = ?, plate = ?, updated_at = ? WHERE id = ?", row.requested_vehicle, row.plate, now(), row.driver_id);
    }
    return listVehicleChanges().find((item) => item.id === id);
  }

  function listDriverDocuments() {
    return many(
      `SELECT docs.id, a.name AS driver, docs.driver_id AS driverId, docs.document_name AS document, docs.due_at AS dueAt, docs.status
       FROM driver_documents docs JOIN drivers d ON d.id = docs.driver_id JOIN accounts a ON a.id = d.account_id
       ORDER BY docs.updated_at DESC`
    );
  }

  function saveDriverDocument(body) {
    if (!body.driverId || !body.document) throw new Error("Driver and document are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO driver_documents (id, driver_id, document_name, due_at, status, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      id, body.driverId, body.document.trim(), body.dueAt || "", "missing", now()
    );
    return listDriverDocuments().find((item) => item.id === id);
  }

  function reviewDriverDocument(id, status) {
    if (!["submitted", "approved", "rejected"].includes(status)) throw new Error("Invalid document status.");
    run("UPDATE driver_documents SET status = ?, updated_at = ? WHERE id = ?", status, now(), id);
    return listDriverDocuments().find((item) => item.id === id);
  }

  function listDeletions(subject) {
    return many(
      `SELECT deletions.id, deletions.subject, deletions.reason, deletions.status, deletions.requested_at AS requestedAt,
              COALESCE(customerAccount.name, driverAccount.name) AS name,
              COALESCE(customerAccount.phone, driverAccount.phone) AS phone
       FROM account_deletions deletions
       LEFT JOIN customers ON customers.id = deletions.customer_id
       LEFT JOIN accounts customerAccount ON customerAccount.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = deletions.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       WHERE deletions.subject = ?
       ORDER BY deletions.requested_at DESC`,
      subject
    );
  }

  function requestDeletion(body) {
    const subject = body.subject === "driver" ? "driver" : "customer";
    if (!body.reason) throw new Error("A reason is required.");
    const id = randomUUID();
    run(
      `INSERT INTO account_deletions (id, subject, customer_id, driver_id, reason, status, requested_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      id, subject, subject === "customer" ? body.customerId : null, subject === "driver" ? body.driverId : null, body.reason.trim(), now()
    );
    return listDeletions(subject).find((item) => item.id === id);
  }

  function decideDeletion(id, status) {
    const row = one("SELECT * FROM account_deletions WHERE id = ?", id);
    if (!row || row.status !== "pending") throw new Error("This request is no longer pending.");
    if (!["approved", "rejected"].includes(status)) throw new Error("Decision must be approved or rejected.");
    run("UPDATE account_deletions SET status = ? WHERE id = ?", status, id);
    if (status === "approved" && row.customer_id) {
      const customer = one("SELECT account_id FROM customers WHERE id = ?", row.customer_id);
      run("UPDATE customers SET register_status = 'blocked', updated_at = ? WHERE id = ?", now(), row.customer_id);
      run("UPDATE accounts SET status = 'blocked', blocked = 1, updated_at = ? WHERE id = ?", now(), customer.account_id);
    }
    if (status === "approved" && row.driver_id) {
      const driver = one("SELECT account_id FROM drivers WHERE id = ?", row.driver_id);
      run("UPDATE drivers SET register_status = 'blocked', presence = 'offline', updated_at = ? WHERE id = ?", now(), row.driver_id);
      run("UPDATE accounts SET status = 'blocked', blocked = 1, updated_at = ? WHERE id = ?", now(), driver.account_id);
    }
    return row;
  }

  function commissionAmount(trip) {
    const rule = one(
      `SELECT percent, fixed_cents FROM commissions
       WHERE active = 1 AND city_id = ? AND (trip_type_id = ? OR trip_type_id IS NULL)
       ORDER BY CASE WHEN trip_type_id IS NULL THEN 1 ELSE 0 END
       LIMIT 1`,
      trip.city_id,
      trip.trip_type_id
    );
    if (!rule) return 0;
    return Math.round(Number(trip.fare_cents) * Number(rule.percent) / 100) + Number(rule.fixed_cents || 0);
  }

  function driverProduction(cityId) {
    const people = many(
      `SELECT d.id, a.name AS driver FROM drivers d JOIN accounts a ON a.id = d.account_id ${cityId ? "WHERE d.city_id = ?" : ""} ORDER BY a.name`,
      ...(cityId ? [cityId] : [])
    );
    return people
      .map((person) => {
        const trips = many(
          `SELECT fare_cents, city_id, trip_type_id FROM trips WHERE driver_id = ? AND status = 'completed' ${cityId ? "AND city_id = ?" : ""}`,
          ...(cityId ? [person.id, cityId] : [person.id])
        );
        const gross = trips.reduce((sum, trip) => sum + Number(trip.fare_cents), 0);
        const commission = trips.reduce((sum, trip) => sum + commissionAmount(trip), 0);
        return { driver: person.driver, trips: trips.length, gross, commission, net: gross - commission };
      })
      .sort((left, right) => right.gross - left.gross);
  }

  function listCommissions() {
    return many(
      `SELECT commissions.id, cities.name AS city, commissions.city_id AS cityId, trip_types.name AS tripType,
              commissions.trip_type_id AS tripTypeId, commissions.percent, commissions.fixed_cents AS fixed, commissions.active
       FROM commissions
       JOIN cities ON cities.id = commissions.city_id
       LEFT JOIN trip_types ON trip_types.id = commissions.trip_type_id
       ORDER BY cities.name`
    );
  }

  function saveCommission(body) {
    const percent = Number(body.percent);
    if (!body.cityId) throw new Error("Choose a city.");
    if (Number.isNaN(percent) || percent < 0 || percent > 100) throw new Error("Percent must be between 0 and 100.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO commissions (id, city_id, trip_type_id, percent, fixed_cents, active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET city_id = excluded.city_id, trip_type_id = excluded.trip_type_id, percent = excluded.percent,
         fixed_cents = excluded.fixed_cents, active = excluded.active, updated_at = excluded.updated_at`,
      id, body.cityId, body.tripTypeId || null, percent, dollarsToCents(body.fixed), body.active === "no" ? 0 : 1, now()
    );
    return listCommissions().find((item) => item.id === id);
  }

  function adjustDriverBalance(driverId, delta) {
    const driver = one("SELECT balance_cents FROM drivers WHERE id = ?", driverId);
    if (!driver) throw new Error("Choose a driver.");
    const next = Number(driver.balance_cents) + delta;
    if (next < 0) throw new Error("Driver balance cannot go negative.");
    run("UPDATE drivers SET balance_cents = ?, updated_at = ? WHERE id = ?", next, now(), driverId);
    return next;
  }

  function listLedger() {
    return many(
      `SELECT ledger_entries.id, accounts.name AS driver, ledger_entries.driver_id AS driverId, ledger_entries.direction,
              ledger_entries.amount_cents AS amount, ledger_entries.reason, ledger_entries.status
       FROM ledger_entries JOIN drivers ON drivers.id = ledger_entries.driver_id JOIN accounts ON accounts.id = drivers.account_id
       ORDER BY ledger_entries.created_at DESC`
    );
  }

  function postLedger(body) {
    const amount = dollarsToCents(body.amount);
    if (!body.driverId) throw new Error("Choose a driver.");
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    if (!["credit", "debit"].includes(body.direction)) throw new Error("Choose credit or debit.");
    if (!String(body.reason || "").trim()) throw new Error("A reason is required.");
    adjustDriverBalance(body.driverId, body.direction === "credit" ? amount : -amount);
    const id = randomUUID();
    run(
      "INSERT INTO ledger_entries (id, driver_id, direction, amount_cents, reason, status, created_at) VALUES (?, ?, ?, ?, ?, 'posted', ?)",
      id, body.driverId, body.direction, amount, body.reason.trim(), now()
    );
    return listLedger().find((item) => item.id === id);
  }

  function voidLedger(id) {
    const row = one("SELECT * FROM ledger_entries WHERE id = ?", id);
    if (!row || row.status !== "posted") throw new Error("Only a posted entry can be voided.");
    adjustDriverBalance(row.driver_id, row.direction === "credit" ? -row.amount_cents : row.amount_cents);
    run("UPDATE ledger_entries SET status = 'void' WHERE id = ?", id);
    return listLedger().find((item) => item.id === id);
  }

  function listPayouts() {
    return many(
      `SELECT payouts.id, accounts.name AS driver, payouts.driver_id AS driverId, payouts.amount_cents AS amount, payouts.status
       FROM payouts JOIN drivers ON drivers.id = payouts.driver_id JOIN accounts ON accounts.id = drivers.account_id
       ORDER BY payouts.created_at DESC`
    );
  }

  function requestPayout(body) {
    const amount = dollarsToCents(body.amount);
    if (!body.driverId) throw new Error("Choose a driver.");
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    const driver = one("SELECT balance_cents FROM drivers WHERE id = ?", body.driverId);
    if (!driver || driver.balance_cents < amount) throw new Error("The driver does not have this balance.");
    const id = randomUUID();
    run("INSERT INTO payouts (id, driver_id, amount_cents, status, created_at) VALUES (?, ?, ?, 'requested', ?)", id, body.driverId, amount, now());
    return listPayouts().find((item) => item.id === id);
  }

  function decidePayout(id, status) {
    const row = one("SELECT * FROM payouts WHERE id = ?", id);
    if (!row || row.status !== "requested") throw new Error("This transfer is not awaiting a decision.");
    if (!["paid", "rejected"].includes(status)) throw new Error("Decision must be paid or rejected.");
    if (status === "paid") adjustDriverBalance(row.driver_id, -row.amount_cents);
    run("UPDATE payouts SET status = ? WHERE id = ?", status, id);
    return listPayouts().find((item) => item.id === id);
  }

  function listCancellationFees() {
    return many(
      `SELECT cancellation_fees.id, trips.reference AS trip, cancellation_fees.charged_to AS chargedTo,
              cancellation_fees.amount_cents AS amount, cancellation_fees.reason, cancellation_fees.status
       FROM cancellation_fees JOIN trips ON trips.id = cancellation_fees.trip_id
       ORDER BY cancellation_fees.created_at DESC`
    );
  }

  function chargeCancellation(body) {
    const trip = one("SELECT * FROM trips WHERE id = ?", body.tripId);
    if (!trip) throw new Error("Choose a trip.");
    if (trip.status !== "cancelled") throw new Error("Only a canceled trip can be charged.");
    const amount = dollarsToCents(body.amount);
    if (amount <= 0) throw new Error("Amount must be greater than zero.");
    const chargedTo = body.chargedTo === "driver" ? "driver" : "rider";
    const reason = one("SELECT * FROM cancel_reasons WHERE id = ? AND active = 1", body.reasonId);
    if (!reason) throw new Error("Choose an active cancellation reason.");
    if (!reason.charges_fee) throw new Error("This reason does not charge a cancellation fee.");
    if (reason.audience !== "operator" && reason.audience !== chargedTo) throw new Error("This reason does not apply to the charged party.");
    body.reason = reason.reason;
    if (chargedTo === "driver") {
      if (!trip.driver_id) throw new Error("This trip has no driver.");
      adjustDriverBalance(trip.driver_id, -amount);
    } else {
      const customer = one("SELECT balance_cents FROM customers WHERE id = ?", trip.customer_id);
      if (!customer || customer.balance_cents < amount) throw new Error("Rider balance cannot go negative.");
      run("UPDATE customers SET balance_cents = ?, updated_at = ? WHERE id = ?", customer.balance_cents - amount, now(), trip.customer_id);
    }
    const id = randomUUID();
    run(
      "INSERT INTO cancellation_fees (id, trip_id, charged_to, amount_cents, reason, status, created_at) VALUES (?, ?, ?, ?, ?, 'charged', ?)",
      id, trip.id, chargedTo, amount, body.reason.trim(), now()
    );
    return listCancellationFees().find((item) => item.id === id);
  }

  function listCredits() {
    return many(
      `SELECT credit_purchases.id, companies.legal_name AS company, credit_purchases.company_id AS companyId,
              credit_purchases.buy_cents AS buyPrice, credit_purchases.sell_cents AS sellPrice, credit_purchases.status
       FROM credit_purchases JOIN companies ON companies.id = credit_purchases.company_id
       ORDER BY credit_purchases.created_at DESC`
    );
  }

  function requestCredit(body) {
    if (!body.companyId) throw new Error("Choose a company.");
    const sell = dollarsToCents(body.sellPrice);
    const buy = dollarsToCents(body.buyPrice);
    if (sell <= 0 || buy < 0) throw new Error("Sell price must be greater than zero.");
    const id = randomUUID();
    run(
      "INSERT INTO credit_purchases (id, company_id, buy_cents, sell_cents, status, created_at) VALUES (?, ?, ?, ?, 'pending', ?)",
      id, body.companyId, buy, sell, now()
    );
    return listCredits().find((item) => item.id === id);
  }

  function payCredit(id) {
    const row = one("SELECT * FROM credit_purchases WHERE id = ?", id);
    if (!row || row.status !== "pending") throw new Error("This purchase is not pending.");
    run("UPDATE companies SET balance_cents = balance_cents + ?, updated_at = ? WHERE id = ?", row.sell_cents, now(), row.company_id);
    run("UPDATE credit_purchases SET status = 'paid' WHERE id = ?", id);
    return listCredits().find((item) => item.id === id);
  }

  function seedFinance() {
    if (one("SELECT id FROM commissions LIMIT 1")) return;
    many("SELECT id FROM cities").forEach((city) => {
      run(
        "INSERT INTO commissions (id, city_id, trip_type_id, percent, fixed_cents, active, updated_at) VALUES (?, ?, NULL, 20, 0, 1, ?)",
        randomUUID(), city.id, now()
      );
    });
  }

  function resetDriverBalances() {
    run("UPDATE drivers SET balance_cents = 0, updated_at = ?", now());
  }

  function resetDriverRatings() {
    run("UPDATE drivers SET rating = 5, updated_at = ?", now());
  }

  function removeCity(id) {
    const used = one("SELECT id FROM drivers WHERE city_id = ? UNION SELECT id FROM trip_types WHERE city_id = ? LIMIT 1", id, id);
    if (used) throw new Error("This city is in use by a driver or a trip type.");
    run("DELETE FROM cities WHERE id = ?", id);
  }

  function listFlags() {
    return many("SELECT tariff_flags.id, tariff_flags.name, tariff_flags.multiplier, tariff_flags.active, cities.name AS city, tariff_flags.city_id AS cityId FROM tariff_flags JOIN cities ON cities.id = tariff_flags.city_id ORDER BY cities.name");
  }
  function saveFlag(body) {
    const multiplier = Number(body.multiplier);
    if (!body.cityId || !body.name) throw new Error("City and name are required.");
    if (!(multiplier > 0)) throw new Error("Multiplier must be greater than zero.");
    const id = body.id || randomUUID();
    run("INSERT INTO tariff_flags (id, city_id, name, multiplier, active, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, multiplier = excluded.multiplier, active = excluded.active, updated_at = excluded.updated_at", id, body.cityId, body.name.trim(), multiplier, body.active === "no" ? 0 : 1, now());
    return listFlags().find((item) => item.id === id);
  }
  function listTriggers() {
    return many("SELECT tariff_triggers.id, tariff_triggers.name, tariff_triggers.starts_at AS startsAt, tariff_triggers.ends_at AS endsAt, tariff_triggers.multiplier, cities.name AS city, tariff_triggers.city_id AS cityId FROM tariff_triggers JOIN cities ON cities.id = tariff_triggers.city_id");
  }
  function saveTrigger(body) {
    const multiplier = Number(body.multiplier);
    if (!body.cityId || !body.name || !body.startsAt || !body.endsAt) throw new Error("City, name and hours are required.");
    if (!(multiplier > 0)) throw new Error("Multiplier must be greater than zero.");
    const id = body.id || randomUUID();
    run("INSERT INTO tariff_triggers (id, city_id, name, starts_at, ends_at, multiplier, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)", id, body.cityId, body.name.trim(), body.startsAt, body.endsAt, multiplier, now());
    return listTriggers().find((item) => item.id === id);
  }
  function listDynamicAreas() {
    return many("SELECT dynamic_areas.id, dynamic_areas.name, dynamic_areas.latitude, dynamic_areas.longitude, dynamic_areas.radius_km AS radiusKm, dynamic_areas.multiplier, cities.name AS city, dynamic_areas.city_id AS cityId FROM dynamic_areas JOIN cities ON cities.id = dynamic_areas.city_id");
  }
  function saveDynamicArea(body) {
    const multiplier = Number(body.multiplier);
    const radius = Number(body.radiusKm);
    if (!body.cityId || !body.name) throw new Error("City and name are required.");
    if (!(multiplier > 0) || !(radius > 0)) throw new Error("Multiplier and radius must be greater than zero.");
    const id = body.id || randomUUID();
    run("INSERT INTO dynamic_areas (id, city_id, name, latitude, longitude, radius_km, multiplier, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)", id, body.cityId, body.name.trim(), Number(body.latitude), Number(body.longitude), radius, multiplier, now());
    return listDynamicAreas().find((item) => item.id === id);
  }
  function listTolls() {
    return many("SELECT tolls.id, tolls.name, tolls.amount_cents AS amount, cities.name AS city, tolls.city_id AS cityId FROM tolls JOIN cities ON cities.id = tolls.city_id WHERE tolls.active = 1");
  }
  function saveToll(body) {
    const amount = dollarsToCents(body.amount);
    if (!body.cityId || !body.name || amount <= 0) throw new Error("City, name and amount are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO tolls (id, city_id, name, amount_cents, active, updated_at) VALUES (?, ?, ?, ?, 1, ?)", id, body.cityId, body.name.trim(), amount, now());
    return listTolls().find((item) => item.id === id);
  }
  function listCoupons() {
    return many("SELECT coupons.id, coupons.code, coupons.kind, coupons.percent, coupons.fixed_cents AS fixed, coupons.max_cents AS maxValue, coupons.payment, coupons.valid_until AS validUntil, cities.name AS city FROM coupons LEFT JOIN cities ON cities.id = coupons.city_id WHERE coupons.active = 1");
  }
  function saveCoupon(body) {
    const code = String(body.code || "").trim().toUpperCase();
    if (!code) throw new Error("Coupon code is required.");
    const id = body.id || randomUUID();
    const percent = body.kind === "percent" ? Number(body.value) : 0;
    const fixed = body.kind === "fixed" ? dollarsToCents(body.value) : 0;
    if (body.kind === "percent" && (percent <= 0 || percent > 100)) throw new Error("Percent must be between 0 and 100.");
    if (body.kind !== "percent" && fixed <= 0) throw new Error("Coupon value must be greater than zero.");
    run("INSERT INTO coupons (id, code, city_id, kind, percent, fixed_cents, max_cents, payment, valid_until, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?) ON CONFLICT(code) DO UPDATE SET city_id = excluded.city_id, kind = excluded.kind, percent = excluded.percent, fixed_cents = excluded.fixed_cents, max_cents = excluded.max_cents, payment = excluded.payment, valid_until = excluded.valid_until, active = 1, updated_at = excluded.updated_at", id, code, body.cityId || null, body.kind === "percent" ? "percent" : "fixed", percent, fixed, dollarsToCents(body.maxValue), body.payment || "any", body.validUntil || "", now());
    return listCoupons().find((item) => item.code === code);
  }
  function listRadius() {
    return many("SELECT call_radius.city_id AS cityId, cities.name AS city, call_radius.radius_km AS radiusKm, call_radius.greater_km AS greaterKm FROM call_radius JOIN cities ON cities.id = call_radius.city_id");
  }
  function saveRadius(body) {
    const radius = Number(body.radiusKm);
    if (!body.cityId || !(radius > 0)) throw new Error("City and radius are required.");
    const current = one("SELECT greater_km AS greaterKm FROM call_radius WHERE city_id = ?", body.cityId);
    let greater = current?.greaterKm ?? null;
    if (body.greaterKm !== undefined && body.greaterKm !== "" && body.greaterKm != null) {
      greater = Number(body.greaterKm);
      if (!(greater >= radius)) throw new Error("The extended radius must be at least the nominal radius.");
    }
    run("INSERT INTO call_radius (city_id, radius_km, greater_km, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET radius_km = excluded.radius_km, greater_km = excluded.greater_km, updated_at = excluded.updated_at", body.cityId, radius, greater, now());
    return listRadius().find((item) => item.cityId === body.cityId);
  }
  function saveMapKey(body) {
    const secret = String(body.secret || "").trim();
    if (body.provider !== "google" || secret.length < 10) throw new Error("A Google Maps key is required.");
    run("INSERT INTO map_keys (provider, secret, updated_at) VALUES ('google', ?, ?) ON CONFLICT(provider) DO UPDATE SET secret = excluded.secret, updated_at = excluded.updated_at", secret, now());
    return { provider: "google", last4: secret.slice(-4) };
  }
  function mapKeyStatus() {
    const row = one("SELECT secret FROM map_keys WHERE provider = 'google'");
    return { provider: "google", configured: Boolean(row?.secret), last4: row?.secret ? row.secret.slice(-4) : "" };
  }
  function googleMapKey() {
    return one("SELECT secret FROM map_keys WHERE provider = 'google'")?.secret || "";
  }
  function assertModule(name) {
    const row = one("SELECT active FROM modules WHERE name = ?", name);
    if (row && !row.active) throw new Error(`The ${name} module is off.`);
  }
  function listPaymentMethods() {
    return many("SELECT payment_methods.id, payment_methods.name, payment_methods.code, cities.name AS city, payment_methods.city_id AS cityId, payment_methods.active FROM payment_methods JOIN cities ON cities.id = payment_methods.city_id ORDER BY cities.name, payment_methods.name");
  }
  function savePaymentMethod(body) {
    const code = ["card", "cash", "wallet", "invoice"].includes(body.code) ? body.code : "";
    if (!body.cityId || !code || !String(body.name || "").trim()) throw new Error("City, name and payment code are required.");
    const id = body.id || one("SELECT id FROM payment_methods WHERE city_id = ? AND code = ?", body.cityId, code)?.id || randomUUID();
    run(
      `INSERT INTO payment_methods (id, city_id, code, name, active) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, active = excluded.active`,
      id, body.cityId, code, body.name.trim(), body.active === "no" || body.active === 0 ? 0 : 1
    );
    return listPaymentMethods().find((item) => item.id === id);
  }
  function listPenalties() {
    return many("SELECT id, name, points, suspension_hours AS suspensionHours FROM penalties WHERE active = 1 ORDER BY name");
  }
  function savePenalty(body) {
    const points = Number(body.points);
    const hours = Number(body.suspensionHours);
    if (!String(body.name || "").trim() || points < 0 || hours < 0) throw new Error("Name, points and suspension hours are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO penalties (id, name, points, suspension_hours, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, points = excluded.points, suspension_hours = excluded.suspension_hours", id, body.name.trim(), points, hours);
    return listPenalties().find((item) => item.id === id);
  }
  function listDriverPenalties() {
    return many("SELECT driver_penalties.id, accounts.name AS driver, penalties.name AS penalty, driver_penalties.points, driver_penalties.suspended_until AS suspendedUntil FROM driver_penalties JOIN drivers ON drivers.id = driver_penalties.driver_id JOIN accounts ON accounts.id = drivers.account_id JOIN penalties ON penalties.id = driver_penalties.penalty_id ORDER BY driver_penalties.created_at DESC");
  }
  function applyPenalty(body) {
    const penalty = one("SELECT * FROM penalties WHERE id = ? AND active = 1", body.penaltyId);
    const driver = one("SELECT id FROM drivers WHERE id = ?", body.driverId);
    if (!penalty || !driver) throw new Error("Choose a penalty and a driver.");
    const until = penalty.suspension_hours > 0 ? new Date(Date.now() + penalty.suspension_hours * 3600000).toISOString() : null;
    const id = randomUUID();
    run("INSERT INTO driver_penalties (id, driver_id, penalty_id, points, suspended_until, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, driver.id, penalty.id, penalty.points, until, now());
    if (until) run("UPDATE drivers SET presence = 'offline', updated_at = ? WHERE id = ?", now(), driver.id);
    return listDriverPenalties().find((item) => item.id === id);
  }
  function releasePenalty(id) {
    const row = one("SELECT * FROM driver_penalties WHERE id = ?", id);
    if (!row) throw new Error("Penalty not found.");
    run("UPDATE driver_penalties SET suspended_until = NULL WHERE id = ?", id);
    run("UPDATE drivers SET presence = 'available', updated_at = ? WHERE id = ?", now(), row.driver_id);
    return listDriverPenalties().find((item) => item.id === id);
  }
  function listModules() {
    return many("SELECT name, active FROM modules ORDER BY name");
  }
  function saveModule(body) {
    const name = ["trips", "delivery", "freight", "routes", "corporate"].includes(body.name) ? body.name : "";
    if (!name) throw new Error("Choose a module.");
    run("INSERT INTO modules (name, active) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET active = excluded.active", name, body.active === "no" || body.active === 0 ? 0 : 1);
    return listModules().find((item) => item.name === name);
  }
  function listVouchers() {
    return many("SELECT vouchers.id, vouchers.code, companies.legal_name AS company, vouchers.company_id AS companyId, vouchers.balance_cents AS balance FROM vouchers JOIN companies ON companies.id = vouchers.company_id WHERE vouchers.active = 1 ORDER BY vouchers.code");
  }
  function saveVoucher(body) {
    const balance = dollarsToCents(body.balance);
    if (!body.companyId || !String(body.code || "").trim() || balance < 0) throw new Error("Company, code and balance are required.");
    const code = body.code.trim().toUpperCase();
    const id = body.id || randomUUID();
    run("INSERT INTO vouchers (id, code, company_id, balance_cents, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET code = excluded.code, company_id = excluded.company_id, balance_cents = excluded.balance_cents", id, code, body.companyId, balance);
    return listVouchers().find((item) => item.id === id);
  }
  function listRiskAreas() {
    return many("SELECT risk_areas.id, risk_areas.name, cities.name AS city, risk_areas.city_id AS cityId, risk_areas.latitude AS lat, risk_areas.longitude AS lng, risk_areas.radius_km AS radiusKm, risk_areas.level FROM risk_areas JOIN cities ON cities.id = risk_areas.city_id WHERE risk_areas.active = 1 ORDER BY risk_areas.name");
  }
  function saveRiskArea(body) {
    const level = ["low", "medium", "high"].includes(body.level) ? body.level : "";
    const radius = Number(body.radiusKm);
    if (!body.cityId || !String(body.name || "").trim() || !level || !(radius > 0)) throw new Error("City, name, level and radius are required.");
    const id = body.id || randomUUID();
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    run(
      `INSERT INTO risk_areas (id, name, city_id, latitude, longitude, radius_km, level, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, city_id = excluded.city_id, latitude = excluded.latitude, longitude = excluded.longitude, radius_km = excluded.radius_km, level = excluded.level, active = excluded.active`,
      id, body.name.trim(), body.cityId, Number(body.lat), Number(body.lng), radius, level, active
    );
    return { id, active };
  }

  function listRoutes() {
    return many("SELECT routes.id, routes.name, routes.origin, routes.destination, routes.price_cents AS pricePerPerson, cities.name AS city, routes.city_id AS cityId, routes.trip_type_id AS tripTypeId, trip_types.name AS tripType FROM routes JOIN cities ON cities.id = routes.city_id LEFT JOIN trip_types ON trip_types.id = routes.trip_type_id WHERE routes.active = 1 ORDER BY routes.name");
  }
  function saveRoute(body) {
    assertModule("routes");
    const price = dollarsToCents(body.pricePerPerson);
    if (!body.cityId || !String(body.name || "").trim() || !body.origin || !body.destination || price <= 0) throw new Error("City, name, origin, destination and price are required.");
    const id = body.id || randomUUID();
    let tripTypeId = null;
    if (body.tripTypeId) {
      const type = one("SELECT id FROM trip_types WHERE id = ? AND city_id = ? AND active = 1", body.tripTypeId, body.cityId);
      if (!type) throw new Error("Choose a trip type from this city.");
      tripTypeId = type.id;
    }
    run(
      `INSERT INTO routes (id, city_id, name, origin, destination, price_cents, trip_type_id, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET city_id = excluded.city_id, name = excluded.name, origin = excluded.origin, destination = excluded.destination, price_cents = excluded.price_cents, trip_type_id = excluded.trip_type_id`,
      id, body.cityId, body.name.trim(), body.origin.trim(), body.destination.trim(), price, tripTypeId
    );
    return listRoutes().find((item) => item.id === id);
  }
  function listRouteItems() {
    return many("SELECT id, name, price_cents AS price FROM route_items WHERE active = 1 ORDER BY name");
  }
  function saveRouteItem(body) {
    const price = dollarsToCents(body.price);
    if (!String(body.name || "").trim() || price < 0) throw new Error("Item name and price are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO route_items (id, name, price_cents, active) VALUES (?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, price_cents = excluded.price_cents", id, body.name.trim(), price);
    return listRouteItems().find((item) => item.id === id);
  }
  function listRouteDrivers() {
    return many("SELECT route_drivers.route_id AS routeId, routes.name AS route, accounts.name AS driver, route_drivers.driver_id AS driverId FROM route_drivers JOIN routes ON routes.id = route_drivers.route_id JOIN drivers ON drivers.id = route_drivers.driver_id JOIN accounts ON accounts.id = drivers.account_id WHERE route_drivers.active = 1 ORDER BY routes.name");
  }
  function releaseRouteDriver(body) {
    const route = one("SELECT id, city_id FROM routes WHERE id = ? AND active = 1", body.routeId);
    const driver = one("SELECT id, city_id, register_status FROM drivers WHERE id = ?", body.driverId);
    if (!route || !driver) throw new Error("Choose a route and a driver.");
    if (driver.city_id !== route.city_id) throw new Error("Driver must belong to the route city.");
    if (driver.register_status !== "approved") throw new Error("Only an approved driver can be released.");
    run("INSERT INTO route_drivers (route_id, driver_id, active) VALUES (?, ?, 1) ON CONFLICT(route_id, driver_id) DO UPDATE SET active = 1", route.id, driver.id);
    return listRouteDrivers().find((item) => item.routeId === route.id && item.driverId === driver.id);
  }
  function listRouteBanners() {
    return many("SELECT route_banners.id, route_banners.title, routes.name AS route, route_banners.route_id AS routeId FROM route_banners JOIN routes ON routes.id = route_banners.route_id WHERE route_banners.active = 1 ORDER BY route_banners.title");
  }
  function saveRouteBanner(body) {
    if (!body.routeId || !String(body.title || "").trim()) throw new Error("Route and title are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO route_banners (id, route_id, title, active) VALUES (?, ?, ?, 1)", id, body.routeId, body.title.trim());
    return listRouteBanners().find((item) => item.id === id);
  }
  function listRouteBookings() {
    return many("SELECT route_bookings.id, routes.name AS route, accounts.name AS driver, route_bookings.passengers, route_bookings.total_cents AS total FROM route_bookings JOIN routes ON routes.id = route_bookings.route_id JOIN drivers ON drivers.id = route_bookings.driver_id JOIN accounts ON accounts.id = drivers.account_id ORDER BY route_bookings.created_at DESC");
  }
  function bookRoute(body) {
    assertModule("routes");
    const route = one("SELECT * FROM routes WHERE id = ? AND active = 1", body.routeId);
    const released = one("SELECT driver_id FROM route_drivers WHERE route_id = ? AND driver_id = ? AND active = 1", body.routeId, body.driverId);
    if (!route || !released) throw new Error("The driver is not released for this route.");
    const passengers = Number(body.passengers);
    if (!(passengers >= 1)) throw new Error("At least one passenger is required.");
    const item = body.itemId ? one("SELECT price_cents FROM route_items WHERE id = ? AND active = 1", body.itemId) : null;
    const total = passengers * route.price_cents + (item?.price_cents || 0);
    const id = randomUUID();
    run("INSERT INTO route_bookings (id, route_id, driver_id, passengers, total_cents, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, route.id, body.driverId, passengers, total, now());
    return listRouteBookings().find((row) => row.id === id);
  }
  function listManagers() {
    return many("SELECT managers.id, managers.name, managers.email, managers.phone, managers.commission_percent AS commission, cities.name AS city, managers.city_id AS cityId FROM managers JOIN cities ON cities.id = managers.city_id WHERE managers.active = 1 ORDER BY managers.name");
  }
  function saveManager(body) {
    const commission = Number(body.commission);
    if (!body.cityId || !String(body.name || "").trim() || !(commission >= 0) || commission > 100) throw new Error("City, name and commission from 0 to 100 are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO managers (id, name, email, phone, city_id, commission_percent, active) VALUES (?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email, phone = excluded.phone, city_id = excluded.city_id, commission_percent = excluded.commission_percent`,
      id, body.name.trim(), body.email || "", body.phone || "", body.cityId, commission
    );
    return listManagers().find((item) => item.id === id);
  }
  function listManagerDrivers() {
    return many("SELECT manager_drivers.manager_id AS managerId, managers.name AS manager, accounts.name AS driver, manager_drivers.driver_id AS driverId FROM manager_drivers JOIN managers ON managers.id = manager_drivers.manager_id JOIN drivers ON drivers.id = manager_drivers.driver_id JOIN accounts ON accounts.id = drivers.account_id WHERE manager_drivers.active = 1 ORDER BY managers.name");
  }
  function linkManagerDriver(body) {
    const manager = one("SELECT id, city_id FROM managers WHERE id = ? AND active = 1", body.managerId);
    const driver = one("SELECT id, city_id FROM drivers WHERE id = ?", body.driverId);
    if (!manager || !driver) throw new Error("Choose a manager and a driver.");
    if (manager.city_id !== driver.city_id) throw new Error("Driver must belong to the manager city.");
    run("UPDATE manager_drivers SET active = 0 WHERE driver_id = ?", driver.id);
    run("INSERT INTO manager_drivers (manager_id, driver_id, active) VALUES (?, ?, 1) ON CONFLICT(manager_id, driver_id) DO UPDATE SET active = 1", manager.id, driver.id);
    return listManagerDrivers().find((item) => item.managerId === manager.id && item.driverId === driver.id);
  }
  function listManagerEarnings() {
    return many("SELECT manager_earnings.id, managers.name AS manager, trips.reference AS trip, manager_earnings.amount_cents AS amount FROM manager_earnings JOIN managers ON managers.id = manager_earnings.manager_id JOIN trips ON trips.id = manager_earnings.trip_id ORDER BY manager_earnings.created_at DESC");
  }
  function payManager(tripId, driverId, fare) {
    if (one("SELECT id FROM manager_earnings WHERE trip_id = ?", tripId)) return;
    const link = one("SELECT managers.id, managers.commission_percent FROM manager_drivers JOIN managers ON managers.id = manager_drivers.manager_id WHERE manager_drivers.driver_id = ? AND manager_drivers.active = 1 AND managers.active = 1", driverId);
    if (!link) return;
    const amount = Math.round(Number(fare) * Number(link.commission_percent) / 100);
    if (amount <= 0) return;
    run("INSERT INTO manager_earnings (id, manager_id, trip_id, amount_cents, created_at) VALUES (?, ?, ?, ?, ?)", randomUUID(), link.id, tripId, amount, now());
  }
  function listPartners() {
    return many("SELECT partners.id, partners.name, partners.contact, partners.phone, partners.status, cities.name AS city, partners.city_id AS cityId FROM partners JOIN cities ON cities.id = partners.city_id ORDER BY partners.name");
  }
  function savePartner(body) {
    const status = ["active", "paused"].includes(body.status) ? body.status : "";
    if (!body.cityId || !String(body.name || "").trim() || !status) throw new Error("City, name and status are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO partners (id, name, contact, phone, city_id, status) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, contact = excluded.contact, phone = excluded.phone, city_id = excluded.city_id, status = excluded.status`,
      id, body.name.trim(), body.contact || "", body.phone || "", body.cityId, status
    );
    return listPartners().find((item) => item.id === id);
  }
  function listPartnerMessages() {
    return many("SELECT partner_messages.id, partners.name AS partner, partner_messages.subject, partner_messages.message, partner_messages.status FROM partner_messages JOIN partners ON partners.id = partner_messages.partner_id ORDER BY partner_messages.created_at DESC");
  }
  function openPartnerMessage(body) {
    const partner = one("SELECT status FROM partners WHERE id = ?", body.partnerId);
    if (!partner || partner.status !== "active") throw new Error("Only an active partner can receive an ombudsman message.");
    if (!String(body.subject || "").trim() || !String(body.message || "").trim()) throw new Error("Subject and message are required.");
    const id = randomUUID();
    run("INSERT INTO partner_messages (id, partner_id, subject, message, status, created_at) VALUES (?, ?, ?, ?, 'open', ?)", id, body.partnerId, body.subject.trim(), body.message.trim(), now());
    return listPartnerMessages().find((item) => item.id === id);
  }
  function closePartnerMessage(id) {
    const row = one("SELECT id FROM partner_messages WHERE id = ? AND status = 'open'", id);
    if (!row) throw new Error("This message is not open.");
    run("UPDATE partner_messages SET status = 'closed' WHERE id = ?", id);
    return listPartnerMessages().find((item) => item.id === id);
  }
  function listTripPromotions() {
    return many("SELECT id, name, trips_required AS tripsRequired, reward_cents AS reward FROM trip_promotions WHERE active = 1 ORDER BY trips_required");
  }
  function saveTripPromotion(body) {
    const tripsRequired = Number(body.tripsRequired);
    const reward = dollarsToCents(body.reward);
    if (!String(body.name || "").trim() || !(tripsRequired >= 1) || reward <= 0) throw new Error("Name, required trips and reward are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO trip_promotions (id, name, trips_required, reward_cents, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, trips_required = excluded.trips_required, reward_cents = excluded.reward_cents", id, body.name.trim(), tripsRequired, reward);
    return listTripPromotions().find((item) => item.id === id);
  }
  function listPromotionGrants() {
    return many("SELECT promotion_grants.id, trip_promotions.name AS promotion, accounts.name AS customer, promotion_grants.reward_cents AS reward FROM promotion_grants JOIN trip_promotions ON trip_promotions.id = promotion_grants.promotion_id JOIN customers ON customers.id = promotion_grants.customer_id JOIN accounts ON accounts.id = customers.account_id ORDER BY promotion_grants.created_at DESC");
  }
  function grantTripPromotions(customerId) {
    const count = Number(one("SELECT COUNT(*) AS total FROM trips WHERE customer_id = ? AND status = 'completed'", customerId)?.total || 0);
    many("SELECT * FROM trip_promotions WHERE active = 1 AND trips_required <= ?", count).forEach((promo) => {
      if (one("SELECT id FROM promotion_grants WHERE promotion_id = ? AND customer_id = ?", promo.id, customerId)) return;
      run("UPDATE customers SET balance_cents = balance_cents + ?, updated_at = ? WHERE id = ?", promo.reward_cents, now(), customerId);
      run("INSERT INTO promotion_grants (id, promotion_id, customer_id, reward_cents, created_at) VALUES (?, ?, ?, ?, ?)", randomUUID(), promo.id, customerId, promo.reward_cents, now());
    });
  }
  function listAds() {
    return many("SELECT id, title, audience, placement, link, active FROM ads ORDER BY title");
  }
  function saveAd(body) {
    const audience = ["driver", "rider", "delivery"].includes(body.audience) ? body.audience : "";
    const placement = ["home", "waiting", "receipt"].includes(body.placement) ? body.placement : "";
    const link = String(body.link || "").trim();
    if (!String(body.title || "").trim() || !audience || !placement || !link.startsWith("https://")) throw new Error("Title, audience, placement and an https link are required.");
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    if (active && one("SELECT id FROM ads WHERE audience = ? AND placement = ? AND active = 1 AND id <> ?", audience, placement, body.id || "")) throw new Error("This audience already has an active ad in that placement.");
    const id = body.id || randomUUID();
    run("INSERT INTO ads (id, title, audience, placement, link, active) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, audience = excluded.audience, placement = excluded.placement, link = excluded.link, active = excluded.active", id, body.title.trim(), audience, placement, link, active);
    return listAds().find((item) => item.id === id);
  }
  function listExternalLinks() {
    return many("SELECT id, label, url, active FROM external_links ORDER BY label");
  }
  function saveExternalLink(body) {
    const url = String(body.url || "").trim();
    if (!String(body.label || "").trim() || !url.startsWith("https://")) throw new Error("Label and an https URL are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO external_links (id, label, url, active) VALUES (?, ?, ?, 1)", id, body.label.trim(), url);
    return listExternalLinks().find((item) => item.id === id);
  }
  function listAppAds() {
    return many("SELECT app_ads.id, app_ads.title, app_ads.audience, cities.name AS city, app_ads.city_id AS cityId, app_ads.link FROM app_ads JOIN cities ON cities.id = app_ads.city_id WHERE app_ads.active = 1 ORDER BY app_ads.title");
  }
  function saveAppAd(body) {
    const audience = ["rider", "driver"].includes(body.audience) ? body.audience : "";
    const link = String(body.link || "").trim();
    if (!body.cityId || !String(body.title || "").trim() || !audience || !link.startsWith("https://")) throw new Error("City, title, audience and an https link are required.");
    if (one("SELECT id FROM app_ads WHERE city_id = ? AND audience = ? AND active = 1", body.cityId, audience)) throw new Error("This city already has an active app ad for that audience.");
    const id = randomUUID();
    run("INSERT INTO app_ads (id, title, audience, city_id, link, active) VALUES (?, ?, ?, ?, ?, 1)", id, body.title.trim(), audience, body.cityId, link);
    return listAppAds().find((item) => item.id === id);
  }
  function listTickets(kind) {
    return many("SELECT support_tickets.id, accounts.name AS customer, trips.reference AS trip, support_tickets.subject, support_tickets.message, support_tickets.status FROM support_tickets LEFT JOIN customers ON customers.id = support_tickets.customer_id LEFT JOIN accounts ON accounts.id = customers.account_id LEFT JOIN trips ON trips.id = support_tickets.trip_id WHERE support_tickets.kind = ? ORDER BY support_tickets.created_at DESC", kind);
  }
  function openRiderTicket(body) {
    if (!body.customerId || !String(body.subject || "").trim() || !String(body.message || "").trim()) throw new Error("Customer, subject and message are required.");
    if (one("SELECT id FROM support_tickets WHERE kind = 'rider' AND customer_id = ? AND status = 'open'", body.customerId)) throw new Error("This customer already has an open ticket.");
    const id = randomUUID();
    run("INSERT INTO support_tickets (id, kind, customer_id, trip_id, subject, message, status, created_at) VALUES (?, 'rider', ?, NULL, ?, ?, 'open', ?)", id, body.customerId, body.subject.trim(), body.message.trim(), now());
    return listTickets("rider").find((item) => item.id === id);
  }
  function openTripTicket(body) {
    const trip = one("SELECT id FROM trips WHERE id = ?", body.tripId);
    if (!trip) throw new Error("Choose a trip.");
    if (!String(body.subject || "").trim() || !String(body.message || "").trim()) throw new Error("Subject and message are required.");
    if (one("SELECT id FROM support_tickets WHERE kind = 'trip' AND trip_id = ? AND status = 'open'", body.tripId)) throw new Error("This trip already has an open ticket.");
    const id = randomUUID();
    run("INSERT INTO support_tickets (id, kind, customer_id, trip_id, subject, message, status, created_at) VALUES (?, 'trip', NULL, ?, ?, ?, 'open', ?)", id, body.tripId, body.subject.trim(), body.message.trim(), now());
    return listTickets("trip").find((item) => item.id === id);
  }
  function closeTicket(id) {
    const row = one("SELECT id FROM support_tickets WHERE id = ? AND status = 'open'", id);
    if (!row) throw new Error("This ticket is not open.");
    run("UPDATE support_tickets SET status = 'closed' WHERE id = ?", id);
    return { id, status: "closed" };
  }
  function listNotifications() {
    return many("SELECT notifications.id, notifications.audience, notifications.title, notifications.body, cities.name AS city, notifications.status FROM notifications LEFT JOIN cities ON cities.id = notifications.city_id ORDER BY notifications.sent_at DESC");
  }
  function saveNotification(body) {
    const audience = ["riders", "drivers", "both"].includes(body.audience) ? body.audience : "";
    if (!audience || !String(body.title || "").trim() || !String(body.body || "").trim()) throw new Error("Audience, title and message are required.");
    const id = randomUUID();
    run("INSERT INTO notifications (id, audience, title, body, city_id, status, sent_at) VALUES (?, ?, ?, ?, ?, 'draft', NULL)", id, audience, body.title.trim(), body.body.trim(), body.cityId || null);
    return listNotifications().find((item) => item.id === id);
  }
  function sendNotification(id) {
    const row = one("SELECT id, status FROM notifications WHERE id = ?", id);
    if (!row) throw new Error("Choose a notification.");
    if (row.status === "sent") throw new Error("This notification was already sent.");
    run("UPDATE notifications SET status = 'sent', sent_at = ? WHERE id = ?", now(), id);
    return listNotifications().find((item) => item.id === id);
  }
  function listRoles() {
    return many("SELECT id, name, description, active FROM roles ORDER BY name");
  }
  function saveRole(body) {
    if (!String(body.name || "").trim()) throw new Error("Profile name is required.");
    const id = body.id || randomUUID();
    run("INSERT INTO roles (id, name, description, active) VALUES (?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, description = excluded.description", id, body.name.trim(), body.description || "");
    return listRoles().find((item) => item.id === id);
  }
  function removeRole(id) {
    if (one("SELECT id FROM staff WHERE role_id = ? AND active = 1", id)) throw new Error("This profile still has active users.");
    run("DELETE FROM roles WHERE id = ?", id);
  }
  function listStaff() {
    return many("SELECT staff.id, staff.name, staff.email, roles.name AS role, staff.role_id AS roleId, staff.active FROM staff JOIN roles ON roles.id = staff.role_id ORDER BY staff.name");
  }
  function saveStaff(body) {
    const role = one("SELECT id FROM roles WHERE id = ? AND active = 1", body.roleId);
    if (!role || !String(body.name || "").trim() || !String(body.email || "").trim()) throw new Error("Name, email and an active profile are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO staff (id, name, email, role_id, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email, role_id = excluded.role_id", id, body.name.trim(), body.email.trim().toLowerCase(), role.id);
    return listStaff().find((item) => item.id === id);
  }
  function listCentrals() {
    return many("SELECT centrals.id, centrals.name, centrals.address, centrals.phone, centrals.balance_cents AS balance, centrals.status, cities.name AS city, centrals.city_id AS cityId FROM centrals JOIN cities ON cities.id = centrals.city_id ORDER BY centrals.name");
  }
  function saveCentral(body) {
    const status = ["active", "paused"].includes(body.status) ? body.status : "";
    if (!body.cityId || !String(body.name || "").trim() || !status) throw new Error("City, name and status are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO centrals (id, name, address, city_id, phone, balance_cents, status) VALUES (?, ?, ?, ?, ?, 0, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, address = excluded.address, city_id = excluded.city_id, phone = excluded.phone, status = excluded.status", id, body.name.trim(), body.address || "", body.cityId, body.phone || "", status);
    return listCentrals().find((item) => item.id === id);
  }
  function listCentralUsers() {
    return many("SELECT central_users.id, centrals.name AS central, central_users.central_id AS centralId, central_users.name, central_users.email, central_users.role FROM central_users JOIN centrals ON centrals.id = central_users.central_id WHERE central_users.active = 1 ORDER BY central_users.name");
  }
  function saveCentralUser(body) {
    const central = one("SELECT status FROM centrals WHERE id = ?", body.centralId);
    const role = ["operator", "supervisor"].includes(body.role) ? body.role : "";
    if (!central || central.status !== "active") throw new Error("A paused central cannot receive users.");
    if (!role || !String(body.name || "").trim() || !String(body.email || "").trim()) throw new Error("Name, email and role are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO central_users (id, central_id, name, email, role, active) VALUES (?, ?, ?, ?, ?, 1)", id, body.centralId, body.name.trim(), body.email.trim().toLowerCase(), role);
    return listCentralUsers().find((item) => item.id === id);
  }
  function listNeighborhoods() {
    return many("SELECT neighborhoods.id, neighborhoods.name, centrals.name AS central, neighborhoods.central_id AS centralId, neighborhoods.flat_cents AS flatFare, neighborhoods.trip_type_id AS tripTypeId, trip_types.name AS tripType, cities.name AS city FROM neighborhoods JOIN centrals ON centrals.id = neighborhoods.central_id JOIN cities ON cities.id = centrals.city_id LEFT JOIN trip_types ON trip_types.id = neighborhoods.trip_type_id WHERE neighborhoods.active = 1 ORDER BY neighborhoods.name");
  }
  function saveNeighborhood(body) {
    const central = one("SELECT status, city_id AS cityId FROM centrals WHERE id = ?", body.centralId);
    const flat = dollarsToCents(body.flatFare);
    if (!central || central.status !== "active") throw new Error("Choose an active central.");
    if (body.active === "no" && body.id && one("SELECT id FROM neighborhoods WHERE id = ? AND central_id = ?", body.id, body.centralId)) {
      run("UPDATE neighborhoods SET active = 0 WHERE id = ?", body.id);
      return { id: body.id, active: 0 };
    }
    if (!String(body.name || "").trim() || flat <= 0) throw new Error("Name and flat fare are required.");
    let tripTypeId = null;
    if (body.tripTypeId) {
      const type = one("SELECT id FROM trip_types WHERE id = ? AND city_id = ? AND active = 1", body.tripTypeId, central.cityId);
      if (!type) throw new Error("Choose a trip type from this city.");
      tripTypeId = type.id;
    }
    if (body.id && one("SELECT id FROM neighborhoods WHERE id = ? AND central_id = ?", body.id, body.centralId)) {
      run("UPDATE neighborhoods SET name = ?, flat_cents = ?, trip_type_id = ? WHERE id = ?", body.name.trim(), flat, tripTypeId, body.id);
      return listNeighborhoods().find((item) => item.id === body.id);
    }
    const id = body.id || randomUUID();
    run("INSERT INTO neighborhoods (id, central_id, name, flat_cents, trip_type_id, active) VALUES (?, ?, ?, ?, ?, 1)", id, body.centralId, body.name.trim(), flat, tripTypeId);
    return listNeighborhoods().find((item) => item.id === id);
  }
  function listCentralFields(centralId) {
    return many("SELECT id, title, required FROM central_fields WHERE central_id = ? AND active = 1 ORDER BY title", centralId);
  }
  function saveCentralField(body) {
    const title = String(body.title || "").trim();
    const central = one("SELECT id FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    if (!central || !title) throw new Error("Active central and a title are required.");
    const id = body.id || randomUUID();
    const required = body.required === "yes" || body.required === true || body.required === 1 ? 1 : 0;
    run("INSERT INTO central_fields (id, central_id, title, required, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET title = excluded.title, required = excluded.required, active = 1", id, body.centralId, title, required);
    return listCentralFields(body.centralId).find((item) => item.id === id);
  }
  function listCentralTrips(centralId, q = "", status = "", from = "", to = "") {
    const central = one("SELECT city_id AS cityId FROM centrals WHERE id = ?", centralId);
    if (!central) throw new Error("Choose a central.");
    const like = `%${String(q || "").toLowerCase()}%`;
    const wanted = String(status || "");
    const start = String(from || "");
    const end = String(to || "");
    return many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare, trips.payment,
              customerAccount.name AS rider, driverAccount.name AS driver, substr(trips.created_at, 1, 10) AS day
       FROM trips
       LEFT JOIN customers ON customers.id = trips.customer_id
       LEFT JOIN accounts customerAccount ON customerAccount.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = trips.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       WHERE trips.city_id = ? AND (? = '' OR trips.status = ?)
         AND (? = '' OR substr(trips.created_at, 1, 10) >= ?)
         AND (? = '' OR substr(trips.created_at, 1, 10) <= ?)
         AND (lower(trips.reference) LIKE ? OR lower(COALESCE(customerAccount.name, '')) LIKE ? OR lower(COALESCE(driverAccount.name, '')) LIKE ? OR lower(trips.origin) LIKE ?)
       ORDER BY trips.created_at DESC LIMIT 80`,
      central.cityId, wanted, wanted, start, start, end, end, like, like, like, like
    );
  }
  function cancelCentralTrip(body) {
    const central = one("SELECT city_id AS cityId FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    const trip = one("SELECT id, status, city_id AS cityId FROM trips WHERE id = ?", body.tripId);
    if (!central || !trip || trip.cityId !== central.cityId) throw new Error("This trip is not in this central.");
    if (trip.status === "completed" || trip.status === "cancelled") throw new Error("This trip is already closed.");
    run("UPDATE trips SET status = 'cancelled', cancelled_by = 'operator', updated_at = ? WHERE id = ?", now(), trip.id);
    return { id: trip.id, status: "cancelled" };
  }
  function centralTrip(centralId, tripId) {
    const central = one("SELECT city_id AS cityId FROM centrals WHERE id = ?", centralId);
    if (!central) throw new Error("Choose a central.");
    const trip = one(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare, trips.payment,
              trips.distance_km AS distanceKm, trips.duration_min AS durationMin, trips.stops, trips.scheduled_at AS scheduledAt,
              trips.rider_for AS riderFor, trips.person_kind AS personKind, trips.delivery_type AS deliveryType,
              trips.pickup_note AS pickupNote, trips.dropoff_note AS dropoffNote, trips.driver_id AS driverId,
              customerAccount.name AS rider, driverAccount.name AS driver
       FROM trips
       LEFT JOIN customers ON customers.id = trips.customer_id
       LEFT JOIN accounts customerAccount ON customerAccount.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = trips.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       WHERE trips.id = ? AND trips.city_id = ?`,
      tripId, central.cityId
    );
    if (!trip) throw new Error("This trip is not in this central.");
    return trip;
  }
  function setCentralTripStatus(body) {
    const central = one("SELECT city_id AS cityId FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    const trip = one("SELECT id, status, city_id AS cityId, driver_id AS driverId FROM trips WHERE id = ?", body.tripId);
    if (!central || !trip || trip.cityId !== central.cityId) throw new Error("This trip is not in this central.");
    const allowed = { requested: ["accepted", "cancelled"], offered: ["accepted", "cancelled"], accepted: ["in_progress", "cancelled"], arriving: ["in_progress", "cancelled"], in_progress: ["completed", "cancelled"] };
    if (!allowed[trip.status]?.includes(body.status)) throw new Error("This status change is not allowed.");
    const driverId = body.driverId || trip.driverId || null;
    if (body.status === "accepted" && !driverId) throw new Error("Choose a driver before accepting.");
    run("UPDATE trips SET status = ?, driver_id = ?, cancelled_by = ?, updated_at = ? WHERE id = ?", body.status, driverId, body.status === "cancelled" ? "operator" : "", now(), trip.id);
    return centralTrip(body.centralId, trip.id);
  }
  function searchAddresses(cityId, q = "") {
    const text = String(q || "").trim().toLowerCase();
    if (!cityId || text.length < 2) return [];
    const like = `%${text}%`;
    const places = many("SELECT name, address, latitude AS lat, longitude AS lng FROM places WHERE city_id = ? AND (lower(name) LIKE ? OR lower(address) LIKE ?) LIMIT 8", cityId, like, like);
    const cached = many("SELECT query AS name, formatted AS address FROM address_cache WHERE city_id = ? AND lower(query) LIKE ? LIMIT 8", cityId, like);
    const used = many("SELECT origin AS name, origin AS address FROM trips WHERE city_id = ? AND lower(origin) LIKE ? GROUP BY origin LIMIT 8", cityId, like);
    return [...places, ...cached, ...used];
  }
  function searchCities(q = "") {
    const text = String(q || "").trim().toLowerCase();
    if (text.length < 2) return [];
    return many("SELECT id, name, state FROM cities WHERE active = 1 AND lower(name) LIKE ? ORDER BY name LIMIT 12", `%${text}%`);
  }
  function listFavorites(centralId) {
    return many("SELECT drivers.id, accounts.name FROM central_favorites JOIN drivers ON drivers.id = central_favorites.driver_id JOIN accounts ON accounts.id = drivers.account_id WHERE central_favorites.central_id = ? ORDER BY accounts.name", centralId);
  }
  function toggleFavorite(body) {
    const driver = one("SELECT drivers.id FROM drivers JOIN centrals ON centrals.city_id = drivers.city_id WHERE drivers.id = ? AND centrals.id = ?", body.driverId, body.centralId);
    if (!driver) throw new Error("Choose a driver of this central.");
    const existing = one("SELECT driver_id FROM central_favorites WHERE central_id = ? AND driver_id = ?", body.centralId, body.driverId);
    if (existing) run("DELETE FROM central_favorites WHERE central_id = ? AND driver_id = ?", body.centralId, body.driverId);
    else run("INSERT INTO central_favorites (central_id, driver_id) VALUES (?, ?)", body.centralId, body.driverId);
    return listFavorites(body.centralId);
  }
  function listCentralMessages(centralId) {
    return many("SELECT id, body, created_at AS createdAt FROM central_messages WHERE central_id = ? ORDER BY created_at DESC LIMIT 20", centralId);
  }
  function saveCentralMessage(body) {
    const text = String(body.body || "").trim();
    const central = one("SELECT id FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    if (!central || !text) throw new Error("Active central and a message are required.");
    const id = randomUUID();
    run("INSERT INTO central_messages (id, central_id, body, created_at) VALUES (?, ?, ?, ?)", id, body.centralId, text, now());
    return listCentralMessages(body.centralId);
  }
  function setNeighborhoodRides(body) {
    const central = one("SELECT id FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    if (!central) throw new Error("Choose an active central.");
    const on = body.active === true || body.active === "yes" || body.active === 1 ? 1 : 0;
    run("INSERT INTO central_flags (central_id, neighborhood_rides) VALUES (?, ?) ON CONFLICT(central_id) DO UPDATE SET neighborhood_rides = excluded.neighborhood_rides", body.centralId, on);
    return { centralId: body.centralId, active: on };
  }
  function setRouteActive(body) {
    const row = one("SELECT id FROM routes WHERE id = ?", body.id);
    if (!row) throw new Error("Choose a route.");
    const on = body.active === true || body.active === "yes" || body.active === 1 ? 1 : 0;
    run("UPDATE routes SET active = ? WHERE id = ?", on, body.id);
    return { id: body.id, active: on };
  }
  function listCityRoutes(cityId) {
    return many("SELECT routes.id, routes.name, routes.origin, routes.destination, routes.price_cents AS pricePerPerson, routes.active, routes.trip_type_id AS tripTypeId, trip_types.name AS tripType FROM routes LEFT JOIN trip_types ON trip_types.id = routes.trip_type_id WHERE routes.city_id = ? ORDER BY routes.name", cityId);
  }
  function centralDesk(centralId) {
    const central = one(
      `SELECT centrals.id, centrals.name, centrals.address, centrals.phone, centrals.balance_cents AS balance, centrals.status, cities.name AS city, centrals.city_id AS cityId
       FROM centrals JOIN cities ON cities.id = centrals.city_id WHERE centrals.id = ?`,
      centralId
    );
    if (!central) throw new Error("Choose a central.");
    const cityId = central.cityId;
    const tripCount = one("SELECT COUNT(*) AS total FROM trips WHERE city_id = ?", cityId)?.total || 0;
    const driverCount = one("SELECT COUNT(*) AS total FROM drivers WHERE city_id = ?", cityId)?.total || 0;
    const riderCount = one("SELECT COUNT(*) AS total FROM customers JOIN accounts ON accounts.id = customers.account_id WHERE accounts.city_id = ?", cityId)?.total || 0;
    const trips = many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare, trips.payment,
              customerAccount.name AS rider, driverAccount.name AS driver
       FROM trips
       LEFT JOIN customers ON customers.id = trips.customer_id
       LEFT JOIN accounts customerAccount ON customerAccount.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = trips.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       WHERE trips.city_id = ?
       ORDER BY trips.created_at DESC LIMIT 40`,
      cityId
    );
    const drivers = many(
      `SELECT drivers.id, accounts.name, accounts.phone, accounts.email, drivers.presence, drivers.vehicle, drivers.plate, drivers.rating, drivers.latitude AS lat, drivers.longitude AS lng
       FROM drivers JOIN accounts ON accounts.id = drivers.account_id
       WHERE drivers.city_id = ? ORDER BY accounts.name LIMIT 40`,
      cityId
    );
    let pins = many(
      `SELECT drivers.id, accounts.name, drivers.latitude AS lat, drivers.longitude AS lng, drivers.presence
       FROM drivers JOIN accounts ON accounts.id = drivers.account_id
       WHERE drivers.city_id = ? AND drivers.latitude IS NOT NULL AND drivers.longitude IS NOT NULL AND NOT (drivers.latitude = 0 AND drivers.longitude = 0) LIMIT 80`,
      cityId
    );
    if (!pins.length) {
      pins = many("SELECT trips.id, trips.origin AS name, trips.origin_lat AS lat, trips.origin_lng AS lng, trips.status AS presence FROM trips WHERE city_id = ? AND origin_lat IS NOT NULL AND origin_lng IS NOT NULL AND NOT (origin_lat = 0 AND origin_lng = 0) ORDER BY created_at DESC LIMIT 40", cityId);
    }
    const activeTrips = many(
      `SELECT trips.id, trips.reference, trips.status, trips.origin, trips.destination, trips.fare_cents AS fare
       FROM trips WHERE trips.city_id = ? AND trips.status IN ('requested', 'accepted', 'offered', 'in_progress', 'arriving')
       ORDER BY trips.created_at DESC LIMIT 30`,
      cityId
    );
    const gross = one("SELECT COALESCE(SUM(fare_cents), 0) AS total FROM trips WHERE city_id = ? AND status = 'completed'", cityId)?.total || 0;
    const completed = one("SELECT COUNT(*) AS total FROM trips WHERE city_id = ? AND status = 'completed'", cityId)?.total || 0;
    const commission = one("SELECT percent, fixed_cents AS fixed FROM commissions WHERE city_id = ? AND active = 1 AND trip_type_id IS NULL LIMIT 1", cityId);
    let net = gross;
    if (commission?.percent) net = gross - Math.round(gross * Number(commission.percent) / 100);
    else if (commission?.fixed) net = gross - Number(commission.fixed) * completed;
    if (net < 0) net = 0;
    const unanswered = one("SELECT COUNT(*) AS total FROM trips WHERE city_id = ? AND status = 'requested' AND driver_id IS NULL", cityId)?.total || 0;
    const riders = many(
      `SELECT customers.id, accounts.name, accounts.phone, accounts.email, accounts.document, accounts.birth_date AS birthDate, customers.balance_cents AS balance
       FROM customers JOIN accounts ON accounts.id = customers.account_id
       WHERE accounts.city_id = ? ORDER BY accounts.name LIMIT 40`,
      cityId
    );
    let tariffs = many(
      `SELECT id, name, base_cents AS base, per_km_cents AS perKm, per_minute_cents AS perMin, minimum_cents AS minimum
       FROM trip_types WHERE city_id = ? AND active = 1 ORDER BY name LIMIT 40`,
      cityId
    );
    if (!tariffs.length) {
      tariffs = many(
        `SELECT id, name, base_cents AS base, per_km_cents AS perKm, per_minute_cents AS perMin, minimum_cents AS minimum
         FROM trip_types WHERE city_id = ? ORDER BY name LIMIT 40`,
        cityId
      );
    }
    const neighborhoods = many(
      `SELECT neighborhoods.id, neighborhoods.name, neighborhoods.flat_cents AS flatFare, trip_types.name AS tripType
       FROM neighborhoods LEFT JOIN trip_types ON trip_types.id = neighborhoods.trip_type_id
       WHERE neighborhoods.central_id = ? AND neighborhoods.active = 1 ORDER BY neighborhoods.name`,
      central.id
    );
    const byStatus = many("SELECT status, COUNT(*) AS total FROM trips WHERE city_id = ? GROUP BY status", cityId);
    const byPayment = many("SELECT payment, COUNT(*) AS total FROM trips WHERE city_id = ? GROUP BY payment", cityId);
    const operators = many(
      "SELECT id, name, email, role FROM central_users WHERE central_id = ? AND active = 1 ORDER BY name",
      central.id
    );
    const settings = one(
      "SELECT return_fee_cents AS returnFee, finish_only_by_central AS finishOnly, payment_method AS paymentMethod FROM central_settings WHERE central_id = ?",
      central.id
    );
    const favorites = listFavorites(central.id);
    const messages = listCentralMessages(central.id);
    const neighborhoodRides = one("SELECT neighborhood_rides AS active FROM central_flags WHERE central_id = ?", central.id)?.active || 0;
    return { central, tripCount, driverCount, riderCount, trips, drivers, riders, tariffs, neighborhoods, operators, settings, byStatus, byPayment, pins, activeTrips, gross, net, unanswered, favorites, messages, neighborhoodRides };
  }
  function listCentralSettings() {
    return many("SELECT central_settings.central_id AS centralId, centrals.name AS central, central_settings.return_fee_cents AS returnFee, central_settings.finish_only_by_central AS finishOnly, central_settings.payment_method AS paymentMethod FROM central_settings JOIN centrals ON centrals.id = central_settings.central_id");
  }
  function saveCentralSettings(body) {
    const central = one("SELECT id FROM centrals WHERE id = ? AND status = 'active'", body.centralId);
    const paymentMethod = ["card", "cash", "wallet", "invoice"].includes(body.paymentMethod) ? body.paymentMethod : "";
    if (!central || !paymentMethod) throw new Error("Active central and payment method are required.");
    const fee = dollarsToCents(body.returnFee);
    if (fee < 0) throw new Error("Return fee cannot be negative.");
    run("INSERT INTO central_settings (central_id, return_fee_cents, finish_only_by_central, payment_method) VALUES (?, ?, ?, ?) ON CONFLICT(central_id) DO UPDATE SET return_fee_cents = excluded.return_fee_cents, finish_only_by_central = excluded.finish_only_by_central, payment_method = excluded.payment_method", body.centralId, fee, body.finishOnly === "yes" ? 1 : 0, paymentMethod);
    return listCentralSettings().find((item) => item.centralId === body.centralId);
  }
  function listReports() {
    return many("SELECT id, name, source, row_count AS rows, created_at AS createdAt FROM reports ORDER BY created_at DESC");
  }
  function runReport(body) {
    const source = ["trips", "drivers", "riders", "delivery"].includes(body.source) ? body.source : "";
    if (!String(body.name || "").trim() || !source) throw new Error("Name and source are required.");
    const lines = ["name,source,detail,amount"];
    if (source === "trips") listTrips().forEach((row) => lines.push([row.reference, row.status, `${row.origin} -> ${row.destination}`, (row.fare / 100).toFixed(2)].join(",")));
    if (source === "drivers") listDrivers().forEach((row) => lines.push([row.name, row.status, row.city || "", (row.balance / 100).toFixed(2)].join(",")));
    if (source === "riders") listCustomers().forEach((row) => lines.push([row.name, row.status, row.email || "", (row.balance / 100).toFixed(2)].join(",")));
    if (source === "delivery") listOrders().forEach((row) => lines.push([row.code || row.id, row.status, row.address || "", ((row.total || 0) / 100).toFixed(2)].join(",")));
    const id = randomUUID();
    run("INSERT INTO reports (id, name, source, row_count, csv, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, body.name.trim(), source, lines.length - 1, lines.join("\n"), now());
    return listReports().find((item) => item.id === id);
  }
  function reportFile(id) {
    const row = one("SELECT name, csv FROM reports WHERE id = ?", id);
    if (!row) throw new Error("Report not found.");
    return row;
  }
  function importPeople(kind, csv) {
    const lines = String(csv || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) throw new Error("The file is empty.");
    let count = 0;
    const rejected = [];
    lines.forEach((line, index) => {
      const [name, phone, email, cityName] = line.split(",").map((part) => String(part || "").trim());
      const city = one("SELECT id FROM cities WHERE lower(name) = ?", String(cityName || "").toLowerCase());
      if (!name || !city || (email && one("SELECT id FROM accounts WHERE lower(email) = ?", email.toLowerCase()))) {
        rejected.push(index + 1);
        return;
      }
      const body = { name, phone, email, cityId: city.id, status: kind === "drivers" ? "pending" : "active" };
      if (kind === "drivers") saveDriver({ ...body, presence: "offline", service: "private" });
      else saveCustomer(body);
      count += 1;
    });
    if (!count && !rejected.length) throw new Error("No row was imported.");
    return { count, rejected };
  }
  function listPlaces() {
    return many("SELECT places.id, places.name, places.address, cities.name AS city, places.city_id AS cityId, places.latitude AS lat, places.longitude AS lng FROM places JOIN cities ON cities.id = places.city_id ORDER BY places.name");
  }
  function savePlace(body) {
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (!body.cityId || !String(body.name || "").trim() || !String(body.address || "").trim() || !(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180)) throw new Error("City, name, address and coordinates are required.");
    if (one("SELECT id FROM places WHERE city_id = ? AND lower(name) = ?", body.cityId, body.name.trim().toLowerCase())) throw new Error("This place already exists in the city.");
    const id = randomUUID();
    run("INSERT INTO places (id, name, address, city_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)", id, body.name.trim(), body.address.trim(), body.cityId, lat, lng);
    run("INSERT INTO address_cache (id, query, formatted, city_id) VALUES (?, ?, ?, ?)", randomUUID(), body.name.trim(), body.address.trim(), body.cityId);
    return listPlaces().find((item) => item.id === id);
  }
  function listIrregular() {
    return many("SELECT irregular_addresses.id, irregular_addresses.query, cities.name AS city, irregular_addresses.city_id AS cityId, irregular_addresses.status FROM irregular_addresses JOIN cities ON cities.id = irregular_addresses.city_id ORDER BY irregular_addresses.query");
  }
  function saveIrregular(body) {
    if (!body.cityId || !String(body.query || "").trim()) throw new Error("City and address are required.");
    if (one("SELECT id FROM irregular_addresses WHERE city_id = ? AND lower(query) = ? AND status = 'open'", body.cityId, body.query.trim().toLowerCase())) throw new Error("This address is already open.");
    const id = randomUUID();
    run("INSERT INTO irregular_addresses (id, query, city_id, status) VALUES (?, ?, ?, 'open')", id, body.query.trim(), body.cityId);
    return listIrregular().find((item) => item.id === id);
  }
  function resolveIrregular(id) {
    const row = one("SELECT id FROM irregular_addresses WHERE id = ? AND status = 'open'", id);
    if (!row) throw new Error("This address is not open.");
    run("UPDATE irregular_addresses SET status = 'resolved' WHERE id = ?", id);
    return listIrregular().find((item) => item.id === id);
  }
  function listAddressCache() {
    return many("SELECT address_cache.id, address_cache.query, address_cache.formatted, cities.name AS city FROM address_cache JOIN cities ON cities.id = address_cache.city_id ORDER BY address_cache.query");
  }
  function listHeatAreas() {
    return many("SELECT heat_areas.id, heat_areas.name, cities.name AS city, heat_areas.city_id AS cityId, heat_areas.intensity, heat_areas.radius_km AS radiusKm FROM heat_areas JOIN cities ON cities.id = heat_areas.city_id WHERE heat_areas.active = 1 ORDER BY heat_areas.name");
  }
  function saveHeatArea(body) {
    const intensity = Number(body.intensity);
    const radius = Number(body.radiusKm);
    if (!body.cityId || !String(body.name || "").trim() || !(intensity >= 1) || !(radius > 0)) throw new Error("City, name, radius and intensity of at least 1 are required.");
    const id = body.id || randomUUID();
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    run(
      `INSERT INTO heat_areas (id, name, city_id, latitude, longitude, radius_km, intensity, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, city_id = excluded.city_id, latitude = excluded.latitude, longitude = excluded.longitude, radius_km = excluded.radius_km, intensity = excluded.intensity, active = excluded.active`,
      id, body.name.trim(), body.cityId, Number(body.lat), Number(body.lng), radius, intensity, active
    );
    return { id, active };
  }
  function listMonitoringAreas() {
    return many("SELECT monitoring_areas.id, monitoring_areas.name, cities.name AS city, monitoring_areas.city_id AS cityId, monitoring_areas.radius_km AS radiusKm FROM monitoring_areas JOIN cities ON cities.id = monitoring_areas.city_id WHERE monitoring_areas.active = 1 ORDER BY monitoring_areas.name");
  }
  function saveMonitoringArea(body) {
    const radius = Number(body.radiusKm);
    if (!body.cityId || !String(body.name || "").trim() || !(radius > 0)) throw new Error("City, name and radius are required.");
    const id = body.id || randomUUID();
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    run(
      `INSERT INTO monitoring_areas (id, name, city_id, latitude, longitude, radius_km, active) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, city_id = excluded.city_id, latitude = excluded.latitude, longitude = excluded.longitude, radius_km = excluded.radius_km, active = excluded.active`,
      id, body.name.trim(), body.cityId, Number(body.lat), Number(body.lng), radius, active
    );
    return { id, active };
  }
  function listSequence() {
    return many("SELECT provider, sort_order AS sortOrder, active FROM map_sequence ORDER BY sort_order");
  }
  function saveSequence(body) {
    const provider = ["google", "here", "mapbox", "osm"].includes(body.provider) ? body.provider : "";
    const order = Number(body.order);
    if (!provider || !(order >= 1)) throw new Error("Provider and order are required.");
    if (one("SELECT provider FROM map_sequence WHERE sort_order = ? AND provider <> ?", order, provider)) throw new Error("Another provider already uses this order.");
    run(
      "INSERT INTO map_sequence (provider, sort_order, active) VALUES (?, ?, ?) ON CONFLICT(provider) DO UPDATE SET sort_order = excluded.sort_order, active = excluded.active",
      provider, order, body.active === "no" || body.active === 0 ? 0 : 1
    );
    return listSequence().find((item) => item.provider === provider);
  }
  function listBirthdays() {
    return many("SELECT audience, message, send_time AS sendTime, active FROM birthday_notices ORDER BY audience");
  }
  function saveBirthday(body) {
    const audience = ["riders", "drivers"].includes(body.audience) ? body.audience : "";
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    if (!audience || !/^\d{2}:\d{2}$/.test(String(body.sendTime || ""))) throw new Error("Audience and send time are required.");
    if (active && !String(body.message || "").trim()) throw new Error("An active birthday notice needs a message.");
    run("INSERT INTO birthday_notices (audience, message, send_time, active) VALUES (?, ?, ?, ?) ON CONFLICT(audience) DO UPDATE SET message = excluded.message, send_time = excluded.send_time, active = excluded.active", audience, String(body.message || "").trim(), body.sendTime, active);
    return listBirthdays().find((item) => item.audience === audience);
  }
  function runBirthdays() {
    const notice = one("SELECT * FROM birthday_notices WHERE audience = 'riders' AND active = 1");
    if (!notice) throw new Error("The rider birthday notice is off.");
    const day = now().slice(5, 10);
    const year = now().slice(0, 4);
    const people = many("SELECT accounts.id FROM accounts JOIN customers ON customers.account_id = accounts.id WHERE substr(accounts.birth_date, 6, 5) = ?", day);
    let sent = 0;
    people.forEach((person) => {
      if (one("SELECT id FROM birthday_sends WHERE account_id = ? AND year = ?", person.id, year)) return;
      run("INSERT INTO birthday_sends (id, account_id, year) VALUES (?, ?, ?)", randomUUID(), person.id, year);
      sent += 1;
    });
    return { sent };
  }
  function whatsappStatus() {
    return one("SELECT phone, status FROM whatsapp_session WHERE id = 'default'") || { phone: "", status: "disconnected" };
  }
  function saveWhatsappSession(body) {
    const status = ["disconnected", "connecting", "connected"].includes(body.status) ? body.status : "";
    if (!status) throw new Error("Choose a session status.");
    if (status === "connected" && !String(body.phone || "").trim()) throw new Error("A connected session needs a phone.");
    run("INSERT INTO whatsapp_session (id, phone, status) VALUES ('default', ?, ?) ON CONFLICT(id) DO UPDATE SET phone = excluded.phone, status = excluded.status", String(body.phone || "").trim(), status);
    return whatsappStatus();
  }
  function listWhatsappKeys() {
    return many("SELECT id, name, sender, active FROM whatsapp_keys ORDER BY name");
  }
  function saveWhatsappKey(body) {
    if (!String(body.name || "").trim() || !String(body.sender || "").trim()) throw new Error("Name and sender are required.");
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    if (active) run("UPDATE whatsapp_keys SET active = 0");
    const id = body.id || randomUUID();
    run("INSERT INTO whatsapp_keys (id, name, sender, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, sender = excluded.sender, active = excluded.active", id, body.name.trim(), body.sender.trim(), active);
    return listWhatsappKeys().find((item) => item.id === id);
  }
  function listWhatsappGroups() {
    return many("SELECT id, name, message, driver_message AS driverMessage, auto_group AS autoGroup, auto_driver AS autoDriver FROM whatsapp_groups WHERE active = 1 ORDER BY name");
  }
  function saveWhatsappGroup(body) {
    const name = String(body.name || "").trim();
    if (!name) throw new Error("Group name is required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO whatsapp_groups (id, name, message, driver_message, auto_group, auto_driver, active) VALUES (?, ?, ?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, message = excluded.message, driver_message = excluded.driver_message, auto_group = excluded.auto_group, auto_driver = excluded.auto_driver, active = 1`,
      id, name, String(body.message || "").trim(), String(body.driverMessage || "").trim(), body.autoGroup ? 1 : 0, body.autoDriver ? 1 : 0
    );
    return listWhatsappGroups().find((item) => item.id === id);
  }
  function listWhatsappNotices() {
    return many("SELECT id, template, minutes_before AS minutesBefore, active FROM whatsapp_notices ORDER BY minutes_before");
  }
  function saveWhatsappNotice(body) {
    const minutes = Number(body.minutesBefore);
    const active = body.active === "no" || body.active === 0 ? 0 : 1;
    if (!(minutes >= 0) || (active && !String(body.template || "").trim())) throw new Error("Minutes and a template are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO whatsapp_notices (id, template, minutes_before, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET template = excluded.template, minutes_before = excluded.minutes_before, active = excluded.active", id, String(body.template || "").trim(), minutes, active);
    return listWhatsappNotices().find((item) => item.id === id);
  }
  function sendTripWhatsapp(tripId) {
    const session = whatsappStatus();
    if (session.status !== "connected") throw new Error("WhatsApp is not connected.");
    if (!one("SELECT id FROM whatsapp_keys WHERE active = 1")) throw new Error("There is no active WhatsApp key.");
    if (!one("SELECT id FROM whatsapp_notices WHERE active = 1")) throw new Error("There is no active trip notice.");
    if (!one("SELECT id FROM trips WHERE id = ?", tripId)) throw new Error("Choose a trip.");
    if (one("SELECT id FROM whatsapp_deliveries WHERE trip_id = ?", tripId)) throw new Error("This trip notice was already sent.");
    run("INSERT INTO whatsapp_deliveries (id, trip_id, sent_at) VALUES (?, ?, ?)", randomUUID(), tripId, now());
    return { tripId, status: "sent" };
  }
  function saveSmtp(body) {
    const active = body.active === "yes" || body.active === 1 ? 1 : 0;
    if (active && (!String(body.host || "").trim() || !String(body.from || "").trim())) throw new Error("Active SMTP needs a host and a from address.");
    run("INSERT INTO smtp_settings (id, host, port, from_email, encryption, active) VALUES ('default', ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET host = excluded.host, port = excluded.port, from_email = excluded.from_email, encryption = excluded.encryption, active = excluded.active", String(body.host || "").trim(), Number(body.port || 587), String(body.from || "").trim(), body.encryption || "starttls", active);
    return one("SELECT host, port, from_email AS fromEmail, encryption, active FROM smtp_settings WHERE id = 'default'");
  }
  function listOutbox() {
    return many("SELECT id, email, created_at AS createdAt FROM mail_outbox ORDER BY created_at DESC");
  }
  function issueRecovery(email) {
    const length = Number(one("SELECT length FROM confirmation_codes WHERE id = 'default'")?.length || 4);
    const code = String(Math.floor(Math.random() * 10 ** length)).padStart(length, "0");
    const smtp = one("SELECT * FROM smtp_settings WHERE id = 'default'");
    if (smtp?.active) {
      run("INSERT INTO mail_outbox (id, email, body, created_at) VALUES (?, ?, ?, ?)", randomUUID(), email, `Recovery code ${code}`, now());
      return { queued: true, code };
    }
    return { queued: false, code };
  }
  function saveConfirmation(body) {
    const length = Number(body.length);
    const ttl = Number(body.ttlSeconds);
    const channel = ["sms", "whatsapp", "email"].includes(body.channel) ? body.channel : "";
    if (!channel || length < 4 || length > 8 || !(ttl >= 30)) throw new Error("Channel, length from 4 to 8 and a TTL of at least 30 seconds are required.");
    run("INSERT INTO confirmation_codes (id, channel, length, ttl_seconds) VALUES ('default', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET channel = excluded.channel, length = excluded.length, ttl_seconds = excluded.ttl_seconds", channel, length, ttl);
    return one("SELECT channel, length, ttl_seconds AS ttlSeconds FROM confirmation_codes WHERE id = 'default'");
  }
  function listTerms() {
    return many("SELECT id, audience, title, version, active FROM terms ORDER BY title");
  }
  function saveTerm(body) {
    const audience = ["rider", "driver", "both"].includes(body.audience) ? body.audience : "";
    if (!audience || !String(body.title || "").trim() || !String(body.version || "").trim() || !String(body.body || "").trim()) throw new Error("Audience, title, version and body are required.");
    if (body.active !== "no") run("UPDATE terms SET active = 0 WHERE audience = ?", audience);
    const id = body.id || randomUUID();
    run("INSERT INTO terms (id, audience, title, version, body, active) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, version = excluded.version, body = excluded.body, active = excluded.active", id, audience, body.title.trim(), body.version.trim(), body.body.trim(), body.active === "no" ? 0 : 1);
    return listTerms().find((item) => item.id === id);
  }
  function acceptTerms(body) {
    const term = one("SELECT id FROM terms WHERE id = ? AND active = 1", body.termId);
    if (!term || !body.customerId) throw new Error("Choose an active term and a rider.");
    run("INSERT INTO term_acceptances (term_id, customer_id, accepted_at) VALUES (?, ?, ?) ON CONFLICT(term_id, customer_id) DO UPDATE SET accepted_at = excluded.accepted_at", term.id, body.customerId, now());
    return { ok: true };
  }
  function saveFirebase(body) {
    const projectId = String(body.projectId || "").trim();
    const flags = [body.auth, body.firestore, body.messaging].some((value) => value === "yes" || value === 1);
    if (flags && !projectId) throw new Error("Firebase needs a project id before a service is enabled.");
    run("INSERT INTO firebase_status (id, project_id, auth_on, firestore_on, messaging_on) VALUES ('default', ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET project_id = excluded.project_id, auth_on = excluded.auth_on, firestore_on = excluded.firestore_on, messaging_on = excluded.messaging_on", projectId, body.auth === "yes" ? 1 : 0, body.firestore === "yes" ? 1 : 0, body.messaging === "yes" ? 1 : 0);
    return one("SELECT project_id AS projectId, auth_on AS auth, firestore_on AS firestore, messaging_on AS messaging FROM firebase_status WHERE id = 'default'");
  }
  function listVersions() {
    return many("SELECT id, platform, version, is_current AS current FROM app_versions ORDER BY platform, version");
  }
  function saveVersion(body) {
    const platform = ["android", "ios"].includes(body.platform) ? body.platform : "";
    if (!platform || !/^\d+\.\d+\.\d+$/.test(String(body.version || ""))) throw new Error("Platform and a version like 1.0.0 are required.");
    run("UPDATE app_versions SET is_current = 0 WHERE platform = ?", platform);
    const id = randomUUID();
    run("INSERT INTO app_versions (id, platform, version, is_current) VALUES (?, ?, ?, 1)", id, platform, body.version);
    return listVersions().find((item) => item.id === id);
  }
  function saveAppConfig(body) {
    const platform = ["android", "ios", "both"].includes(body.platform) ? body.platform : "";
    if (!platform || !one("SELECT id FROM app_versions WHERE platform = ? AND version = ?", platform === "both" ? "android" : platform, body.minVersion)) throw new Error("The minimum version must already be released.");
    run("INSERT INTO app_config (platform, min_version, force_update) VALUES (?, ?, ?) ON CONFLICT(platform) DO UPDATE SET min_version = excluded.min_version, force_update = excluded.force_update", platform, body.minVersion, body.forceUpdate === "yes" ? 1 : 0);
    return one("SELECT platform, min_version AS minVersion, force_update AS forceUpdate FROM app_config WHERE platform = ?", platform);
  }
  function listDeliverySettings() {
    return many("SELECT delivery_settings.city_id AS cityId, cities.name AS city, delivery_settings.min_order_cents AS minOrder, COALESCE(delivery_prep.default_fee_cents, 0) AS defaultFee, COALESCE(delivery_prep.prep_minutes, 0) AS prepMinutes FROM delivery_settings JOIN cities ON cities.id = delivery_settings.city_id LEFT JOIN delivery_prep ON delivery_prep.city_id = delivery_settings.city_id");
  }
  function saveDeliverySettings(body) {
    if (!body.cityId) throw new Error("City is required.");
    const minOrder = dollarsToCents(body.minOrder);
    const defaultFee = dollarsToCents(body.defaultFee);
    const prepMinutes = Number(body.prepMinutes || 0);
    if (minOrder < 0 || defaultFee < 0) throw new Error("Minimum order and default fee cannot be negative.");
    if (!Number.isInteger(prepMinutes) || prepMinutes < 0 || prepMinutes > 180) throw new Error("Prep time must be from 0 to 180 minutes.");
    run("INSERT INTO delivery_settings (city_id, min_order_cents) VALUES (?, ?) ON CONFLICT(city_id) DO UPDATE SET min_order_cents = excluded.min_order_cents", body.cityId, minOrder);
    run("INSERT INTO delivery_prep (city_id, default_fee_cents, prep_minutes) VALUES (?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET default_fee_cents = excluded.default_fee_cents, prep_minutes = excluded.prep_minutes", body.cityId, defaultFee, prepMinutes);
    return listDeliverySettings().find((item) => item.cityId === body.cityId);
  }
  function saveDriverSignup(body) {
    run("INSERT INTO driver_signup_config (id, require_vehicle) VALUES ('default', ?) ON CONFLICT(id) DO UPDATE SET require_vehicle = excluded.require_vehicle", body.requireVehicle === "yes" ? 1 : 0);
    return one("SELECT require_vehicle AS requireVehicle FROM driver_signup_config WHERE id = 'default'");
  }
  function confirmationStatus() {
    const row = one("SELECT channel, length, ttl_seconds AS ttlSeconds FROM confirmation_codes WHERE id = 'default'");
    return row ? [row] : [];
  }
  function firebaseStatus() {
    const row = one("SELECT project_id AS projectId, auth_on AS auth, firestore_on AS firestore, messaging_on AS messaging FROM firebase_status WHERE id = 'default'");
    return row ? [row] : [];
  }
  function listAppConfig() {
    return many("SELECT platform, min_version AS minVersion, force_update AS forceUpdate FROM app_config");
  }
  function driverSignupStatus() {
    const row = one("SELECT require_vehicle AS requireVehicle FROM driver_signup_config WHERE id = 'default'");
    return row ? [row] : [];
  }
  function listSections() {
    return many("SELECT delivery_sections.id, delivery_sections.name, delivery_sections.sort_order AS sort, cities.name AS city, delivery_sections.city_id AS cityId FROM delivery_sections JOIN cities ON cities.id = delivery_sections.city_id WHERE delivery_sections.active = 1 ORDER BY delivery_sections.sort_order");
  }
  function saveSection(body) {
    const sort = Number(body.sort);
    const name = String(body.name || "").trim();
    if (!body.cityId || !name || !(sort >= 1)) throw new Error("City, name and an order of at least 1 are required.");
    if (one("SELECT id FROM delivery_sections WHERE city_id = ? AND lower(name) = ? AND id != ?", body.cityId, name.toLowerCase(), body.id || "")) throw new Error("This section already exists in the city.");
    if (one("SELECT id FROM delivery_sections WHERE city_id = ? AND sort_order = ? AND active = 1 AND id != ?", body.cityId, sort, body.id || "")) throw new Error("Another section already uses this order.");
    const id = body.id || randomUUID();
    run("INSERT INTO delivery_sections (id, city_id, name, sort_order, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, sort_order = excluded.sort_order, active = 1", id, body.cityId, name, sort);
    return listSections().find((item) => item.id === id);
  }
  function linkSection(body) {
    const section = one("SELECT id, city_id FROM delivery_sections WHERE id = ? AND active = 1", body.sectionId);
    const place = one("SELECT id, city_id FROM establishments WHERE id = ?", body.establishmentId);
    if (!section || !place || section.city_id !== place.city_id) throw new Error("Choose a section in the establishment city.");
    run("INSERT INTO establishment_sections (establishment_id, section_id) VALUES (?, ?) ON CONFLICT(establishment_id) DO UPDATE SET section_id = excluded.section_id", place.id, section.id);
    return { ok: true };
  }
  function listAccessories() {
    return many("SELECT id, name, price_cents AS price, active FROM delivery_accessories ORDER BY name");
  }
  function saveAccessory(body) {
    const name = String(body.name || "").trim();
    const price = dollarsToCents(body.price);
    if (!name || price < 0) throw new Error("Name and a price of zero or more are required.");
    if (one("SELECT id FROM delivery_accessories WHERE lower(name) = ? AND id != ?", name.toLowerCase(), body.id || "")) throw new Error("This accessory already exists.");
    const id = body.id || randomUUID();
    run("INSERT INTO delivery_accessories (id, name, price_cents, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, price_cents = excluded.price_cents, active = excluded.active", id, name, price, body.active === "no" ? 0 : 1);
    return listAccessories().find((item) => item.id === id);
  }
  function deliveryConfig() {
    const row = one("SELECT dispatch_mode AS dispatchMode, max_radius_km AS maxRadiusKm, driver_share_percent AS driverShare, active FROM delivery_config WHERE id = 'default'");
    return row ? [row] : [];
  }
  function saveDeliveryConfig(body) {
    const mode = ["nearest", "queue", "manual"].includes(body.dispatchMode) ? body.dispatchMode : "";
    const share = Number(body.driverShare);
    const radius = Number(body.maxRadiusKm || 0);
    if (!mode || share < 0 || share > 100 || radius < 0) throw new Error("Mode, a driver share from 0 to 100 and a radius are required.");
    run("INSERT INTO delivery_config (id, dispatch_mode, max_radius_km, driver_share_percent, active) VALUES ('default', ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET dispatch_mode = excluded.dispatch_mode, max_radius_km = excluded.max_radius_km, driver_share_percent = excluded.driver_share_percent, active = excluded.active", mode, radius, share, body.active === "yes" ? 1 : 0);
    return deliveryConfig()[0];
  }
  function asaasStatus() {
    const row = one("SELECT environment, wallet_id AS walletId, active FROM asaas_settings WHERE id = 'default'");
    return row ? [row] : [];
  }
  function saveAsaas(body) {
    const environment = ["sandbox", "production"].includes(body.environment) ? body.environment : "";
    const walletId = String(body.walletId || "").trim();
    const active = body.active === "yes" ? 1 : 0;
    if (!environment) throw new Error("Choose sandbox or production.");
    if (active && walletId.length < 8) throw new Error("An active ASAAS account needs a wallet id.");
    if (environment === "production" && active && !/^[A-Za-z0-9_-]{8,}$/.test(walletId)) throw new Error("Production ASAAS needs a wallet id.");
    run("INSERT INTO asaas_settings (id, environment, wallet_id, active) VALUES ('default', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET environment = excluded.environment, wallet_id = excluded.wallet_id, active = excluded.active", environment, walletId, active);
    return asaasStatus()[0];
  }
  function listDeliveryCalls() {
    return many("SELECT delivery_calls.city_id AS cityId, cities.name AS city, delivery_calls.radius_km AS radiusKm, delivery_calls.timeout_seconds AS timeoutSeconds, delivery_calls.auto_accept AS autoAccept FROM delivery_calls JOIN cities ON cities.id = delivery_calls.city_id");
  }
  function saveDeliveryCall(body) {
    const radius = Number(body.radiusKm);
    const timeout = Number(body.timeoutSeconds);
    if (!body.cityId || !(radius > 0) || !(timeout >= 15)) throw new Error("City, a radius and a timeout of at least 15 seconds are required.");
    run("INSERT INTO delivery_calls (city_id, radius_km, timeout_seconds, auto_accept) VALUES (?, ?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET radius_km = excluded.radius_km, timeout_seconds = excluded.timeout_seconds, auto_accept = excluded.auto_accept", body.cityId, radius, timeout, body.autoAccept === "no" ? 0 : 1);
    return listDeliveryCalls().find((item) => item.cityId === body.cityId);
  }
  function listSettlements() {
    return many("SELECT delivery_settlements.id, establishments.name AS establishment, delivery_settlements.gross_cents AS gross, delivery_settlements.fee_cents AS fee, delivery_settlements.net_cents AS net, delivery_settlements.driver_cents AS driverCut, delivery_settlements.created_at AS createdAt FROM delivery_settlements JOIN establishments ON establishments.id = delivery_settlements.establishment_id ORDER BY delivery_settlements.created_at DESC");
  }
  function settleDelivery(body) {
    const place = one("SELECT id FROM establishments WHERE id = ?", body.establishmentId);
    if (!place) throw new Error("Choose an establishment.");
    const orders = many("SELECT id, subtotal_cents, fee_cents, total_cents FROM delivery_orders WHERE establishment_id = ? AND status IN ('picked_up', 'delivered') AND id NOT IN (SELECT order_id FROM delivery_settlement_orders)", place.id);
    if (!orders.length) throw new Error("There is nothing to settle.");
    const share = Number(one("SELECT driver_share_percent FROM delivery_config WHERE id = 'default' AND active = 1")?.driver_share_percent || 0);
    const gross = orders.reduce((sum, order) => sum + order.total_cents, 0);
    const fee = orders.reduce((sum, order) => sum + order.fee_cents, 0);
    const net = orders.reduce((sum, order) => sum + order.subtotal_cents, 0);
    const driverCut = Math.round(fee * share / 100);
    const id = randomUUID();
    run("INSERT INTO delivery_settlements (id, establishment_id, gross_cents, fee_cents, net_cents, driver_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", id, place.id, gross, fee, net, driverCut, now());
    orders.forEach((order) => run("INSERT INTO delivery_settlement_orders (order_id, settlement_id) VALUES (?, ?)", order.id, id));
    return listSettlements().find((item) => item.id === id);
  }
  function saveAcquirer(body) {
    const provider = ["stripe", "asaas", "other"].includes(body.provider) ? body.provider : "";
    const environment = ["test", "live"].includes(body.environment) ? body.environment : "";
    const publicKey = String(body.publicKey || "").trim();
    const active = body.active === "yes" ? 1 : 0;
    if (!provider || !environment) throw new Error("Provider and environment are required.");
    if (active && publicKey.length < 8) throw new Error("An active acquirer needs a public key.");
    if (active && environment === "live") throw new Error("Production card capture is not connected.");
    run("INSERT INTO acquirer_accounts (id, provider, public_key, environment, active) VALUES ('default', ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET provider = excluded.provider, public_key = excluded.public_key, environment = excluded.environment, active = excluded.active", provider, publicKey, environment, active);
    return one("SELECT provider, public_key AS publicKey, environment, active FROM acquirer_accounts WHERE id = 'default'");
  }
  function acquirerAccount() {
    const row = one("SELECT provider, public_key AS publicKey, environment, active FROM acquirer_accounts WHERE id = 'default'");
    return row ? [row] : [];
  }
  function listCityAcquirers() {
    return many("SELECT acquirer_cities.city_id AS cityId, cities.name AS city, acquirer_cities.provider, acquirer_cities.active FROM acquirer_cities JOIN cities ON cities.id = acquirer_cities.city_id");
  }
  function saveCityAcquirer(body) {
    if (!body.cityId) throw new Error("City is required.");
    const account = one("SELECT provider, active FROM acquirer_accounts WHERE id = 'default'");
    const active = body.active === "yes" ? 1 : 0;
    if (active && (!account || !account.active)) throw new Error("Activate the global acquirer first.");
    const provider = account?.provider || "";
    if (!provider) throw new Error("Choose the global acquirer first.");
    run("INSERT INTO acquirer_cities (city_id, provider, active) VALUES (?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET provider = excluded.provider, active = excluded.active", body.cityId, provider, active);
    return listCityAcquirers().find((item) => item.cityId === body.cityId);
  }
  function listAcquirerTransactions() {
    return many("SELECT acquirer_transactions.id, acquirer_transactions.trip_id AS tripId, cities.name AS city, acquirer_transactions.amount_cents AS amount, acquirer_transactions.method, acquirer_transactions.status FROM acquirer_transactions JOIN cities ON cities.id = acquirer_transactions.city_id ORDER BY acquirer_transactions.created_at DESC");
  }
  function chargeAcquirer(body) {
    const trip = one("SELECT id, city_id, fare_cents, payment FROM trips WHERE id = ?", body.tripId);
    if (!trip) throw new Error("Choose a trip.");
    if (trip.payment !== "card") throw new Error("Only card trips are sent to the acquirer.");
    const account = one("SELECT * FROM acquirer_accounts WHERE id = 'default' AND active = 1");
    const city = one("SELECT * FROM acquirer_cities WHERE city_id = ? AND active = 1", trip.city_id);
    if (!account || !city || city.provider !== account.provider) throw new Error("This city has no active acquirer.");
    if (account.environment !== "test") throw new Error("Production card capture is not connected.");
    if (one("SELECT id FROM acquirer_transactions WHERE trip_id = ?", trip.id)) throw new Error("This trip was already sent to the acquirer.");
    const id = randomUUID();
    run("INSERT INTO acquirer_transactions (id, trip_id, city_id, amount_cents, method, status, created_at) VALUES (?, ?, ?, ?, 'card', 'authorized', ?)", id, trip.id, trip.city_id, trip.fare_cents, now());
    return listAcquirerTransactions().find((item) => item.id === id);
  }
  function saveDispatch(body) {
    const mode = ["nearest", "queue", "manual"].includes(body.mode) ? body.mode : "";
    const offer = Number(body.offerSeconds);
    const maxDrivers = Number(body.maxDrivers);
    if (!mode || !(offer >= 10) || !(maxDrivers >= 1)) throw new Error("Mode, an offer of at least 10 seconds and at least one driver are required.");
    run("INSERT INTO dispatch_settings (id, mode, offer_seconds, max_drivers, active) VALUES ('default', ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET mode = excluded.mode, offer_seconds = excluded.offer_seconds, max_drivers = excluded.max_drivers, active = excluded.active", mode, offer, maxDrivers, body.active === "yes" ? 1 : 0);
    return one("SELECT mode, offer_seconds AS offerSeconds, max_drivers AS maxDrivers, active FROM dispatch_settings WHERE id = 'default'");
  }
  function dispatchStatus() {
    const row = one("SELECT mode, offer_seconds AS offerSeconds, max_drivers AS maxDrivers, active FROM dispatch_settings WHERE id = 'default'");
    return row ? [row] : [];
  }
  function listFinanceReports() {
    return many("SELECT id, name, period, gross_cents AS gross, net_cents AS net, created_at AS createdAt FROM finance_report_snapshots ORDER BY created_at DESC");
  }
  function runFinanceReport(body) {
    const period = String(body.period || "");
    const name = String(body.name || "").trim();
    if (!name || !/^\d{4}-\d{2}$/.test(period)) throw new Error("Name and a period like 2026-11 are required.");
    const trips = many("SELECT fare_cents, city_id, trip_type_id FROM trips WHERE status = 'completed' AND substr(created_at, 1, 7) = ?", period);
    if (!trips.length) throw new Error("There are no completed trips in this period.");
    const gross = trips.reduce((sum, trip) => sum + Number(trip.fare_cents), 0);
    const net = gross - trips.reduce((sum, trip) => sum + commissionAmount(trip), 0);
    const id = randomUUID();
    run("INSERT INTO finance_report_snapshots (id, name, period, gross_cents, net_cents, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, name, period, gross, net, now());
    return listFinanceReports().find((item) => item.id === id);
  }
  function listAlerts() {
    return many("SELECT admin_alerts.id, staff.name AS user, admin_alerts.message, admin_alerts.status, admin_alerts.created_at AS createdAt FROM admin_alerts JOIN staff ON staff.id = admin_alerts.staff_id ORDER BY admin_alerts.created_at DESC");
  }
  function saveAlert(body) {
    const staff = one("SELECT id FROM staff WHERE id = ? AND active = 1", body.staffId);
    if (!staff || !String(body.message || "").trim()) throw new Error("Choose an active user and write the message.");
    const id = randomUUID();
    run("INSERT INTO admin_alerts (id, staff_id, message, status, created_at) VALUES (?, ?, ?, 'open', ?)", id, staff.id, body.message.trim(), now());
    return listAlerts().find((item) => item.id === id);
  }
  function readAlert(id) {
    const row = one("SELECT status FROM admin_alerts WHERE id = ?", id);
    if (!row || row.status !== "open") throw new Error("Only an open alert can be marked read.");
    run("UPDATE admin_alerts SET status = 'read' WHERE id = ?", id);
    return { ok: true };
  }
  function listExternalServices() {
    return many("SELECT id, name, base_url AS baseUrl, active FROM external_services ORDER BY name");
  }
  function saveExternalService(body) {
    const name = String(body.name || "").trim();
    const baseUrl = String(body.baseUrl || "").trim();
    if (!name || !baseUrl.startsWith("https://")) throw new Error("Name and an https address are required.");
    if (one("SELECT id FROM external_services WHERE lower(name) = ? AND id != ?", name.toLowerCase(), body.id || "")) throw new Error("This service already exists.");
    const id = body.id || randomUUID();
    const active = body.active === "yes" ? 1 : 0;
    run("INSERT INTO external_services (id, name, base_url, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, base_url = excluded.base_url, active = excluded.active", id, name, baseUrl, active);
    if (!active) run("UPDATE external_city_services SET active = 0 WHERE service_id = ?", id);
    return listExternalServices().find((item) => item.id === id);
  }
  function listExternalCityServices() {
    return many("SELECT external_city_services.city_id AS cityId, external_city_services.service_id AS serviceId, cities.name AS city, external_services.name AS service, external_city_services.active FROM external_city_services JOIN cities ON cities.id = external_city_services.city_id JOIN external_services ON external_services.id = external_city_services.service_id");
  }
  function saveExternalCityService(body) {
    const service = one("SELECT id, active FROM external_services WHERE id = ?", body.serviceId);
    if (!body.cityId || !service) throw new Error("Choose a city and a service.");
    const active = body.active === "yes" ? 1 : 0;
    if (active && !service.active) throw new Error("The global service is off.");
    run("INSERT INTO external_city_services (city_id, service_id, active) VALUES (?, ?, ?) ON CONFLICT(city_id, service_id) DO UPDATE SET active = excluded.active", body.cityId, service.id, active);
    return listExternalCityServices().find((item) => item.cityId === body.cityId && item.serviceId === service.id);
  }
  function listWebhooks() {
    return many("SELECT id, event, url, active FROM webhooks ORDER BY event");
  }
  function saveWebhook(body) {
    const event = ["trip.completed", "trip.cancelled"].includes(body.event) ? body.event : "";
    const url = String(body.url || "").trim();
    if (!event || !url.startsWith("https://")) throw new Error("Choose an event and an https address.");
    if (one("SELECT id FROM webhooks WHERE event = ? AND active = 1 AND id != ?", event, body.id || "") && body.active !== "no") throw new Error("This event already has an active webhook.");
    const id = body.id || randomUUID();
    run("INSERT INTO webhooks (id, event, url, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET event = excluded.event, url = excluded.url, active = excluded.active", id, event, url, body.active === "no" ? 0 : 1);
    return listWebhooks().find((item) => item.id === id);
  }
  function listWebhookDeliveries() {
    return many("SELECT webhook_deliveries.id, webhooks.event, webhooks.url, webhook_deliveries.trip_id AS tripId, webhook_deliveries.created_at AS createdAt FROM webhook_deliveries JOIN webhooks ON webhooks.id = webhook_deliveries.webhook_id ORDER BY webhook_deliveries.created_at DESC");
  }
  function writeLog(level, source, message) {
    run("INSERT INTO monitor_logs (id, level, source, message, created_at) VALUES (?, ?, ?, ?, ?)", randomUUID(), level, source, message, now());
  }
  function missingDriverDocument(driverId, service) {
    if (one("SELECT id FROM app_documents WHERE audience = 'driver' AND required = 1 AND active = 1 AND NOT EXISTS (SELECT 1 FROM document_files f WHERE f.document_id = app_documents.id AND f.driver_id = ? AND f.status = 'approved')", driverId)) return true;
    return Boolean(one("SELECT document_requirements.id FROM document_requirements JOIN app_documents ON app_documents.id = document_requirements.document_id AND app_documents.active = 1 WHERE document_requirements.category = ? AND document_requirements.required = 1 AND NOT EXISTS (SELECT 1 FROM document_files f WHERE f.document_id = document_requirements.document_id AND f.driver_id = ? AND f.status = 'approved')", service || "private", driverId));
  }
  function listAppDocuments() {
    return many("SELECT id, name, audience, required, active FROM app_documents ORDER BY audience, name");
  }
  function saveAppDocument(body) {
    const audience = ["rider", "driver"].includes(body.audience) ? body.audience : "";
    const name = String(body.name || "").trim();
    if (!audience || !name) throw new Error("Audience and document name are required.");
    if (one("SELECT id FROM app_documents WHERE audience = ? AND lower(name) = ? AND id != ?", audience, name.toLowerCase(), body.id || "")) throw new Error("This document already exists.");
    const id = body.id || randomUUID();
    run("INSERT INTO app_documents (id, name, audience, required, active) VALUES (?, ?, ?, ?, 1) ON CONFLICT(id) DO UPDATE SET name = excluded.name, required = excluded.required, active = 1", id, name, audience, body.required === "yes" ? 1 : 0);
    return listAppDocuments().find((item) => item.id === id);
  }
  function listDocumentRequirements() {
    return many("SELECT document_requirements.id, document_requirements.category, app_documents.name AS document, document_requirements.required FROM document_requirements JOIN app_documents ON app_documents.id = document_requirements.document_id ORDER BY document_requirements.category");
  }
  function saveDocumentRequirement(body) {
    const category = ["private", "delivery", "freight"].includes(body.category) ? body.category : "";
    const doc = one("SELECT id FROM app_documents WHERE id = ? AND audience = 'driver' AND active = 1", body.documentId);
    if (!category || !doc) throw new Error("Choose a category and a driver document.");
    const existing = one("SELECT id FROM document_requirements WHERE category = ? AND document_id = ?", category, doc.id);
    if (existing) {
      run("UPDATE document_requirements SET required = ? WHERE id = ?", body.required === "no" ? 0 : 1, existing.id);
      return listDocumentRequirements().find((item) => item.id === existing.id);
    }
    const id = randomUUID();
    run("INSERT INTO document_requirements (id, category, document_id, required) VALUES (?, ?, ?, ?)", id, category, doc.id, body.required === "no" ? 0 : 1);
    return listDocumentRequirements().find((item) => item.id === id);
  }
  function submitDocument(body) {
    const doc = one("SELECT id, audience FROM app_documents WHERE id = ? AND active = 1", body.documentId);
    const status = ["submitted", "approved", "rejected"].includes(body.status) ? body.status : "";
    if (!doc || !status) throw new Error("Choose an active document and a status.");
    if (doc.audience === "driver" && !body.driverId) throw new Error("Choose a driver.");
    if (doc.audience === "rider" && !body.customerId) throw new Error("Choose a rider.");
    const id = randomUUID();
    run("INSERT INTO document_files (id, document_id, driver_id, customer_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, doc.id, doc.audience === "driver" ? body.driverId : null, doc.audience === "rider" ? body.customerId : null, status, now());
    return { id, status };
  }
  function listPhones() {
    return many("SELECT phone_book.id, phone_book.name, phone_book.phone, phone_book.department, cities.name AS city FROM phone_book JOIN cities ON cities.id = phone_book.city_id ORDER BY phone_book.name");
  }
  function savePhone(body) {
    const phone = String(body.phone || "").replace(/\D/g, "");
    if (!body.cityId || !String(body.name || "").trim() || !String(body.department || "").trim() || phone.length < 8) throw new Error("Name, department, city and a phone of at least 8 digits are required.");
    if (one("SELECT id FROM phone_book WHERE phone = ? AND id != ?", phone, body.id || "")) throw new Error("This phone is already on the list.");
    const id = body.id || randomUUID();
    run("INSERT INTO phone_book (id, name, phone, department, city_id) VALUES (?, ?, ?, ?, ?)", id, body.name.trim(), phone, body.department.trim(), body.cityId);
    return listPhones().find((item) => item.id === id);
  }
  function listPolicies() {
    return many("SELECT id, title, version, active FROM usage_policies ORDER BY title");
  }
  function savePolicy(body) {
    if (!String(body.title || "").trim() || !String(body.version || "").trim() || !String(body.body || "").trim()) throw new Error("Title, version and body are required.");
    const active = body.active === "yes" ? 1 : 0;
    if (active) run("UPDATE usage_policies SET active = 0");
    const id = body.id || randomUUID();
    run("INSERT INTO usage_policies (id, title, version, body, active) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET title = excluded.title, version = excluded.version, body = excluded.body, active = excluded.active", id, body.title.trim(), body.version.trim(), body.body.trim(), active);
    writeLog("info", "policy", active ? "Usage policy published" : "Usage policy saved");
    return listPolicies().find((item) => item.id === id);
  }
  function acceptPolicy(body) {
    const policy = one("SELECT id FROM usage_policies WHERE id = ? AND active = 1", body.policyId);
    if (!policy || !body.customerId) throw new Error("Choose the active policy and a rider.");
    run("INSERT INTO policy_acceptances (policy_id, customer_id, accepted_at) VALUES (?, ?, ?) ON CONFLICT(policy_id, customer_id) DO UPDATE SET accepted_at = excluded.accepted_at", policy.id, body.customerId, now());
    return { ok: true };
  }
  function listChatMessages() {
    return many("SELECT id, code, message, active FROM driver_chat_messages ORDER BY code");
  }
  function saveChatMessage(body) {
    const code = String(body.code || "").trim().toUpperCase();
    const message = String(body.message || "").trim();
    if (!code || !message) throw new Error("Code and message are required.");
    if (one("SELECT id FROM driver_chat_messages WHERE code = ? AND id != ?", code, body.id || "")) throw new Error("This chat code already exists.");
    const id = body.id || randomUUID();
    run("INSERT INTO driver_chat_messages (id, code, message, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET code = excluded.code, message = excluded.message, active = excluded.active", id, code, message, body.active === "no" ? 0 : 1);
    return listChatMessages().find((item) => item.id === id);
  }
  function sendDriverChat(body) {
    const canned = one("SELECT * FROM driver_chat_messages WHERE id = ? AND active = 1", body.messageId);
    const trip = one("SELECT id FROM trips WHERE id = ?", body.tripId);
    if (!canned || !trip) throw new Error("Choose an active message and a trip.");
    const suggestions = many("SELECT text FROM suggestion_texts WHERE context = 'chat' AND active = 1");
    if (suggestions.length && !suggestions.some((item) => item.text === canned.message)) throw new Error("Use an active chat suggestion.");
    const id = randomUUID();
    run("INSERT INTO driver_chat_log (id, trip_id, message_id, created_at) VALUES (?, ?, ?, ?)", id, trip.id, canned.id, now());
    return { id, tripId: trip.id };
  }
  function listSuggestions() {
    return many("SELECT id, context, text, active FROM suggestion_texts ORDER BY context");
  }
  function saveSuggestion(body) {
    const context = ["chat", "cancel", "rating"].includes(body.context) ? body.context : "";
    const text = String(body.text || "").trim();
    if (!context || !text) throw new Error("Context and text are required.");
    if (one("SELECT id FROM suggestion_texts WHERE context = ? AND lower(text) = ? AND id != ?", context, text.toLowerCase(), body.id || "")) throw new Error("This suggestion already exists.");
    const active = body.active === "no" ? 0 : 1;
    if (active) run("UPDATE suggestion_texts SET active = 0 WHERE context = ?", context);
    const id = body.id || randomUUID();
    run("INSERT INTO suggestion_texts (id, context, text, active) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET text = excluded.text, active = excluded.active", id, context, text, active);
    return listSuggestions().find((item) => item.id === id);
  }
  function listAppKeys() {
    return many("SELECT id, name, owner, substr(secret, -4) AS last4, active FROM app_keys ORDER BY name");
  }
  function saveAppKey(body) {
    const name = String(body.name || "").trim();
    const owner = String(body.owner || "").trim();
    if (!name || !owner) throw new Error("Name and owner are required.");
    const active = body.active === "yes" ? 1 : 0;
    if (active) run("UPDATE app_keys SET active = 0");
    const id = randomUUID();
    run("INSERT INTO app_keys (id, name, owner, secret, active) VALUES (?, ?, ?, ?, ?)", id, name, owner, randomUUID().replaceAll("-", ""), active);
    writeLog("info", "app-keys", `App key ${name} saved`);
    return listAppKeys().find((item) => item.id === id);
  }
  function listCredentials() {
    return many("SELECT id, name, owner, substr(secret, -4) AS last4, active FROM integration_credentials ORDER BY name");
  }
  function saveCredential(body) {
    const name = String(body.name || "").trim();
    const owner = String(body.owner || "").trim();
    const active = body.active === "yes" ? 1 : 0;
    if (!name || (active && !owner)) throw new Error("Name is required, and an active credential needs an owner.");
    if (one("SELECT id FROM integration_credentials WHERE lower(name) = ?", name.toLowerCase())) throw new Error("This credential already exists.");
    const id = randomUUID();
    run("INSERT INTO integration_credentials (id, name, owner, secret, active) VALUES (?, ?, ?, ?, ?)", id, name, owner, randomUUID().replaceAll("-", ""), active);
    writeLog("info", "credentials", `Credential ${name} saved`);
    return listCredentials().find((item) => item.id === id);
  }
  function listCitySettings() {
    return many("SELECT city_settings.city_id AS cityId, cities.name AS city, city_settings.key, city_settings.value FROM city_settings JOIN cities ON cities.id = city_settings.city_id");
  }
  function saveCitySetting(body) {
    if (!body.cityId || body.key !== "cash_enabled" || !["yes", "no"].includes(body.value)) throw new Error("Choose a city and whether cash is enabled.");
    run("INSERT INTO city_settings (city_id, key, value) VALUES (?, 'cash_enabled', ?) ON CONFLICT(city_id, key) DO UPDATE SET value = excluded.value", body.cityId, body.value);
    writeLog("info", "city-settings", `Cash ${body.value} for a city`);
    return listCitySettings().find((item) => item.cityId === body.cityId && item.key === "cash_enabled");
  }
  function listAdditional() {
    return many("SELECT key, value FROM additional_settings ORDER BY key");
  }
  function saveAdditional(body) {
    const value = Number(body.value);
    if (body.key !== "max_open_trips" || !Number.isInteger(value) || value < 0) throw new Error("Open trip limit must be a whole number, and zero means no limit.");
    run("INSERT INTO additional_settings (key, value) VALUES ('max_open_trips', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", String(value));
    return listAdditional().find((item) => item.key === "max_open_trips");
  }
  function listPartnerApps() {
    return many("SELECT partner_apps.id, partners.name AS partner, partner_apps.api_base AS apiBase, partner_apps.active FROM partner_apps JOIN partners ON partners.id = partner_apps.partner_id");
  }
  function savePartnerApp(body) {
    const partner = one("SELECT id, status FROM partners WHERE id = ?", body.partnerId);
    const apiBase = String(body.apiBase || "").trim();
    if (!partner || partner.status !== "active") throw new Error("Choose an active partner.");
    if (!apiBase.startsWith("https://")) throw new Error("The partner address must use https.");
    const id = randomUUID();
    run("INSERT INTO partner_apps (id, partner_id, api_base, active) VALUES (?, ?, ?, ?) ON CONFLICT(partner_id) DO UPDATE SET api_base = excluded.api_base, active = excluded.active", id, partner.id, apiBase, body.active === "yes" ? 1 : 0);
    return listPartnerApps().find((item) => item.partner && item.apiBase === apiBase);
  }
  function listServices() {
    return many("SELECT service_types.id, service_types.name, cities.name AS city, trip_types.name AS tripType, service_types.active FROM service_types JOIN cities ON cities.id = service_types.city_id JOIN trip_types ON trip_types.id = service_types.trip_type_id");
  }
  function saveService(body) {
    const name = String(body.name || "").trim();
    const type = one("SELECT id, city_id FROM trip_types WHERE id = ? AND active = 1", body.tripTypeId);
    if (!name || !type || type.city_id !== body.cityId) throw new Error("Name, city and a trip type of that city are required.");
    if (one("SELECT id FROM service_types WHERE city_id = ? AND trip_type_id = ? AND id != ?", body.cityId, type.id, body.id || "")) throw new Error("This trip type is already a service in the city.");
    const id = body.id || randomUUID();
    run("INSERT INTO service_types (id, name, city_id, trip_type_id, active) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, active = excluded.active", id, name, body.cityId, type.id, body.active === "no" ? 0 : 1);
    return listServices().find((item) => item.id === id);
  }
  function listDeliveryItems() {
    return many("SELECT delivery_menu_items.id, delivery_menu_items.name, delivery_menu_items.price_cents AS price, delivery_menu_items.active, establishments.name AS establishment, delivery_menu_items.establishment_id AS establishmentId FROM delivery_menu_items JOIN establishments ON establishments.id = delivery_menu_items.establishment_id ORDER BY delivery_menu_items.name");
  }
  function saveDeliveryItem(body) {
    const name = String(body.name || "").trim();
    const price = dollarsToCents(body.price);
    const place = one("SELECT id FROM establishments WHERE id = ?", body.establishmentId);
    if (!place || !name || price < 0) throw new Error("Establishment, name and a price of zero or more are required.");
    if (one("SELECT id FROM delivery_menu_items WHERE establishment_id = ? AND lower(name) = ? AND id != ?", place.id, name.toLowerCase(), body.id || "")) throw new Error("This item already exists at the establishment.");
    const id = body.id || randomUUID();
    run("INSERT INTO delivery_menu_items (id, establishment_id, name, price_cents, active) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, price_cents = excluded.price_cents, active = excluded.active", id, place.id, name, price, body.active === "no" ? 0 : 1);
    return listDeliveryItems().find((item) => item.id === id);
  }
  function listLogs() {
    return many("SELECT id, level, source, message, created_at AS createdAt FROM monitor_logs ORDER BY created_at DESC LIMIT 100");
  }
  function assertMapProvider(provider) {
    if (!["google", "osm", "mapbox", "here"].includes(provider)) throw new Error("Choose a map provider.");
    if (!one("SELECT provider FROM map_sequence WHERE provider = ? AND active = 1", provider)) throw new Error("This provider is not active in the map sequence.");
    if (provider === "google" && !googleMapKey()) throw new Error("Google cannot be selected because no key is saved.");
    if (provider !== "google" && provider !== "osm") throw new Error(`${provider} cannot be selected because no key is saved.`);
  }
  function mapGeneral() {
    const row = one("SELECT provider, traffic, clustering FROM map_general WHERE id = 'default'");
    return row ? [row] : [];
  }
  function saveMapGeneral(body) {
    const provider = String(body.provider || "");
    assertMapProvider(provider);
    run("INSERT INTO map_general (id, provider, traffic, clustering) VALUES ('default', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET provider = excluded.provider, traffic = excluded.traffic, clustering = excluded.clustering", provider, body.traffic === "yes" ? 1 : 0, body.clustering === "yes" ? 1 : 0);
    return mapGeneral()[0];
  }
  function listMapCities() {
    return many("SELECT map_city_settings.city_id AS cityId, cities.name AS city, map_city_settings.provider, map_city_settings.active FROM map_city_settings JOIN cities ON cities.id = map_city_settings.city_id");
  }
  function saveMapCity(body) {
    if (!body.cityId) throw new Error("City is required.");
    assertMapProvider(body.provider);
    run("INSERT INTO map_city_settings (city_id, provider, active) VALUES (?, ?, ?) ON CONFLICT(city_id) DO UPDATE SET provider = excluded.provider, active = excluded.active", body.cityId, body.provider, body.active === "no" ? 0 : 1);
    return listMapCities().find((item) => item.cityId === body.cityId);
  }
  function listOptimizations() {
    return many("SELECT route_optimizations.id, route_optimizations.name, cities.name AS city, route_optimizations.provider, route_optimizations.stops, route_optimizations.straight_km AS straightKm, route_optimizations.savings_km AS savingsKm FROM route_optimizations JOIN cities ON cities.id = route_optimizations.city_id ORDER BY route_optimizations.created_at DESC");
  }
  function optimizeRoute(body) {
    const name = String(body.name || "").trim();
    const ids = Array.isArray(body.placeIds) ? body.placeIds : String(body.placeIds || "").split(",").map((item) => item.trim()).filter(Boolean);
    if (!name || !body.cityId || ids.length < 2) throw new Error("Name, city and at least two places are required.");
    const places = ids.map((id) => one("SELECT id, latitude, longitude, city_id FROM places WHERE id = ?", id));
    if (places.some((place) => !place || place.city_id !== body.cityId)) throw new Error("Every stop must be a place in the city.");
    const cityProvider = one("SELECT provider FROM map_city_settings WHERE city_id = ? AND active = 1", body.cityId)?.provider;
    const provider = cityProvider || one("SELECT provider FROM map_general WHERE id = 'default'")?.provider || "";
    if (!provider) throw new Error("Choose a map provider first.");
    assertMapProvider(provider);
    if (provider !== "osm") throw new Error(`${provider} cannot optimize a driving route without its own key.`);
    const line = (points) => points.slice(1).reduce((sum, point, index) => sum + haversine(points[index].latitude, points[index].longitude, point.latitude, point.longitude), 0);
    const left = places.slice(1);
    const ordered = [places[0]];
    while (left.length) {
      const current = ordered[ordered.length - 1];
      let best = 0;
      let bestKm = Infinity;
      left.forEach((point, index) => {
        const km = haversine(current.latitude, current.longitude, point.latitude, point.longitude);
        if (km < bestKm) { bestKm = km; best = index; }
      });
      ordered.push(left.splice(best, 1)[0]);
    }
    const straightKm = Math.round(line(ordered) * 100) / 100;
    const savingsKm = Math.round(Math.max(0, line(places) - line(ordered)) * 100) / 100;
    const id = randomUUID();
    run("INSERT INTO route_optimizations (id, name, city_id, provider, stops, straight_km, savings_km, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", id, name, body.cityId, provider, places.length, straightKm, savingsKm, now());
    return listOptimizations().find((item) => item.id === id);
  }
  function bulkDrivers(documents, mode) {
    const list = String(documents || "").split(/[\s,;]+/).map((item) => item.trim()).filter(Boolean);
    if (!list.length) throw new Error("The file is empty.");
    if (!["block", "unblock"].includes(mode)) throw new Error("Choose block or unblock.");
    const rejected = [];
    let count = 0;
    list.forEach((document, index) => {
      const driver = one("SELECT drivers.id, drivers.register_status AS status FROM drivers JOIN accounts ON accounts.id = drivers.account_id WHERE accounts.document = ?", document);
      if (!driver || (mode === "block" && driver.status === "blocked") || (mode === "unblock" && driver.status !== "blocked")) {
        rejected.push(index + 1);
        return;
      }
      run("UPDATE drivers SET register_status = ?, presence = 'offline', updated_at = ? WHERE id = ?", mode === "block" ? "blocked" : "approved", now(), driver.id);
      count += 1;
    });
    return { count, rejected };
  }
  function layoutStatus() {
    return one("SELECT density, map_style AS mapStyle, active FROM layout_settings WHERE id = 'default'") || { density: "comfortable", mapStyle: "day", active: 1 };
  }
  function saveLayout(body) {
    const density = ["comfortable", "compact"].includes(body.density) ? body.density : "";
    const mapStyle = ["day", "night"].includes(body.mapStyle) ? body.mapStyle : "";
    if (!density || !mapStyle) throw new Error("Choose a density and a map style.");
    run("INSERT INTO layout_settings (id, density, map_style, active) VALUES ('default', ?, ?, ?) ON CONFLICT(id) DO UPDATE SET density = excluded.density, map_style = excluded.map_style, active = excluded.active", density, mapStyle, body.active === "no" ? 0 : 1);
    return layoutStatus();
  }

  function seedRules() {
    if (!one("SELECT provider FROM map_sequence LIMIT 1")) {
      run("INSERT INTO map_sequence (provider, sort_order, active) VALUES ('google', 1, 1)");
      run("INSERT INTO map_sequence (provider, sort_order, active) VALUES ('osm', 2, 1)");
    }
    ["trips", "delivery", "freight", "routes", "corporate"].forEach((name) => {
      if (!one("SELECT name FROM modules WHERE name = ?", name)) run("INSERT INTO modules (name, active) VALUES (?, 1)", name);
    });
    const cityGap = one(`SELECT cities.id FROM cities
      WHERE NOT EXISTS (SELECT 1 FROM call_radius WHERE city_id = cities.id)
         OR NOT EXISTS (SELECT 1 FROM payment_methods WHERE city_id = cities.id AND code = 'cash')
         OR NOT EXISTS (SELECT 1 FROM payment_methods WHERE city_id = cities.id AND code = 'card')
         OR NOT EXISTS (SELECT 1 FROM payment_methods WHERE city_id = cities.id AND code = 'wallet')
      LIMIT 1`);
    if (cityGap) many("SELECT id FROM cities").forEach((city) => {
      if (!one("SELECT city_id FROM call_radius WHERE city_id = ?", city.id)) run("INSERT INTO call_radius (city_id, radius_km, updated_at) VALUES (?, 8, ?)", city.id, now());
      ["card", "cash", "wallet"].forEach((code) => {
        if (!one("SELECT id FROM payment_methods WHERE city_id = ? AND code = ?", city.id, code)) {
          run("INSERT INTO payment_methods (id, city_id, code, name, active) VALUES (?, ?, ?, ?, 1)", randomUUID(), city.id, code, code[0].toUpperCase() + code.slice(1));
        }
      });
    });
    if (!one("SELECT id FROM call_groups LIMIT 1")) {
      const miami = one("SELECT id FROM cities WHERE name = 'Miami'");
      const maya = one("SELECT drivers.id FROM drivers JOIN accounts ON accounts.id = drivers.account_id WHERE accounts.name = 'Maya Chen'");
      if (miami && maya) {
        const groupId = randomUUID();
        run("INSERT INTO call_groups (id, name, city_id, strategy, active, updated_at) VALUES (?, 'Brickell', ?, 'nearest', 1, ?)", groupId, miami.id, now());
        run("INSERT INTO call_group_drivers (group_id, driver_id, priority) VALUES (?, ?, 1)", groupId, maya.id);
      }
    }
    if (!one("SELECT id FROM cancel_reasons LIMIT 1")) {
      run("INSERT INTO cancel_reasons (id, audience, reason, charges_fee, active) VALUES (?, 'rider', 'Rider changed plans', 1, 1)", randomUUID());
      run("INSERT INTO cancel_reasons (id, audience, reason, charges_fee, active) VALUES (?, 'driver', 'Driver no-show', 1, 1)", randomUUID());
      run("INSERT INTO cancel_reasons (id, audience, reason, charges_fee, active) VALUES (?, 'operator', 'Wrong address', 0, 1)", randomUUID());
    }
    if (!one("SELECT id FROM coupons WHERE code = 'WELCOME'")) {
      const miami = one("SELECT id FROM cities WHERE name = 'Miami'");
      if (miami) run("INSERT INTO coupons (id, code, city_id, kind, percent, fixed_cents, max_cents, payment, valid_until, active, updated_at) VALUES (?, 'WELCOME', ?, 'fixed', 0, 500, 500, 'any', '2027-12-31', 1, ?)", randomUUID(), miami.id, now());
    }
  }

  function listCallGroups() {
    return many("SELECT call_groups.id, call_groups.name, cities.name AS city, call_groups.city_id AS cityId, call_groups.strategy FROM call_groups JOIN cities ON cities.id = call_groups.city_id WHERE call_groups.active = 1 ORDER BY call_groups.name");
  }
  function saveCallGroup(body) {
    const strategy = ["nearest", "queue", "broadcast"].includes(body.strategy) ? body.strategy : "";
    if (!body.cityId || !String(body.name || "").trim() || !strategy) throw new Error("City, name and strategy are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO call_groups (id, name, city_id, strategy, active, updated_at) VALUES (?, ?, ?, ?, 1, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, city_id = excluded.city_id, strategy = excluded.strategy, updated_at = excluded.updated_at`,
      id, body.name.trim(), body.cityId, strategy, now()
    );
    return listCallGroups().find((item) => item.id === id);
  }
  function listCallGroupDrivers() {
    return many(
      `SELECT cgd.group_id AS groupId, call_groups.name AS "group", accounts.name AS driver, cgd.driver_id AS driverId, cgd.priority
       FROM call_group_drivers cgd
       JOIN call_groups ON call_groups.id = cgd.group_id
       JOIN drivers ON drivers.id = cgd.driver_id
       JOIN accounts ON accounts.id = drivers.account_id
       ORDER BY call_groups.name, cgd.priority`
    );
  }
  function linkCallGroupDriver(body) {
    const group = one("SELECT id, city_id FROM call_groups WHERE id = ? AND active = 1", body.groupId);
    const driver = one("SELECT id, city_id FROM drivers WHERE id = ?", body.driverId);
    if (!group || !driver) throw new Error("Choose a group and a driver.");
    if (driver.city_id !== group.city_id) throw new Error("Driver must belong to the group city.");
    const priority = Number(body.priority || 1);
    if (!(priority >= 1)) throw new Error("Priority starts at 1.");
    run(
      `INSERT INTO call_group_drivers (group_id, driver_id, priority) VALUES (?, ?, ?)
       ON CONFLICT(group_id, driver_id) DO UPDATE SET priority = excluded.priority`,
      group.id, driver.id, priority
    );
    return listCallGroupDrivers().find((item) => item.groupId === group.id && item.driverId === driver.id);
  }
  function listCancelReasons() {
    return many("SELECT id, audience, reason, charges_fee AS chargesFee FROM cancel_reasons WHERE active = 1 ORDER BY audience, reason");
  }
  function saveCancelReason(body) {
    const audience = ["rider", "driver", "operator"].includes(body.audience) ? body.audience : "";
    if (!audience || !String(body.reason || "").trim()) throw new Error("Audience and reason are required.");
    const id = body.id || randomUUID();
    run(
      `INSERT INTO cancel_reasons (id, audience, reason, charges_fee, active) VALUES (?, ?, ?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET audience = excluded.audience, reason = excluded.reason, charges_fee = excluded.charges_fee`,
      id, audience, body.reason.trim(), body.fee === "no" ? 0 : 1
    );
    return listCancelReasons().find((item) => item.id === id);
  }

  function listCategories() {
    return many("SELECT delivery_categories.id, delivery_categories.name, cities.name AS city, delivery_categories.city_id AS cityId FROM delivery_categories JOIN cities ON cities.id = delivery_categories.city_id WHERE delivery_categories.active = 1 ORDER BY delivery_categories.name");
  }
  function saveCategory(body) {
    if (!body.cityId || !String(body.name || "").trim()) throw new Error("City and category name are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO delivery_categories (id, name, city_id, active) VALUES (?, ?, ?, 1)", id, body.name.trim(), body.cityId);
    return listCategories().find((item) => item.id === id);
  }
  function listEstablishments() {
    return many("SELECT establishments.id, establishments.name, delivery_categories.name AS category, establishments.category_id AS categoryId, cities.name AS city, establishments.city_id AS cityId, establishments.phone, establishments.address, establishments.latitude, establishments.longitude, establishments.status FROM establishments JOIN delivery_categories ON delivery_categories.id = establishments.category_id JOIN cities ON cities.id = establishments.city_id ORDER BY establishments.name");
  }
  function saveEstablishment(body) {
    if (!body.categoryId || !body.cityId || !String(body.name || "").trim()) throw new Error("Name, city and category are required.");
    const id = body.id || randomUUID();
    run(
      "INSERT INTO establishments (id, name, category_id, city_id, phone, address, latitude, longitude, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id, body.name.trim(), body.categoryId, body.cityId, body.phone || "", body.address || "", Number(body.latitude), Number(body.longitude), body.status || "open", now()
    );
    return listEstablishments().find((item) => item.id === id);
  }
  function listZones() {
    return many("SELECT delivery_zones.id, delivery_zones.name, delivery_zones.fee_cents AS fee, delivery_zones.radius_km AS radiusKm, cities.name AS city, delivery_zones.city_id AS cityId FROM delivery_zones JOIN cities ON cities.id = delivery_zones.city_id WHERE delivery_zones.active = 1");
  }
  function saveZone(body) {
    const fee = dollarsToCents(body.fee);
    const radius = Number(body.radiusKm);
    if (!body.cityId || !body.name || fee < 0 || !(radius > 0)) throw new Error("City, name, fee and radius are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO delivery_zones (id, city_id, name, fee_cents, radius_km, active) VALUES (?, ?, ?, ?, ?, 1)", id, body.cityId, body.name.trim(), fee, radius);
    return listZones().find((item) => item.id === id);
  }
  function listOrders() {
    return many(
      `SELECT delivery_orders.id, delivery_orders.code, establishments.name AS establishment, accounts.name AS rider, driverAccount.name AS driver,
              delivery_orders.address, delivery_orders.subtotal_cents AS subtotal, delivery_orders.fee_cents AS fee, delivery_orders.total_cents AS total, delivery_orders.status
       FROM delivery_orders
       JOIN establishments ON establishments.id = delivery_orders.establishment_id
       JOIN customers ON customers.id = delivery_orders.customer_id
       JOIN accounts ON accounts.id = customers.account_id
       LEFT JOIN drivers ON drivers.id = delivery_orders.driver_id
       LEFT JOIN accounts driverAccount ON driverAccount.id = drivers.account_id
       ORDER BY delivery_orders.created_at DESC`
    );
  }
  function placeOrder(body) {
    assertModule("delivery");
    const place = one("SELECT * FROM establishments WHERE id = ?", body.establishmentId);
    if (!place || place.status !== "open") throw new Error("Choose an open establishment.");
    if (!body.customerId) throw new Error("Choose a customer.");
    const subtotal = dollarsToCents(body.subtotal);
    if (subtotal <= 0) throw new Error("Subtotal must be greater than zero.");
    if (body.itemId) {
      const item = one("SELECT * FROM delivery_menu_items WHERE id = ? AND active = 1", body.itemId);
      if (!item || item.establishment_id !== place.id) throw new Error("Choose an active item from this establishment.");
      if (subtotal < item.price_cents) throw new Error("The subtotal is below the item price.");
    }
    const minimum = one("SELECT min_order_cents FROM delivery_settings WHERE city_id = ?", place.city_id);
    if (minimum && subtotal < minimum.min_order_cents) throw new Error("The order is below the city minimum.");
    const lat = Number(body.latitude);
    const lng = Number(body.longitude);
    if (!body.address || Number.isNaN(lat) || Number.isNaN(lng)) throw new Error("Delivery address and coordinates are required.");
    let extra = 0;
    let accessory = null;
    if (body.accessoryId) {
      accessory = one("SELECT * FROM delivery_accessories WHERE id = ? AND active = 1", body.accessoryId);
      if (!accessory) throw new Error("Choose an active accessory.");
      extra = accessory.price_cents;
    }
    const zone = many("SELECT * FROM delivery_zones WHERE city_id = ? AND active = 1 ORDER BY radius_km", place.city_id).find(
      (item) => haversine(place.latitude, place.longitude, lat, lng) <= Number(item.radius_km)
    );
    const prep = one("SELECT default_fee_cents, prep_minutes FROM delivery_prep WHERE city_id = ?", place.city_id);
    if (!zone && !(prep && prep.default_fee_cents > 0)) throw new Error("This address is outside the delivery zones.");
    const fee = zone ? zone.fee_cents : prep.default_fee_cents;
    const config = one("SELECT * FROM delivery_config WHERE id = 'default'");
    if (config?.active && Number(config.max_radius_km) > 0 && haversine(place.latitude, place.longitude, lat, lng) > Number(config.max_radius_km)) throw new Error("This dropoff is outside the delivery radius.");
    if (one("SELECT id FROM delivery_sections WHERE city_id = ? AND active = 1", place.city_id) && !one("SELECT establishment_id FROM establishment_sections WHERE establishment_id = ?", place.id)) throw new Error("This establishment is not in a delivery section.");
    const call = one("SELECT * FROM delivery_calls WHERE city_id = ?", place.city_id);
    const manual = config?.active && config.dispatch_mode === "manual";
    const assigned = manual ? null : assignDriver(place.city_id, lat, lng, "delivery", call ? Number(call.radius_km) : 0);
    const accepted = assigned && (!call || call.auto_accept === 1);
    const preparing = Boolean(prep && Number(prep.prep_minutes) > 0);
    const id = randomUUID();
    const code = `DL-${Date.now().toString().slice(-6)}`;
    run(
      "INSERT INTO delivery_orders (id, code, establishment_id, customer_id, driver_id, address, latitude, longitude, subtotal_cents, fee_cents, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id, code, place.id, body.customerId, assigned?.id || null, body.address.trim(), lat, lng, subtotal, fee, subtotal + fee + extra, preparing ? "preparing" : accepted ? "picked_up" : assigned ? "offered" : "placed", now()
    );
    if (accessory) run("INSERT INTO delivery_order_accessories (order_id, accessory_id, price_cents) VALUES (?, ?, ?)", id, accessory.id, extra);
    return listOrders().find((item) => item.id === id);
  }
  function listFreightItems() {
    return many("SELECT id, name, height_cm AS heightCm, width_cm AS widthCm, depth_cm AS depthCm, weight_kg AS weightKg, price_cents AS price FROM freight_items WHERE active = 1 ORDER BY name");
  }
  function saveFreightItem(body) {
    const price = dollarsToCents(body.price);
    if (!String(body.name || "").trim() || price <= 0) throw new Error("Item name and price are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO freight_items (id, name, height_cm, width_cm, depth_cm, weight_kg, price_cents, active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)", id, body.name.trim(), Number(body.heightCm || 0), Number(body.widthCm || 0), Number(body.depthCm || 0), Number(body.weightKg || 0), price);
    return listFreightItems().find((item) => item.id === id);
  }
  function listFreightExtras() {
    return many("SELECT id, name, price_cents AS price FROM freight_extras WHERE active = 1 ORDER BY name");
  }
  function saveFreightExtra(body) {
    const price = dollarsToCents(body.price);
    if (!String(body.name || "").trim() || price < 0) throw new Error("Extra name and price are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO freight_extras (id, name, price_cents, active) VALUES (?, ?, ?, 1)", id, body.name.trim(), price);
    return listFreightExtras().find((item) => item.id === id);
  }
  function listFreightAccess() {
    return many("SELECT id, name, price_per_floor_cents AS pricePerFloor FROM freight_access WHERE active = 1 ORDER BY name");
  }
  function saveFreightAccess(body) {
    const price = dollarsToCents(body.pricePerFloor);
    if (!String(body.name || "").trim() || price < 0) throw new Error("Name and price per floor are required.");
    const id = body.id || randomUUID();
    run("INSERT INTO freight_access (id, name, price_per_floor_cents, active) VALUES (?, ?, ?, 1)", id, body.name.trim(), price);
    return listFreightAccess().find((item) => item.id === id);
  }
  function quoteFreight(body) {
    assertModule("freight");
    const item = one("SELECT * FROM freight_items WHERE id = ? AND active = 1", body.itemId);
    if (!item) throw new Error("Choose a freight item.");
    const floors = Number(body.floors || 0);
    if (floors < 0) throw new Error("Floors cannot be negative.");
    const extra = body.extraId ? one("SELECT * FROM freight_extras WHERE id = ? AND active = 1", body.extraId) : null;
    const access = one("SELECT * FROM freight_access WHERE active = 1 ORDER BY name LIMIT 1");
    const floorFee = access ? floors * Number(access.price_per_floor_cents) : 0;
    const total = Number(item.price_cents) + Number(extra?.price_cents || 0) + floorFee;
    const id = randomUUID();
    run("INSERT INTO freight_quotes (id, item_id, extra_id, floors, total_cents, created_at) VALUES (?, ?, ?, ?, ?, ?)", id, item.id, extra?.id || null, floors, total, now());
    return { id, item: item.name, extra: extra?.name || "", floors, itemPrice: item.price_cents, extraPrice: extra?.price_cents || 0, floorFee, total };
  }
  function listFreightQuotes() {
    return many(
      `SELECT freight_quotes.id, freight_items.name AS item, freight_extras.name AS extra, freight_quotes.floors, freight_quotes.total_cents AS total
       FROM freight_quotes JOIN freight_items ON freight_items.id = freight_quotes.item_id
       LEFT JOIN freight_extras ON freight_extras.id = freight_quotes.extra_id
       ORDER BY freight_quotes.created_at DESC`
    );
  }

  function seedDelivery() {
    if (one("SELECT id FROM establishments LIMIT 1")) return;
    const miami = one("SELECT id FROM cities WHERE name = 'Miami'");
    if (!miami) return;
    const categoryId = randomUUID();
    run("INSERT INTO delivery_categories (id, name, city_id, active) VALUES (?, 'Food', ?, 1)", categoryId, miami.id);
    const placeId = randomUUID();
    run(
      "INSERT INTO establishments (id, name, category_id, city_id, phone, address, latitude, longitude, status, updated_at) VALUES (?, 'Harbor Kitchen', ?, ?, '+1 305 555 0133', '120 Biscayne Blvd', 25.774, -80.19, 'open', ?)",
      placeId, categoryId, miami.id, now()
    );
    run("INSERT INTO delivery_zones (id, city_id, name, fee_cents, radius_km, active) VALUES (?, ?, 'Brickell', 350, 8, 1)", randomUUID(), miami.id);
    if (!one("SELECT drivers.id FROM drivers WHERE city_id = ? AND service = 'delivery' AND presence = 'available'", miami.id)) {
      saveDriver({ name: "Diego Ramos", phone: "+1 305 555 0290", email: "diego@drivers.movy.com", document: "D20000090", cityId: miami.id, status: "approved", presence: "available", service: "delivery", cnh: "FL-900100", vehicle: "Honda CG", plate: "FLA-9090", rating: 4.9, lat: 25.776, lng: -80.191 });
    }
  }

  function seedCore() {
    if (one("SELECT id FROM cities LIMIT 1")) return;
    const miami = saveCity({ name: "Miami", state: "FL", country: "United States", timezone: "America/New_York" });
    const orlando = saveCity({ name: "Orlando", state: "FL", country: "United States", timezone: "America/New_York" });
    const ava = saveCustomer({ name: "Ava Collins", phone: "+1 305 555 0142", email: "ava@example.com", document: "S10000001", cityId: miami.id, status: "active" });
    saveCustomer({ name: "Liam Brooks", phone: "+1 305 555 0177", email: "liam@example.com", document: "S10000002", cityId: miami.id, status: "active" });
    saveCompany({ name: "Northwind Hotels LLC", tradeName: "Northwind", document: "59-2048812", email: "travel@northwind.example", phone: "+1 305 555 0100", address: "100 Biscayne Blvd", cityId: miami.id, creditLimit: 500, status: "active" });
    const maya = saveDriver({ name: "Maya Chen", phone: "+1 305 555 0210", email: "maya@drivers.movy.com", document: "D20000000", cityId: miami.id, status: "approved", presence: "available", service: "private", cnh: "FL-882100", vehicle: "Toyota Camry", plate: "FLA-1021", rating: 4.96, lat: 25.774, lng: -80.19 });
    const noah = saveDriver({ name: "Noah Patel", phone: "+1 305 555 0212", email: "noah@drivers.movy.com", document: "D20000002", cityId: miami.id, status: "approved", presence: "on_trip", service: "private", cnh: "FL-882122", vehicle: "Hyundai Sonata", plate: "FLA-4412", rating: 4.91, lat: 25.768, lng: -80.18 });
    saveDriver({ name: "Elena Rossi", phone: "+1 305 555 0213", email: "elena@drivers.movy.com", document: "D20000003", cityId: orlando.id, status: "approved", presence: "available", service: "delivery", cnh: "FL-882133", vehicle: "Kia K5", plate: "FLA-8831", rating: 4.84, lat: 25.755, lng: -80.205 });
    const go = saveTripType({ name: "Movy Go", cityId: miami.id, base: 2.5, perKm: 1.4, perMin: 0.3, minimum: 7, tax: 0, seats: 4, active: "yes" });
    saveTripType({ name: "Movy Comfort", cityId: miami.id, base: 4, perKm: 1.9, perMin: 0.4, minimum: 11, tax: 0, seats: 4, active: "yes" });
    saveTrip({ customerId: ava.id, driverId: maya.id, tripTypeId: go.id, origin: "Brickell City Centre", destination: "Miami Beach", distanceKm: 7.4, durationMin: 18, payment: "card", status: "completed" });
    saveTrip({ customerId: ava.id, driverId: noah.id, tripTypeId: go.id, origin: "Wynwood", destination: "MIA Airport", distanceKm: 14.2, durationMin: 26, payment: "card", status: "in_progress" });
  }

  return {
    listCities, saveCity, removeCity, listCustomers, saveCustomer, registerRider, findRiderLogin, quoteRider, requestRiderTrip, riderTrips, rateRiderTrip, riderCoupons, riderPlaces, listCompanies, saveCompany, listDrivers, saveDriver, registerDriver, findDriverLogin, driverPublic, setDriverPresence, driverOffers, driverAct, driverTrips, driverEarnings, driverDocuments, submitDriverFile, driverZones, driverDeliveries, driverSchedule, driverAds, driverMessages, driverReasons, openDriverSupport,
    listTripTypes, saveTripType, listCityTariffs, listTrips, saveTrip, listVehicleChanges, saveVehicleChange, decideVehicleChange,
    listDriverDocuments, saveDriverDocument, reviewDriverDocument, listDeletions, requestDeletion, decideDeletion,
    driverProduction, listCommissions, saveCommission, listLedger, postLedger, voidLedger, listPayouts, requestPayout, decidePayout,
    listCancellationFees, chargeCancellation, listCredits, requestCredit, payCredit, listFlags, saveFlag, listTriggers, saveTrigger,
    listDynamicAreas, saveDynamicArea, listTolls, saveToll, listCoupons, saveCoupon, listRadius, saveRadius, saveMapKey, mapKeyStatus, googleMapKey,
    listCategories, saveCategory, listEstablishments, saveEstablishment, listZones, saveZone, listOrders, placeOrder,
    listFreightItems, saveFreightItem, listFreightExtras, saveFreightExtra, listFreightAccess, saveFreightAccess, quoteFreight, listFreightQuotes,
    listCallGroups, saveCallGroup, listCallGroupDrivers, linkCallGroupDriver, listCancelReasons, saveCancelReason,
    listPaymentMethods, savePaymentMethod, listPenalties, savePenalty, listDriverPenalties, applyPenalty, releasePenalty, listModules, saveModule, listVouchers, saveVoucher, listRiskAreas, saveRiskArea,
    listRoutes, saveRoute, listRouteItems, saveRouteItem, listRouteDrivers, releaseRouteDriver, listRouteBanners, saveRouteBanner, listRouteBookings, bookRoute, listManagers, saveManager, listManagerDrivers, linkManagerDriver, listManagerEarnings,
    listPartners, savePartner, listPartnerMessages, openPartnerMessage, closePartnerMessage, listTripPromotions, saveTripPromotion, listPromotionGrants,
    listAds, saveAd, listExternalLinks, saveExternalLink, listAppAds, saveAppAd, listTickets, openRiderTicket, openTripTicket, closeTicket, listNotifications, saveNotification, sendNotification, listRoles, saveRole, removeRole, listStaff, saveStaff,
    listCentrals, saveCentral, listCentralUsers, saveCentralUser, listNeighborhoods, saveNeighborhood, listCentralFields, saveCentralField, listCentralTrips, cancelCentralTrip, centralTrip, setCentralTripStatus, searchAddresses, searchCities, listFavorites, toggleFavorite, listCentralMessages, saveCentralMessage, setNeighborhoodRides, setRouteActive, listCityRoutes, centralDesk, listCentralSettings, saveCentralSettings, listReports, runReport, reportFile, importPeople,
    listPlaces, savePlace, listIrregular, saveIrregular, resolveIrregular, listAddressCache, listHeatAreas, saveHeatArea, listMonitoringAreas, saveMonitoringArea, listSequence, saveSequence,
    listBirthdays, saveBirthday, runBirthdays, whatsappStatus, saveWhatsappSession, listWhatsappKeys, saveWhatsappKey, listWhatsappNotices, saveWhatsappNotice, listWhatsappGroups, saveWhatsappGroup, sendTripWhatsapp,
    saveSmtp, listOutbox, issueRecovery, saveConfirmation, confirmationStatus, listTerms, saveTerm, acceptTerms, saveFirebase, firebaseStatus, listVersions, saveVersion, saveAppConfig, listAppConfig, listDeliverySettings, saveDeliverySettings, saveDriverSignup, driverSignupStatus,
    listSections, saveSection, linkSection, listAccessories, saveAccessory, deliveryConfig, saveDeliveryConfig, asaasStatus, saveAsaas, listDeliveryCalls, saveDeliveryCall, listSettlements, settleDelivery,
    saveAcquirer, acquirerAccount, listCityAcquirers, saveCityAcquirer, listAcquirerTransactions, chargeAcquirer, saveDispatch, dispatchStatus, listFinanceReports, runFinanceReport, listAlerts, saveAlert, readAlert,
    listExternalServices, saveExternalService, listExternalCityServices, saveExternalCityService, listWebhooks, saveWebhook, listWebhookDeliveries,
    listAppDocuments, saveAppDocument, listDocumentRequirements, saveDocumentRequirement, submitDocument, listPhones, savePhone, listPolicies, savePolicy, acceptPolicy,
    listChatMessages, saveChatMessage, sendDriverChat, listSuggestions, saveSuggestion, listAppKeys, saveAppKey, listCredentials, saveCredential, listCitySettings, saveCitySetting,
    listAdditional, saveAdditional, listPartnerApps, savePartnerApp, listServices, saveService, listDeliveryItems, saveDeliveryItem, listLogs,
    mapGeneral, saveMapGeneral, listMapCities, saveMapCity, listOptimizations, optimizeRoute, bulkDrivers, layoutStatus, saveLayout,
    resetDriverBalances, resetDriverRatings, seedCore, seedFinance, seedRules, seedDelivery, quoteFare,
  };
}
