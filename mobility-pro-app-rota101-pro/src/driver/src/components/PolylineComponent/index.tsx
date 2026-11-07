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

  const originCoord = (tripAccepted?.origin && isValidCoordinate({
    latitude: Number(tripAccepted.origin.latitude),
    longitude: Number(tripAccepted.origin.longitude),
  })) ? {
    latitude: Number(tripAccepted.origin.latitude),
    longitude: Number(tripAccepted.origin.longitude),
  } : null;

  const destCoord = (tripAccepted?.destination && isValidCoordinate({
    latitude: Number(tripAccepted.destination.latitude),
    longitude: Number(tripAccepted.destination.longitude),
  })) ? {
    latitude: Number(tripAccepted.destination.latitude),
    longitude: Number(tripAccepted.destination.longitude),
  } : null;

  return (
    <>
      <Polyline
        coordinates={polVal ? polyline : []}
        strokeColor={'#00A8FF'}
        strokeWidth={polylineWidth}
      />
      {/* Marcador do alvo atual da rota (embarque ou parada) */}
      <Marker
        coordinate={
          polVal
            ? markerCoordinate
            : { latitude: 0, longitude: 0 }
        }
        opacity={polVal ? 1 : 0}
        pointerEvents={polVal ? 'auto' : 'none'}
        style={{ zIndex: 2 }}
      />
      {/* Marcador de Destino Final para visão completa da corrida */}
      {destCoord && destCoord.latitude !== 0 && (
        <Marker
          coordinate={destCoord}
          opacity={1}
          pointerEvents={'auto'}
          pinColor={'#EF4444'}
          style={{ zIndex: 1 }}
        />
      )}
      {/* Marcador de Origem caso diferente do alvo atual */}
      {originCoord && originCoord.latitude !== 0 && (!markerCoordinate || Math.abs(markerCoordinate.latitude - originCoord.latitude) > 0.0001) && (
        <Marker
          coordinate={originCoord}
          opacity={1}
          pointerEvents={'auto'}
          pinColor={'#10B981'}
          style={{ zIndex: 1 }}
        />
      )}
    </>
  );
};
