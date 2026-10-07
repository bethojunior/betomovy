import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clipboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import PixPaymentSection from '../../../components/PixPaymentSection';
import { customToast } from '../../../utils/FlashMessage';
import { usePaymentForm } from '../../contexts/paymentForms';
import { translate } from '../../locales';
import { AnimatedSource } from '../AppApresentation/constants';
import { maskMoneyIntl } from '../../utils/money';
import Preload from '../../components/Preload';
import {
  Container,
  ScrollContent,
  SuccessContainer,
  SuccessTitle,
  ConfirmButton,
  ConfirmButtonText,
  ConfirmSection,
  CardsWrapper,
  SummaryCard,
  VoucherLabel,
  VoucherValue,
  PaymentCard,
  PaymentCardTitle,
  PaymentMethodRow,
  PaymentMethodText,
} from './styles';

const TYPE_CARD = 1;
const TYPE_PIX = 4;
const COUNTDOWN_TIME = 300;

export function VoucherPayment() {
  const { goBack }: NavigationProp<ParamListBase> = useNavigation();
  const route = useRoute<RouteProp<any>>();

  const { voucherSelected, selectedPaymentMethod, cardId } = route.params;

  const [loading, setLoading] = useState(false);
  const [paymentDataPix, setPaymentDataPix] = useState<string | null>(null);
  const [voucherId, setVoucherId] = useState<number | null>(null);
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const verifyIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const { addVoucher, addVoucherByPix, verifyPaymentByPix } = usePaymentForm();

  useEffect(() => {
    if (selectedPaymentMethod === TYPE_PIX) {
      insertVoucherByPix();
    }
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (countdown === 0) {
      setPaymentDataPix(null);
      customToast(translate('paymentPage.payment_timeout'), 'warning');
      goBack();
    }
  }, [countdown]);

  useEffect(() => {
    return () => {
      clearInterval(countdownIntervalRef.current);
      clearInterval(verifyIntervalRef.current);
    };
  }, []);

  const insertVoucher = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    await addVoucher({
      amount: voucherSelected?.amount,
      paymentFormId: TYPE_CARD,
      value: voucherSelected?.value,
      cardId,
      mpToken: null,
    });

    setLoading(false);
    setPaymentConfirmed(true);

    setTimeout(() => {
      customToast(translate('paymentPage.success_buy_voucher'), 'success');
      goBack();
    }, 3000);

  }, [addVoucher, cardId, voucherSelected]);

  const insertVoucherByPix = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const response = {
      amount: voucherSelected?.amount,
      paymentFormId: TYPE_PIX,
      value: voucherSelected?.value,
    };

    // TODO: remover mock após testes
    // const result = {
    //   paymentDataCode: '00020101021226810014br.gov.bcb.pix2559qr.woovi.com/qr/v2/cob/91600f7d-340c-4f9f-b29e-f92f71f9f5c952040000530398654041.005802BR5908WEBPAGUE6009FORTALEZA6229052564703b437fc649ad86077eebf6304F2BC',
    //   voucherId: 203237,
    // };
    const result = await addVoucherByPix(response);

    setLoading(false);
    if (!result) return;

    const { paymentDataCode, voucherId } = result;
    setPaymentDataPix(paymentDataCode);
    setVoucherId(voucherId);
    setExpirationTime(new Date(new Date().getTime() + 10 * 60000));
    setCountdown(COUNTDOWN_TIME);
  }, [addVoucherByPix, voucherSelected]);

  useEffect(() => {
    if (paymentDataPix && expirationTime && voucherId) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      verifyIntervalRef.current = setInterval(async () => {
        // TODO: remover mock após testes
        // const result = { data: { status_detail: 'PENDENTE' } };
        const result = await verifyPaymentByPix({ voucher_id: Number(voucherId) });

        if (result?.data.status_detail === 'PAGO') {
          setPaymentConfirmed(true);
          clearInterval(verifyIntervalRef.current);
          clearInterval(countdownIntervalRef.current);

          setTimeout(() => {
            customToast(translate('paymentPage.success_buy_voucher'), 'success');
            goBack();
          }, 3000);
        }
      }, 3000);

      return () => {
        clearInterval(countdownIntervalRef.current);
        clearInterval(verifyIntervalRef.current);
      };
    }
  }, [paymentDataPix, expirationTime, voucherId]);

  const copyToClipboard = async (key: string) => {
    Clipboard.setString(key);

    if (Platform.OS === 'ios') {
      customToast(translate('paymentPage.pix_code_copied'), 'success');
    }
  };

  if (paymentConfirmed) {
    return (
      <Container>
        <SuccessContainer>
          <LottieView
            autoPlay
            style={{ width: 150, height: 150 }}
            source={AnimatedSource.VOUCHER.uri}
          />
          <SuccessTitle>Pagamento Confirmado</SuccessTitle>
        </SuccessContainer>
      </Container>
    );
  }

  if (selectedPaymentMethod === TYPE_PIX) {
    return (
      <Container>
        <ScrollContent>
          <PixPaymentSection
            pixCode={paymentDataPix}
            amount={maskMoneyIntl(voucherSelected?.value)}
            onCopy={() => copyToClipboard(paymentDataPix)}
            onClose={goBack}
            loading={loading}
          />
        </ScrollContent>
      </Container>
    );
  }

  return (
    <Container>
      <Preload visible={loading && selectedPaymentMethod === TYPE_CARD} type='spinner' />
      <ConfirmSection>
        <CardsWrapper>
          <SummaryCard>
            <VoucherLabel>{translate('paymentPage.title_balance')}</VoucherLabel>
            <VoucherValue>{maskMoneyIntl(voucherSelected?.value)}</VoucherValue>
          </SummaryCard>

          <PaymentCard>
            <PaymentCardTitle>{translate('paymentPage.text_payment_methods')}</PaymentCardTitle>
            <PaymentMethodRow>
              <Feather name="credit-card" size={22} color="#333" />
              <PaymentMethodText>{translate('paymentPage.title_card')}</PaymentMethodText>
            </PaymentMethodRow>
          </PaymentCard>
        </CardsWrapper>

        <ConfirmButton
          title={translate('paymentPage.text_buy')}
          onPress={insertVoucher}
        />
      </ConfirmSection>
    </Container>
  );
}
