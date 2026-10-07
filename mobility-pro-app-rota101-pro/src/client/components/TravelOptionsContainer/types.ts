export interface TravelOptionsContainerProps {
  serviceSelected: any;
  enableDepartureAddresConfirmation: any;
  setVisibleOptionTravel: (val: boolean) => void;
  setVisibleConfirmAddress: (val: boolean) => void;
  handlePix: () => void;
  handleConfirmRace: () => void;
  turbined: boolean;
  setTurbined: (val: boolean) => void;
  setTypeTrip: (val: string) => void;
  calculatePricesAndSome: (val: number) => void;
  setOfferInDriver: (val: number) => void;
  setModalInfo: (val: boolean) => void;
  haveCancelationFee: boolean;
  listServices: any;
  setModalOfferInPrice: (val: boolean) => void;
  setModalCard: (val: boolean) => void;
  valueVoucher: number;
  setVisible: (val: boolean) => void;
  selectedCard: any;
  setVisibleModalReadQrCode: (val: boolean) => void;
  loadingButton: boolean;
  setModalSchedule: (val: boolean) => void;
  loadingConfirm: boolean;
  typeTrip: string;
  date: string;
  hours: HoursProps;
  offerInDriver: number;
  verifyCardOnCoupon: boolean;
  coupons: CouponProps[];
  setModalCoupon: (val: boolean) => void;
  hasInDriver: {};
  waitForAddressConfirmation: () => void;
}

interface HoursProps {
  hour: string;
  hourFinal: string;
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
