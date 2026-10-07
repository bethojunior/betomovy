import { FC, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { translate } from '../../../locales';
import Helper from '../../../utils/Helper';
import { getCoinType } from '../../../utils/money';
import { CardCart } from '../../CardCart';
import { CardPix } from '../../CardPix';
import ModalFrame from '../../form/Modal';
import {
  Content,
  PaymentMethodLabel,
  SubTitle,
  Title,
} from './styles';

interface VoucherSelected {
  amount: string;
  cityId: string;
  id: string;
  percentage: string;
  user: string;
  value: string;
}

interface ArrayCard extends Array<ListCard> { }

interface ListCard {
  birthDate: string;
  cardholderName: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
  holderDocument: string;
  idCard: string;
  number: string;
  userId: string;
}

interface Props {
  visible: boolean;
  setVisible(boolean: boolean): void;
  updateList: () => void;
  listCard: ArrayCard;
  voucherSelected: VoucherSelected | undefined;
}

const TYPE_CARD = 1;
const TYPE_PIX = 4;

const AddVoucher: FC<Props> = ({
  visible,
  setVisible,
  updateList,
  listCard,
  voucherSelected,
}) => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const [cardSelected, setCardSelected] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(TYPE_CARD);

  useEffect(() => {
    if (!visible) return;

    if (listCard.length > 0) {
      setCardSelected(listCard[0].idCard);
      setSelectedPaymentMethod(TYPE_CARD);
    } else {
      setCardSelected('');
      setSelectedPaymentMethod(TYPE_PIX);
    }
  }, [listCard, visible]);

  const clearSelected = () => {
    setCardSelected('');
    setSelectedPaymentMethod(TYPE_CARD);
  }

  const handleClose = () => {
    setVisible(false);
    clearSelected();
    // updateList();
  };

  const handleSetCardSelected = (idCard: string) => {
    setCardSelected(idCard);
    setSelectedPaymentMethod(TYPE_CARD);
  };

  const handleConfirm = () => {
    setVisible(false);
    clearSelected();
    navigate('VoucherPayment', {
      voucherSelected,
      selectedPaymentMethod,
      cardId: selectedPaymentMethod === TYPE_CARD ? cardSelected : null,
    });
  };

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onPressConfirm={handleConfirm}
      hideConfirm={false}
      error={false}
      textError=""
      onClose={handleClose}
    >
      <Content>
        <SubTitle>{translate('paymentPage.title_balance')}</SubTitle>
        <Title>
          {getCoinType()}
          {Helper.maskMoney(Number(voucherSelected?.value))}
        </Title>

        <PaymentMethodLabel>
          {translate('paymentPage.text_payment_methods')}
        </PaymentMethodLabel>

        <ScrollView style={{ marginVertical: 8 }}>
          {listCard.map((item: any) => (
            <CardCart
              key={item.idCard}
              card={item}
              setVisibleSecondModal={() => {}}
              selectedCard={cardSelected}
              setCardSelected={handleSetCardSelected}
            />
          ))}
          <CardPix
            selected={selectedPaymentMethod === TYPE_PIX}
            onSelectPix={() => {
              setSelectedPaymentMethod(TYPE_PIX);
              setCardSelected('');
            }}
            setVisibleSecondModal={() => {}}
          />
        </ScrollView>
      </Content>
    </ModalFrame>
  );
};

export default AddVoucher;
