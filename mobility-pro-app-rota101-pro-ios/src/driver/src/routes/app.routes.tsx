import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useTheme} from 'styled-components';
import Profile from '../pages/Profile';
import {LocalizationProvider} from '../../contexts/Localization';
import {TripProvider} from '../context/Trip/index';
import AnimatedSplashScreen from '../pages/AnimatedSplashScreen';
import {DocumentPending} from '../pages/DocumentPending';
import {StatusPending} from '../pages/StatusPending';
import NotificationButton from '../../../client/components/NotificationButton';
import ScheduleAccepted from '../pages/ScheduleAccepted';
import ScheduleAvailable from '../pages/ScheduleAvailable';
import Vehicle from '../pages/Vehicle';
import {DocumentSend} from '../pages/DocumentSend';
import TripStatusProvider from '../context/TripStatus';
import {Account} from '../pages/Account';
import {translate} from '../../../client/locales';
import {StationPointReturn} from '../pages/StationPointReturn';
import TripChat from '../pages/TripChat';
import {Extract} from '../pages/Extract';
import MyTrips from '../pages/MyTrips';
import {DetailsTrip} from '../pages/DetailsTrip';
import {ListIndicator} from '../pages/ListIndicator';
import ZoneDynamic from '../pages/ZoneDynamic';
import {Prepaid} from '../pages/Prepaid';
import {ListClient} from '../pages/ListClient';
import {Routes} from '../pages/Routes';
import {Languages} from '../pages/Languages';
import {Config} from '../pages/Config';
import {PaymentOptionsPrepaid} from '../pages/PaymentOptionsPrepaid';
import Publicity from '../pages/Publicity';
import {Home} from '../pages/Home';
import TripsOffer from '../pages/TripsOffer';

import MenuSpeedMob from '../pages/Menu/SpeedMob';
import ListClientSpeedMob from '../pages/ListClient/SpeedMob';
import MyTripsSpeedMob from '../pages/MyTrips/SpeedMob';
import ZoneDynamicSpeedMob from '../pages/ZoneDynamic/SpeedMob';
import NotificationUser from '../pages/SpeedMob/NotificationUser';
import ProfileSpeedMob from '../pages/Profile/SpeedMob';
import VehicleSpeedMob from '../pages/Vehicle/SpeedMob';
import {ConfigSpeedMob} from '../pages/Config/SpeedMob';
import EditProfileSpeedMob from '../pages/SpeedMob/EditProfile';
import AccountSpeedMob from '../pages/Account/SpeedMob';
import {ExtractSpeedMob} from '../pages/Extract/SpeedMob';
import {StationPointReturnSpeedMob} from '../pages/StationPointReturn/SpeedMob';
import {DetailsTripSpeedMob} from '../pages/DetailsTrip/SpeedMob';
import {ButtonTestPanic} from '../pages/ButtonTestPanic';
import OrderMessageOptionDelivery from '../components/OrderMessageOptionDelivery';
import OrderChat from '../components/OrderChat';
import {ListDelivery} from '../pages/ListDelivery';

const {Navigator, Screen} = createStackNavigator();

