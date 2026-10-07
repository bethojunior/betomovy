export interface MapServiceMetaDataProps {
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

interface KeysProps {
  key: string;
  value: string;
}

export interface MapsServicesProps {
  groupCode: string;
  type: string;
  keys: KeysProps[];
}
