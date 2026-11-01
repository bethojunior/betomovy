import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Container, VersionText } from './styles';
import Constants from 'expo-constants';

import AnimatedLottieView from 'lottie-react-native';
import { useUserDriver } from '../../context/userDriver';
import { If } from '../../components/If';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../../../../context/auth';
import { useLocalProvider } from '../../context/local';
import { AlertLocationRefused } from '../../components/AlertLocationRefused';
import { useNetwork } from '~/context/ConfigGlobal';
import { useBackgroundLocationPermission } from '../../hooks/useBackgroundLocationPermission';

const SPLASH_MAX_WAIT_MS = 12000;

const AnimatedSplashScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [isVisible, setisVisible] = useState(true);
  const { location } = useLocalProvider();
  const { userDriverFind, getDriverFind } = useUserDriver();
  const { cityConfig, getConfigByPosition } = useAuth();
  const [firstLoading, setFirstLoading] = useState(false);
  const appVersion = Constants.manifest?.version || Constants.expoConfig?.version;
  const { itsNetwork: network } = useNetwork();
  const prevNetworkRef = useRef<boolean | null>(null);
  const { checkBackgroundLocationPermission } = useBackgroundLocationPermission();

  const handleNavigation = async () => {
    const hasLocationPermission = await checkBackgroundLocationPermission();
    if (!hasLocationPermission) {
      navigation.reset({ index: 0, routes: [{ name: 'BackgroundLocationPermission' }] });
      return;
    }

    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  useEffect(() => {
    if (firstLoading || !location?.coords?.latitude) return;

    const hasData =
      userDriverFind &&
      Object.keys(userDriverFind).length > 0 &&
      cityConfig &&
      Object.keys(cityConfig).length > 0;

    if (hasData || network === false) {
      setFirstLoading(true);
      handleNavigation();
      setisVisible(false);
    }
  }, [userDriverFind, cityConfig, location, network]);

  useEffect(() => {
    if (firstLoading || !location?.coords?.latitude) return;

    const fallback = setTimeout(() => {
      setFirstLoading(true);
      handleNavigation();
      setisVisible(false);
    }, SPLASH_MAX_WAIT_MS);

    return () => clearTimeout(fallback);
  }, [firstLoading, location]);

  useEffect(() => {
    const networkJustCameBack = network && prevNetworkRef.current === false;
    prevNetworkRef.current = network ?? null;

    if (!networkJustCameBack) return;

    if (!userDriverFind || Object.keys(userDriverFind).length === 0) {
      getDriverFind();
    }
    if ((!cityConfig || Object.keys(cityConfig).length === 0) && location?.coords) {
      getConfigByPosition(location.coords);
    }
  }, [network]);

  return (
    <If condition={isVisible}>
      <AlertLocationRefused />
      <Container>
        <VersionText>VERSÃO: {appVersion}</VersionText>
        <AnimatedLottieView
          autoPlay
          loop
          duration={3000}
          style={{
            width: RFValue(290),
            height: RFValue(290),
          }}
          resizeMode="contain"
          source={require('../../../../client/assets/animation/animationSplashDriver.json')}
        />
      </Container>
    </If>
  );
};

export default AnimatedSplashScreen;
