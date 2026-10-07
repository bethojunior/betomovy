/* eslint-disable @typescript-eslint/no-shadow */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from '@googlemaps/polyline-codec';
import {Audio} from 'expo-av';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {debounce} from 'lodash';
import {tripService} from './services';
import {
  TripContextChildren,
  TripContextType,
  TripInfo,
  CancelTripProps,
  OriginProps,
  DestinationProps,
  stateTripProps,
} from './types';
import {useUserDriver} from '../userDriver';
import {TripService} from './service';
import {useAuth} from '../../../../context/auth';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  TRIP_CALL_PARTNER,
} from '../../constants/trip';
import Helper from '../../../../client/utils/Helper';
import {useLocalProvider} from '../local';
import apiMainDriver from '../../api/apiMain';
import {removeAllMask} from '../../utils/format';
import {TripStatusService} from '../TripStatus/service';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import {mountSong} from '../../utils/mountSong';
import {searchNative, updateRoute} from './directionRoute';
import {calculateDistanceFromLatLonInMeters} from '../../../../client/utils/position';
import {useStorage} from '../../../../utils/Storage';
import MapService from '../../../../client/services/mapService';

const TripContext = createContext<TripContextType>({} as TripContextType);

const initialState: stateTripProps = {
  trip: {} as TripInfo,
  tripPreAccepted: {} as TripInfo,
  tripAccepted: {} as TripInfo,
  origin: {} as OriginProps,
  destination: {} as DestinationProps,
  dataCalculate: {},
  listSchedule: [],
  listScheduleAccepted: [],
  rating: 5,
  polyline: [],
  song: () => {},
  flashlight: false,
  callDriverModal: false,
  countTrip: 0,
  hasRun: true,
  cancelTrip: {} as CancelTripProps,
  tripsOffer: [] as TripInfo[],
};

const reducer = (state, action: {type: string; field?: string; arg?: any}) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.arg,
      };
    case 'clearTripAccepted':
      return {
        ...state,
        tripAccepted: {},
        polyline: [],
      };
    case 'initTripPreAccepted':
      return {
        ...state,
        tripAccepted: action.arg,
        tripPreAccepted: {},
      };
    case 'acceptTrip':
      return {
        ...state,
        tripAccepted: action.arg,
        trip: {},
      };
    default:
      return false;
  }
};

