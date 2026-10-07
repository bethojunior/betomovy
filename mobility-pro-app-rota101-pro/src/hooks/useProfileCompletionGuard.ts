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
  const { user } = useAuth();
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

        // Busca o Customer/Find fresco em vez do userData do contexto (só
        // preenchido no login) — senão uma aprovação feita no backend depois
        // do login continuava mostrando "pendente" até deslogar e logar de novo.
        const freshUserData = await refreshCustomerData();

        const redirectToMyProfile = (message: string) => {
          customToast(message, 'warning');
          requestAnimationFrame(() => navigation.navigate('MyProfile'));
        };

        const userDataValid = validateUserData(freshUserData, user);
        if (userDataValid) {
          redirectToMyProfile(translate('trip.alert_document_incomplete'));
          return;
        }

        if (String(freshUserData?.customerRegisterStatusId) === '2') {
          redirectToMyProfile(translate('trip.alert_document_pending_approval'));
          return;
        }

        if (String(freshUserData?.customerRegisterStatusId) === '3') {
          redirectToMyProfile(translate('trip.alert_account_blocked'));
          return;
        }

        const docValidation = await validateDocumentsEnhanced(freshUserData);
        if (!docValidation.isValid) {
          redirectToMyProfile(docValidation.message);
        }
      };

      checkUserValidation();
    }, [user, navigation, refreshCustomerData]),
  );
}
