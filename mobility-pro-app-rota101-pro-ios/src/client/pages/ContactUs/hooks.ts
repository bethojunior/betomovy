import {customToast} from '../../../utils/FlashMessage';
import {ReceiptService} from '../../contexts/Receipt/services';
import {translate} from '../../locales';

export const useContactUs = () => {
  const postContactUs = async (message: string, idUser: string) => {
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
  };

  const insertByCustomer = async (
    message: string,
    tripReference: string,
    cancellationReasonsId,
  ) => {
    try {
      const response = await ReceiptService.insertByCustomer({
        message,
        tripReference,
        tripReportTypeId: null,
        cancellationReasonsId,
      });
      if (!response.status) {
        return customToast(translate('contactUs.alert_error'), 'warning');
      }
      return customToast(translate('contactUs.alert_sucess'), 'success');
    } catch (error) {
      return console.log(error);
    }
  };

  return {postContactUs, insertByCustomer};
};
