import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import apiMainDriver from '../../api/apiMain';

export const ConfigService = () => {
  const get = async () => {
    try {
      const result = await apiMainDriver('TripPaymentForm/GetAll');
      return result.data;
    } catch (error) {
      customToast(translate('configPage.text_payment_forms_load_error'), 'danger');
      return { status: false, message: translate('configPage.text_payment_forms_load_error'), data: [] };
    }
  };

  const getChooseDriver = async () => {
    try {
      const result = await apiMainDriver('DriverFormOfPayment/GetAll');
      return result.data;
    } catch (error) {
      customToast(error, 'danger');
      return { status: false, message: 'Erro ao carregar formas escolhidas', data: [] };
    }
  };

  const getImposition = async () => {
    try {
      const result = await apiMainDriver(
        'DriverFormOfPayment/GetAllImposition',
      );
      return result.data;
    } catch (error) {
      customToast(error, 'danger');
      return { status: false, message: 'Erro ao carregar imposições', data: [] };
    }
  };

  const chooseFormPayment = async (tripPaymentForms: number[]) => {
    try {
      const result = await apiMainDriver.post('DriverFormOfPayment/Insert', {
        tripPaymentForms,
      });
      return result.data;
    } catch (error) {
      customToast(error, 'danger');
      return { status: false, message: 'Erro ao salvar formas de pagamento', data: [] };
    }
  };
  return {
    get,
    getChooseDriver,
    getImposition,
    chooseFormPayment,
  };
};
