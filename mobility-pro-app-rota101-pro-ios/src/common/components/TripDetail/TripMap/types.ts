export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface TripMapProps {
  origin: Coordinate | null;
  destination: Coordinate | null;
  routeCoordinates: Coordinate[];
  originLabel: string;
  destinationLabel: string;
}
