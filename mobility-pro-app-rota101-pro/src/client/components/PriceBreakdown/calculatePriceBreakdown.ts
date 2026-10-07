import { SelectedCouponProps } from '../../contexts/Trip/types';
import { calculateDiscountByCoupon } from '../../utils/CalulateDiscountByCoupon';
import { PriceBreakdownInput, PriceBreakdownResult } from './types';

const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const resolveDisplayedTotal = (input: PriceBreakdownInput): number => {
  const { basePrice, turbined, turbinedPrice, offerInDriver, isCouponApplicable, selectedCoupon } = input;
  if (turbined && turbinedPrice) return toNumber(turbinedPrice, basePrice);
  if (offerInDriver) return toNumber(offerInDriver, basePrice);
  if (isCouponApplicable && selectedCoupon && Object.keys(selectedCoupon).length > 0) {
    return calculateDiscountByCoupon(basePrice, selectedCoupon as SelectedCouponProps);
  }
  return basePrice;
};

const scaleProportional = (
  baseTotal: number,
  newTotal: number,
  baseValue: number | null | undefined,
): number | null => {
  if (typeof baseValue !== 'number' || !Number.isFinite(baseValue)) return null;
  if (baseTotal <= 0) return null;
  const scaled = baseValue * (newTotal / baseTotal);
  return Math.max(0, Math.min(scaled, newTotal));
};

const roundMoney = (value: number | null): number | null => {
  if (value === null) return null;
  return Math.round(value * 100) / 100;
};

const calculatePriceBreakdown = (input: PriceBreakdownInput): PriceBreakdownResult => {
  const basePrice = toNumber(input.basePrice);
  const total = roundMoney(Math.max(0, resolveDisplayedTotal({ ...input, basePrice }))) ?? 0;
  const scaledPlatformAmount = roundMoney(scaleProportional(basePrice, total, input.basePlatformAmount));
  const scaledDriverAmount = roundMoney(scaleProportional(basePrice, total, input.baseDriverAmount));
  const roundedPlatformAmount =
    scaledPlatformAmount !== null
      ? scaledPlatformAmount
      : scaledDriverAmount !== null
      ? roundMoney(Math.max(0, total - scaledDriverAmount))
      : null;
  const roundedDriverAmount =
    roundedPlatformAmount !== null
      ? roundMoney(Math.max(0, total - roundedPlatformAmount))
      : scaledDriverAmount;
  return {
    total,
    platformAmount: roundedPlatformAmount,
    driverAmount: roundedDriverAmount,
    hasBreakdown: roundedPlatformAmount !== null || roundedDriverAmount !== null,
  };
};

export default calculatePriceBreakdown;
