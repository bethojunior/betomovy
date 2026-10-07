export interface IPrepaidContext {
  getListPrepaid: () => Promise<PrepaidProps[]>;
  paymentPrepaid: (payment: PaymentPrepaidProps) => Promise<void>;
}

export interface PrepaidProps {
  id: string;
  superTitle: string;
  stripe: string;
  title: string;
  purchasePrice: string;
  sellPrice: string;
  accountInformation: string;
  created_at: string;
  updated_at: string;
  paymentForms: PaymentProps[];
}

export interface PaymentProps {
  id: string;
  paymentFormId: string;
  creditPrepaidId: string;
  name: string;
  automaticPayment: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentPrepaidProps {
  creditPrepaidId: string;
  paymentFormId: string;
  cardId: string;
  mpToken?: string;
}
