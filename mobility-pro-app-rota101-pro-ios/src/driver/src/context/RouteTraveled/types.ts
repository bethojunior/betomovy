export interface RouteTraveledProps {
  metersRound: number;
  minutesTraveled: number;
  polyline: any;
  lastPositionMarker: any;
}

export interface ResponsePropsApi {
  distance: number,
  duration: number,
  overview_polyline: {
    points: string,
  }
}
