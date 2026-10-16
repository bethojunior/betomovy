import { RefObject, useCallback } from 'react';
import { MapAddressMarkerRef } from '../components/MapAddressMarker';

export function useMapAddressMarker(markerRef: RefObject<MapAddressMarkerRef>) {
  const onRegionChange = useCallback(() => {
    markerRef.current?.sync();
  }, [markerRef]);

  return { onRegionChange };
}
