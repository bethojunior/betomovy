import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {buildApp, soundCall} from '../../../../constantBuild/config';
import apiMainDriver from '../../api/apiMain';
import {NativeModules, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {transformColorInHex} from '../../utils/color';

const {showBubble} = useBubbleButton();

export const bubble = async (
  driverId: string,
  theme,
  configLiquid: string = '0',
  configBoxPrice: string = '0',
  configSocket = false,
) => {
  if (Platform.OS === 'ios') return;
  await showBubble({
    driverId: String(driverId),
    connection: {
      apiAcceptTripPath: 'Driver/AcceptTrip',
      apiBaseUrl: apiMainDriver.defaults.baseURL,
      apiGetTripPath: 'Driver/searchTrip',
      apiRejectTripPath: 'driver/refuseTrip',
      apiTokenAuthorization: apiMainDriver.defaults.headers.common.token,
      enableFirestore: configSocket ? false : true,
      enableSocket: configSocket,
      socketUrl: configSocket ? buildApp().HOST_SOCKET : '',
      configIsLiquid: configLiquid || '0',
      configIsBoxPrice: configBoxPrice || '1',
    },
    popup: {
      urlUserPhoto: buildApp().HOST_IMAGE_CUSTOMER,
      primaryColor: transformColorInHex(theme.colors.primary),
      backgroundColor: transformColorInHex(theme.colors.background_global),
      buttonTextColor: transformColorInHex(theme.colors.primaryText),
      textColor: transformColorInHex(theme.colors.secondary),
      sound: soundCall,
    },
    userId: String(apiMainDriver.defaults.headers.common.userid),
    bubble: {
      bubbleSize: RFValue(80),
      moveToWall: true,
      rounded: true,
    },
  });
};

export const BubbleModulesLocation = {
  startLocation: async (
    url,
    data,
    interval,
    fastestInterval,
    meters = null,
    useHaversine = null,
  ) => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    const {startLocationService} = BubbleButton;

    await startLocationService(
      url,
      data,
      interval,
      fastestInterval,
      meters,
      useHaversine,
    );
  },

  addListenerLocation: async () => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    const {addLocationListener} = BubbleButton;

    await addLocationListener();
  },

  stopLocation: async () => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    const {removeLocationListener} = BubbleButton;

    await removeLocationListener();
  },
};
