import {PaginationApi} from '../../../../interfaces/api';
import {DriverTripSummary} from '../../../../interfaces/driverTripSummary';
import {Trip} from '../../../../interfaces/trip';
import {ScheduleDateFilter} from '../../utils/scheduleFilter';
import { AvaliationPayload } from '~/interfaces/avaliation';

export type ReducerAction = {
  type: string;
  field?: keyof stateTripProps;
  arg?: any;
};
export type ReducerType = React.Reducer<stateTripProps, ReducerAction>;

export interface TripContextType {
  acceptTrip: (
    driverId: string,
    tripReference: string,
    estimatedTimeDriverArrival: number,
    distanceDriverArrival: number,
  ) => any;
  getDriverTrip: (
    driverId: number,
    location: {latitude: number; longitude: number},
    userId: number,
    callType?: string | number | null,
  ) => Promise<'found' | 'empty' | 'skip'>;
  refuseTrip: (driverId: number, tripReference: string) => Promise<void | ''>;
  getTripDenied: any;
  cancelTripSchedule: (
    cancellationReasonsId: string,
    driverId: string,
    tripReference: string,
  ) => any;
  acceptScheduled: (driverId: number, tripReference: string) => any;
  sendMessage: (
    userId: number,
    tripReference: string,
    chatBotTripTypeId: number,
  ) => void;
  cancel: (preAccepted: boolean) => void;
  verifyExistTrip: (tripReference: string) => Promise<any>;
  sendAvaliations: (payload: AvaliationPayload) => Promise<boolean>;
  getCancellationReasons: () => any;
  clearDataTrip: () => Promise<void>;
  calculateAllDoorHandle: (
    origin: OriginProps,
    destination: DestinationProps,
    tripTypeId: string,
  ) => any;
  getPaymentFormInVehicle: () => any;
  getTripTypes: (location) => any;
  newTripDoorHandle: any;
  initTripPreAccepted: () => Promise<boolean>;
  clearDataPreAcceptedTrip: () => void;
  calculateAndDisplayRoute: (
    origin: OriginProps | any,
    destination: DestinationProps | any,
    {lat, lng},
    continueTrue?: boolean,
  ) => void;
  acceptTripOffer: (tripReference: string) => Promise<void>;
  createTripOffer: (tripId: string, value: number) => void;
  stateTrip: stateTripProps;
  dispatchTrip: React.Dispatch<ReducerAction>;
  setOff: () => Promise<void>;
  postPerOrigin: (local?: {
    latitude: number;
    longitude: number;
  }) => Promise<void>;
  sendPosition: (payload: {latitude: number; longitude: number}) => void;
  priceToShow: () => string | number;
  startMapSuggestionTimeout: () => void;
  clearMapSuggestionTimeout: () => void;
  addOrUpdateList: (field: TripListField, value: Trip) => void;
  removeFromList: (field: TripListField, value: Trip) => void;
  incrementTripSummaryItem: (
    field: keyof DriverTripSummary,
    value: number,
  ) => void;
  decrementTripSummaryItem: (
    field: keyof DriverTripSummary,
    value: number,
  ) => void;
}

export interface stateTripProps {
  trip: TripInfo;
  tripPreAccepted: TripInfo;
  tripAccepted: TripInfo;
  origin: OriginProps;
  destination: DestinationProps;
  dataCalculate: any;
  listSchedule: Trip[];
  listSchedulePaginate: PaginationApi;
  scheduleFilter: ScheduleDateFilter;
  listScheduleAccepted: Trip[];
  listScheduleAcceptedPaginate: PaginationApi;
  scheduleAcceptedFilter: ScheduleDateFilter;
  rating: number;
  polyline: [];
  flashlight: boolean;
  callDriverModal: boolean;
  countTrip: number;
  hasRun: boolean;
  isAcceptingTrip: boolean;
  notificationTripCallRequest: { userId: number; callType?: string | number | null } | null;
  cancelTrip: CancelTripProps;
  tripsOffer: Trip[];
  tripsOfferPaginate: PaginationApi;
  showMapSuggestion: boolean;
  tripSummary: DriverTripSummary;
}

export type TripListField =
  | 'listSchedule'
  | 'listScheduleAccepted'
  | 'tripsOffer';

export interface TripContextChildren {
  children: React.ReactNode;
}

export interface CancelTripProps {
  driverId: number;
  tripReference: string;
  cancellationReasonsId: number;
  generateCancellationFee: boolean;
}

export interface AccessibilityProps {
  assistant: any;
  obstacle: any;
}

export interface LatitudeAndLongitudeProps {
  latitude?: number;
  longitude?: number;
}

export interface CostumerProps {
  addressEstablishment: string;
  balance: string;
  cityId: any;
  customerRegisterStatusId: string;
  dateOfBirth: string;
  deviceToken: string;
  document: string;
  email: string;
  function: string;
  idCustomer: string;
  idPartner: string;
  idUser: string;
  isDependent: string;
  militaryForce: string;
  militaryPatent: string;
  militaryStatus: string;
  name: string;
  nameEstablishment: string;
  nickname: string;
  om: string;
  partnerRegisterStatus: string;
  partnerRegisterStatusId: string;
  phone: string;
  profileImage: string;
  rating?: number | string | null;
  quantityTrips?: number | null;
  rg: string;
  rgBackPicture: string;
  rgFrontPicture: string;
  tripBalance: string;
  userTypeId: string;
}

