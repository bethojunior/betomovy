export interface DeliveryGeneralConfig {
  type_of_delivery_area: 'by_area' | 'by_neighborhood';
  name_establishment_delivery: string;
  customer_register_sms_confirmation_code: '0' | '1';
}

export interface ConfigResponse {
  status: boolean;
  response: string;
}

export interface UpdateConfigRequest {
  type_of_delivery_area?: 'by_area' | 'by_neighborhood';
  name_establishment_delivery?: string;
  customer_register_sms_confirmation_code?: '0' | '1';
}