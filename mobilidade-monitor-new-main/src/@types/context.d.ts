import { ReactNode } from "react";

export interface StatusPayData {
  id: number;
  status: string;
  message: string | null;
}

export interface RequestData {
  api_token: string;
  blocked: number;
  document: string;
  email: string;
  idUser: number;
  name: string;
  nickname: string;
  role: {
    groups: Group[];
    name: string;
    isRoot?: boolean;
  };
  roleId: number;
  statusId: number;
  statusPay: StatusPayData;
  updated_at: string | number | Date;
  support?: number;
  allowedCities?: number[];
}

export interface AuthContextData {
  signed: boolean;
  responseDataUser: RequestData | null;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
  hasPermission(nameGroup: string, namePermission?: string | null): boolean;
  speedmobLogin(email: string, password: string): Promise<void> | string;
  changeApi(hostName: string, hostLink: string): void;
  loading: boolean;
  setLoading: (data: boolean) => void;
  validateSession(): Promise<boolean>;
  handleSessionExpired(): void;
  authInitialized: boolean;
}

export interface Group {
  name: string;
  permissions: string[];
}

export interface FranchiseResponse {
  [key: string]: string;
}

export interface NotificationData {
  active: boolean;
  handleShowNotifications(active: boolean): void;
}

export interface MenuOptionsData {
  active: boolean;
  handleShowMenu(active: boolean): void;
}

export interface TripProviderProps {
  children: ReactNode;
}

export interface DriverProviderProps {
  children: ReactNode;
}

export interface TripContextValues {
  trips: TripDto[];
  removingTripReferences: Set<string>;
  handleSetTrips(trips: TripDto[]): void;
  handleUpdateTrip(updatedTrip: TripDto): void;
  handleRemoveTrip(tripReference: string): void;
}

export interface DriverContextValues {
  drivers: DriverRealtime[];
  handleSetDrivers(drivers: DriverRealtime[]): void;
  handleUpdateDriver(updatedDriver: DriverRealtime): void;
  handleRemoveDriver(driverId: string | number): void;
}

export interface FullyItem {
  cityId: number;
  nome: string;
  shortName: string;
  polygon: string;
}

export interface FullyContextData {
  fullyList: FullyItem[]
  setFullyList: (data: FullyItem[]) => void
}

export interface UserGroupItem {
  id: number;
  name: string
}

export interface UserGroupContextData{
  userGroupList: UserGroupItem[]
  setUserGroupData: (data: UserGroupItem[]) => void
}

export interface UserTypeContextData {
  userTypes: DriverUserTypesProps[];
  userTypesById: Record<number, DriverUserTypesProps>;
  loading: boolean;
  refreshUserTypes: () => Promise<void>;
}
