import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { Marker, MapMarkerProps, MapMarker } from 'react-native-maps';

interface CustomMarkerProps extends MapMarkerProps {
  source?: ImageSourcePropType;
  height?: number;
  width?: number;
}

const CustomMarker = React.forwardRef<MapMarker, CustomMarkerProps>(
  ({ height, width, source, ...props }, ref) => {
    const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

    const stopTrackingViewChanges = () => {
      setTracksViewChanges(false);
    };

    return (
      <Marker {...props} ref={ref} tracksViewChanges={tracksViewChanges}>
        {source && (
          <Image
            onLoad={stopTrackingViewChanges}
            source={source}
            resizeMode="contain"
            style={{ height: height ?? 32, width: width ?? 32 }}
          />
        )}
      </Marker>
    );
  }
);

export default CustomMarker;
