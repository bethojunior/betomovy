import { useEffect, useMemo, useRef, useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
} from 'expo-location';
import { Alert, AppState, DeviceEventEmitter, Platform } from 'react-native';
import _ from 'lodash';
import { VolumeManager } from 'react-native-volume-manager';
import {
  RecalculatedProps,
  TripStatusContextChildren,
  TripStatusContextType,
} from './types';
import { useUserDriver } from '../userDriver';
import { calculateDistanceFromLatLonInMeters } from '../../../../client/utils/position';
import { TripStatusService } from './service';
import { isRecalcAlreadyApplied } from '../../utils/tripUtils';
import { translate } from '../../../../client/locales';
import { useTripProvider } from '../Trip';
import {
  TRIP_CALL_CORPORATE,
  TRIP_CALL_RIDE,
  STATUS_PRE_ACCEPTED,
  STATUS_IN_PROGRESS,
} from '../../constants/trip';
import { useAuth } from '../../../../context/auth';
import { stateTripProps, TripInfo } from '../Trip/types';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { useConfigLocal } from '../ConfigLocal';
import MapService from '../../../../client/services/mapService';
import { useStorage } from '../../../../utils/Storage';
import { diferenceBetweenNumber } from '../../utils/money';
import { serviceTaximeter } from '../Taximeter/services';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { FinishedTripStorage } from '~/utils/Storage/finishedTripStorage';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { DriverStatusType } from '../../../../interfaces/driver';
import { storage } from '~/common/services/mmkv/storage';
import {
  useOfflineTripActions,
  offlineTripQueue,
  OFFLINE_TRIP_FINISHED_EVENT,
  OFFLINE_TAXIMETER_FLAG_KEY,
  OFFLINE_TAXIMETER_INFO_KEY,
} from '~/hooks/useOfflineTripActions';
import { sendCriticalRequest } from '~/utils/network';

function queueOfflineFinish(trip: TripInfo): void {
  if (trip.tripCallType !== 'CHAMADA TAXÍMETRO') {
    offlineTripQueue.addFinishTrip(trip.tripReference);
  }
}

const TripStatusContext = createContext<TripStatusContextType>(
  {} as TripStatusContextType,
);

