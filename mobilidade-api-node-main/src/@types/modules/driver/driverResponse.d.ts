import { TripWayPoint } from 'src/modules/trip/entities';

declare type DriverNetTripPriceQuery = {
  price: number;
  driverValue: number;
};

declare type SearchTripQuery = {
  tripReference: string;
  idTrip: number;
  tripPaymentForm: string;
  paymentFormTypeId: number;
  radius?: number;
  greaterRadius?: number;
  timeToIncrease?: number;
  typeCalled?: ?string;
  callClose?: number;
  allowsFavorite?: number;
  startLatitude: string;
  startLongitude: string;
  startAddress: string;
  endLatitude: string;
  endLongitude: string;
  endAddress: string;
  type: string;
  timeToExpireTrip: number;
  rewardValue: ?number;
  rewardType: ?string;
  missingSeconds?: string;
  status: string;
  price: number;
  priceId: number;
  date: Date;
  endDate: ?Date;
  distance: number;
  estimatedTripTime: number;
  multiplierDynamic: number;
  callingDriver: string;
  userId: number;
  rewardTripId: ?number;
  tripTypePicture: string;
  customerImage: string | null;
  tripTypeId: number;
  cityId: number;
  nameCustomer: string;
  ratingCustomer: number;
  quantityTripsCustomer: number;
  tripWayPoints: TripWayPoint[];
  driverValue: ?number;
  tolls: TollTrip[];
  riskArea: {
    origin: boolean;
    destination: boolean;
  };
  turbochargedPrice?: boolean;
  estimative: ?DirectionFullAddressResponse;
  timeLimitToAccept: ?string;
  rewardTrip: ?{
    value: ?number;
  };
  tripLongDistance: ?{
    value: ?number;
  };
};
