export function calculateFeeValue(
  value: string | number | undefined,
  type: string | undefined,
  base: number,
): number {
  const numericValue = parseFloat(String(value ?? '0')) || 0;
  return type === '%' ? (base * numericValue) / 100 : numericValue;
}

interface Tax {
  name: string;
  description?: string;
  value: string | number;
  valueType?: string;
  chargeBy?: string;
}

export interface TaxRow {
  label: string;
  value: number;
}

function getTaxRowsByChargeBy(taxes: Tax[] | undefined, chargeBy: string, base: number): TaxRow[] {
  return (taxes ?? [])
    .filter(tax => tax.chargeBy === chargeBy)
    .map(tax => ({
      label: tax.description || tax.name,
      value: calculateFeeValue(tax.value, tax.valueType, base),
    }));
}

export function getCustomerTaxRows(taxes: Tax[] | undefined, feeBase: number): TaxRow[] {
  return getTaxRowsByChargeBy(taxes, 'customer', feeBase);
}

export function getDriverTaxRows(taxes: Tax[] | undefined, grossPrice: number): TaxRow[] {
  return getTaxRowsByChargeBy(taxes, 'driver', grossPrice);
}

export function getDeductedTaxRows(taxes: Tax[] | undefined, grossPrice: number): TaxRow[] {
  return (taxes ?? []).map(tax => ({
    label: tax.description || tax.name,
    value: calculateFeeValue(tax.value, tax.valueType, grossPrice),
  }));
}
