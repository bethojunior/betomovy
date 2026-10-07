export interface RouteTraveledProps {
  metersRound: number;
  setMetersRound: (val: number) => void;
  minutesTraveled: number;
  polyline: any;
  lastPositionMarker: any;
  clearRoute: () => void;
}
