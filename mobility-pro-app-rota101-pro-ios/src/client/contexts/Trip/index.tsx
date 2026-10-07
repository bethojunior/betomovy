import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from '@googlemaps/polyline-codec';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import apiMain from '../../api/apiMain';
import {
  STATUS_ACCEPTED,
  STATUS_BACK_OFF,
  STATUS_BOARDING,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_NOT_ANSWERED,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_SEARCHING_FAVORITE,
} from '../../constants/trip';
import Helper from '../../utils/Helper';
import AppSocket from '../../services/socket';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';
import {useLocal} from '../local';
import TripCollection from '../../services/firebase/collection/TripCollection';
import {useAuth} from '../../../context/auth';
import {deliveryService, offerService, TripService} from './services';
import {appProccess, buildApp} from '../../../constantBuild/config';
import {
  TripContextType,
  TripContextChildren,
  SelectedPaymentMethodProps,
  DestinationProps,
  SelectedCouponProps,
  SelectedOptionTravelProps,
  ChangeRoutePreviewProps,
  AddressProps,
  TripProps,
  InitialStateProps,
} from './types';
import {TripRealtime} from '../../services/realtime/TripRealtime';

const tripRealtime = new TripRealtime();

const TripContext = createContext<TripContextType>({} as TripContextType);

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
};

const reducer = (state, action: {type: string; field?: string; arg?: any}) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.arg,
      };
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
        origin: {},
        destination: {},
        selectedCoupon: {},
        waypoints: [],
        isLoading: false,
        loadingTrip: false,
        inputWho: {name: '', phone: ''},
      };
    case 'tripPartner':
      return {
        ...state,
        tripPartnerList: action.arg,
        hideTravelOptions: true,
        origin: {},
        destination: {},
        selectedCoupon: {},
        waypoints: [],
        isLoading: false,
        loadingTrip: false,
        inputWho: {name: '', phone: ''},
      };
    case 'newTripScheduleSuccess':
      return {
        ...state,
        trip: action.arg.trip,
        lastDestination: action.arg.lastDestination,
        tripType: action.arg.tripType,
        hideTravelOptions: true,
        origin: {},
        destination: {},
        selectedCoupon: {},
        waypoints: [],
        isLoading: false,
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
    default:
      return false;
  }
};

