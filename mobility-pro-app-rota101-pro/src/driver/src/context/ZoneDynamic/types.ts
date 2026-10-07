export interface ZoneDynamicContextProps {
  zonesDynamic: ZoneDynamicObject[];
  getZonesDynamic: () => Promise<void>;
}

export interface ZoneDynamicObject {
  id: string;
  name: string;
  area: AreaProps[];
  multiplierValue: number;
  cityId: number;
  active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  startTime: string;
  endTime: string;
}

export interface AreaProps {
  lat: number;
  lng: number;
}
