import { SelectedCouponProps } from '../../contexts/Trip/types';

export type PriceBreakdownProps = {
  total: number;
  platformAmount?: number | null;
  driverAmount?: number | null;
  typeMoney?: string;
  showTitle?: boolean;
  showDisclaimer?: boolean;
};

export type PriceBreakdownRowProps = {
  label: string;
  value: string;
  emphasis?: boolean;
};

export type PriceBreakdownInput = {
  basePrice: number;
  basePlatformAmount?: number | null;
  baseDriverAmount?: number | null;
  selectedCoupon?: SelectedCouponProps | Record<string, never>;
  isCouponApplicable?: boolean;
  offerInDriver?: number | null;
  turbinedPrice?: number | string | null;
  turbined?: boolean;
};

export type PriceBreakdownResult = {
  total: number;
  platformAmount: number | null;
  driverAmount: number | null;
  hasBreakdown: boolean;
};

export type PopoverPosition = {
  top: number;
};
