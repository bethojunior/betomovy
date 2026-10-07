export interface FeeType {
  reated_at: string;
  id: number;
  isByKm: number;
  paidByCentral: number;
  returnFee: number | string;
  statusId: number;
  updated_at: string;
}

export interface PaymentType {
  id: number;
  isActive: number;
  name: string;
  paymentFormId: number;
}

export interface CallType {
  centralCallTypeId: number;
  id: number;
  isActive: number;
  name: string;
}

export interface CentralType {
  active: number;
  address: string;
  created_at: string;
  email: string;
  id: number;
  latitude: string;
  logo: string;
  longitude: string;
  name: string;
  phone: string;
  responsibleName: string;
  tripBalance: number;
}

export interface PricesType {
  centrals: CentralType[];
  city: { estado: number; id: number; nome: string; shortName: string };
  cityId: number;
  created_at: string;
  description: string;
  id: number;
  max_value: number;
  min_value: number;
  new_value: number;
  tripTypeId: number;
  trip_type: TripTypes;
  updated_at: string;
}

export interface CentralType {
  id: number;
  name: string;
  pivot: {
    centralId: number;
    created_at: string;
    priceRangeCentralId: number;
    statusId: number;
    updated_at: string;
  };
}

export interface TripTypes {
  deliveryOption: number;
  description: string;
  freightOption: number;
  gender_id: number;
  idTripType: number;
  messageNoDriversFound: string;
  offerOption: number;
  onlyCentral: number;
  openPrice: number;
  order: number;
  picture: string;
  returnOption: number;
  showType: number;
  type: string;
}
