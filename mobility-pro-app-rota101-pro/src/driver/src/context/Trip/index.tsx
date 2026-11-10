/* eslint-disable @typescript-eslint/no-shadow */
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from '@googlemaps/polyline-codec';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { debounce } from 'lodash';
import { tripService } from './services';
import {
  TripContextChildren,
  TripContextType,
  TripInfo,
  CancelTripProps,
  OriginProps,
  DestinationProps,
  stateTripProps,
  ReducerType,
  TripListField,
} from './types';
import { useUserDriver } from '../userDriver';
import { TripService } from './service';
import { useAuth } from '../../../../context/auth';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_PRE_ACCEPTED,
  TRIP_CALL_PARTNER,
} from '../../constants/trip';
import Helper from '../../../../client/utils/Helper';
import { useLocalProvider } from '../local';
import apiMainDriver from '../../api/apiMain';
import { removeAllMask } from '../../utils/format';
import { sortTripsBySchedule } from '../../utils/tripOrder';
import { TripStatusService } from '../TripStatus/service';
import { customToast } from '../../../../utils/FlashMessage';
import { offlineTripQueue } from '~/hooks/useOfflineTripActions';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { setIniTripModal } from '../../store/iniTripModal';
import { translate } from '../../../../client/locales';
import { searchNative, updateRoute } from './directionRoute';
import { calculateDistanceFromLatLonInMeters } from '../../../../client/utils/position';
import { useStorage } from '../../../../utils/Storage';
import MapService from '../../../../client/services/mapService';
import { createContext, useContextSelector } from 'use-context-selector';
import { Trip } from '../../../../interfaces/trip';
import { DriverStatusType } from '../../../../interfaces/driver';
import { AvaliationPayload } from '~/interfaces/avaliation';
import { DriverTripSummary } from '../../../../interfaces/driverTripSummary';
import { PaginationApi } from '../../../../interfaces/api';
import { InteractionManager } from 'react-native';
import { useSong } from '../../hooks/song';
import { sendCriticalRequest } from '~/utils/network';

const TripContext = createContext<TripContextType>({} as TripContextType);

const initialState: stateTripProps = {
  trip: {} as TripInfo,
  tripPreAccepted: {} as TripInfo,
  tripAccepted: {} as TripInfo,
  origin: {} as OriginProps,
  destination: {} as DestinationProps,
  dataCalculate: {},
  listSchedule: [],
  listSchedulePaginate: {} as PaginationApi,
  scheduleFilter: { dateStart: null, dateEnd: null },
  listScheduleAccepted: [],
  listScheduleAcceptedPaginate: {} as PaginationApi,
  scheduleAcceptedFilter: { dateStart: null, dateEnd: null },
  rating: 5,
  polyline: [],
  flashlight: false,
  callDriverModal: false,
  countTrip: 0,
  hasRun: true,
  isAcceptingTrip: false,
  notificationTripCallRequest: null,
  cancelTrip: {} as CancelTripProps,
  tripsOffer: [],
  tripsOfferPaginate: {} as PaginationApi,
  showMapSuggestion: false,
  tripSummary: {
    totalOfferTrips: 0,
    totalScheduledAccepted: 0,
    totalScheduledAvailable: 0,
  }
};

const reducer: ReducerType = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.arg,
      };

    case 'clearTripAccepted':
      return {
        ...state,
        tripAccepted: {} as TripInfo,
        polyline: [],
        trip: {} as TripInfo,
        callDriverModal: false,
      };

    case 'initTripPreAccepted':
      return {
        ...state,
        tripAccepted: action.arg,
        tripPreAccepted: {} as TripInfo,
        callDriverModal: false,
      };

    case 'acceptTrip':
      return {
        ...state,
        tripAccepted: action.arg,
        trip: {} as TripInfo,
        callDriverModal: false,
      };

    case 'addOrUpdateList': {
      const list = state[action.arg.field];
      const exists = list.some(item => item.tripReference === action.arg.value.tripReference);

      let updatedList = exists
        ? list.map(item =>
          item.tripReference === action.arg.value.tripReference ? { ...item, ...action.arg.value } : item
        )
        : [...list, action.arg.value];

      if (action.arg.field === 'listSchedule' || action.arg.field === 'listScheduleAccepted') {
        updatedList = sortTripsBySchedule(updatedList);
      }

      return { ...state, [action.arg.field]: updatedList };
    }

    case 'removeFromList': {
      const list = state[action.arg.field];
      return {
        ...state,
        [action.arg.field]: list.filter(item => item.tripReference !== action.arg.value.tripReference),
      };
    }

    case 'incrementTripSummaryItem':
      return {
        ...state,
        tripSummary: {
          ...state.tripSummary,
          [action.arg.field]: state.tripSummary[action.arg.field] + (action.arg.value ?? 1),
        },
      };

    case 'decrementTripSummaryItem':
      return {
        ...state,
        tripSummary: {
          ...state.tripSummary,
          [action.arg.field]: Math.max(state.tripSummary[action.arg.field] - (action.arg.value ?? 1), 0),
        },
      };

    default:
      return state;
  }
};

