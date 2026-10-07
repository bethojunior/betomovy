import {useEffect, useState} from 'react';
import {BackPage} from '../../../../components/BackPage';
import {CardCupom} from '../../../../components/CardCupom';
import ModalFrame from '../../../../components/form/Modal';
import {translate} from '../../../../locales';
import {ContainerCoupons} from './styles';
import {useTrip} from '../../../../contexts/Trip';

interface Props {
  coupons: Coupon[];
  selectedCoupon: Coupon | any;
  visible: boolean;
  setVisible: (value: boolean) => void;
}

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
  valueType: symbol;
}

export default function CouponTripContent({
  coupons,
  selectedCoupon,
  visible,
  setVisible,
}: Props) {
  const [couponSelected, setCouponSelected] = useState({} as Coupon);
  const [checked, setCkecked] = useState(false);

  const {dispatchTripCustomer} = useTrip();

  useEffect(() => {
    setCouponSelected(selectedCoupon);
  }, [selectedCoupon]);

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => setVisible(false)}
      onPressConfirm={() => {
        dispatchTripCustomer({
          type: 'update',
          field: 'selectedCoupon',
          arg: couponSelected,
        });
        setVisible(false);
      }}
    >
      <BackPage
        ml={-10}
        text={translate('paymentPage.title_cuopon')}
        onPress={() => setVisible(false)}
      />
      <ContainerCoupons>
        {coupons.map((coupon: Coupon) => (
          <CardCupom
            key={coupon.id}
            coupon={coupon}
            checked={checked}
            setChecked={setCkecked}
            selectedCoupon={couponSelected}
            setSelectedCoupon={setCouponSelected}
          />
        ))}
      </ContainerCoupons>
    </ModalFrame>
  );
}