export interface DateProps {
  nanoseconds: string;
  seconds: string;
}

export interface DestinationProps {
  cityId?: number;
  latitude: string;
  longitude: string;
  name: string;
  neighborhood?: string;
  address?: string;
  type?: string;
  street?: string;
  id?: string;
}

export interface CarProps {
  brand: string;
  color: string;
  model: string;
  plate: string;
  renavam: string;
  year: string;
}

export interface DriverProps {
  balanceId: string;
  bankAccountId: string;
  car: CarProps;
  cityId: string;
  deviceToken: string;
  document: string;
  driverRating: string;
  driverRegisterStatusId: string;
  email: string;
  estimative: EstimativeProps;
  iconMapDriver: string;
  idDriver: string;
  latitude: string;
  location: LocationProps;
  longitude: string;
  name: string;
  nickname: string;
  phone: string;
  preAvailable: string;
  prepaid: string;
  profileImage: string;
  profileImageTemp: any;
  profilePicture: string;
  quantityTrips: string;
  rating: string;
  stationId: any;
  status: string;
  tripPreAccepted: any;
  userId: string;
  userTypeId: string;
  userTypeName: string;
}

export interface EstimativeProps {
  distance: string;
  duration: string;
}

export interface LocationProps {
  created_at: string;
  latitude: string;
  longitude: string;
  userId: string;
}

export interface FareProps {
  additional_value_after_km: string;
  another_fee: string;
  another_fee_description: string;
  another_fee_type: string;
  base_price: string;
  cityId: string;
  color: string;
  description: string;
  id: string;
  idealListCommonPrice: string;
  km_price: string;
  km_to_additional_value: string;
  long_distance_delivery_price: string;
  long_distance_per_km: string;
  long_distance_radius: string;
  long_distance_value_to_final_price: string;
  min_price: string;
  minute_price: string;
  name: string;
  picture: string;
  promotional_price_temp: string;
  reward_driver_min_price: string;
  statusId: string;
  tag: string;
  tax_price: string;
  tax_price_description: string;
  tax_price_type: string;
  tripTypeId: string;
  type_additional_value_after_km: string;
  waypoint_price: string;
}

export interface OriginProps {
  address: string;
  cityId: any;
  complement: any;
  created_at: string;
  idOrigin: string;
  latitude: string;
  longitude: string;
  neighborhood: any;
  tag: any;
}

export interface ScheduleProps {
  driverId: string;
  schedule: string;
  scheduleUTC: string;
  tripReference: string;
}

export interface TollProps {
  id: string;
  tripId?: string;
  tollId: string;
  name: string;
  address?: string;
  value: string;
}

export interface TripInfo {
  driverNetValue: string | number;
  cancelledBy: string;
  callType?: string;
  driver?: DriverProps;
  tripOff?: TripInfo;
  accessibility: AccessibilityProps;
  centralId: number | null;
  allowsFavorite: number;
  callClose: number;
  oldDestinationId: number;
  callingDriver: number;
  cityId: number;
  date: string;
  distance: number;
  customerImage: string;
  driverValue: number;
  endAddress: string;
  endDate: string;
  endLatitude: string;
  endLongitude: string;
  estimatedTripTime: number;
  estimative: {
    destination: string;
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number;
    };
    origin: string;
  };
  greaterRadius: number;
  idTrip: number;
  fare: FareProps | any;
  missingSeconds: string;
  multiplierDynamic: number;
  nameCustomer: string;
  paymentFormTypeId: number;
  price: number;
  priceId: number;
  quantityTripsCustomer: number;
  tripDiscountCoupon: any;
  radius: number;
  ratingCustomer: number;
  rewardTrip: {
    value: number;
  };
  rewardTripId: number;
  rewardType: string;
  rewardValue: number;
  riskArea: {
    destination: boolean;
    origin: boolean;
  };
  startAddress: string;
  startLatitude: string;
  startLongitude: string;
  status: string;
  timeLimitToAccept: string;
  timeToExpireTrip: number;
  timeToIncrease: number;
  tolls: TollProps[];
  tripLongDistance: {
    value: number;
  };
  tripPaymentForm: string;
  tripReference: string;
  tripTypeId: number;
  tripTypePicture: string;
  tripWayPoints: TripWayPointsProps[];
  type: string;
  typeCalled: string;
  userId: number;
  customer: CostumerProps;
  destination: DestinationProps;
  origin: OriginProps;
  turbochargedPrice?: boolean;
  tripCallType?: string;
  pix?: string;
}

export interface TripWayPointsProps {
  address: string;
  cityId: number;
  id: number;
  latitude: string;
  longitude: string;
  routePitStopTypeId: null;
  statusId: number;
  tripReference: string;
  obs: any;
  confirmed: string;
}

export interface TripType {
  description: string;
  freightOption: string;
  fullPicture: string;
  name: string;
  onlyCentral: string;
  openPrice: string;
  picture: string;
  tripTypeDrivers: TripTypeDriver[];
  tripTypeId: string;
}

export interface TripTypeDriver {
  driverType: string;
  userTypeId: string;
}
