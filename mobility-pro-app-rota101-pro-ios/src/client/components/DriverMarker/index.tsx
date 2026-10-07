import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Image } from 'react-native';
import { AnimatedRegion, Marker, MarkerAnimated } from 'react-native-maps';
import { useTrip } from '../../contexts/Trip';
import iconDriver from '../../assets/images/car.png';
import {
  calculateDistanceFromLatLonInMeters,
  calculateHeading,
} from '../../utils/position';
import { useTripGL } from '../../contexts/TripGL';

let lastPosition = null;

interface Props {
  isHome?: boolean;
  driver?: any;
}

const DriverMarker = React.memo(({ isHome, driver }: Props) => {
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.003;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [coordinateDriver, setCoordinateDriver] = useState(null);
  const [rotation, setRotation] = useState(0);
  const markerDriverRef = useRef(null);

  const { stateTripCustomer } = useTrip();
  const { routeTripScheduled } = useTripGL();

  const { routeTrip, trip } = stateTripCustomer;
  if (isHome) {
    return (
      <MarkerAnimated
        ref={markerDriverRef}
        coordinate={
          new AnimatedRegion({
            latitude: driver?.latitude || 0,
            longitude: driver?.longitude || 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        }
        image={driver?.iconMapDriver || iconDriver}
      />
    );
  }

  useEffect(() => {
    if (routeTripScheduled) {
      if (!coordinateDriver) {
        lastPosition = {
          latitude: routeTripScheduled.position.lat,
          longitude: routeTripScheduled.position.lng,
        };

        setCoordinateDriver(
          new AnimatedRegion({
            latitude: routeTripScheduled.position.lat,
            longitude: routeTripScheduled.position.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        );
        return;
      }

      const newCoordinate = {
        latitude: routeTripScheduled.position.lat,
        longitude: routeTripScheduled.position.lng,
      };

      if (calculateDistanceFromLatLonInMeters(lastPosition, newCoordinate) < 10)
        return;

      setRotation(360 - calculateHeading(lastPosition, newCoordinate));

      // eslint-disable-next-line eqeqeq
      if (Platform.OS == 'android') {
        if (markerDriverRef.current) {
          markerDriverRef.current.animateMarkerToCoordinate(
            newCoordinate,
            2000,
          );
        }
      } else {
        coordinateDriver.timing(newCoordinate).start();
      }

      lastPosition = {
        latitude: routeTripScheduled.position.lat,
        longitude: routeTripScheduled.position.lng,
      };
    }
  }, [routeTripScheduled]);

  useEffect(() => {
    if (routeTrip) {
      if (!coordinateDriver) {
        lastPosition = {
          latitude: routeTrip.position.lat,
          longitude: routeTrip.position.lng,
        };

        setCoordinateDriver(
          new AnimatedRegion({
            latitude: routeTrip.position.lat,
            longitude: routeTrip.position.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }),
        );
        return;
      }

      const newCoordinate = {
        latitude: routeTrip.position.lat,
        longitude: routeTrip.position.lng,
      };

      if (calculateDistanceFromLatLonInMeters(lastPosition, newCoordinate) < 10)
        return;

      setRotation(360 - calculateHeading(lastPosition, newCoordinate));

      // eslint-disable-next-line eqeqeq
      if (Platform.OS == 'android') {
        if (markerDriverRef.current) {
          markerDriverRef.current.animateMarkerToCoordinate(
            newCoordinate,
            2000,
          );
        }
      } else {
        coordinateDriver.timing(newCoordinate).start();
      }

      lastPosition = {
        latitude: routeTrip.position.lat,
        longitude: routeTrip.position.lng,
      };
    }
  }, [routeTrip]);

  return (
    <>
      {
        !coordinateDriver ? null :
          <MarkerAnimated
            ref={markerDriverRef}
            coordinate={coordinateDriver}
            style={{
              transform: [{ rotate: `${rotation}deg` }],
              width: 70,
              height: 70,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Marker
              coordinate={undefined}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                }}
                source={
                  trip?.driver?.iconMapDriver
                    ? { uri: trip?.driver?.iconMapDriver }
                    : iconDriver
                }
                resizeMode="contain"
              />
            </Marker>
          </MarkerAnimated>
      }
    </>

  );
})

export default DriverMarker;