export const TripStatusProvider = ({ children }: TripStatusContextChildren) => {
  const [statusTrip, setStatusTrip] = useState('');
  const [hasRecalculation, setHasRecalculation] = useState(false);
  const [recalculated, setRecalculated] = useState({} as RecalculatedProps);
  const [isFinishingTrip, setIsFinishingTrip] = useState(false);
  const [countTakeVolume, setCountTakeVolume] = useState(0);
  const [buttonTargetVisibility, setButtonTargetVisibility] = useState(false);
  const [metersRound, setMetersRound] = useState(0);
  const [minutesTraveled, setMinutesTraveled] = useState(0);
  const [shouldShowFinishModal, setShouldShowFinishModal] = useState(false);
  const { userDriverFind, setUserDriverFind, getDriverFind } = useUserDriver();

  const {
    dispatchTrip,
    stateTrip,
    verifyExistTrip,
    startMapSuggestionTimeout
  } = useTripProvider((context) => context);

  const { tripAccepted, tripPreAccepted } = stateTrip;

  const { cityConfig, generalSettings } = useAuth();
  const { itsNetwork } = useNetwork();
  const { states } = useConfigLocal();
  const { payloadInScreen } = states;

  const { getItem } = useStorage();

  // Activa drenagem automática da fila offline ao reconectar
  useOfflineTripActions();

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

    dispatchTrip({ type: 'update', field: 'tripAccepted', arg: {} });
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
    storage.removeItem('@App:recalculationData');
    storage.removeItem('@App:recalcSelectedPrice');
    setStatusTrip(translate('statusTrip.accepted'));
    await AsyncStorage.removeItem('tripOff');

    if (Object.keys(tripPreAccepted || {}).length === 0) {
      setUserDriverFind({ ...userDriverFind, status: 'disponivel' });
    }

    dispatchTrip({ type: 'clearTripAccepted' });

    await new Promise(resolve => {
      try {
        const { InteractionManager } = require('react-native');
        InteractionManager.runAfterInteractions(resolve);
      } catch {
        Promise.resolve().then(resolve);
      }
    });

    setIsFinishingTrip(false);
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
        lastPosition = await getCurrentPositionAsync({ accuracy: 1 });
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
        return new Promise<boolean>((resolve) => {
          Alert.alert(
            translate('trip.too_distance_to_arrive_title'),
            translate('trip.too_distance_to_arrive_description'),
            [
              {
                text: translate('finishTrip.text_yes'),
                onPress: async () => {
                  try {
                    const success = await showArrivalDriver();
                    resolve(!!success);
                  } catch {
                    resolve(false);
                  }
                },
              },
              {
                text: translate('finishTrip.text_no'),
                onPress: () => {
                  tripAccepted.status = 'accepted';
                  setStatusTrip(
                    translate('driverTrip.text_signal_arrival'),
                  );
                  resolve(true);
                },
              },
            ],
            { cancelable: false },
          );
        });
      }
      return await showArrivalDriver();
    } catch {
      return false;
    }
  };

  const showArrivalDriver = async () => {
    try {
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
      }

      userDriverFind.preAvailable = '0';
      const updatedDriver = { ...userDriverFind, status: 'corrida' as DriverStatusType };
      setUserDriverFind(updatedDriver);
      dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: result.data.data,
      });
      await AsyncStorage.setItem('tripDriver', JSON.stringify(result.data.data));
      await AsyncStorage.removeItem('paymentInfo');
      setStatusTrip(translate('statusTrip.boarding'));

      const currentLocation = userDriverFind.latitude && userDriverFind.longitude
        ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
        : undefined;
      emitDriverStatusChange(updatedDriver, 'corrida', cityConfig, currentLocation);
      emitDriverLocation(updatedDriver, currentLocation, cityConfig);

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (tripAccepted?.tripReference) {
        emitTripStatusChange(tripAccepted.tripReference, 'boarding', configCityId);
        emitDriverLocation(updatedDriver, currentLocation, cityConfig);
      }

      return true;
    } catch {
      return false;
    }
  };

  const setTripNow = async (field: keyof stateTripProps, trip: TripInfo) => {
    const tripNew = await verifyTrip(trip.tripReference);
    dispatchTrip({ type: 'update', field: field, arg: tripNew || {} });
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

      if (
        trip.tripCallTypeId === TRIP_CALL_CORPORATE ||
        trip.tripCallTypeId === TRIP_CALL_RIDE
      ) {
        return '';
      }

      if (
        data?.data?.data?.status === STATUS_IN_PROGRESS &&
        tripAccepted?.status === 'boarding'
      ) {
        startMapSuggestionTimeout();
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

      const updatedDriver = { ...userDriverFind, status: 'corrida' as any };
      const currentLocation = userDriverFind.latitude && userDriverFind.longitude
        ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
        : undefined;
      emitDriverStatusChange(updatedDriver, 'corrida', cityConfig, currentLocation);
      emitDriverLocation(updatedDriver, currentLocation, cityConfig);

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (tripAccepted?.tripReference) {
        emitTripStatusChange(tripAccepted.tripReference, 'in_progress', configCityId);
      }

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

  const calculateNewPrice = async (km, minute, waitingFees) => {
    if (
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

    // Calcula o valor total dos pedágios
    const tollsValue = tripAccepted.tolls && Array.isArray(tripAccepted.tolls)
      ? tripAccepted.tolls.reduce((acc: number, toll: any) => acc + parseFloat(toll.value || 0), 0)
      : 0;

    const value =
      parseFloat(tripAccepted.fare.km_price) * km +
      parseFloat(tripAccepted.fare.minute_price) * parseInt(minute) +
      parseFloat(tripAccepted.fare.base_price) +
      parseFloat(tripAccepted.fare.another_fee) +
      parseFloat(tripAccepted.fare.tax_price) +
      parseFloat(tripAccepted.fare.waypoint_price) *
      tripAccepted.tripWayPoints.length +
      taxCancel +
      additionalValue +
      tollsValue;

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
        )}\n` +
        `valor dos pedágios: ${tollsValue}\n` +
        `pedágios: ${JSON.stringify(tripAccepted?.tolls)}\n`,
      );
    }

    const waiting = await AsyncStorage.getItem("waitingTimer");
    const waitingParse = waiting?.length > 0 ? JSON.parse(waiting) : {};

    const pausedInMinutes = waitingParse?.totalPaused
      ? waitingParse.totalPaused
      : 0;

    const waitingPrice = waitingTimePrice(pausedInMinutes, Number(waitingFees.waiting_tolerance_seconds), Number(waitingFees.waiting_penalty_fee), Number(waitingFees.waiting_extra_fee_per_minute))

    const newPriceWithTime = Number(newPrice) + waitingPrice

    if (newPriceWithTime < Number(minPrice)) {
      return Number(minPrice);
    }

    return newPriceWithTime;
  };

  const waitingTimePrice = (
    seconds: number,
    toleranceInSeconds: number,
    taxPrice: number,
    taxByMinutesPrice: number
  ) => {
    let value = 0
    const timeAfterTolerance = (seconds - toleranceInSeconds) / 60

    value += seconds > toleranceInSeconds ? Number(taxPrice) : 0

    value += timeAfterTolerance > 0 ? timeAfterTolerance * Number(taxByMinutesPrice) : 0

    return Number(value.toFixed(2))
  }

  const recalculateWaitingTime = (waitingFees, km, resultTime, pausedInSeconds, price) => {
    const waitingPrice = waitingTimePrice(pausedInSeconds, Number(waitingFees.waiting_tolerance_seconds), Number(waitingFees.waiting_penalty_fee), Number(waitingFees.waiting_extra_fee_per_minute))
    return {
      price: Number(price) + waitingPrice,
      km,
      minute: Number(Number(resultTime).toFixed(2)),
    }
  }

  const verifyRecalculateFare = async (tripAccepted: TripInfo, waitingFees) => {
    try {
      const km = await getKmRouteTraveled();
      const minute = await getMinutesRouteTraveled();
      // removendo o tempo de espera do calculo final da viagem, para não cobrar duas vezes.
      const waiting = await AsyncStorage.getItem("waitingTimer");
      const waitingParse = waiting?.length > 0 ? JSON.parse(waiting) : {};

      const pausedInSeconds = waitingParse?.totalPaused
        ? waitingParse.totalPaused
        : 0;

      const resultTime = minute - (pausedInSeconds / 60);

      const valueMarginForRecalculation = parseFloat(
        cityConfig.marginForRecalculation,
      );

      if (pausedInSeconds > 0) {
        saveWaitingTime(
          Number(tripAccepted?.driver?.userId),
          tripAccepted.tripReference,
          pausedInSeconds
        )
      }

      const tripDistance = tripAccepted.distance;

      const estimatedTime = tripAccepted.estimatedTripTime;

      const willBeRecalculatedOrNot = () => {
        if (cityConfig.enableTripRecalculation !== '0') {
          return (
            km > parseFloat(cityConfig.recalculationFromKm) ||
            (tripDistance - valueMarginForRecalculation < km &&
              km < tripDistance + valueMarginForRecalculation) ||
            Number(resultTime?.toFixed(2)) !== estimatedTime
          );
        }
        return false;
      };

      if (!willBeRecalculatedOrNot()) {
        if (pausedInSeconds > 0) {
          return recalculateWaitingTime(waitingFees, km, resultTime, pausedInSeconds, tripAccepted?.price)
        }
        return null;
      }

      const newPrice = await calculateNewPrice(km, Number(resultTime?.toFixed(2)), waitingFees);

      if (newPrice == tripAccepted.price && pausedInSeconds > Number(waitingFees.waiting_tolerance_seconds)) {
        return recalculateWaitingTime(waitingFees, km, resultTime, pausedInSeconds, tripAccepted?.price)
      }

      const floatPrice = generalSettings.find(
        item => item.key === 'enable_floating_price_recalculation',
      ).value;

      const tollsValue = tripAccepted.tolls && Array.isArray(tripAccepted.tolls)
        ? tripAccepted.tolls.reduce((acc: number, toll: any) => acc + parseFloat(toll.value || 0), 0)
        : 0;

      if (floatPrice !== null) {
        if (diferenceBetweenNumber(tripAccepted.price, newPrice) >= 1) {
          if (floatPrice === 'false' || floatPrice == '0') {
            if (tripAccepted?.price < newPrice)
              return {
                price: newPrice,
                km,
                minute: Number(Number(resultTime).toFixed(2)),
                tolls: tripAccepted.tolls || [],
                tollsValue,
              };
          } else {
            return {
              price: newPrice,
              km,
              minute: Number(Number(resultTime).toFixed(2)),
              tolls: tripAccepted.tolls || [],
              tollsValue,
            };
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const clearDataCacheTaximeter = () => {
    storage.removeGroup([
      OFFLINE_TAXIMETER_FLAG_KEY,
      OFFLINE_TAXIMETER_INFO_KEY,
    ]);
  };

  const saveWaitingTime = async (userId: number, tripReference: string, timeInSeconds: number) => {
    try {
      const payload = {
        userId,
        tripReference,
        timeInSeconds
      }
      await service.saveWaitingTime(payload);
    } catch (error) { console.error(error) }
  }

  const cleaningWaitingTime = async () => {
    await AsyncStorage.removeItem("waitingTimer");
  }

  const getWaitingTimeFees = async (tripAccepted: TripInfo) => {
    const { data } = await service.getWaitingTimeFees({ tripTypeId: tripAccepted.tripTypeId, cityId: tripAccepted.cityId })
    if (!data.status) return;
    return data?.data;
  }

  const previewFinishTrip = async (trip: TripInfo = tripAccepted) => {
    setHasRecalculation(false);
    setRecalculated({} as RecalculatedProps);

    // Sem rede, pula chamada de API — waitingFees ficará null e cálculo usa zero
    let waitingFees = {
      waiting_tolerance_seconds: '0',
      waiting_penalty_fee: '0',
      waiting_extra_fee_per_minute: '0',
    };

    if (itsNetwork) {
      try {
        waitingFees = await getWaitingTimeFees(tripAccepted);
      } catch {
        waitingFees = null;
      }
    }

    const recalculate: RecalculatedProps = await verifyRecalculateFare(trip, waitingFees);

    if (recalculate !== null && itsNetwork) {
      if (
        !!cityConfig.enableChoicePriceTripRecalculation === true &&
        Number(recalculate.price) !== Number(trip.price) &&
        trip?.tripCallType !== 'CHAMADA TAXÍMETRO'
      ) {
        setRecalculated(recalculate);
        setHasRecalculation(true);
        storage.setItem('@App:recalculationData', JSON.stringify(recalculate), 'string');
        setShouldShowFinishModal(true);
        setUserDriverFind({ ...userDriverFind, preAvailable: "0" });
        tripAccepted.status = 'finished';
        dispatchTrip({
          type: 'update',
          field: 'tripAccepted',
          arg: tripAccepted,
        });
        cleaningWaitingTime()
        return true;
      }
      // return applyTravelCalculation(recalculate);
      setHasRecalculation(false);
      storage.removeItem('@App:recalculationData');
    }

    if (!itsNetwork) {
      const isTaximeterCall = tripAccepted.tripCallType === 'CHAMADA TAXÍMETRO';
      const hasOfflineRecalc = recalculate !== null && !isTaximeterCall;

      const baseTrip = hasOfflineRecalc
        ? { ...tripAccepted, price: recalculate.price }
        : tripAccepted;

      const trip = { ...baseTrip, tripOff: tripAccepted };

      setUserDriverFind({ ...userDriverFind, preAvailable: "0" });
      setStatusTrip(translate('statusTrip.accepted'));

      dispatchTrip({ type: 'update', field: 'tripAccepted', arg: trip });

      await AsyncStorage.setItem('tripOff', JSON.stringify(tripAccepted));
      cleaningWaitingTime();

      if (hasOfflineRecalc) {
        offlineTripQueue.addFinishTripWithRecalc({
          tripReference: tripAccepted.tripReference,
          oldPrice: Number(tripAccepted.price),
          newPrice: recalculate.price,
          newDistance: recalculate.km,
          newTripTime: recalculate.minute,
          tolls: recalculate?.tolls ?? [],
        });
      } else {
        queueOfflineFinish(trip);
      }

      return true;
    }

    setShouldShowFinishModal(true);
    return true;
  };

  const confirmFinishTrip = async (trip: TripInfo = tripAccepted) => {
    if (isFinishingTrip) return;

    setIsFinishingTrip(true);

    // Rede caiu entre o modal abrir e o usuário confirmar
    if (!itsNetwork) {
      queueOfflineFinish(trip);
      setShouldShowFinishModal(false);
      setIsFinishingTrip(false);
      await clearDataTrip();
      return true;
    }

    try {
      const sent = await sendCriticalRequest(() =>
        service.finish(trip.tripReference),
      );

      // Sem resposta do servidor: a finalização pode ter sido processada —
      // fica pendente de sincronização e o motorista segue usando o app
      if (!sent.delivered) {
        queueOfflineFinish(trip);
        setShouldShowFinishModal(false);
        await clearDataTrip();
        return true;
      }

      const result = sent.response;
      if (!result.status) {
        return false;
      }

      userDriverFind.preAvailable = '0';
      setUserDriverFind(userDriverFind);

      await AsyncStorage.setItem('tripDriver', JSON.stringify(result.data.data));

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (tripAccepted?.tripReference) {
        emitTripStatusChange(tripAccepted.tripReference, 'finished', configCityId);

        const currentLocation = userDriverFind.latitude && userDriverFind.longitude
          ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
          : undefined;
        emitDriverLocation(userDriverFind, currentLocation, cityConfig);
      }

      cleaningWaitingTime();
      setShouldShowFinishModal(false);
      await clearDataTrip();
      return true;
    } catch {
      return false;
    } finally {
      setIsFinishingTrip(false);
    }
  };

  const finishTrip = async (trip: TripInfo = tripAccepted): Promise<boolean> => {
    const canFinish = await previewFinishTrip(trip);
    if (!canFinish) return false;

    return true;
  };

  // Enfileira a finalização (com ou sem recálculo) para o drain offline e
  // libera o motorista — usado quando não há rede ou o servidor não responde
  const queueRecalculatedFinishOffline = async (
    chooseRecalc: boolean,
    trip: TripInfo,
  ) => {
    if (chooseRecalc && recalculated?.price) {
      offlineTripQueue.addFinishTripWithRecalc({
        tripReference: trip.tripReference,
        oldPrice: Number(trip.price),
        newPrice: recalculated.price,
        newDistance: recalculated.km,
        newTripTime: recalculated.minute,
        tolls: recalculated.tolls ?? [],
      });
    } else {
      queueOfflineFinish(trip);
    }

    resetRecalculation();
    setShouldShowFinishModal(false);
    setIsFinishingTrip(false);
    await clearDataTrip();
    return true;
  };

  const finishTripRecalculated = async (
    chooseRecalc: boolean,
    trip = tripAccepted,
    completeTripAfterRecalc = false,
  ) => {
    setIsFinishingTrip(true);

    // Rede caiu enquanto o modal de recálculo estava aberto
    if (!itsNetwork) {
      return queueRecalculatedFinishOffline(chooseRecalc, trip);
    }

    let result;

    // Fora do try: awaits não-HTTP — erro de programação aqui não pode ser
    // confundido com falha de rede pelo catch abaixo
    const newDistance = chooseRecalc ? await getKmRouteTraveled() : 0;
    const newTripTime = chooseRecalc ? await getMinutesRouteTraveled() : 0;

    try {
      const sent = await sendCriticalRequest(async () => {
        if (chooseRecalc) {
          const tollsInfo = trip.tolls && Array.isArray(trip.tolls)
            ? {
              tollsValue: trip.tolls.reduce((acc: number, toll: any) => acc + parseFloat(toll.value || 0), 0),
              tollsIds: trip.tolls.map((toll: any) => toll.id || toll.tollId)
            }
            : { tollsValue: 0, tollsIds: [] };

          // Passo 1: Recalcular preço
          const recalcResult = await service.finishWithRecalc({
            tripReference: trip.tripReference,
            newPrice: recalculated.price,
            oldPrice: trip.price,
            newDistance,
            newTripTime,
            tolls: tollsInfo.tollsIds,
            completeTripAfterRecalc: false,
          });

          const recalcAccepted =
            recalcResult?.data?.status || isRecalcAlreadyApplied(recalcResult?.data);

          if (!recalcAccepted) {
            return recalcResult;
          }

          // Passo 2: Finalizar a viagem explicitamente — recálculo já aplicado
          // numa tentativa anterior também segue para o finish
          if (trip?.tripReference) {
            FinishedTripStorage.add(trip.tripReference);
          }

          return service.finish(trip.tripReference);
        }

        if (completeTripAfterRecalc) {
          return service.finish(trip.tripReference);
        }

        return undefined;
      });

      // Sem resposta do servidor: fica pendente de sincronização
      if (!sent.delivered) {
        return queueRecalculatedFinishOffline(chooseRecalc, trip);
      }

      result = sent.response;
    } catch {
      setIsFinishingTrip(false);
      return false;
    }

    if (!result || !result.data || !result.data.status) {
      setIsFinishingTrip(false);
      return false;
    }

    if (result.data && result.data.data) {
      tripAccepted.status = 'finished';
      await dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: result.data.data
      });
      await AsyncStorage.setItem('tripDriver', JSON.stringify(result.data.data));
    }

    setIsFinishingTrip(false);
    const currentLocation = userDriverFind.latitude && userDriverFind.longitude
      ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
      : undefined;
    emitDriverLocation(userDriverFind, currentLocation, cityConfig);
    resetRecalculation();
    setShouldShowFinishModal(false);
    await clearDataTrip();
    return true;
  };

  const checkStatusTrip = async () => {
    switch (tripAccepted?.status) {
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
      case 'waiting': {
        return {
          callback: await finishWaitingTime(),
          status: translate('statusTrip.in_progress'),
        };
      }
      case 'finished': {
        dispatchTrip({ type: 'update', field: 'tripAccepted', arg: {} });

        // MOSTRAR UMA MENSAGEM E QUE A CORRIDA FINALIZOU OU O TRIP FINISH MODAL
        return { callback: false, status: '' };
      }
      case 'pre_accepted': {
        return {
          callback: await informArrival(),
          status: translate('statusTrip.accepted'),
        };
      }
      default: {
        return null;
      }
    }
  };

  const finishWaitingTime = async () => {
    const data = await service.finishWaiting(tripAccepted.tripReference);
    if (!data.data.status) {
      return false;
    }

    dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: data?.data?.data || {},
    });

    await AsyncStorage.setItem('tripDriver', JSON.stringify(data.data.data));
    return true;
  }

  const waitingFees = async () => {
    return await getWaitingTimeFees(tripAccepted)
  }

  const waitingTripStatus = async () => {
    const data = await service.waiting(tripAccepted.tripReference);
    if (!data.data.status) {
      return false;
    }

    dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: data?.data?.data || {},
    });

    await AsyncStorage.setItem('tripDriver', JSON.stringify(data.data.data));

    return data.data.data;
  }

  const restoreRecalculation = () => {
    const saved = storage.getItem('@App:recalculationData', 'string');
    if (saved) {
      setRecalculated(JSON.parse(saved));
      setHasRecalculation(true);
    }
  };

  const confirmRecalcPrice = (priceValue: number, chooseRecalc: boolean) => {
    storage.setItem('@App:recalcSelectedPrice', JSON.stringify({ priceValue, chooseRecalc }), 'string');
  };

  const resetRecalcPrice = () => {
    storage.removeItem('@App:recalcSelectedPrice');
  };

  const resetRecalculation = () => {
    setHasRecalculation(false);
    setRecalculated({} as RecalculatedProps);
    storage.removeItem('@App:recalculationData');
    storage.removeItem('@App:recalcSelectedPrice');
  };

  const getSavedRecalcPrice = (): { priceValue: number; chooseRecalc: boolean } | null => {
    const saved = storage.getItem('@App:recalcSelectedPrice', 'string');
    return saved ? JSON.parse(saved) : null;
  };

  const cancelPreviewFinishTrip = () => {
    if (tripAccepted?.tripReference) {
      FinishedTripStorage.remove(tripAccepted.tripReference);
    }

    setShouldShowFinishModal(false);
    resetRecalculation();

    if (tripAccepted?.status === 'finished') {
      dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: { ...tripAccepted, status: 'in_progress' },
      });
    }

    const pendingWaypoints = (tripAccepted?.tripWayPoints || []).filter(
      (waypoint: any) => waypoint?.confirmed === '0',
    );
    setStatusTrip(
      pendingWaypoints.length > 0
        ? translate('statusTrip.waypoint')
        : translate('statusTrip.in_progress'),
    );
  };

  // Limpa o estado local quando o drain da fila offline conclui com sucesso
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      OFFLINE_TRIP_FINISHED_EVENT,
      ({ tripReference }: { tripReference: string }) => {
        if (tripAccepted?.tripReference === tripReference) {
          clearDataTrip();
        }
      },
    );
    return () => sub.remove();
  }, [tripAccepted?.tripReference]);

  const value = {
    clearDataTrip,
    getDistanceLocation,
    informArrival,
    showArrivalDriver,
    initTrip,
    confirmStop,
    finishTrip,
    previewFinishTrip,
    confirmFinishTrip,
    checkStatusTrip,
    statusTrip,
    setStatusTrip,
    hasRecalculation,
    finishTripRecalculated,
    recalculated,
    confirmRecalcPrice,
    resetRecalcPrice,
    getSavedRecalcPrice,
    countTakeVolume,
    setCountTakeVolume,
    buttonTargetVisibility,
    setButtonTargetVisibility,
    metersRound,
    minutesTraveled,
    mountTripPreAccepted,
    waitingTripStatus,
    waitingFees,
    shouldShowFinishModal,
    setShouldShowFinishModal,
    restoreRecalculation,
    resetRecalculation,
    cancelPreviewFinishTrip
  };

  return (
    <TripStatusContext.Provider value={value}>
      {children}
    </TripStatusContext.Provider>
  );
};

export const useTripStatusProvider = <Selected,>(
  selector: (ctx: TripStatusContextType) => Selected
): Selected => {
  return useContextSelector(TripStatusContext, selector);
};

export default TripStatusProvider;
