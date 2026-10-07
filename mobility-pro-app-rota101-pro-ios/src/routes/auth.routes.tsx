import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import UserNumberPhone from '../client/pages/UserNumberPhone';
import VerificationOTP from '../client/pages/VerificationOTP';
import DataUserSignUp from '../client/pages/DataUserSignUp';
import RecoveryPassword from '../client/pages/RecoveryPassword';
import CongratulationSignUp from '../client/pages/CongratulationSignUp';
import Login from '../client/pages/Login';
import {moduleHabilited} from '../client/constants/modulesActive';
import SignIn from '../client/pages/SignIn';

const {Navigator, Screen} = createStackNavigator();

const AuthRoutes = () => (
  <Navigator
    initialRouteName="SignIn"
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    {moduleHabilited === 'getLightApp' ? (
      <Screen name="SignIn" component={Login} />
    ) : (
      <Screen name="SignIn" component={SignIn} />
    )}

    <Screen name="UserNumberPhone" component={UserNumberPhone} />
    <Screen name="VerificationOTP" component={VerificationOTP} />
    <Screen name="DataUserSignUp" component={DataUserSignUp} />
    <Screen name="RecoveryPassword" component={RecoveryPassword} />
    <Screen name="CongratulationSignUp" component={CongratulationSignUp} />
    <Screen name="Login" component={Login} />
  </Navigator>
);

export default AuthRoutes;
