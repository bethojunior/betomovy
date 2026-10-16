import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { TripProvider } from '../contexts/Trip';
import { TabBarProvider, useTabBarMobility } from '../contexts/tabBar';
import BottomTabBar from '../components/BottomTabBar';
import { TabType } from '../components/BottomTabBar/types';
import { getModuleIcon } from '../components/BottomTabBar/moduleIcons';
import { useFooterModuleShortcut } from '../hooks/useFooterModuleShortcut';
import { MODULE_NAME_TO_TRIP_SCREEN, resolveModuleScreen } from '../utils/moduleNavigation';
import Home from '../modules/mobility/pages/Home';
import Trip from '../pages/Trip';
import TripChat from '../pages/TripChat';
import TripSpeedMob from '../pages/Trip/SpeedMob';
import TripView from '../pages/Trip/tripView';
import TripChatView from '../pages/TripChat/tripChatView';
import SharedTrips from '../pages/SharedTrips';
import SharedTripsChat from '../pages/SharedTripsChat';
import Freight from '../pages/Freight';
import AppPermissions from '../pages/AppPermissions';
import SuggestionTrips from '../pages/SuggestionTrips';
import { TripPixPayment } from '../pages/TripPixPayment';
import { MyTravels } from '../pages/MyTravels';
import Profile from '../pages/Profile';
import NotificationButton from '../components/NotificationButton';
import { translate } from '../locales';
import theme from '../styles/theme';

const { Navigator, Screen } = createStackNavigator();

const StackContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

const FOOTER_SCREENS = ['Home', 'MyTravels', 'Profile', 'SharedTrips', 'Freight'];

const TAB_TO_SCREEN: Record<TabType, string> = {
  inicio: 'Home',
  viagens: 'MyTravels',
  perfil: 'Profile',
};

const SCREEN_TO_TAB: Record<string, TabType> = {
  Home: 'inicio',
  MyTravels: 'viagens',
  Profile: 'perfil',
};

interface TripRoutesParams {
  initialRoute?: string;
}

interface TripRoutesProps {
  route?: { params?: TripRoutesParams };
}

function TripStack({ initialRouteName }: { initialRouteName: string }) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { activeTab, setActiveTab } = useTabBarMobility();
  const [currentScreenName, setCurrentScreenName] = useState(initialRouteName);
  const moduleShortcut = useFooterModuleShortcut();

  return (
    <StackContainer>
      <Navigator
        initialRouteName={initialRouteName}
        screenListeners={({ route }) => ({
          focus: () => {
            setCurrentScreenName(route.name);
            if (SCREEN_TO_TAB[route.name]) setActiveTab(SCREEN_TO_TAB[route.name]);
          },
        })}
        screenOptions={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: { backgroundColor: theme.colors.background_global },
          headerTintColor: theme.colors.secondary,
          headerTitleAlign: 'center',
          headerTitleAllowFontScaling: false,
          headerBackTitleVisible: false,
          headerRightContainerStyle: { paddingRight: Platform.OS === 'ios' ? 10 : 0 },
          headerLeftContainerStyle: { paddingLeft: Platform.OS === 'ios' ? 10 : 0 },
          headerShown: false,
        }}
      >
        <Screen name="AppPermissions" component={AppPermissions} />
        <Screen name="Home" component={Home} />
        <Screen name="Trip" component={Trip} />
        <Screen name="TripView" component={TripView} />
        <Screen name="TripChat" component={TripChat} />
        <Screen name="TripChatView" component={TripChatView} />
        <Screen name="TripSpeedMob" component={TripSpeedMob} />
        <Screen name="SharedTrips" component={SharedTrips} />
        <Screen name="SharedTripsChat" component={SharedTripsChat} />
        <Screen name="Freight" component={Freight} />
        <Screen name="SuggestionTrips" component={SuggestionTrips} />
        <Screen
          name="TripPixPayment"
          component={TripPixPayment}
          options={{
            title: translate('paymentPage.pix_payment_title'),
            headerShown: true,
          }}
        />
        <Screen
          name="MyTravels"
          component={MyTravels}
          options={{
            headerShown: true,
            title: translate('appRoutes.title_my_travels'),
          }}
        />
        <Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: true,
            title: translate('profile.text_title_perfil'),
            headerRight: () => <NotificationButton />,
          }}
        />
      </Navigator>

      {FOOTER_SCREENS.includes(currentScreenName) && (
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            const targetScreen = TAB_TO_SCREEN[tab];
            if (targetScreen && targetScreen !== currentScreenName) {
              navigation.navigate('TripRoutes', { screen: targetScreen });
            }
          }}
          moduleShortcut={
            moduleShortcut && {
              label: moduleShortcut.moduleName,
              icon: getModuleIcon(moduleShortcut.moduleName),
              isActive: resolveModuleScreen(moduleShortcut.moduleName) === currentScreenName,
              onPress: () => {
                const targetScreen = resolveModuleScreen(moduleShortcut.moduleName);
                if (targetScreen === currentScreenName) return;

                if (MODULE_NAME_TO_TRIP_SCREEN[moduleShortcut.moduleName]) {
                  navigation.navigate('TripRoutes', { screen: targetScreen });
                } else {
                  navigation.navigate(targetScreen);
                }
              },
            }
          }
        />
      )}
    </StackContainer>
  );
}

function TripRoutes({ route }: TripRoutesProps) {
  const initialRouteName = route?.params?.initialRoute ?? 'Home';

  return (
    <TabBarProvider>
      <TripProvider>
        <TripStack initialRouteName={initialRouteName} />
      </TripProvider>
    </TabBarProvider>
  );
}

export default TripRoutes;
