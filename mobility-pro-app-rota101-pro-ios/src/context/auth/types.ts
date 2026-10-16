export interface IAuthContext {
  authenticateLogin: (data: AuthenticateLoginData) => Promise<void>;
  syncDeviceToken: () => Promise<void>;
  user: User | null;
  partner: Partner | null;
  setUser: (user: User | null) => void;
  cityConfig: CityConfig | null;
  signed: boolean;
  deviceToken: string;
  permissionLocal: boolean;
  checkDeviceIsSupported: () => void;
  singleDelivery: boolean;
  loading: boolean;
  loadingGeneralSettings: boolean;
  setLoading: (loading: boolean) => void;
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
  token: string;
  offerBiometry: boolean;
  setOfferBiometry: (offerBiometry: boolean) => void;
  signOut: () => void;
  updateDataUser: (userData: User | null) => void;
  signIn: (user: any) => Promise<void>;
  saveBiometry: () => Promise<boolean>;
  biometryIsEnabled: () => Promise<boolean>;
  generalSettings: GeneralItem[];
  setGeneralSettings: (generalSettings: GeneralItem[]) => void;
  authenticateBiometry: () => Promise<boolean>;
  disablePhoneLogin: boolean | null;
  getConfigByPosition: (position: Position) => Promise<void>;
  getPermissionLocal: () => any;
  requestFingerprint: boolean;
  setRequestFingerprint: (enable: boolean) => void;
  setHeaders: (token: string) => void;
  getNotification: () => void;
  notification: any;
  setNotification: (notification: any) => void;
  getRequireField: () => Promise<any>;
  loginDriver: (email: string, password: string) => Promise<boolean>;
  userDriver: UserDriver | null;
  setUserDriver: (userDriver: UserDriver | null) => void;
  isDriver: boolean;
  tokenDriver: string;
  listCategories: () => Promise<CategoryDriver[] | []>;
  signOutDriver: () => void;
  deleteBiometry: () => void;
  setSocialLogin: (socialLogin: SocialLoginProps) => void;
  socialLogin: SocialLoginProps;
  setDataSocialLogin: (dataSocialLogin: ResponseSocialLoginProps) => void;
  dataSocialLogin: ResponseSocialLoginProps;
  socialLoginFacebook: (dataUser: SocialLoginProps) => void;

  setDriverSelected: (value: boolean) => void;
  driverSelected: boolean;
  confirmationCodeSmsRegister: string | null;
  userData: any;
  setUserData: (data: any) => void;
  itsNetwork: boolean;
  setItsNetwork: (val: boolean) => void;
  showModalPanicButton: {
    status: boolean;
    body: string;
    additionalData: any;
  };
  setShowModalPanicButton: (showModalPanicButton: {
    status: boolean;
    body: string;
    additionalData: any;
  }) => void;
  newActionFb: string;
  setNewActionFb: (val: string) => void;
  api_key_google: string;
  setIsNegativate: (val: boolean) => void;
  isNegativate: boolean;
  setVisibleNegativateModal: (val: boolean) => void;
  visibleNegativateModal: boolean;
  loadingSession: boolean;
}

export interface Position {
  latitude: number;
  longitude: number;
}

export interface User {
  api_token?: any;
  customerRegisterStatusId?: string;
  device_token?: string;
  document?: string;
  email?: any;
  idCustomer?: string;
  idUser?: string;
  nameUser?: string;
  nickname?: string;
  phone?: string;
  profileImage?: string;
  profileImageLink?: string;
  birthDate: string;
  gender: string;
  genderId: number;
}

