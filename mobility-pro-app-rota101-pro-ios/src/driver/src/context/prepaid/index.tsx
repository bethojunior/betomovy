import {createContext, useContext, useMemo} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import {ChildrenType} from '../../../@types';
import {PrepaidService} from './service';
import {IPrepaidContext, PaymentPrepaidProps} from './types';
import {useAuth} from '../../../../context/auth';

const PrepaidContext = createContext({} as IPrepaidContext);

export const PrepaidProvider = ({children}: ChildrenType) => {
  const service = PrepaidService();
  const {cityConfig} = useAuth();

  const getListPrepaid = async () => {
    try {
      const response = await service.getListPrepaid(cityConfig?.cityId);

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  };

  const paymentPrepaid = async (payment: PaymentPrepaidProps) => {
    try {
      await service.paymentPrepaid(payment);
    } catch (err) {
      console.log(err);
    }
  };

  const value = useMemo(() => {
    return {
      getListPrepaid,
      paymentPrepaid,
    };
  }, [getListPrepaid, paymentPrepaid]);

  return (
    <PrepaidContext.Provider value={value}>{children}</PrepaidContext.Provider>
  );
};

export const usePrepaid = () => {
  const context = useContext(PrepaidContext);
  return context;
};
