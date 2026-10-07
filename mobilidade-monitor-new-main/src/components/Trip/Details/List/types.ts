export interface TripLongDistanceValue {
  id: number;
  tripId: number;
  driverId: number;
  value: number;
  kmDiff: number;
  created_at: string;
}

export interface DataList {
  customerPhoto: string;
  customerName: string;
  customerId: number;
  userId: number;
  driverId?: number | null;
  status?: string | null;
  canceledBy?: string | null;
  cancellationReasons?: string | null;
  endDate?: string | null;
  customerPhone?: string | null;
  date?: string | null;
  driver_called?: DriverCalled[];
  situation: string;
  tripCallType: string;
  multiplierDynamic: number;
  fare: Fare;
  driver_commission: {
    valueType: string;
    value: number;
  };
  price: number;
  driverValue?: number;
  paymentFormFee?: number | null;
  taxes: Taxes[];
  tolls: TollsInterface[];
  trip_way_points: [];
  trip_long_distance: TripLongDistanceValue | null;
  recalculated_trip: RecalculatedTrip;
}

export interface RecalculatedTrip {
  newDistance: number;
  newTripTime: number;
  oldPrice: number;
}

export interface TollsInterface {
  name: string;
  value: number;
}

export interface Taxes {
  name: string;
  chargeBy: string;
  valueType: string;
  value: number;
  chargedValue: number;
}

export interface Fare {
  base_price: number;
  tax_price: number;
  tax_price_type: string;
  tax_price_description: string;
  tax_price_value: number;
  another_fee_type: string;
  another_fee_description: string;
  another_fee: number;
  another_fee_value: number;
  minute_price: number;
  km_price: number;
  waypoint_price: number;
  additional_value_after_km: number;
  km_to_additional_value: number;
}

export interface ListProps {
  data: DataList | undefined;
  status: string | undefined;
  priceMinutesTrip: number;
  priceTrip: number;
  tripReference: string | undefined;
}

export interface DriverCalled {
  id: number;
  status: string;
  driver?: {
    profileImage?: string | null;
  };
}
