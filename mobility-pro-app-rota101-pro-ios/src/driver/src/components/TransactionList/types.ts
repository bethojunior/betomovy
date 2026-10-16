import { LastTransactionProps } from '../../context/bank/types';

export interface TransactionGroup {
  tripReference: string | null;
  paymentFormName?: string | null;
  date: string;
  items: LastTransactionProps[];
}

export interface TransactionListProps {
  transactions: LastTransactionProps[];
}
