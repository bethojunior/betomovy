export interface userType {
  description: string | null;
  iconMapDriverId: string | null;
  idUserType: string;
  isActive: number;
  isDeliveryMan: number;
  isDriver: number;
  name: string;
  picture: string;
}

export interface searchableType {
  balanceFlowReferenceId: number;
  balance_flow_reference: {
    idBalanceFlowReference: number;
    name: string;
  };
  flow: string;
  flowId: number;
  flow_type: {
    id: number;
    flow: string;
    color: string;
    short_description: string;
  };
  idBalanceFlowType: number;
  name: string;
  showType: number;
}

export interface balancePostingType {
  id: number;
  balanceTypeName: string;
  flow: string;
  value: string;
  billingDay: string;
  category: string;
}

export interface PaymentFormType {
  active: number;
  automaticPayment: number;
  idPaymentForm: number;
  name: string;
}

export interface CitiesType {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

interface CreditPrepaidPaymentFormProps {
  created_at: string;
  creditPrepaidId: number;
  deleted_at: string | null;
  id: number;
  paymentFormId: number;
  payment_form: {
    active: number;
    automaticPayment: number;
    idPaymentForm: number;
    name: string;
  };
  updated_at: string;
}

export interface CreditPrepaidProps {
  accountInformation: string;
  cityId: number | null;
  cityName: string | null;
  created_at: string;
  credit_prepaid_payment_form: CreditPrepaidPaymentFormProps[];
  deleted_at: string | null;
  id: number;
  purchasePrice: number;
  quantityDaysPurchased: any;
  quantityDaysSold: any;
  sellPrice: string;
  stripe: string;
  superTitle: string;
  title: string;
  type: string;
  updated_at: string;
}
