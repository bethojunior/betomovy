import { RewardCampaignTripItem, RewardTripLongDistance } from '../BonusSection/types';
import { TripLongDistanceValue } from '../List/types';

export interface TripHistoryProps {
  countDenied: number;
  date: string;
  driverBalanceInStartCall: number;
  driverId: number;
  driverNetValue: any;
  idTripHistory: number;
  status: string;
  tripReference: string;
}

export interface TripDetailsProps {
  tripPaymentFormTypeId: number;
  trip_report: TripReport;
  idTrip: number;
  tripReference: string;
  date: string;
  endDate: string;
  price: number;
  usedFakeGps: number;
  multiplierDynamic: number;
  priceId: number;
  driverId: number;
  userId: number;
  tripTypeId: number;
  status: string;
  canceledBy: string;
  tripPaymentForm: string;
  tripType: string;
  situation: string;
  originId: number;
  destinationId: number;
  description: string;
  cityId: number;
  cityName: string;
  driverName: string;
  driverPhoto: string;
  driverTypeId: number;
  driverType: string;
  driverPhone: string;
  distance: number;
  estimatedTripTime: number;
  tripCallTypeId: number;
  customerId: number;
  zoneId: number;
  tripPaymentFormId: number;
  platform: string;
  cancellationFee: number;
  cancellationReasons: string;
  discountCoupon: number;
  driverReward: number;
  customerName: string;
  isForThirdParty: number;
  customerPhoto: string;
  driverIsTheCustomer: number;
  holderName: string;
  franchiseId: number;
  customerPhone: string;
  tripAuditId: number;
  paymentForm: string;
  tripCallType: string;
  favoriteDrivers: string;
  rewardTripId: number;
  driverCommissionId: number;
  centralId: number;
  evaluationByDriver: string;
  evaluationByCustomer: string;
  appValue: number;
  driverValue: number;
  originLatitude: string;
  originLongitude: string;
  originNeighborhood: string;
  originAddress: string;
  destinationLatitude: string;
  destinationLongitude: string;
  destinationNeighborhood: string;
  destinationAddress: string;
  delivery_info: string;
  freight_items: [];
  accessibility: string;
  events: EventItemInterface[];
  driver_commission: DriverCommission;
  trip_way_points: [];
  fare: Fare;
  recalculated_trip: RecalculatedTrip;
  trip_long_distance: TripLongDistanceValue | null;
  reward_campaign_trip: RewardCampaignTripItem[];
  reward_trip_long_distance: RewardTripLongDistance | null;
  tolls: [];
  driver_called: DriverDataProps[];
  taxes: Tax[];
  trip_history: TripHistoryProps[];
}

export interface RecalculatedTrip {
  newDistance: number;
  newTripTime: number;
  oldPrice: number;
}

export interface EventItemInterface {
  created_at?: string;
  driver_location?: {
    latitude: string;
    longitude: string;
  };
  data?: {
    latitude?: string;
    longitude?: string;
    driver?: {
      location?: {
        latitude: string;
        longitude: string;
        created_at?: string;
      };
    };
  };
  date?: string;
  message: string;
}

export interface DriverDataProps {
  created_at: string;
  deliveryOrderId: null;
  destinationProximity: number;
  driver: {
    alvara: string;
    alvaraPicture: string;
    appIsOpen: boolean;
    appVersion: string;
    balanceId: number;
    cityId: number;
    cnh: string;
    cnhPicture: string;
    cooperativeId: null;
    countNotAnswered: number;
    criminalRecord: string;
    criminalRecordPicture: string;
    crlv: string;
    crlvPicture: string;
    driverAttachmentTypeId: null;
    driverRegisterStatusId: number;
    estateId: number;
    external_account_bank_id: null;
    hasCardReader: number;
    idDriver: number;
    isFromMockLocale: number;
    lastCustomerRefused: string;
    last_lat: string;
    last_lon: string;
    last_position_update: string;
    performanceGrade: number;
    preAvailable: number;
    prepaid: number;
    profileImage: string;
    profileImageStatusId: number;
    profileImageTemp: string;
    proofOfResidence: string;
    stationId: number;
    status: string;
    userId: number;
    user?: {
      idUser: number;
      name: string;
      phone: string;
    };
  };
  driverId: number;
  id: number;
  proximity: number;
  status: string;
  tripReference: string;
  updated_at: string;
}

export interface TripReport {
  idTripReport: number;
  tripReference: string;
  userId: number;
  cancellationReasonsId: number;
  message: string;
  cancellationReasons: string;
  list_reports: number;
  monetized: number;
}

export interface Driver {
  idDriver: number;
  cityId: number;
  estateId: number;
  stationId: number;
  userId: number;
  cooperativeId: number;
  cnh: string;
  cnhPicture: string;
  crlv: string;
  crlvPicture: string;
  profileImage: string;
  profileImageTemp: string;
  profileImageStatusId: number;
  alvara: string;
  alvaraPicture: string;
  criminalRecord: string;
  criminalRecordPicture: string;
  proofOfResidence: string;
  status: string;
  last_lat: string;
  last_lon: string;
  last_position_update: string;
  driverRegisterStatusId: number;
  isFromMockLocale: number;
  balanceId: number;
  hasCardReader: number;
  appVersion: string;
  driverAttachmentTypeId: number;
  lastCustomerRefused: number;
  appIsOpen: boolean;
  countNotAnswered: number;
  preAvailable: number;
  prepaid: number;
  performanceGrade: number;
  external_account_bank_id: number;
}

export interface DriverCommission {
  idDriverCommission: number;
  value: number;
  valueType: string;
  cityId: number;
  tripTypeId: number;
  disableOnPromotion: number;
  statusId: number;
  created_at: string;
  updated_at: string;
}

export interface Fare {
  id: number;
  min_price: number;
  base_price: number;
  km_price: number;
  minute_price: number;
  long_distance_per_km: number;
  long_distance_value_to_final_price: number;
  long_distance_radius: number;
  promotional_price_temp: number;
  reward_driver_min_price: number;
  km_to_additional_value: number;
  type_additional_value_after_km: string;
  additional_value_after_km: number;
  code: null;
  name: null;
  tripTypeId: number;
  cityId: number;
  tax_price: number;
  tax_price_type: string;
  tax_price_value: number;
  another_fee: number;
  another_fee_type: string;
  another_fee_value: number;
  waypoint_price: number;
  long_distance_delivery_price: number;
  idealListCommonPrice: number;
  disable_after_km: null;
  statusId: number;
  tag: string;
  color: string;
  centralId: null;
  tax_price_description: string;
  another_fee_description: string;
  created_at: string;
  updated_at: string;
}

export interface Tax {
  id: number;
  name: string;
  value: number;
  valueType: string;
  description: string;
  cityId: number;
  tripTypeId: number;
  chargeBy: string;
  chargedValue: number;
  pivot: Pivot;
}

export interface Pivot {
  tripId: number;
  taxId: number;
}
