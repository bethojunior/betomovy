import { FC, useRef } from 'react';
import { Marker, Polyline } from 'react-native-maps';
import { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TripMapProps } from './types';
import { Map, MapWrapper } from './styles';

const MAP_EDGE_PADDING = RFValue(50);

export const TripMap: FC<TripMapProps> = ({
  origin,
  destination,
  routeCoordinates,
  originLabel,
  destinationLabel,
}) => {
  const mapRef = useRef<any>(null);
  const theme = useTheme();

  const handleMapReady = () => {
    if (!mapRef.current || routeCoordinates.length === 0) return;

    try {
      mapRef.current.fitToCoordinates(routeCoordinates, {
        edgePadding: {
          top: MAP_EDGE_PADDING,
          right: MAP_EDGE_PADDING,
          bottom: MAP_EDGE_PADDING,
          left: MAP_EDGE_PADDING,
        },
        animated: true,
      });
    } catch (error) {
      // Mapa pode já ter sido desmontado
    }
  };

  return (
    <MapWrapper>
      <Map
        ref={mapRef}
        onMapReady={handleMapReady}
        scrollEnabled
        rotateEnabled
        zoomEnabled
        pitchEnabled
        userInterfaceStyle="light"
      >
        {origin && <Marker coordinate={origin} title={originLabel} />}
        {destination && <Marker coordinate={destination} title={destinationLabel} />}
        {routeCoordinates.length > 0 && (
          <Polyline
            strokeWidth={5}
            strokeColor={theme.colors.primary}
            coordinates={routeCoordinates}
          />
        )}
      </Map>
    </MapWrapper>
  );
};
