import {useEffect, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
import {CardCupom} from '../../../../components/CardCupom';
import {BottomSheetModal} from '../../../../components/BottomSheetModal';
import {translate} from '../../../../locales';
import theme from '../../../../styles/theme';
import {useTrip} from '../../../../contexts/Trip';
import {
  BackButton,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ContainerCoupons,
  ContentButton,
  HeaderRow,
  HeaderSpacer,
  Subtitle,
  Title,
} from './styles';
import {Coupon, CouponTripContentProps} from './types';

/**
 * Bottom sheet de seleção de cupom pra corrida. Chrome vem do BottomSheetModal
 * (padrão já usado em ModalCancellationReason/DeleteAccountModal); a regra de
 * desconto/validade de cada item fica isolada no CardCupom.
 */
export default function CouponTripContent({
  coupons,
  selectedCoupon,
  visible,
  setVisible,
}: CouponTripContentProps) {
  const [couponSelected, setCouponSelected] = useState({} as Coupon);
  const [checked, setChecked] = useState(false);

  const {dispatchTripCustomer} = useTrip();

  useEffect(() => {
    setCouponSelected(selectedCoupon);
  }, [selectedCoupon]);

  const handleClose = () => setVisible(false);

  const handleConfirm = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedCoupon',
      arg: couponSelected,
    });
    setVisible(false);
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <HeaderRow>
        <BackButton activeOpacity={0.7} onPress={handleClose}>
          <Ionicons name="arrow-back" size={RFValue(16)} color={theme.colors.secondary} />
        </BackButton>
        <Title>{translate('paymentPage.title_cuopon')}</Title>
        <HeaderSpacer />
      </HeaderRow>

      <Subtitle>{translate('paymentPage.text_select_coupon_subtitle')}</Subtitle>

      <ContainerCoupons showsVerticalScrollIndicator={false}>
        {coupons.map((coupon: Coupon) => (
          <CardCupom
            key={coupon.id}
            coupon={coupon}
            checked={checked}
            setChecked={setChecked}
            selectedCoupon={couponSelected}
            setSelectedCoupon={setCouponSelected}
          />
        ))}
      </ContainerCoupons>

      <ContentButton>
        <CancelButton activeOpacity={0.7} onPress={handleClose}>
          <CancelButtonText>{translate('buttonModal.cancel')}</CancelButtonText>
        </CancelButton>
        <ConfirmButton activeOpacity={0.7} onPress={handleConfirm}>
          <ConfirmButtonText>{translate('buttonModal.confirm')}</ConfirmButtonText>
        </ConfirmButton>
      </ContentButton>
    </BottomSheetModal>
  );
}
