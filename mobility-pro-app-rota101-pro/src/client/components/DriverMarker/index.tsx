import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { AnimatedRegion, Marker } from 'react-native-maps';
import { useTrip } from '../../contexts/Trip';
import icCar from '~/assets/map-pins/car.png';
import {
  calculateDistanceFromLatLonInMeters,
  calculateHeading,
} from '../../utils/position';
import { useTripGL } from '../../contexts/TripGL';
import { CustomImage } from './styles';

let lastPosition = null;

const DriverMarker = React.memo(() => {
  const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

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

  const stopTrackingViewChanges = () => {
    setTracksViewChanges(false);
  };

  const uriMapDriver = trip?.driver?.iconMapDriver;

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

  if (!coordinateDriver) return null;

  return (
    <Marker.Animated
      ref={markerDriverRef}
      coordinate={coordinateDriver}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={tracksViewChanges}
      style={{
        transform: [{ rotate: `${rotation}deg` }],
      }}
    >
      <CustomImage
        source={uriMapDriver ? { uri: uriMapDriver } : icCar}
        resizeMode="contain"
        onLoad={stopTrackingViewChanges}
      />
    </Marker.Animated>
  )
});

export default DriverMarker;
