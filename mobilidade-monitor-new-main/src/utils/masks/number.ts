export function percentageMask(value?: string, signal = false): string {
  if (!value) return "";

  let cleaned = value.replace(/[^\d.]/g, "");

  cleaned = cleaned.replace(/^(\d*\.?\d{0,2}).*$/, "$1");
  cleaned = cleaned.replace(/^0+(?=\d)/, "");

  const numericValue = parseFloat(cleaned);

  if (!Number.isNaN(numericValue) && numericValue > 100) {
    return "100";
  }

  if (cleaned.includes(".")) {
    cleaned = cleaned.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  }

  return signal ? `${cleaned}%` : cleaned;
}
