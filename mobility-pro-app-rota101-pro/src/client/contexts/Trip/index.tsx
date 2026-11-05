import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { decode } from '@googlemaps/polyline-codec';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { appProccess, buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import { useSocket } from '../../../context/SocketIO';
import { customToast } from '../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import { CREDIT_CARD_APP, PAYMENT_CARD_DEBIT, PIX, PIX_WEB } from '../../constants/paymentFormType';
import {
  STATUS_ACCEPTED,
  STATUS_BACK_OFF,
  STATUS_BOARDING,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_NOT_ANSWERED,
  STATUS_PRE_ACCEPTED,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_SEARCHING_DRIVER_OFFER,
} from '../../constants/trip';
import { usePlaces } from '../../hooks/place';
import useTripRealtime from '../../hooks/tripRealtime';
import { usePix } from '../../hooks/usePix';
import { TripCallback } from '../../interfaces/tripRealtime';
import { translate } from '../../locales';
import TripRealtime from '../../services/realtime/TripRealtime';
import Helper from '../../utils/Helper';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { useLocal } from '../local';
import { deliveryService, offerService, TripService } from './services';
import { useUserDriver } from '../../../driver/src/context/userDriver';
import {
  AddressProps,
  ChangeRoutePreviewProps,
  DestinationProps,
  InitialStateProps,
  NewTripCacheData,
  SelectedCouponProps,
  SelectedOptionTravelProps,
  SelectedPaymentMethodProps,
  TripContextChildren,
  TripContextType,
  TripProps
} from './types';
import { TripFinishStatus } from '~/interfaces/trip';
const tripRealtime = TripRealtime.getInstance();

const TripContext = createContext<TripContextType>({} as TripContextType);

const normalizeString = (value?: string) =>
  value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';

const isGenderNotAllowedError = (message?: string) => {
  const normalized = normalizeString(message);
  if (!normalized) {
    return false;
  }

  return /genero\w*\s+nao\s*(e\s*)?permitido/.test(normalized);
};

const initialState: InitialStateProps = {
  origin: {} as AddressProps,
  lastOrigin: {},
  locale: {},
  destination: {} as DestinationProps,
  lastDestination: {},
  waypoints: [],
  waypointQuantities: 0,
  prices: [],
  polylineCoordinates: null,
  lastPolylineCoordinates: null,
  tripPaymentMethods: [],
  selectedPaymentMethod: {} as SelectedPaymentMethodProps,
  showLoadingToGetPrices: false,
  selectedOptionTravel: {} as SelectedOptionTravelProps,
  selectedCoupon: {} as SelectedCouponProps,
  distance: 0,
  estimatedTripTime: 0,
  hideTravelOptions: true,
  routeTrip: null,
  visibleLookUpAddressesModal: true,
  loadingTrip: false,
  isLoading: false,
  trips: [],
  trip: {} as TripProps,
  tripPartnerList: [] as TripProps[],
  tripSchedule: {},
  completedTripData: undefined,
  selectedFavorite: [],
  itsForMe: false,
  tripWho: '',
  inputWho: {
    name: '',
    phone: '',
  },
  defaultRating: 5,
  commentFinish: '',
  serviceFinishDecision: null,
  photoFinishDecision: null,
  tripType: '',
  calculateAllData: {},
  text: '',
  addressForVoice: '',
  changeRoutePreview: {} as ChangeRoutePreviewProps,
  offerOtherTypeTrip: false,
  pixId: null,
  partnerTripsReference: [],
  timeExceededFee: {
    title: null,
    description: null,
    show: false,
  },
  showModalNoCity: false,
  showModalScheduled: false,
};

const reducer = (state, action: { type: string; field?: string; arg?: any }) => {
  switch (action.type) {
    case 'update': {

      if (action.field === 'selectedOptionTravel') {
        return {
          ...state,
          selectedOptionTravel: action.arg,
          selectedFavorite: [],
        };
      }

      return {
        ...state,
        [action.field]: action.arg,
      };

    }

    case 'calculateAllNull':
      return {
        ...state,
        isLoading: false,
        showLoadingToGetPrices: false,
        prices: [],
      };
    case 'resultCalculateAll':
      return {
        ...state,
        distance: action.arg.distance,
        estimatedTripTime: action.arg.estimatedTripTime,
        prices: action.arg.prices,
      };
    case 'newTripError':
      return {
        ...state,
        trip: {},
        destination: {},
        isLoading: false,
        loadingTrip: false,
        polylineCoordinates: null,
        waypoints: [],
        selectedFavorite: [],
      };
    case 'newTripSuccess':
      return {
        ...state,
        trip: action.arg,
        hideTravelOptions: true,
        selectedCoupon: {},
        isLoading: false,
        loadingTrip: true,
        inputWho: { name: '', phone: '' },
      };
    case 'tripPartner':
      return {
        ...state,
        tripPartnerList: action.arg,
        hideTravelOptions: true,
        selectedCoupon: {},
        isLoading: false,
        loadingTrip: false,
        inputWho: { name: '', phone: '' },
      };
    case 'newTripScheduleSuccess':
      return {
        ...state,
        trip: action.arg.trip,
        lastDestination: action.arg.lastDestination,
        tripType: action.arg.tripType,
        hideTravelOptions: true,
        selectedCoupon: {},
        isLoading: false,
      };
    case 'clearSimulationData':
      return {
        ...state,
        origin: {},
        destination: {},
        waypoints: [],
      };
    case 'cancelTrip':
      return {
        ...state,
        lastDestination: {},
        lastOrigin: {},
        distance: 0,
        isLoading: false,
      };
    case 'clearTrip':
      return {
        ...state,
        origin: {},
        destination: {},
        routeTrip: null,
        lastDestination: {},
        lastOrigin: {},
        waypoints: [],
        loadingTrip: false,
        waypointQuantities: 0,
        polylineCoordinates: null,
        lastPolylineCoordinates: null,
        prices: [],
        tripPaymentMethods: [],
        selectedPaymentMethod: {},
        selectedOptionTravel: {},
        distance: null,
        calculateAllData: {},
        estimatedTripTime: 0,
        hideTravelOptions: true,
        photoFinishDecision: null,
        trip: {},
      };
    case 'editTrip':
      return {
        ...state,
        hideTravelOptions: true,
        destination: {},
        lastDestination: {},
        polylineCoordinates: null,
        visibleLookUpAddressesModal: true,
      };
    case 'scheduledTrip':
      return {
        ...state,
        polylineCoordinates: null,
        lastOrigin: {},
        distance: null,
      };
    case 'showModalNoCity':
      return {
        ...state,
        showModalNoCity: action.arg,
      };
    default:
      return false;
  }
};


export const TripProvider = ({ children }: TripContextChildren) => {
  const { tripRealtime } = useTripRealtime();
  const { userDriverFind } = useUserDriver();
  const [stateTripCustomer, dispatchTripCustomer] = useReducer(
    reducer,
    initialState,
  );

  const { openApp } = useBubbleButton();

  const showModalNoCity = (show) => {
    dispatchTripCustomer({
      type: 'showModalNoCity',
      arg: show,
    });
  };

  const {
    origin,
    destination,
    waypoints,
    polylineCoordinates,
    lastPolylineCoordinates,
    selectedPaymentMethod,
    selectedOptionTravel,
    selectedCoupon,
    distance,
    estimatedTripTime,
    routeTrip,
    trip,
    tripSchedule,
    completedTripData,
    selectedFavorite,
    inputWho,
    defaultRating,
    tripType,
    text,
    changeRoutePreview,
    photoFinishDecision,
    tripPartnerList,
  } = stateTripCustomer;

  const { setLastPlaceSelected } = useLocal();
  const { user, cityConfig } = useAuth();
  const navigation = useNavigation<any>();
  const storageFirstPolyline = useRef(null);
  const socketRouteTrip = useRef(null);
  // Ref atualizado sincronamente no render para evitar closure stale no handler do socket
  const tripStatusRef = useRef<string>(null);
  // Ref atualizado no render: os criadores de viagem são chamados por closure
  // antiga (await do modal de favorito em handleConfirmRace)
  const selectedFavoriteRef = useRef<Array<string | number>>(selectedFavorite);
  // Acumula todos os overview polylines calculados (com/sem waypoints) para filtrar cache do backend
  const overviewPolylinesRef = useRef<Set<string>>(new Set());
  tripStatusRef.current = trip?.status;
  selectedFavoriteRef.current = selectedFavorite;
  const { savePlace } = usePlaces();
  const { socket } = useSocket();

  const isGenderNotAllowedError = (errorMessage: string): boolean => {
    if (!errorMessage) return false;
    const genderErrorPatterns = [
      'gênero não é permitido',
      'genero nao e permitido',
      'gender not allowed',
      'gênero não permitido'
    ];
    return genderErrorPatterns.some(pattern =>
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Hook para gerenciar PIX e limpeza de cache
  const { clearPixCache, clearAllCachesAfterTripStart } = usePix({
    price: selectedOptionTravel?.price || 0,
  });

  const handleTripRouteListener = (result: any) => {
    if (!result?.polyline) return;

    function getUrlSocket() {
      let url = buildApp().HOST_API_APP.replace('https', 'http');
      if (appProccess === 'aws') {
        url = buildApp().HOST_SOCKET;
      }
      return url;
    }

    const decodedPolyline = decode(result.polyline).map(item => ({
      latitude: item[0],
      longitude: item[1],
    }));

    // Durante BOARDING/IN_PROGRESS, rejeita qualquer polyline que seja igual a
    // um overview calculado antes da viagem (calculateAll com ou sem waypoints).
    if (
      [STATUS_BOARDING, STATUS_IN_PROGRESS, STATUS_FINISHED].includes(tripStatusRef.current) &&
      overviewPolylinesRef.current.has(JSON.stringify(decodedPolyline))
    ) {
      return;
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'routeTrip',
      arg: result,
    });

    // exeute only one time
    if (storageFirstPolyline.current == null && tripType === 'schedule') {
      handleTripStateChange();
      storageFirstPolyline.current = result;
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'polylineCoordinates',
      arg: decodedPolyline,
    });
  };

  useEffect(() => {
    if (!cityConfig) {
      return;
    }

    if (text === '') {
      dispatchTripCustomer({
        type: 'update',
        field: 'text',
        arg: translate('trip.status_search_calculating'),
      });
    }

    if (Object.keys(trip).length > 0 && socket) {
      if (trip.status === STATUS_SEARCHING) return;
      socket.on(`location-${trip.tripReference}`, handleTripRouteListener);
    }

    return () => {
      socket?.off(`location-${trip.tripReference}`, handleTripRouteListener);
    };
  }, [trip, cityConfig, socket]);

  const getActiveTripSchedule = useCallback((): string => {
    if (!user?.idUser) return;

    const onTripAccepted: TripCallback = async ({ data, type }) => {
      if (['added', 'modified'].includes(type)) {
        await tripActiveDetails(data.tripReference);
      }
    }

    return tripRealtime.checkTripAccepted(user.idUser, STATUS_ACCEPTED, onTripAccepted);
  }, [user?.idUser]);

  const tripActiveDetails = async (tripReference: string) => {
    try {
      const response = await apiMain.post(`Trip/Get`, {
        stdObject: [
          {
            tripReference,
          },
        ],
      });
      dispatchTripCustomer({
        type: 'update',
        field: 'tripSchedule',
        arg: response.data.data,
      });
      return response.data.data;
    } catch (error) {
      return console.log(error);
    }
  };

  const handleAvaliationDriver = async (comment: string) => {
    try {
      let tripScheduled = JSON.parse(
        await AsyncStorage.getItem('tripSchedule'),
      );

      if (completedTripData?.tripReference) {
        tripScheduled = completedTripData;
      }

      const payload = {
        rating: defaultRating,
        comment,
        tripReference:
          completedTripData?.tripReference || tripScheduled?.tripReference,
        driverId:
          completedTripData?.driver?.idDriver ||
          tripScheduled?.driver?.idDriver,
      };

      if (photoFinishDecision) {
        payload['reprovedPhoto'] = true;
      }

      dispatchTripCustomer({ type: 'update', field: 'defaultRating', arg: 5 });

      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });
      const { data } = await apiMain.post('TripRating/Rate', payload);

      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      clearTrip();
      return data.status;
    } catch (error) {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      return clearTrip();
    }
  };

  async function verifyOrderPrices(data) {
    const orderPrices =
      JSON.parse(await AsyncStorage.getItem('orderPrices')) || [];

    if (orderPrices.length === 0) {
      data.prices.sort((priceA, priceB) => {
        if (priceA.tripTypeId === selectedOptionTravel?.typeTaxi.tripTypeId)
          return -1;

        if (priceB.tripTypeId === selectedOptionTravel?.typeTaxi.tripTypeId)
          return 1;

        return 0;
      });
      return data;
    }

    const newOrderPrices = orderPrices
      .map(item => {
        return data.prices.filter(price => {
          return item === parseInt(price.tripTypeId, 10);
        })[0];
      })
      .filter(item => {
        return item != null;
      });

    const notExistInListOrder = data.prices.filter(price => {
      return (
        newOrderPrices.filter(item => {
          return item.tripTypeId === price.tripTypeId;
        })[0] == null
      );
    });

    data.prices = [...newOrderPrices, ...notExistInListOrder];

    data.prices.sort((priceA, priceB) => {
      if (priceA.tripTypeId === selectedOptionTravel?.typeTaxi.tripTypeId)
        return -1;

      if (priceB.tripTypeId === selectedOptionTravel?.typeTaxi.tripTypeId)
        return 1;

      return 0;
    });

    return data;
  }

  async function getTripPaymentMethods() {
    try {
      const { data } = await apiMain.post('TripPaymentForm/GetAll', {});
      const methods = data?.data || [];

      dispatchTripCustomer({
        type: 'update',
        field: 'tripPaymentMethods',
        arg: methods,
      });

      if ((!selectedPaymentMethod || !selectedPaymentMethod?.name) && methods.length > 0) {
        const stored = await AsyncStorage.getItem('lastSelectedPaymentMethod');
        let initial = null;
        if (stored) {
          try {
            initial = JSON.parse(stored);
          } catch {}
        }
        if (!initial || !initial.name) {
          initial = methods[0];
        }
        dispatchTripCustomer({
          type: 'update',
          field: 'selectedPaymentMethod',
          arg: initial,
        });
      }
    } catch (e) {
      console.warn('Erro ao carregar formas de pagamento:', e);
    }
  }

  async function calculateAll(
    origin: AddressProps,
    destiny: DestinationProps,
    waypoints: AddressProps[],
    polylineFill = false,
    argsTrip = null,
  ) {
    dispatchTripCustomer({
      type: 'update',
      field: 'lastOrigin',
      arg: origin,
    });
    dispatchTripCustomer({
      type: 'update',
      field: 'showLoadingToGetPrices',
      arg: true,
    });
    if (
      origin === undefined ||
      destiny === undefined ||
      waypoints === undefined
    ) {
      dispatchTripCustomer({ type: 'calculateAllNull' });
      return;
    }

    let endpoint: string;
    let payload;
    const noDestination =
      origin?.latitude === destiny?.latitude &&
      origin?.longitude === destiny?.longitude;
    if (!inputWho?.name) {
      endpoint = 'price/calculateAll';
      payload = {
        origin,
        destiny,
        noDestination,
        time: argsTrip?.args?.dateTimeSchedule,
        waypoints:
          waypoints?.map(item => {
            return {
              ...item,
              latitude: String(item?.latitude),
              longitude: String(item?.longitude),
            };
          }) || [],
        timeCurrent: new Date().toLocaleTimeString(),
      };
    } else {
      endpoint = 'PricePartner/Calculate';
      payload = {
        origin,
        destination,
        waypoints,
        timeCurrent: new Date().toLocaleTimeString(),
      };
    }

    try {
      const { data } = await apiMain.post(endpoint, payload, { timeout: 600000 });

      if (data.status === false) {
        dispatchTripCustomer({ type: 'calculateAllNull' });
        const errorMessage = data?.errors?.message ?? data?.message;
        customToast(errorMessage, 'error');
        navigation.navigate('TripRoutes', {
          screen: 'Home',
        });
        return;
      }

      if (data.data == null) {
        dispatchTripCustomer({ type: 'calculateAllNull' });
        customToast(data?.message ?? translate('schedule.avaiable'), 'error');
        navigation.navigate('TripRoutes', {
          screen: 'Home',
        });
        showModalNoCity(true);
        return;
      }

      dispatchTripCustomer({
        type: 'update',
        field: 'calculateAllData',
        arg: data.data,
      });

      setTimeout(() => {
        dispatchTripCustomer({
          type: 'update',
          field: 'showLoadingToGetPrices',
          arg: false,
        });
      }, 2000);
      if (
        (data.data != null &&
          Object.keys(tripSchedule).length === 0) ||
        polylineFill
      ) {
        const overviewDecoded = decode(data.data.overview_polyline.points).map(item => ({
          latitude: item[0],
          longitude: item[1],
        }));
        // Só armazena como overview a ser filtrado se a viagem ainda não iniciou.
        // Durante a viagem (confirmação de waypoint), não deve bloquear a rota do socket.
        const isPreTrip = ![STATUS_ACCEPTED, STATUS_BOARDING, STATUS_IN_PROGRESS].includes(
          tripStatusRef.current,
        );
        if (isPreTrip) {
          overviewPolylinesRef.current.add(JSON.stringify(overviewDecoded));
        }

        dispatchTripCustomer({
          type: 'update',
          field: 'polylineCoordinates',
          arg: overviewDecoded,
        });

        dispatchTripCustomer({
          type: 'update',
          field: 'lastPolylineCoordinates',
          arg: overviewDecoded,
        });
      }

      const dataPrices = data?.data?.prices.filter(
        (e: { tripType: { serviceOption: any } }) =>
          Number(e.tripType.serviceOption) !== 1,
      );

      dispatchTripCustomer({
        type: 'resultCalculateAll',
        arg: {
          distance: data.data.distance,
          estimatedTripTime: data.data.duration,
          prices: dataPrices,
        },
      });
    } catch (error) {
      dispatchTripCustomer({ type: 'calculateAllNull' });
      customToast(translate('trip.error_calculate_price') || 'Erro ao calcular preço', 'error');
    }
  }

  const shareTrip = async (tripReference: string) => {
    const { data } = await apiMain.get(
      `Trip/GetShareLink?tripReference=${tripReference}`,
    );
    return data.data;
  };

  async function handleSelectedPaymentMethod(
    selectedMethod: SelectedPaymentMethodProps,
  ) {
    await AsyncStorage.setItem(
      'lastSelectedPaymentMethod',
      JSON.stringify(selectedMethod),
    );
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedPaymentMethod',
      arg: selectedMethod,
    });
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedCoupon',
      arg: {},
    });
  }

  async function newTrip(
    cardSelected: string,
    price: number | null = null,
    isTurbine: boolean | null = false,
    idTransaction: string = null,
    cacheData: NewTripCacheData | null = null,
  ) {

    dispatchTripCustomer({
      type: 'update',
      field: 'loadingTrip',
      arg: true,
    });
    try {

      savePlace(destination)

      const discount = {
        oldPrice: selectedOptionTravel.price,
        userDiscountCouponId: selectedCoupon.id,
      };
      // Usar dados do cache se disponíveis, senão usar do contexto
      const finalOrigin = cacheData?.origin || origin;
      const finalDestination = cacheData?.destination || destination;
      const finalSelectedOptionTravel = cacheData?.selectedOptionTravel || selectedOptionTravel;
      const finalSelectedPaymentMethod = cacheData?.selectedPaymentMethod || selectedPaymentMethod;
      const finalWaypoints = cacheData?.waypoints || waypoints;
      const finalTolls = cacheData?.tolls ?? stateTripCustomer.calculateAllData?.tolls;

      let resolvedCardId = cardSelected || '';
      if (!resolvedCardId) {
        try {
          const stored = await AsyncStorage.getItem('cardSelected');
          const parsed = stored ? JSON.parse(stored) : null;
          resolvedCardId = parsed?.idCard ? String(parsed.idCard) : '';
        } catch (_) {
          resolvedCardId = '';
        }
      }

      const payload = {
        stdObject: [
          {
            origin: finalOrigin,
            destination: finalDestination,
            userId: user.idUser,
            idTransaction: idTransaction || null,
            tripTypeId: finalSelectedOptionTravel.tripTypeId,
            tripPaymentFormId: finalSelectedPaymentMethod?.idTripPaymentForm || finalSelectedPaymentMethod?.paymentFormTypeId || finalSelectedPaymentMethod?.id,
            waypoints: finalWaypoints,
            pixId: null,
            tolls: Helper.getTollIds(finalTolls),
            cardId:
              Number(finalSelectedPaymentMethod?.paymentFormTypeId) === CREDIT_CARD_APP &&
                resolvedCardId !== ''
                ? resolvedCardId
                : null,
            schedule: null,
            scheduleISO: null,
            price: !price ? finalSelectedOptionTravel.price : price,
            tripDiscountCoupon:
              price && price !== finalSelectedOptionTravel.price ? discount : null,
            priceId: finalSelectedOptionTravel.idPrice,
            favorites: selectedFavoriteRef.current || [],
            multiplierDynamic:
              Number(finalSelectedOptionTravel.priceDynamicValue) || 0,
            isTurbined: isTurbine,
            oldPrice: isTurbine ? finalSelectedOptionTravel.price : null,
            distance,
            estimatedTripTime,
            cashback:
              finalSelectedOptionTravel.cashback !== null
                ? finalSelectedOptionTravel.cashback
                : '',
          },
        ],
      };
      try {
        const dataToSave = payload.stdObject[0];
        await AsyncStorage.setItem(
          '@App:objectNewTrip',
          JSON.stringify(dataToSave),
        );
      } catch (asyncError) {
        console.error('Erro no AsyncStorage:', asyncError);
      }

      dispatchTripCustomer({
        type: 'update',
        field: 'trip',
        arg: { ...trip, status: STATUS_SEARCHING },
      });
      Helper.timeout(1500).then(() => {
        dispatchTripCustomer({
          type: 'update',
          field: 'text',
          arg: translate('trip.status_search_searching'),
        });
      });
      const { data } = await apiMain.post(
        'Customer/NewTrip',
        payload,
      );

      dispatchTripCustomer({
        type: 'update',
        field: 'text',
        arg: translate('trip.status_search_find'),
      });

      if (data.message === 'Nenhum motorista foi encontrado para essa viagem') {
        dispatchTripCustomer({
          type: 'update',
          field: 'offerOtherTypeTrip',
          arg: true,
        });
        dispatchTripCustomer({
          type: 'update',
          field: 'inputWho',
          arg: {
            name: '',
            phone: '',
          },
        });
        return;
      }

      if (!data.status) {
        dispatchTripCustomer({ type: 'newTripError' });
        dispatchTripCustomer({
          type: 'update',
          field: 'loadingTrip',
          arg: false,
        });
        navigation.navigate('TripRoutes', {
          screen: 'Home',
        });
        clearTrip();

        // Limpar dados do PIX quando a viagem não é criada com sucesso
        await clearPixCache();

        const errorMessage = data?.data?.message || data?.message;
        if (isGenderNotAllowedError(errorMessage)) {
          customToast(translate('error_gender_not_allowed'), 'error');
        } else {
          customToast(errorMessage, 'error');
        }
        dispatchTripCustomer({
          type: 'update',
          field: 'inputWho',
          arg: {
            name: '',
            phone: '',
          },
        });
        return;
      }

      dispatchTripCustomer({ type: 'newTripSuccess', arg: data.data });
      setLastPlaceSelected({});
      await AsyncStorage.setItem('trip', JSON.stringify(data.data));

      // Limpar cache do PIX após viagem ser criada com sucesso
      await clearAllCachesAfterTripStart();

      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.navigate('TripRoutes', { screen: 'Trip' });
      const tripStatus = data.data?.status || STATUS_SEARCHING;
      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (data.data?.tripReference) {
        emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
      }
      const currentLocation = userDriverFind?.latitude && userDriverFind?.longitude
        ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
        : undefined;
      emitDriverLocation(userDriverFind, currentLocation, cityConfig);
    } catch (error) {
      dispatchTripCustomer({ type: 'newTripError' });
      customToast(error?.message, 'error');
      dispatchTripCustomer({
        type: 'update',
        field: 'loadingTrip',
        arg: false,
      });
      dispatchTripCustomer({
        type: 'update',
        field: 'inputWho',
        arg: {
          name: '',
          phone: '',
        },
      });

      // Limpar dados do PIX quando há erro na criação da viagem
      await clearPixCache();
    }
  }

  async function newTripPartner(
    cardSelected: string,
    tripCustomer: {
      name: string;
      phone: string;
    } | null = null,
    price: number | null = null,
  ) {
    const getPlaces = await AsyncStorage.getItem('lastPlaces');
    let places = [];
    if (getPlaces) {
      const oldPlaces = JSON.parse(getPlaces);
      if (oldPlaces.length >= 3) {
        oldPlaces.shift();
      }
      places = [...oldPlaces, destination];
      await AsyncStorage.setItem('lastPlaces', JSON.stringify(places));
    } else if (!getPlaces) {
      places = [destination];
      await AsyncStorage.setItem('lastPlaces', JSON.stringify(places));
    }

    const noDestinationPartner = JSON.parse(
      await AsyncStorage.getItem('@app:tripNoDestinationAnother'),
    );
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    savePlace(destination)

    const payload = {
      origin,
      destination,
      userId: user.idUser,
      tripTypeId: selectedOptionTravel.tripTypeId,
      tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
      waypoints,
      tolls: Helper.getTollIds(stateTripCustomer.calculateAllData?.tolls),
      cardId:
        Number(selectedPaymentMethod?.paymentFormTypeId) === CREDIT_CARD_APP && cardSelected !== ''
          ? cardSelected
          : null,
      schedule: null,
      scheduleISO: null,
      price: price || selectedOptionTravel.price,
      priceId: selectedOptionTravel.idPrice,
      favorites: selectedFavoriteRef.current || [],
      tripDiscountCoupon: null,
      distance,
      estimatedTripTime,
      tripCustomer: {
        name: tripCustomer?.name,
        phone: tripCustomer?.phone,
      },
      noDestination: noDestinationPartner ? true : false,
      cashback:
        selectedOptionTravel.cashback !== null
          ? selectedOptionTravel.cashback
          : '',
    };
    const { data } = await apiMain.post('Partner/NewTrip', payload);
    if (!data.status) {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      customToast(data?.data?.message || data?.message, 'error');
      dispatchTripCustomer({
        type: 'update',
        field: 'inputWho',
        arg: {
          name: '',
          phone: '',
        },
      });
      await AsyncStorage.removeItem('@app:tripNoDestination');
      await AsyncStorage.removeItem('@app:tripNoDestinationAnother');
      return;
    }

    setLastPlaceSelected({});
    dispatchTripCustomer({
      type: 'tripPartner',
      arg: [...tripPartnerList, data.data],
    });

    dispatchTripCustomer({
      type: 'update',
      field: 'inputWho',
      arg: {
        name: '',
        phone: '',
      },
    });

    const tripStatus = data.data?.status || STATUS_SEARCHING;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }

    await AsyncStorage.removeItem('@app:tripNoDestination');
    await AsyncStorage.removeItem('@app:tripNoDestinationAnother');
    return AsyncStorage.setItem(
      'tripPartnerList',
      JSON.stringify([...tripPartnerList, data.data]),
    );
  }

  async function newTripOffer(cardSelected: string, priceOffer: number) {
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    savePlace(destination)
    const discount = {
      oldPrice: selectedOptionTravel.price,
      userDiscountCouponId: selectedCoupon.id,
    };

    const verifyCardOnCoupon =
      selectedOptionTravel.price >= parseFloat(selectedCoupon.fromValue) &&
      selectedOptionTravel.price <= parseFloat(selectedCoupon.limitedTo);

    const payload = {
      stdObject: [
        {
          origin,
          destination,
          userId: user.idUser,
          tripTypeId: selectedOptionTravel.tripTypeId,
          tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
          waypoints,
          tolls: Helper.getTollIds(stateTripCustomer.calculateAllData?.tolls),
          cardId:
            Number(selectedPaymentMethod?.paymentFormTypeId) === CREDIT_CARD_APP &&
              cardSelected !== ''
              ? cardSelected
              : null,
          schedule: null,
          scheduleISO: null,
          price: priceOffer,
          priceId: selectedOptionTravel.idPrice,
          favorites: null,
          multiplierDynamic:
            Number(selectedOptionTravel.priceDynamicValue) || 0,
          tripDiscountCoupon:
            Object.keys(selectedCoupon).length > 0 && verifyCardOnCoupon
              ? discount
              : null,
          distance,
          estimatedTripTime,
          isOffer: true,
          oldPrice: selectedOptionTravel.price,
          cashback:
            selectedOptionTravel.cashback !== null
              ? selectedOptionTravel.cashback
              : '',
        },
      ],
    };

    const { data } = await apiMain.post('Customer/NewTrip', payload);

    if (!data.status) {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      customToast(data?.data?.message || data?.message, 'error');
      return;
    }

    dispatchTripCustomer({ type: 'clearSimulationData' });
    dispatchTripCustomer({ type: 'newTripSuccess', arg: data.data });
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));

    const tripStatus = data.data?.status || STATUS_SEARCHING;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }
  }

  async function refusedOffer(tripBidId: string) {
    try {
      const response = await offerService.refuseOffer(tripBidId);
      if (!response.status) {
        return '';
      }
      return response;
    } catch (error) {
      return console.log(error);
    }
  }

  async function acceptOffer(tripBidId: string) {
    try {
      const response = await offerService.acceptOffer(tripBidId);
      if (!response.status) {
        return '';
      }
      return response;
    } catch (error) {
      return console.log(error);
    }
  }

  async function changeOfferPrice(tripReference: string, priceOffer: number) {
    try {
      const response = await offerService.changeOffer(
        tripReference,
        priceOffer,
      );
      if (!response.status) {
        return '';
      }
      return response;
    } catch (error) {
      return console.log(error);
    }
  }

  async function newTripDoorHandle(
    cardSelected: string,
    driverId: number,
    price: number | null = null,
  ) {
    dispatchTripCustomer({
      type: 'update',
      field: 'isLoading',
      arg: true,
    });

    savePlace(destination)
    const discount = {
      oldPrice: selectedOptionTravel.price,
      userDiscountCouponId: selectedCoupon.id,
    };
    const verifyCardOnCoupon =
      selectedOptionTravel.price >= parseFloat(selectedCoupon.fromValue) &&
      selectedOptionTravel.price <= parseFloat(selectedCoupon.limitedTo);

    const payload = {
      cityId: [],
      origin,
      destination,
      userId: user.idUser,
      driverId,
      tripTypeId: selectedOptionTravel.tripTypeId,
      tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
      waypoints,
      tolls: Helper.getTollIds(stateTripCustomer.calculateAllData?.tolls),
      cardId:
        Number(selectedPaymentMethod?.paymentFormTypeId) === CREDIT_CARD_APP && cardSelected !== ''
          ? cardSelected
          : null,
      schedule: null,
      scheduleISO: null,
      price: !price ? selectedOptionTravel.price : price,
      priceId: selectedOptionTravel.idPrice,
      favorites: selectedFavoriteRef.current || [],
      multiplierDynamic: Number(selectedOptionTravel.priceDynamicValue) || 0,
      tripDiscountCoupon:
        Object.keys(selectedCoupon).length > 0 && verifyCardOnCoupon
          ? discount
          : null,
      distance,
      estimatedTripTime,
      cashback:
        selectedOptionTravel.cashback !== null
          ? selectedOptionTravel.cashback
          : '',
    };

    const { data } = await apiMain.post('KnobTrip/Init', payload);

    if (!data.status) {
      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: false,
      });
      customToast(data.errors ? data.errors.message : data.message, 'error');
      return;
    }
    dispatchTripCustomer({ type: 'newTripSuccess', arg: data.data });
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));

    const tripStatus = data.data?.status || STATUS_SEARCHING;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }
  }

  // trip with schedule
  async function newTripSchedule(
    schedule: any,
    scheduleISO: any,
    cardSelected: string,
    price: number | null = null,
  ) {
    const discount = {
      oldPrice: selectedOptionTravel.price,
      userDiscountCouponId: selectedCoupon.id,
    };
    const verifyCardOnCoupon =
      selectedOptionTravel.price >= parseFloat(selectedCoupon.fromValue) &&
      selectedOptionTravel.price <= parseFloat(selectedCoupon.limitedTo);

    const payload = {
      stdObject: [
        {
          origin,
          destination,
          userId: user.idUser,
          cardId: cardSelected !== '' ? cardSelected : null,
          tripTypeId: selectedOptionTravel.tripTypeId,
          tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
          waypoints,
          tolls: Helper.getTollIds(stateTripCustomer.calculateAllData?.tolls),
          schedule,
          scheduleISO,
          price: !price ? selectedOptionTravel.price : price,
          priceId: selectedOptionTravel.idPrice,
          favorites: selectedFavoriteRef.current || [],
          multiplierDynamic:
            Number(selectedOptionTravel.priceDynamicValue) || 0,
          tripDiscountCoupon:
            Object.keys(selectedCoupon).length > 0 && verifyCardOnCoupon
              ? discount
              : null,
          distance,
          estimatedTripTime,
          cashback:
            selectedOptionTravel.cashback !== null
              ? selectedOptionTravel.cashback
              : '',
        },
      ],
    };

    const { data } = await apiMain.post('Customer/NewTrip', payload);
    if (!data.status) {
      return customToast(data.message, 'warning');
    }

    dispatchTripCustomer({ type: "clearSimulationData" });
    dispatchTripCustomer({
      type: 'newTripScheduleSuccess',
      arg: {
        trip: data.data,
        lastDestination: destination,
        tripType: 'schedule',
      },
    });
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));

    const tripStatus = data.data?.status || STATUS_SCHEDULED;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }

    customToast(translate('schedule.toast_sucess'), 'success');

    return data.data;
  }

  async function newTripTypeDelivery(
    cardSelected: string,
    info,
    tripItem,
    priceOffer: number | null = null,
  ) {
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    savePlace(destination)
    // guardando todos os lugares clicados para o historico de lugares
    const payload = {
      stdObject: [
        {
          origin,
          cashback:
            selectedOptionTravel.cashback !== null
              ? selectedOptionTravel.cashback
              : '',
          tripItems: [
            {
              tripItemTypeId: tripItem.id,
            },
          ],
          deliveryInfo: {
            obs: info.obs,
            obsDestination: info.received,
            obsOrigin: info.details,
          },
          destination,
          userId: user.idUser,
          tripTypeId: selectedOptionTravel.tripTypeId,
          tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
          waypoints,
          tolls: Helper.getTollIds(stateTripCustomer.calculateAllData?.tolls),
          cardId:
            Number(selectedPaymentMethod?.paymentFormTypeId) === CREDIT_CARD_APP &&
              cardSelected !== ''
              ? cardSelected
              : null,
          schedule: null,
          scheduleISO: null,
          price: !priceOffer ? selectedOptionTravel.price : priceOffer,
          priceId: selectedOptionTravel.idPrice,
          favorites: selectedFavoriteRef.current || [],
          multiplierDynamic:
            Number(selectedOptionTravel.priceDynamicValue) || 0,
          tripDiscountCoupon: null,
          distance,
          estimatedTripTime,
          isOffer: Boolean(priceOffer),
          oldPrice: priceOffer ? selectedOptionTravel.price : null,
        },
      ],
    };

    const { data } = await apiMain.post('Customer/NewTrip', payload);

    if (!data.status) {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      customToast(data.message, 'error');
      return;
    }

    dispatchTripCustomer({ type: 'newTripSuccess', arg: data.data });
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));

    const tripStatus = data.data?.status || STATUS_SEARCHING;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }
  }

  async function getAllTypeDelivery() {
    try {
      const response = await deliveryService.getAllTypes();
      if (!response.status) {
        return customToast(response.message, 'error');
      }
      return response;
    } catch (error) {
      return console.log(error);
    }
  }

  async function getDescriptionTypeDelivery() {
    try {
      const response = await deliveryService.getDescriptionTypes();
      if (!response.status) {
        return customToast(response.message, 'error');
      }
      return response;
    } catch (error) {
      return console.log(error);
    }
  }

  async function getTrips(status: string | null = null, page = 1, setDataPage) {
    const { data } = await apiMain.post('Customer/GetTrips', {
      customerId: user.idCustomer,
      status,
      page,
    });

    setDataPage(data.data.paginate);
    if (!data.status) {
      customToast(data.message, 'warning');
      return;
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'trips',
      arg: data.data.trips,
    });
  }

  // cancel trip by schedule
  async function cancelTripByCustomerSchedule(
    tripReference: string,
    status: string = STATUS_CANCELED,
    cancellationReasonsId: number | null = null,
  ) {
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    const payload = {
      stdObject: [
        {
          status,
          userId: user.idUser,
          tripReference,
          dateEnd: Helper.getNow(),
          cancellationReasonsId,
        },
      ],
    };

    const { data } = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      emitTripStatusChange(tripReference, 'removed', configCityId);

      const currentLocation = userDriverFind?.latitude && userDriverFind?.longitude
        ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
        : undefined;
      emitDriverLocation(userDriverFind, currentLocation, cityConfig);

      customToast(translate('service.toast_sucess'), 'success');
      AsyncStorage.removeItem('tripSchedule');
      navigation.navigate('InitalServiceGetLight');
    } else {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });

      customToast(data.message, 'info');
    }
  }

  async function cancelParterTripByCustomer(tripReference: string) {
    const payload = {
      stdObject: [
        {
          status: STATUS_CANCELED,
          userId: user.idUser,
          tripReference,
          dateEnd: Helper.getNow(),
        },
      ],
    };
    const { data } = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      const listTripPartner = JSON.parse(
        await AsyncStorage.getItem('tripPartnerList'),
      );

      const filterTrips = listTripPartner?.filter(
        (trip: { tripRefernce: string }) => trip.tripRefernce !== tripReference,
      );

      AsyncStorage.setItem('tripPartnerList', JSON.stringify(filterTrips));

      // Emite evento trip.status.change quando cliente cancela viagem parceiro
      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      emitTripStatusChange(tripReference, 'removed', configCityId);
    }
  }

  async function cancelTripByCustomer(
    cancellationReasonsId: number = null,
    status = STATUS_CANCELED,
    tripReference = null,
  ) {
    const tripCancelReference = tripReference || trip.tripReference;

    if (!tripCancelReference) {
      customToast(translate('trip.text_canceled_by_user'), 'success');
      return true;
    }
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    const payload = {
      stdObject: [
        {
          status,
          userId: user.idUser,
          tripReference: tripCancelReference,
          dateEnd: Helper.getNow(),
          cancellationReasonsId,
        },
      ],
    };

    const { data } = await apiMain.post('Customer/CancelTrip', payload);

    try {
      const statusCheck = await apiMain.get<ApiResponse<TripFinishStatus>>(
        'Trip/Status',
        { params: { tripReference: tripCancelReference } },
      );
      const currentTripStatus = statusCheck.data?.data?.status;

      if (
        [
          STATUS_ACCEPTED,
          STATUS_PRE_ACCEPTED,
          STATUS_BOARDING,
          STATUS_IN_PROGRESS,
        ].includes(currentTripStatus)
      ) {
        customToast(translate('trip.driver_already_accepted'), 'warning');
        await handleTripStateChange(tripCancelReference);
        return false;
      }
    } catch (checkError) {
      console.error('Failed to verify trip status after cancel', checkError);
    }

    if (data.status) {
      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      emitTripStatusChange(tripCancelReference, 'removed', configCityId);

      await AsyncStorage.removeItem('trip');
      dispatchTripCustomer({ type: 'cancelTrip' });
      clearTrip();
      setLastPlaceSelected({});

      // Limpar dados do PIX quando a viagem é cancelada
      await clearPixCache();

      navigation.navigate('TripRoutes', { screen: 'Home', params: { pixCacheAction: 'cancel' } });
      return true;
    } else {
      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });

      navigation.navigate('TripRoutes', { screen: 'Home', params: { pixCacheAction: 'cancel' } });

      await AsyncStorage.removeItem('trip');

      // Limpar dados do PIX mesmo em caso de erro no cancelamento
      await clearPixCache();
      customToast(data.message, 'info');
      return false;
    }
  }

  async function checkIfHaveCancellationFee() {
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

    const { data } = await apiMain.post('customer/checkcancellationfee', {
      tripReference: trip.tripReference,
    });
    dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
    return data;
  }

  async function handleTripStateChange(
    tripReference?: string,
    onTripCancel?: () => void
  ): Promise<void> {
    const tripLocal = await AsyncStorage.getItem('trip');
    const tripObject: TripProps = tripLocal ? JSON.parse(tripLocal) : null;

    tripReference = tripReference ?? tripObject?.tripReference;

    if (tripReference) {
      let type = '';

      dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: true });

      try {
        const response = await apiMain.post<ApiResponse<TripProps>>('trip/get', {
          stdObject: [{ tripReference }],
        });

        if (!response.data?.status) return;

        const data = response.data?.data;

        if ([STATUS_ACCEPTED].includes(data.status)) {
          dispatchTripCustomer({ type: 'clearSimulationData' });
        }

        if (data?.schedule !== null) {
          dispatchTripCustomer({ type: 'update', field: 'tripType', arg: 'schedule' });
          type = 'schedule';
        }

        if (
          data.status === STATUS_CANCELED ||
          data.status === STATUS_NOT_ANSWERED ||
          data.status === STATUS_BACK_OFF
        ) {
          const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
          if (data?.tripReference) {
            emitTripStatusChange(data.tripReference, 'removed', configCityId);
          }

          if (
            data?.canceledBy === 'driver' &&
            data.customerCancellationFee === null
          ) {
            await AsyncStorage.removeItem("waitingTimer");
            await initNewTripAfterCancel(data, true);
            return;
          }

          if (
            data?.timeToExpireTrip === 0 &&
            data?.canceledBy === 'customer' &&
            data.status !== STATUS_BACK_OFF &&
            data.status !== STATUS_CANCELED &&
            cityConfig?.enableTripSuggestion === '1'
          ) {
            await AsyncStorage.removeItem('trip');

            navigation.navigate('TripRoutes', { screen: 'SuggestionTrips' });

            dispatchTripCustomer({
              type: 'update',
              field: 'changeRoutePreview',
              arg: {},
            });
            return;
          }

          if (
            data?.canceledBy === 'driver' &&
            data.customerCancellationFee !== null
          ) {
            await AsyncStorage.removeItem("waitingTimer");
            dispatchTripCustomer({
              type: 'update',
              field: 'timeExceededFee',
              arg: {
                title: data.customerCancellationFee.title,
                description: data.customerCancellationFee.description,
                show: true,
              },
            });

            dispatchTripCustomer({
              type: 'update',
              field: 'changeRoutePreview',
              arg: {},
            });

            clearTrip();
            navigation.navigate('TripRoutes', {
              screen: 'Home',
              params: { noUnsubscribe: true, pixCacheAction: 'cancel' },
            });
          }

          await AsyncStorage.removeItem('trip');

          if (onTripCancel) onTripCancel();

          dispatchTripCustomer({
            type: 'update',
            field: 'changeRoutePreview',
            arg: {},
          });
          if (data?.canceledBy === 'admin') {
            await AsyncStorage.removeItem("waitingTimer");
            customToast(
              translate('finishTrip.text_trip_cancelled_by_false'),
              'warning',
            );
          }
          clearTrip();
          navigation.navigate('TripRoutes', {
            screen: 'Home',
            params: { noUnsubscribe: true, pixCacheAction: 'cancel' },
          });

          return;
        }
        if (data.status === STATUS_FINISHED) {
          await AsyncStorage.removeItem("waitingTimer");
          await AsyncStorage.removeItem('trip');

          if (onTripCancel) onTripCancel();

          dispatchTripCustomer({
            type: 'update',
            field: 'completedTripData',
            arg: data,
          });
          dispatchTripCustomer({
            type: 'update',
            field: 'changeRoutePreview',
            arg: {},
          });
          navigation.navigate('TripRoutes', {
            screen: 'Home',
            params: { noUnsubscribe: true },
          });
          return;
        }
        dispatchTripCustomer({
          type: 'update',
          field: 'trip',
          arg: data,
        });
        dispatchTripCustomer({
          type: 'update',
          field: 'hideTravelOptions',
          arg: true,
        });
        // Definir loadingTrip como false quando a viagem entra em status de busca
        if (data.status === STATUS_SEARCHING) {
          dispatchTripCustomer({
            type: 'update',
            field: 'loadingTrip',
            arg: false,
          });
        }
        if (data?.status === STATUS_SCHEDULED) {
          // Método transferido para Home
          return;
        }
        if (
          data.status === STATUS_ACCEPTED ||
          data.status === STATUS_PRE_ACCEPTED ||
          data.status === STATUS_BOARDING ||
          (data.status === STATUS_IN_PROGRESS && type === 'schedule') ||
          data.status === STATUS_IN_PROGRESS ||
          data.status === STATUS_SEARCHING ||
          data.status === STATUS_SEARCHING_DRIVER_OFFER
        ) {
          navigation.navigate('TripRoutes', {
            screen: 'Trip',
          });
          return;
        }
        dispatchTripCustomer({
          type: 'update',
          field: 'lastDestination',
          arg: data.destination,
        });
        dispatchTripCustomer({
          type: 'update',
          field: 'lastOrigin',
          arg: data.origin,
        });
        if (type !== 'schedule') {
          navigation.navigate('TripRoutes', { screen: 'Trip' });
        }
      } catch (error) {
        console.log({ error });
      } finally {
        dispatchTripCustomer({ type: 'update', field: 'isLoading', arg: false });
      }
    }

    setTimeout(() => {
      dispatchTripCustomer({ type: 'clearTrip' });
      storageFirstPolyline.current = null;
      overviewPolylinesRef.current.clear();
      socket?.off(`location-${trip.tripReference}`, handleTripRouteListener);
    }, 200);
  }

  const clearTrip = () => {
    setTimeout(async () => {
      dispatchTripCustomer({ type: 'clearTrip' });
      socketRouteTrip.current = null;
      storageFirstPolyline.current = null;
      overviewPolylinesRef.current.clear();

      await AsyncStorage.removeItem('trip');

      // Limpar dados do PIX quando limpar a viagem
      await clearPixCache();
      socket?.off(`location-${trip.tripReference}`, handleTripRouteListener);
    }, 200);
  };

  const previewChangeRoutes = async (
    destination: DestinationProps,
    waypoints: AddressProps[],
  ) => {
    try {
      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: true,
      });
      const payload = {
        tripReference: trip?.tripReference,
        destination,
        waypoints,
        kmProgressing: routeTrip?.kmProgressing ?? 0,
        minuteProgressing: routeTrip?.minuteProgressing ?? 0,
        multiplierDynamicPrice: Number(trip.multiplierDynamic),
      };
      const response = await TripService.previewNewPriceChangeRoutes(payload);

      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: false,
      });
      if (!response.status) {
        return false;
      }
      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: destination,
      });
      dispatchTripCustomer({
        type: 'update',
        field: 'changeRoutePreview',
        arg: response?.data,
      });

      return response;
    } catch (error) {
      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: false,
      });
      return console.log(error);
    }
  };

  const changeRoute = async () => {
    try {
      const payload = {
        tripReference: trip?.tripReference,
        destination,
        waypoints: waypoints.length > 0 ? waypoints : null,
        price: changeRoutePreview?.price,
        distance: changeRoutePreview?.distance,
        duration: changeRoutePreview?.duration,
      };
      const response = await TripService.changeRoute(payload);
      if (!response.status) {
        return false;
      }
      customToast(response?.message, 'success');
      trip.changeRoute = true;
      await AsyncStorage.setItem('trip', JSON.stringify(trip));
      return response;
    } catch (error) {
      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: false,
      });
      return console.error(error);
    }
  };

  const getStatus = async status => { };

  const createTrip = async (payload: any) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'trip',
      arg: { ...trip, status: STATUS_SEARCHING },
    });

    Helper.timeout(1500).then(() => {
      dispatchTripCustomer({
        type: 'update',
        field: 'text',
        arg: translate('trip.status_search_searching'),
      });
    });
    const { data } = await apiMain.post('Customer/NewTrip', payload);
    dispatchTripCustomer({
      type: 'update',
      field: 'text',
      arg: translate('trip.status_search_find'),
    });

    if (!data.status) {
      dispatchTripCustomer({ type: 'newTripError' });
      navigation.navigate('TripRoutes', {
        screen: 'Home',
      });
      customToast(data.message, 'error');
      return;
    }
    dispatchTripCustomer({ type: 'newTripSuccess', arg: data.data });
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));

    // Definir loadingTrip como false após a viagem ser criada com sucesso
    dispatchTripCustomer({
      type: 'update',
      field: 'loadingTrip',
      arg: false,
    });
    const tripStatus = data.data?.status || STATUS_SEARCHING;
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (data.data?.tripReference) {
      emitTripStatusChange(data.data.tripReference, tripStatus, configCityId);
    }
  };

  const verifyPaymentFormTrip = async (newTrip) => {
    const card = await AsyncStorage.getItem("cardSelected");
    const cardId = card ? JSON.parse(card)?.idCard : null;

    if (
      (newTrip?.tripPaymentFormId == CREDIT_CARD_APP ||
        newTrip?.tripPaymentFormId == PAYMENT_CARD_DEBIT) &&
      cardId
    ) {
      newTrip.cardId = cardId;
    }

    return newTrip;
  };

  const initNewTripAfterCancel = useCallback(async (
    trip: TripProps,
    showAlert: boolean = true,
  ) => {
    const hasRecalculatedPrice = !!trip?.recalculatedPrice;
    const oldPrice = trip?.recalculatedPrice?.oldPrice;
    const price = hasRecalculatedPrice ? oldPrice : trip?.price;

    try {
      const isPixTrip =
        trip?.tripPaymentFormTypeId == PIX_WEB ||
        trip?.tripPaymentFormTypeId == PIX;

      if (isPixTrip) {
        dispatchTripCustomer({ type: 'update', field: 'changeRoutePreview', arg: {} });

        clearTrip();

        navigation.navigate('TripRoutes', {
          screen: 'Home',
          params: { noUnsubscribe: true, pixCacheAction: 'cancel' },
        });

        return customToast(
          translate('trip.text_canceled_by_driver'),
          'warning',
        );
      }

      if (showAlert) {
        customToast(
          translate('trip.text_canceled_by_driver_redistributing'),
          'warning',
        );
      }

      let tripPayload = {
        userId: parseInt(trip?.userId, 10),
        tripTypeId: trip?.tripTypeId,
        tripPaymentFormId: trip?.tripPaymentFormId,
        origin: {
          address: trip?.origin.address,
          latitude: parseFloat(trip?.origin.latitude),
          longitude: parseFloat(trip?.origin.longitude),
        },
        destination: {
          address: trip?.destination.name,
          latitude: parseFloat(trip?.destination.latitude),
          longitude: parseFloat(trip?.destination.longitude),
        },
        priceId: trip?.priceId,
        distance: parseFloat(trip?.distance),
        estimatedTripTime: parseFloat(trip?.estimatedTripTime),
        schedule: null,
        waypoints: trip?.tripWayPoints.map(item => ({
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          neighborhood: item.neighborhood,
          address: item.address,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          obs: item.obs,
        })),
        price,
        tolls: Helper.getTollIds(trip?.tolls),
        tripDiscountCoupon: {
          oldPrice: trip?.tripDiscountCoupon?.oldPrice,
          userDiscountCouponId:
            trip?.tripDiscountCoupon?.userDiscountCouponId,
        },
        isOffer: trip?.isOffer ? 0 : 1,
      };

      tripPayload = await verifyPaymentFormTrip(tripPayload);

      const payload = {
        stdObject: [tripPayload],
      };

      await createTrip(payload);

      if (!showAlert) {
        navigation.navigate('TripRoutes', { screen: 'Trip' });
      }
    } catch (error) {
      dispatchTripCustomer({ type: 'newTripError' });
      customToast(error?.message, 'error');
    }
  }, []);


  const getCancellationReasons = async () => {
    try {
      const response = await apiMain.post(
        'CancellationReasons/GetAllCustomer',
        {
          stdObject: [{}],
        },
      );

      if (!response.status) {
        customToast(
          translate('finishTrip.title_error_loading_reasons_cancellation'),
          'danger',
        );
        return [];
      }
      return response.data.data;
    } catch (error) {
      return console.log(error);
    }
  };

  const getWaitingTimer = async (cityId: string, tripTypeId: number) => {
    try {
      const { data } = await apiMain.post('price/getWaitingTimeFees', {
        cityId,
        tripTypeId,
      });

      if (!data.status) return;
      return data?.data;

    } catch (error) { console.log(error) }
  }

  const value = useMemo(
    () => ({
      shareTrip,
      handleTripStateChange,
      calculateAll,
      getTripPaymentMethods,
      handleSelectedPaymentMethod,
      newTrip,
      newTripSchedule,
      getTrips,
      cancelTripByCustomer,
      checkIfHaveCancellationFee,
      handleAvaliationDriver,
      cancelTripByCustomerSchedule,
      storageFirstPolyline,
      getActiveTripSchedule,
      newTripDoorHandle,
      newTripOffer,
      refusedOffer,
      acceptOffer,
      changeOfferPrice,
      newTripTypeDelivery,
      getAllTypeDelivery,
      getDescriptionTypeDelivery,
      newTripPartner,
      previewChangeRoutes,
      changeRoute,
      clearTrip,
      initNewTripAfterCancel,
      getCancellationReasons,
      stateTripCustomer,
      dispatchTripCustomer,
      cancelParterTripByCustomer,
      showModalNoCity,
      getWaitingTimer
    }),
    [
      shareTrip,
      handleTripStateChange,
      calculateAll,
      getTripPaymentMethods,
      handleSelectedPaymentMethod,
      newTrip,
      newTripSchedule,
      getTrips,
      cancelTripByCustomer,
      checkIfHaveCancellationFee,
      handleAvaliationDriver,
      cancelTripByCustomerSchedule,
      storageFirstPolyline,
      getActiveTripSchedule,
      newTripDoorHandle,
      newTripOffer,
      refusedOffer,
      acceptOffer,
      changeOfferPrice,
      newTripTypeDelivery,
      getAllTypeDelivery,
      getDescriptionTypeDelivery,
      newTripPartner,
      previewChangeRoutes,
      changeRoute,
      clearTrip,
      initNewTripAfterCancel,
      getCancellationReasons,
      stateTripCustomer,
      dispatchTripCustomer,
      cancelParterTripByCustomer,
      showModalNoCity,
      getWaitingTimer
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);

  return context;
};
