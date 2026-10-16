import {useCallback} from 'react';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import {PaymentPrepaidByPixProps, PaymentPrepaidProps, VerifyPaymentByPixProps} from './types';

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

      customToast(translate("prepaidRequest.text_request_success"), 'success');
    },
    [apiMain],
  );


  const paymentPrepaidByPix = useCallback(
    async (payment: PaymentPrepaidByPixProps) => {
      const {data} = await apiMain.post('/CreditPrepaid/Purchase', payment);

      if (!data.status) {
        customToast(data.message, 'danger');

        return;
      }

      const paymentDataCode = String(data.data.payment_data.code);
      const prepaidId = String(data.data.id);

      return { paymentDataCode, prepaidId };
    },
    [apiMain],
  );

  const verifyPaymentByPix = useCallback(
    async (payment: VerifyPaymentByPixProps) => {
      const {data} = await apiMain.post('/CreditPrepaid/Show', payment);

      if (!data.status) {
        customToast(data.message, 'danger');

        return;
      }
      return data;
    },
    [apiMain],
  );

  return {
    getListPrepaid,
    paymentPrepaid,
    paymentPrepaidByPix,
    verifyPaymentByPix,
  };
};