export interface CityConfig {
  idCityConfig: string;
  cityId: string;
  timeToExpireTrip: string;
  kmRemainingToPutDriverPreAvailable: string;
  quantityTripWayPoints: string;
  cancellationCustomerFeeValue: string;
  waitingTimeCustomerCancellationFee: string;
  routePercentageCancellationFee: string;
  daysToBillCancellationFee: string;
  timeToUpdateTrip: string;
  timeToSearchTrip: string;
  timeToReleaseTrip: string;
  idealListCommonPrice: string;
  appSharingCustomerMessage: any;
  appSharingDriverMessage: any;
  comparisionPrice: string;
  subtractionCompetitivePrice: string;
  daysForFeeRefund: any;
  apiKeyGoogleFront: any;
  apiKeyGoogleBack: any;
  quantityDriversCloseOnCall: string;
  securityContactNumber: string;
  supportContactNumber: string;
  supportEmail: any;
  urlPartner: any;
  urlFacebook: string;
  urlInstagram: string;
  enabledDriverFields: EnabledDriverFields;
  enableTripSharing: string;
  enableTripSuggestion: string;
  enableTripRecalculation: string;
  enableDriverDataSheet: string;
  enableChoicePriceTripRecalculation: string;
  showPriceWhileTrip: string;
  showUserRating: string;
  enableCallInChat: string;
  enableTripScheduled: string;
  enableKnobTrip: string;
  kmForCalculatePrice: string;
  timezone: any;
  typeMoney: string;
  enableRouteDrawingInTicketScreen: string;
  enableDepartureAddressConfirmation: string;
  showFormOfPaymentToDriverDuringTrip: string;
  showCancellationFeeForCustomer: boolean | string;
  allowDriverGenerateCancellationFee: string;
  recalculationFromKm: string;
  showNetValueForDriverOnCall: string;
  addTripNote: string;
  enableValidationDocumentInTrip: string;
  marginForRecalculation: string;
  showDynamicAreaInMap: string;
  showRiskAreaInCall: string;
  showDriverRating: string;
  maximumAmountNegativeBalanceDriver: string;
  mp_public_key: string;
  status_realtime_database: boolean;
  firebase_config: Firebase_config;
  configDriverLocation: ConfigDriverLocation;
  enableCustomOrderTripType?: string;
}

export interface AcceptCityConfig {
  price: boolean;
  origin: boolean;
  reward: boolean;
  favorite: boolean;
  destination: boolean;
  paymentForm: boolean;
  estimatedTime: boolean;
  ratingCustomer: boolean;
  estimatedDistance: boolean;
  quantityWaypoints: boolean;
  quantityTripsCustomer: boolean;
}

