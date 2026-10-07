import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack';
import { TripProvider } from '../contexts/Trip';
import Home from '../modules/mobility/pages/Home';
import Trip from '../pages/Trip';
import TripChat from '../pages/TripChat';
import TripSpeedMob from '../pages/Trip/SpeedMob';

const { Navigator, Screen } = createStackNavigator();

function TripRoutes() {
  return (
    <TripProvider>
      <Navigator screenOptions={{ gestureEnabled: false }}>
        <Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Screen name="Trip" component={Trip} options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }} />
        <Screen
          name="TripChat"
          component={TripChat}
          options={{
            headerShown: false,
          }}
        />

        <Screen
          name="TripSpeedMob"
          component={TripSpeedMob}
          options={{ headerShown: false }}
        />
      </Navigator>
    </TripProvider>
  );
}

export default TripRoutes;
