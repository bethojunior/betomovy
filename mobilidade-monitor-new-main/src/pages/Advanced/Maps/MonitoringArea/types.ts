export interface AreaProps {
  lat: number;
  lng: number;
}

export interface DynamicsAreasProps {
  active: number;
  area: AreaProps[];
  endTime: string;
  id: number;
  multiplierValue: number;
  name: string;
  startTime: string;
}

export interface MonitoringAreaProps {
  active: number;
  area: AreaProps[];
  id: number;
  name: string;
}

export interface SearchAddressesProps {
  boundingbox: string[];
  category: string;
  display_name: string;
  geojson: {
    type: string;
    coordinates: any;
  };
  icon: string;
  importance: number;
  lat: string;
  licence: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: number;
  place_rank: number;
  type: string;
}
