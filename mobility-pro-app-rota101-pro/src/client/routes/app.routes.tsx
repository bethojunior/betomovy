// @ts-nocheck

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Icon from '@expo/vector-icons/FontAwesome5';
import { useState } from 'react';
import TabRoutes from './tab.routes';
import BagDetail from '../modules/delivery/pages/BagDetail';
import Local from '../pages/Local';
import LocalMap from '../pages/LocalMap';
import AddAddressMap from '../pages/AddAddressMap';
import RestaurantDeliverySchedule from '../modules/delivery/pages/RestaurantDeliverySchedule';
import RestaurantDeliveryLocations from '../modules/delivery/pages/RestaurantDeliveryLocations';
import Search from '../pages/Search';
import ItemDetail from '../modules/delivery/pages/ItemDetail';
import PaymentForm from '../pages/PaymentForm';
import AddPlaymentForm from '../pages/AddPaymentForm';
import TrackOrder from '../modules/delivery/pages/TrackOrder';
import MyProfile from '../pages/MyProfile';
import OrderChat from '../pages/OrderChat';
import ListCreditCard from '../pages/ListCreditCard';
import Coupons from '../pages/Coupons';
import CouponCompany from '../pages/CouponCompany';
import SearchLocal from '../pages/SearchLocal';
import OrderMessageOption from '../pages/OrderMessageOption';
import Publicity from '../pages/Publicity';
import Favorites from '../modules/GetLight/pages/Favorites';
import PaymentPage from '../pages/Payment';
import IndicationPage from '../pages/Indication';

import { translate } from '../locales';
import { GetLightApp } from './getLightRoute';
import { MyTravels } from '../pages/MyTravels';
import { AppProvider } from '../providers/appProvider';
import { Languages } from '../pages/Languages';
import NotificationButton from '../components/NotificationButton';
import theme from '../styles/theme';
import { useModules } from '../contexts/modules';
import TripRoutes from './trip.routes';
import { DetailsTrip } from '../pages/DetailsTrip';
import { ContactUs } from '../pages/ContactUs';
import { Transfer } from '../pages/Transfer';
import Profile from '../pages/Profile';
import ProfileSpeedMob from '../pages/Profile/SpeedMob';
import NotificationUser from '../pages/SpeedMob/NotificationsUser';
import ContactUsSpeedMob from '../pages/ContactUs/SpeedMob';
import FavoritesSpeedMob from '../modules/GetLight/pages/Favorites/SpeedMob';
import MyProfileSpeedMob from '../pages/MyProfile/SpeedMob';
import MyTravelsSpeedMob from '../pages/MyTravels/SpeedMob';
import DetailsTripSpeedMob from '../pages/DetailsTrip/SpeedMob';
import PaymentPageSpeedMob from '../pages/Payment/SpeedMob';
import SharedTrips from '../pages/SharedTrips';
import { DevMenu } from '../pages/DevMenu';
import { VoucherPayment } from '../pages/VoucherPayment';
import CouponsMobility from '../pages/CouponsMobility';
import { TermsOfUse } from '../pages/TermsOfUse';

const { Navigator, Screen } = createStackNavigator();

interface AppRoutesProps {
  initialRoute?: string;
}

