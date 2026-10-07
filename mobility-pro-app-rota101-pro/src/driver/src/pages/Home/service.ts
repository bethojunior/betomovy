import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {soundCall} from '../../../../constantBuild/config';
import apiMainDriver from '../../api/apiMain';
import {NativeModules, Platform} from 'react-native';
import {transformColorInHex} from '../../utils/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadSession} from '~/utils/Storage/sessionStorage';
import {bubbleValidateConfig, showBubbleMessage} from '~/utils/bubble';

const {showBubble} = useBubbleButton();

const fieldByEnabled = (cityConfig, field) => {
  return cityConfig?.enabledDriverFields?.accept[field] === true || false;
};

const getStorage = async () => {
  const generalSettings =
    JSON.parse(await AsyncStorage.getItem('generalSettings')) || [];
  const url = `${
    generalSettings?.find(setting => setting?.key === 'link_storage_pictures')
      ?.value || 0
  }`;
  return url;
};

export const bubble = async (
  driverId: string,
  theme,
  configLiquid: string = '0',
  configBoxPrice: string = '0',
  configSocket = false,
  cityConfig,
) => {
  if (Platform.OS === 'ios') return;

  const configViewModal = {
    enablePrice: fieldByEnabled(cityConfig, 'price'),
    enablePayment: fieldByEnabled(cityConfig, 'paymentForm'),
    enableRating: fieldByEnabled(cityConfig, 'quantityTripsCustomer'),
    enableOrigin: fieldByEnabled(cityConfig, 'origin'),
    enableDestination: fieldByEnabled(cityConfig, 'destination'),
    enableEstimativeDriverClient: fieldByEnabled(
      cityConfig,
      'estimatedDistance',
    ),
    enableDistanceDriverClient: fieldByEnabled(cityConfig, 'destination'),
    enableQuanityClientTrip: fieldByEnabled(
      cityConfig,
      'quantityTripsCustomer',
    ),
  };
  const generalConfig = await AsyncStorage.getItem('generalSettings');

  const generalSettings = JSON.parse(generalConfig) || [];
  const songAlias = generalSettings?.find(
    item => item?.key === 'soundCallTrip',
  )?.value;
  const linkStorage = await getStorage();
  const session = await loadSession();

  if (!session?.token && !session?.user) return;

  const user = session?.user ? JSON.parse(session.user) : null;

  const validation = bubbleValidateConfig({
    driverId,
    session,
    theme,
    cityConfig,
    apiBaseUrl: apiMainDriver.defaults.baseURL,
  });

  if (!validation.valid) {
    console.warn('[Bubble] Configuração incompleta:', validation.missing);

    return showBubbleMessage(
      'O serviço de notificação de viagem não pôde ser iniciado.',
      'Aviso',
    );
  }

  const configGeneralsWithTypeMoney = Object.values(
    [
      ...generalSettings,
      ...(cityConfig?.typeMoney
        ? [
            {
              key: 'typeMoney',
              value: cityConfig.typeMoney,
            },
          ]
        : []),
    ].reduce((acc, cur) => ({ ...acc, [cur.key]: cur }), {} as Record<string, { key: string; value: string }>)
  );

  await showBubble({
    driverId: String(driverId),
    connection: {
      apiAcceptTripPath: 'Driver/AcceptTrip',
      apiBaseUrl: apiMainDriver.defaults.baseURL,
      apiGetTripPath: 'Driver/searchTrip',
      apiRejectTripPath: 'driver/refuseTrip',
      apiTokenAuthorization: session.token,
      enableFirestore:  configSocket ? false : true,
      enableSocket: configSocket,
      configIsLiquid: configLiquid || '0',
      configIsBoxPrice: configBoxPrice || '1',
      enablePrice: configViewModal?.enablePrice,
      enablePayment: configViewModal?.enablePayment,
      enableRating: configViewModal?.enableRating,
      enableOrigin: configViewModal?.enableOrigin,
      enableDestination: configViewModal?.enableDestination,
      enableEstimativeDriverClient:
        configViewModal?.enableEstimativeDriverClient,
      enableDistanceDriverClient: configViewModal?.enableDistanceDriverClient,
      enableQuanityClientTrip: configViewModal?.enableQuanityClientTrip,
      configGenerals: configGeneralsWithTypeMoney as any[],
    },
    popup: {
      urlUserPhoto: linkStorage + 'customer/profile/compressed/',
      primaryColor: transformColorInHex(theme.colors.primary),
      backgroundColor: transformColorInHex(theme.colors.background_global),
      buttonTextColor: transformColorInHex(theme.colors.primaryText),
      textColor: transformColorInHex(theme.colors.secondary),
      sound: songAlias || soundCall,
      showOnlyInBackground: true,
    },
    userId: String(user.idUser),
    bubble: {
      bubbleSize: 56,
      trashIconSize: 0,
      moveToWall: true,
      rounded: true,
    },
  });
};

export const BubbleModulesLocation = {
  startLocation: async (
    eventName: string,
    data: string,
    interval: number,
    fastestInterval: number,
    meters: number | null = null,
    useHaversine: boolean | null = null,
  ) => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    await BubbleButton.startLocationService(
      eventName,
      data,
      interval,
      fastestInterval,
      meters,
      useHaversine,
    );
  },

  connectSocket: async (socketUrl: string) => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    await BubbleButton.connectSocket(socketUrl);
  },

  disconnectSocket: async () => {
    if (Platform.OS === 'ios') return;
    const {BubbleButton} = NativeModules;
    await BubbleButton.disconnectSocket();
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
