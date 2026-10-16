import { RecalculatedTrip } from "~/interfaces/recalculatedTrip";

export interface NewTripCacheData {
  origin?: AddressProps;
  destination?: DestinationProps;
  selectedOptionTravel?: SelectedOptionTravelProps;
  selectedPaymentMethod?: SelectedPaymentMethodProps;
  waypoints?: AddressProps[];
  tolls?: any;
}

export interface TripContextType {
  previewChangeRoutes: (
    destination: DestinationProps,
    waypoints: AddressProps[],
  ) => Promise<boolean> | Promise<any>;
  handleTripStateChange: (tripReference?: string, tripOff?: () => void) => Promise<void>;
  calculateAll: (
    origin: AddressProps,
    destiny: DestinationProps,
    waypoints: AddressProps[],
    polylineFill?: boolean,
    argsTrip?: any,
  ) => Promise<void>;
  getTripPaymentMethods: () => any;
  handleSelectedPaymentMethod: (
    selectedMethod: SelectedPaymentMethodProps,
  ) => Promise<void>;
  newTrip: (
    cardSelected: string,
    price: number | null,
    isTurbine: boolean | null,
    idTransaction?: string,
    cacheData?: NewTripCacheData | null,
  ) => Promise<void>;
  cancelTripByCustomer: (
    cancellationReasonsId: number,
    status?: string,
    tripReference?: string,
  ) => Promise<boolean>;
  checkIfHaveCancellationFee: () => Promise<any>;
  handleAvaliationDriver: (comment: string) => Promise<string>;
  newTripSchedule: (
    schedule: any,
    scheduleISO: any,
    cardSelected: any,
    price: number | null,
  ) => any;
  getTrips: (status: string, page: number, setDataPage: any) => Promise<void>;
  cancelTripByCustomerSchedule: (tripReference: string, status: string) => void;
  storageFirstPolyline: any;
  getActiveTripSchedule: () => void;
  shareTrip: (tripReference: string) => any;
  newTripDoorHandle: (
    cardSelected: string,
    driverId: number,
    price: number | null,
  ) => Promise<void>;
  newTripOffer: (cardSelected: string, priceOffer: number) => void;
  refusedOffer: (tripBidId: string) => Promise<any>;
  acceptOffer: (tripBidId: string) => Promise<any>;
  changeOfferPrice: (tripReference: string, priceOffer: number) => Promise<any>;
  newTripTypeDelivery: (
    cardSelected: any,
    info: any,
    tripItem: any,
    priceOffer: any,
  ) => void;
  getAllTypeDelivery: () => Promise<any>;
  getDescriptionTypeDelivery: () => Promise<any>;
  newTripPartner: (
    cardSelected: string,
    tripCustomer: {
      name: string;
      phone: string;
    } | null,
    price: number | null,
  ) => void;
  clearTrip: () => void;
  initNewTripAfterCancel: (
    trip: TripProps,
    showAlert: boolean,
  ) => Promise<void>;
  changeRoute: () => Promise<any>;
  getCancellationReasons: () => Promise<any>;
  stateTripCustomer: InitialStateProps;
  dispatchTripCustomer: any;
  cancelParterTripByCustomer: (tripReference: string) => void;
  showModalNoCity: (show: boolean) => void;
  getWaitingTimer: (cityId: string, tripTypeId: number) => Promise<void>;
}

export interface TripContextChildren {
  children: React.ReactNode;
}

export interface ScheduleTripProps {
  driverId: string | number | null;
  schedule: string;
  scheduleUTC: string;
  tripReference: string;
}

