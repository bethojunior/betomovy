export interface Coupon {
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
  valueType: string;
}

export interface CouponTripContentProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | any;
  visible: boolean;
  setVisible: (value: boolean) => void;
}
