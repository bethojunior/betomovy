import {useState} from 'react';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
} from '../../constants/trip';
import {useTripProvider} from '../../context/Trip';
import theme from '../../styles/theme';
import {FloatButton} from '../FloatButton';
import {If} from '../If';
import {WebviewMapCoordinate} from '../WebviewMapCoordinate';
import {FontAwesome} from '@expo/vector-icons';

export const WebViewMapComponent = ({onVisibleMap, setOnVisibleMap}) => {
  const {tripAccepted, trip} = useTripProvider()?.stateTrip;

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
    }
  };

  const waypoints = tripAccepted?.tripWayPoints?.filter(waypoint => {
    return waypoint?.confirmed === '0';
  });

  return (
    <>
      <If
        condition={
          (onVisibleMap &&
            tripAccepted &&
            Object.keys(tripAccepted)?.length > 0) ||
          (onVisibleMap && Object.keys(trip).length > 0)
        }
      >
        <WebviewMapCoordinate
          destiny={
            switchCaseSearchNative(
              tripAccepted?.status,
              tripAccepted?.origin,
              tripAccepted?.destination,
              waypoints,
              'address',
            )
              ? switchCaseSearchNative(
                  tripAccepted?.status,
                  tripAccepted?.origin,
                  tripAccepted?.destination,
                  waypoints,
                  'address',
                )
              : switchCaseSearchNative(
                  tripAccepted?.status,
                  tripAccepted?.origin,
                  tripAccepted?.destination,
                  waypoints,
                  'name',
                )
          }
          setOnVisible={setOnVisibleMap}
          longitude={switchCaseSearchNative(
            tripAccepted?.status,
            tripAccepted?.origin,
            tripAccepted?.destination,
            waypoints,
            'longitude',
          )}
          latitude={switchCaseSearchNative(
            tripAccepted?.status,
            tripAccepted?.origin,
            tripAccepted?.destination,
            waypoints,
            'latitude',
          )}
        />
      </If>
    </>
  );
};
