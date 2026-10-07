export interface TypesTravelsProps {
  deliveryOption?: number | null;
  description?: string | null;
  freightOption?: number | null;
  gender?: {
    id: number;
    name: string;
  } | null;
  gender_id?: number | null;
  idTripType?: number | null;
  messageNoDriversFound?: string | null;
  offerOption?: number | null;
  onlyCentral?: number | null;
  openPrice?: number | null;
  serviceOption?: number | null;
  order?: number | null;
  picture?: string;
  returnOption?: number | null;
  showType?: number | null;
  type?: string | null;
}

export interface ListPricesProps {
  additional_value_after_km: number;
  another_fee: number;
  another_fee_description: string | null;
  another_fee_type: string;
  base_price: number;
  centralId: number | null;
  cityId: number;
  code: string | null;
  color: string;
  created_at: string;
  disable_after_km: number | null;
  id: number;
  idealListCommonPrice: number;
  km_price: number;
  km_to_additional_value: number;
  long_distance_delivery_price: number;
  long_distance_per_km: number;
  long_distance_radius: number;
  long_distance_value_to_final_price: number;
  min_price: number;
  minute_price: number;
  name: string | null;
  promotional_price_temp: number;
  reward_driver_min_price: number;
  statusId: number;
  tag: string;
  tax_price: number;
  tax_price_description: string | null;
  tax_price_type: string;
  tripTypeId: number;
  trip_type: {
    idTripType: number;
    order: number;
    deliveryOption: number;
    description: string;
    freightOption: number;
    gender_id: number;
    messageNoDriversFound: string;
    offerOption: number;
    onlyCentral: number;
    openPrice: number;
    picture: string;
    returnOption: number;
    serviceOption: number;
    showType: number;
    type: string;
  };
  type_additional_value_after_km: string;
  updated_at: string;
  waypoint_price: number;
  waiting_extra_fee_per_minute: string;
  waiting_penalty_fee: string;
  waiting_tolerance_seconds: number;
  order: number | null;
  percentage_min_offer?: number;
  percentage_max_offer?: number;
  percentage_min_trip_partner?: number;
  percentage_max_trip_partner?: number;
}

export interface TripPaymentsFormsProps {
  active: number;
  idTripPaymentForm: number;
  name: string;
  paymentFormTypeId: number;
  payment_form_type: {
    id: number;
    name: string;
    isGeneral: number;
    showable: number;
    description: string;
  };
}

export interface CityProps {
  estado: number;
  nome: string;
  shortName: string | null;
}

export interface CashBackProps {
  active: number;
  addToFinalPrice: number;
  backToTripBalance: number;
  city: CityProps;
  cityId: number;
  created_at: Date;
  id: number;
  tripTypeId: number;
  trip_type: {
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
  };
  updated_at: Date;
  value: number;
  valueType: string;
}

export interface PriceRangeProps {
  city: CityProps;
  cityId: number;
  created_at: Date;
  description: string;
  id: number;
  max_value: number;
  min_value: number;
  new_value: number;
  tripTypeId: number;
  trip_type: {
    idTripType: number;
    picture: string;
    type: string;
  };
  updated_at: Date;
}

export interface RatesProps {
  active: number;
  chargeBy: "customer" | "driver";
  cityId: number;
  description: string;
  id: number;
  name: string;
  tripTypeId: number;
  userId: number;
  value: number;
  valueType: "$" | "%";
}

export interface CommissionPaymentFormProps {
  id?: number;
  driverCommissionId?: number;
  tripPaymentFormId: string;
  value: number | string;
  valueType: string;
}

export interface CommissionDriverProps {
  cityId: number;
  commission_another_fee: {
    another_value: number;
    driverCommissionId: number;
    id: number;
    taxValueType: string;
    tax_value: number;
    valueType: string;
  };
  commissions_payment_form: CommissionPaymentFormProps[];
  created_at: Date;
  disableOnPromotion: number;
  idDriverCommission: number;
  statusId: number;
  tripTypeId: number;
  updated_at: Date;
  value: number;
  valueType: string;
}

export interface CityConfigProps {
  id: number;
  cityId: number;
  attribute: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface CityConfigResponse {
  response: CityConfigProps[];
}
