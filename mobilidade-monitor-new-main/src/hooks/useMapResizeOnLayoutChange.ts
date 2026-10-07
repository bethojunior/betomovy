import { useEffect } from "react";
import { MapRef } from "react-map-gl";

type UseMapResizeOnLayoutChangeProps = {
  mapRef: React.MutableRefObject<MapRef | undefined>;
  trigger: unknown;
  delayInMs?: number;
};

export function useMapResizeOnLayoutChange({
  mapRef,
  trigger,
  delayInMs = 350,
}: UseMapResizeOnLayoutChangeProps): void {
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) {
      return;
    }
    map.resize();
    const timeoutId = window.setTimeout(() => {
      map.resize();
    }, delayInMs);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mapRef, trigger, delayInMs]);
}
