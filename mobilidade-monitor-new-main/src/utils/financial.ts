import CurrencyUtils from "./currency/currency";
import { percentageMask } from "./masks/number";

export const formatTransactionFee = (
  feePercent?: string | number | null,
  fixedFee?: string | number | null,
): string => {
  const parts: string[] = [];

  if (feePercent != null && Number(feePercent) > 0) {
    parts.push(percentageMask(String(feePercent), true));
  }

  if (fixedFee != null && Number(fixedFee) > 0) {
    parts.push(`${CurrencyUtils.formatCurrency(String(fixedFee))}`);
  }

  return parts.join(" + ") || "";
};
