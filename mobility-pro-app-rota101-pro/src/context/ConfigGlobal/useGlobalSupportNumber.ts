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
