export const normalizeTripLongDistance = (trip: any): any => {
  if (!trip) return trip;

  try {
    let normalizedTrip = { ...trip };

    if (trip.tripLongDistance) {
      const longDistance = trip.tripLongDistance;
      let normalizedValue = null;
      if (longDistance !== null && longDistance !== undefined) {
        if (typeof longDistance === 'object') {
          if ('value' in longDistance && (typeof longDistance.value === 'number' || typeof longDistance.value === 'string')) {
            normalizedValue = {
              value: typeof longDistance.value === 'string' ? parseFloat(longDistance.value) || 0 : longDistance.value,
            };
          } else if (typeof longDistance === 'number') {
            normalizedValue = { value: longDistance };
          }
        } else if (typeof longDistance === 'number') {
          normalizedValue = { value: longDistance };
        }
      }
      normalizedTrip.tripLongDistance = normalizedValue;
    }

    // Normalize riskArea (convert risk_area snake_case to riskArea camelCase) >.<
    if (trip.risk_area && !trip.riskArea) {
      normalizedTrip.riskArea = trip.risk_area;
      delete normalizedTrip.risk_area;
    }

    // Normalize tripPaymentForm: API/realtime may send object { idTripPaymentForm, name, paymentFormTypeId } >.<
    if (trip.tripPaymentForm != null && typeof trip.tripPaymentForm === 'object' && 'name' in trip.tripPaymentForm) {
      normalizedTrip.tripPaymentForm = (trip.tripPaymentForm as { name?: string }).name ?? '';
    }

    return normalizedTrip;
  } catch (error) {
    console.error('[normalizeTripLongDistance] Error:', error);
    return {
      ...trip,
      tripLongDistance: null,
    };
  }
};

export const getTripPaymentFormDisplay = (value: string | { name?: string } | null | undefined): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && 'name' in value) return (value as { name?: string }).name ?? '';
  return '';
};

// Trip/RecalculatePrice não é idempotente: se o recálculo já foi aplicado numa
// tentativa anterior (ex.: resposta perdida por timeout), o backend rejeita com
// "Essa viagem já foi recalculada" — nesse caso o preço já está correto no
// servidor e o fluxo deve seguir para o finish
export const isRecalcAlreadyApplied = (
  responseData: { status?: boolean; message?: string } | undefined,
): boolean => {
  return (
    !responseData?.status &&
    typeof responseData?.message === 'string' &&
    responseData.message.toLowerCase().includes('recalculada')
  );
};
