import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {translate} from '../../locales';
import {customToast} from '../../../utils/FlashMessage';
import {ReceiptService} from './services';
import {useAuth} from '../../../context/auth';

interface Props {
  sendReceipt: (tripReference: string) => void;
  postContactUs: (message: string, idUser: string) => void;
  postExcludeAccount: (details: string, reason: string) => void;
}

const ReceiptContext = createContext<Props>({} as Props);
export const ReceiptProvider = ({children}: any) => {
  const {signOut} = useAuth();

  const sendReceipt = useCallback(async (tripReference: string) => {
    try {
      const response = await ReceiptService.postReceipt(tripReference);
      if (!response.status) {
        return customToast(translate('contactUs.alert_error'), 'warning');
      }
      return customToast(translate('contactUs.alert_sucess'), 'success');
    } catch (error) {
      return console.log(error);
    }
  }, []);

  const postContactUs = useCallback(async (message: string, idUser: string) => {
    try {
      const response = await ReceiptService.postMessageContactUs(
        message,
        idUser,
      );
      if (!response.status) {
        return customToast(translate('contactUs.alert_error'), 'warning');
      }
      return customToast(translate('contactUs.alert_sucess'), 'success');
    } catch (error) {
      return console.log(error);
    }
  }, []);

  const postExcludeAccount = useCallback(
    async (details: string, reason: string) => {
      try {
        const response = await ReceiptService.postExcludeAccount(
          details,
          reason,
        );
        if (!response.status) {
          return customToast(
            response?.errors?.message || response?.message,
            'warning',
          );
        }
        customToast('Sua solicitação de exclusão foi feita', 'success');
        return signOut();
      } catch (error) {
        return console.log(error);
      }
    },
    [signOut],
  );

  const value = useMemo(
    () => ({
      sendReceipt,
      postContactUs,
      postExcludeAccount,
    }),
    [sendReceipt, postContactUs, postExcludeAccount],
  );
  return (
    <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>
  );
};
export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  return context;
};
