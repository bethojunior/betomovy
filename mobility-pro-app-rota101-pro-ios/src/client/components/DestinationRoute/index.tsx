// @ts-nocheck

import {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_PRE_ACCEPTED,
  STATUS_SCHEDULED,
} from '../../constants/trip';
import {useTrip} from '../../contexts/Trip';
import { useAuth } from '../../../context/auth';

import { MarkerImageProfile } from './styles';

export default function DestinationRoute() {
  const {stateTripCustomer} = useTrip();

  const {trip, tripSchedule, lastDestination, destination} = stateTripCustomer;
  const [position, setPosition] = useState(null);

  const { user } = useAuth();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (Object.keys(tripSchedule).length > 0) {
      if (
        tripSchedule?.status === STATUS_ACCEPTED ||
        tripSchedule?.status === STATUS_BOARDING ||
        tripSchedule?.status === STATUS_PRE_ACCEPTED
      )
        return setPosition({
          latitude: parseFloat(tripSchedule?.origin.latitude),
          longitude: parseFloat(tripSchedule?.origin.longitude),
        });
      if (tripSchedule?.status === STATUS_IN_PROGRESS) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const waypoint = tripSchedule?.tripWayPoints.find(waypoint => {
          // eslint-disable-next-line eqeqeq
          return waypoint.confirmed == false;
        });

        if (waypoint != null)
          return setPosition({
            latitude: parseFloat(waypoint.latitude),
            longitude: parseFloat(waypoint.longitude),
          });

        return setPosition({
          latitude: parseFloat(tripSchedule?.destination.latitude),
          longitude: parseFloat(tripSchedule?.destination.longitude),
        });
      }
    }
    // if (Object.keys(trip).length > 0) {
    //   if (
    //     trip?.status === STATUS_ACCEPTED ||
    //     trip?.status === STATUS_BOARDING ||
    //     trip?.status === STATUS_PRE_ACCEPTED
    //   )
    //     return setPosition({
    //       latitude: parseFloat(trip?.origin.latitude),
    //       longitude: parseFloat(trip?.origin.longitude),
    //     });
    //   if (trip?.status === STATUS_IN_PROGRESS) {
    //     // eslint-disable-next-line @typescript-eslint/no-shadow
    //     const waypoint = trip?.tripWayPoints.find(waypoint => {
    //       // eslint-disable-next-line eqeqeq
    //       return waypoint.confirmed == false;
    //     });

    //     if (waypoint != null)
    //       return setPosition({
    //         latitude: parseFloat(waypoint.latitude),
    //         longitude: parseFloat(waypoint.longitude),
    //       });

    //     return setPosition({
    //       latitude: parseFloat(trip?.destination.latitude),
    //       longitude: parseFloat(trip?.destination.longitude),
    //     });
    //   } else {
    //     if (lastDestination?.latitude && lastDestination?.longitude) {
    //       setPosition({
    //         latitude: parseFloat(lastDestination?.latitude),
    //         longitude: parseFloat(lastDestination?.longitude),
    //       });
    //       return;
    //     }
    //     return null;
    //   }
    // }
  }, [tripSchedule]);

  useEffect(() => {
    if (Object.keys(trip).length > 0 && trip?.status !== STATUS_SCHEDULED) {
      if (
        trip?.status === STATUS_ACCEPTED ||
        trip?.status === STATUS_BOARDING ||
        trip?.status === STATUS_PRE_ACCEPTED
      ) {
        return setPosition({
          latitude: parseFloat(trip?.origin.latitude),
          longitude: parseFloat(trip?.origin.longitude),
        });
      }
      if (trip?.status === STATUS_IN_PROGRESS) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const waypoint = trip?.tripWayPoints.find(waypoint => {
          // eslint-disable-next-line eqeqeq
          return waypoint.confirmed == false;
        });

        if (waypoint != null)
          return setPosition({
            latitude: parseFloat(waypoint.latitude),
            longitude: parseFloat(waypoint.longitude),
          });
      }
      if (trip?.destination?.latitude && trip?.destination?.longitude) {
        return setPosition({
          latitude: parseFloat(trip?.destination?.latitude),
          longitude: parseFloat(trip?.destination?.longitude),
        });
      }
      if (lastDestination?.latitude && lastDestination?.longitude) {
        return setPosition({
          latitude: parseFloat(lastDestination?.latitude),
          longitude: parseFloat(lastDestination?.longitude),
        });
      }
    }
  }, [trip, lastDestination, destination]);
  return (
    <>
      {position && (
        <Marker
          coordinate={position}
          importantForAccessibility="no-hide-descendants"
        >
          {user.profileImageLink ? (
            <>
              <MarkerImageProfile
                source={user.profileImageLink ? {uri: user.profileImageLink} : require('../../assets/images/pin3d.png')}
              />
    
              <Image
                style={{
                  width: 35,
                  height: 35,
                }}
                source={require('../../assets/images/pin3d.png')}
              />
            </>
            )
            :
            <>
              <Image
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require('../../assets/images/pin3d.png')}
                />
            </>
          }
        </Marker>
      )}
    </>
  );
}
