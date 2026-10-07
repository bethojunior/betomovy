export interface DirectionResponse {
  distance: number;
  duration: number;
  overview_polyline: OverviewPolyline;
  type: string;
}

export interface OverviewPolyline {
  points: string;
}
