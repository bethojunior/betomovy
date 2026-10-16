export interface TripTripRouteParam {
  status: string;
  price: string | number;
  paymentForm: string;
  date: string;
  schedule?: { schedule: string };
  originAddress: string;
  tripAuditId: string;
}

export interface DetailsTripRouteParams {
  tripReference: string;
  trip: TripTripRouteParam;
}

export interface TripFare {
  base_price?: string;
  km_price?: string;
  minute_price?: string;
  another_fee?: string;
  another_fee_type?: '%' | '$';
  another_fee_description?: string;
  additional_value_after_km?: string;
  min_price?: string;
  waypoint_price?: string;
  tax_price?: string;
  tax_price_type?: '%' | '$';
  tax_price_description?: string;
  km_to_additional_value?: string;
}

export interface TripLongDistanceValue {
  value?: string | number;
}

export interface TripTax {
  id: number;
  name: string;
  description?: string;
  value: string | number;
  valueType: '%' | '$';
  chargeBy: 'customer' | 'driver';
}

export interface TripFinancialBreakdown {
  appFeePercentage?: number | null;
  appFee: number;
  anotherFee: number;
  paymentFormFee: number;
  cancellationFee: number;
  dynamicTax: number;
  reward: number;
  grossPrice: number;
  netValue: number;
}

export interface TripWayPoint {
  address: string;
}

export interface TripCoordinate {
  latitude: string | number;
  longitude: string | number;
}

export interface TripCustomer {
  profileImage?: string | null;
  nickname?: string;
  name?: string;
  rating?: number | string | null;
  quantityTrips?: number | null;
}

export interface TripDetailsResponse {
  location?: TripCoordinate[];
  origin: TripCoordinate;
  destination: TripCoordinate & { name?: string };
  customer?: TripCustomer;
  tripWayPoints?: TripWayPoint[];
  situation?: string;
  tripCallType?: string;
  distance?: string;
  estimatedTripTime?: string;
  ride?: boolean;
  fare?: TripFare;
  taxes?: TripTax[];
  cancellationFee_paid?: string;
  routeTracing?: string | null;
  price?: string | number;
  multiplierDynamic?: string | number;
  tripLongDistanceValue?: TripLongDistanceValue;
  financialBreakdown?: TripFinancialBreakdown;
}
