import { formatPrice } from './money';
import { changePriceByDiscount } from './CalulateDiscountByCoupon';

interface GetPixTripPriceParams {
  turbined: boolean;
  offerInDriver: number;
  selectedOptionTravel: any;
  selectedCoupon: any;
  cityConfig: any;
}

export function getPixTripPrice({
  turbined,
  offerInDriver,
  selectedOptionTravel,
  selectedCoupon,
  cityConfig,
}: GetPixTripPriceParams): number | string {
  if (turbined) {
    return formatPrice(
      offerInDriver,
      selectedOptionTravel,
      selectedOptionTravel,
      cityConfig,
      turbined,
    );
  }
  return changePriceByDiscount(
    Number(selectedOptionTravel.price),
    selectedCoupon,
    selectedOptionTravel,
  );
}
