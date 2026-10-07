import {useEffect, useMemo, useRef, useState} from 'react';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import {Alert, AppState} from 'react-native';
import {useLocal} from '../../hooks/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTripStatusProvider} from '../../context/TripStatus';
import {translate} from '../../../../client/locales';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_PRE_ACCEPTED,
  STATUS_SCHEDULED,
} from '../../constants/trip';
import {useTaximeter} from '../../context/Taximeter';
import {TripRealtime} from '../../service/realtime/TripRealtime';
import {mountSong} from '../../utils/mountSong';
import {customToast} from '../../../../utils/FlashMessage';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
// @ts-ignore
import Torch from 'react-native-torch';
import Helper from '../../utils/Helper';
import {ProgressBarComponent} from '../../../../common/ProgressBarComponent';
import {useModals} from '../../../../context/Modals';

let canModifyRoute = true;
let hasRun = true;

export const TripRealtimeComponent = ({
  setIniTripModal,
  setSwalVisible,
  setVisibleQrCode,
  handleMyLocation,
  iniTripModal,
}) => {
  const {setContainerTaximeter, containerTaximeter} = useModals();
  const {itsNetwork} = useNetwork();
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {
    getDriverTrip,
    dispatchTrip,
    sendAvaliations,
    verifyExistTrip,
    initTripPreAccepted,
    clearDataTrip,
    clearDataPreAcceptedTrip,
  } = useTripProvider();
  const {userDriverFind, toogleDriverStatus, getDriverFind} = useUserDriver();
  const {location} = useLocal();
  const {setStatusTrip, onlyFinishTripOffline, initTripsActive} =
    useTripStatusProvider();
  const {stateTrip} = useTripProvider();
  const {trip, tripPreAccepted, tripAccepted, song, cancelTrip} = stateTrip;
  const {setTripTaximeter, tripTaximeter} = useTaximeter();
  const [tripReferenceCurrent, setTripReferenceCurrent] = useState(null);
  const {openApp} = useBubbleButton();

  const touchCount = useRef(0);
  const tripAcceptedRef = useRef<any>(null);
  const locationRef = useRef<any>({
    coords: {
      latitude: location?.coords?.latitude || 0,
      longitude: location?.coords?.longitude || 0,
    },
  });

  const unsubscribesRef = useRef({
    search: null,
  });

  const [blinkTimeout, setBlinkTimeout] = useState(null);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    tripAcceptedRef.current = tripAccepted;
  }, [tripAccepted]);

  const verify = async (tripReference: string, isPreAccepted = false) => {
    if (!itsNetwork) {
      return;
    }
    const response = await verifyExistTrip(tripReference);

    if (response && response.status === 'canceled') {
      await mountSong(
        require('../../assets/songs/alertClientCancelTrip.mp3'),
      ).then(async sound => {
        await sound?.playAsync();

        await openApp();
      });

      getDriverFind();

      if (
        isPreAccepted &&
        tripPreAccepted.tripReference !== undefined &&
        tripAccepted.tripReference !== tripPreAccepted.tripReference
      ) {
        customToast(
          translate(
            `finishTrip.text_trip_pre_accepted_cancelled_by_${
              response.canceledBy === 'customer'
            }`,
          ),
          'warning',
        );

        clearDataPreAcceptedTrip();
        return;
      }
      const actualTrip = {
        ...tripAccepted,
        cancelledBy: 'customer',
      };

      dispatchTrip({
        type: 'update',
        field: 'tripAccepted',
        arg: actualTrip,
      });

      customToast(
        translate(
          `finishTrip.text_trip_cancelled_by_${
            response.canceledBy === 'customer'
          }`,
        ),
        'warning',
      );
      setIniTripModal(false);

      clearDataTrip();
    }
  };

  const handleTrip = async (
    userId: number,
    callType?: string | number | null,
  ) => {
    if (!itsNetwork) {
      return;
    }
    await getDriverTrip(
      Number(userDriverFind.idDriver),
      {
        latitude: locationRef?.current?.coords?.latitude,
        longitude: locationRef?.current?.coords?.longitude,
      },
      userId,
      callType,
    ).then(async response => {
      if (response) {
        dispatchTrip({
          type: 'update',
          field: 'callDriverModal',
          arg: true,
        });
        if (AppState.currentState !== 'active') {
          // await openApp();
        }
        try {
          await song?.playAsync();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  let isFlashlightOn = false;

  const handleFlashlight = (duration: number, interval: number) => {
    if (touchCount.current >= 30) {
      clearTimeout(blinkTimeout);
      Torch && Torch.switchState(false);
      touchCount.current = 0;
      return;
    }

    touchCount.current += 1;

    if (isFlashlightOn) {
      Torch && Torch.switchState(false);
      isFlashlightOn = false;
    } else {
      Torch && Torch.switchState(true);
      isFlashlightOn = true;
    }

    setBlinkTimeout(
      setTimeout(
        () => {
          handleFlashlight(duration, interval);
        },
        isFlashlightOn ? duration : interval,
      ),
    );
  };

  const verifyStorageFlashlight = async () => {
    return JSON.parse(await AsyncStorage.getItem('appSetting'))
      ?.enableFlashLight;
  };

  const playFlashlight = async () => {
    const flashLightConfig = await verifyStorageFlashlight();
    if (
      tripAccepted?.status === 'boarding' &&
      flashLightConfig &&
      tripAccepted?.tripCallType !== 'VIAGEM DE MAÇANETA'
    ) {
      handleFlashlight(500, 1000);
    }
    Torch && Torch.switchState(false);
    clearTimeout(blinkTimeout);
  };

  const searchTripByStatus = () => {
    try {
      tripRealtime.searchTripByStatusScheduled(
        userDriverFind?.idDriver,
        STATUS_ACCEPTED,
        async (trip, type) => {
          if (type === 'modified' || type === 'added') {
            if (
              trip?.status !== STATUS_SCHEDULED &&
              !tripAcceptedRef?.current
            ) {
              dispatchTrip({
                type: 'update',
                field: 'tripAccepted',
                arg: trip,
              });
              await AsyncStorage.setItem('tripDriver', JSON.stringify(trip));
              setIniTripModal(true);
            }
          }
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const initTripCallTaximeter = async trip => {
    trip.initTaximeter = true;
    await dispatchTrip({
      type: 'update',
      field: 'tripAccepted',
      arg: trip,
    });
  };

  useEffect(() => {
    playFlashlight();
    if (tripAccepted?.status) {
      if (
        tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO' &&
        tripAccepted?.status === STATUS_IN_PROGRESS &&
        !containerTaximeter &&
        tripAccepted?.initTaximeter
      ) {
        setContainerTaximeter(true);
        handleCreateVariablesTripTaximeter(tripAccepted);
      }
      if (!iniTripModal) {
        setIniTripModal(true);
      }
      handleMyLocation && handleMyLocation();
      // calculateAndDisplayRoute(
      //   tripAccepted?.origin,
      //   tripAccepted?.destination,
      //   {
      //     lat: position?.latitude,
      //     lng: position?.longitude,
      //   },
      //   true,
      // );
    }
    if (tripReferenceCurrent !== tripAccepted?.tripReference) {
      if (
        (tripAccepted?.status === 'accepted' ||
          tripAccepted?.status === 'boarding') &&
        Object.keys(cancelTrip).length !== 0
      ) {
        tripRealtime.searchTripByStatus(
          userDriverFind?.idDriver,
          tripAccepted?.status,
          async (tripWatched: any, type) => {
            if (type === 'removed') {
              verify(tripWatched.tripReference);
            }
          },
        );
      }
    }
    if (tripReferenceCurrent !== tripAccepted?.tripReference) {
      setTripReferenceCurrent(tripAccepted?.tripReference);
      if (tripAccepted && Object.keys(tripAccepted).length !== 0) {
        tripRealtime.getTrip(
          tripAccepted.tripReference,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          async (tripFirebase, type: string) => {
            if (
              type === 'modified' &&
              Number(tripAccepted.oldDestinationId) !==
                Number(tripFirebase.oldDestinationId) &&
              canModifyRoute
            ) {
              try {
                if (AppState.currentState === 'active') {
                  await song?.playAsync();
                }
              } catch (error) {
                console.log('erro');
              }
              canModifyRoute = false;
              await mountSong(
                require('../../assets/songs/alertClientCancelTrip.mp3'),
              ).then(async sound => {
                await sound?.playAsync();
              });
              await Alert.alert(
                translate('trip.title_change_route'),
                translate('trip.text_change_route'),
              );
              await AsyncStorage.setItem(
                'tripDriver',
                JSON.stringify(tripFirebase),
              );
              if (
                tripAccepted?.tripWayPoints?.length !==
                  tripFirebase?.tripWayPoints?.length &&
                tripFirebase.status === 'in_progress'
              ) {
                setStatusTrip(translate('statusTrip.waypoint'));
              }
              return dispatchTrip({
                type: 'update',
                field: 'tripAccepted',
                arg: tripFirebase,
              });
            }

            if (type === 'removed' && Object.keys(cancelTrip).length === 0) {
              if (!hasRun) {
                await Helper.timeout(5000).then(() => {
                  hasRun = true;
                });
                return;
              }
              hasRun = false;
              verify(tripFirebase.tripReference);
              canModifyRoute = true;
            }
            return '';
          },
        );
      }
    }
  }, [tripAccepted]);

  const handleTripFirebase = async (tripFirebase, type) => {
    if (type === 'added' || type === 'modified') {
      await handleTrip(tripFirebase.userId, tripFirebase?.tripCallTypeId);
      return;
    }

    if (type === 'removed') {
      AsyncStorage.removeItem('trip');
      try {
        await song?.stopAsync();
      } catch (error) {
        console.log('erro', error);
      }
      dispatchTrip({type: 'update', field: 'trip', arg: {}});
    }
  };

  const verificationIfHaveTripOffline = async () => {
    try {
      const trip = await AsyncStorage.getItem('tripOff');
      const recalculated = await AsyncStorage.getItem('recalculateOff');
      const sendAvaliableOff = await AsyncStorage.getItem('sendAvaliableOff');
      if (trip || recalculated || sendAvaliableOff) {
        const tripParse = await JSON?.parse(trip);
        if (!tripParse) {
          return false;
        }
        await onlyFinishTripOffline(tripParse);
        if (sendAvaliableOff) {
          const {
            selectedOrigin,
            selectedDestination,
            originName,
            destinationName,
          } = await JSON?.parse(sendAvaliableOff);
          await sendAvaliations(
            selectedOrigin,
            originName,
            selectedDestination,
            destinationName,
            tripParse,
          );
        }
        await AsyncStorage.removeItem('tripOff');
        await AsyncStorage.removeItem('recalculateOff');
        await AsyncStorage.removeItem('sendAvaliableOff');

        return true;
      }
    } catch (error) {
      console.log('error', error);
      return false;
    }
  };

  const clearStorageTripTaximeter = () => {
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

  const handleCreateVariablesTripTaximeter = response => {
    clearStorageTripTaximeter();
    AsyncStorage.setItem('fare', JSON.stringify(response.fare));
    AsyncStorage.setItem('priceTaximeter', JSON.stringify(response.price));
    AsyncStorage.setItem('startTaximetro', JSON.stringify(new Date()));
    AsyncStorage.setItem('currentTimeTaximeter', JSON.stringify(0));
    setTripTaximeter(response);
    initTripCallTaximeter(response);
  };

  async function checkIfDriverIsInTrip(
    type: string | boolean = false,
    stopOnTerminate = false,
  ) {
    const response = JSON.parse(await AsyncStorage.getItem('tripDriver'));
    const result = await verificationIfHaveTripOffline();
    if (result || stopOnTerminate) {
      return;
    }
    if (!itsNetwork) {
      return;
    }
    if (response !== null) {
      const updatedData = await verifyExistTrip(response.tripReference);
      const preAvailableTrip = JSON.parse(
        await AsyncStorage.getItem('preAvailableTrip'),
      );

      if (
        !updatedData ||
        (preAvailableTrip !== null && updatedData.status === 'finished')
      ) {
        initTripPreAccepted();
        setStatusTrip(translate('statusTrip.accepted'));
        setIniTripModal(true);
        return;
      }

      if (updatedData?.status === STATUS_PRE_ACCEPTED) {
      } else {
        dispatchTrip({
          type: 'update',
          field: 'tripAccepted',
          arg: updatedData || {},
        });
      }

      if (
        response?.tripCallType === 'CHAMADA TAXÍMETRO' &&
        type !== 'modified'
      ) {
        setTripTaximeter(response);
        if (!response?.customer?.name) {
          setContainerTaximeter(true);
          return true;
        }
        handleCreateVariablesTripTaximeter(response);
        return true;
      }
      setIniTripModal(true);
      return true;
    }

    return false;
  }

  useEffect(() => {
    if (itsNetwork) {
      checkIfDriverIsInTrip(false, true);
    }
  }, [itsNetwork]);

  useEffect(() => {
    const handleTripByStatus = async (trip, type) => {
      if (
        (type !== 'removed' && trip?.tripCallType === 'VIAGEM DE MAÇANETA') ||
        (type !== 'removed' && trip?.oldPrice) ||
        (type !== 'removed' && !trip?.callingDriver)
      ) {
        const response = await checkIfDriverIsInTrip(type);
        if (response) return;
        if (trip?.tripCallType === 'VIAGEM DE MAÇANETA') {
          setStatusTrip(translate('statusTrip.boarding'));
        }

        setVisibleQrCode(false);
        if (type === 'added' || type === 'modified') {
          await AsyncStorage.setItem('tripDriver', JSON.stringify(trip));
          dispatchTrip({
            type: 'update',
            field: 'tripAccepted',
            arg: trip,
          });

          if (
            trip.status === 'accepted' &&
            trip.schedule &&
            Object.keys(trip.schedule).length > 0
          ) {
            return setSwalVisible(true);
          }

          setIniTripModal(true);
        }
      }


      if (
        (type === 'added' && trip?.status === 'pre_accepted') ||
        (type === 'modified' && trip?.status === 'pre_accepted')
      ) {
        dispatchTrip({
          type: 'update',
          field: 'tripPreAccepted',
          arg: trip || {},
        });
      }

      if (
        (type === 'added' && !tripAcceptedRef?.current?.status) ||
        (type === 'modified' && !tripAcceptedRef?.current?.status)
      ) {
        await AsyncStorage.setItem('tripDriver', JSON.stringify(trip));
        const response = await checkIfDriverIsInTrip(type);
        if (response) setIniTripModal(true);
      }
    };

    if (
      (Object.keys(trip).length === 0 &&
        userDriverFind?.status === 'disponivel') ||
      (Object.keys(trip).length === 0 &&
        userDriverFind?.preAvailable === '1' &&
        Object.keys(tripPreAccepted).length === 0)
    ) {

      tripRealtime.searchTripByStatus(
        userDriverFind?.idDriver,
        STATUS_BOARDING,
        handleTripByStatus,
      );
    }
    if (
      userDriverFind?.status === 'disponivel' &&
      Object.keys(trip).length !== 0
    ) {
      dispatchTrip({type: 'update', field: 'callDriverModal', arg: true});
    }
    if (userDriverFind?.status === 'corrida' || userDriverFind?.trip) {
      checkIfDriverIsInTrip();
    }
    initTripsActive();
  }, [userDriverFind?.status, userDriverFind?.preAvailable]);

  useEffect(() => {
    if (userDriverFind?.idDriver)
      unsubscribesRef.current.search = tripRealtime.searchTrip(
        userDriverFind?.idDriver,
        handleTripFirebase,
      );
    searchTripByStatus();
    return () => {
      unsubscribesRef.current?.search && unsubscribesRef?.current?.search();
    };
  }, []);

  return tripAccepted && <ProgressBarComponent trip={tripAccepted} />;
};
