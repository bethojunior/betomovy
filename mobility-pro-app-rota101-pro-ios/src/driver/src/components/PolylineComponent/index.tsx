import { Marker, Polyline } from 'react-native-maps';
import { useRouteTraveled } from '../../context/RouteTraveled';
import { useTripProvider } from '../../context/Trip';
import { useMapSettings } from '../MapSettings';
import { STATUS_BOARDING, STATUS_ACCEPTED } from '../../constants/trip';

export const PolylineComponent = () => {
  const { polyline, lastPositionMarker } = useRouteTraveled();

  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const { polylineWidth } = useMapSettings();

  const noDestination =
    tripAccepted &&
    Object.keys(tripAccepted).length !== 0 &&
    tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO' &&
    tripAccepted?.status === STATUS_BOARDING || tripAccepted?.status === STATUS_ACCEPTED;

  const isValidCoordinate = (coordinate) => {
    return coordinate && !isNaN(coordinate.latitude) && !isNaN(coordinate.longitude);
  };

  const markerCoordinate = isValidCoordinate(lastPositionMarker)
    ? {
      latitude: Number(lastPositionMarker.latitude),
      longitude: Number(lastPositionMarker.longitude),
    }
    : {
      latitude: 0,
      longitude: 0,
    };

  const polVal = (polyline.length > 0 &&
    tripAccepted &&
    Object.keys(tripAccepted).length > 0 &&
    tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO') ||
    noDestination

  return (
    <>
      <Polyline
        coordinates={polVal ? polyline : []}
        strokeColor={'#00A8FF'}
        strokeWidth={polylineWidth}
      />
      <Marker
        coordinate={
          polVal
            ? markerCoordinate
            : { latitude: 0, longitude: 0 }
        }
        opacity={polVal ? 1 : 0}
        pointerEvents={polVal ? 'auto' : 'none'}
        style={{ zIndex: 1 }}
      />
    </>
  );
};