export const TripProvider = ({ children }: TripContextChildren) => {
  const [stateTrip, dispatchTrip] = useReducer(reducer, initialState);

  const {
    trip,
    tripPreAccepted,
    tripAccepted,
    origin,
    destination,
    dataCalculate,
    rating,
    polyline,
    hasRun,
    cancelTrip,
    callDriverModal,
    isAcceptingTrip,
  } = stateTrip;

  const isAcceptingTripRef = useRef(false);
  const callDriverModalRef = useRef(callDriverModal);
  const tripAcceptedRef = useRef(tripAccepted);
  callDriverModalRef.current = callDriverModal;
  tripAcceptedRef.current = tripAccepted;

  const { hideBubble } = useBubbleButton();
  const { cityConfig, tokenDriver } = useAuth();
  const {
    userDriverFind,
    setUserDriverFind,
    toogleDriverStatus,
    getDriverFind,
    song,
  } = useUserDriver();
  const locationNow = useMemo(async () => {
    return await Location.getCurrentPositionAsync({});
  }, []);
  const service = TripService();
  const serviceTripStatus = TripStatusService();
  const { getLocal, location } = useLocalProvider();

  const { getItem } = useStorage();
  const { playSong } = useSong();

  const mapSuggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cityId = cityConfig?.cityId || userDriverFind?.cityId;

  const tripTypes = useMemo(() => {
    return userDriverFind?.tripTypes?.map((tt) => tt.tripTypeId) || [];
  }, [userDriverFind?.tripTypes]);

  const clearMapSuggestionTimeout = useCallback(() => {
    if (mapSuggestionTimeoutRef.current) {
      clearTimeout(mapSuggestionTimeoutRef.current);
      mapSuggestionTimeoutRef.current = null;
    }
  }, []);

  const startMapSuggestionTimeout = useCallback(() => {
    clearMapSuggestionTimeout();

    mapSuggestionTimeoutRef.current = setTimeout(() => {
      dispatchTrip({ type: 'update', field: 'showMapSuggestion', arg: true });
      mapSuggestionTimeoutRef.current = null;
    }, 10000);
  }, [clearMapSuggestionTimeout]);

  useEffect(() => {
    return () => {
      clearMapSuggestionTimeout();
    };
  }, [clearMapSuggestionTimeout]);

  const postPerOrigin = async (local = null) => {
    const response = await getLocal(local?.latitude, local?.longitude);
    if (response?.data) {
      dispatchTrip({ type: 'update', field: 'origin', arg: response.data });
    }
  };

  const isTripPreAccepted = (acceptedTrip: TripInfo) => {
    const isDriverAlreadyOnAnotherTrip =
      userDriverFind?.preAvailable === '1' &&
      tripAccepted &&
      Object.keys(tripAccepted).length !== 0;

    return isDriverAlreadyOnAnotherTrip || acceptedTrip?.status === STATUS_PRE_ACCEPTED;
  };

  const acceptTrip = async (
    driverId: string,
    tripReference: string,
    estimatedTimeDriverArrival: number,
    distanceDriverArrival: number,
  ) => {
    isAcceptingTripRef.current = true;
    dispatchTrip({ type: 'update', field: 'isAcceptingTrip', arg: true });

    try {
      await song?.pauseAsync();
      const response = await service.accept(
        driverId,
        tripReference,
        estimatedTimeDriverArrival,
        distanceDriverArrival,
      );


      let isPreAcceptedTrip = false;

      if (response && typeof response === 'object' && response.status) {
        dispatchTrip({ type: 'update', field: 'countTrip', arg: response.data });
        dispatchTrip({ type: 'update', field: 'callDriverModal', arg: false });

        isPreAcceptedTrip = isTripPreAccepted(response.data);

        if (isPreAcceptedTrip) {
          await registerPreAcceptedTrip(response.data);
        } else {
          dispatchTrip({ type: 'acceptTrip', arg: response.data });
        }

        await AsyncStorage.removeItem('trip');
        const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
        if (response.data?.tripReference) {
          emitTripStatusChange(response.data.tripReference, 'accepted', configCityId);
        }
        notifyTripAccepted(response.data, isPreAcceptedTrip ? 2 : 1);
        startMapSuggestionTimeout();
      } else {
        dispatchTrip({ type: 'update', field: 'callDriverModal', arg: false });
        dispatchTrip({ type: 'update', field: 'trip', arg: {} });
        if (response?.message) {
          customToast(response.message, 'warning');
        }
      }

      try {
        await song?.stopAsync();
      } catch (error) {
        console.log(error);
      }
      return { ...response, isPreAcceptedTrip };
    } catch (error) {
      dispatchTrip({ type: 'update', field: 'callDriverModal', arg: false });
      dispatchTrip({ type: 'update', field: 'trip', arg: {} });
      return customToast(
        translate('driverTrip.text_error_accept_trip'),
        'warning',
      );
    } finally {
      isAcceptingTripRef.current = false;
      dispatchTrip({ type: 'update', field: 'isAcceptingTrip', arg: false });
    }
  };

  const sendMessage = async (
    userId: number,
    tripReference: string,
    chatBotTripTypeId: number,
  ) => {
    try {
      return service
        .sendMessage(userId, tripReference, chatBotTripTypeId)
        .then(async result => {
          if (!result.status) {
            return;
          }

          await AsyncStorage.setItem('lastMessageSendedBot', 'true');
        });
    } catch (error) {
      return console.log(error);
    }
  };

  const notifyTripAccepted = (acceptedTrip: TripInfo, chatBotTripTypeId: number) => {
    setTimeout(() => {
      if (acceptedTrip?.driver?.userId) {
        sendMessage(Number(acceptedTrip.driver.userId), acceptedTrip.tripReference, chatBotTripTypeId);
      }
    }, 6000);
  };

  const getCancellationReasons = async () => {
    try {
      const result = await service.getReasonsCancel();

      if (!result.status) {
        customToast(
          translate('finishTrip.title_error_loading_reasons_cancellation'),
          'danger',
        );
        return [];
      }

      return result.data.data;
    } catch (error) {
      return console.log(error);
    }
  };

  const getTripDenied = async () => {
    const SECONDS_MAX = 90;

    let listTripDeined = [];

    const storageList = JSON.parse(
      await AsyncStorage.getItem('tripsDeniedDriver'),
    );

    if (storageList === null || storageList.length === 0) {
      await AsyncStorage.setItem(
        'tripsDeniedDriver',
        JSON.stringify(listTripDeined),
      );
      return listTripDeined;
    }

    listTripDeined = [storageList];

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const list = listTripDeined.filter(trip => {
      const dateReject = new Date(trip.date);
      const dateNow = new Date();

      return (
        Math.abs((dateReject.getTime() - dateNow.getTime()) / 1000) <
        SECONDS_MAX
      );
    });

    await AsyncStorage.setItem('tripsDeniedDriver', JSON.stringify(list));

    return list.map(tripD => {
      return tripD.tripReference;
    });
  };

  const isFetchingTripRef = useRef(false);

  const getDriverTrip = useCallback(async (
    driverId: number,
    location: { latitude: number; longitude: number },
    userId: number,
    callType?: string | number | null,
  ): Promise<'found' | 'empty' | 'skip'> => {
    if (callDriverModalRef.current) return 'skip';
    if (isAcceptingTripRef.current) return 'skip';
    if (Object.keys(tripAcceptedRef.current || {}).length > 0) return 'skip';
    if (isFetchingTripRef.current) return 'skip';

    isFetchingTripRef.current = true;
    try {
      const listTripsDenied = await getTripDenied();
      const response = await service.search(
        driverId,
        listTripsDenied,
        location,
        userId,
      );

      if (response === null || response === undefined || typeof response === 'string') {
        dispatchTrip({ type: 'update', field: 'trip', arg: {} });
        return 'empty';
      }

      if (callType && callType === TRIP_CALL_PARTNER) {
        response.callType = 'partner';
      }

      if (response.risk_area && !response.riskArea) {
        response.riskArea = response.risk_area;
        delete response.risk_area;
      }

      if (!response.riskArea) {
        response.riskArea = { origin: false, destination: false };
      }

      await AsyncStorage.setItem('trip', JSON.stringify(response));
      dispatchTrip({ type: 'update', field: 'trip', arg: response });

      return 'found';
    } catch (error) {
      console.log(error);
      return 'skip';
    } finally {
      isFetchingTripRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (tripAccepted && Object.keys(tripAccepted).length > 0) {
      try {
        song && song?.stopAsync();
      } catch (err) {
        console.log(err);
      }
    }
  }, [tripAccepted]);

  const refuseTrip = async (driverId: number, tripReference: string) => {
    try {
      if (tripReference === undefined) {
        tripReference = JSON.parse(
          await AsyncStorage.getItem('trip'),
        ).tripReference;
      }

      try {
        await song?.stopAsync();
      } catch (error) {
        console.log('erro', error);
      }

      const response = await service.refuse(driverId, tripReference);

      if (response) {
        AsyncStorage.removeItem('trip');

        let tripsDeined = JSON.parse(
          await AsyncStorage.getItem('tripsDeniedDriver'),
        );

        if (tripsDeined === null || tripsDeined.length === 0) {
          tripsDeined = [
            {
              tripReference: trip.tripReference,
              date: new Date(),
            },
          ];
        } else {
          tripsDeined.push({
            tripReference: trip.tripReference,
            date: new Date(),
          });
        }

        dispatchTrip({ type: 'update', field: 'trip', arg: {} });

        await AsyncStorage.setItem(
          'tripsDeniedDriver',
          JSON.stringify(tripsDeined),
        );
      }
      return '';
    } catch (error) {
      return console.log(error);
    }
  };

  const cancelTripSchedule = async (cancelationID, driverID, tripReference) => {
    const response = await tripService.cancelTrip(
      cancelationID,
      driverID,
      tripReference,
    );
    return response;
  };
  const acceptScheduled = async (driverId, tripReference) => {
    const response = await tripService.acceptScheduledTrip(
      driverId,
      tripReference,
    );
    return response;
  };
  const clearDataTrip = async () => {
    try {
      if (song && song.pauseAsync) {
        await song.pauseAsync();
      }

      await AsyncStorage.removeItem('tripDriver');
      await AsyncStorage.removeItem('routeTraveled');
      await AsyncStorage.removeItem('tripCallKnob');
      await AsyncStorage.removeItem('valueCancellationFeeByCustomer');

      const updatedDriver = { ...userDriverFind, status: 'disponivel' as any };
      setUserDriverFind(updatedDriver);

      if (updatedDriver.status === 'disponivel') {
        const currentLocation = location?.coords
          ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
          : { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude };
        emitDriverStatusChange(updatedDriver, 'disponivel', cityConfig, currentLocation);
      }

      clearMapSuggestionTimeout();

      try {
        setIniTripModal(false);
      } catch {}

      dispatchTrip({ type: 'clearTripAccepted' });
      dispatchTrip({ type: 'update', field: 'showMapSuggestion', arg: false });
    } catch (error) {
      console.error("Erro ao limpar dados da viagem:", error);
    }
  };

  const registerPreAcceptedTrip = async (preAcceptedTrip: TripInfo) => {
    userDriverFind.preAvailableTrip = preAcceptedTrip;
    setUserDriverFind(userDriverFind);
    await AsyncStorage.setItem('preAvailableTrip', JSON.stringify(preAcceptedTrip));
    await AsyncStorage.setItem('tripInWait', JSON.stringify(preAcceptedTrip.tripReference));
    await AsyncStorage.setItem('user', JSON.stringify(userDriverFind));

    dispatchTrip({ type: 'update', field: 'tripPreAccepted', arg: preAcceptedTrip });
  };

  const clearDataPreAcceptedTrip = async () => {
    await AsyncStorage.removeItem('preAvailableTrip');
    await AsyncStorage.removeItem('tripInWait');
    userDriverFind.preAvailableTrip = {};
    await serviceTripStatus.putPreAvailable();
    userDriverFind.preAvailable = '1';
    await AsyncStorage.setItem('user', JSON.stringify(userDriverFind));
    song?.pauseAsync();
    setUserDriverFind(userDriverFind);

    clearMapSuggestionTimeout();

    dispatchTrip({ type: 'update', field: 'tripPreAccepted', arg: {} });
    dispatchTrip({ type: 'update', field: 'showMapSuggestion', arg: false });
  };

  const cancel = async (preAccepted = false) => {
    try {
      song?.pauseAsync();
      const status = await service.cancell(cancelTrip);
      getDriverFind();

      if (!status) {
        return customToast(
          translate('driverTrip.text_error_cancel_trip'),
          'danger',
        );
      }

      playSong('cancel');

      if (preAccepted) {
        clearDataPreAcceptedTrip();
        return customToast(
          translate('driverTrip.text_trip_cancelled'),
          'success',
        );
      }

      dispatchTrip({ type: 'update', field: 'cancelTrip', arg: {} });

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      if (cancelTrip?.tripReference) {
        emitTripStatusChange(cancelTrip.tripReference, 'removed', configCityId);
      }

      return customToast(
        translate('driverTrip.text_trip_cancelled'),
        'success',
      );
    } catch (error) {
      return console.log(error);
    } finally {
      if (!preAccepted) {
        await clearDataTrip();
      }
    }
  };

  const verifyExistTrip = async (tripReference: string) => {
    try {
      return await service.get(tripReference);
    } catch {
      return false;
    }
  };

  const setOff = async () => {
    await hideBubble();
    await toogleDriverStatus('desligado', {
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    });
    dispatchTrip({ type: 'update', field: 'trip', arg: {} });
  };

  const sendAvaliations = async (payload: AvaliationPayload): Promise<boolean> => {
    dispatchTrip({ type: 'update', field: 'rating', arg: 5 });

    try {
      const sent = await sendCriticalRequest(() =>
        service.rate(payload.rating, payload.tripReference),
      );

      // Sem resposta do servidor: avaliação fica pendente de sincronização
      if (!sent.delivered) {
        offlineTripQueue.addSendAvaliation(payload);
        return true;
      }

      if (!sent.response.status) {
        customToast(translate('finishTrip.title_error_finish'), 'danger');
        return false;
      }

      if (payload.blacklistAddresses.length > 0) {
        service.addBlackList(payload.blacklistAddresses);
      }

      payload.riskAreas.forEach(area => service.addRiskArea(area));

      return true;
    } catch {
      customToast(translate('finishTrip.title_error_finish'), 'danger');
      return false;
    }
  };

  // const socketOnTrip = async () => {
  //   // FUNÇÃO PRA ENVIAR POSITION PRO SOKET
  //   const socket = io('http://return704appsapi.fb704.com.br:3704', {
  //     query: {
  //       tripReference: tripAccepted?.tripReference,
  //     },
  //   });

  //   socket.on(`location-${tripAccepted?.tripReference}`, result => { });

  //   socket.emit(`location-${tripAccepted?.tripReference}`, {
  //     latitude: location?.coords?.latitude,
  //     longitude: location?.coords?.longitude,
  //     driverId: userDriverFind.idDriver,
  //     deviceModel: 'fabrica-socket',
  //     deviceId: '704',
  //     created_at: Helper.getNow(),
  //     tripReference: tripAccepted?.tripReference,
  //   });
  // };

  const newTripDoorHandle = useCallback(
    async (dataCustomer, priceNew = null, waypoints = []) => {
      const multiplierDynamic = dataCalculate?.data?.price?.multiplierPriceDynamic
      const newTrip = {
        destination: await prepareAddressResult(destination),
        distance: dataCalculate?.data?.distance,
        driverId: userDriverFind?.idDriver,
        estimatedTripTime: dataCalculate?.data?.duration,
        origin: await prepareAddressResult(origin),
        price: priceNew
          ? String(priceNew).replace(cityConfig?.typeMoney, '').replace(',', '.')
          : dataCalculate?.data?.price?.price,
        priceId: dataCalculate?.data?.price?.idPrice,
        recalculatedTrip: priceNew
          ? {
            oldPrice: dataCalculate?.data?.price?.price,
            newPrice: String(priceNew)
              .replace(cityConfig?.typeMoney, '')
              .replace(',', '.'),
          }
          : null,
        tripCustomer: {
          name: dataCustomer?.name,
          phone: removeAllMask(dataCustomer?.phone),
          document: removeAllMask(dataCustomer?.cpf),
          email: dataCustomer?.email,
        },
        tripPaymentFormId: dataCustomer?.idTripPaymentForm,
        tripTypeId: dataCalculate?.data?.price?.tripType?.idTripType,
        userId: userDriverFind?.userId,
        driverId: userDriverFind?.idDriver,
        multiplierDynamic: multiplierDynamic ? parseFloat(multiplierDynamic) : null,
        waypoints: waypoints.length > 0 ? waypoints : null,
      };
      const { data } = await apiMainDriver.post('/KnobTrip/Init', newTrip);
      if (!data.status) {
        dispatchTrip({ type: 'update', field: 'dataCalculate', arg: {} });
        dispatchTrip({ type: 'update', field: 'destination', arg: {} });
        throw new Error(data?.message || 'Erro ao criar viagem');
      }
      dispatchTrip({ type: 'update', field: 'dataCalculate', arg: {} });
      dispatchTrip({ type: 'update', field: 'destination', arg: {} });

      const tripCreated = data?.data || data?.response;
      if (tripCreated) {
        await AsyncStorage.setItem('tripDriver', JSON.stringify(tripCreated));
        await AsyncStorage.removeItem('trip');
        dispatchTrip({ type: 'acceptTrip', arg: tripCreated });
        notifyTripAccepted(tripCreated, 1);
        startMapSuggestionTimeout();
        setIniTripModal(true);
      }
      return tripCreated;
    },
    [destination, origin, userDriverFind, dataCalculate, startMapSuggestionTimeout, notifyTripAccepted],
  );

  const getTripTypes = useCallback(async location => {
    if (!location?.coords?.latitude) {
      return '';
    }
    const response = await service.getTripTypes(
      location?.coords?.latitude,
      location?.coords?.longitude,
    );
    if (!response.status) {
      return customToast(response?.message, 'danger');
    }

    return response;
  }, []);

  const calculateAllDoorHandle = useCallback(
    async (origin, destination, tripTypeId, waypoints = []) => {
      const payload = {
        destiny: await prepareAddressResult(destination),
        origin: await prepareAddressResult(origin),
        tripTypeId,
        waypoints: waypoints.length > 0 ? waypoints : null,
      };

      const { data } = await apiMainDriver.post('Price/Calculate', payload);

      if (!data.status) {
        return customToast(data?.message, 'danger');
      }
      return dispatchTrip({ type: 'update', field: 'dataCalculate', arg: data });
    },
    [],
  );

  const prepareAddressResult = useCallback(async item => {
    if (item.latitude == null && item.longitude == null) {
      const {
        data: { data },
      } = await apiMainDriver.get(`geocoding/search?address=${item.address}`);
      return data;
    }

    return item;
  }, []);

  const getPaymentFormInVehicle = useCallback(async () => {
    const response = await service.getPaymentInVehicle();
    if (!response.status) {
      return customToast(response?.message, 'danger');
    }
    return response;
  }, []);

  const initTripPreAccepted = async () => {
    if (Object.keys(tripPreAccepted).length !== 0) {
      const acceptedTrip = { ...tripPreAccepted, status: 'accepted' };

      await AsyncStorage.setItem('tripDriver', JSON.stringify(acceptedTrip));
      await AsyncStorage.removeItem('preAvailableTrip');
      dispatchTrip({ type: 'initTripPreAccepted', arg: acceptedTrip });

      const updatedDriver = { ...userDriverFind, status: 'corrida' as DriverStatusType };
      setUserDriverFind(updatedDriver);

      const currentLocation = location?.coords
        ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
        : { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude };

      emitDriverStatusChange(updatedDriver, 'corrida', cityConfig, currentLocation);

      return true;
    }
    return false;
  };

  const getKmRouteTraveled = async () => {
    let meters = 0;

    let routeTraveled = (await getItem('routeTraveled', false)) || [];

    if (routeTraveled.length === 0) {
      return 0;
    }

    routeTraveled = MapService.decodePolyline(routeTraveled);

    routeTraveled.map((point, index) => {
      if (index === 0) {
        return;
      }

      meters += calculateDistanceFromLatLonInMeters(
        routeTraveled[index - 1],
        point,
      );
    });

    return meters / 1000;
  };

  async function getMinutesRouteTraveled() {
    const dateTime = JSON.parse(
      await AsyncStorage.getItem('dateTimeInProgress'),
    );
    if (Array.isArray(dateTime)) {
      return 0;
    }

    const start = Number(new Date(dateTime));

    const end = Number(new Date());

    return (end - start) / 60 / 1000;
  }

  const sendPolyline = async ({ lat, lng }, data) => {
    const [kmProgressing, minuteProgressing] = await Promise.all([
      getKmRouteTraveled(),
      getMinutesRouteTraveled(),
    ]);

    const routeUpdatePayload = {
      tripReference: tripAccepted?.tripReference,
      polyline: data?.overview_polyline?.points,
      time: `${(data?.duration / 60).toFixed(0)} min`,
      idDriver: userDriverFind?.idDriver,
      position: { lat, lng },
      kmProgressing: kmProgressing,
      minuteProgressing: minuteProgressing,
    };

    updateRoute(
      routeUpdatePayload,
      {
        token: tokenDriver,
        userid: userDriverFind?.userId,
      },
      cityConfig?.configDriverLocation?.port_url,
    ).catch(err => {
      console.error('Erro ao enviar polyline:', err);
      // Você pode querer logar isso em um serviço de monitoramento de erros
    });
  };
  const sendPolylinePreAccepted = async ({ lat, lng }, data) => {
    const [kmProgressing, minuteProgressing] = await Promise.all([
      getKmRouteTraveled(),
      getMinutesRouteTraveled(),
    ]);
    updateRoute(
      {
        tripReference: tripPreAccepted?.tripReference,
        polyline: data?.overview_polyline?.points,
        time: `${Number(data?.duration / 60)?.toFixed(0)} min`,
        idDriver: userDriverFind?.idDriver,
        position: { lat, lng },
        kmProgressing: kmProgressing,
        minuteProgressing: minuteProgressing,
      },
      { token: tokenDriver, userid: userDriverFind?.userId },
      cityConfig?.configDriverLocation?.port_url,
    ).catch(err => {
      console.error('Erro ao enviar polyline:', err);
      // Você pode querer logar isso em um serviço de monitoramento de erros
    });
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };
  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in meters
    return d;
  };

  const switchCaseSearchNative = (
    status,
    origin,
    destination,
    waypoints,
    dir = 'latitude',
  ) => {
    switch (status) {
      case STATUS_ACCEPTED:
        return origin[dir];
      case STATUS_BOARDING:
        return origin[dir];
      case STATUS_IN_PROGRESS:
        return waypoints && waypoints.length > 0
          ? waypoints[0][dir]
          : destination[dir];
      default:
        return destination[dir];
    }
  };

  const lastKnownLocation = useRef(null);
  const metersDiffCalculation = 30; // Quantidade de metros antes de uma nova chamada ser necessária
  const isLoadingRoute = useRef(false); // Variável para verificar se uma cham

  const calculateAndDisplayRoute = useCallback(
    debounce(async (origin, destination, { lat, lng }, continueTrue = false) => {
      if (isLoadingRoute.current && !continueTrue) {
        // Se uma requisição já está em progresso, não inicie uma nova
        return;
      }
      if (lastKnownLocation.current && !continueTrue) {
        const metersDiffPosition = getDistanceFromLatLonInMeters(
          lastKnownLocation.current?.lat,
          lastKnownLocation.current?.lng,
          lat,
          lng,
        );

        if (metersDiffPosition < metersDiffCalculation) {
          // Se a diferença for menor do que o definido, não inicie uma nova chamada
          return;
        }
      }

      isLoadingRoute.current = true; // Uma requisição está prestes a começar

      lastKnownLocation.current = {
        lat,
        lng,
      };

      if (tripAccepted && Object.keys(tripAccepted).length === 0) {
        clearDataTrip();
      }
      const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
        return waypoint?.confirmed === '0';
      });
      searchNative(
        `${lat},${lng}`, // Minha latitude e longitude de onde estou no momento
        `${switchCaseSearchNative(
          tripAccepted?.status,
          origin,
          destination,
          waypoints,
        )},${switchCaseSearchNative(
          tripAccepted?.status,
          origin,
          destination,
          waypoints,
          'longitude',
        )}`,
      )
        .then(({ status, data }: any) => {
          if (!status) {
            return;
          }

          AsyncStorage.setItem(
            'timePolyline',
            `${Number(data?.duration / 60)} min`,
          );

          sendPolyline({ lat, lng }, data); // ENVIO DE POLYLINE PARA O CLIENTE
          // await socketOnTrip(); // Colocar quando houver socket

          if (tripPreAccepted?.tripReference) {
            sendPolylinePreAccepted({ lat, lng }, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
          }

          const polilyne = data?.overview_polyline?.points
            ? decode(data.overview_polyline.points).map(item => ({
                latitude: item[0],
                longitude: item[1],
              }))
            : [];

          // dispatchTrip({type: 'update', field: 'polyline', arg: polilyne});
        })
        .catch(e => {
          console.log('erro ao calcular rota ', e);
        })
        .finally(() => {
          isLoadingRoute.current = false; // Requisição finalizada
        });
    }, 200), // Ajuste este tempo baseado nas suas necessidades
    [tripAccepted, origin, destination, polyline, AsyncStorage],
  );

  const acceptTripOffer = useCallback(
    async tripReference => {
      try {
        const response = await service.acceptTripOffer(
          userDriverFind?.idDriver,
          tripReference,
        );

        if (!response?.status) {
          customToast(response?.message, 'danger');
          return;
        }

        customToast(response?.message, 'success');

        dispatchTrip({ type: 'acceptTrip', arg: response?.data });
        const updatedDriver = { ...userDriverFind, status: 'corrida' as DriverStatusType };
        setUserDriverFind(updatedDriver);

        const currentLocation = location?.coords
          ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
          : { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude };
        emitDriverStatusChange(updatedDriver, 'corrida', cityConfig, currentLocation);

        const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
        if (tripReference) {
          emitTripStatusChange(tripReference, 'accepted', configCityId);
        }

        startMapSuggestionTimeout();

        await AsyncStorage.setItem(
          'tripDriver',
          JSON.stringify(response?.data),
        );
      } catch { }
    },
    [userDriverFind],
  );

  const createTripOffer = useCallback(
    async (tripId, price) => {
      try {
        const response = await service.createTripOffer(
          userDriverFind?.idDriver,
          tripId,
          price,
        );

        if (!response?.status) {
          return;
        }

        customToast(response?.message, 'success');
      } catch { }
    },
    [userDriverFind],
  );

  let lastPositionInRealTime = null;
  const metersDiffSendPosition = 50;

  const sendPosition = useCallback(
    debounce(async payload => {
      if (lastPositionInRealTime) {
        const metersDiffPosition = getDistanceFromLatLonInMeters(
          lastPositionInRealTime?.latitude,
          lastPositionInRealTime?.longitude,
          payload?.latitude,
          payload?.longitude,
        );

        if (metersDiffPosition < metersDiffSendPosition) {
          return;
        }
      }
    }, 5000), // Adjust this time based on your needs
    [userDriverFind, tripAccepted],
  );

  const priceToShow = () => {
    if (!tripAccepted?.status) return 0;
    const priceDriverValue =
      tripAccepted?.driverNetValue ||
      tripAccepted?.driverValue ||
      tripAccepted?.price;
    if (String(cityConfig?.showNetValueForDriverOnCall) === '1') {
      return Number(priceDriverValue);
    }
    return Number(tripAccepted?.price);
  };

  const loadTripsSummary = useCallback(async () => {
    if (!userDriverFind?.idDriver || userDriverFind?.status === 'desligado') {
      return;
    }

    try {
      const response = await service.getTripsSummary({
        driverId: userDriverFind?.idDriver,
        tripTypeIds: tripTypes,
        cityId: cityId,
        tripWithoutRefusal: true
      });

      if (!response?.status) return;

      dispatchTrip({ type: 'update', field: 'tripSummary', arg: response.data });
    } catch (error) {
      console.log(error);
    }
  }, [userDriverFind?.idDriver, userDriverFind?.status, tripTypes, cityId]);

  const debouncedFetch = useMemo(
    () => debounce(loadTripsSummary, 2000),
    [loadTripsSummary]
  );

  const addOrUpdateList = useCallback((field: TripListField, tripUpdate: Trip) => {
    dispatchTrip({ type: 'addOrUpdateList', arg: { field, value: tripUpdate } });
  }, []);

  const removeFromList = useCallback((field: TripListField, tripUpdate: Trip) => {
    dispatchTrip({ type: 'removeFromList', arg: { field, value: tripUpdate } });
  }, []);

  const incrementTripSummaryItem = useCallback((field: keyof DriverTripSummary, value: number) => {
    dispatchTrip({ type: 'incrementTripSummaryItem', arg: { field, value } });
    debouncedFetch();
  }, [debouncedFetch]);

  const decrementTripSummaryItem = useCallback((field: keyof DriverTripSummary, value: number) => {
    dispatchTrip({ type: 'decrementTripSummaryItem', arg: { field, value } });
    debouncedFetch();
  }, [debouncedFetch]);

  useEffect(() => {
    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [debouncedFetch]);

  const value = useMemo(() => {
    return {
      acceptTrip,
      getDriverTrip,
      refuseTrip,
      getTripDenied,
      cancelTripSchedule,
      acceptScheduled,
      sendMessage,
      cancel,
      verifyExistTrip,
      sendAvaliations,
      getCancellationReasons,
      clearDataTrip,
      calculateAllDoorHandle,
      newTripDoorHandle,
      getPaymentFormInVehicle,
      getTripTypes,
      initTripPreAccepted,
      clearDataPreAcceptedTrip,
      calculateAndDisplayRoute,
      acceptTripOffer,
      createTripOffer,
      stateTrip,
      dispatchTrip,
      setOff,
      postPerOrigin,
      sendPosition,
      priceToShow,
      startMapSuggestionTimeout,
      clearMapSuggestionTimeout,
      addOrUpdateList,
      removeFromList,
      incrementTripSummaryItem,
      decrementTripSummaryItem
    };
  }, [
    acceptTrip,
    getDriverTrip,
    refuseTrip,
    getTripDenied,
    cancelTripSchedule,
    acceptScheduled,
    sendMessage,
    cancel,
    verifyExistTrip,
    sendAvaliations,
    getCancellationReasons,
    clearDataTrip,
    calculateAllDoorHandle,
    newTripDoorHandle,
    initTripPreAccepted,
    clearDataPreAcceptedTrip,
    getPaymentFormInVehicle,
    getTripTypes,
    calculateAndDisplayRoute,
    acceptTripOffer,
    createTripOffer,
    stateTrip,
    dispatchTrip,
    setOff,
    postPerOrigin,
    sendPosition,
    priceToShow,
    addOrUpdateList,
    removeFromList,
    incrementTripSummaryItem,
    decrementTripSummaryItem
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTripProvider = <Selected,>(
  selector: (ctx: TripContextType) => Selected,
): Selected => {
  return useContextSelector(TripContext, selector);
};

export default TripProvider;
