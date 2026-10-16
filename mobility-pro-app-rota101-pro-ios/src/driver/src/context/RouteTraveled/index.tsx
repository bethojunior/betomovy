import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { useTripProvider } from '../Trip';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  TRIP_CALL_TAXIMETER,
} from '../../constants/trip';
import { useLocal } from '../../hooks/location';
import { decode } from '@googlemaps/polyline-codec';
import {
  calculateDistanceFromLatLonInMeters,
  getDistanceFromLatLonInMeters,
} from '../../../../client/utils/position';
import { useAuth } from '../../../../context/auth';
import { TripStatusService } from '../TripStatus/service';
import { useUserDriver } from '../userDriver';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteTraveledProps } from './types';
import { ILocation } from '../../../../interfaces/location';
import { ChildrenType } from '../../../@types';
import { debounce } from 'lodash';
import { searchNative, updateRoute } from '../Trip/directionRoute';
import { useStorage } from '../../../../utils/Storage';
import MapService from '../../../../client/services/mapService';
import { useConfigLocal } from '../ConfigLocal';
import { DirectionResponse } from '~/interfaces/direction';
import Helper from '../../utils/Helper';

const AVG_SPEED_KMH = 40;
const AVG_SPEED_MS = (AVG_SPEED_KMH * 1000) / 3600;

const estimateRemainingSeconds = (remainingPolyline: ILocation[]): number => {
  if (!remainingPolyline || remainingPolyline.length < 2) return 0;
  let totalMeters = 0;
  for (let i = 0; i < remainingPolyline.length - 1; i++) {
    totalMeters += getDistanceFromLatLonInMeters(
      remainingPolyline[i].latitude,
      remainingPolyline[i].longitude,
      remainingPolyline[i + 1].latitude,
      remainingPolyline[i + 1].longitude,
    );
  }
  return totalMeters / AVG_SPEED_MS;
};

