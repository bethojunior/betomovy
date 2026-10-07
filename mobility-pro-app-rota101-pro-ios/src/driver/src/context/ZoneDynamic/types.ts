export interface ZoneDynamicContextProps {
  zonesDynamic: ZoneDynamicObject[];
  getZonesDynamic: () => Promise<void>;
}

export interface ZoneDynamicObject {
  id: string;
  name: string;
  area: AreaProps[];
}

export interface AreaProps {
  lat: number;
  lng: number;
}
