import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
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
import CongratulationSignUp from '../pages/CongratulationSignUp';
import UserNumberPhone from '../pages/UserNumberPhone';
import VerificationOTP from '../pages/VerificationOTP';
import DataUserSignUp from '../pages/DataUserSignUp';
import SearchLocal from '../pages/SearchLocal';
import Login from '../pages/Login';
import RecoveryPassword from '../pages/RecoveryPassword';

import {translate} from '../locales';
import {GuestProvider} from '../providers/guest';

const {Navigator, Screen} = createStackNavigator();

const GuestRoutes = () => (
  <GuestProvider>
    <Navigator
      initialRouteName="Main"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerBackTitleVisible: false,
      }}
    >
      <Screen
        name="Main"
        component={TabRoutes}
        options={{headerShown: false}}
      />
      <Screen
        name="BagDetail"
        component={BagDetail}
        options={{
          title: translate('guestRoutes.title_bag'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="Local"
        component={Local}
        options={{
          title: translate('guestRoutes.title_delivery_address'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="LocalMap"
        component={LocalMap}
        options={{headerShown: false}}
      />
      <Screen
        name="AddAddressMap"
        component={AddAddressMap}
        options={{headerShown: false}}
      />
      <Screen
        name="RestaurantDeliverySchedule"
        component={RestaurantDeliverySchedule}
        options={{
          title: translate('guestRoutes.title_working_days'),
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="RestaurantDeliveryLocations"
        component={RestaurantDeliveryLocations}
        options={{
          title: translate('guestRoutes.title_delivery_locations'),
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: translate('guestRoutes.title_item_details'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="PaymentForm"
        component={PaymentForm}
        options={{
          title: translate('guestRoutes.title_payment_methods'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="AddPlaymentForm"
        component={AddPlaymentForm}
        options={{
          title: translate('guestRoutes.title_add_card'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="TrackOrder"
        component={TrackOrder}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          title: translate('guestRoutes.title_my_profile'),
          headerShown: true,
          headerTitleAlign: 'center',
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
        name="ListCreditCard"
        component={ListCreditCard}
        options={{
          title: translate('guestRoutes.title_card_list'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="Coupons"
        component={Coupons}
        options={{
          title: translate('guestRoutes.title_coupons'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="CouponCompany"
        component={CouponCompany}
        options={{
          title: translate('guestRoutes.title_coupons'),
          headerTitleAlign: 'center',
        }}
      />
      <Screen
        name="UserNumberPhone"
        component={UserNumberPhone}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="VerificationOTP"
        component={VerificationOTP}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="DataUserSignUp"
        component={DataUserSignUp}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="RecoveryPassword"
        component={RecoveryPassword}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="CongratulationSignUp"
        component={CongratulationSignUp}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SearchLocal"
        component={SearchLocal}
        options={{headerShown: false}}
      />
      <Screen name="Login" component={Login} options={{headerShown: false}} />
    </Navigator>
  </GuestProvider>
);

export default GuestRoutes;
