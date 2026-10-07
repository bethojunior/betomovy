export interface CouponType {
  active: number;
  bonusDriver: number;
  city: {
    id: number;
    nome: string;
    shortName: string | null;
  };
  cityId: number;
  code: string;
  created_at: string;
  dateEnd: string;
  dateStart: string;
  fromValue: number;
  gender: {
    id: number;
    name: string;
  };
  genderId: number;
  id: number;
  limitedTo: number;
  maxDiscountValue: number;
  saleTripId: number | null;
  tripPaymentFormId: number;
  trip_payment_form: { idTripPaymentForm: number; name: string };
  uniqueUse: number;
  updated_at: string;
  value: number;
  valueType: string;
}

export interface CitiesType {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

export interface PaymentType {
  active: number;
  idTripPaymentForm: number;
  name: string;
  paymentFormTypeId: number;
  payment_form_type: {
    description: string;
    id: number;
    isGeneral: number;
    name: string;
    showable: number;
  };
}
