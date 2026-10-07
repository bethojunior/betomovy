import DeleteIcon from '@expo/vector-icons/Feather';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clipboard, Text } from 'react-native';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import Card1 from '../../assets/images/card.png';
import AddCard from '../../components/AddCard';
import ModalFrame from '../../components/form/ModalFrame';
import Preload from '../../components/Preload';
import { usePaymentForm } from '../../context/paymentForms';
import { CreditCard } from '../../context/paymentForms/types';
import { usePrepaid } from '../../context/prepaid';
import { useModal } from '../../hooks/useModal';
import { PaymentPrepaidProps, PaymentProps, PrepaidProps } from '../../context/prepaid/types';
import theme from '../../styles/theme';
import { maskMoneyIntl } from '../../utils/money';
import {
  AddCardButton,
  ButtonExclused,
  ButtonPrePaid,
  CardContent,
  CardName,
  CardPaymentForm,
  Container,
  ContentButton,
  Icon,
  ListFormsPaymentContent,
  ModalBody,
  MoreInfo,
  Name,
  TextButton,
  TextDebit,
  TextPaymentType,
  TitleDeleteCard,
} from './styles';
import PixPaymentSection from '../../../../components/PixPaymentSection';

const COUNTDOWN_INTERVAL = 300;


export function PaymentOptionsPrepaid({ route }) {
  const { goBack }: NavigationProp<ParamListBase> = useNavigation();
  const { prepaid }: { prepaid: PrepaidProps } = route.params;
  const [loading, setLoading] = useState(false);
  const [listCard, setListCard] = useState([]);
  const [cardSelected, setCardSelected] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const addCardModal = useModal();
  const [dialogPayment, setDialogPayment] = useState(false);
  const [modalDeposit, setModalDeposit] = useState(false);
  const virtualPaymentModal = useModal();
  const [modeSelected, setModeSelected] = useState({} as PaymentProps);
  const { getCards, removeCard } = usePaymentForm();
  const { paymentPrepaid, paymentPrepaidByPix, verifyPaymentByPix } = usePrepaid();
  const [dialogPixPayment, setDialogPixPayment] = useState(false);
  const [paymentDataPix, setPaymentDataPix] = useState<any>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_INTERVAL);
  const verifyIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);


  const handleCloseModal = () => {
    setPaymentDataPix(null);
    // setExpirationTime(null);
    setCountdown(COUNTDOWN_INTERVAL);
  };

  useEffect(() => {
    if (countdown === 0) {
      handleCloseModal();
      setDialogPixPayment(false);
      customToast(translate('prepaidDriver.payment_timeout'), 'warning');
    }
  }, [countdown]);

  const listCards = useCallback(async () => {
    setLoading(true);
    getCards().then((data: any) => {
      setListCard(data);
      setLoading(false);
    });
  }, [getCards]);

  const deleteCard = () => {
    setLoading(true);
    removeCard(cardSelected).then(() => {
      setVisibleDialog(false);
      setLoading(false);

      listCard.find((item: CreditCard) => {
        if (item.idCard === cardSelected) {
          listCard.splice(listCard.indexOf(item), 1);
          return setListCard([...listCard]);
        }
        return '';
      });
    });
  };

  const payPrepaidCreditCard = async () => {
    setLoading(true);

    const data: PaymentPrepaidProps = {
      creditPrepaidId: modeSelected.creditPrepaidId,
      paymentFormId: modeSelected.paymentFormId,
      cardId: modeSelected.automaticPayment === '1' ? cardSelected : null,
      mpToken: null,
    };

    await paymentPrepaid(data);
    virtualPaymentModal.close();
    setModalDeposit(false);
    setLoading(false);

    goBack();
  };

  const payPrepaidByPix = async (payment: PaymentProps) => {
    setLoading(true);

    const result = await paymentPrepaidByPix({
      creditPrepaidId: Number(payment?.creditPrepaidId || prepaid.id),
      paymentFormId: Number(payment.paymentFormId),
    });

    if (!result) {
      setLoading(false);
      return false;
    }

    const { paymentDataCode, prepaidId } = result;
    const currentPrepaidId = prepaidId;

    setPaymentDataPix(paymentDataCode);
    // setExpirationTime(new Date(new Date().getTime() + 10 * 60000));
    setCountdown(COUNTDOWN_INTERVAL);
    setLoading(false);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          clearInterval(verifyIntervalRef.current);
          customToast(translate('prepaidDriver.payment_timeout'), 'warning');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    verifyIntervalRef.current = setInterval(async () => {
      const verifyResult = await verifyPaymentByPix({ creditPrepaidPurchaseId: currentPrepaidId });
      if (
        verifyResult &&
        verifyResult.data.statusDetail === 'PAGO'
      ) {
        customToast(translate('prepaidDriver.payment_success'), 'success');
        clearInterval(verifyIntervalRef.current);
        clearInterval(countdownIntervalRef.current);
        goBack();
      }
    }, 15000);

    return true;
  };


  useEffect(() => {
    listCards();
    return () => {
      if (verifyIntervalRef.current) clearInterval(verifyIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const showModalPayment = async (item: PaymentProps) => {
    setModeSelected(item);

    if (item.paymentFormId === '4') {
      const success = await payPrepaidByPix(item);
      if (success) {
        setDialogPixPayment(true);
      }
      return;
    }

    if (item.automaticPayment === '1') {
      return virtualPaymentModal.open();
    }

    return setModalDeposit(true);
  };

  const copyToClipboard = async key => {
    await Clipboard.setString(key);
  };

  const openAddCardModal = () => {
    if (listCard.length > 4) {
      customToast(translate('paymentDriver.text_max_card_recorded'), 'warning');
      return;
    }

    virtualPaymentModal.handOff(() => addCardModal.open());
  };

  return (
    <Container>
      <Preload visible={loading} />

      <ListFormsPaymentContent>
        {prepaid.paymentForms.map(item => {
          return (
            <ButtonPrePaid
              key={item.id}
              activeOpacity={0.8}
              onPress={() => {
                showModalPayment(item);
              }}
            >
              <Name>{item.name}</Name>
            </ButtonPrePaid>
          );
        })}
      </ListFormsPaymentContent>

      <ModalFrame
        visible={visibleDialog}
        setVisible={setVisibleDialog}
        onPressConfirm={deleteCard}
        error={false}
        textError=""
        onClose={() => {
          setVisibleDialog(false);
        }}
      >
        <TitleDeleteCard>
          {translate('paymentDriver.title_delete_card')}
        </TitleDeleteCard>
      </ModalFrame>

      <ModalFrame
        visible={dialogPayment}
        setVisible={setDialogPayment}
        onPressConfirm={() => payPrepaidCreditCard()}
        error={false}
        textError=""
        onClose={() => {
          setVisibleDialog(false);
        }}
      >
        <TitleDeleteCard>
          {translate('prepaidDriver.complete_payment')}
        </TitleDeleteCard>
      </ModalFrame>

      {/* MODAL DE DEPÓSITO */}
      <ModalFrame
        visible={modalDeposit}
        setVisible={setModalDeposit}
        error={false}
        textError=""
        onClose={() => {
          setModalDeposit(false);
        }}
        onPressConfirm={() => {
          payPrepaidCreditCard();
        }}
      >
        <TitleDeleteCard>{modeSelected?.name}</TitleDeleteCard>

        <ModalBody>
          <Text>{translate('paymentDriver.subtitle_debit')}</Text>
          <MoreInfo>{prepaid.accountInformation}</MoreInfo>
          <TextDebit>{translate('paymentDriver.text_debit')}</TextDebit>
        </ModalBody>
      </ModalFrame>

      {/* MODAL DE COMPRA VIA CARTÃO */}
      <ModalFrame
        visible={virtualPaymentModal.visible}
        setVisible={virtualPaymentModal.setVisible}
        onPressConfirm={() => payPrepaidCreditCard()}
        error={false}
        title={translate('paymentDriver.title_select_card')}
        textError=""
        hideConfirm
        onClose={() => {
          setModalDeposit(false);
        }}
        onDismiss={virtualPaymentModal.onDismiss}
      >
        {listCard.map((card: CreditCard) => {
          return (
            <CardContent key={card.idCard}>
              <CardPaymentForm
                onPress={() => {
                  setDialogPayment(true);
                  setCardSelected(card.idCard);
                }}
              >
                <Icon source={Card1} />
                <TextPaymentType>****{card.number.substr(-4)}</TextPaymentType>
              </CardPaymentForm>
              <ButtonExclused
                onPress={() => {
                  setVisibleDialog(true);
                  setCardSelected(card.idCard);
                }}
              >
                <DeleteIcon name="x" size={15} color={theme.colors.secondary} />
              </ButtonExclused>
            </CardContent>
          );
        })}

        <ContentButton>
          {listCard.length === 0 ? <CardName>{translate('paymentDriver.text_card_no_exists')}</CardName> : null}
          <AddCardButton
            centered={listCard.length === 0}
            onPress={openAddCardModal}
          >
            <TextButton>{translate('paymentDriver.text_add')}</TextButton>
          </AddCardButton>
        </ContentButton>
      </ModalFrame>

      {/* MODAL DE PAGAMENTO VIA PIX */}
      <ModalFrame
        visible={dialogPixPayment}
        setVisible={setDialogPixPayment}
        error={false}
        hideConfirm={true}
        textError=""
        onClose={() => {
          setDialogPixPayment(false);
        }}
      >
        <ModalBody>
          <PixPaymentSection
            pixCode={paymentDataPix}
            amount={maskMoneyIntl(prepaid?.sellPrice)}
            noPixCodeText={translate('prepaidDriver.no_pix_code')}
            onCopy={() => copyToClipboard(paymentDataPix)}
            onClose={() => setDialogPixPayment(false)}
          />
        </ModalBody>
      </ModalFrame>

      <AddCard
        updateList={listCards}
        visible={addCardModal.visible}
        setVisible={addCardModal.close}
        listCard={listCard}
        onDismiss={() => virtualPaymentModal.open()}
      />
    </Container >
  );
}
