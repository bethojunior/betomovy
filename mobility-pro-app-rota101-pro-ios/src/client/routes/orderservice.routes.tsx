import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import ListRestaurant from '../modules/delivery/pages/ListRestaurants';
import Restaurant from '../modules/delivery/pages/Restaurant';
import {translate} from '../locales';
import Sections from '../pages/Sections';
import {useAuth} from '../../context/auth';
import theme from '../styles/theme';
import NotificationButton from '../components/NotificationButton';

const {Navigator, Screen} = createStackNavigator();

export default function OrderServiceRoutes() {
  const {singleDelivery} = useAuth();
  return (
    <Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerStyle: {
          backgroundColor: theme.colors.background_global,
          elevation: 5,
          shadowOpacity: 2,
          shadowRadius: 5,
          shadowColor: theme.colors.secondary,
        },
        headerTintColor: theme.colors.secondary,
        headerTitleStyle: {fontSize: theme.fontSizes.large},
        headerTitleAlign: 'center',
        headerRight: () => {
          return <NotificationButton marginR={10} />;
        },
      }}
      initialRouteName={singleDelivery ? 'Restaurant' : 'Sections'}
    >
      <Screen
        name="Sections"
        component={Sections}
        options={{
          title: translate('orderServiceRoutes.title_home'),
          headerShown: true,
        }}
      />
      <Screen
        name="ListRestaurantSection"
        component={ListRestaurant}
        options={{
          title: translate('appRoutes.title_list_restaurants'),
          headerShown: true,
        }}
      />
      <Screen
        name="Restaurant"
        component={Restaurant}
        options={({route}) => {
          return {
            title: route?.params?.restaurant?.fantasyName,
            headerShown: true,
          };
        }}
      />
    </Navigator>
  );
}
