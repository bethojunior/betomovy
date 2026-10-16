import { RecalculatedTrip } from "./recalculatedTrip";

export interface Trip {
  accessibility: Accessibility;
  active: boolean;
  callingDriver: any;
  calling_at: any;
  centralId: any;
  centralNeighborhoodId: any;
  cityId: string;
  colorAudit: string;
  customer: Costumer;
  customerCancellationFee: any;
  date: Date;
  deliveryInfo: any;
  destination: Destination;
  distance: string;
  driver: Driver;
  driverCommissionId: string;
  driverCommissionValue?: string;
  driverCommissionType?: string;
  driverId: string;
  estimatedTimeDriverArrival: any;
  estimatedTripTime: string;
  favoriteDrivers?: string;
  fare: Fare;
  freightItems: any;
  haveReturn: string;
  idTrip: string;
  isOffer: string;
  multiplierDynamic: string;
  oldDestinationId: any;
  oldPrice: any;
  origin: Origin;
  price: string;
  priceId: string;
  priceRange: any;
  recalculatedPrice: RecalculatedTrip | null;
  rewardTrip: any;
  ride: any;
  riskArea?: {
    destination: boolean;
    origin: boolean;
  };
  schedule: Schedule;
  status: string;
  timeToExpireTrip: any;
  tripBids: any;
  tripCallType: string;
  tripCallTypeId: string;
  tripDiscountCoupon: any;
  tripItems: boolean;
  tripLongDistanceValue: any;
  tripPaymentForm: string;
  tripPaymentFormId: string;
  tripReference: string;
  tripType: string;
  tripTypeId: string;
  tripWayPoints: any;
  userId: string;
}

export interface Accessibility {
  assistant: any;
  obstacle: any;
}

export interface Costumer {
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
  rating: string;
  rg: string;
  rgBackPicture: string;
  rgFrontPicture: string;
  tripBalance: string;
  userTypeId: string;
}

export interface Date {
  nanoseconds: string;
  seconds: string;
}

export interface Destination {
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

export interface Car {
  brand: string;
  color: string;
  model: string;
  plate: string;
  renavam: string;
  year: string;
}

export interface Driver {
  balanceId: string;
  bankAccountId: string;
  car: Car;
  cityId: string;
  deviceToken: string;
  document: string;
  driverRating: string;
  driverRegisterStatusId: string;
  email: string;
  estimative: Estimative;
  iconMapDriver: string;
  idDriver: string;
  latitude: string;
  location: Location;
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

export interface Estimative {
  distance: string;
  duration: string;
}

export interface Location {
  created_at: string;
  latitude: string;
  longitude: string;
  userId: string;
}

export interface Fare {
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
  multiplierValue?: string;
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
  comparisionPrice: string;
  deliveryOption: string;
  freightOption: string;
  subtractionCompetitivePrice: string;
}

export interface Origin {
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

export interface Schedule {
  driverId: string;
  schedule: string;
  scheduleUTC: string;
  tripReference: string;
}

export interface TripFinishStatus {
  tripReference: string;
  status: string;
}
