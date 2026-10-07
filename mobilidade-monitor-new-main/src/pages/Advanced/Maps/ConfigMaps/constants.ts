import { SelectOption } from "./types";

export const MAP_API_OPTIONS: SelectOption[] = [
    { label: "Google", value: "google" },
    { label: "Here", value: "here" },
    { label: "Mapbox", value: "mapbox" },
    { label: "Manual", value: "manual" },
];

export const FIELD_OPTIONS: Record<string, SelectOption[]> = {
    map_api_for_address_cache: MAP_API_OPTIONS,
};

export const ALLOWED_CREDENCIES_KEYS: string[] = [
    "google_api_key",
    "google_api_key_backend",
    "firebase_cloud_firestore_key",
    "here_api_key",
    "mapbox_access_token",
    "google_service_account_json",
    "mapbox_access_token_monitor",
];

export const BLOCKED_CREDENCIES_KEYS: string[] = [
    "enable_address_cache_fb704",
    "url_address_cache_fb704",
    "keysearch_address_cache_fb704",
    "keyreadwrite_address_cache_fb704",
];