export interface Firebase_config {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ConfigDriverLocation {
  id: string;
  timeOn: string;
  timeOff: string;
  distanceMetersOn: string;
  distanceMetersOff: string;
  shippingType: string;
  port_url: string;
  path_url: string;
  stationaryRadius: string;
  fastestInterval: string;
  interval: string;
  activitiesInterval: string;
}

export interface EnabledDriverFields {
  accept: AcceptCityConfig;
}

export interface GeneralItem {
  key: string;
  value: string;
}

export interface GeneralProps {
  addTripNote: string;
  allowDriverGenerateCancellationFee: string;
  apiKeyGoogleBack: any;
  apiKeyGoogleFront: any;
  appSharingCustomerMessage: any;
  appSharingDriverMessage: any;
  cancellationCustomerFeeValue: string;
  cityId: number;
  comparisionPrice: number;
  configDriverLocation: ConfigDriverLocation;
  daysForFeeRefund: any;
  daysToBillCancellationFee: string;
  enableCallInChat: string;
  enableChoicePriceTripRecalculation: string;
  enableDepartureAddressConfirmation: string;
  enableDriverDataSheet: string;
  enableKnobTrip: string;
  enableRouteDrawingInTicketScreen: string;
  enableTripRecalculation: string;
  enableTripScheduled: string;
  enableTripSharing: string;
  enableTripSuggestion: string;
  enableValidationDocumentInTrip: string;
  enabledDriverFields: EnabledDriverFields;
  firebase_config: Firebase_config;
  idCityConfig: string;
  idealListCommonPrice: string;
  kmForCalculatePrice: string;
  kmRemainingToPutDriverPreAvailable: string;
  marginForRecalculation: string;
  maximumAmountNegativeBalanceDriver: string;
  mp_public_key: string;
  quantityDriversCloseOnCall: string;
  quantityTripWayPoints: string;
  recalculationFromKm: string;
  routePercentageCancellationFee: string;
  securityContactNumber: string;
  showCancellationFeeForCustomer: string;
  showDriverRating: string;
  showDynamicAreaInMap: string;
  showFormOfPaymentToDriverDuringTrip: string;
  showNetValueForDriverOnCall: string;
  showPriceWhileTrip: string;
  showRiskAreaInCall: string;
  showUserRating: string;
  status_realtime_database: boolean;
  subtractionCompetitivePrice: string;
  supportContactNumber: string;
  supportEmail: any;
  timeToExpireTrip: string;
  timeToReleaseTrip: string;
  timeToSearchTrip: string;
  timeToUpdateTrip: string;
  timezone: any;
  typeMoney: string;
  urlFacebook: string;
  urlInstagram: string;
  urlPartner: any;
  waitingTimeCustomerCancellationFee: string;
  how_many_times_alert_will_be_shown: string;
  show_more_calcs_driver: number;
  show_drivers_close: string;
  enable_pix_trip_end_ipag?: boolean;
}

export interface UserDriver {
  api_token: string;
  appVersion: string;
  cityId: string;
  deviceToken: string;
  document: string;
  driverRegisterStatusId: string;
  email: string;
  idDriver: string;
  idUser: string;
  isDeliveryMan: string;
  name: string;
  nameUser: string;
  nickname: string;
  phone: string;
  profileImage: string;
  stationId: string;
  status: string;
  userTypeId: string;
  versionIsCritical: boolean;
  gender: string;
  genderId: number;
}

export interface CategoryDriver {
  description: null | string;
  iconMapDriverId: string;
  idUserType: string;
  isActive: string;
  isDeliveryMan: string;
  isDriver: string;
  name: string;
  picture: string;
  statusId: string;
}

export interface Partner {
  addressEstablishment?: string | null;
  api_token?: string | null;
  balance?: string;
  balanceId?: string;
  bankAccount?: any;
  created_at?: string;
  email?: string;
  function?: null;
  idCustomer?: string;
  idPartner?: string;
  last_lat?: string;
  last_lon?: string;
  latitude?: string | null;
  longitude?: string | null;
  managerId?: string | null;
  name?: string;
  nameEstablishment?: string | null;
  nickname?: string;
  partnerRegister?: string;
  partnerRegisterStatusId?: string;
  phone?: string;
  platform?: string;
  rating?: string;
  statusId?: string;
  tripBalance?: string;
  userId?: string;
}

export interface SocialLoginProps {
  email: string;
  name: string;
  phone: string;
  nickname: string;
  deviceToken: string;
}

export interface ResponseSocialLoginProps {
  addressNumber: number | null;
  api_token: string;
  customerRegisterStatusId: number;
  device_token: string;
  document: string | null;
  email: string;
  idCustomer: number;
  idUser: number;
  nameUser: string;
  nickname: string;
  phone: string;
  profileImage: string;
  profileImageLink: string;
  zipcode: string | null;
}

export interface UserDataProps {
  idCustomer: string;
  idUser: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  document: string;
  dateOfBirth: string;
  rg: string;
  rgFrontPicture: any;
  rgBackPicture: any;
  rating: string;
  cityId: string;
  om: any;
  militaryForce: any;
  militaryStatus: any;
  militaryPatent: any;
  profileImage: string;
  userTypeId: string;
  customerRegisterStatusId: string;
  tripBalance: string;
  balance: string;
  deviceToken: string;
  idPartner: string;
  nameEstablishment: any;
  addressEstablishment: any;
  function: any;
  partnerRegisterStatusId: string;
  partnerRegisterStatus: string;
  isDependent: string;
  trip: any;
  appVersion: AnalyserNode;
  referralMonetization: any;
  docsUser: any[];
}

export interface LoginCustomerData {
  email: string;
  password: string;
  deviceToken: string;
  generateToken?: boolean;
  keyAppPartner?: string | null;
}

export interface LoginDriverData {
  email: string;
  password: string;
  deviceToken: string;
  keyAppPartner?: string | null;
}

export interface DriverDeviceTokenData {
  driverId: string | number;
  idUser: string | number;
  deviceToken: string;
}

export interface AuthenticateLoginData {
  email: string;
  password: string;
  setModal?: (val: boolean) => void;
  keyAppPartner?: string;
}
