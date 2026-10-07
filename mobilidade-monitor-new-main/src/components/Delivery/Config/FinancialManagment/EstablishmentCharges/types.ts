export interface EstablishmentChargesProps {
  company: CompanyProps;
  companyId: number;
  created_at: string;
  description: string;
  id: number;
  statusId: number;
  statusPaymentId: number;
  status_payment: {
    description: string;
    id: number;
  };
  updated_at: string;
  value: number;
}
