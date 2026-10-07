import * as Location from 'expo-location';
import {TripProps} from '../../../../client/contexts/Trip/types';

export interface UserDriverContextType {
  getDriverFind: () => Promise<UserDriverFind>;
  userDriverFind: UserDriverFind;
  setUserDriverFind: (userDriverFind: UserDriverFind) => void;
  toogleDriverStatus: (
    status: string,
    local: {latitude: number; longitude: number},
  ) => Promise<boolean>;
  getWeeklyEarnings: () => Promise<WeeklyEarningsProps | null>;
  weeklyEarnings: WeeklyEarningsProps;
  setWeeklyEarnings: (weeklyEarnings: WeeklyEarningsProps) => void;
  EditProfileImage: (
    uri: string,
    type: string,
    filename: string,
  ) => Promise<boolean>;
  getDocumentsConfig: () => Promise<DocumentConfig[]>;
  stationId: string | null;
  sendDocument: (
    text: string | null,
    image: string | null,
    pdf: PdfProps | null,
    docId: string,
  ) => Promise<void>;
  statusDriver: () => void;
  listClientFavorites: (page: number) => Promise<FavoritesClientProps>;
  getLinkMenu: () => Promise<AdsProps>;
  addAds: (menuAppId: string) => void;
  getIndicatorList: (page: string) => Promise<ListIndicatorProps>;
  deleteFavorite: (idFavorite: string) => Promise<void>;
  loadingButton: boolean;
}

export interface UserDriverContextChildren {
  children: React.ReactNode;
}

export interface UserDriverFind {
  appVersion: AppVersionProps;
  balance: BalanceProps;
  balanceId: string;
  car: CarProps;
  cityId: string;
  cnh: null | any;
  config: ConfigProps;
  cooperative: null | any;
  cooperativeId: null | any;
  crlv: null | any;
  idUser: number;
  docsUser: DocsUserProps[];
  document: string;
  preAvailableTrip: null | any;
  driverRegisterStatus: string;
  driverRegisterStatusId: string;
  driverType: string;
  idDriver: string;
  isDeliveryMan: string;
  latitude: string;
  longitude: string;
  name: string;
  nickname: string;
  phone: string;
  preAvailable: string;
  prepaid: string;
  profileImage: string;
  profileImageStatus: string;
  profileImageStatusId: string;
  profileImageTemp: any;
  rating: string;
  referralMonetization: ReferralMonetizationProps;
  stationId: any;
  statistics: StatisticsProps;
  status: string;
  total_finished_trip: string;
  tripTypes: TripTypesProps[];
  userId: string;
  userTypeId: string;
  trip: TripProps;
}

export interface AppVersionProps {
  isCritical: string;
  version: string;
}

export interface BalanceProps {
  balance: string;
  blockedBalance: string;
  blockedBalanceToPay: string;
  idBalance: string;
  pendingBalanceWithdraw: string;
  tripBalance: string;
  withheldBalance: string;
}

export interface CarProps {
  brand: string;
  color: string;
  model: string;
  plate: string;
  renavam: string;
  year: string;
}

export interface ConfigProps {
  activitiesInterval: string;
  distanceMetersOff: string;
  distanceMetersOn: string;
  fastestInterval: string;
  id: string;
  interval: string;
  path_url: string;
  port_url: string;
  shippingType: string;
  stationaryRadius: string;
  status_realtime_database: boolean;
  timeOff: string;
  timeOn: string;
}

export interface DocsUserProps {
  deleted_at?: any;
  description?: any;
  docId?: string;
  docStatus?: string;
  docStatusId?: string;
  image?: any;
  label?: string;
  link?: any;
  text?: string;
}

export interface ReferralMonetizationProps {
  label: string;
  userIndications: string;
}

export interface StatisticsProps {
  quantity_accepted_calls?: string;
  quantity_calls?: string;
  quantity_canceled_calls?: string;
  quantity_refused_calls?: string;
  value_collected?: string;
  quantity_finished_calls?: string;
}

export interface TripTypesProps {
  tripType: string;
  tripTypeId: string;
}

export interface WeeklyEarningsProps {
  earnings: EarningsProps[];
  earningsTotal: string;
}

export interface EarningsProps {
  slug: string;
  dayOfWeek: string;
  total_day: string;
}

export interface DocumentConfig {
  created_at: string;
  deleted_at: any;
  description: any;
  id: string;
  image: string;
  label: string;
  link: any;
  pdf: string;
  statusId: string;
  text: string;
  updated_at: string;
}

export interface PdfProps {
  mimeType?: string;
  name?: string;
  size?: string;
  type?: string;
  uri?: string;
}

export interface AdsProps {
  id: string;
  description: string;
  link: string;
}

export interface ListIndicatorProps {
  startRow: number;
  currentPage: number;
  lastPage: number;
  totalRows: string;
  previousPage: number;
  nextPage: number;
  startRange: number;
  endRange: number;
  showStartButton: boolean;
  showEndButton: boolean;
  data: IndicatorList[];
}

export interface IndicatorList {
  userIndicatedId: string;
  indicated_name: string;
  indicated_nickname: string;
  indicated_phone: string;
  indicated_email: string;
  indicated_type: string;
  profileImage: string;
  driverStatus: any;
  cityName: any;
  created_at: string;
}

export interface FavoritesClientProps {
  favorites: FavoritesProps[];
  paginate: Pagination;
}

export interface FavoritesProps {
  created_at: string;
  idCustomer: string;
  idFavorite: string;
  name: string;
  nickname: string;
  profileImage: string;
}

export interface Pagination {
  currentPage: number;
  endRange: number;
  lastPage: number;
  nextPage: number;
  previousPage: number;
  showEndButton: boolean;
  showStartButton: boolean;
  startRange: number;
  startRow: number;
  totalRows: string;
}
