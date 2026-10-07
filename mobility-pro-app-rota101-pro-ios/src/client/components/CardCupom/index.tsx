import {View} from 'react-native';
import {useEffect, useState} from 'react';
import {
  ContainerCard,
  ContainerTag,
  Content,
  CupomData,
  PriceCupon,
  Image,
} from './styles';
import Coupom from '../../assets/images/coupon.png';
import {CheckBox} from '../CheckBox';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {Coupon} from '../../modules/mobility/pages/CouponTripContent';
import {useTrip} from '../../contexts/Trip';
import Helper from '../../utils/Helper';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';

interface Props {
  coupon: Coupon;
  selectedCoupon: any;
  setSelectedCoupon: any;
  checked: boolean;
  setChecked: any;
}

export const CardCupom = ({
  coupon,
  selectedCoupon,
  setSelectedCoupon,
  checked,
  setChecked,
}: Props) => {
  const {stateTripCustomer} = useTrip();
  const {selectedOptionTravel, selectedPaymentMethod} = stateTripCustomer;
  const [disabled, setDisabled] = useState(false);
  const {cityConfig} = useAuth();

  function calculateDiscountByCoupon(price, coupon) {
    let discount = 0;
    if (coupon.valueType === '%') {
      discount = price * (parseFloat(coupon.value) / 100);
      if (discount > parseFloat(coupon.maxDiscountValue))
        discount = parseFloat(coupon.maxDiscountValue);
    } else {
      discount = coupon.value;
    }

    if (discount >= parseFloat(coupon.limitedTo))
      discount = parseFloat(coupon.limitedTo);

    const newValue = price - discount;

    if (newValue <= 0) return 0;

    return newValue;
  }

  useEffect(() => {
    if (
      // @ts-ignore
      parseFloat(selectedOptionTravel.price) <= parseFloat(coupon.fromValue) ||
      // @ts-ignore
      parseFloat(selectedOptionTravel.price) >= parseFloat(coupon.limitedTo) ||
      (coupon.tripPaymentForm &&
        coupon.tripPaymentForm !== selectedPaymentMethod.name)
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [coupon, selectedOptionTravel]);

  return (
    <ContainerCard
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => {
        if (selectedCoupon?.id == coupon?.id) {
          setChecked(false);
          return setSelectedCoupon({});
        }
        setSelectedCoupon(coupon);
        setChecked(true);
      }}
    >
      <View pointerEvents={disabled ? 'box-only' : 'none'}>
        <CheckBox
          checked={checked && selectedCoupon?.id == coupon?.id}
          onCheck={() => {
            setSelectedCoupon(coupon);
          }}
        />
      </View>

      <Content disabled={disabled}>
        <CupomData>
          <ContainerTag>
            <Image source={Coupom} />
            <TextEdit size="small" color={theme.colors.background_global}>
              {coupon?.code}
            </TextEdit>
          </ContainerTag>
          <TextEdit size="small" color={theme.colors.background_global}>
            {translate('coupon.valid_for_amounts_from')}{' '}
            {cityConfig?.typeMoney + coupon?.fromValue} até{' '}
            {cityConfig?.typeMoney + coupon?.limitedTo}
          </TextEdit>
          <TextEdit size="small" color={theme.colors.background_global}>
            {translate('coupon.coupon_value')}{' '}
            {`${String(coupon?.valueType)} ${coupon?.value}`}
          </TextEdit>
          <TextEdit size="small" color={theme.colors.background_global}>
            {translate('coupon.valid_for_races_in')}{' '}
            {coupon?.tripPaymentForm ?? coupon?.gender}
          </TextEdit>
        </CupomData>
        <PriceCupon>
          {cityConfig?.typeMoney +
            Helper.maskMoney(
              calculateDiscountByCoupon(
                // @ts-ignore
                parseFloat(selectedOptionTravel?.price),
                coupon,
              ),
            )}
        </PriceCupon>
      </Content>
    </ContainerCard>
  );
};