const RouteTraveledContext = createContext({} as RouteTraveledProps);
export const RouteTraveledProvider = ({ children }: ChildrenType) => {
  const [polyline, setPolyline] = useState([]);

  const clearDataTrip: any = useTripProvider((context: any) => context.clearDataTrip);
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const tripPreAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripPreAccepted,
  );

  const cachePol = useRef(false);
  const remakePol = useRef(false);

  const { cityConfig, tokenDriver, generalSettings } = useAuth();
  const { location, setLocation } = useLocal();
  const { setItem, getItem } = useStorage();

  const isLoadRouteAutomatically = useMemo(() => {
    return Helper.generalSettingsActive(generalSettings, 'load_route_automatically');
  }, [generalSettings]);

  const { userDriverFind, setUserDriverFind } = useUserDriver();
  const [metersRound, setMetersRound] = useState(0);
  const [minutesTraveled, setMinutesTraveled] = useState(0);

  const [lastPositionMarker, setLastPositionMarker] = useState(null);

  const lastKnownLocation = useRef<ILocation | null>(null);
  const metersDiffCalculation = 30; // Quantidade de metros antes de uma nova chamada ser necessária
  const metersDiffCalculationCache = 15; // Quantidade de metros antes de uma nova chamada ser necessária
  const isLoadingRoute = useRef(false); // Variável para verificar se uma cham
  const lastDate = useRef(new Date());
  const lastApiDuration = useRef<number>(0);

  const updateDuration = (seconds: number) => {
    lastApiDuration.current = seconds;
    AsyncStorage.setItem('timePolyline', `${Math.floor(seconds / 60)} min`);
  };

  const { states } = useConfigLocal();
  const { cachePolylineOn } = states;

  const noDestination =
    tripAccepted &&
    Object.keys(tripAccepted || {}).length !== 0 &&
    tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO' &&
    tripAccepted?.status === STATUS_ACCEPTED;

  const sendPolyline = async (coords: ILocation, data: DirectionResponse) => {
    const [kmProgressing, minuteProgressing] = await Promise.all([
      getKmRouteTraveled(),
      getMinutesRouteTraveled(),
    ]);

    const routeUpdatePayload = {
      tripReference: tripAccepted?.tripReference,
      polyline: data?.overview_polyline?.points,
      time: `${Math.floor(data?.duration / 60)} min`,
      idDriver: userDriverFind?.idDriver,
      position: { lat: coords.latitude, lng: coords.longitude },
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
    ).catch((err) => {
      console.error('Erro ao enviar polyline:', err);
      // Você pode querer logar isso em um serviço de monitoramento de erros
    });
  };
  const sendPolylinePreAccepted = async (coords: ILocation, data: DirectionResponse) => {
    const [kmProgressing, minuteProgressing] = await Promise.all([
      getKmRouteTraveled(),
      getMinutesRouteTraveled(),
    ]);
    updateRoute(
      {
        tripReference: tripPreAccepted?.tripReference,
        polyline: data?.overview_polyline?.points,
        time: `${Math.floor(data?.duration / 60)} min`,
        idDriver: userDriverFind?.idDriver,
        position: { lat: coords.latitude, lng: coords.longitude },
        kmProgressing: kmProgressing,
        minuteProgressing: minuteProgressing,
      },
      { token: tokenDriver, userid: userDriverFind?.userId },
      cityConfig?.configDriverLocation?.port_url,
    ).catch((err) => {
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
        return waypoints && waypoints.length > 0 ? waypoints[0][dir] : destination[dir];
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

  const calcularPontosIntermediarios = (polyline) => {
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

      const quantityPoints = removeLastDigit(Number(distanceToSegment.toFixed(0)));

      const latDiff =
        (polyline[i + 1].latitude - polyline[i].latitude) / (quantityPoints + 1);
      const lonDiff =
        (polyline[i + 1].longitude - polyline[i].longitude) / (quantityPoints + 1);

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

  const cutPolyline = (
    originalPolyline: ILocation[],
    currentLocation: ILocation,
  ): ILocation[] => {
    if (!originalPolyline || originalPolyline.length < 2) return originalPolyline;

    let minDist = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < originalPolyline.length; i++) {
      const dist = getDistanceFromLatLonInMeters(
        originalPolyline[i].latitude,
        originalPolyline[i].longitude,
        currentLocation.latitude,
        currentLocation.longitude,
      );
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    if (closestIndex === 0 && minDist > 70) {
      cachePol.current = false;
    }

    return originalPolyline.slice(closestIndex);
  };

  const isOffRoute = (
    currentPolyline: ILocation[],
    coords: ILocation,
    threshold = 50,
  ): boolean => {
    if (!currentPolyline || currentPolyline.length === 0) return true;
    for (const point of currentPolyline) {
      const dist = getDistanceFromLatLonInMeters(
        coords.latitude,
        coords.longitude,
        point.latitude,
        point.longitude,
      );
      if (dist <= threshold) return false;
    }
    return true;
  };

  const calculateToDoRoute = (coords: ILocation) => {
    const hasPolyline = polyline.length > 0;
    const shouldReuseRoute =
      !remakePol.current && (!isLoadRouteAutomatically || !isOffRoute(polyline, coords));

    if (hasPolyline && shouldReuseRoute) {
      const poli = cutPolyline(polyline, coords);
      const estimatedSeconds = estimateRemainingSeconds(poli);

      updateDuration(estimatedSeconds);

      sendPositionOnTrip(coords, {
        distance: distance.current,
        duration: estimatedSeconds,
        overview_polyline: {
          points: String(MapService.encondePolyline(poli)),
        },
        type: 'cache',
      });

      setPolyline(poli);

      return;
    }

    if (Number(cachePolylineOn) !== 0) {
      return calculateAndDisplayRoute(
        tripAccepted?.origin,
        tripAccepted?.destination,
        location?.coords,
        false,
      );
    }

    calculateAndDisplayRouteWithoutCache(
      tripAccepted?.origin,
      tripAccepted?.destination,
      coords,
      false,
    );
  };

  const calculateAndDisplayRouteWithoutCache = useCallback(
    debounce(async (origin, destination, coords: ILocation, continueTrue = false) => {
      if (isLoadingRoute.current && !continueTrue) {
        // Se uma requisição já está em progresso, não inicie uma nova
        return;
      }
      if (lastKnownLocation.current && !continueTrue) {
        const metersDiffPosition = getDistanceFromLatLonInMeters(
          lastKnownLocation.current?.latitude,
          lastKnownLocation.current?.longitude,
          coords.latitude,
          coords.longitude,
        );

        if (metersDiffPosition < metersDiffCalculation) {
          // Se a diferença for menor do que o definido, não inicie uma nova chamada
          return;
        }
      }

      isLoadingRoute.current = true; // Uma requisição está prestes a começar

      lastKnownLocation.current = coords;

      if (tripAccepted && Object.keys(tripAccepted || {}).length === 0) {
        return clearDataTrip();
      }
      const waypoints = tripAccepted?.tripWayPoints?.filter((waypoint) => {
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

      if (tripAccepted?.status === STATUS_FINISHED) {
        isLoadingRoute.current = false;
        return;
      }

      searchNative(
        `${coords.latitude},${coords.longitude}`, // Minha latitude e longitude de onde estou no momento
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
        .then(({ status, data }) => {
          if (!status) {
            return;
          }

          updateDuration(data?.duration ?? lastApiDuration.current);

          sendPolyline(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE
          // await socketOnTrip(); // Colocar quando houver socket

          if (tripPreAccepted?.tripReference) {
            sendPolylinePreAccepted(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
          }

          const polilyne = decode(data.overview_polyline.points).map((item) => {
            return { latitude: item[0], longitude: item[1] };
          });

          setPolyline(polilyne);
          setLastPositionMarker({
            latitude: decode(data.overview_polyline.points).pop()[0],
            longitude: decode(data.overview_polyline.points).pop()[1],
          });

          // dispatchTrip({type: 'update', field: 'polyline', arg: polilyne});
        })
        .catch((e) => {
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
    coords: ILocation,
    continueTrue = false,
    forceCache = false,
  ) => {
    if (isLoadingRoute.current && !continueTrue) {
      // Se uma requisição já está em progresso, não inicie uma nova
      return;
    }

    if (lastKnownLocation.current && !continueTrue) {
      const metersDiffPosition = getDistanceFromLatLonInMeters(
        lastKnownLocation.current?.latitude,
        lastKnownLocation.current?.longitude,
        coords.latitude,
        coords.longitude,
      );

      if (metersDiffPosition < metersDiffCalculationCache) {
        // Se a diferença for menor do que o definido, não inicie uma nova chamada
        return;
      }
    }

    isLoadingRoute.current = true; // Uma requisição está prestes a começar

    lastKnownLocation.current = coords;

    if (tripAccepted && Object.keys(tripAccepted || {}).length === 0) {
      return clearDataTrip();
    }
    const waypoints = tripAccepted?.tripWayPoints?.filter((waypoint) => {
      return waypoint?.confirmed === '0';
    });

    try {
      if (cachePol.current && !forceCache && Number(cachePolylineOn) !== 0) {
        if (remakePol.current) {
          remakePol.current = false;
          distance.current = 0;
          setPolyline(cutPolyline(calcularPontosIntermediarios(polyline), coords));
          isLoadingRoute.current = false;
          return;
        }

        const poli = cutPolyline(polyline, coords);

        sendPositionOnTrip(coords, {
          distance: distance.current,
          duration: lastApiDuration.current,
          overview_polyline: {
            points: String(MapService.encondePolyline(poli)),
          },
          type: 'cache',
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

    if (tripAccepted?.status === STATUS_FINISHED) {
      isLoadingRoute.current = false;
      return;
    }

    searchNative(
      `${coords.latitude},${coords.longitude}`, // Minha latitude e longitude de onde estou no momento
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
      .then(({ status, data }) => {
        if (!status) {
          return;
        }

        updateDuration(data?.duration ?? lastApiDuration.current);

        sendPolyline(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE
        // await socketOnTrip(); // Colocar quando houver socket

        if (tripPreAccepted?.tripReference) {
          sendPolylinePreAccepted(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
        }

        const polilyne = decode(data.overview_polyline.points).map((item) => {
          return { latitude: item[0], longitude: item[1] };
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
      .catch((e) => {
        console.log('erro ao calcular rota ', e);
      })
      .finally(() => {
        isLoadingRoute.current = false; // Requisição finalizada
      });
  };

  const sendPositionOnTrip = (coords: ILocation, data: DirectionResponse) => {
    sendPolyline(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE
    // await socketOnTrip(); // Colocar quando houver socket

    if (tripPreAccepted?.tripReference) {
      sendPolylinePreAccepted(coords, data); // ENVIO DE POLYLINE PARA O CLIENTE PREACEITO
    }
  };

  const enablePreAvailable = async (trip) => {
    const user = userDriverFind;

    if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
      return;
    }

    const existsWaypoint =
      trip.tripWayPoints.filter((waypoint) => {
        return waypoint.confirmed === '0';
      }).length > 0;

    if (existsWaypoint) {
      return;
    }

    if (user.preAvailable == '1') {
      return;
    }

    if (trip.status === 'in_progress') {
      const { status } = await TripStatusService().putPreAvailable();

      if (status) {
        userDriverFind.preAvailable = '1';
        setUserDriverFind(userDriverFind);
      }
    }
  };

  const verifyPositionPreAvailable = async (trip) => {
    if (trip?.tripReference === tripPreAccepted?.tripReference) {
      return;
    }

    const meter = await calculateDistanceFromLatLonInMeters(
      {
        latitude: parseFloat(trip.destination.latitude),
        longitude: parseFloat(trip.destination.longitude),
      },
      location?.coords,
    );

    const meterMax = Number(cityConfig.kmRemainingToPutDriverPreAvailable) * 1000;

    if (meterMax >= meter) {
      await enablePreAvailable(trip);
      return true;
    }
    return;
  };

  const setRouteTraveled = async () => {
    let routeTraveled = (await getItem('routeTraveled', false)) || [];

    if (routeTraveled.length > 0) {
      routeTraveled = MapService.decodePolyline(routeTraveled);
    }

    routeTraveled.push([location?.coords?.latitude, location?.coords?.longitude]);

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

      meters += calculateDistanceFromLatLonInMeters(routeTraveled[index - 1], point);
    });
    setMetersRound(meters);

    return meters / 1000;
  };

  async function getMinutesRouteTraveled() {
    const dateTime = JSON.parse(await AsyncStorage.getItem('dateTimeInProgress'));
    if (Array.isArray(dateTime) || !dateTime) {
      await AsyncStorage.setItem('dateTimeInProgress', JSON.stringify(new Date()));
      return 0;
    }

    const start = Number(new Date(dateTime));

    const end = Number(new Date());
    setMinutesTraveled((end - start) / 60 / 1000);
    return (end - start) / 60 / 1000;
  }

  let lastPositionInRealTime = null;
  const metersDiffSendPosition = 50;

  const sendPosition = useCallback(
    debounce(async (payload) => {
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

  const clearRoute = () => {
    setPolyline([]);
    setLastPositionMarker(null);
    setMetersRound(0);
    setMinutesTraveled(0);
  };

  // ESTA FUNÇÃO É UMA GAMBIARRA NÃO MEXAM. QUANDO O APP MOTORISTA É ABERTO A PRIMEIRA VEZ É CAUSADO UM ERRO DE ATUALIZAÇÃO DE POLYLINES EM CORRIDAS SEM DESTINO. O ERRO ACONTECE POR CAUSA DA ORDEM DE CHAMADAS DOS CONTEXTOS INFELIZMENTE NÃO CONSEGUI ENCONTRAR ONDE ESTÁ OCORRENDO ISSO NESSE PROJETO GIGANTE. MAS CONSEGUI RESOLVER MOVENDO A LOCALIZAÇÃO DO USUÁRIO MILIMETRICAMENTE.
  const changeLocationDriver = async () => {
    const counter = await AsyncStorage.getItem('@app:renderize-first-time-route-counter');
    const count = counter ? JSON.parse(counter) : 0;

    if (
      count < 3 &&
      tripAccepted &&
      Object.keys(tripAccepted || {}).length !== 0 &&
      tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO' &&
      noDestination
    ) {
      setLocation((prevLocation) => ({
        ...prevLocation,
        coords: {
          ...prevLocation.coords,
          latitude: prevLocation.coords.latitude + 0.00001,
          longitude: prevLocation.coords.longitude + 0.00001,
        },
      }));

      await AsyncStorage.setItem(
        '@app:renderize-first-time-route-counter',
        JSON.stringify(count + 1),
      );
    }
  };

  useEffect(() => {
    if (location?.coords) sendPosition(location.coords);
    if (
      (tripAccepted &&
        Object.keys(tripAccepted || {}).length !== 0 &&
        tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO' &&
        tripAccepted?.status !== STATUS_FINISHED) ||
      noDestination
    ) {
        calculateToDoRoute(location?.coords);

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
      Object.keys(tripAccepted || {}).length > 0 &&
      tripAccepted?.status === STATUS_IN_PROGRESS
    ) {
      verifyPositionPreAvailable(tripAccepted);
    }
  }, [location, tripAccepted]);

  useEffect(() => {
    if (
      tripAccepted &&
      Object.keys(tripAccepted || {}).length !== 0 &&
      tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO' &&
      ![STATUS_BOARDING, STATUS_FINISHED].includes(tripAccepted?.status)
    ) {
      distance.current = 0;
      getKmRouteTraveled();
      if (Number(cachePolylineOn) !== 0) {
        calculateAndDisplayRoute(
          tripAccepted?.origin,
          tripAccepted?.destination,
          location?.coords,
          true,
          true,
        );
      } else {
        calculateAndDisplayRouteWithoutCache(
          tripAccepted?.origin,
          tripAccepted?.destination,
          location?.coords,
          true,
        );
      }

      cachePol.current = false;
    }
  }, [tripAccepted]);

  useEffect(() => {
    if (
      (tripAccepted &&
        Object.keys(tripAccepted || {}).length !== 0 &&
        tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO') ||
      noDestination
    ) {
      calculateAndDisplayRouteWithoutCache(
        tripAccepted?.origin,
        tripAccepted?.destination,
        location?.coords,
        true,
      );
    }
    changeLocationDriver();
  }, [tripAccepted, location]);

  const value = useMemo(() => {
    return {
      metersRound,
      minutesTraveled,
      polyline,
      lastPositionMarker,
      setMetersRound,
      clearRoute,
    };
  }, [metersRound, minutesTraveled, polyline]);

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
