import {useEffect, useState} from 'react';
import {Clipboard, View, ActivityIndicator} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Ionicons} from '@expo/vector-icons';
import {
  Button,
  ButtonIcon,
  ButtonText,
  CodeContainer,
  Container,
  Header,
  HeaderText,
  TextQrCode,
} from './styles';
import theme from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {If} from '../If';
import {PixKeyProps, StatusPaymentProps} from './types';
import {StatusPayment} from './constants';

interface Props {
  callbackBackPage: () => void;
  price: number | string;
  confirmPixPayment: () => void;
}

export const PixPayment = ({
  callbackBackPage,
  price,
  confirmPixPayment,
}: Props) => {
  const [pixKey, setPixKey] = useState({} as PixKeyProps);
  const [paymentDone, setPaymentDone] = useState(false);
  const [statusPayment, setStatusPayment] = useState({} as StatusPaymentProps);
  const [itsLoadingPayment, setItsLoadingPayment] = useState(false);

  const handleConfirmPix = () => {
    confirmPixPayment();
  };

  const handleClick = () => {
    if (!paymentDone) {
      copyToClipboard();
      return;
    }

    handleConfirmPix();
  };

  const copyToClipboard = async () => {
    await Clipboard.setString(pixKey?.key);
    setItsLoadingPayment(true);
  };

  const getToPixKey = async () => {
    //example price = R$ 10,00

    setPixKey({
      ...pixKey,
      key: '123456789012345678901234567890123456789012341230981239712893719283719237189',
    });
    // const {data} = await apiMain.post('/pix-key', {
    //   value: Number(price.toString().replace('R$', '').replace(',', '.')) * 100,
    // });
    // if (!data?.status) {
    //   customToast(data?.message);
    //   return;
    // }
    // setPixKey(data?.data);
  };

  const checkPaymentStatus = async () => {
    // TODO - Chamar a API para verificar o status do pagamento
    return new Promise(resolve => {
      setStatusPayment({status: 1});
      resolve(2);
    });
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await checkPaymentStatus();
      if (status === StatusPayment.PENDING) {
        setStatusPayment({status: StatusPayment.PENDING});
      }

      if (status === 2) {
        setItsLoadingPayment(false);
        setPaymentDone(true);
        clearInterval(interval);
        setStatusPayment({status: StatusPayment.PAID});
      }

      if (status === 3) {
        setStatusPayment({status: StatusPayment.EXPIRED});
      }
    }, 5000); // verifica o status a cada 5 segundos

    return () => clearInterval(interval); // limpa o interval se o componente for desmontado
  }, []);

  useEffect(() => {
    getToPixKey();
  }, []);

  return (
    <Container>
      <Header>
        <ButtonIcon onPress={callbackBackPage}>
          <Ionicons
            name="arrow-back"
            size={RFValue(22)}
            color={theme.colors.primary}
            style={{
              marginRight: RFValue(10),
            }}
          />
          <HeaderText>Pagamento via PIX</HeaderText>
        </ButtonIcon>
      </Header>
      {/* <HeaderText>{price || '0'}</HeaderText> */}
      <QRCode value={pixKey?.key} size={RFValue(200)} />
      <CodeContainer
        activeOpacity={0.8}
        onPress={() => {
          copyToClipboard();
        }}
      >
        <TextQrCode numberOfLines={1}>{pixKey?.key}</TextQrCode>

        <Ionicons name="copy" size={RFValue(20)} color={theme.colors.primary} />
      </CodeContainer>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Button
          style={{
            backgroundColor: theme.colors.primaryText,
          }}
          onPress={callbackBackPage}
        >
          <ButtonText
            style={{
              color: theme.colors.primary,
            }}
          >
            Cancelar
          </ButtonText>
        </Button>

        <Button onPress={handleClick} disabled={itsLoadingPayment}>
          <If
            condition={itsLoadingPayment}
            conditionElse={
              <ButtonText>
                {paymentDone ? 'Continuar' : 'Copiar código'}
              </ButtonText>
            }
          >
            <ButtonText>Aguardando</ButtonText>
            <ActivityIndicator
              style={{
                marginLeft: 5,
              }}
              size="small"
              color={theme.colors.primaryText}
            />
          </If>
        </Button>
      </View>
    </Container>
  );
};
