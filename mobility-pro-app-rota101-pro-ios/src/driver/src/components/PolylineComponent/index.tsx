import {Marker, Polyline} from 'react-native-maps';
import {useRouteTraveled} from '../../context/RouteTraveled';
import {useTripProvider} from '../../context/Trip';
import {If} from '../If';
import {useMapSettings} from '../MapSettings';

export const PolylineComponent = () => {
  const {polyline, lastPositionMarker} = useRouteTraveled();
  const {
    stateTrip: {tripAccepted},
  } = useTripProvider();

  const {polylineWidth} = useMapSettings();

  return (
    <>
      <If
        condition={
          polyline.length > 0 &&
          tripAccepted &&
          Object.keys(tripAccepted).length > 0 &&
          tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO'
        }
      >
        <Polyline
          coordinates={polyline}
          strokeColor={'#00A8FF'}
          strokeWidth={polylineWidth}
        />
      </If>
      <If
        condition={
          polyline.length > 0 &&
          tripAccepted &&
          Object.keys(tripAccepted).length > 0 &&
          tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO'
        }
      >
        <Marker
          coordinate={{
            latitude: Number(lastPositionMarker?.latitude) ?? 0,
            longitude: Number(lastPositionMarker?.longitude) ?? 0,
          }}
          style={{
            zIndex: 1,
          }}
        />
      </If>
    </>
  );
};
