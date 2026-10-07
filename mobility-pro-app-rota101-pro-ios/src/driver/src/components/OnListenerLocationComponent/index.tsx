import {AppState, DeviceEventEmitter} from 'react-native';
import {useUserDriver} from '../../context/userDriver';
import {useAuth} from '../../../../context/auth';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
} from '../../constants/trip';
import {useTripProvider} from '../../context/Trip';
import {useEffect, useRef, useState} from 'react';
import {searchNativeFetch} from '../../context/Trip/directionRoute';
import {useRouteTraveled} from '../../context/RouteTraveled';
import {BubbleModulesLocation} from '../../pages/Home/service';
import {useCommunication} from '../../hooks/useComunnication';
import {useConfigLocal} from '../../context/ConfigLocal';
import {setTimeTraveled, setRouteTraveled} from './taximeter';
import {setRouteTraveledRecalcule} from './trip';

let subscription;

export const OnListenerLocationComponent = () => {
  const {userDriver, cityConfig} = useAuth();
  const {userDriverFind} = useUserDriver();
  const {stateTrip} = useTripProvider();
  const {metersRound, minutesTraveled} = useRouteTraveled();
  const {tripAccepted} = stateTrip;
  const tripAcceptedRef = useRef(tripAccepted);
  const {states} = useConfigLocal();
  const [stateTripStatus, setStateTripStatus] = useState(null);

  const {addListenerLocation, stopLocation} = BubbleModulesLocation;

  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    tripAcceptedRef.current = tripAccepted;
    if (tripAccepted?.status === STATUS_IN_PROGRESS && !isExecuting) {
      initFunction(tripAccepted, userDriverFind, {
        onlineSend: 15,
        offlineSend: 30,
        metersOffline: 5,
        metersOnline: 5,
      });
      setIsExecuting(true);
    }

    if (tripAccepted?.status === STATUS_FINISHED) {
      initFunction(tripAccepted, userDriverFind, states).then(() => {
        setIsExecuting(false);
      });
    }
  }, [tripAccepted]);

  const switchCaseSearchNativeOnFetch = (
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

  const getKmRouteTraveled = () => {
    const km = metersRound / 1000;
    return km.toFixed(2) || 0;
  };

  const getMinutesRouteTraveled = () => {
    return minutesTraveled || 0;
  };

  const onListener = async () => {
    try {
      await addListenerLocation();
    } catch (error) {
      console.log(error);
    }
  };

  const {initFunction} = useCommunication(cityConfig, userDriver, onListener);

  useEffect(() => {
    if (tripAccepted?.status === STATUS_IN_PROGRESS) {
      initFunction(tripAccepted, userDriverFind, {
        onlineSend: 15,
        offlineSend: 30,
        metersOffline: 5,
        metersOnline: 5,
      });
      setIsExecuting(true);
    } else {
      initFunction(tripAccepted, userDriverFind, states);
    }
    setStateTripStatus(tripAccepted?.status);
    setIsExecuting(false);
  }, [userDriverFind, states]);

  const trackingTrip = state => {
    const waypoints = tripAcceptedRef.current?.tripWayPoints?.filter(
      waypoint => {
        return waypoint?.confirmed === '0';
      },
    );
    const headers = {
      userid: userDriver?.idUser,
      token: userDriver?.api_token,
    };
    setRouteTraveledRecalcule({
      latitude: state?.latitude,
      longitude: state?.longitude,
    });
    searchNativeFetch(
      `${state?.latitude},${state?.longitude}`, // Minha latitude e longitude de onde estou no momento
      `${switchCaseSearchNativeOnFetch(
        tripAcceptedRef.current?.status,
        tripAcceptedRef.current?.origin,
        tripAcceptedRef.current?.destination,
        waypoints,
      )},${switchCaseSearchNativeOnFetch(
        tripAcceptedRef.current?.status,
        tripAcceptedRef.current?.origin,
        tripAcceptedRef.current?.destination,
        waypoints,
        'longitude',
      )}`,
      null,
      headers,
      {
        tripAccepted: tripAcceptedRef?.current,
        cityConfig,
        getKmRouteTraveled,
        getMinutesRouteTraveled,
        userDriverFind,
        lat: state?.latitude,
        lng: state?.longitude,
      },
    );
  };

  const trackValueTaximetro = ({lat, lng}) => {
    setRouteTraveled({
      latitude: lat,
      longitude: lng,
    });
    setTimeTraveled();
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'onListenerLocation',
      (state: any) => {
        if (
          (tripAcceptedRef?.current &&
            Object.keys(tripAcceptedRef).length === 0) ||
          !tripAcceptedRef?.current
        ) {
          return;
        }
        if (AppState?.currentState === 'active') {
          return;
        }
        if (!tripAcceptedRef.current?.status) {
          return;
        }
        if (tripAcceptedRef.current?.tripCallType === 'CHAMADA TAXÍMETRO') {
          return trackValueTaximetro({
            lat: state?.latitude,
            lng: state?.longitude,
          });
        }
        trackingTrip(state);
      },
    );

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return null;
};
