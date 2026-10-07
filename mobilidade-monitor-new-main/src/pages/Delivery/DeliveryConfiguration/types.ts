export interface DeliveryConfigData {
  linkAndroid: string;
  linkIos: string;
  cities: string;
  image: string;
}

export interface DeliveryConfigResponse {
  status: boolean;
  response: DeliveryConfigData[];
}

export interface DeliveryConfigRequest {
  linkAndroid: string;
  linkIos: string;
  cities: string;
  image: string;
}