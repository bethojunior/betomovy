export interface TypesWebhooksProps {
  created_at: string | null;
  description: string;
  id: number;
  key: string;
  name: string;
  updated_at: string | null;
}

export interface WebhooksServicesProps {
  active: number;
  created_at: string;
  id: number;
  type_service: TypesWebhooksProps;
  type_service_id: number;
  updated_at: string;
  url: string;
  method: string;
}
