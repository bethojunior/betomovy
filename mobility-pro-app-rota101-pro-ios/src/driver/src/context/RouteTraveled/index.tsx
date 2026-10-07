import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import {useTripProvider} from '../Trip';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  TRIP_CALL_TAXIMETER,
} from '../../constants/trip';
import {useLocal} from '../../hooks/location';
import {decode} from '@googlemaps/polyline-codec';
import {
  calculateDistanceFromLatLonInMeters,
  getDistanceFromLatLonInMeters,
} from '../../../../client/utils/position';
import {useAuth} from '../../../../context/auth';
import {TripStatusService} from '../TripStatus/service';
import {useUserDriver} from '../userDriver';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ResponsePropsApi, RouteTraveledProps} from './types';
import {ChildrenType} from '../../../@types';
import {debounce} from 'lodash';
import {searchNative, updateRoute} from '../Trip/directionRoute';
import {TripService} from '../Trip/service';
import {useStorage} from '../../../../utils/Storage';
import MapService from '../../../../client/services/mapService';
import {useConfigLocal} from '../ConfigLocal';

const RouteTraveledContext = createContext({} as RouteTraveledProps);
export const RouteTraveledProvider = ({children}: ChildrenType) => {
  const [polyline, setPolyline] = useState([]);
  const {stateTrip, clearDataTrip} = useTripProvider();

  const cachePol = useRef(false);
  const remakePol = useRef(false);

  const {cityConfig, tokenDriver} = useAuth();
  const {tripAccepted, tripPreAccepted} = stateTrip;
  const {location} = useLocal();
  const {setItem, getItem} = useStorage();

  const {userDriverFind, setUserDriverFind} = useUserDriver();
  const [verifyPosition, setVerifyPosition] = useState(false);
  const [metersRound, setMetersRound] = useState(0);
  const [minutesTraveled, setMinutesTraveled] = useState(0);
  const service = TripService();

  const [lastPositionMarker, setLastPositionMarker] = useState(null);

  const lastKnownLocation = useRef(null);
  const metersDiffCalculation = 30; // Quantidade de metros antes de uma nova chamada ser necessária
  const metersDiffCalculationCache = 15; // Quantidade de metros antes de uma nova chamada ser necessária
  const isLoadingRoute = useRef(false); // Variável para verificar se uma cham
  const lastDate = useRef(new Date());
  const {states} = useConfigLocal();
  const {metersToCut, cachePolylineOn} = states;

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

  function removeLastDigit(numero: number) {
    if (numero < 10) {
      return 1; // Retorna 0 para números menores que 10
    }

    const strNumero = numero.toString();
    const novoNumeroStr = strNumero.slice(0, -1);
    const novoNumero = parseInt(novoNumeroStr, 10);

    return novoNumero;
  }

  const distance = useRef(0);

  const calcularPontosIntermediarios = polyline => {
    let pontosIntermediarios = [];

    for (let i = 0; i < polyline.length - 1; i++) {
      // pontosIntermediarios.push(polyline[i]);
      const point1 = polyline[i];
      const point2 = polyline[i + 1];

      const distanceToSegment = getDistanceFromLatLonInMeters(
        point1.latitude,
        point1.longitude,
        point2.latitude,
        point2.longitude,
      );

      distance.current += distanceToSegment;

      const quantityPoints = removeLastDigit(
        Number(distanceToSegment.toFixed(0)),
      );

      const latDiff =
        (polyline[i + 1].latitude - polyline[i].latitude) /
        (quantityPoints + 1);
      const lonDiff =
        (polyline[i + 1].longitude - polyline[i].longitude) /
        (quantityPoints + 1);

      for (let j = 1; j <= quantityPoints; j++) {
        const latIntermediaria = polyline[i].latitude + j * latDiff;
        const lonIntermediaria = polyline[i].longitude + j * lonDiff;
        pontosIntermediarios.push({
          latitude: latIntermediaria,
          longitude: lonIntermediaria,
        });
      }
    }

    return pontosIntermediarios;
  };

  const cutPolyline = (originalPolyline, currentLocation) => {
    const minDistanceThreshold = metersToCut; // Distância mínima padrão de 20 metros

    for (let i = 0; i < originalPolyline.length - 1; i++) {
      const point1 = originalPolyline[i];

      const distanceToSegment = getDistanceFromLatLonInMeters(
        point1.latitude,
        point1.longitude,
        currentLocation.latitude,
        currentLocation.longitude,
      );

      if (distanceToSegment <= minDistanceThreshold) {
        // O veículo se aproximou o suficiente da polyline, corta a polyline
        const indexToCut = i + 1;
        const updatedPolyline = originalPolyline.slice(
          indexToCut,
          originalPolyline.length,
        );
        return updatedPolyline;
      } else if (distanceToSegment > 70 && i == 0) {
        cachePol.current = false;
      }
    }
    return originalPolyline;
  };

  const calculateToDoRoute = ({lat, lng}) => {
    if (Number(cachePolylineOn) !== 0) {
      return calculateAndDisplayRoute(
        tripAccepted?.origin,
        tripAccepted?.destination,
        {
          lat: location?.coords?.latitude,
          lng: location?.coords?.longitude,
        },
        false,
      );
    }

    return calculateAndDisplayRouteWithoutCache(
      tripAccepted?.origin,
      tripAccepted?.destination,
      {
        lat: lat,
        lng: lng,
      },
      false,
    );
  };

  const calcMinutesWithMeters = () => {
    const velocityMeters = 40;
    const minutesOriginal = distance.current / velocityMeters;
    return minutesOriginal;
  };

  const calculateAndDisplayRouteWithoutCache = useCallback(
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
        return clearDataTrip();
      }
      const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
        return waypoint?.confirmed === '0';
      });

      const currentDate = new Date();

      if (
        currentDate.getTime() - lastDate.current.getTime() < 5000 ||
        !lastDate.current
      ) {
        isLoadingRoute.current = false;
        return;
      }

      lastDate.current = new Date();

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

          setPolyline(polilyne);
          setLastPositionMarker({
            latitude: decode(data.overview_polyline.points).pop()[0],
            longitude: decode(data.overview_polyline.points).pop()[1],
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
    [tripAccepted, polyline],
  );

  const calculateAndDisplayRoute = async (
    origin,
    destination,
    {lat, lng},
    continueTrue = false,
    forceCache = false,
  ) => {
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

      if (metersDiffPosition < metersDiffCalculationCache) {
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
      return clearDataTrip();
    }
    const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
      return waypoint?.confirmed === '0';
    });

    try {
      if (cachePol.current && !forceCache && Number(cachePolylineOn) !== 0) {
        if (remakePol.current) {
          remakePol.current = false;
          setPolyline(
            cutPolyline(calcularPontosIntermediarios(polyline), {
              latitude: lat,
              longitude: lng,
            }),
          );
          isLoadingRoute.current = false;
          return;
        }

        const poli = cutPolyline(polyline, {
          latitude: lat,
          longitude: lng,
        });

        sendPositionOnTrip(lat, lng, {
          distance: distance.current,
          duration: calcMinutesWithMeters(),
          overview_polyline: {
            points: String(MapService.encondePolyline(poli)),
          },
        });

        setPolyline(poli);
        getMinutesRouteTraveled();
        isLoadingRoute.current = false;
        return;
      }
    } catch (error) {
      isLoadingRoute.current = false;
      console.log('error', error);
    }

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
      .then(({status, data}: {status: boolean; data: ResponsePropsApi}) => {
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

        setPolyline(polilyne);
        cachePol.current = true;
        remakePol.current = true;

        // dispatchTrip({type: 'update', field: 'polyline', arg: polilyne});
        setLastPositionMarker({
          latitude: decode(data.overview_polyline.points).pop()[0],
          longitude: decode(data.overview_polyline.points).pop()[1],
        });
      })
      .catch(e => {
        console.log('erro ao calcular rota ', e);
      })
      .finally(() => {
        isLoadingRoute.current = false; // Requisição finalizada
      });
  };

  const sendPositionOnTrip = (lat, lng, data: ResponsePropsApi) => {
    sendPolyline({lat, lng}, data); // ENVIO DE POLYLINE PARA O CLIENTE
    // await socketOnTrip(); // Colocar quando houver socket

    if (tripPreAccepted?.tripReference) {
      sendPolylinePreAccepted({lat, lng}, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
    }
  };

  const verifyPositionPreAvailable = async (trip, preAvailable) => {
    if (trip?.tripCallType === 'CHAMADA TAXÍMETRO') {
      return setVerifyPosition(false);
    }
    const meter = await calculateDistanceFromLatLonInMeters(
      {
        latitude: parseFloat(trip.destination.latitude),
        longitude: parseFloat(trip.destination.longitude),
      },
      location?.coords,
    );

    const meterMax =
      Number(cityConfig.kmRemainingToPutDriverPreAvailable) * 1000;

    if (meterMax >= meter) {
      if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
        return setVerifyPosition(false);
      }

      if (
        trip.tripWayPoints.filter(waypoint => {
          return waypoint.confirmed === '0';
        }).length > 0
      ) {
        return setVerifyPosition(false);
      }

      if (preAvailable) {
        // return checkPreAvailable();
        return setVerifyPosition(false);
      }

      const {status} = await TripStatusService().putPreAvailable();
      if (status) {
        userDriverFind.preAvailable = '1';
        setUserDriverFind(userDriverFind);
      }
      setVerifyPosition(false);
      return true;
      // enablePreAvailable();
    }
    return setVerifyPosition(true);
  };

  const setRouteTraveled = async () => {
    let routeTraveled = (await getItem('routeTraveled', false)) || [];

    if (routeTraveled.length > 0) {
      routeTraveled = MapService.decodePolyline(routeTraveled);
    }

    routeTraveled.push([
      location?.coords?.latitude,
      location?.coords?.longitude,
    ]);

    routeTraveled = MapService.encondePolyline(routeTraveled);

    setItem('routeTraveled', routeTraveled, false);
  };

  const getKmRouteTraveled = async () => {
    let meters = 0;

    let routeTraveled = (await getItem('routeTraveled', false)) || [];

    if (routeTraveled.length === 0) {
      return 0;
    }

    routeTraveled = MapService.decodePolyline(routeTraveled);

    routeTraveled.map((point, index: number) => {
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

  async function getMinutesRouteTraveled() {
    const dateTime = JSON.parse(
      await AsyncStorage.getItem('dateTimeInProgress'),
    );
    if (Array.isArray(dateTime) || !dateTime) {
      await AsyncStorage.setItem(
        'dateTimeInProgress',
        JSON.stringify(new Date()),
      );
      return 0;
    }

    const start = Number(new Date(dateTime));

    const end = Number(new Date());
    setMinutesTraveled((end - start) / 60 / 1000);
    return (end - start) / 60 / 1000;
  }

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

  useEffect(() => {
    if (location?.coords) sendPosition(location.coords);
    if (
      tripAccepted &&
      Object.keys(tripAccepted).length > 0 &&
      tripAccepted?.status === STATUS_IN_PROGRESS
    ) {
      verifyPositionPreAvailable(tripAccepted, false);
    }
    if (
      tripAccepted &&
      Object.keys(tripAccepted).length !== 0 &&
      tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO'
    ) {
      calculateToDoRoute({
        lat: location?.coords?.latitude,
        lng: location?.coords?.longitude,
      });

      if (tripAccepted?.status === STATUS_IN_PROGRESS) {
        setRouteTraveled();
        getKmRouteTraveled();
        getMinutesRouteTraveled();
      }
    }
  }, [location]);

  useEffect(() => {
    if (
      tripAccepted &&
      Object.keys(tripAccepted).length !== 0 &&
      tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO' &&
      ![STATUS_BOARDING, STATUS_FINISHED].includes(tripAccepted?.status)
    ) {
      distance.current = 0;
      getKmRouteTraveled();
      if (Number(cachePolylineOn) !== 0) {
        calculateAndDisplayRoute(
          tripAccepted?.origin,
          tripAccepted?.destination,
          {
            lat: location?.coords?.latitude,
            lng: location?.coords?.longitude,
          },
          true,
          true,
        );
      } else {
        calculateAndDisplayRouteWithoutCache(
          tripAccepted?.origin,
          tripAccepted?.destination,
          {
            lat: location?.coords?.latitude,
            lng: location?.coords?.longitude,
          },
          true,
        );
      }

      cachePol.current = false;
    }
  }, [tripAccepted]);

  const value = useMemo(() => {
    return {
      metersRound,
      minutesTraveled,
      polyline,
      lastPositionMarker,
    };
  }, [metersRound, minutesTraveled]);

  return (
    <RouteTraveledContext.Provider value={value}>
      {children}
    </RouteTraveledContext.Provider>
  );
};
export const useRouteTraveled = () => {
  const context = useContext(RouteTraveledContext);
  return context;
};
