import { useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '~/context/auth';
import { customToast } from '~/utils/FlashMessage';
import { translate } from '~/client/locales';
import { validateUserData } from '~/utils/validateProfileFields';
import { validateDocumentsEnhanced } from '~/utils/validateProfileDocuments';
import { useRefreshCustomerData } from '~/client/hooks/useRefreshCustomerData';

const DOCUMENT_SCREENS = ['DocumentPending', 'DocumentSend', 'MyProfile'];

export function useProfileCompletionGuard() {
  const navigation = useNavigation<any>();
  const { user, generalSettings } = useAuth();
  const { refreshCustomerData } = useRefreshCustomerData();
  const validationExecutedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      validationExecutedRef.current = false;

      const checkUserValidation = async () => {
        if (validationExecutedRef.current || !user?.idUser) return;

        validationExecutedRef.current = true;

        const navigationState = navigation.getState();
        const currentRoute = navigationState?.routes[navigationState.index]?.name;
        const isInDocumentScreens = DOCUMENT_SCREENS.includes(currentRoute);

        if (isInDocumentScreens) return;

        // Fresh data from backend
        const freshUserData = await refreshCustomerData();

        const redirectToMyProfile = (message: string) => {
          customToast(message, 'warning');
          requestAnimationFrame(() => navigation.navigate('MyProfile'));
        };

        // 1. Account explicitly blocked
        if (String(freshUserData?.customerRegisterStatusId) === '3') {
          redirectToMyProfile(translate('trip.alert_account_blocked'));
          return;
        }

        // 2. Customer unblocked or active status - allow normal access
        const customerRegisterUnblocked = generalSettings?.find?.(
          (item: any) => item?.key === 'customer_register_unblocked',
        )?.value;

        const isCustomerActiveOrUnblocked =
          customerRegisterUnblocked === '1' ||
          String(freshUserData?.customerRegisterStatusId) === '1';

        if (isCustomerActiveOrUnblocked) {
          return;
        }

        // 3. Pending approval
        if (String(freshUserData?.customerRegisterStatusId) === '2') {
          redirectToMyProfile(translate('trip.alert_document_pending_approval'));
          return;
        }

        const docValidation = await validateDocumentsEnhanced(freshUserData);
        if (!docValidation.isValid && docValidation.message) {
          redirectToMyProfile(docValidation.message);
        }
      };

      checkUserValidation();
    }, [user, navigation, refreshCustomerData, generalSettings]),
  );
}
