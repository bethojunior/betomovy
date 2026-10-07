import { useEffect, useState } from 'react';
import { AppState, BackHandler, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { Container } from './styles';
import { PermissionStep } from './steps/PermissionStep';
import { useBackgroundLocationPermission } from '../../hooks/useBackgroundLocationPermission';

import { translate } from '../../../../client/locales';

const { width } = Dimensions.get('window');

export const BackgroundLocationPermission = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const { checkBackgroundLocationPermission, requestBackgroundLocationPermission } =
    useBackgroundLocationPermission();

  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [checkingCurrentPermission, setCheckingCurrentPermission] = useState(true);

  const finishBackgroundLocationPermission = () => {
    requestAnimationFrame(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    });
  };

  useEffect(() => {
    checkBackgroundLocationPermission().then((alreadyGranted) => {
      if (alreadyGranted) {
        finishBackgroundLocationPermission();
      } else {
        setCheckingCurrentPermission(false);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active' || checkingCurrentPermission) return;

      checkBackgroundLocationPermission().then((granted) => {
        if (granted) {
          finishBackgroundLocationPermission();
        }
      });
    });

    return () => subscription.remove();
  }, [checkingCurrentPermission]);

  const handleAcceptBackgroundLocation = async () => {
    setIsRequestingPermission(true);
    try {
      const granted = await requestBackgroundLocationPermission();
      if (granted) {
        finishBackgroundLocationPermission();
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
        icon={<Feather name="navigation" size={RFValue(28)} color={theme.colors.secondary} />}
        title={translate('backgroundLocationDisclosure.title')}
        descriptions={[translate('backgroundLocationDisclosure.description')]}
        buttonTitle={translate('backgroundLocationDisclosure.confirm')}
        onPress={handleAcceptBackgroundLocation}
        loading={isRequestingPermission}
      />
    </Container>
  );
};
