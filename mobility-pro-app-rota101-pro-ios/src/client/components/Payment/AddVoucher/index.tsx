import {FC, useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Platform, ScrollView, View} from 'react-native';
import {Entypo} from '@expo/vector-icons';
import ModalFrame from '../../form/Modal';
import {
  ContainerCard,
  Content,
  ContentButton,
  ContentSelectCard,
  SubTitle,
  Title,
} from './styles';
import Helper from '../../../utils/Helper';
import {getCoinType} from '../../../utils/money';
import Preload from '../../Preload';
import {translate} from '../../../locales';
import {usePaymentForm} from '../../../contexts/paymentForms';
import theme from '../../../styles/theme';
import {If} from '../../If';
import {TextEdit} from '../../TextEdit';
import {CardCart} from '../../CardCart';

interface VoucherSelected {
  amount: string;
  cityId: string;
  id: string;
  percentage: string;
  user: string;
  value: string;
}

interface ArrayCard extends Array<ListCard> {}

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

const AddVoucher: FC<Props> = ({
  visible,
  setVisible,
  updateList,
  listCard,
  voucherSelected,
}) => {
  const TYPE_CARD = 1;
  const [cardSelected, setCardSelected] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [visibleSecondModal, setVisibleSecondModal] = useState(false);

  const {addVoucher} = usePaymentForm();

  const {reset} = useForm();

  useEffect(() => {
    if (listCard.length > 0) {
      setCardSelected(listCard[0].idCard);
    }
  }, [listCard]);

  const insertVoucher = useCallback(async () => {
    if (Platform.OS === 'ios') {
      setVisible(false);
    } else {
      setLoading(true);
    }

    const response = {
      amount: voucherSelected?.amount,
      paymentFormId: TYPE_CARD,
      value: voucherSelected?.value,
      cardId: cardSelected,
      mpToken: null,
    };

    await addVoucher(response);
    setLoading(false);
    updateList();
    setVisible(false);
  }, [addVoucher, cardSelected, updateList, voucherSelected]);

  const findCartByIdCard = (idCard: string) => {
    const cardResponse = listCard.find((item: any) => item.idCard === idCard);
    return cardResponse && cardResponse.number.substr(-4);
  };

  return (
    <>
      <Preload visible={loading} />
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        onPressConfirm={!visibleSecondModal ? insertVoucher : null}
        hideConfirm={visibleSecondModal}
        error={false}
        textError=""
        onClose={() => {
          if (visibleSecondModal) {
            return setVisibleSecondModal(false);
          }
          setVisible(false);
          reset();
        }}
      >
        <Content>
          <If condition={!visibleSecondModal}>
            <View>
              <SubTitle>{translate('paymentPage.title_balance')}</SubTitle>
              <Title>
                {getCoinType()}
                {Helper.maskMoney(Number(voucherSelected?.value))}
              </Title>
            </View>

            <ContentSelectCard>
              <ContentButton
                mode="text"
                onPress={() => setVisibleSecondModal(true)}
              >
                <TextEdit color={theme.colors.primary} size="small">
                  {translate('paymentPage.text_payment_methods')}
                </TextEdit>
                <Entypo name="select-arrows" color={theme.colors.primary} />
              </ContentButton>
              <View
                style={{
                  alignItems: 'center',
                }}
              >
                <TextEdit color={theme.colors.primary} size="small">
                  ****{findCartByIdCard(cardSelected)}
                </TextEdit>
              </View>
            </ContentSelectCard>
          </If>
          <If condition={visibleSecondModal}>
            <ContainerCard>
              <TextEdit>
                {translate('paymentPage.text_payment_methods')}
              </TextEdit>
              <ScrollView
                style={{
                  marginVertical: 10,
                }}
              >
                {listCard.map((item: any) => {
                  return (
                    <CardCart
                      key={item.idCard}
                      card={item}
                      setVisibleSecondModal={setVisibleSecondModal}
                      selectedCard={cardSelected}
                      setCardSelected={setCardSelected}
                    />
                  );
                })}
              </ScrollView>
            </ContainerCard>
          </If>
        </Content>
      </ModalFrame>
    </>
  );
};

export default AddVoucher;
