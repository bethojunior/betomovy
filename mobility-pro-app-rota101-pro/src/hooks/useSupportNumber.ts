import {useAuth} from '../context/auth';

const COUNTRY_CODE = '55';

const formatForWhatsapp = (rawNumber?: string | null) => {
  if (!rawNumber) return null;

  let cleaned = rawNumber.replace(/\D/g, '');
  if (!cleaned) return null;

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned;
  }

  if (cleaned.length === 10 && cleaned.startsWith('508')) {
    return `1${cleaned}`;
  }

  if (cleaned.startsWith('55') && (cleaned.length === 12 || cleaned.length === 13)) {
    return cleaned;
  }

  if (cleaned.length === 10) {
    const ddd = parseInt(cleaned.substring(0, 2), 10);
    if (ddd >= 11 && ddd <= 99 && ddd % 10 !== 0) {
      cleaned = `${cleaned.substring(0, 2)}9${cleaned.substring(2)}`;
      cleaned = `${COUNTRY_CODE}${cleaned}`;
      return cleaned;
    }
    return `1${cleaned}`;
  }

  if (cleaned.length === 11) {
    cleaned = `${COUNTRY_CODE}${cleaned}`;
  }

  return cleaned;
};

export const useSupportNumber = () => {
  const {cityConfig, generalSettings} = useAuth();

  // Número da cidade tem prioridade; sem ele, cai no número global
  const getSupportNumber = () => {
    const cityNumber = cityConfig?.supportContactNumber;
    if (cityNumber) return cityNumber;

    const globalNumber = generalSettings?.find(
      item => item?.key === 'support_help_phone',
    )?.value;

    return globalNumber ?? null;
  };

  const getSupportNumberFormatted = () => formatForWhatsapp(getSupportNumber());

  return {
    getSupportNumber,
    getSupportNumberFormatted,
  };
};
