export interface DeliveryAcquirerMetadataProps {
  deliveryFinancialIntermediaryId: number;
  description: string;
  key: string;
  value: string | null;
}

export interface DeliveryAcquirersProps {
  active: boolean;
  delivery_acquirer_meta_data: DeliveryAcquirerMetadataProps[];
  id: number;
  name: string;
  statusId: number;
}
