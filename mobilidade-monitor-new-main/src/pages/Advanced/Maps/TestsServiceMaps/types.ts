interface MapServiceMetaDataProps {
  description: string;
  id: number;
  key: string;
  mapServiceId: number;
  statusId: number;
  value?: string;
}

export interface TypesProps {
  description: string;
  id: number;
  map_service_meta_data: MapServiceMetaDataProps[];
  name: string;
  statusId: number;
}

export interface ServiceTestProps {
  direction: string | boolean;
  geocoding: string | boolean;
  place: string | boolean;
  type: string;
}

export interface ErrorKeysMapsProps {
  type: string;
  [key: string]: any;
}

