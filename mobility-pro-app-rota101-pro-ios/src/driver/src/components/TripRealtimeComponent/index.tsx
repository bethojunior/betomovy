import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { useTripProvider } from '../../context/Trip';
import { useUserDriver } from '../../context/userDriver';
import { Alert, AppState, Platform } from 'react-native';
import { useLocal } from '../../hooks/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTripStatusProvider } from '../../context/TripStatus';
import { translate } from '../../../../client/locales';
import {
  STATUS_BACK_OFF,
  STATUS_BOARDING,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_PRE_ACCEPTED,
} from '../../constants/trip';
import { useTaximeter } from '../../context/Taximeter';
import { customToast } from '../../../../utils/FlashMessage';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { ProgressBarComponent } from '../../../../common/ProgressBarComponent';
import { useFlashlight } from '~/hooks/useFlashlight';
import { useModals } from '../../../../context/Modals';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import apiMain from '../../../../client/api/apiMain';
import { useDriverStatus } from '../../hooks/useDriverStatus';
import { Audio } from 'expo-av';
import { useAuth } from '../../../../context/auth';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { FinishedTripStorage } from '~/utils/Storage/finishedTripStorage';
import { normalizeTripLongDistance } from '../../utils/tripUtils';
import { useActiveTrips } from '~/hooks/useActiveTrips';
import { Trip } from '~/interfaces/trip';
import { TripActive } from '~/interfaces/tripActive';
import { isTaximeterTripInProgress } from '../../service/rules/trip/isTaximeterTripInProgress';
import { useSong } from '../../hooks/song';

let canModifyRoute = true;

export interface TripRealtimeProps {
  setIniTripModal: (value: boolean) => void;
  setSwalVisible: (value: boolean) => void;
  setVisibleQrCode: (value: boolean) => void;
  onDriverTripStart: () => void;
  iniTripModal: boolean;
  setPreloadVisible: (value: boolean) => void;
}

