import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import I18n from 'i18n-js';
import SignIn from '../pages/SignIn';

import UserNumberPhone from '../pages/UserNumberPhone';
import VerificationOTP from '../pages/VerificationOTP';
import DataUserSignUp from '../pages/DataUserSignUp';
import RecoveryPassword from '../pages/RecoveryPassword';
import CongratulationSignUp from '../pages/CongratulationSignUp';
import Login from '../pages/Login';
import {useModules} from '../contexts/modules';
import {Register} from '../pages/Register';

import LoginSpeedmob from '../pages/Login/SpeedMob';
import RecoveryPasswordSpeedMob from '../pages/SpeedMob/RecoveryPasswordSpeedMob';
import TermsCheckSpeedMob from '../pages/SpeedMob/TermsCheckSpeedMob';
import {Languages} from '../pages/Languages';

import theme from '../styles/theme';

const {Navigator, Screen} = createStackNavigator();

const AuthRoutes = () => {
  const {init} = useModules();

  return (
    <Navigator
      initialRouteName={
        I18n.locale === 'language_not_found' ? 'LanguageClient' : 'SignIn'
      }
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* Tela Inicial de acordo com os modulos ativos */}
      <Screen name="LanguageClient" component={Languages} />
      <Screen
        name="SignIn"
        component={init === 'Delivery' ? SignIn : Login}
        initialParams={theme}
      />
      <Screen name="UserNumberPhone" component={UserNumberPhone} />
      <Screen name="VerificationOTP" component={VerificationOTP} />
      <Screen name="DataUserSignUp" component={DataUserSignUp} />
      <Screen name="RecoveryPassword" component={RecoveryPassword} />
      <Screen name="CongratulationSignUp" component={CongratulationSignUp} />
      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />

      {/* MÓDULO SPEEDMOB */}
      <Screen name="LoginSpeedMob" component={LoginSpeedmob} />
      <Screen name="TermsCheckSpeedMob" component={TermsCheckSpeedMob} />

      <Screen
        name="RecoveryPasswordSpeedMob"
        component={RecoveryPasswordSpeedMob}
      />
    </Navigator>
  );
};

export default AuthRoutes;
