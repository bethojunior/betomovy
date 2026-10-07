export interface CitiesProps {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

export interface DriversProps {
  alvara: any;
  appVersion: any;
  balance: number;
  blockedBalance: number;
  carBrand: string;
  carModel: string;
  carPlate: string;
  city: string;
  cityId: number;
  created_at: string;
  document: string;
  driverRegisterStatusId: number;
  email: string;
  gender: string;
  idDriver: number;
  idUser: number;
  militaryForce: any;
  militaryPatent: any;
  militaryPatentPicture: any;
  militaryStatus: any;
  name: string;
  nickname: string;
  observation: any;
  om: any;
  phone: string;
  platform: any;
  prepaid: number;
  profileImage: string;
  proofOfResidence: any;
  rating: number;
  registerStatus: string;
  rg: any;
  rgBackPicture: any;
  rgFrontPicture: any;
  state: string;
  station: any;
  userType: string;
  userTypeId: number;
}

interface ActiveDriversProps {
  quantity: string;
  quantityDrivers: number;
  quantityDriversCanceled: number;
  quantityDriversFinished: number;
  type: string;
  userTypeId: number;
}

interface InactiveDriversProps {
  quantity: number;
  type: string;
  userTypeId: number;
}

interface MovedBillingValuesProps {
  commission: number;
  idTripType: number;
  total: number;
  type: string;
}

interface TotalDriverBalanceProps {
  total: number;
  type: string;
  userTypeId: number;
}

interface TotalTaxFeeProps {
  total: number;
  tripTypeId: number;
  type: string;
}

interface TotalTripProps {
  quantity: string;
  quantityCanceled: number;
  quantityFinished: number;
  quantityTrips: number;
  tripTypeId: number;
  type: string;
}

interface TripTotalValueProps {
  commission: number;
  paymentForm: string;
  total: number;
  tripPaymentFormId: number;
}

export interface FinancialProductDriversProps {
  active_drivers: ActiveDriversProps[];
  inactive_drivers: InactiveDriversProps[];
  moved_billing_values: MovedBillingValuesProps[];
  total_driver_balance: TotalDriverBalanceProps[];
  total_tax_fee: TotalTaxFeeProps[];
  total_trip: TotalTripProps[];
  trip_total_value: TripTotalValueProps[];
}

export interface IndicationsProps {
  blocked: boolean;
  email: string;
  idUser: number;
  name: string;
  nickname: string;
  phone: string;
  type: string;
}

export interface ListDatasIndicationsProps {
  idUser: number;
  name: string;
  period: string;
  total: number;
  userType: string;
}

export interface TripTypesProps {
  backToTripBalance: number;
  description: string;
  idTripType: number;
  order: number;
  picture: string;
  pivot: {
    referralMonetizationId: number;
    tripTypeId: number;
    value: number;
    valueType: string;
  };
  type: string;
}

export interface ReferralMonetizationProps {
  city: null;
  cityId: null;
  created_at: "2022-07-24T00:35:46.000000Z";
  id: 29;
  indications: 1;
  label: "Promoção Ativa   👨‍✈️";
  statusId: 1;
  trip_types: TripTypesProps[];
  updated_at: string;
  value: any;
  valueType: string;
}

export interface ListDriversReferralProps {
  email: string;
  idUser: number;
  level: string;
  name: string;
  phone: string;
  userIndications: number;
  userType: string;
}
