export interface RiskAreaProps {
  address: string;
  cityId: number;
  created_at: any;
  deleted_at: any;
  id: number;
  latitude: string;
  longitude: string;
  radius: number;
  status: string;
  updated_at: string;
  user: {
    addressNumber: any;
    api_token: string;
    blocked: number;
    cityId: number;
    cooperativeId: any;
    created_at: any;
    dateOfBirth: string;
    deviceToken: string;
    document: string;
    email: string;
    franchiseId: any;
    gender: string;
    idUser: number;
    id_asaas: any;
    importDate: any;
    isImport: number;
    isValidDocument: any;
    last_lat: string;
    last_lon: string;
    mothersName: any;
    name: string;
    nickname: string;
    observation: any;
    phone: string;
    profilePhoto: any;
    quantityTrips: number;
    rating: number;
    registered_in: string;
    rg: any;
    rgBackPicture: any;
    rgFrontPicture: any;
    roleId: any;
    statusId: 1;
    updated_at: any;
    zipcode: any;
  };
  userId: number;
}

export interface WebMapKeyProps {
  created_at: string;
  deleted_at: any;
  id: number;
  key: string;
  updated_at: string;
}
