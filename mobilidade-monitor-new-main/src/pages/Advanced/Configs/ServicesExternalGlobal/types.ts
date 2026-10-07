export interface ExternalServiceMetaDataProps {
    description: string;
    externalServiceId: number;
    id: number;
    key: string;
    value: string | number | null;
  }
  
  export interface ExternalServicesProps {
    active: number;
    externalServiceTypeId: number;
    external_service_meta_data: ExternalServiceMetaDataProps[];
    id: number;
    name: string;
    keyIndetify: string;
  }
  
  export interface FullyTypesServicesProps {
    external_services: ExternalServicesProps[];
    id: number;
    name: string;
    key: string;
  }
  
  export interface ListInputsObjectProps {
    key: string;
    external_services?: ExternalServicesProps | undefined;
  }
  
  export interface ValuesDefaultsObjectProps {
    key: string;
    value: string | number | null;
  }
  