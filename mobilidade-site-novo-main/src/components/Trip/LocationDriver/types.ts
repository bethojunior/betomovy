import { MapRef } from "react-map-gl";

export interface LocationDriverProps {
  id: string;
  mapRef: any;
  setPositionDriver: (val: number[]) => void;
  setPolylineData: (val: number[][]) => void;
  lastPoint: any;
}
