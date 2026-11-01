import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { Container } from './styles';
import { PermissionStep } from './steps/PermissionStep';
import { runPendingOverlayPermissionAction } from './pendingOverlayPermissionAction';
import { OVERLAY_OPTIONAL_KEY } from './useEnsureOverlayPermission';

import { translate } from '../../../../client/locales';

const { width } = Dimensions.get('window');

export const OverlayPermission = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const { checkPermission, requestPermission } = useBubbleButton();

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [checkingCurrentPermission, setCheckingCurrentPermission] = useState(true);

  const finishOverlayPermission = useCallback(() => {
    requestAnimationFrame(async () => {
      await runPendingOverlayPermissionAction();
      navigation.navigate('Home');
    });
  }, [navigation]);

  const handleSkipOverlay = useCallback(async () => {
    await AsyncStorage.setItem(OVERLAY_OPTIONAL_KEY, '1');
    finishOverlayPermission();
  }, [finishOverlayPermission]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      finishOverlayPermission();
      return;
    }

    checkPermission().then(alreadyGranted => {
      if (alreadyGranted) {
        finishOverlayPermission();
      } else {
        setCheckingCurrentPermission(false);
      }
    });
  }, [checkPermission, finishOverlayPermission]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleSkipOverlay();
      return true;
    });
    return () => subscription.remove();
  }, [handleSkipOverlay]);

  const handleAcceptOverlay = async () => {
    setIsRequestingPermission(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        finishOverlayPermission();
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  if (checkingCurrentPermission) {
    return <Container />;
  }

  return (
    <Container>
      <PermissionStep
        width={width}
        icon={<Feather name="layers" size={RFValue(28)} color={theme.colors.secondary} />}
        title={translate('overlayPermissionDisclosure.title')}
        descriptions={[translate('overlayPermissionDisclosure.description')]}
        buttonTitle={translate('overlayPermissionDisclosure.confirm')}
        onPress={handleAcceptOverlay}
        loading={isRequestingPermission}
        secondaryTitle={translate('overlayPermissionDisclosure.skip')}
        onSecondaryPress={handleSkipOverlay}
      />
    </Container>
  );
};
