export interface InitialStateProps {
  visibleConfigHidden: boolean;
  zoomMap: number;
  zoomMapInTrip: number;
  strokePolylineWidth: number;
  strokePolylineColor: string;
  cityConfigDriverMeters: number;
  locationDriverMetersRoute: number;
  locationDriverTimeRoute: number;
  angleDriverMap: number;
  angleDriverMapRoute: number;
  meters: number;
  markerSize: number;
  durationCam: number;
  distanceInScreen: number;
  payloadInScreen: number;
  secondsToRedirect: number;
  showConfigMap: number;
  cachePolylineOn: number;
}

export interface ContextPropsConfigLocal {
  states: InitialStateProps;
  setStates: (state: InitialStateProps) => void;
}
