export interface FinancialProps {
  bankAccountId: number;
  bankAccountToPay: string;
  confirmationCode: string;
  created_at: any;
  document: string;
  idWithdraw: number;
  isCustomer: number;
  isDriver: number;
  name: string;
  paid: number;
  paidBankAccount: any;
  paidByUser: any;
  paidByUserName: any;
  recusedByUserName: string;
  paymentDate: any;
  phone: string;
  recused: number;
  recusedByUser: any;
  refusalDate: any;
  userId: number;
  value: number;
  pix?: string;
}