export const TripProvider = ({children}: TripContextChildren) => {
  const [stateTripCustomer, dispatchTripCustomer] = useReducer(
    reducer,
    initialState,
  );

  const {
    origin,
    destination,
    waypoints,
    polylineCoordinates,
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

  const {setLastPlaceSelected} = useLocal();
  const socketRouteTrip = useRef(null);
  const {user, cityConfig} = useAuth();
  const navigation = useNavigation();
  const storageFirstPolyline = useRef(null);

  function getUrlSocket() {
    let url = buildApp().HOST_API_APP.replace('https', 'http');
    if (appProccess === 'aws') {
      url = buildApp().HOST_SOCKET;
    }
    url = url.substring(0, url.length - 1);

    return url;
  }

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

    if (Object.keys(trip).length > 0 && socketRouteTrip.current == null) {
      if (trip.status === STATUS_SEARCHING) {
        return;
      }

      socketRouteTrip.current = new AppSocket(
        `${getUrlSocket()}${cityConfig.configDriverLocation.port_url}`,
        {
          query: `tripReference=${trip.tripReference}`,
        },
      );

      socketRouteTrip.current.onEvent(
        `location-${trip.tripReference}`,
        result => {
          if (!result) {
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
            arg: decode(result.polyline).map(item => {
              return {latitude: item[0], longitude: item[1]};
            }),
          });
        },
      );
    }
  }, [trip, cityConfig]);

  const getActiveTripSchedule = useCallback(async () => {
    tripRealtime.checkTripAccepted(
      user.idUser,
      STATUS_ACCEPTED,
      async (trip: TripProps, type: string) => {
        if (['added', 'modified'].includes(type)) {
          await tripActiveDetails(trip.tripReference);
        }
        if (type === 'removed') {
          getStatus(trip.status);
        }
      },
    );
  }, []);

  const checkTripScheduleAccepted = useCallback(
    async tripReference => {
      tripRealtime.getTrip(tripReference, (trip: TripProps, type: string) => {
        if (
          type === 'modified' &&
          trip?.status === STATUS_SCHEDULED &&
          trip?.driver
        ) {
          customToast(
            `Sua viagem foi aceita por ${trip?.driver?.nickname}`,
            'success',
          );
          handleTripStateChange();
        }
      });
    },
    [tripRealtime, STATUS_SCHEDULED, navigation],
  );

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

      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});
      const {data} = await apiMain.post('TripRating/Rate', payload);

      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
      clearTrip();
      return data.status;
    } catch (error) {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
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
    const {data} = await apiMain.post('TripPaymentForm/GetAll', {});

    dispatchTripCustomer({
      type: 'update',
      field: 'tripPaymentMethods',
      arg: data.data,
    });
  }

  async function calculateAll(
    origin: AddressProps,
    destiny: DestinationProps,
    waypoints: AddressProps[],
    polylineFill = false,
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

    const {data} = await apiMain.post(endpoint, payload);
    if (data.data == null) {
      dispatchTripCustomer({type: 'calculateAllNull'});
      customToast(data?.errors?.message ?? data?.message);
      navigation.navigate('TripRoutes', {
        screen: 'Home',
      });
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
        !polylineCoordinates &&
        Object.keys(tripSchedule).length === 0) ||
      polylineFill
    ) {
      dispatchTripCustomer({
        type: 'update',
        field: 'polylineCoordinates',
        arg: decode(data.data.overview_polyline.points).map(item => {
          return {latitude: item[0], longitude: item[1]};
        }),
      });

      dispatchTripCustomer({
        type: 'update',
        field: 'lastPolylineCoordinates',
        arg: decode(data.data.overview_polyline.points).map(item => {
          return {latitude: item[0], longitude: item[1]};
        }),
      });
    }

    const dataPrices = await data?.data?.prices;

    dispatchTripCustomer({
      type: 'resultCalculateAll',
      arg: {
        distance: data.data.distance,
        estimatedTripTime: data.data.duration,
        prices: dataPrices,
      },
    });
    await AsyncStorage.setItem('listPrices', JSON.stringify(data.data.prices));
  }

  const shareTrip = async (tripReference: string) => {
    const {data} = await apiMain.get(
      `Trip/GetShareLink?tripReference=${tripReference}`,
    );

    if (!data.status) {
      console.log(data.message);
    }
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
  ) {
    dispatchTripCustomer({
      type: 'update',
      field: 'loadingTrip',
      arg: true,
    });
    try {
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

      // guardando todos os lugares clicados para o historico de lugares

      const getPlacesAll = await AsyncStorage.getItem('allPlaces');
      const allPlaces = JSON.parse(getPlacesAll);

      if (allPlaces) {
        const findPlace = allPlaces.find(
          (place: AddressProps) => place.address === destination.address,
        );
        if (!findPlace) {
          allPlaces.push(destination);
          await AsyncStorage.setItem('allPlaces', JSON.stringify(allPlaces));
        }
      } else {
        await AsyncStorage.setItem('allPlaces', JSON.stringify([destination]));
      }
      const discount = {
        oldPrice: selectedOptionTravel.price,
        userDiscountCouponId: selectedCoupon.id,
      };
      const payload = {
        stdObject: [
          {
            origin,
            destination,
            userId: user.idUser,
            pixId: null,
            tripTypeId: selectedOptionTravel.tripTypeId,
            tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
            waypoints,
            tolls: [],
            cardId:
              selectedPaymentMethod?.paymentFormTypeId === '3' &&
              cardSelected !== ''
                ? cardSelected
                : null,
            schedule: null,
            scheduleISO: null,
            price: !price ? selectedOptionTravel.price : price,
            tripDiscountCoupon:
              price && price !== selectedOptionTravel.price ? discount : null,
            priceId: selectedOptionTravel.idPrice,
            favorites: selectedFavorite || [],
            multiplierDynamic:
              Number(selectedOptionTravel.priceDynamicValue) || 0,
            isFavorite: selectedFavorite || false,
            isTurbined: isTurbine,
            oldPrice: isTurbine ? selectedOptionTravel.price : null,
            distance,
            estimatedTripTime,
          },
        ],
      };

      dispatchTripCustomer({
        type: 'update',
        field: 'trip',
        arg: {...trip, status: STATUS_SEARCHING},
      });
      Helper.timeout(1500).then(() => {
        dispatchTripCustomer({
          type: 'update',
          field: 'text',
          arg: translate('trip.status_search_searching'),
        });
      });
      const {data} = await apiMain.post('Customer/NewTrip', payload);
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
        return;
      }

      if (!data.status) {
        dispatchTripCustomer({type: 'newTripError'});
        dispatchTripCustomer({
          type: 'update',
          field: 'loadingTrip',
          arg: false,
        });
        navigation.navigate('TripRoutes', {
          screen: 'Home',
        });
        clearTrip();
        customToast(data?.data?.message || data?.message, 'error');
        return;
      }

      dispatchTripCustomer({type: 'newTripSuccess', arg: data.data});
      setLastPlaceSelected({});
      await AsyncStorage.setItem('trip', JSON.stringify(data.data));
    } catch (error) {
      dispatchTripCustomer({type: 'newTripError'});
      customToast(JSON.stringify(error), 'error');
      dispatchTripCustomer({
        type: 'update',
        field: 'loadingTrip',
        arg: false,
      });
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
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});
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
    const payload = {
      origin,
      destination,
      userId: user.idUser,
      tripTypeId: selectedOptionTravel.tripTypeId,
      tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
      waypoints,
      tolls: [],
      cardId:
        selectedPaymentMethod?.paymentFormTypeId === '3' && cardSelected !== ''
          ? cardSelected
          : null,
      schedule: null,
      scheduleISO: null,
      price: price || selectedOptionTravel.price,
      priceId: selectedOptionTravel.idPrice,
      favorites: selectedFavorite || [],
      tripDiscountCoupon: null,
      isFavorite: selectedFavorite || false,
      distance,
      estimatedTripTime,
      tripCustomer: {
        name: tripCustomer?.name,
        phone: tripCustomer?.phone,
      },
    };
    const {data} = await apiMain.post('Partner/NewTrip', payload);
    if (!data.status) {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
      customToast(data?.data?.message || data?.message, 'error');
      return;
    }

    setLastPlaceSelected({});
    dispatchTripCustomer({
      type: 'tripPartner',
      arg: [...tripPartnerList, data.data],
    });
    return AsyncStorage.setItem(
      'tripPartnerList',
      JSON.stringify([...tripPartnerList, data.data]),
    );
  }

  async function newTripOffer(cardSelected: string, priceOffer: number) {
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});
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
          tolls: [],
          cardId:
            selectedPaymentMethod?.paymentFormTypeId === '3' &&
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
          isFavorite: selectedFavorite || false,
          distance,
          estimatedTripTime,
          isOffer: true,
          oldPrice: selectedOptionTravel.price,
        },
      ],
    };

    const {data} = await apiMain.post('Customer/NewTrip', payload);

    if (!data.status) {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
      customToast(data?.data?.message || data?.message, 'error');

      return;
    }
    dispatchTripCustomer({type: 'newTripSuccess', arg: data.data});
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));
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
      tolls: [],
      cardId:
        selectedPaymentMethod?.paymentFormTypeId === '3' && cardSelected !== ''
          ? cardSelected
          : null,
      schedule: null,
      scheduleISO: null,
      price: !price ? selectedOptionTravel.price : price,
      priceId: selectedOptionTravel.idPrice,
      favorites: selectedFavorite || [],
      multiplierDynamic: Number(selectedOptionTravel.priceDynamicValue) || 0,
      tripDiscountCoupon:
        Object.keys(selectedCoupon).length > 0 && verifyCardOnCoupon
          ? discount
          : null,
      isFavorite: selectedFavorite || false,
      distance,
      estimatedTripTime,
    };

    const {data} = await apiMain.post('KnobTrip/Init', payload);

    if (!data.status) {
      dispatchTripCustomer({
        type: 'update',
        field: 'isLoading',
        arg: false,
      });
      customToast(data.errors ? data.errors.message : data.message, 'error');
      return;
    }
    dispatchTripCustomer({type: 'newTripSuccess', arg: data.data});
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));
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
          tolls: [],
          schedule,
          scheduleISO,
          price: !price ? selectedOptionTravel.price : price,
          priceId: selectedOptionTravel.idPrice,
          favorites: selectedFavorite || [],
          multiplierDynamic:
            Number(selectedOptionTravel.priceDynamicValue) || 0,
          tripDiscountCoupon:
            Object.keys(selectedCoupon).length > 0 && verifyCardOnCoupon
              ? discount
              : null,
          isFavorite: selectedFavorite || false,
          distance,
          estimatedTripTime,
        },
      ],
    };

    const {data} = await apiMain.post('Customer/NewTrip', payload);
    if (!data.status) {
      return customToast(data.message, 'warning');
    }
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
    customToast(translate('schedule.toast_sucess'), 'success');

    return data.data;
  }

  async function newTripTypeDelivery(
    cardSelected: string,
    info,
    tripItem,
    priceOffer: number | null = null,
  ) {
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});

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
    // guardando todos os lugares clicados para o historico de lugares

    const getPlacesAll = await AsyncStorage.getItem('allPlaces');
    const allPlaces = JSON.parse(getPlacesAll);

    if (allPlaces) {
      const findPlace = allPlaces.find(place => place.id === destination.id);
      if (!findPlace) {
        allPlaces.push(destination);
        await AsyncStorage.setItem('allPlaces', JSON.stringify(allPlaces));
      }
    } else {
      await AsyncStorage.setItem('allPlaces', JSON.stringify([destination]));
    }
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
          tolls: [],
          cardId:
            selectedPaymentMethod?.paymentFormTypeId === '3' &&
            cardSelected !== ''
              ? cardSelected
              : null,
          schedule: null,
          scheduleISO: null,
          price: !priceOffer ? selectedOptionTravel.price : priceOffer,
          priceId: selectedOptionTravel.idPrice,
          favorites: selectedFavorite || [],
          multiplierDynamic:
            Number(selectedOptionTravel.priceDynamicValue) || 0,
          tripDiscountCoupon: null,
          isFavorite: selectedFavorite || false,
          distance,
          estimatedTripTime,
          isOffer: Boolean(priceOffer),
          oldPrice: priceOffer ? selectedOptionTravel.price : null,
        },
      ],
    };

    const {data} = await apiMain.post('Customer/NewTrip', payload);

    if (!data.status) {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
      customToast(data.message, 'error');
      return;
    }

    dispatchTripCustomer({type: 'newTripSuccess', arg: data.data});
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));
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
    const {data} = await apiMain.post('Customer/GetTrips', {
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
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});

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

    const {data} = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});

      customToast(translate('service.toast_sucess'), 'success');
      AsyncStorage.removeItem('tripSchedule');
      navigation.navigate('InitalServiceGetLight');
    } else {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});

      showMessage({
        message: data.message,
        type: 'info',
        position: 'bottom',
        icon: 'auto',
        duration: 4000,
        style: {
          height: 80,
          alignItems: 'center',
        },
        titleStyle: {
          fontSize: 16,
        },
      });
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
    const {data} = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      const listTripPartner = JSON.parse(
        await AsyncStorage.getItem('tripPartnerList'),
      );

      const filterTrips = listTripPartner?.filter(
        (trip: {tripRefernce: string}) => trip.tripRefernce !== tripReference,
      );

      AsyncStorage.setItem('tripPartnerList', JSON.stringify(filterTrips));
    }
  }

  async function cancelTripByCustomer(
    cancellationReasonsId: number = null,
    status = STATUS_CANCELED,
    tripReference = null,
  ) {
    const tripCancelReference = tripReference || trip.tripReference;

    if (!tripCancelReference) {
      // source.cancel('Cancelado pelo usuário');
      customToast('Cancelado pelo usuário', 'success');
      return;
    }
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});

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

    const {data} = await apiMain.post('Customer/CancelTrip', payload);
    if (data.status) {
      await AsyncStorage.removeItem('trip');
      dispatchTripCustomer({type: 'cancelTrip'});
      clearTrip();
      setLastPlaceSelected({});
      navigation.navigate('TripRoutes', {screen: 'Home'});
    } else {
      dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});

      navigation.navigate('TripRoutes', {screen: 'Home'});

      await AsyncStorage.removeItem('trip');
      showMessage({
        message: data.message,
        type: 'info',
        position: 'bottom',
        icon: 'auto',
        duration: 4000,
        style: {
          height: 80,
          alignItems: 'center',
        },
        titleStyle: {
          fontSize: 16,
        },
      });
    }
  }

  async function checkIfHaveCancellationFee() {
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: true});

    const {data} = await apiMain.post('customer/checkcancellationfee', {
      tripReference: trip.tripReference,
    });
    dispatchTripCustomer({type: 'update', field: 'isLoading', arg: false});
    return data;
  }
  // TODO essa funcao ta comentada pq ela chama 2 requisicoes em handleTripStateChange, justamente pq ela e chamada aqui e na home principal
  // const [tripFirebase, setTripFirebase] = useState()
  // useEffect (() => {
  //   ( async() => {
  //     TripCollection.checkTripAccepted(
  //       user.idUser,
  //       STATUS_ACCEPTED,
  //       async (trip,type) => {
  //         if (type === 'added' || type === 'modified') {
  //           setTrip(trip);
  //           setTripFirebase(tripFirebase);
  //           await AsyncStorage.setItem('trip', JSON.stringify(trip));
  //           handleTripStateChange()
  //         }
  //       }
  //     )
  //   })()

  // },[])

  async function handleTripStateChange(tripReference = null) {
    const tripLocal = await AsyncStorage.getItem('trip');
    let type = '';
    if (tripLocal !== null) {
      const {tripReference: tripReferenceState} =
        tripReference || JSON.parse(tripLocal);

      const tripObject = JSON.parse(tripLocal);

      if (tripObject.schedule !== null) {
        dispatchTripCustomer({
          type: 'update',
          field: 'tripType',
          arg: 'schedule',
        });

        type = 'schedule';
      }

      try {
        dispatchTripCustomer({
          type: 'update',
          field: 'isLoading',
          arg: true,
        });
        const {
          data: {data},
        } = await apiMain.post('trip/get', {
          stdObject: [{tripReference: tripReferenceState}],
        });
        dispatchTripCustomer({
          type: 'update',
          field: 'isLoading',
          arg: false,
        });
        if (
          data.status === STATUS_CANCELED ||
          data.status === STATUS_NOT_ANSWERED ||
          data.status === STATUS_BACK_OFF
        ) {
          if (data?.canceledBy === 'driver') {
            await initNewTripAfterCancel(data);
            return;
          }

          await AsyncStorage.removeItem('trip');

          dispatchTripCustomer({
            type: 'update',
            field: 'changeRoutePreview',
            arg: {},
          });
          if (data?.canceledBy === 'admin') {
            customToast(
              translate('finishTrip.text_trip_cancelled_by_false'),
              'warning',
            );
          }
          clearTrip();
          navigation.navigate('TripRoutes', {
            screen: 'Home',
            params: {noUnsubscribe: true},
          });

          return;
        }
        if (data.status === STATUS_FINISHED) {
          await AsyncStorage.removeItem('trip');
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
            params: {noUnsubscribe: true},
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
        if (data?.status === STATUS_SCHEDULED) {
          checkTripScheduleAccepted(tripObject?.tripReference);
          return;
        }
        if (
          data.status === STATUS_ACCEPTED ||
          data.status === STATUS_BOARDING ||
          (data.status === STATUS_IN_PROGRESS && type === 'schedule') ||
          data.status === STATUS_IN_PROGRESS ||
          data.status === STATUS_SEARCHING ||
          data.status === STATUS_SEARCHING_FAVORITE
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
          navigation.navigate('TripRoutes', {screen: 'Trip'});
        }
      } catch (error) {
        console.log({error});
      }
    }

    setTimeout(() => {
      dispatchTripCustomer({type: 'clearTrip'});
      socketRouteTrip.current = null;
    }, 200);
  }

  const clearTrip = () => {
    setTimeout(() => {
      dispatchTripCustomer({type: 'clearTrip'});
      socketRouteTrip.current = null;
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
      return console.log(error);
    }
  };

  const getStatus = async status => {};

  const createTrip = async (payload: any) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'trip',
      arg: {...trip, status: STATUS_SEARCHING},
    });

    Helper.timeout(1500).then(() => {
      dispatchTripCustomer({
        type: 'update',
        field: 'text',
        arg: translate('trip.status_search_searching'),
      });
    });
    const {data} = await apiMain.post('Customer/NewTrip', payload);
    dispatchTripCustomer({
      type: 'update',
      field: 'text',
      arg: translate('trip.status_search_find'),
    });

    if (!data.status) {
      dispatchTripCustomer({type: 'newTripError'});
      navigation.navigate('TripRoutes', {
        screen: 'Home',
      });
      customToast(data.message, 'error');
      return;
    }
    dispatchTripCustomer({type: 'newTripSuccess', arg: data.data});
    setLastPlaceSelected({});
    await AsyncStorage.setItem('trip', JSON.stringify(data.data));
  };

  const initNewTripAfterCancel = async (trip: TripProps, showAlert = true) => {
    try {
      showAlert
        ? customToast(
            'Sua corrida foi cancelada pelo motorista, estamos redistribuindo sua corrida',
            'warning',
          )
        : null;
      const payload = {
        stdObject: [
          {
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
            waypoints: trip?.tripWayPoints.map(item => {
              return {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
                neighborhood: item.neighborhood,
                address: item.address,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                obs: item.obs,
              };
            }),
            price: trip?.price,
            tripDiscountCoupon: {
              oldPrice: trip?.tripDiscountCoupon?.oldPrice,
              userDiscountCouponId:
                trip?.tripDiscountCoupon?.userDiscountCouponId,
            },
            isOffer: trip?.isOffer ? 0 : 1,
          },
        ],
      };
      await createTrip(payload);
      !showAlert ? navigation.navigate('TripRoutes', {screen: 'Trip'}) : null;
    } catch (error) {
      dispatchTripCustomer({type: 'newTripError'});
      customToast(JSON.stringify(error), 'error');
    }
  };

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
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);

  return context;
};
