/* eslint-disable @typescript-eslint/no-shadow */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
} from 'expo-location';
import {Alert, AppState, DeviceEventEmitter, Platform} from 'react-native';
import _ from 'lodash';
import {VolumeManager} from 'react-native-volume-manager';
import {
  RecalculatedProps,
  TripStatusContextChildren,
  TripStatusContextType,
} from './types';
import {useUserDriver} from '../userDriver';
import {calculateDistanceFromLatLonInMeters} from '../../../../client/utils/position';
import {TripStatusService} from './service';
import {translate} from '../../../../client/locales';
import {useTripProvider} from '../Trip';
import {
  TRIP_CALL_CORPORATE,
  TRIP_CALL_RIDE,
  STATUS_PRE_ACCEPTED,
} from '../../constants/trip';
import {useAuth} from '../../../../context/auth';
import {TripInfo} from '../Trip/types';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useConfigLocal} from '../ConfigLocal';
import MapService from '../../../../client/services/mapService';
import {useStorage} from '../../../../utils/Storage';
import {diferenceBetweenNumber} from '../../utils/money';

const TripStatusContext = createContext<TripStatusContextType>(
  {} as TripStatusContextType,
);

export const TripStatusProvider = ({children}: TripStatusContextChildren) => {
  const [statusTrip, setStatusTrip] = useState('');
  const [hasRecalculation, setHasRecalculation] = useState(false);
  const [recalculated, setRecalculated] = useState({} as RecalculatedProps);
  const [countTakeVolume, setCountTakeVolume] = useState(0);
  const [buttonTargetVisibility, setButtonTargetVisibility] = useState(false);
  const [metersRound, setMetersRound] = useState(0);
  const [minutesTraveled, setMinutesTraveled] = useState(0);
  const {userDriverFind, setUserDriverFind, getDriverFind} = useUserDriver();
  const {dispatchTrip, stateTrip, verifyExistTrip} = useTripProvider();

  const {tripAccepted, tripPreAccepted} = stateTrip;
  const {cityConfig, generalSettings} = useAuth();
  const {itsNetwork} = useNetwork();
  const {states} = useConfigLocal();
  const {payloadInScreen} = states;

  const {getItem} = useStorage();

  const service = TripStatusService();

  const verifyTrip = async (tripReference: string) => {
    const response = await verifyExistTrip(tripReference);
    if (
      response &&
      Object.keys(response).length > 0 &&
      response?.status !== 'finished' &&
      response?.status !== 'canceled'
    ) {
      return response;
    }

    dispatchTrip({type: 'update', field: 'tripAccepted', arg: {}});
    return null;
  };
  const volumeChangesAfterOneRef = useRef(0);
  const trackChangesRef = useRef(false);
  let resetTimeout = null; // Para armazenar o ID do setTimeout

  const updateVolumeCount = () => {
    if (AppState.currentState === 'active') {
      setCountTakeVolume(prev => prev + 1);
    }
  };

  const clearStorageTaximeter = () => {
    AsyncStorage.multiRemove([
      'startTaximetro',
      'currentTimeTaximeter',
      'priceTaximeter',
      'taximeterIsPause',
      'fare',
      'routeTraveledTaximeter',
      'lastKmTaximeter',
      'TX-timeBg',
    ]);
  };

  const initTripCallTaximeter = async trip => {
    const tripAtt = {
      ...trip,
      initTaximeter: true,
    };
    await dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: tripAtt,
    });
  };

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    VolumeManager.addVolumeListener(result => {
      if (result.volume === 1) {
        VolumeManager.setVolume(0.8);
        trackChangesRef.current = true;
        volumeChangesAfterOneRef.current = 0;

        if (resetTimeout) clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          volumeChangesAfterOneRef.current = 0;
          trackChangesRef.current = false;
        }, 500);

        return;
      }

      if (trackChangesRef.current) {
        volumeChangesAfterOneRef.current += 1;
      }

      if (trackChangesRef.current && volumeChangesAfterOneRef.current === 7) {
        updateVolumeCount();
        trackChangesRef.current = false;
      }
    });

    return () => {
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') return;

    let volumeWasMax = false;
    let resetTimeout;

    const volumeEmitter = DeviceEventEmitter.addListener(
      'onVolumeButtonPressed',
      async result => {
        const volumeUp = result?.type === 'VOLUME_UP_PRESSED';
        const volumeActual = await VolumeManager.getVolume();
        if (Number(volumeActual?.volume) === 1 && volumeUp) {
          if (volumeWasMax) {
            trackChangesRef.current = true;
            volumeChangesAfterOneRef.current += 1;

            if (resetTimeout) clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
              volumeChangesAfterOneRef.current = 0;
              trackChangesRef.current = false;
            }, 800);
          } else {
            volumeWasMax = true;
            volumeChangesAfterOneRef.current = 0;
          }
        } else {
          volumeWasMax = false;
          trackChangesRef.current = false;
          volumeChangesAfterOneRef.current = 0;
        }

        if (trackChangesRef.current && volumeChangesAfterOneRef.current === 5) {
          updateVolumeCount();
          volumeChangesAfterOneRef.current = 0;
          trackChangesRef.current = false;
          if (resetTimeout) clearTimeout(resetTimeout);
        }
      },
    );

    return () => {
      if (resetTimeout) clearTimeout(resetTimeout);
      if (volumeEmitter) volumeEmitter?.remove();
    };
  }, []);

  useEffect(() => {
    const getTrip = async () => {
      const trip = JSON.parse(await AsyncStorage.getItem('tripDriver'));
      if (trip !== null) {
        const response = await verifyTrip(trip.tripReference);
        if (!response) {
          return;
        }
        dispatchTrip({type: 'update', field: 'tripAccepted', arg: trip || {}});

        if (trip.status === 'in_progress' && trip?.tripWayPoints.length !== 0) {
          const waypoints = trip.tripWayPoints.filter(waypoint => {
            return waypoint.confirmed === '0';
          });

          if (waypoints.length > 0) {
            return setStatusTrip(translate('statusTrip.waypoint'));
          }
          return setStatusTrip(translate('statusTrip.in_progress'));
        }

        if (trip.status === 'pre_accepted') {
          return '';
        }

        return setStatusTrip(translate(`statusTrip.${[trip.status]}`));
      }
      setStatusTrip(translate('statusTrip.accepted'));
      return dispatchTrip({type: 'update', field: 'tripAccepted', arg: {}});
    };

    if (
      tripAccepted === null ||
      (tripAccepted && Object.keys(tripAccepted).length === 0)
    ) {
      getTrip();
    }

    if (statusTrip === '' || statusTrip === translate('statusTrip.undefined')) {
      setStatusTrip(translate(`statusTrip.${tripAccepted.status}`));
    }
  }, []);

  useEffect(() => {
    if (!statusTrip || statusTrip === translate('statusTrip.undefined')) {
      if (tripAccepted?.status)
        setStatusTrip(translate(`statusTrip.${tripAccepted?.status}`));
    }
  }, [tripAccepted]);

  useEffect(() => {
    const verifyTripPreAccepted = async () => {
      const haveTripPreAccepted = JSON.parse(
        await AsyncStorage.getItem('preAvailableTrip'),
      );

      if (haveTripPreAccepted !== null) {
        dispatchTrip({
          type: 'update',
          field: 'tripPreAccepted',
          arg: haveTripPreAccepted,
        });
      }
    };

    // AsyncStorage.removeItem('preAvailableTrip');
    if (Object.keys(tripPreAccepted).length === 0) {
      verifyTripPreAccepted();
    }
  }, []);

  const clearDataTrip = async () => {
    await AsyncStorage.removeItem('tripCallKnob');
    await AsyncStorage.removeItem('valueCancellationFeeByCustomer');
    await AsyncStorage.removeItem('tripDriver');
    setStatusTrip(translate('statusTrip.accepted'));

    // userDriverFind.status = 'disponivel';
    // setUserDriverFind(userDriverFind);
    await getDriverFind();
    dispatchTrip({type: 'clearTripAccepted'});
  };

  const getDistanceLocation = async (location1, location2) => {
    const deg2rad = deg => {
      return deg * (Math.PI / 180);
    };
    const R = 6371;
    const dLat = deg2rad(location1.lat - location2.lat);
    const dLng = deg2rad(location1.lng - location2.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(location2.lat)) *
        Math.cos(deg2rad(location2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // eslint-disable-next-line radix
    return parseInt((R * c * 1000).toFixed());
  };

  const informArrival = async () => {
    try {
      let lastPosition = await getLastKnownPositionAsync();

      if (lastPosition == null) {
        lastPosition = await getCurrentPositionAsync({accuracy: 1});
      }

      const driverPosition = {
        lat: parseFloat(String(lastPosition.coords.latitude)),
        lng: parseFloat(String(lastPosition.coords.longitude)),
      };

      const clientPosition = {
        lat: parseFloat(tripAccepted.origin.latitude),
        lng: parseFloat(tripAccepted.origin.longitude),
      };

      const meters = await getDistanceLocation(driverPosition, clientPosition);

      if (meters > 100) {
        Alert.alert(
          translate('trip.too_distance_to_arrive_title'),
          translate('trip.too_distance_to_arrive_description'),
          [
            {
              text: translate('finishTrip.text_yes'),
              onPress: () => {
                return showArrivalDriver();
              },
            },
            {
              text: translate('finishTrip.text_no'),
              onPress: () => {
                tripAccepted.status = 'accepted';
                return setStatusTrip(
                  translate('driverTrip.text_signal_arrival'),
                );
              },
            },
          ],
        );
        return true;
      }
      return showArrivalDriver();
    } catch (error) {
      console.log(error);
    }
  };

  const showArrivalDriver = async () => {
    const result = await service.arrival(tripAccepted.tripReference);

    if (!result.data.status) {
      return false;
    }

    // VER SE ISSO AQUI É REALMENTE NECESSARIO
    // responseStatusTrip(result);

    if (result.data.paymentInfo !== undefined) {
      await AsyncStorage.setItem(
        'paymentInfo',
        JSON.stringify(result.data.paymentInfo),
      );
      return '';
    }

    userDriverFind.preAvailable = '0';
    setUserDriverFind(userDriverFind);
    dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: result.data.data,
    });
    await AsyncStorage.setItem('tripDriver', JSON.stringify(result.data.data));
    await AsyncStorage.removeItem('paymentInfo');
    setStatusTrip(translate('statusTrip.boarding'));
    return true;
  };

  const setTripNow = async (field: string, trip: TripInfo) => {
    const tripNew = await verifyTrip(trip.tripReference);
    await dispatchTrip({
      type: 'update',
      field: field,
      arg: tripNew || {},
    });
  };

  const initTripsActive = async () => {
    const {data}: {data: {trips: TripInfo[]}} = await service.getTripsActives(
      userDriverFind?.idDriver,
    );

    if (data?.trips) {
      checkIfTripForDriver(data?.trips);
    } else {
      setTripNow('tripAccepted', {} as TripInfo);
    }
  };

  const checkIfTripForDriver = (trips: TripInfo[]) => {
    if (trips?.length > 0) {
      trips?.map(async trip => {
        if (trip?.status === STATUS_PRE_ACCEPTED) {
          return setTripNow('tripPreAccepted', trip);
        }
        if (trip?.status !== STATUS_PRE_ACCEPTED) {
          setStatusTrip(translate(`statusTrip.${trip?.status}`));
          return setTripNow('tripAccepted', trip);
        }
      });
    } else {
      setTripNow('tripAccepted', {} as TripInfo);
    }
  };

  const mountTripPreAccepted = async (tripAccepted, tripOnly = {}) => {
    if (tripAccepted?.status === STATUS_PRE_ACCEPTED) {
      await dispatchTrip({
        type: 'update',
        field: 'tripPreAccepted',
        arg: tripAccepted,
      });

      await dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: Object.keys(tripOnly).length > 0 ? tripOnly : {},
      });
    }
  };

  const initTrip = async () => {
    try {
      const data = await service.init(tripAccepted.tripReference);
      if (!data.data.status) {
        return false;
      }

      await AsyncStorage.setItem(
        'dateTimeInProgress',
        JSON.stringify(new Date()),
      );
      await AsyncStorage.removeItem('routeTraveled');

      dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: data?.data?.data || {},
      });

      await AsyncStorage.setItem('tripDriver', JSON.stringify(data.data.data));

      const trip = data?.data;

      if (trip?.data?.tripCallType === 'CHAMADA TAXÍMETRO') {
        await initTripCallTaximeter(trip?.data);
      }

      if (
        trip.tripCallTypeId === TRIP_CALL_CORPORATE ||
        trip.tripCallTypeId === TRIP_CALL_RIDE
      ) {
        return '';
      }

      // await AsyncStorage.setItem('lastPosition', JSON.stringify(position)); //complicado

      const waypoints = tripAccepted.tripWayPoints.filter(waypoint => {
        return waypoint.confirmed === '0';
      });

      if (waypoints.length > 0) {
        setStatusTrip(translate('statusTrip.waypoint'));
      } else {
        setStatusTrip(translate('statusTrip.in_progress'));
        // await verifyPositionPreAvailable(data.data.data, false); //complicado
      }
      /** if (ConfigGeneral().get('lite_map_option') == false){
         LEMBRAR DE IMPLEMENTAR
         elementProperty.addClass('.footer-race', 'minimize');
        return '';
      } * */

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const confirmStop = async () => {
    try {
      const waypoints = tripAccepted.tripWayPoints.filter(waypoint => {
        return waypoint.confirmed === '0';
      });

      const waypoint = waypoints[0];

      if (waypoint.obs) {
        // showInfoDeliveryPlace(waypoint.obs);
        return '';
      }

      const data = await service.confirmWaypoint(waypoint.id);

      if (!data.status) {
        return false;
      }
      dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: data?.data?.data || {},
      });

      await AsyncStorage.setItem('tripDriver', JSON.stringify(data.data.data));

      if (waypoints.length > 1) {
        setStatusTrip(translate('statusTrip.waypoint'));
      } else {
        setStatusTrip(translate('statusTrip.in_progress'));
      }
      return true;
      // responseStatusTrip(data);
      // ESSA FUNC ATUALIZA OS DADOS DA CORRIDA,
      // ACREDITO QUE N SEJA MAIS NECESSARIA
      // showDataTrip();
    } catch (error) {
      console.log(error);
    }
  };

  const getKmRouteTraveled = async () => {
    let meters = 0;

    let routeTraveled = (await getItem('routeTraveled', false)) || [];

    if (routeTraveled.length === 0) {
      return 0;
    }

    routeTraveled = MapService.decodePolyline(routeTraveled);

    // eslint-disable-next-line array-callback-return
    routeTraveled.map((point, index) => {
      if (index === 0) {
        return;
      }

      meters += calculateDistanceFromLatLonInMeters(
        routeTraveled[index - 1],
        point,
      );
    });
    setMetersRound(meters);
    return meters / 1000;
  };

  const clearMonitoringTraveled = () => {
    setMetersRound(0);
    setMinutesTraveled(0);
  };

  async function getMinutesRouteTraveled() {
    const dateTime = JSON.parse(
      await AsyncStorage.getItem('dateTimeInProgress'),
    );
    if (Array.isArray(dateTime) || !dateTime) {
      return 0;
    }

    const start = Number(new Date(dateTime));

    const end = Number(new Date());
    setMinutesTraveled((end - start) / 60 / 1000);
    return (end - start) / 60 / 1000;
  }

  const checkTaxCancellationFee = async () => {
    const data = JSON.parse(
      await AsyncStorage.getItem('valueCancellationFeeByCustomer'),
    );
    if (data === null) {
      return 0;
    }

    return data.value;
  };

  const checkAdditionalValueKM = async (
    km,
    km_to_additional_value,
    additional_value_after_km,
    type_additional_value_after_km,
  ) => {
    if (
      parseFloat(km_to_additional_value) > 0 &&
      km >= parseFloat(km_to_additional_value)
    ) {
      switch (type_additional_value_after_km) {
        case 'km':
          return (
            (km - parseFloat(km_to_additional_value)) *
            parseFloat(additional_value_after_km)
          );
        case '$':
          return parseFloat(additional_value_after_km);
        default:
          return 0;
      }
    }

    return 0;
  };

  const checkTripDiscountCoupon = (value, tripDiscountCoupon) => {
    if (tripDiscountCoupon !== null) {
      switch (tripDiscountCoupon.valueType) {
        case '%':
          return value - (value * parseFloat(tripDiscountCoupon.value)) / 100;
        case '$':
          return value - parseFloat(tripDiscountCoupon.value);
        default:
          return value;
      }
    }
    return value;
  };

  const checkMultiplierDynamic = (value, multiplierDynamic) => {
    if (multiplierDynamic == null) {
      return value;
    }

    if (parseFloat(multiplierDynamic) === 0) {
      return value;
    }

    return value * parseFloat(multiplierDynamic);
  };

  const calculateNewPrice = async (km, minute, isTaximeter = false) => {
    if (
      !isTaximeter &&
      km <= tripAccepted.distance &&
      generalSettings.find(
        item => item.key === 'enable_floating_price_recalculation',
      ).value === '0'
    ) {
      return tripAccepted.price;
    }

    const taxCancel = await checkTaxCancellationFee();
    const additionalValue = await checkAdditionalValueKM(
      km,
      tripAccepted.fare.km_to_additional_value,
      tripAccepted.fare.additional_value_after_km,
      tripAccepted.fare.type_additional_value_after_km,
    );

    const value =
      parseFloat(tripAccepted.fare.km_price) * km +
      parseFloat(tripAccepted.fare.minute_price) * parseInt(minute) +
      parseFloat(tripAccepted.fare.base_price) +
      parseFloat(tripAccepted.fare.another_fee) +
      parseFloat(tripAccepted.fare.tax_price) +
      parseFloat(tripAccepted.fare.waypoint_price) *
        tripAccepted.tripWayPoints.length +
      taxCancel +
      additionalValue;

    const newPrice = checkTripDiscountCoupon(
      checkMultiplierDynamic(value, tripAccepted.multiplierDynamic),
      tripAccepted.tripDiscountCoupon,
    );
    const minPrice = checkTripDiscountCoupon(
      checkMultiplierDynamic(
        tripAccepted.fare.min_price,
        tripAccepted.multiplierDynamic,
      ),
      tripAccepted.tripDiscountCoupon,
    );

    if (Number(payloadInScreen) === 1) {
      Alert.alert(
        'Mostrando payload do resultado',
        `km da corrida: ${km}\n` +
          `minutos da corrida: ${Number(minute)?.toFixed(2)}\n` +
          `taxas da corrida, para o calculo - : ${JSON.stringify(
            tripAccepted?.fare,
          )}\n`,
      );
    }

    if (Number(newPrice) < Number(minPrice)) {
      return minPrice;
    }

    return newPrice;
  };

  const verifyRecalculateFare = async (tripAccepted: TripInfo) => {
    try {
      const km = await getKmRouteTraveled();
      const minute = await getMinutesRouteTraveled();

      const valueMarginForRecalculation = parseFloat(
        cityConfig.marginForRecalculation,
      );

      const tripDistance = tripAccepted.distance;

      const estimatedTime = tripAccepted.estimatedTripTime;

      const willBeRecalculatedOrNot = () => {
        if (cityConfig.enableTripRecalculation !== '0') {
          return (
            km > parseFloat(cityConfig.recalculationFromKm) ||
            (tripDistance - valueMarginForRecalculation < km &&
              km < tripDistance + valueMarginForRecalculation) ||
            Number(minute?.toFixed(2)) !== estimatedTime
          );
        }
        return false;
      };

      if (!willBeRecalculatedOrNot()) {
        return null;
      }

      const newPrice = await calculateNewPrice(km, Number(minute?.toFixed(2)));

      const floatPrice = generalSettings.find(
        item => item.key === 'enable_floating_price_recalculation',
      ).value;

      if (floatPrice !== null) {
        if (diferenceBetweenNumber(tripAccepted.price, newPrice) >= 1) {
          if (floatPrice === 'false' || floatPrice == '0') {
            if (tripAccepted?.price < newPrice)
              return {
                price: newPrice,
                km,
                minute: Number(Number(minute).toFixed(2)),
              };
          } else {
            return {
              price: newPrice,
              km,
              minute: Number(Number(minute).toFixed(2)),
            };
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const onlyFinishTripOffline = async (trip: TripInfo) => {
    const result = await service.finish(trip?.tripReference);
  };

  const finishTrip = async (trip: TripInfo = tripAccepted) => {
    /** if (tripAccepted.deliveryInfo != null) {
      if (!Array.isArray(tripAccepted.deliveryInfo)) {
        // return showInfoDeliveryPlace(trip.deliveryInfo.obsDestination);
      }
    } * */

    /** if(trip.centralId && trip.haveReturn == true &&
     *    ConfigGeneral().get("end_trip_only_by_central") == true){
      return customToast(translate("Viagem só pode ser finalizar pela central de origem"), 'warn');
    } * */

    const recalculate = await verifyRecalculateFare(trip);

    if (recalculate !== null && itsNetwork) {
      if (
        !!cityConfig.enableChoicePriceTripRecalculation === true &&
        Number(recalculate.price) !== Number(trip.price) &&
        trip?.tripCallType !== 'CHAMADA TAXÍMETRO'
      ) {
        setRecalculated(recalculate);
        setHasRecalculation(true);
        userDriverFind.preAvailable = '0';
        setUserDriverFind(userDriverFind);
        tripAccepted.status = 'finished';
        dispatchTrip({
          type: 'update',
          field: 'tripAccepted',
          arg: tripAccepted,
        });

        return true;
      }
      // return applyTravelCalculation(recalculate);
      setHasRecalculation(false);
    }
    if (!itsNetwork) {
      const trip = {
        ...tripAccepted,
        tripOff: tripAccepted,
      };

      userDriverFind.preAvailable = '0';
      setUserDriverFind(userDriverFind);
      setStatusTrip(translate('statusTrip.accepted'));

      await dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: trip,
      });

      await AsyncStorage.setItem('tripOff', JSON.stringify(tripAccepted));

      return true;
    }
    const result = await service.finish(tripAccepted.tripReference);

    if (!result.status) {
      // return finishTripOffline();
      return false;
    }

    userDriverFind.preAvailable = '0';
    setUserDriverFind(userDriverFind);
    setStatusTrip(translate('statusTrip.accepted'));
    // tripAccepted.status = 'finished';

    dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: result.data.data,
    });

    await AsyncStorage.setItem('tripDriver', JSON.stringify(result.data.data));

    return true;
  };

  const finishTripRecalculated = async (
    chooseRecalc: boolean,
    trip = tripAccepted,
  ) => {
    if (chooseRecalc) {
      const result = await service.finishWithRecalc({
        tripReference: trip.tripReference,
        newPrice: recalculated.price,
        oldPrice: trip.price,
        newDistance: await getKmRouteTraveled(),
        newTripTime: await getMinutesRouteTraveled(),
      });

      if (!result.data.status) {
        // return finishTripOffline();
        return false;
      }
    }

    const finish = await service.finish(tripAccepted.tripReference);

    if (!finish.status) {
      // return finishTripOffline();
      return false;
    }

    setStatusTrip(translate('statusTrip.accepted'));
    setHasRecalculation(false);
    return true;
  };

  const checkStatusTrip = async () => {
    switch (tripAccepted.status) {
      case 'accepted': {
        return {
          callback: await informArrival(),
          status: translate('statusTrip.accepted'),
        };
      }
      case 'boarding': {
        return {
          callback: await initTrip(),
          status: translate('statusTrip.boarding'),
        };
      }
      case 'in_progress': {
        const waypoints = tripAccepted.tripWayPoints.filter(waypoint => {
          return waypoint.confirmed === '0';
        });

        if (waypoints.length > 0) {
          return {
            callback: await confirmStop(),
            status: translate('statusTrip.waypoint'),
            waypoint: true,
          };
        }

        return {
          callback: await finishTrip(),
          status: translate('statusTrip.in_progress'),
        };
      }
      case 'finished': {
        dispatchTrip({type: 'update', field: 'tripAccepted', arg: {}});

        // MOSTRAR UMA MENSAGEM E QUE A CORRIDA FINALIZOU OU O TRIP FINISH MODAL
        return {callback: false, status: ''};
      }
      default: {
        return null;
      }
    }
  };

  const value = useMemo(() => {
    return {
      clearDataTrip,
      getDistanceLocation,
      informArrival,
      showArrivalDriver,
      initTrip,
      confirmStop,
      finishTrip,
      checkStatusTrip,
      statusTrip,
      setStatusTrip,
      hasRecalculation,
      finishTripRecalculated,
      recalculated,
      onlyFinishTripOffline,
      countTakeVolume,
      setCountTakeVolume,
      buttonTargetVisibility,
      setButtonTargetVisibility,
      metersRound,
      minutesTraveled,
      mountTripPreAccepted,
      initTripsActive,
    };
  }, [
    clearDataTrip,
    getDistanceLocation,
    informArrival,
    showArrivalDriver,
    initTrip,
    confirmStop,
    finishTrip,
    checkStatusTrip,
    statusTrip,
    setStatusTrip,
    hasRecalculation,
    finishTripRecalculated,
    recalculated,
    onlyFinishTripOffline,
    countTakeVolume,
    setCountTakeVolume,
    buttonTargetVisibility,
    setButtonTargetVisibility,
    metersRound,
    minutesTraveled,
    mountTripPreAccepted,
    initTripsActive,
  ]);

  return (
    <TripStatusContext.Provider value={value}>
      {children}
    </TripStatusContext.Provider>
  );
};

export const useTripStatusProvider = () => {
  const context = useContext(TripStatusContext);

  return context;
};

export default TripStatusProvider;
