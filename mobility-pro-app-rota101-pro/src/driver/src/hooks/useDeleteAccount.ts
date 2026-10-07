import { useState } from 'react';
import { translate } from '../../../client/locales';
import { useAuth } from '../../../context/auth';
import { ReceiptService } from '../../../client/contexts/Receipt/services';
import { customToast } from '../../../utils/FlashMessage';

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);

  const { signOutDriver } = useAuth();

  const postExcludeAccount = async (reason: string, details: string) => {
    setLoading(true);
    try {
      const response = await ReceiptService.postExcludeAccount(details, reason);
      if (response.status) {
        customToast(translate('exclude.delete_request_sent'), 'success');
        signOutDriver();
      } else {
        customToast(translate('contactUs.alert_error'), 'danger');
      }
    } catch (err) {
      customToast(translate('contactUs.alert_error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return { postExcludeAccount, loading };
}
