/* eslint-disable default-case */
// @ts-nocheck
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar } from 'react-native-elements';
import HomeDelivery from '../modules/delivery/pages/Home';
import Profile from '../pages/Profile';
import Requests from '../modules/delivery/pages/Requests';
import { TabbarProvider, useTabbar } from '../contexts/tabBar/index.js';
import TabIconWithBadge from '../components/TabIconWithBadge';
import { useOrderService } from '../contexts/orderService';
import imageUser from '../assets/images/user.png';
import { translate } from '../locales';
import { useAuth } from '../../context/auth';
import theme from '../styles/theme';

const { Navigator, Screen } = createBottomTabNavigator();

function TabRoutes() {
  return (
    <>
      <TabbarProvider>
        <AppRoutes />
      </TabbarProvider>
    </>
  );
}

function AppRoutes() {
  const { ordersActive } = useOrderService();
  const { user } = useAuth();
  const { visible } = useTabbar();
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home': {
              iconName = 'home';
              break;
            }
            case 'Requests': {
              return (
                <TabIconWithBadge
                  name="list"
                  badgeCount={ordersActive.length}
                  color={color}
                  size={size}
                />
              );
            }
            case 'Profile': {
              return (
                <Avatar
                  rounded
                  source={
                    user != null ? { uri: user.profileImageLink } : imageUser
                  }
                  containerStyle={{
                    borderColor: color,
                    borderWidth: focused ? 2 : 0,
                  }}
                  size={size}
                />
              );
            }
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grayLight,
        tabBarStyle: {
          backgroundColor: theme.colors.background_global,
          display: visible ? 'flex' : 'none',
        },
      })}
    >
      <Screen
        name="Home"
        component={HomeDelivery}
        options={{
          title: translate('tabRoutes.title_home'),
          headerShown: false,
        }}
      />
      <Screen
        name="Requests"
        component={Requests}
        options={{ title: translate('tabRoutes.title_orders') }}
      />
      <Screen
        name="Profile"
        component={Profile}
        initialParams={{ title: 'Delivery' }}
      />
    </Navigator>
  );
}

export default TabRoutes;
