export interface ListClient {
  appVersion: string;
  balanceId: number;
  document: string;
  city: string;
  cityId: number;
  comission: number;
  created_at: string;
  dateOfBirth: number;
  email: string;
  gender: string;
  idCustomer: number;
  idUser: number;
  latitude: number;
  longitude: number;
  militaryForce: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  patent: string;
  patentPicture: string;
  phone: string;
  platform: string;
  profileImage: string;
  quantityTripsFinished: number;
  rg: number;
  rgBackPicture: string;
  rgFrontPicture: string;
  status: string;
  voucherBalance: number;
}

declare type ErrorRecord<T> = Partial<Record<keyof T, string>>;

declare type Validations<T extends {}> = Partial<Record<keyof T, Validation>>;
