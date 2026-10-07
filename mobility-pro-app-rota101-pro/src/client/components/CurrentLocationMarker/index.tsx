import {memo, useState} from 'react';
import {Marker} from 'react-native-maps';
import {translate} from '../../locales';
import {
  LocationLabel,
  LocationLabelText,
  MarkerContainer,
  PulseDot,
  PulseHalo,
} from './styles';
import {CurrentLocationMarkerProps} from './types';

function CurrentLocationMarker({
  latitude,
  longitude,
  label = translate('home.text_current_location'),
}: CurrentLocationMarkerProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  return (
    <Marker
      tracksViewChanges={tracksViewChanges}
      anchor={{x: 0.5, y: 0.5}}
      coordinate={{latitude, longitude}}
    >
      <MarkerContainer onLayout={() => setTracksViewChanges(false)}>
        <LocationLabel>
          <LocationLabelText>{label}</LocationLabelText>
        </LocationLabel>

        <PulseHalo>
          <PulseDot />
        </PulseHalo>
      </MarkerContainer>
    </Marker>
  );
}

export default memo(CurrentLocationMarker);
