import {customToast} from '../../../../utils/FlashMessage';
import {PrepaidService} from './service';
import {PaymentPrepaidByPixProps, PaymentPrepaidProps, VerifyPaymentByPixProps} from './types';
import { loadCache } from '../../../../hooks/useCityConfig';

export const usePrepaid = () => {
  const service = PrepaidService();

  const getListPrepaid = async () => {
    try {
      const cityConfig = loadCache();
      if (!cityConfig) {
        return;
      }
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

  const paymentPrepaidByPix = async (payment: PaymentPrepaidByPixProps) => {
    try {
      const result = await service.paymentPrepaidByPix(payment);
      return result
    } catch (error) {
      console.log(error);
    }
  }

  const verifyPaymentByPix = async (payment: VerifyPaymentByPixProps) => {
    try {
      const result = await service.verifyPaymentByPix(payment);
      return result
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getListPrepaid,
    paymentPrepaid,
    paymentPrepaidByPix,
    verifyPaymentByPix
  };
};