export interface TripProps {
  driverValue?: number | null;
  accessibility: {
    assistant: any;
    obstacle: any;
  };
  callAgain: number;
  callingDriver: number;
  canceledBy: string;
  cancellationFee_generated: boolean | null;
  cancellationFee_paid: boolean | null;
  cancellationReasonsId: number;
  centralCustomerId: number;
  centralId: number;
  centralNeighborhoodId: number;
  cityConfig: {
    cancellationCustomerFeeValue: number;
    cityId: number;
    daysToBillCancellationFee: number;
    idCityConfig: number;
    idealListCommonPrice: number;
    kmRemainingToPutDriverPreAvailable: number;
    quantityTripWayPoints: number;
    routePercentageCancellationFee: number;
    timeToExpireTrip: number;
    waitingTimeCustomerCancellationFee: number;
  };
  cityId: number;
  colorAudit: string;
  customer: {
    addressEstablishment: string | null;
    balance: number;
    cityId: number;
    customerRegisterStatusId: number;
    dateOfBirth: string;
    deviceToken: string;
    document: string;
    email: string;
    function: any;
    idCustomer: number;
    idPartner: number;
    idUser: number;
    isDependent: boolean;
    militaryForce: any;
    militaryPatent: any;
    militaryStatus: any;
    name: string;
    nameEstablishment: string | null;
    nickname: string;
    om: any;
    partnerRegisterStatus: number;
    partnerRegisterStatusId: number;
    phone: string;
    profileImage: string;
    rating: string;
    rg: string | null;
    rgBackPicture: string | null;
    rgFrontPicture: string | null;
    tripBalance: number;
    userTypeId: number;
  };
  customerCancellationFee: CustomerCancellationFeeProps | null;
  customerId: number | null;
  customerName: string;
  date: string;
  deliveryInfo: string | null;
  deliveryOption: number;
  destination: {
    cityId: number | null;
    latitude: string;
    longitude: string;
    name: string;
    neighborhood: string | null;
  };
  destinationId: number;
  disableOnPromotion: boolean;
  distance: string;
  driver: {
    balanceId: number;
    bankAccountId: number;
    car: {
      brand: string;
      color: string;
      model: string;
      plate: string;
      renavam: string;
      year: string;
    };
    cityId: number;
    deviceToken: string;
    document: string;
    driverRating: number;
    driverRegisterStatusId: number;
    email: string;
    estimative: {
      distance: number;
      duration: number;
    };
    iconMapDriver: string;
    idDriver: number;
    latitude: number;
    location: {
      created_at: string;
      latitude: number;
      longitude: number;
      userId: number;
    };
    longitude: number;
    name: string;
    nickname: string;
    phone: number;
    preAvailable: string;
    prepaid: number;
    profileImage: string;
    profileImageTemp: string | null;
    profilePicture: string;
    quantityTrips: number;
    rating: number;
    stationId: number | null;
    status: string;
    tripPreAccepted: boolean | null;
    userId: number;
    userTypeId: number;
    userTypeName: number;
  };
  driverCommissionId: number;
  driverCommissionType: string;
  driverCommissionValue: number;
  driverId: number;
  ecoInfo: string | null;
  endDate: string;
  establishment: string | null;
  establishmentId: number | null;
  estimatedTimeDriverArrival: number;
  estimatedTripTime: string;
  fare: {
    additional_value_after_km: number;
    another_fee: number;
    another_fee_description: string;
    another_fee_type: string;
    base_price: number;
    cityId: number;
    color: string;
    description: string;
    id: number;
    idealListCommonPrice: number;
    km_price: number;
    km_to_additional_value: number;
    long_distance_delivery_price: number;
    long_distance_per_km: number;
    long_distance_radius: number;
    long_distance_value_to_final_price: number;
    min_price: number;
    minute_price: number;
    name: string;
    picture: string;
    promotional_price_temp: number;
    reward_driver_min_price: number;
    statusId: number;
    tag: string;
    tax_price: number;
    tax_price_description: string;
    tax_price_type: string;
    tripTypeId: number;
    type_additional_value_after_km: string;
    waypoint_price: number;
  };
  freightInfo: string | null;
  freightItems: any;
  freightPictures: string | null;
  haveReturn: number;
  idTrip: number;
  isOffer: boolean;
  location: any;
  multiplierDynamic: number;
  oldDestinationId: number | null;
  oldPrice: number | null;
  onlyCentral: boolean;
  origin: {
    address: string;
    cityId: number | null;
    complement: number | null;
    created_at: string;
    idOrigin: number;
    latitude: string;
    longitude: string;
    neighborhood: number | null;
    tag: number | null;
  };
  originId: number;
  partnerCommissionId: number | null;
  price: number;
  priceId: number;
  priceRange: number | null;
  priceRangeId: number | null;
  recalculatedPrice: RecalculatedTrip | null;
  rewardTrip: number | null;
  rewardTripId: number | null;
  ride: number | null;
  schedule: ScheduleTripProps | null;
  situation: string;
  stationId: number | null;
  status: string;
  taxes: any;
  timeToExpireTrip: number;
  tolls: any;
  tripAuditId: number;
  changeRoute: boolean;
  tripCallType: string;
  tripCallTypeId: number;
  tripCustomerId: number;
  tripDiscountCoupon: {
    oldPrice: number;
    userDiscountCouponId: number;
  };
  tripItems: boolean;
  tripLongDistanceValue: number | null;
  tripPaymentForm: string;
  tripPaymentFormId: number;
  tripPaymentFormTypeId: number;
  tripReference: string;
  tripReferenceCancellationFee_generated: string | null;
  tripReferenceCancellationFee_paid: string | null;
  tripType: string;
  tripTypeId: number;
  tripWayPoints: any;
  userId: string;
  zoneId: number;
}

