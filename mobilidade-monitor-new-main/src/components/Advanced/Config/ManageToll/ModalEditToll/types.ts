export interface InformationsPlacesProps {
  address: string;
  cityId: number | string | null;
  created_at: string;
  latitude: string;
  longitude: string;
  neighborhood: string | null;
  proximity: string;
  relevance: string;
  type: string;
}

export interface PlaceProps {
  address: string;
  city: string;
  country: string;
  estate: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  number: number | null;
  postal_code: any;
  street: string;
  type: string;
}
