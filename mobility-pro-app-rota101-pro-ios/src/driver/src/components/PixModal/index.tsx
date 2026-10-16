import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Text,
  Clipboard,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AdquirerConstants } from '../../../constants/AdquirerConstants';
import { BankService } from '../../context/bank/service';
import { PaymentConstants } from '../../../constants/Payment';
import { customToast } from '../../../../utils/FlashMessage';
import { Ionicons } from '@expo/vector-icons';
import {
  InfoText,
  InputMask,
  ModalBackground,
  ModalContainer,
  Title,
} from './styles';
import {
  CodeContainer,
  TextQrCode,
} from '../../../../client/components/PixPayment/styles';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import { IfLoaderInsideScreen } from '../IfLoaderInsideScreen';
import { useAuth } from '../../../../context/auth';
import { translate } from '../../../../client/locales';

export const PixModal = ({
  visible,
  onClose,
  balance,
  getRequestDrivertTransactions,
}) => {
  const { cityConfig } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [amount, setAmount] = useState(0);
  const [inputAmount, setInputAmount] = useState(
    String(Number(balance?.balance * -1).toFixed(2)),
  );
  const [minimumValue, setMinimumValue] = useState(10)

  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const service = BankService();
  const timeoutVerifyPaymentRef = useRef(null);
  const { generalSettings } = useAuth();

  const verifyAdquirent = idAdquirent => {
    return idAdquirent === AdquirerConstants.ADQUIRER.ID_704_PAY;
  };

  const generateQrcode = pixData => {
    setQrCode(pixData);
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const verifyPaymentPixCode = (idTransaction: string) => {
    service.verifyPaymentPixCode(idTransaction).then((response) => {
      if (!response?.status) {
        customToast(response?.message, 'danger');
        return;
      }
      const { data } = response;

      const transactionStatusId = Number(data?.transactionStatusId || 0);

      if (transactionStatusId === PaymentConstants.PAYMENT_STATUS.PAID) {
        setTimeout(getRequestDrivertTransactions, 2000);

        customToast(translate('pix.text_payment_success'), 'success');
        onClose();
      }
    });
  };

  const mountPixCode = priceToPay => {
    setLoading(true);

    service.generatePixCode(priceToPay).then(data => {
      if (!data?.status) {
        customToast(data?.message, 'warning');
        onClose();
        setLoading(false);
        return;
      }
      data = data?.data;
      setLoading(false);
      setAmount(Number(priceToPay));
      generateQrcode(
        data?.pixData?.qrCodeContent ||
        data?.pixData?.pix_payment?.qrCodeContent,
      );
      let seconds = 300;
      setTimeLeft(seconds);

      const timeOutVerifyPayment = setInterval(() => {
        verifyPaymentPixCode(data?.idTransaction);
      }, 5000);

      timeoutVerifyPaymentRef.current = timeOutVerifyPayment;

      const intervalCount = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timeOutVerifyPayment);
            if (timeoutVerifyPaymentRef.current) {
              clearInterval(timeoutVerifyPaymentRef.current);
            }
            clearInterval(intervalCount);
            customToast(translate('pix.text_expired'), 'error');
            onClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timeOutVerifyPayment);
        clearInterval(intervalCount);
      };
    });
  };

  const initPixPayment = () => {
    if (
      Number(balance?.balance) < 0 &&
      verifyAdquirent(AdquirerConstants.ADQUIRER.ID_704_PAY)
    ) {
      const numericInputAmount = Number(inputAmount.replace(/\D/g, '')) / 100;
      if (Number(numericInputAmount) >= Number(balance?.balance * -1)) {
        mountPixCode(Number(numericInputAmount) < minimumValue ? minimumValue : numericInputAmount);
        setStep(2);
      } else {
        customToast(
          translate('pix.text_minimum_value', {
            currency: cityConfig?.typeMoney,
            value: balance?.balance * -1 < minimumValue ? minimumValue : balance?.balance * -1,
          }),
          'warning',
        );
      }
    }
  };

  const getMinumumValue = () => {
    const key = generalSettings?.find((item) => item.key == "minimum_value_for_pix"
    )

    console.log(key)

    if (key) setMinimumValue(Number(key.value) || 10)
  }


  useEffect(() => {
    getMinumumValue()
    return () => {
      if (timeoutVerifyPaymentRef.current) {
        clearInterval(timeoutVerifyPaymentRef.current);
      }
    };
  }, []);

  const copyToClipboard = async key => {
    await Clipboard.setString(key);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ModalBackground>
        <ModalContainer>
          <Title>{translate('account_driver_modal.pix')?.toUpperCase()}</Title>
          {step === 1 && (
            <View>
              <Text style={{ fontWeight: 'bold' }}>{translate('orderProducts.text_observation')}:</Text>
              <Text style={{ marginBottom: 10 }}>
                {translate('account_driver_modal.minimum_value_for').replace("{value}", cityConfig?.typeMoney + String(minimumValue))}
              </Text>
              <InputMask
                value={inputAmount}
                type={'money'}
                options={{
                  unit: cityConfig?.typeMoney,
                }}
                onChangeText={setInputAmount}
                placeholder={`${cityConfig?.typeMoney} ${Number(
                  balance?.balance * -1,
                ).toFixed(2)}`}
              />
              <TouchableOpacity
                onPress={initPixPayment}
                style={{
                  marginTop: 10,
                  backgroundColor: theme.colors.primary,
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: theme.colors.primaryText }}>
                  Gerar Pagamento PIX
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {step === 2 && (
            <IfLoaderInsideScreen loading={loading}>
              {qrCode && <QRCode value={qrCode} size={200} />}
              <InfoText>
                {translate('callTrip.text_price')}:{' '}
                {cityConfig?.typeMoney + ' '}
                {amount?.toFixed(2)}
              </InfoText>
              <InfoText>
                {translate('statusTrip.title_time_exceeded')?.split(' ')?.[0]}:{' '}
                {formatTime(timeLeft)}
              </InfoText>
              <CodeContainer
                activeOpacity={0.8}
                onPress={() => {
                  copyToClipboard(qrCode);
                }}
              >
                <TextQrCode numberOfLines={1}>{qrCode}</TextQrCode>

                <Ionicons
                  name="copy"
                  size={RFValue(20)}
                  color={theme.colors.primary}
                />
              </CodeContainer>
            </IfLoaderInsideScreen>
          )}
          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 10,
              backgroundColor: theme.colors.red,
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: theme.colors.primaryText }}>
              {translate('tripPreAccepted.text_close')}
            </Text>
          </TouchableOpacity>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};
