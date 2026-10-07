import { SelectedCouponProps, SelectedOptionTravelProps } from "../../contexts/Trip/types";

export interface travelOptionsCardProps {
  selectedOptionTravel: SelectedOptionTravelProps; 
  item: any;
  setOfferInDriver: (val: number) => void;
  turbined: boolean;
  selectedCoupon: SelectedCouponProps;
  offerInDriver: number;
  verifyCardOnCoupon: boolean;
  coupons: CouponProps[];
  setModalCoupon: (val: boolean) => void
}

interface CouponProps {
  active: string;
  bonusDriver: string;
  city: string | null;
  code: string;
  currency: string;
  dateEnd: string;
  dateStart: string;
  discountCouponId: string;
  fromValue: string;
  gender: string;
  id: string;
  limitedTo: string;
  maxDiscountValue: string;
  statusId: string;
  tripPaymentForm: string | null;
  uniqueUse: string;
  used: string;
  userId: string;
  value: string;
  valueType: symbol;
}
