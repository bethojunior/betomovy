import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AppSocket from '../../services/socket';
import {customToast} from '../../../utils/FlashMessage';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
} from '../../constants/trip';

import {useLocal} from '../local';
import {decode} from '@googlemaps/polyline-codec';
import {translate} from '../../locales';
import apiMain from '../../api/apiMain';
import Helper from '../../utils/Helper';
import {showMessage} from 'react-native-flash-message';
import {useAuth} from '../../../context/auth';
import {appProccess, buildApp} from '../../../constantBuild/config';
import {
  convertDatetimeToDate,
  convertDatetimeToTime,
} from '../../utils/FormatDate';
import Push from '../../services/push';
import { TripRealtime } from '../../services/realtime/TripRealtime';

interface TripGLContextData {
  origin?: any;
  destination?: any;
  waypoints?: any;
  waypointQuantities?: number;
  prices?: any;
  polylineCoordinates?: any;
  tripPaymentMethods?: any;
  selectedPaymentMethod?: any;
  showLoadingToGetPrices?: boolean;
  selectedOptionTravel?: boolean;
  hideTravelOptions?: boolean;
  visibleLookUpAddressesModal?: boolean;
  isLoading?: boolean;
  trip?: any;
  routeTrip?: any;
  completedTripData?: any;
  defaultRating?: number;
  setDefaultRating?: any;
  setOrigin?: any;
  setDestination?: any;
  setWaypoints?: any;
  setWaypointQuantities?: any;
  setSelectedOptionTravel?: any;
  setSelectedPaymentMethod?: any;
  setHideTravelOptions?: any;
  setVisibleLookUpAddressesModal?: any;
  setTrip?: any;
  setCompletedTripData?: any;
  handleTripStateChange?: any;
  tripStatus?: null;
  calculateAll?: any;
  getTripPaymentMethods?: any;
  handleSelectedPaymentMethod?: any;
  tripSchedule?: any;
  newTrip?: any;
  cancelTripByCustomer?: any;
  handleAvaliationDriver?: any;
  newTripSchedule?: any;
  routeTripScheduled?: any;
  getTrips?: any;
  cancelTripByCustomerSchedule?: any;
  storageFirstPolyline?: any;
  getActiveTripScheduled?: any;
  locale?: any;
  setLocale?: any;
  trips?: any;
  dataCalculate: {};
  tripActiveDetails?: any;
}

