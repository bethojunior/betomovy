interface TripTypesProps {
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

interface CityProps{
  id: number;
  cityName: string;
}

export interface CommissionsProps {
  city: CityProps;
  cityId: any;
  created_at: any;
  id: number;
  indications: number;
  label: string;
  statusId: number;
  trip_types: TripTypesProps[];
  updated_at: any;
  value: any;
  valueType: string;
}

export interface TripTravelsProps {
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
