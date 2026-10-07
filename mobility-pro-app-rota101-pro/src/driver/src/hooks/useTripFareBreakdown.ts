import { getEstimatedTripTimeInMinutes } from '../utils/FormatDate';
import { calculateFeeValue, getCustomerTaxRows } from '../utils/fare';
import { TripFareBreakdown } from './types';

// Mesma conta de tarifa do EarningsCard, sem duplicar em outro lugar.
export const useTripFareBreakdown = (
  detailsTrip: any,
  distance: number,
): TripFareBreakdown => {
  const fare = detailsTrip?.fare;

  const basePrice = fare?.base_price ? parseFloat(fare.base_price) : 0;

  const distancePrice = fare?.km_price
    ? parseFloat(fare.km_price) * (distance || 0)
    : 0;

  const timePrice = fare?.minute_price
    ? parseFloat(fare.minute_price) * getEstimatedTripTimeInMinutes(detailsTrip)
    : 0;

  const feeBase = basePrice + distancePrice + timePrice;

  const taxPrice = calculateFeeValue(fare?.tax_price, fare?.tax_price_type, feeBase);

  const additionalValue =
    calculateFeeValue(fare?.another_fee, fare?.another_fee_type, feeBase) +
    (fare?.additional_value_after_km ? parseFloat(fare.additional_value_after_km) : 0);

  const customerTaxes = getCustomerTaxRows(detailsTrip?.taxes, feeBase);

  const summedTotal = feeBase + taxPrice + additionalValue;

  /** Total vem do backend (já cobre parada/dinâmica/taxa/longa distância); soma parcial é só fallback. */
  const total = Number(detailsTrip?.financialBreakdown?.grossPrice ?? detailsTrip?.price ?? summedTotal);

  return { basePrice, distancePrice, timePrice, taxPrice, additionalValue, customerTaxes, total };
};