export function AppRoutes() {
  const {colors} = useTheme();
  return (
    <TripProvider>
      <TripStatusProvider>
        <Navigator
          initialRouteName="AnimatedSplashScreen"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {backgroundColor: colors.background_global},
            headerTintColor: colors.secondary,
            headerTitleStyle: {fontSize: 18},
            headerTitleAlign: 'center',
            headerRightContainerStyle: {padding: 10},
            headerRight: () => {
              return <NotificationButton marginR={10} />;
            },
          }}
        >
          <Screen
            name="AnimatedSplashScreen"
            component={AnimatedSplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
            listeners={() => ({
              beforeRemove: (e: any) => {
                return e.preventDefault();
              },
            })}
          />
          <Screen
            name="MenuSpeedMob"
            component={MenuSpeedMob}
            options={{
              headerShown: false,
              title: '',
            }}
          />

          <Screen
            name="DocumentPending"
            component={DocumentPending}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="DocumentSend"
            component={DocumentSend}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="Publicity"
            component={Publicity}
            options={{
              title: '',
            }}
          />
          <Screen
            name="StatusPending"
            component={StatusPending}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Screen
            name="Vehicle"
            component={Vehicle}
            options={{
              headerShown: true,
              headerTitle: translate('routes.Vehicles'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="VehicleSpeedMob"
            component={VehicleSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="ScheduleAccepted"
            component={ScheduleAccepted}
            options={{
              headerShown: true,
              headerTitle: translate('routes.my_travels'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="tripsOffer"
            component={TripsOffer}
            options={{
              headerShown: true,
              headerTitle: translate('routes.my_travels'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="ScheduleAvailable"
            component={ScheduleAvailable}
            options={{
              headerShown: true,
              headerTitle: translate('routes.trips_available'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name={'StationPointReturn'}
            component={StationPointReturn}
            options={{
              headerShown: true,
              headerTitle: translate('routes.return_point'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name={'StationPointReturnSpeedMob'}
            component={StationPointReturnSpeedMob}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="TripChatDriver"
            component={TripChat}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="OrderMessageOption"
            component={OrderMessageOptionDelivery}
            options={{
              title: translate('appRoutes.title_chats'),
            }}
          />
          <Screen
            name="OrderChat"
            component={OrderChat}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="Profile"
            component={Profile}
            options={{
              headerShown: true,
              headerTitle: translate('menu.text_edit_profile'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="ProfileSpeedMob"
            component={ProfileSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="EditProfileSpeedMob"
            component={EditProfileSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="Account"
            component={Account}
            options={{
              headerShown: true,
              headerTitle: translate('routes.account'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="AccountSpeedMob"
            component={AccountSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="Extract"
            component={Extract}
            options={{
              headerShown: true,
              headerTitle: translate('routes.extract'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="ExtractSpeedMob"
            component={ExtractSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="MyTrips"
            component={MyTrips}
            options={{
              headerShown: true,
              headerTitle: translate('routes.my_travels'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="MyTripsSpeedMob"
            component={MyTripsSpeedMob}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="DetailsTrip"
            component={DetailsTrip}
            options={{
              headerShown: true,
              headerTitle: translate('routes.detail_travel'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="DetailsTripSpeedmob"
            component={DetailsTripSpeedMob}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="ListIndicator"
            component={ListIndicator}
            options={{
              headerShown: true,
              headerTitle: translate('routes.my_incator'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="ZoneDynamic"
            component={ZoneDynamic}
            options={{
              headerShown: true,
              headerTitle: translate('routes.zoneDynamic'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="ZoneDynamicSpeedMob"
            component={ZoneDynamicSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="Prepaid"
            component={Prepaid}
            options={{
              headerShown: true,
              headerTitle: translate('routes.purchase_your_tickets'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="ListClient"
            component={ListClient}
            options={{
              headerShown: true,
              headerTitle: translate('routes.list_client'),
              headerBackTitleVisible: false,
            }}
          />

          <Screen
            name="ListClientSpeedMob"
            component={ListClientSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="Routes"
            component={Routes}
            options={{
              headerShown: true,
              headerTitle: translate('menu.text_routes'),
            }}
          />
          <Screen
            name="Languages"
            component={Languages}
            options={{
              headerShown: true,
              headerTitle: translate('routes.languages'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="Config"
            component={Config}
            options={{
              headerShown: true,
              headerTitle: translate('menu.text_config'),
            }}
          />

          <Screen
            name="ConfigSpeedMob"
            component={ConfigSpeedMob}
            options={{
              headerShown: false,
            }}
          />

          <Screen
            name="PaymentOptionsPrepaid"
            component={PaymentOptionsPrepaid}
            options={{
              headerShown: true,
              headerTitle: translate('routes.buy_prepaid'),
              headerBackTitleVisible: false,
            }}
          />
          <Screen
            name="NotificationUserSpeedMob"
            component={NotificationUser}
            options={{
              headerShown: false,
            }}
          />
          <Screen
            name="ButtonTestPanic"
            component={ButtonTestPanic}
            options={{
              headerShown: true,
              headerTitle: 'Botão de teste de pânico',
            }}
          />
          <Screen
            name="ListDelivery"
            component={ListDelivery}
            options={{
              headerShown: true,
              headerTitle: 'Lista de entregas',
            }}
          />
        </Navigator>
      </TripStatusProvider>
    </TripProvider>
  );
}
