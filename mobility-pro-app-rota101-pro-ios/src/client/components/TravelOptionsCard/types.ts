import { SelectedCouponProps, SelectedOptionTravelProps } from '../../contexts/Trip/types';

export interface TravelOptionsCardItem extends SelectedOptionTravelProps {
  tag: string;
  color?: string;
  multiplierPriceDynamic?: number | string;
  platformAmount?: number | null;
  driverAmount?: number | null;
  description?: string;
  estimatedTripTime?: string | number;
  tripType: SelectedOptionTravelProps['tripType'] & {
    picture?: string;
    name?: string;
    estimatedTime?: string | number;
    description?: string;
  };
}

export interface TravelOptionsCardProps {
  selectedOptionTravel: SelectedOptionTravelProps;
  item: TravelOptionsCardItem;
  setOfferInDriver: (value: number) => void;
  onPressSelectedTripType: (value: TravelOptionsCardItem) => void;
  turbined: boolean;
  selectedCoupon: SelectedCouponProps;
  offerInDriver: number;
  verifyCardOnCoupon: boolean;
  coupons: CouponProps[];
  setModalCoupon: (value: boolean) => void;
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
  valueType: string;
}
