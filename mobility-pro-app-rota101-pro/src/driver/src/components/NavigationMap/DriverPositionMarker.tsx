import { forwardRef, memo, useEffect } from 'react';
import { Image } from 'react-native';
import { useLocal } from '../../hooks/location';
import { AnimatedRegion, LatLng, MapMarker, MarkerAnimated } from 'react-native-maps';
import { LocationObject } from 'expo-location';
import icCompass from '~/assets/map-pins/compass2.png';

type Coord = LatLng | AnimatedRegion;

type DriverPositionMarkerProps = {
  coordinate: Coord | null;
  onUpdateLocation?: (location: LocationObject) => void;
};

const ANCHOR = { x: 0.5, y: 0.5 };
const ICON_STYLE = { width: 46, height: 46 };

const DriverPositionMarkerComponent = forwardRef<MapMarker, DriverPositionMarkerProps>(
  ({ coordinate, onUpdateLocation }, ref) => {
    const { location } = useLocal();

    useEffect(() => {
      if (location?.coords && onUpdateLocation) {
        onUpdateLocation(location);
      }
    }, [location]);

    if (!coordinate) return null;

    return (
      <MarkerAnimated
        ref={ref}
        coordinate={coordinate as any}
        anchor={ANCHOR}
      >
        <Image source={icCompass} style={ICON_STYLE} />
      </MarkerAnimated>
    );
  }
);

export const DriverPositionMarker = memo(DriverPositionMarkerComponent);
