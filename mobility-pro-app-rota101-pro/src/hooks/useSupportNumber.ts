import {useAuth} from '../context/auth';

const COUNTRY_CODE = '55';

const formatForWhatsapp = (rawNumber?: string | null) => {
  if (!rawNumber) return null;

  let cleaned = rawNumber.replace(/\D/g, '');
  if (!cleaned) return null;

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // DDD + 8 dígitos (sem o 9 do celular), insere o 9
  if (cleaned.length === 10) {
    cleaned = `${cleaned.substring(0, 2)}9${cleaned.substring(2)}`;
  }

  // DDD + celular (11 dígitos), ainda sem código do país
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
