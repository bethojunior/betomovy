import {createStackNavigator} from '@react-navigation/stack';
import Home from '.';
import {TripProvider} from '../../../../contexts/Trip';
import Trip from '../../../../pages/Trip';
import TripChat from '../../../../pages/TripChat';

const {Navigator, Screen} = createStackNavigator();

function HomeRoutes() {
  return (
    <TripProvider>
      <Navigator>
        <Screen name="Home" component={Home} options={{headerShown: false}} />
        <Screen name="Trip" component={Trip} options={{headerShown: false}} />
        <Screen
          name="TripChat"
          component={TripChat}
          options={{headerShown: false}}
        />
      </Navigator>
    </TripProvider>
  );
}

export default HomeRoutes;
