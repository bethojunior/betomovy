import { FinancialProps } from "../../../pages/Financial/TransferRequests/types";
import { WithdrawStatus } from "./types";

export const getWithdrawStatus = (data: FinancialProps): WithdrawStatus => {
  if (data.recused === 1) return "rejected";
  if (data.paid === 1) return "approved";
  return "pending";
};

export const formatDateTime = (date: unknown): string => {
  if (!date) return "-";
  const parsed = new Date(date as string);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("pt-BR");
};

export const getBankAccountLines = (
  bankAccountToPay: string | null | undefined
): string[] => {
  if (!bankAccountToPay) return [];
  return bankAccountToPay.split(",").map((line) => line.trim());
};
