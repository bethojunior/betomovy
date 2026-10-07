import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {HomeGetLight} from '../../modules/GetLight/pages/SplashScreen';
import {MapCall} from '../../modules/GetLight/pages/MapCall';
import Trip from '../../modules/GetLight/pages/TripGetLight';
import {TripScheduleCurrent} from '../../modules/GetLight/pages/TripScheduleCurrent';
import TripChatGL from '../../modules/GetLight/pages/TripChatGL';
import {GetLightProvider} from '../../providers/getLight';
import {InitialTabBarRoutesGetLight, TabBarRoutesGetLight} from './tab.routes';
import theme from '../../styles/theme';

const {Navigator, Screen} = createStackNavigator();

export const AppRoutesGetLight = () => {
  return (
    <GetLightProvider>
      <Navigator
        initialRouteName="TabRoutesGetLight"
        screenOptions={{
          headerShown: false,
          headerTitle: '',
          headerBackTitleVisible: false,
          headerTintColor: theme.colors.secondary,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Screen name="TabRoutesGetLight" component={TabBarRoutesGetLight} />
        <Screen
          name="InitalServiceGetLight"
          component={InitialTabBarRoutesGetLight}
        />
        <Screen name="GetLightMap" component={MapCall} />
        <Screen name="GetLightTrip" component={Trip} />
        <Screen
          name="GetLightTripCurrent"
          component={TripScheduleCurrent}
          options={{
            headerShown: false,
            // FICARA TRUE SE TIVER MAIS DE UM MODULO.
          }}
        />
        <Screen name="TripChat" component={TripChatGL} />
      </Navigator>
    </GetLightProvider>
  );
};
