import {customToast} from '../../../../utils/FlashMessage';
import apiMainDriver from '../../api/apiMain';

export const ConfigService = () => {
  const get = async () => {
    try {
      const result = await apiMainDriver('TripPaymentForm/GetAll');
      return result.data;
    } catch (error) {
      return customToast('erro ao carregar as formas de pagamento', 'danger');
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
