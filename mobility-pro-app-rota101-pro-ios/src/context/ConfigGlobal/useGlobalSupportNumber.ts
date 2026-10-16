import {useEffect, useState} from 'react';
import apiMain from '../../client/api/apiMain';

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

/**
 * Número de suporte pra contextos que rodam ANTES do login (ex.: modal de
 * atualização obrigatória, montado acima do AuthProvider). Não pode usar
 * `useSupportNumber`/`useAuth` porque esse contexto ainda não existe nesse
 * ponto da árvore — busca `config/general` direto, sem depender de sessão.
 */
export const useGlobalSupportNumber = () => {
  const [supportNumber, setSupportNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    apiMain
      .get('config/general')
      .then(({data}) => {
        if (!isMounted) return;
        const rawNumber = data?.data?.find(
          (item: {key?: string; value?: string}) => item?.key === 'support_help_phone',
        )?.value;
        setSupportNumber(formatForWhatsapp(rawNumber));
      })
      .catch(() => {
        if (isMounted) setSupportNumber(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {supportNumber, loading};
};
