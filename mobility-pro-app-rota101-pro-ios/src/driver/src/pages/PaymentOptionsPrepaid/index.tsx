import {useCallback, useEffect, useState} from 'react';
import DeleteIcon from '@expo/vector-icons/Feather';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Text, TouchableOpacity} from 'react-native';
import {translate} from '../../../../client/locales';
import ModalFrame from '../../components/form/ModalFrame';
import {usePaymentForm} from '../../context/paymentForms';
import Card1 from '../../assets/images/card.png';
import {
  Button,
  ButtonExclused,
  ButtonPrePaid,
  CardContent,
  CardPaymentForm,
  CardName,
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
import theme from '../../styles/theme';
import {customToast} from '../../../../utils/FlashMessage';
import AddCard from '../../components/AddCard';
import Preload from '../../components/Preload';
import {CreditCard} from '../../context/paymentForms/types';
import {usePrepaid} from '../../context/prepaid';
import {PaymentPrepaidProps, PaymentProps} from '../../context/prepaid/types';

export function PaymentOptionsPrepaid({route}) {
  const {goBack}: NavigationProp<ParamListBase> = useNavigation();
  const {prepaid} = route.params;
  const [loading, setLoading] = useState(false);
  const [listCard, setListCard] = useState([]);
  const [cardSelected, setCardSelected] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [dialogPayment, setDialogPayment] = useState(false);
  const [modalDeposit, setModalDeposit] = useState(false);
  const [modalVirtualPayment, setModalVirtualPayment] = useState(false);
  const [modeSelected, setModeSelected] = useState({} as PaymentProps);
  const {getCards, removeCard} = usePaymentForm();
  const {paymentPrepaid} = usePrepaid();

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
    setModalVirtualPayment(false);
    setModalDeposit(false);
    setLoading(false);

    goBack();
  };

  useEffect(() => {
    listCards();
  }, []);

  const showModalPayment = async (item: PaymentProps) => {
    setModeSelected(item);

    if (item.automaticPayment === '1') {
      return setModalVirtualPayment(true);
    }

    return setModalDeposit(true);
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
        visible={modalVirtualPayment}
        setVisible={setModalVirtualPayment}
        onPressConfirm={() => payPrepaidCreditCard()}
        error={false}
        title={translate('paymentDriver.title_select_card')}
        textError=""
        hideConfirm={listCard.length === 0 ? true:false}
        onClose={() => {
          setModalDeposit(false);
        }}
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
        {listCard.length === 0 ? <CardName>{translate('paymentDriver.text_card_no_exists')}</CardName>:null}
          <Button 
          style={{
            alignSelf:listCard.length === 0 ? "center":"flex-end",
            width:listCard.length === 0 ? "100%":"auto",
          }}
            onPress={() =>
              listCard.length > 4
                ? customToast(
                    translate('paymentDriver.text_max_card_recorded'),
                    'warning',
                  )
                : setShowCardModal(true)
            }
          >
            <TextButton>{translate('paymentDriver.text_add')}</TextButton>
          </Button>
        </ContentButton>
      </ModalFrame>

      <AddCard
        updateList={listCards}
        visible={showCardModal}
        setVisible={setShowCardModal}
        listCard={listCard}
      />
    </Container>
  );
}