const TripGLContext = createContext({} as TripGLContextData);
export const TripGLProvider = ({children}: any) => {
  const {position, setLastPlaceSelected} = useLocal();
  const [origin, setOrigin] = useState({});
  const [locale, setLocale] = useState({});
  const [destination, setDestination] = useState({});
  const [stateWHile, setStateWHile] = useState(true);
  const [waypoints, setWaypoints] = useState([]);
  const [waypointQuantities, setWaypointQuantities] = useState(0);
  const [prices, setPrices] = useState([]);
  const [polylineCoordinates, setPolylineCoordinates] = useState(null);
  const [polylineCoordinatesSchedule, setPolylineCoordinatesSchedule] =
    useState(null);
  const [tripPaymentMethods, setTripPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});
  const [showLoadingToGetPrices, setShowLoadingToGetPrices] = useState(false);
  const [selectedOptionTravel, setSelectedOptionTravel] = useState<any>({});
  const [distance, setDistance] = useState(0);
  const [estimatedTripTime, setEstimatedTripTime] = useState(0);
  const [hideTravelOptions, setHideTravelOptions] = useState(true);
  const [routeTrip, setRouteTrip] = useState(null);
  const [routeTripScheduled, setRouteTripScheduled] = useState(null);
  const [detailsTripScheduled, setDetailsTripScheduled] = useState(null);
  const [visibleLookUpAddressesModal, setVisibleLookUpAddressesModal] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [trip, setTrip] = useState<any>({});
  const [tripSchedule, setTripSchedule] = useState<any>({});
  const [completedTripData, setCompletedTripData] = useState();
  const socketRouteTrip = useRef<any>(null);
  const [defaultRating, setDefaultRating] = useState(5);
  const {user, cityConfig} = useAuth();
  const navigation = useNavigation();
  const [tripStatus, setTripStatus] = useState(null);
  const [dataCalculate, setDataCalculate] = useState({});
  const tripRealtime = useMemo(() => new TripRealtime(), []);

  const socketOnTripSchedule = async () => {
    if (
      Object.keys(tripSchedule).length > 0 &&
      position &&
      cityConfig !== null
    ) {
      if (tripSchedule.status === STATUS_SEARCHING) return;
      if (tripSchedule.status === STATUS_FINISHED) return;
      if (tripSchedule.status === STATUS_CANCELED) return;
      if (tripSchedule.status === STATUS_IN_PROGRESS) return;

      let url = buildApp().HOST_API_APP.replace('https', 'http');
      if (appProccess === 'aws') {
        url = buildApp().HOST_SOCKET;
      }
      socketRouteTrip.current = new AppSocket(
        // @ts-ignore: Unreachable code error
        `${url}${cityConfig.configDriverLocation.port_url}`,
        // @ts-ignore: Unreachable code error
        {
          query: `tripReference=${tripSchedule.tripReference}`,
        },
      );

      socketRouteTrip.current.onEvent(
        `location-${tripSchedule.tripReference}`,
        (result: any) => {
          if (!result) return;

          setRouteTripScheduled(result);

          setPolylineCoordinates(
            // @ts-ignore: Unreachable code error
            decode(result.polyline).map(item => {
              return {latitude: item[0], longitude: item[1]};
            }),
          );
        },
      );

      navigation.navigate('GetLightTripCurrent');
    }
  };

  const tripActiveDetails = async (tripReference: string) => {
    try {
      const response = await apiMain.post(`Trip/Get`, {
        stdObject: [
          {
            tripReference,
          },
        ],
      });
      setTripSchedule(response.data.data);
      return response.data.data;
      // return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getActiveTripSchedule = useCallback(async () => {
    tripRealtime.checkTripAccepted(
      user.idUser,
      STATUS_ACCEPTED,
      async (trip: any, type: string) => {
        console.log("callback getActiveTripSchedule =>>>>", trip)
        if (['added','modified'].includes(type)) {
          await tripActiveDetails(trip.tripReference);
        }
      },
    );
  }, [user, STATUS_BOARDING]);

  useEffect(() => {
    tripRealtime.checkTripAcceptedScheduled(
      user.idUser,
      STATUS_SCHEDULED,
      (trip, type) => {
        if (type === 'modified') {
          trip?.driver &&
            customToast(
              `${trip?.driver?.name} ${translate(
                'schedule.accepted_your_service_from',
              )} ${convertDatetimeToDate(
                trip?.schedule?.schedule,
              )} - ${convertDatetimeToTime(trip?.schedule?.schedule)} `,
              'success',
              6000,
            );
          Push.sendSimple({
            title: `${translate('schedule.accepted_service')}`,
            message: '',
            body: `${translate(
              'schedule.your_service_scheduled_at',
            )} ${convertDatetimeToDate(
              trip?.schedule?.schedule,
            )} - ${convertDatetimeToTime(trip?.schedule?.schedule)}`,
          });
        }
      },
    );
  }, []);

  const getStatus = async (status: string, driverCanceled: boolean = true) => {
    if (status === STATUS_BOARDING) {
      customToast(translate('schedule.driverNow'), 'success');
      setTripStatus(status);
      return;
    } else if (status === STATUS_IN_PROGRESS) {
      customToast(translate('schedule.serviceInit'), 'success');
      setRouteTripScheduled(null);
      setTripSchedule({});
      setTripStatus(null);
      navigation.navigate('InitalServiceGetLight');
      await AsyncStorage.setItem('tripSchedule', JSON.stringify(tripSchedule));
      return;
    } else if (status === STATUS_FINISHED) {
      customToast(translate('schedule.service_finished'), 'success');
      setRouteTripScheduled(null);
      setTripSchedule({});
      setTripStatus(null);
      navigation.navigate('InitalServiceGetLight');
      await AsyncStorage.setItem('tripSchedule', JSON.stringify(tripSchedule));
      return;
    } else if (status === STATUS_CANCELED) {
      setRouteTripScheduled(null);
      setTripSchedule({});
      setTripStatus(null);
      navigation.navigate('InitalServiceGetLight');
      await AsyncStorage.removeItem('tripSchedule');
      driverCanceled &&
        customToast(translate('schedule.service_cancel'), 'error');
      return;
    }
  };

  const handleTripStatusChange = (tripReference: string) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    tripRealtime.getTrip(tripReference, (trip: any, type: string) => {
      if (['added','modified'].includes(type)) {
        setTripStatus(trip.status);
        getStatus(trip.status);
      }
      if (type === 'removed') {
        tripActiveDetails(trip.tripReference).then(trip => {
          getStatus(trip.status, trip?.canceledBy === 'driver');

          if (trip.status === STATUS_CANCELED) {
            setTripStatus(trip.status);
          }
          if (trip.status === STATUS_FINISHED) {
            setTripStatus(trip.status);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (stateWHile) {
      getActiveTripSchedule().then(() => setStateWHile(false));
    }
  }, [stateWHile]);

  useEffect(() => {
    if (
      tripSchedule != null &&
      Object.keys(tripSchedule).length > 0 &&
      position &&
      cityConfig !== null
    ) {
      handleTripStatusChange(tripSchedule.tripReference);
    }
    socketOnTripSchedule();
  }, [tripSchedule]);

  async function getTripPaymentMethods() {
    const {data} = await apiMain.post('TripPaymentForm/GetAll', {});

    setTripPaymentMethods(data.data);
  }

  async function calculateAll(origin: any, destiny: any, waypoints: any) {
    setShowLoadingToGetPrices(true);
    if (origin == undefined || destiny == undefined || waypoints == undefined) {
      return console.log(false);
    }
    const {data} = await apiMain.post('price/calculateAll', {
      origin,
      destiny,
      waypoints,
      timeCurrent: new Date().toLocaleTimeString(),
    });
    if (data.data == null) {
      setIsLoading(false);
      setShowLoadingToGetPrices(false);
      customToast(translate('schedule.avaiable'), 'error');
      setPrices([]);
      return console.log('caiu aqui ');
    }
    // if (!data.data.distance) {
    //   console.log(data.data);
    //   setShowLoadingToGetPrices(false);
    //   setDistance(0);
    //   setPrices([]);

    //   return console.log('caiu aqui 2');
    // }
    setTimeout(() => {
      setShowLoadingToGetPrices(false);
    }, 2000);

    if (
      data.data != null &&
      !polylineCoordinates &&
      Object.keys(tripSchedule).length === 0
    ) {
      setPolylineCoordinates(
        // @ts-ignore: Unreachable code error
        decode(data.data.overview_polyline.points).map(item => {
          return {latitude: item[0], longitude: item[1]};
        }),
      );
    }

    // const pricesInOrder = await verifyOrderPrices(data.data).then((data) =>
    //   data.prices.filter((price) => price.tripType.freightOption == false)
    // );
    setDataCalculate(data.data);
    setDistance(data.data.distance);
    setEstimatedTripTime(data.data.duration);
    setPrices(data.data.prices);
    AsyncStorage.setItem('listPrices', JSON.stringify(data.data.prices));
  }

  async function handleSelectedPaymentMethod(selectedPaymentMethod: any) {
    await AsyncStorage.setItem(
      'lastSelectedPaymentMethod',
      JSON.stringify(selectedPaymentMethod),
    );
    setSelectedPaymentMethod(selectedPaymentMethod);
  }

  async function getTrips(status = null, page = 1, setDataPage: any) {
    const {data} = await apiMain.post('Customer/GetTrips', {
      customerId: user.idCustomer,
      status: status,
      page: page,
    });

    setDataPage(data.data.paginate);
    // console.log(data.data.paginate);
    if (!data.status) {
      return customToast(data.message, 'warning');
    }

    setTrips(data.data.trips);
  }

  async function cancelTripByCustomerSchedule(
    tripReference: any,
    status = STATUS_CANCELED,
  ) {
    setIsLoading(true);
    const payload = {
      stdObject: [
        {
          status,
          userId: user.idUser,
          tripReference: tripReference,
          dateEnd: Helper.getNow(),
        },
      ],
    };

    const {data} = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      setIsLoading(false);
      customToast(translate('service.toast_sucess'), 'success');
      AsyncStorage.removeItem('tripSchedule');
      navigation.navigate('InitalServiceGetLight');
    } else {
      setIsLoading(false);
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

  async function newTripSchedule(
    schedule: any,
    scheduleISO: any,
    cardSelected: any,
  ) {
    const payload = {
      stdObject: [
        {
          origin,
          destination,
          userId: user.idUser,
          cardId: cardSelected !== '' ? cardSelected : null,
          tripTypeId: selectedOptionTravel.tripTypeId,
          // @ts-ignore: Unreachable code error
          tripPaymentFormId: selectedPaymentMethod?.idTripPaymentForm,
          waypoints,
          tolls: [],
          schedule: schedule,
          scheduleISO: scheduleISO,
          price: selectedOptionTravel.price,
          priceId: selectedOptionTravel.idPrice,
          favorites: null,
          multiplierDynamic: 0,
          tripDiscountCoupon: null,
          isFavorite: true,
          distance,
          estimatedTripTime,
        },
      ],
    };

    const {data} = await apiMain.post('Customer/NewTrip', payload);
    if (!data.status) {
      return customToast(data.message, 'warning');
    }
    customToast(translate('schedule.toast_sucess'), 'success');
    navigation.navigate('InitalServiceGetLight');
    setShowLoadingToGetPrices(false);
    setHideTravelOptions(true);
    setPolylineCoordinates(null);
    setTrip(data.data);
  }

  const value = useMemo(() => {
    return {
      origin,
      destination,
      waypoints,
      waypointQuantities,
      prices,
      polylineCoordinates,
      tripPaymentMethods,
      selectedPaymentMethod,
      showLoadingToGetPrices,
      selectedOptionTravel,
      hideTravelOptions,
      visibleLookUpAddressesModal,
      isLoading,
      trip,
      routeTrip,
      routeTripScheduled,
      completedTripData,
      defaultRating,
      setDefaultRating,
      setOrigin,
      setDestination,
      setWaypoints,
      setWaypointQuantities,
      setSelectedOptionTravel,
      setSelectedPaymentMethod,
      setHideTravelOptions,
      setVisibleLookUpAddressesModal,
      setTrip,
      setCompletedTripData,
      handleTripStatusChange,
      calculateAll,
      getTripPaymentMethods,
      handleSelectedPaymentMethod,
      setTripSchedule,
      getTrips,
      trips,
      cancelTripByCustomerSchedule,
      tripSchedule,
      newTripSchedule,
      tripStatus,
      getActiveTripSchedule,
      setLocale,
      locale,
      dataCalculate,
      tripActiveDetails,
    };
  }, [
    origin,
    destination,
    waypoints,
    waypointQuantities,
    prices,
    polylineCoordinates,
    tripPaymentMethods,
    selectedPaymentMethod,
    showLoadingToGetPrices,
    selectedOptionTravel,
    hideTravelOptions,
    visibleLookUpAddressesModal,
    isLoading,
    trip,
    routeTrip,
    routeTripScheduled,
    completedTripData,
    defaultRating,
    setDefaultRating,
    setOrigin,
    setDestination,
    setWaypoints,
    setWaypointQuantities,
    setSelectedOptionTravel,
    setSelectedPaymentMethod,
    setHideTravelOptions,
    setVisibleLookUpAddressesModal,
    setTrip,
    setCompletedTripData,
    handleTripStatusChange,
    calculateAll,
    getTripPaymentMethods,
    handleSelectedPaymentMethod,
    setTripSchedule,
    getTrips,
    trips,
    cancelTripByCustomerSchedule,
    tripSchedule,
    tripStatus,
    getActiveTripSchedule,
    setLocale,
    locale,
    newTripSchedule,
    dataCalculate,
    tripActiveDetails,
  ]);
  return (
    <TripGLContext.Provider value={value}>{children}</TripGLContext.Provider>
  );
};
export const useTripGL = () => {
  const context = useContext(TripGLContext);
  return context;
};
