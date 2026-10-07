import { useCallback } from 'react';
import apiMain from '../api/apiMain';
import { useAuth } from '../../context/auth';

/**
 * Busca o Customer/Find fresco e atualiza o userData do contexto — o
 * contexto só é preenchido no login, então sem isso qualquer mudança feita
 * no backend depois (aprovação de documento, desbloqueio de conta) só
 * aparecia deslogando e logando de novo.
 */
export function useRefreshCustomerData() {
  const { user, userData, setUserData } = useAuth();

  const refreshCustomerData = useCallback(async () => {
    if (!user?.idUser) return userData;

    try {
      const { data } = await apiMain.post('Customer/Find', { idUser: user.idUser });
      if (data?.status) {
        setUserData(data.data);
        return data.data;
      }
    } catch (error) {
      console.log('Erro ao atualizar Customer/Find:', error?.response?.status, error?.message);
    }

    return userData;
  }, [user?.idUser, setUserData]);

  return { refreshCustomerData };
}