export const TripRealtimeComponent: React.FC<TripRealtimeProps> = ({
  setIniTripModal,
  setSwalVisible,
  setVisibleQrCode,
  onDriverTripStart,
  setPreloadVisible,
}) => {
  const { tripRealtime } = useTripRealtime();
  const { setContainerTaximeter, containerTaximeter } = useModals();
  const { itsNetwork } = useNetwork();

  const {
    getDriverTrip,
    dispatchTrip,
    verifyExistTrip,
    clearDataTrip,
    stateTrip: { tripAccepted, tripPreAccepted, cancelTrip, notificationTripCallRequest },
  } = useTripProvider((context) => context);

  const { setStatusTrip, restoreRecalculation } = useTripStatusProvider(
    (context) => context,
  );

  const { userDriverFind, getDriverFind, song } = useUserDriver();
  const { isOffline, isInTrip } = useDriverStatus();
  const { location } = useLocal();
  const { playSong, stopSong } = useSong();

  const {
    data: tripsActives,
    offlineData: offlineTripActive,
    loading: isLoadingActiveTrips,
  } = useActiveTrips({ field: 'driver', id: userDriverFind?.idDriver });

  const { restoreTrip: restoreTripTaximeter, clearTrip: clearTripTaximeter } =
    useTaximeter();

  const { openApp } = useBubbleButton();
  const { cityConfig } = useAuth();
  const { blink, stop } = useFlashlight();

  const locationRef = useRef<any>({
    coords: {
      latitude: location?.coords?.latitude || 0,
      longitude: location?.coords?.longitude || 0,
    },
  });

  // Refs sincronizados via useLayoutEffect (ver abaixo) para evitar closure obsoleta
  // nos callbacks do tripRealtime, que são registrados uma única vez e não são
  // recriados quando tripAccepted/cancelTrip/tripPreAccepted mudam.
  const tripAcceptedRef = useRef(tripAccepted);
  const cancelTripRef = useRef(cancelTrip);
  const tripPreAcceptedRef = useRef(tripPreAccepted);

  // useLayoutEffect (não useEffect) para eliminar a janela entre commit e a
  // sincronização do ref: os listeners realtime (socket/Firestore) rodam fora
  // do ciclo do React e podem disparar exatamente nesse intervalo.
  useLayoutEffect(() => {
    tripAcceptedRef.current = tripAccepted;
  }, [tripAccepted]);

  useLayoutEffect(() => {
    cancelTripRef.current = cancelTrip;
  }, [cancelTrip]);

  useLayoutEffect(() => {
    tripPreAcceptedRef.current = tripPreAccepted;
  }, [tripPreAccepted]);

  let tripUpdateEvent: string | null = null;

  const verify = async (tripReference: string) => {
    if (!itsNetwork) {
      return;
    }

    const response = await verifyExistTrip(tripReference);

    if (
      response?.status === STATUS_CANCELED ||
      response?.status === STATUS_BACK_OFF ||
      response?.status === STATUS_FINISHED
    ) {
      if ((response?.status === STATUS_CANCELED || response?.status === STATUS_BACK_OFF) && tripReference) {
        const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
        if (tripReference) {
          emitTripStatusChange(tripReference, 'removed', configCityId);
        }
      }

      const currentLocation = location?.coords
        ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
        : userDriverFind.latitude && userDriverFind.longitude
          ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
          : undefined;
      emitDriverLocation(userDriverFind, currentLocation, cityConfig);

      playSong('cancel');

      getDriverFind();

      const actualTrip = { ...tripAcceptedRef.current, cancelledBy: 'customer' };

      dispatchTrip({ type: 'update', field: 'tripAccepted', arg: actualTrip });

      const isTripFinished = response?.status === STATUS_FINISHED;
      if (!isTripFinished) {
        const actualTrip = { ...tripAcceptedRef.current, cancelledBy: 'customer' };
        dispatchTrip({ type: 'update', field: 'tripAccepted', arg: actualTrip });
      }

      const toastType = isTripFinished ? 'success' : 'warning';

      const message = await (isTripFinished
        ? translate('finishTrip.title_success_finish')
        : response.canceledBy === 'customer'
          ? getCancelMessage(response)
          : translate(`finishTrip.text_trip_cancelled_by_false`));

      customToast(message, toastType);

      setIniTripModal(false);
      setSwalVisible(false);

      requestAnimationFrame(clearDataTrip);
    }
  };

  const dispatchCallDriverModal = (show: boolean) => {
    dispatchTrip({ type: 'update', field: 'callDriverModal', arg: show });
  };

  const getCancelMessage = async (response: any) => {
    const defaultMessage = translate('finishTrip.text_trip_cancelled_by_true');
    try {
      const { data } = await apiMain.get(`UserType/GetMessageTripCanceled`, {
        params: {
          tripReference: response.tripReference,
        },
      });

      return data?.cancellationText || defaultMessage;
    } catch (error) {
      console.error('Error ao buscar mensagem de cancelamento:', error);
      return defaultMessage;
    }
  };

  const pendingRingRef = useRef(false);
  const handleTripRef = useRef<(userId: number, callType?: string | number | null) => Promise<void>>(
    async () => {},
  );
  const playSongActiveRef = useRef<() => Promise<void>>(async () => {});

  const playSongActive = async () => {
    // Sempre tenta tocar (background Android + silent iOS). Se falhar em background, marca pending.
    if (AppState.currentState !== 'active') {
      pendingRingRef.current = true;
    } else {
      pendingRingRef.current = false;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      if (song) {
        await song.setIsLoopingAsync(true);
        await song.playAsync();
      } else {
        await playSong('whistle', true);
      }
    } catch (e) {
      console.warn('[TripRealtime] Erro ao tocar som de chamada:', e);
      try {
        await playSong('whistle', true);
      } catch (err) {
        console.error('[TripRealtime] Fallback playSong whistle falhou:', err);
      }
    }
  };

  const stopSongActive = async () => {
    try {
      if (song) {
        await song.stopAsync();
      }
      await stopSong('whistle');
    } catch (e) {
      console.warn('[TripRealtime] Erro ao parar som:', e);
    }
  };

  const handleTrip = async (userId: number, callType?: string | number | null) => {
    if (!itsNetwork) {
      return;
    }

    if (Object.keys(tripAcceptedRef.current || {}).length > 0) {
      return;
    }

    try {
      const response = await getDriverTrip(
        Number(userDriverFind.idDriver),
        {
          latitude: locationRef?.current?.coords?.latitude,
          longitude: locationRef?.current?.coords?.longitude,
        },
        userId,
        callType,
      );

      if (response === 'found') {
        if (AppState.currentState !== 'active') {
          try {
            openApp();
          } catch (error) {
            console.log(error);
          }
        }
        dispatchCallDriverModal(true);
        await playSongActive();
      } else if (response === 'empty') {
        dispatchCallDriverModal(false);
        await stopSongActive();
      }
    } catch (error) {
      console.log(error);
      await stopSongActive();
    }
  };

  handleTripRef.current = handleTrip;
  playSongActiveRef.current = playSongActive;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      if (next !== 'active') return;
      if (pendingRingRef.current) {
        pendingRingRef.current = false;
        void playSongActiveRef.current();
      }
      void handleTripRef.current(0, null);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!userDriverFind?.idDriver || isOffline) return;

    const interval = setInterval(() => {
      if (Object.keys(tripAcceptedRef.current || {}).length > 0) return;
      void handleTripRef.current(0, null);
    }, 5000);

    return () => clearInterval(interval);
  }, [userDriverFind?.idDriver, isOffline]);

  useEffect(() => {
    if (!notificationTripCallRequest) return;

    const request = notificationTripCallRequest;
    dispatchTrip({ type: 'update', field: 'notificationTripCallRequest', arg: null });

    setPreloadVisible(true);
    handleTrip(
      request.userId,
      request.callType,
    ).finally(() => {
      setPreloadVisible(false);
    });
  }, [notificationTripCallRequest]);

  const onSearchTrip: TripCallback = async ({ data: trip, type }) => {
    if (type === 'added' || type === 'modified') {
      await handleTrip(parseInt(trip.userId), trip?.tripCallTypeId);
      return;
    }

    if (type === 'removed') {
      AsyncStorage.removeItem('trip');
      try {
        await stopSongActive();
      } catch (error) {
        console.log('Erro ao buscar viagens disponiveis', error);
      }
      dispatchTrip({ type: 'update', field: 'trip', arg: {} });
    }
  };

  const isTripAlreadyPromoted = async (tripReference: string) => {
    if (!tripReference) return false;

    try {
      const raw = await AsyncStorage.getItem('tripDriver');
      const localTrip = raw ? JSON.parse(raw) : null;
      return localTrip?.tripReference === tripReference;
    } catch {
      return false;
    }
  };

  const clearStalePreAcceptedTrip = async (tripReference: string) => {
    if (!tripReference) return;

    let cached = null;
    try {
      const raw = await AsyncStorage.getItem('preAvailableTrip');
      cached = raw ? JSON.parse(raw) : null;
    } catch {
      cached = null;
    }

    const matchesCache = cached?.tripReference === tripReference;
    const matchesState = tripPreAcceptedRef.current?.tripReference === tripReference;

    if (matchesCache) {
      await AsyncStorage.removeItem('preAvailableTrip');
    }

    if (matchesCache || matchesState) {
      dispatchTrip({ type: 'update', field: 'tripPreAccepted', arg: {} });
    }
  };

  const initializeDriverTrip = async (trip: Trip) => {
    if (trip?.status === STATUS_FINISHED || trip?.status === STATUS_CANCELED) return;
    if (FinishedTripStorage.exists(trip?.tripReference)) return;

    await clearStalePreAcceptedTrip(trip?.tripReference);

    const normalizedTrip = normalizeTripLongDistance(trip);
    await AsyncStorage.setItem('tripDriver', JSON.stringify(normalizedTrip));

    dispatchTrip({ type: 'update', field: 'trip', arg: {} });
    dispatchTrip({ type: 'update', field: 'tripAccepted', arg: normalizedTrip });

    if (!isTaximeterTripInProgress(trip)) {
      setIniTripModal(true);

      if (isInTrip && onDriverTripStart) {
        onDriverTripStart();
      }
    }
  };

  const initializeTaximeterTrip = (trip: Trip) => {
    if (isTaximeterTripInProgress(trip) && !containerTaximeter) {
      restoreTripTaximeter(trip);
      setContainerTaximeter(true);
    }
  };

  const onTripScheduledAcceptedReady: TripCallback = ({ data: trip, type }) => {
    if (type === 'added') {
      openApp();

      setSwalVisible(true);
      initializeDriverTrip(trip);
    }
  };

  const onSearchTripInProgress: TripCallback = async ({ data: trip, type }) => {
    const tripReference = trip?.tripReference;

    if (['added', 'modified'].includes(type)) {
      if (FinishedTripStorage.exists(tripReference)) return;

      if (trip?.tripCallType === 'VIAGEM DE MAÇANETA') {
        setVisibleQrCode(false);
        if (trip?.status === 'in_progress') {
          handleStatusTripWithWaypoints(trip);
          if (!trip?.tripWayPoints?.length) {
            setStatusTrip(translate('statusTrip.in_progress'));
          }
        } else {
          setStatusTrip(translate(`statusTrip.${trip?.status}`));
        }
      }

      if (trip?.status === STATUS_PRE_ACCEPTED) {
        if (await isTripAlreadyPromoted(tripReference)) return;

        dispatchTrip({
          type: 'update',
          field: 'tripPreAccepted',
          arg: normalizeTripLongDistance(trip || {}),
        });

        return;
      }

      initializeDriverTrip(trip);
      return;
    }

    if (
      type === 'removed' &&
      Object.keys(cancelTripRef.current || {}).length === 0 &&
      tripReference &&
      tripReference === tripAcceptedRef.current?.tripReference
    ) {
      openApp();
      verify(tripReference);
    }
  };

  const onTripUpdate: TripCallback = async ({ data: trip, type }) => {
    if (!trip) return;

    const hasDestinationChanged =
      Number(tripAcceptedRef.current?.oldDestinationId) !==
      Number(trip?.oldDestinationId);

    const isRouteChange = type === 'modified' && hasDestinationChanged && canModifyRoute;

    if (isRouteChange) {
      openApp();

      if (AppState.currentState === 'active') {
        await song?.playAsync().catch(() => {
          console.log('erro');
        });
      }

      canModifyRoute = false;

      playSong('cancel');

      Alert.alert(
        translate('trip.title_change_route'),
        translate('trip.text_change_route'),
      );

      if (
        tripAcceptedRef.current?.tripWayPoints?.length !== trip?.tripWayPoints?.length &&
        trip?.status === 'in_progress'
      ) {
        setStatusTrip(translate('statusTrip.waypoint'));
      }

      initializeDriverTrip(trip);
    }

    const isTripCancelled =
      type === 'removed' ||
      trip?.status === 'canceled' ||
      trip?.status === STATUS_CANCELED ||
      trip?.status === 'back_off' ||
      trip?.status === STATUS_BACK_OFF;

    if (isTripCancelled && Object.keys(cancelTripRef.current || {}).length === 0) {
      if (tripUpdateEvent) {
        tripRealtime.unsubscribe(tripUpdateEvent);
        tripUpdateEvent = null;
      }

      openApp();

      const tripRef = trip?.tripReference || tripAcceptedRef.current?.tripReference;
      if (tripRef) {
        verify(tripRef);
      }

      canModifyRoute = true;
      return;
    }
  };

  const handleStatusTripWithWaypoints = (trip: Trip) => {
    if (trip.status === 'in_progress' && trip?.tripWayPoints.length !== 0) {
      const waypoints = trip.tripWayPoints.filter((waypoint) => {
        return waypoint.confirmed === '0';
      });

      if (waypoints.length > 0) {
        setStatusTrip(translate('statusTrip.waypoint'));
      } else {
        setStatusTrip(translate('statusTrip.in_progress'));
      }
    }
  };

  async function clearDriverTripState() {
    const tripDriver = await AsyncStorage.getItem('tripDriver');
    if (!tripDriver) return;

    await clearDataTrip();
    await getDriverFind();

    clearTripTaximeter();

    setIniTripModal(false);
    setSwalVisible(false);
  }

  async function resolvePreAcceptedTrip(tripReference: string): Promise<Trip> {
    try {
      const raw = await AsyncStorage.getItem('preAvailableTrip');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}

    return await verifyExistTrip(tripReference);
  }

  async function initializeActiveDriverTrips(tripsActives: TripActive[]) {
    if (tripsActives.length === 0) {
      clearDriverTripState();
      return;
    }

    const preAcceptedTrip = tripsActives.find(
      (trip) =>
        trip?.status === STATUS_PRE_ACCEPTED &&
        !FinishedTripStorage.exists(trip?.tripReference),
    );

    const activeTrip = tripsActives?.find(
      (trip) =>
        trip?.status !== STATUS_PRE_ACCEPTED &&
        !FinishedTripStorage.exists(trip?.tripReference),
    );

    if (
      preAcceptedTrip?.tripReference &&
      !(await isTripAlreadyPromoted(preAcceptedTrip.tripReference))
    ) {
      const preAccepted = await resolvePreAcceptedTrip(preAcceptedTrip.tripReference);
      if (preAccepted?.tripReference) {
        dispatchTrip({ type: 'update', field: 'tripPreAccepted', arg: preAccepted });
      }
    }

    if (!activeTrip) return;

    try {
      setStatusTrip(translate(`statusTrip.${activeTrip?.status}`));
      const data: Trip = await verifyExistTrip(activeTrip.tripReference);

      const tripToRestore = data || offlineTripActive;
      if (tripToRestore) {
        await restoreActiveTrip(tripToRestore);
      }
    } catch (error) {
      console.log('Erro ao verificar viagens ativas', error);
    }
  }

  const restoreActiveTrip = async (trip: Trip): Promise<void> => {
    handleStatusTripWithWaypoints(trip);
    await initializeDriverTrip(trip);
    initializeTaximeterTrip(trip);
    restoreRecalculation();
  };

  const handleFlashlight = async () => {
    const appSetting = await AsyncStorage.getItem('appSetting');
    const flashEnabled = JSON.parse(appSetting)?.enableFlashLight;

    if (
      flashEnabled &&
      tripAccepted?.status === STATUS_BOARDING &&
      tripAccepted?.tripCallType !== 'VIAGEM DE MAÇANETA'
    ) {
      blink(500, 1000);
    } else {
      stop();
    }
  };

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!!tripUpdateEvent) return;

    if (tripAccepted?.tripReference) {
      tripUpdateEvent = tripRealtime.getTrip(tripAccepted.tripReference, onTripUpdate);
    }

    return () => {
      if (!!tripUpdateEvent) {
        tripRealtime.unsubscribe(tripUpdateEvent);
        tripUpdateEvent = null;
      }
    };
  }, [tripAccepted.tripReference, userDriverFind.idDriver]);

  // Sincronização periódica com a central para detectar cancelamentos durante corrida ativa
  useEffect(() => {
    const activeRef = tripAccepted?.tripReference;
    if (!activeRef || tripAccepted?.status === STATUS_FINISHED || tripAccepted?.status === STATUS_CANCELED) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const check = await verifyExistTrip(activeRef);
        if (
          !check ||
          check?.status === STATUS_CANCELED ||
          check?.status === 'canceled' ||
          check?.status === STATUS_BACK_OFF ||
          check?.status === 'back_off' ||
          check?.status === STATUS_FINISHED
        ) {
          verify(activeRef);
        }
      } catch (err) {}
    }, 2500);

    return () => clearInterval(interval);
  }, [tripAccepted?.tripReference, tripAccepted?.status]);

  useEffect(() => {
    if (!isLoadingActiveTrips) {
      handleFlashlight();
    }
  }, [tripAccepted?.status, tripAccepted?.tripCallType, isLoadingActiveTrips]);

  useEffect(() => {
    if (!isLoadingActiveTrips) {
      initializeActiveDriverTrips(tripsActives);
    }
  }, [tripsActives, isLoadingActiveTrips]);

  useEffect(() => {
    if (!userDriverFind?.idDriver) return;

    const driver = userDriverFind?.idDriver;
    const unsubscribes = new Set<string>();

    if (!isOffline) {
      const unsubscribeSearchTrip = tripRealtime.searchTrip(driver, onSearchTrip);

      const unsubscribeScheduledTrips = tripRealtime.getTripScheduledAcceptedReady(
        driver,
        onTripScheduledAcceptedReady,
      );

      const unsubscribeTripByStatus = tripRealtime.searchTripInProgress(
        driver,
        onSearchTripInProgress,
      );

      unsubscribes.add(unsubscribeSearchTrip);
      unsubscribes.add(unsubscribeScheduledTrips);
      unsubscribes.add(unsubscribeTripByStatus);
    }

    return () => {
      unsubscribes.forEach((unsubscribe) => tripRealtime.unsubscribe(unsubscribe));
      unsubscribes.clear();
    };
  }, [userDriverFind.idDriver, isOffline, tripRealtime]);

  return <>{tripAccepted && <ProgressBarComponent trip={tripAccepted} />}</>;
};
