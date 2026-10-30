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
  profileImageLink?: string | null;
  quantityTripsFinished: number;
  rg: number;
  rgBackPicture: string;
  rgFrontPicture: string;
  status: string;
  voucherBalance: number;
  zafiraValidated?: number;
}

export interface ListClientData extends Array<ListClient> {}

export interface ListClientGroup {
  response: {
    data: ListClientData;
  };
  status: boolean;
}

export interface UpdateCustomerPayload {
  document: string;
  email: string;
  gender: string;
  idCustomer: number;
  name: string;
  phone: string;
}

export interface ModalProps {
  item: ListClient;
  active: boolean;
  cancelVisible: () => void;
  reSearch: () => void;
  statusRequest: (result: boolean) => void;
}
