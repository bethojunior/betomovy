import { LastTransactionProps } from '../../context/bank/types';
import { TransactionGroup } from './types';

/** Agrupa transações pela viagem (tripReference) — item sem viagem vira grupo avulso de 1 item. */
export function groupTransactions(transactions: LastTransactionProps[]): TransactionGroup[] {
  const groups: TransactionGroup[] = [];
  const groupByTrip = new Map<string, TransactionGroup>();

  transactions.forEach(item => {
    if (!item.tripReference) {
      groups.push({ tripReference: null, date: item.date, items: [item] });
      return;
    }

    const existing = groupByTrip.get(item.tripReference);
    if (existing) {
      existing.items.push(item);
      return;
    }

    const group: TransactionGroup = {
      tripReference: item.tripReference,
      paymentFormName: item.paymentFormName,
      date: item.date,
      items: [item],
    };
    groupByTrip.set(item.tripReference, group);
    groups.push(group);
  });

  return groups;
}
