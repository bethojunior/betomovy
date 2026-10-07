export interface PaymentFormTypeProps {
  description: string;
  id: number;
  isGeneral: number;
  name: string;
  showable: number;
}

export interface FormPaymentsProps {
  created_at: string;
  deleted_at: string | null;
  id: number;
  name: string;
  paymentFormTypeId: number;
  payment_form_type: PaymentFormTypeProps;
  updated_at: string | null;
}
