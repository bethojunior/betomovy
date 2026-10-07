import {LocationObject} from 'expo-location';
import {TripInfo} from '../Trip/types';

export interface TaximeterContextProps {
  setTripTaximeter: React.Dispatch<React.SetStateAction<TripInfo>>;
  tripTaximeter: TripInfo;
  getPricesByTripType: (
    tripTypeId: string,
    location: LocationObject,
  ) => Promise<DataTripTypePrice>;
  startTripTaximeter: (
    tripTypeId: string,
    setState: React.Dispatch<React.SetStateAction<TripInfo>>,
    priceId: string,
    multiplierDynamic: string,
    location: LocationObject,
  ) => Promise<TripInfo>;
  stopTripTaximeter: (
    distance: number,
    price: number,
    tripTaximeter: TripInfo,
  ) => Promise<any>;
}

export interface DataTripTypePrice {
  additional_value_after_km: string;
  another_fee: string;
  another_fee_type: string;
  base_price: string;
  cityId: string;
  color: string;
  comparisionPrice: string;
  deliveryOption: string;
  description: string;
  freightOption: string;
  id: string;
  km_price: string;
  km_to_additional_value: string;
  long_distance_delivery_price: string;
  min_price: string;
  minute_price: string;
  name: string;
  picture: string;
  promotional_price_temp: string;
  reward_driver_min_price: string;
  statusId: string;
  subtractionCompetitivePrice: string;
  tag: string;
  tax_price: string;
  tax_price_type: string;
  tripTypeId: string;
  type_additional_value_after_km: string;
  waypoint_price: string;
}
