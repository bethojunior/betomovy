import {useEffect, useState} from 'react';
import {ContainerCard, PaymentFormCaption} from './styles';
import {CouponCard} from './CouponCard';
import {CouponImage} from './CouponImage';
import {CouponStub} from './CouponStub';
import {CouponInfo} from './CouponInfo';
import {CouponDiscountBadge} from './CouponDiscountBadge';
import {CouponDetails} from './CouponDetails';
import {CouponPrice} from './CouponPrice';
import {CouponValidity} from './CouponValidity';
import Coupom from '../../assets/images/coupon.png';
import {useTrip} from '../../contexts/Trip';
import Helper from '../../utils/Helper';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
import {
  buildCouponDetailItems,
  formatDateEnd,
  isCouponDisabled,
  isDisabledByPaymentForm,
  resolveDiscountLabel,
  resolveFinalPrice,
} from './couponFormatters';
import {Coupon} from '../../modules/mobility/pages/CouponTripContent/types';
import {CardCupomProps} from './types';

/**
 * Item selecionável de cupom, com aparência de ticket (canhoto destacável +
 * recortes semicirculares + divisória tracejada). Só orquestra estado/seleção
 * e monta os dados pros componentes visuais — cálculo de desconto e
 * formatação ficam em couponFormatters.ts, layout fica no CouponCard.
 */
export const CardCupom = ({
  coupon,
  selectedCoupon,
  setSelectedCoupon,
  checked,
  setChecked,
}: CardCupomProps) => {
  const {stateTripCustomer} = useTrip();
  const {selectedOptionTravel, selectedPaymentMethod} = stateTripCustomer;
  const [disabled, setDisabled] = useState(false);
  const {cityConfig} = useAuth();

  const isSelected = checked && selectedCoupon?.id == coupon?.id;

  // @ts-ignore
  const price = parseFloat(selectedOptionTravel?.price);
  const currency = cityConfig?.typeMoney ?? '';
  const finalPrice = `${currency}${Helper.maskMoney(resolveFinalPrice(price, coupon))}`;
  const discountLabel = resolveDiscountLabel(price, coupon, currency);
  const detailItems = buildCouponDetailItems(coupon, currency);
  const validUntilDate = formatDateEnd(coupon?.dateEnd);
  const disabledByPaymentForm = isDisabledByPaymentForm(coupon, selectedPaymentMethod?.name);

  useEffect(() => {
    // @ts-ignore
    setDisabled(isCouponDisabled(parseFloat(selectedOptionTravel.price), coupon, selectedPaymentMethod?.name));
  }, [coupon, selectedOptionTravel]);

  const detailsSlot = (
    <>
      <CouponDetails items={detailItems} />
      {disabledByPaymentForm && (
        <PaymentFormCaption>
          {translate('coupon.valid_only_for_payment')}
          {coupon.tripPaymentForm}
        </PaymentFormCaption>
      )}
    </>
  );

  return (
    <ContainerCard
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => {
        if (selectedCoupon?.id == coupon?.id) {
          setChecked(false);
          return setSelectedCoupon({} as Coupon);
        }
        setSelectedCoupon(coupon);
        setChecked(true);
      }}
    >
      <CouponCard
        disabled={disabled}
        selected={isSelected}
        stub={<CouponStub image={<CouponImage source={Coupom} />} code={coupon?.code} />}
        code={<CouponInfo code={coupon?.code} />}
        price={<CouponPrice price={finalPrice} />}
        discountBadge={<CouponDiscountBadge label={discountLabel} />}
        details={detailsSlot}
        validity={<CouponValidity date={validUntilDate} />}
      />
    </ContainerCard>
  );
};
