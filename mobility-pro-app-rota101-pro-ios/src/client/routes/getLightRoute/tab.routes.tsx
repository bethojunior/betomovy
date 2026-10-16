// @ts-nocheck

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {FontAwesome5, FontAwesome, Entypo} from '@expo/vector-icons';
import theme from '../../styles/theme';
import {Services} from '../../modules/GetLight/pages/Services';
import {translate} from '../../locales';
import {Favorites} from '../../modules/GetLight/pages/Favorites';
import TripGetLight from '../../modules/GetLight/pages/TripGetLight';
import Profile from '../../pages/Profile';

const {Navigator, Screen} = createBottomTabNavigator();

export const TabBarRoutesGetLight = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: theme.colors.background_global,
        },
      }}
    >
      <Screen
        name={translate('tab.home')}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Entypo
                name="home"
                size={24}
                color={focused ? theme.colors.primary : theme.colors.secondary}
              />
            );
          },
        }}
        component={TripGetLight}
      />
      <Screen
        name={translate('tab.services')}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome5
                name="toolbox"
                size={24}
                color={focused ? theme.colors.primary : theme.colors.secondary}
              />
            );
          },
        }}
        component={Services}
      />
      <Screen
        name={translate('tab.favorites')}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome
                name="star-o"
                size={24}
                color={focused ? theme.colors.primary : theme.colors.secondary}
              />
            );
          },
        }}
        component={Favorites}
      />
      <Screen
        name={'Perfil'}
        initialParams={{title: 'GetLight'}}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome
                name="user-o"
                size={24}
                color={focused ? theme.colors.primary : theme.colors.secondary}
              />
            );
          },
        }}
        component={Profile}
      />
    </Navigator>
  );
};

// Gambiarra aqui, mas funciona
export const InitialTabBarRoutesGetLight = () => {
  return (
    <Navigator
      initialRouteName={translate('tab.services')}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: theme.colors.background_global,
        },
      }}
    >
      <Screen
        name={translate('tab.home')}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <Entypo name="home" size={24} color={theme.colors.secondary} />
              );
            }
            return (
              <Entypo name="home" size={24} color={theme.colors.primary} />
            );
          },
        }}
        component={TripGetLight}
      />
      <Screen
        name={translate('tab.services')}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <FontAwesome5
                  name="toolbox"
                  size={24}
                  color={theme.colors.secondary}
                />
              );
            }
            return (
              <FontAwesome5
                name="toolbox"
                size={24}
                color={theme.colors.primary}
              />
            );
          },
        }}
        component={Services}
      />
      <Screen
        name={translate('tab.favorites')}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <FontAwesome
                  name="star-o"
                  size={24}
                  color={theme.colors.secondary}
                />
              );
            }
            return (
              <FontAwesome
                name="star-o"
                size={24}
                color={theme.colors.primary}
              />
            );
          },
        }}
        component={Favorites}
      />
      <Screen
        name={'Perfil'}
        initialParams={{title: 'GetLight'}}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused === false) {
              return (
                <FontAwesome
                  name="user-o"
                  size={24}
                  color={theme.colors.secondary}
                />
              );
            }
            return (
              <FontAwesome
                name="user-o"
                size={24}
                color={theme.colors.primary}
              />
            );
          },
        }}
        component={Profile}
      />
    </Navigator>
  );
};
