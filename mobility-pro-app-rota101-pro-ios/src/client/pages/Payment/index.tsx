import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DeleteIcon from '@expo/vector-icons/Feather';
import Helper from '../../utils/Helper.js';
import {
  Button,
  Title,
  CardPaymentForm,
  Icon,
  TextPaymentType,
  Content,
  IconPercentage,
  CardVoucher,
  TextBuyVoucher,
  ContentVoucher,
  CardContent,
  TitleDeleteCard,
  ScrollContent,
  SimpleText,
  VoucherSectionContainer,
} from './styles';
import { getCoinType } from '../../utils/money';
import Card1 from '../../assets/images/card.png';
import Preload from '../../components/Preload';
import AddCard from '../../components/Payment/AddCard';
import { translate } from '../../locales';
import ModalFrame from '../../components/form/Modal';
import AddVoucher from '../../components/Payment/AddVoucher';
import { PaymentFormService } from '../../contexts/paymentForms/services';
import { usePaymentForm } from '../../contexts/paymentForms';
import { useLocal } from '../../contexts/local';
import theme from '../../styles/theme';
import { customToast } from '../../../utils/FlashMessage';

interface VoucherSelected {
  amount: string;
  cityId: string;
  id: string;
  percentage: string;
  user: string;
  value: string;
}
interface listCard {
  idCard: string;
  number: string;
}

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [listCard, setListCard] = useState<any>([]);
  const [currentSald, setCurrentSald] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cardSelected, setCardSelected] = useState('');
  const [listVoucher, setListVoucher] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState<VoucherSelected>();

  const [showCardModal, setShowCardModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);

  const { position } = useLocal();

  const { getCards, getCurrentBalanceVoucher, removeCard } =
    usePaymentForm();

  const loadData = useCallback(() => {
    Promise.all([
      PaymentFormService.listCard(),
      PaymentFormService.listVoucher(position.latitude?.toString(), position?.longitude?.toString()),
      PaymentFormService.getCurrentSaldVoucher(),
    ]).then((values: any) => {
      setLoading(false);

      const responseCard = values[0]?.data;
      const responseVoucher = values[1]?.data;
      const responseCustomer = values[2]?.data;

      if (responseCard?.status && responseCard?.data) {
        setListCard(responseCard.data);
      }
      if (responseVoucher?.status && responseVoucher?.data) {
        setListVoucher(responseVoucher.data);
      }
      if (responseCustomer?.status && responseCustomer?.data) {
        setCurrentSald(Number(responseCustomer.data.tripBalance || 0));
        setWalletBalance(Number(responseCustomer.data.balance || 0));
      }
    }).catch(() => {
      setLoading(false);
    });
  }, [position]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      getCurrentBalanceVoucher().then((data: any) => {
        if (data) {
          setCurrentSald(Number(data.tripBalance || 0));
          setWalletBalance(Number(data.balance || 0));
        }
      });
    }, [getCurrentBalanceVoucher])
  );

  const listCards = useCallback(async () => {
    setLoading(true);
    getCards().then((data: any) => {
      setListCard(data);
      setLoading(false);
    });
  }, [getCards]);

  const getCurrentSaldVoucher = useCallback(async () => {
    setLoading(true);
    await getCurrentBalanceVoucher().then((data: any) => {
      setLoading(false);
      if (data) {
        setCurrentSald(Number(data.tripBalance || 0));
        setWalletBalance(Number(data.balance || 0));
      }
    });
  }, [getCurrentBalanceVoucher]);

  const deleteCard = () => {
    setLoading(true);
    removeCard(cardSelected).then(() => {
      setVisibleDialog(false);
      setLoading(false);

      listCard.find((item: any) => {
        if (item.idCard === cardSelected) {
          listCard.splice(listCard.indexOf(item), 1);
          return setListCard([...listCard]);
        }
        return '';
      });
    });
  };

  return (
    <ScrollContent>
      <Preload visible={loading} />
      <Content>
        <View
          style={{
            borderBottomColor: theme.colors.secondary,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
          }}
        >
          <Title>{translate('paymentPage.title_card')}</Title>

          {listCard.length === 0 && !loading && (
            <SimpleText style={{ paddingVertical: 10 }}>
              {translate('paymentPage.text_no_card')}
            </SimpleText>
          )}

          {listCard.map((card: listCard) => {
            return (
              <CardContent
                key={card.idCard}
                onPress={() => {
                  setVisibleDialog(true);
                  setCardSelected(card.idCard);
                }}
              >
                <CardPaymentForm>
                  <Icon source={Card1} />
                  <TextPaymentType>
                    ****{card.number.substr(-4)}
                  </TextPaymentType>
                </CardPaymentForm>
                <DeleteIcon
                  name="x"
                  size={15}
                  color={theme.colors.secondary}
                  style={{ alignSelf: 'center', marginTop: 10 }}
                />
              </CardContent>
            );
          })}

          <Button
            title={translate('paymentPage.text_add_card')}
            onPress={() =>
              listCard.length > 4
                ? customToast(
                  translate('paymentPage.text_max_card_recorded'),
                  'warning',
                )
                : setShowCardModal(true)
            }
          />
        </View>
        <View>
          <VoucherSectionContainer>
            <Title>{translate('paymentPage.title_voucher')}</Title>

            <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'flex-end' }}>
              <CardPaymentForm
                style={{ flexDirection: 'column', alignItems: 'flex-end' }}
              >
                <SimpleText style={{ fontSize: 12 }}>
                  Saldo
                </SimpleText>
                <TextPaymentType>
                  {getCoinType()}{' '}
                  {walletBalance !== 0
                    ? Helper.maskMoney(Number(walletBalance))
                    : '0,00'}
                </TextPaymentType>
              </CardPaymentForm>

              <CardPaymentForm
                style={{ flexDirection: 'column', alignItems: 'flex-end' }}
              >
                <SimpleText style={{ fontSize: 12 }}>
                  Voucher
                </SimpleText>
                <TextPaymentType>
                  {getCoinType()}{' '}
                  {currentSald !== 0
                    ? Helper.maskMoney(Number(currentSald))
                    : '0,00'}
                </TextPaymentType>
              </CardPaymentForm>
            </View>
          </VoucherSectionContainer>

          {listVoucher.map((item: any) => {
            return (
              <CardVoucher
                key={item.id}
                onPress={() => {
                  setVoucherSelected(item);
                  setShowVoucherModal(true);
                }}
              >
                <ContentVoucher>
                  <IconPercentage>
                    -{parseInt(item.percentage, 10)}%
                  </IconPercentage>
                  <View>
                    <SimpleText>
                      {getCoinType()}
                      {Helper.maskMoney(Number(item.amount))}
                    </SimpleText>
                    <SimpleText style={{ fontSize: 12 }}>
                      {translate('paymentPage.text_pay')} {getCoinType()}
                      {Helper.maskMoney(Number(item.value))}{' '}
                    </SimpleText>
                    <SimpleText style={{ fontSize: 12 }}>
                      {translate('paymentPage.text_gain')} {getCoinType()}
                      {Helper.maskMoney(Number(item.amount))}
                    </SimpleText>
                  </View>
                </ContentVoucher>
                <TextBuyVoucher>
                  {translate('paymentPage.text_buy')}
                </TextBuyVoucher>
              </CardVoucher>
            );
          })}
        </View>

        <AddCard
          updateList={listCards}
          visible={showCardModal}
          setVisible={setShowCardModal}
          listCard={listCard}
        />
        <AddVoucher
          updateList={getCurrentSaldVoucher}
          visible={showVoucherModal}
          setVisible={setShowVoucherModal}
          listCard={listCard}
          voucherSelected={voucherSelected}
        />
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
            {translate('paymentPage.title_delete_card')}
          </TitleDeleteCard>
        </ModalFrame>
      </Content>
    </ScrollContent>
  );
};

export default PaymentPage;
