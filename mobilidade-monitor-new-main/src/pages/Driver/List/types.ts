export interface OptionsStatusProps {
  id: number;
  text: string;
}

export interface DriverData {
  alvara: string;
  appVersion: string;
  balance: number;
  blockedBalance: number;
  carBrand: string;
  carModel: string;
  carPlate: string;
  carColor?: string;
  carYear?: string;
  city: string;
  cityId: number;
  created_at: string;
  document: string;
  driverRegisterStatusId: number;
  email: string;
  gender: string;
  idDriver: number;
  idUser: number;
  maximumAmountNegativeBalanceDriver: number | null;
  militaryForce: string;
  militaryPatent: string;
  militaryPatentPicture: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  phone: string;
  platform: string | null;
  prepaid: number;
  profileImage: string;
  proofOfResidence: string;
  rating: number;
  registerStatus: string;
  rg: number;
  rgBackPicture: string;
  rgFrontPicture: string;
  station: string;
  userType: string;
  userTypeId: number;
  hours_worked: number | null;
  hours_open: number | null;
  zafiraValidated?: number;
}

export interface EditDriverData {
  agency: string;
  agencyDigit: string;
  alvara: string;
  alvaraPicture: string;
  balance: number;
  bankAccountDocument: string;
  bankAccountId: number;
  bankId: number;
  bankName: string;
  bankNumber: string;
  blockedBalance: number;
  brand: string;
  cnh: string;
  cnhPicture: string;
  color: string;
  created_at: string;
  criminalRecord: string;
  criminalRecordPicture: string;
  crlv: string;
  crlvPicture: string;
  docs_user: [];
  document: string;
  driverRegisterStatusId: number;
  email: string;
  gender: string;
  holderName: string;
  idCar: number;
  idDriver: number;
  idUser: number;
  latitude: string;
  longitude: string;
  militaryForce: string;
  militaryStatus: string;
  model: string;
  name: string;
  nickname: string;
  numberAccount: string;
  numberAccountDigit: string;
  observation: string;
  om: string;
  op: string;
  patent: string;
  patentPicture: string;
  phone: string;
  pix: string;
  plate: string;
  preAvailable: number;
  profileImage: string;
  profileImageStatus: string;
  profileImageStatusId: number;
  profileImageTemp: string;
  proofOfResidence: string;
  registerStatus: string;
  renavam: string;
  rentalCar: string;
  rentalCompanyDocument: string;
  seatsNumber: number;
  stationId: number;
  status: string;
  typeAccount: string;
  userId: number;
  userType: string;
  userTypeId: number;
  year: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  cityId: string;
  neighborhood: string;
  driver_address: {
    city: string;
    complement: string;
    driverId: number;
    id: number;
    neighborhood: string;
    number: string;
    state: string;
    street: string;
    zipCode: string;
  }
  dateOfBirth: string;
  zafiraValidated?: number;
}

export interface TripType {
  id: number;
  text: string;
}

export interface ConfigItem {
  key: string;
  value: string;
  description: string;
}

export type DriverSearchBy = "name" | "email" | "document" | "phone" | "carPlate";

export interface UseDriverListReturn {
  listDrivers: DriverData[];
  setListDirectly: React.Dispatch<React.SetStateAction<DriverData[]>>;
  filterLoading: boolean;
  hasMore: boolean;
  filters: {
    valueSearch: string;
    searchBy: DriverSearchBy;
    idStatusSearch: number;
    driverType: number;
  };
  setValueSearch: (value: string) => void;
  setSearchBy: (value: DriverSearchBy) => void;
  setIdStatusSearch: (value: number) => void;
  setDriverType: (value: number) => void;
  fetchMore: () => void;
  refresh: () => void;
}
