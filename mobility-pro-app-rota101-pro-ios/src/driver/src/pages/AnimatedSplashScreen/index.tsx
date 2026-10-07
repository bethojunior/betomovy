import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Container} from './styles';

import AnimatedLottieView from 'lottie-react-native';
import {useUserDriver} from '../../context/userDriver';
import {If} from '../../components/If';
import {RFValue} from 'react-native-responsive-fontsize';
import {useAuth} from '../../../../context/auth';
import {useLocal} from '../../hooks/location';
import {useLocalProvider} from '../../context/local';

const AnimatedSplashScreen = () => {
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const [isVisible, setisVisible] = useState(true);
  const {location} = useLocalProvider();
  const {userDriverFind} = useUserDriver();
  const {cityConfig} = useAuth();
  const [firstLoading, setFirstLoading] = useState(false);

  useEffect(() => {
    if (
      !firstLoading &&
      userDriverFind &&
      Object.keys(userDriverFind).length > 0 &&
      cityConfig &&
      Object.keys(cityConfig).length > 0 &&
      location?.coords?.latitude
    ) {
      setFirstLoading(true);
      navigate('Home');
      setisVisible(false);
    }
  }, [userDriverFind, cityConfig, location]);

  return (
    <If condition={isVisible}>
      <Container>
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
