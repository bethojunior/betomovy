import {useCallback} from 'react';
import {customToast} from '../../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import {PaymentPrepaidProps} from './types';

export const PrepaidService = () => {
  const getListPrepaid = useCallback(async (cityId) => {
    let endpoint = '/CreditPrepaid/List';
    if (cityId) {
      endpoint = `/CreditPrepaid/List?cityId=${Number(cityId)}`;
    }
    const {data} = await apiMain.get(endpoint);

    if (!data.status) {
      return data.message;
    }

    return data.data;
  }, [apiMain]);

  const paymentPrepaid = useCallback(
    async (payment: PaymentPrepaidProps) => {
      const {data} = await apiMain.post('/CreditPrepaid/Purchase', payment);

      if (!data.status) {
        customToast(data.message, 'danger');

        return;
      }

      customToast(data.message, 'success');
    },
    [apiMain],
  );

  return {
    getListPrepaid,
    paymentPrepaid,
  };
};