export interface CustomerCancellationFeeProps {
  billing_status: string;
  created_at: string;
  description: string;
  driverId: string;
  feeValue: string;
  id: string;
  paid_tripReference: any;
  scheduledPaymentDate: any;
  statusId: string;
  title: string;
  transactionId: any;
  tripCancellationFeeTypeId: string;
  tripReference: string;
  updated_at: string;
  userId: string;
}

export interface SelectedOptionTravelProps {
  turbinedPrice?: number | string | null;
  typeTaxi: {
    tripTypeId: number;
  };
  price: number;
  platformAmount?: number;
  driverAmount?: number;
  tripTypeId: number;
  idPrice: number;
  priceDynamicValue: number;
  cashback: string;
  tripType: {
    offerOption: string;
    deliveryOption: string;
    type: string;
  };
  picture: string;
}

export interface DestinationProps {
  name?: string;
  address?: string;
  id?: number;
  latitude?: number | string;
  longitude?: number | string;
}

export interface FeeTimeExceededProps {
  title: string | null;
  description: string | null;
  show: boolean;
}

export interface SelectedCouponProps {
  id: number;
  fromValue: string;
  limitedTo: string;
}

export interface SelectedPaymentMethodProps {
  id: number;
  idTripPaymentForm: number;
  paymentFormTypeId: string;
  name: string;
  active: string;
  statusId: string;
}

export interface ChangeRoutePreviewProps {
  price: number;
  distance: number;
  duration: number;
}

export interface AddressProps {
  address: string;
  latitude: number;
  longitude: number;
  street: string;
  type: string;
  id?: string;
}

export interface SelectedMethodProps {
  active: string;
  idTripPaymentForm: number;
  name: string;
  paymentFormTypeId: string;
  statusId: string;
}

export interface InitialStateProps {
  origin: AddressProps;
  lastOrigin: any;
  locale: any;
  destination: DestinationProps;
  lastDestination: any;
  waypoints: AddressProps[];
  waypointQuantities: number;
  prices: any;
  polylineCoordinates: {latitude: number; longitude: number}[] | null;
  lastPolylineCoordinates: any;
  tripPaymentMethods: SelectedPaymentMethodProps[];
  selectedPaymentMethod: SelectedPaymentMethodProps;
  showLoadingToGetPrices: boolean;
  selectedOptionTravel: SelectedOptionTravelProps;
  selectedCoupon: SelectedCouponProps;
  distance: number;
  estimatedTripTime: number;
  hideTravelOptions: boolean;
  routeTrip: any;
  visibleLookUpAddressesModal: boolean;
  loadingTrip: boolean;
  isLoading: boolean;
  trips: TripProps[];
  trip: TripProps;
  tripSchedule: any;
  completedTripData: any;
  selectedFavorite: Array<number | string>;
  itsForMe: boolean;
  tripWho: string;
  inputWho: {
    name: string;
    phone: string;
  };
  defaultRating: number;
  tripType: string;
  calculateAllData: any;
  text: string;
  addressForVoice: string;
  changeRoutePreview: ChangeRoutePreviewProps;
  commentFinish: string;
  serviceFinishDecision: boolean | null | string;
  photoFinishDecision: boolean | null | string;
  offerOtherTypeTrip: boolean;
  pixId: null | string;
  tripPartnerList: TripProps[];
  partnerTripsReference: string[];
  timeExceededFee: FeeTimeExceededProps;
  showModalNoCity: boolean;
  showModalScheduled: boolean;
}
