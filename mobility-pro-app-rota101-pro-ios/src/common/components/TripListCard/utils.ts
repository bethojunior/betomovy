import { translate } from '../../../client/locales';
import { TripStatusVariant } from './types';

export const STATUS_ICON: Record<TripStatusVariant, string> = {
  success: 'check-circle',
  error: 'times-circle',
  warning: 'clock',
};

export const getStatusVariant = (status: string): TripStatusVariant => {
  if (status === 'FINISHED') return 'success';
  if (status === 'CANCELED' || status === 'PAYMENT_REFUSED') return 'error';
  return 'warning';
};

export const getPaymentIcon = (paymentForm?: string): { pack: 'fa5' | 'mci'; name: string } => {
  const normalized = (paymentForm ?? '').toLowerCase();
  if (normalized.includes('pix')) return { pack: 'mci', name: 'qrcode' };
  if (normalized.includes('dinheiro') || normalized.includes('cash')) {
    return { pack: 'fa5', name: 'money-bill-wave' };
  }
  return { pack: 'fa5', name: 'credit-card' };
};

export const switchTripStatusLabel = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return translate('service.scheduled');
    case 'PRE_ACCEPTED':
      return translate('service.pre_accepted');
    case 'ACCEPTED':
      return translate('service.trip_accepted');
    case 'BOARDING':
      return translate('service.boarding');
    case 'SEARCHING':
      return translate('service.searching');
    case 'IN_PROGRESS':
      return translate('request.text_in_progress');
    case 'FINISHED':
      return translate('service.finished');
    case 'CANCELED':
      return translate('service.cancel');
    case 'BACK_OFF':
      return translate('service.not_answered');
    case 'NOT_ANSWERED':
      return translate('service.not_answered');
    case 'PAYMENT_REFUSED':
      return translate('service.payment_refused');
    default:
      return '';
  }
};
