import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useTheme } from 'styled-components/native';
import Profile from '../pages/Profile';
import AnimatedSplashScreen from '../pages/AnimatedSplashScreen';
import { DocumentList } from '../pages/DocumentList';
import { StatusPending } from '../pages/StatusPending';
import NotificationButton from '../../../client/components/NotificationButton';
import ScheduleAccepted from '../pages/ScheduleAccepted';
import ScheduleAvailable from '../pages/ScheduleAvailable';
import Vehicle from '../pages/Vehicle';
import { DocumentSend } from '../pages/DocumentSend';
import TripStatusProvider from '../context/TripStatus';
import { Account } from '../pages/Account';
import { BankAccount } from '../pages/BankAccount';
import { translate } from '../../../client/locales';
import { StationPointReturn } from '../pages/StationPointReturn';
import TripChat from '../pages/TripChat';
import { Extract } from '../pages/Extract';
import MyTrips from '../pages/MyTrips';
import { DetailsTrip } from '../pages/DetailsTrip';
import { TripCalculationDetails } from '../pages/TripCalculationDetails';
import { ListIndicator } from '../pages/ListIndicator';
import ZoneDynamic from '../pages/ZoneDynamic';
import { Prepaid } from '../pages/Prepaid';
import { ListClient } from '../pages/ListClient';
import { Routes } from '../pages/Routes';
import { Languages } from '../pages/Languages';
import { Config } from '../pages/Config';
import { PaymentOptionsPrepaid } from '../pages/PaymentOptionsPrepaid';
import Publicity from '../pages/Publicity';
import { Home } from '../pages/Home';
import { BackgroundLocationPermission } from '../pages/BackgroundLocationPermission';
import { OverlayPermission } from '../pages/OverlayPermission';
import TripsOffer from '../pages/TripsOffer';
import TempoAoVolante from '../pages/TempoAoVolante';

import MenuSpeedMob from '../pages/Menu/SpeedMob';
import ListClientSpeedMob from '../pages/ListClient/SpeedMob';
import MyTripsSpeedMob from '../pages/MyTrips/SpeedMob';
import ZoneDynamicSpeedMob from '../pages/ZoneDynamic/SpeedMob';
import NotificationUser from '../pages/SpeedMob/NotificationUser';
import ProfileSpeedMob from '../pages/Profile/SpeedMob';
import VehicleSpeedMob from '../pages/Vehicle/SpeedMob';
import { ConfigSpeedMob } from '../pages/Config/SpeedMob';
import EditProfileSpeedMob from '../pages/SpeedMob/EditProfile';
import AccountSpeedMob from '../pages/Account/SpeedMob';
import { ExtractSpeedMob } from '../pages/Extract/SpeedMob';
import { StationPointReturnSpeedMob } from '../pages/StationPointReturn/SpeedMob';
import { DetailsTripSpeedMob } from '../pages/DetailsTrip/SpeedMob';
import { ButtonTestPanic } from '../pages/ButtonTestPanic';
import OrderMessageOptionDelivery from '../components/OrderMessageOptionDelivery';
import OrderChat from '../components/OrderChat';
import { ListDelivery } from '../pages/ListDelivery';
import { QRCodeFiscalizacao } from '../pages/QRCodeFiscalizacao';
import { FinishTripResume } from '../pages/FinishTripResume';
import { DevMenu } from '../pages/DevMenu';
import { FinishTripProvider } from '../context/FinishTrip';
import { FinishTripAvaliation } from '../pages/FinishTripAvaliation';
import { RouteTraveledProvider } from '../context/RouteTraveled';

const { Navigator, Screen } = createStackNavigator();

export function AppRoutes() {
  const { colors } = useTheme();
  return (
    <TripStatusProvider>
      <RouteTraveledProvider>
        <FinishTripProvider>
          <Navigator
            initialRouteName="AnimatedSplashScreen"
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              headerStyle: { backgroundColor: colors.background_global },
              headerTintColor: colors.secondary,
              headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerRightContainerStyle: { paddingRight: 10 },
              headerLeftContainerStyle: { paddingLeft: 10 },
              headerRight: () => {
                return <NotificationButton />;
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
              name="BackgroundLocationPermission"
              component={BackgroundLocationPermission}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Screen
              name="OverlayPermission"
              component={OverlayPermission}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Screen
              name="MenuSpeedMob"
              component={MenuSpeedMob}
              options={{
                headerShown: false,
                title: '',
              }}
            />

            {/* nome da rota mantido por compatibilidade com StatusPending e outras telas que
                navegam pra 'DocumentPending' — o componente foi renomeado pra DocumentList
                porque agora lista todos os documentos, não só os pendentes. */}
            <Screen
              name="DocumentPending"
              component={DocumentList}
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
                headerTitle: translate('driver_wallet.route_title'),
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
              name="BankAccount"
              component={BankAccount}
              options={{
                headerShown: false,
                presentation: 'modal',
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
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
              name="TripCalculationDetails"
              component={TripCalculationDetails}
              options={{
                headerShown: false,
                presentation: 'modal',
                gestureDirection: 'vertical',
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
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

            {__DEV__ && (
              <Screen
                name="DevMenu"
                component={DevMenu}
                options={{
                  headerTitle: 'Desenvolvedor',
                  headerBackTitleVisible: false,
                  headerRight: null,
                }}
              />
            )}

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
                headerTitle: translate('routes.list_delivery'),
                headerBackTitleVisible: false,
              }}
            />
            <Screen
              name="TempoAoVolante"
              component={TempoAoVolante}
              options={{
                headerShown: false,
              }}
            />
            <Screen
              name="QRCodeFiscalizacao"
              component={QRCodeFiscalizacao}
              options={{
                headerShown: true,
                headerTitle: translate('audit.title') || 'QR Code Fiscalização',
                headerBackTitleVisible: false,
              }}
            />
            <Screen
              name="FinishTripResume"
              component={FinishTripResume}
              options={{
                headerTitle: translate('finishTrip.title_resume'),
                headerLeft: null,
                headerRight: null,
              }}
            />
            <Screen
              name="FinishTripAvaliation"
              component={FinishTripAvaliation}
              options={{
                headerShown: false,
                presentation: 'modal',
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                transitionSpec: {
                  open: {
                    animation: 'timing',
                    config: { duration: 400 },
                  },
                  close: {
                    animation: 'timing',
                    config: { duration: 400 },
                  },
                },
              }}
            />
          </Navigator>
        </FinishTripProvider>
      </RouteTraveledProvider>
    </TripStatusProvider>
  );
}