export const TripProvider = ({children}: TripContextChildren) => {
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
    song,
    hasRun,
    cancelTrip,
  } = stateTrip;

  const {hideBubble} = useBubbleButton();
  const {cityConfig, tokenDriver} = useAuth();
  const {userDriverFind, setUserDriverFind, toogleDriverStatus, getDriverFind} =
    useUserDriver();
  const locationNow = useMemo(async () => {
    return await Location.getCurrentPositionAsync({});
  }, []);
  const service = TripService();
  const serviceTripStatus = TripStatusService();
  const {getLocal, location} = useLocalProvider();

  const {getItem} = useStorage();

  useEffect(() => {
    const mountSong = async () => {
      const {sound} = await Audio.Sound.createAsync(
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('../../assets/songs/assobio.mp3'),
      );

      dispatchTrip({type: 'update', field: 'song', arg: sound});
    };

    mountSong();
  }, []);

  const postPerOrigin = async (local = null) => {
    const response = await getLocal(local?.latitude, local?.longitude);
    if (response?.data) {
      dispatchTrip({type: 'update', field: 'origin', arg: response.data});
    }
  };

  const acceptTrip = async (
    driverId: string,
    tripReference: string,
    estimatedTimeDriverArrival: number,
    distanceDriverArrival: number,
  ) => {
    try {
      await song.pauseAsync();
      const response = await service.accept(
        driverId,
        tripReference,
        estimatedTimeDriverArrival,
        distanceDriverArrival,
      );

      dispatchTrip({type: 'update', field: 'countTrip', arg: response.data});
      try {
        await song?.stopAsync();
      } catch (error) {
        console.log(error);
      }
      return response;
    } catch (error) {
      return customToast(
        translate('driverTrip.text_error_accept_trip'),
        'danger',
      );
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

  const getDriverTrip = async (
    driverId: number,
    location: {latitude: number; longitude: number},
    userId: number,
    callType?: string | number | null,
  ) => {
    if (!hasRun) {
      await Helper.timeout(5000).then(() => {
        dispatchTrip({type: 'update', field: 'hasRun', arg: true});
      });
      return '';
    }
    if (hasRun) {
      await dispatchTrip({type: 'update', field: 'hasRun', arg: false});
      try {
        const listTripsDenied = await getTripDenied();
        const response = await service.search(
          driverId,
          listTripsDenied,
          location,
          userId,
        );

        if (response === null || response === undefined) {
          dispatchTrip({type: 'update', field: 'trip', arg: {}});
          return false;
        }

        if (callType && callType === TRIP_CALL_PARTNER) {
          response.callType = 'partner';
        }

        await AsyncStorage.setItem('trip', JSON.stringify(response));
        dispatchTrip({type: 'update', field: 'trip', arg: response});
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        try {
          // resolve song loop. Nao esta identificando const {sound}
          await song?.setIsLoopingAsync(true);
        } catch {
          return true;
        }
        return true;
      } catch (error) {
        return console.log(error);
      }
    }
    return '';
  };

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
      await song.pauseAsync();
      const response = await service.refuse(driverId, tripReference);

      if (response) {
        AsyncStorage.removeItem('trip');

        let tripsDeined = JSON.parse(
          await AsyncStorage.getItem('tripsDeniedDriver'),
        );

        if (tripsDeined === null || tripsDeined.length === 0) {
          tripsDeined = {
            tripReference: trip.tripReference,
            date: new Date(),
          };
        } else {
          tripsDeined.push({
            tripReference: trip.tripReference,
            date: new Date(),
          });
        }

        try {
          await song?.stopAsync();
        } catch (error) {
          console.log('erro', error);
        }
        dispatchTrip({type: 'update', field: 'trip', arg: {}});

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
    song.pauseAsync();
    await AsyncStorage.removeItem('routeTraveled');
    await AsyncStorage.removeItem('tripCallKnob');
    await AsyncStorage.removeItem('valueCancellationFeeByCustomer');
    await AsyncStorage.removeItem('tripDriver');

    userDriverFind.status = 'disponivel';
    setUserDriverFind(userDriverFind);

    dispatchTrip({type: 'clearTripAccepted'});
  };

  const clearDataPreAcceptedTrip = async () => {
    await AsyncStorage.removeItem('preAvailableTrip');
    await AsyncStorage.removeItem('tripInWait');
    userDriverFind.preAvailableTrip = {};
    await serviceTripStatus.putPreAvailable();
    userDriverFind.preAvailable = '1';
    await AsyncStorage.setItem('user', JSON.stringify(userDriverFind));
    song.pauseAsync();
    setUserDriverFind(userDriverFind);
    dispatchTrip({type: 'update', field: 'tripPreAccepted', arg: {}});
  };

  const cancel = async (preAccepted = false) => {
    try {
      song.pauseAsync();
      const status = await service.cancell(cancelTrip);
      getDriverFind();

      if (!status) {
        return customToast(
          translate('driverTrip.text_error_cancel_trip'),
          'danger',
        );
      }

      mountSong(require('../../assets/songs/alertClientCancelTrip.mp3')).then(
        async sound => {
          await sound.playAsync();
        },
      );

      if (preAccepted) {
        clearDataPreAcceptedTrip();
        return customToast(
          translate('driverTrip.text_trip_cancelled'),
          'success',
        );
      }

      dispatchTrip({type: 'update', field: 'cancelTrip', arg: {}});

      clearDataTrip();
      return customToast(
        translate('driverTrip.text_trip_cancelled'),
        'success',
      );
    } catch (error) {
      return console.log(error);
    }
  };

  const verifyExistTrip = async (tripReference: string) => {
    try {
      return service.get(tripReference);
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
    dispatchTrip({type: 'update', field: 'trip', arg: {}});
  };

  const setOn = async () => {
    const positionDriver = {
      latitude: (await locationNow).coords.latitude,
      longitude: (await locationNow).coords.longitude,
    };
    await toogleDriverStatus('disponivel', {
      latitude: positionDriver.latitude,
      longitude: positionDriver.longitude,
    });
  };

  const sendAvaliations = async (
    selectedOrigin: number,
    origin: string,
    selectedDestination: number,
    destination: string,
    trip: TripInfo = tripAccepted,
    mountRiskAddress: {}[] = [],
  ) => {
    const result = await service.rate(rating, trip.tripReference);

    if (!result.status) {
      customToast(translate('finishTrip.title_error_finish'), 'danger');
      return false;
    }

    const addresses = [];

    if (selectedOrigin === 2) {
      addresses.push(JSON.stringify(origin));
    }

    if (selectedDestination === 2) {
      addresses.push(JSON.stringify(destination));
    }

    if (addresses.length > 0) {
      service.addBlackList(addresses);
    }

    mountRiskAddress.map(item => {
      service.addRiskArea(item);
    });

    customToast(translate('finishTrip.title_success_finish'), 'success');
    setOn();
    return true;
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
    async (dataCustomer, priceNew = null) => {
      const newTrip = {
        destination: await prepareAddressResult(destination),
        distance: dataCalculate?.data.distance,
        driverId: userDriverFind.idDriver,
        estimatedTripTime: dataCalculate?.data?.duration,
        origin: await prepareAddressResult(origin),
        price: priceNew
          ? priceNew.replace(cityConfig?.typeMoney, '').replace(',', '.')
          : dataCalculate?.data?.price?.price,
        priceId: dataCalculate?.data?.price?.idPrice,
        recalculatedTrip: priceNew
          ? {
              oldPrice: dataCalculate?.data?.price?.price,
              newPrice: priceNew
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
      };
      const {data} = await apiMainDriver.post('/KnobTrip/Init', newTrip);
      if (!data.status) {
        dispatchTrip({type: 'update', field: 'dataCalculate', arg: {}});
        dispatchTrip({type: 'update', field: 'destination', arg: {}});
        return customToast(data?.message, 'danger');
      }
      dispatchTrip({type: 'update', field: 'dataCalculate', arg: {}});
      dispatchTrip({type: 'update', field: 'destination', arg: {}});

      // return postPerOrigin();
    },
    [destination, origin, userDriverFind, dataCalculate],
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
    async (origin, destination, tripTypeId) => {
      const payload = {
        destiny: await prepareAddressResult(destination),
        origin: await prepareAddressResult(origin),
        tripTypeId,
      };

      const {data} = await apiMainDriver.post('Price/Calculate', payload);

      if (!data.status) {
        return customToast(data?.message, 'danger');
      }
      return dispatchTrip({type: 'update', field: 'dataCalculate', arg: data});
    },
    [],
  );

  const prepareAddressResult = useCallback(async item => {
    if (item.latitude == null && item.longitude == null) {
      const {
        data: {data},
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
      tripPreAccepted.status = 'accepted';

      await AsyncStorage.setItem('tripDriver', JSON.stringify(tripPreAccepted));
      await AsyncStorage.removeItem('preAvailableTrip');
      dispatchTrip({type: 'initTripPreAccepted', arg: tripPreAccepted});

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

  const sendPolyline = async ({lat, lng}, data) => {
    const [kmProgressing, minuteProgressing] = await Promise.all([
      getKmRouteTraveled(),
      getMinutesRouteTraveled(),
    ]);

    const routeUpdatePayload = {
      tripReference: tripAccepted?.tripReference,
      polyline: data?.overview_polyline?.points,
      time: `${(data?.duration / 60).toFixed(0)} min`,
      idDriver: userDriverFind?.idDriver,
      position: {lat, lng},
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
  const sendPolylinePreAccepted = async ({lat, lng}, data) => {
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
        position: {lat, lng},
        kmProgressing: kmProgressing,
        minuteProgressing: minuteProgressing,
      },
      {token: tokenDriver, userid: userDriverFind?.userId},
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
    debounce(async (origin, destination, {lat, lng}, continueTrue = false) => {
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
        .then(({status, data}: any) => {
          if (!status) {
            return;
          }

          AsyncStorage.setItem(
            'timePolyline',
            `${Number(data?.duration / 60)} min`,
          );

          sendPolyline({lat, lng}, data); // ENVIO DE POLYLINE PARA O CLIENTE
          // await socketOnTrip(); // Colocar quando houver socket

          if (tripPreAccepted?.tripReference) {
            sendPolylinePreAccepted({lat, lng}, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
          }

          const polilyne = decode(data.overview_polyline.points).map(item => {
            return {latitude: item[0], longitude: item[1]};
          });

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

        await dispatchTrip({type: 'acceptTrip', arg: response?.data});
        userDriverFind.status = 'corrida';

        await AsyncStorage.setItem(
          'tripDriver',
          JSON.stringify(response?.data),
        );
      } catch {}
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
      } catch {}
    },
    [userDriverFind],
  );

  let lastPositionInRealTime = null;
  const metersDiffSendPosition = 50;
  let isLoading = false;

  const sendPosition = useCallback(
    debounce(async payload => {
      const data = {
        latitude: payload?.latitude,
        longitude: payload?.longitude,
        idDriver: userDriverFind?.idDriver,
        tripReference: tripAccepted?.tripReference || null,
      };

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

      if (isLoading) {
        // If a request is already in progress, don't make a new request
        return;
      }

      isLoading = true; // A request is about to start

      lastPositionInRealTime = {
        latitude: payload?.latitude,
        longitude: payload?.longitude,
      };

      try {
        await service.sendPosition(data);
        isLoading = false; // Request finished
      } catch (error) {
        console.log(error);
        isLoading = false; // Request finished
      }
    }, 1000), // Adjust this time based on your needs
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
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
export const useTripProvider = () => {
  const context = useContext(TripContext);

  return context;
};

export default TripProvider;
