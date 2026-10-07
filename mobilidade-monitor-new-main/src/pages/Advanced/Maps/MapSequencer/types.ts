export interface CheckServiceProps {
  service_direction: string;
  service_direction_estimate: string;
  service_geocode: string;
  service_global_active: string;
  service_place: string;
}

export interface ListPriorityServiceProps {
  direction: string[];
  geocoding: string[];
  searching: string[];
}
