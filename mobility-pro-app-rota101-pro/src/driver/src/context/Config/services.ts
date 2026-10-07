import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import apiMainDriver from '../../api/apiMain';

export const ConfigService = () => {
  const get = async () => {
    try {
      const result = await apiMainDriver('TripPaymentForm/GetAll');
      return result.data;
    } catch (error) {
      return customToast(translate('configPage.text_payment_forms_load_error'), 'danger');
    }
  };

  const getChooseDriver = async () => {
    try {
      const result = await apiMainDriver('DriverFormOfPayment/GetAll');
      return result.data;
    } catch (error) {
      return customToast(error, 'danger');
    }
  };

  const getImposition = async () => {
    try {
      const result = await apiMainDriver(
        'DriverFormOfPayment/GetAllImposition',
      );
      return result.data;
    } catch (error) {
      return customToast(error, 'danger');
    }
  };

  const chooseFormPayment = async (tripPaymentForms: number[]) => {
    try {
      const result = await apiMainDriver.post('DriverFormOfPayment/Insert', {
        tripPaymentForms,
      });
      return result.data;
    } catch (error) {
      return customToast(error, 'danger');
    }
  };
  return {
    get,
    getChooseDriver,
    getImposition,
    chooseFormPayment,
  };
};
