interface PolygonProps {
  lat: number;
  lng: number;
}

export interface TollItemsProps {
  active: number;
  address: string;
  cityId: number;
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
  value: number;
  polygon: PolygonProps[];
  radius?: number;
}
