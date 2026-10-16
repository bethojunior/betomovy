export interface iPaymentFormContext {
  getCards: () => Promise<CreditCard[]>;
  removeCard: (card: string) => Promise<void>;
  addCard: (
    listCard: any,
    cardHolder: string,
    document: string,
    cardNumber: string,
    dueDate: string,
    cvv: string,
    birthday: string,
  ) => Promise<void>;
}

export interface CreditCard {
  birthDate?: any;
  cardholderName?: string;
  created_at?: string;
  cvv?: string;
  expirationMonth?: string;
  expirationYear?: string;
  holderDocument?: string;
  idCard?: string;
  mpCardId?: any;
  mpCustomerId?: string;
  mpFirstSixDigits?: string;
  mpLastFourDigits?: string;
  mpPaymentMethodName?: string;
  mpSecurityCodeLength?: string;
  number?: string;
  statusId?: string;
  userId?: string;
}