export function AppRoutes({ initialRoute }: AppRoutesProps = {}) {
  const { init } = useModules();
  const [showHome, setShowHome] = useState(true);

  return (
    <AppProvider>
      <Navigator
        initialRouteName={init === 'Mobilidade' ? 'TripRoutes' : init}
        screenOptions={{
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerStyle: { backgroundColor: theme.colors.background_global },
          headerTintColor: theme.colors.secondary,
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
          name="TripRoutes"
          component={TripRoutes}
          initialParams={{ initialRoute }}
          options={{
            headerShown: false,
            headerTitle: '',
            headerLeft: () => {
              return (
                <Icon
                  color={theme.colors.secondary}
                  style={{ padding: 15 }}
                  name={showHome ? 'user' : 'arrow-left'}
                  size={20}
                  onPress={() => {
                    setShowHome(!showHome);
                  }}
                />
              );
            },
          }}
        />
        <Screen
          name="GetLight"
          component={GetLightApp}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="Delivery"
          component={TabRoutes}
          options={{
            headerShown: false,
            headerTitle: 'Delivery',
          }}
        />
        <Screen
          name="BagDetail"
          component={BagDetail}
          options={{
            headerShown: true,
            title: translate('appRoutes.title_bag'),
          }}
        />
        <Screen
          name="Profile"
          component={Profile}
          options={{
            title: translate('profile.text_title_perfil'),
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
          name="NotificationUserSpeedMob"
          component={NotificationUser}
          options={{
            headerShown: false,
          }}
        />

        <Screen
          name="Local"
          component={Local}
          options={{
            title: translate('profile.text_title_adresses'),
          }}
        />
        <Screen
          name="LocalMap"
          component={LocalMap}
          options={{ headerShown: true }}
        />
        <Screen
          name="AddAddressMap"
          component={AddAddressMap}
          options={{
            headerShown: true,
            headerTitle: translate('appRoutes.title_add_address'),
          }}
        />
        <Screen
          name="RestaurantDeliverySchedule"
          component={RestaurantDeliverySchedule}
          options={{
            title: translate('appRoutes.title_working_days'),
            headerShown: true,
          }}
        />
        <Screen
          name="RestaurantDeliveryLocations"
          component={RestaurantDeliveryLocations}
          options={{
            title: translate('appRoutes.title_delivery_locations'),
            headerShown: true,
          }}
        />
        <Screen
          name="Search"
          component={Search}
          options={{
            headerShown: true,
          }}
        />
        <Screen
          name="ItemDetail"
          component={ItemDetail}
          options={{
            title: translate('appRoutes.title_item_details'),
          }}
        />
        <Screen
          name="PaymentForm"
          component={PaymentForm}
          options={{
            title: translate('appRoutes.title_payment_methods'),
          }}
        />
        <Screen
          name="AddPlaymentForm"
          component={AddPlaymentForm}
          options={{
            title: translate('appRoutes.title_add_card'),
          }}
        />
        <Screen
          name="TrackOrder"
          component={TrackOrder}
          options={{
            headerShown: true,
            headerTitle: translate('appRoutes.title_order_details'),
          }}
        />
        <Screen
          name="MyProfile"
          component={MyProfile}
          options={{
            title: translate('profile.text_subtitle_edit_profile'),
            headerShown: true,
          }}
        />
        <Screen
          name="MyProfileSpeedMob"
          component={MyProfileSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="TermsOfUse"
          component={TermsOfUse}
          options={{
            headerShown: true,
            headerRight: null,
            title: translate('modalTerms.title'),
          }}
        />
        <Screen
          name="PaymentPage"
          component={PaymentPage}
          options={{
            title: translate('appRoutes.title_payment'),
            headerShown: true,
          }}
        />
        <Screen
          name="VoucherPayment"
          component={VoucherPayment}
          options={{
            title: translate('paymentPage.title_voucher_purchase'),
            headerRight: null,
          }}
        />
        <Screen
          name="CouponsMobility"
          component={CouponsMobility}
          options={{
            title: translate("paymentPage.title_cuopon"),
            headerRight: null,
          }}
        />
        <Screen
          name="PaymentPageSpeedMob"
          component={PaymentPageSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="Transfer"
          component={Transfer}
          options={{
            headerShown: true,
            title: translate('appRoutes.title_transfer'),
          }}
        />
        <Screen
          name="Favorites"
          component={Favorites}
          options={{
            title: translate('appRoutes.title_favorite_driver'),
            headerShown: true,
          }}
        />
        <Screen
          name="FavoritesSpeedMob"
          component={FavoritesSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="IndicationPage"
          component={IndicationPage}
          options={{
            title: translate('appRoutes.title_my_indications'),
            headerShown: true,
          }}
        />
        <Screen
          name="OrderChat"
          component={OrderChat}
          options={{
            headerShown: true,
          }}
        />
        <Screen
          name="OrderMessageOption"
          component={OrderMessageOption}
          options={{
            title: translate('appRoutes.title_chats'),
          }}
        />
        <Screen
          name="ListCreditCard"
          component={ListCreditCard}
          options={{
            title: translate('appRoutes.title_card_list'),
          }}
        />
        <Screen
          name="Coupons"
          component={Coupons}
          options={{
            title: translate('guestRoutes.title_coupons'),
          }}
        />
        <Screen
          name="CouponCompany"
          component={CouponCompany}
          options={{
            title: translate('appRoutes.title_coupons'),
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
          name="SearchLocal"
          component={SearchLocal}
          options={{ headerShown: false }}
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
          name="MyTravelsSpeedMob"
          component={MyTravelsSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="Languages"
          component={Languages}
          options={{ headerShown: true, title: translate('language.title') }}
        />
        <Screen
          name="DetailsTrip"
          component={DetailsTrip}
          options={{
            headerShown: true,
            title: translate('appRoutes.title_details_trip'),
          }}
        />
        <Screen
          name="DetailsTripSpeedMob"
          component={DetailsTripSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="ContactUs"
          component={ContactUs}
          // options={{
          //   headerShown: true,
          //   title: translate('appRoutes.title_contact_us'),
          // }}
          options={({ route }) => ({
            title:
              route?.params?.name || translate('appRoutes.title_contact_us'),
            headerShown: true,
          })}
        />
        <Screen
          name="ContactUsSpeedMob"
          component={ContactUsSpeedMob}
          options={{
            headerShown: false,
          }}
        />
        {/* nome da rota mantido por compatibilidade com MyProfile, CongratulationSignUp e
            useProfileCompletionGuard (todos navegam pra 'DocumentPending') — o componente foi
            renomeado pra DocumentList porque agora lista todos os documentos, não só pendentes. */}
        <Screen
          name="DocumentPending"
          component={require('../pages/DocumentList').DocumentList}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="DocumentSend"
          component={require('../pages/DocumentSend').DocumentSend}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name="SharedTrips"
          component={SharedTrips}
          options={{
            headerShown: false,
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
      </Navigator>
    </AppProvider>
  );
}
