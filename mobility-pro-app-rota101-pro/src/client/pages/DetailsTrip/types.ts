export interface TripTripRouteParam {
  status: string;
  price: string | number;
  paymentForm: string;
  date: string;
  schedule?: { schedule: string };
  originAddress: string;
  destinationAddress: string;
  tripReference: string;
  driverName?: string;
}

export interface DetailsTripRouteParams {
  tripReference: string;
  trip: TripTripRouteParam;
}

export interface TripCoordinate {
  latitude: string | number;
  longitude: string | number;
}

export interface TripDriverCar {
  model?: string;
  plate?: string;
}

export interface TripDriver {
  idDriver: string;
  name?: string;
  nickname?: string;
  profilePicture?: string | null;
  car?: TripDriverCar;
}

export interface TripWayPoint {
  address: string;
}

export interface TripFinancialBreakdown {
  grossPrice: number;
  netValue: number;
}

export interface TripDetailsResponse {
  location?: TripCoordinate[];
  origin: TripCoordinate;
  destination: TripCoordinate & { name?: string };
  driver?: TripDriver;
  tripWayPoints?: TripWayPoint[];
  tripCallType?: string;
  routeTracing?: string | null;
  distance?: string;
  estimatedTripTime?: string;
  ride?: boolean;
  financialBreakdown?: TripFinancialBreakdown;
}
