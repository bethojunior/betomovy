// @ts-nocheck
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import DeleteIcon from '@expo/vector-icons/Feather';
// eslint-disable-next-line import/extensions
import Helper from '../../../utils/Helper.js';
import {
  Button,
  TextButton,
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
  ButtonBack,
  Header,
  TextHeader
} from './styles';
import {getCoinType} from '../../../utils/money';
import Preload from '../../../components/Preload';
import AddCard from '../../../components/Payment/AddCard';
import AddCoupom from '../../../components/Payment/AddCoupom';
import {translate} from '../../../locales';
import ModalFrame from '../../../components/form/Modal';
import AddVoucher from '../../../components/Payment/AddVoucher';
import {PaymentFormService} from '../../../contexts/paymentForms/services';
import {usePaymentForm} from '../../../contexts/paymentForms';
import {useLocal} from '../../../contexts/local';
import theme from '../../../styles/theme';
import {customToast} from '../../../../utils/FlashMessage';

import { useNavigation } from '@react-navigation/native';

import {Ionicons, FontAwesome} from '@expo/vector-icons';

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

interface listCoupon {
  code: string;
  value: string;
  tripPaymentForm: string;
  valueType: string;
  dateEnd: string;
  id: string;
}

const PaymentPageSpeedMob = () => {
  const [loading, setLoading] = useState(false);
  const [listCard, setListCard] = useState<any>([]);
  const [currentSald, setCurrentSald] = useState(0);
  const [coupon, setCoupon] = useState([]);
  const [cardSelected, setCardSelected] = useState('');
  const [listVoucher, setListVoucher] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState<VoucherSelected>();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [textEmptyCoupon, setTextEmptyCoupon] = useState(false);

  const {position} = useLocal();

  const navigation = useNavigation();

  const {getCards, getCoupons, getCurrentBalanceVoucher, removeCard} =
    usePaymentForm();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      PaymentFormService.listCard(),
      PaymentFormService.listCoupom(),
      PaymentFormService.listVoucher(position.latitude, position?.longitude),
      PaymentFormService.getCurrentSaldVoucher(),
    ]).then((values: any) => {
      setLoading(false);

      const {response} = values[0].request;
      if (!JSON.parse(response).status || !values[0].data.status) {
        return customToast(
          translate('paymentPage.text_error_load_info'),
          'danger',
        );
      }

      if (
        !values[0].data.status ||
        !values[1].data.status ||
        !values[2].data.status ||
        !values[3].data.status
      ) {
        return customToast(
          translate('paymentPage.text_error_load_info'),
          'danger',
        );
      }

      if (values[1].data.data.length === 0) {
        setTextEmptyCoupon(true);
      } else {
        setTextEmptyCoupon(false);
        setCoupon(values[1].data.data);
      }

      setListCard(values[0].data.data);
      setListVoucher(values[2].data.data);
      return setCurrentSald(values[3].data.data.tripBalance);
    });
  }, []);

  const listCards = useCallback(async () => {
    setLoading(true);
    getCards().then((data: any) => {
      setListCard(data);
      setLoading(false);
    });
  }, [getCards]);

  const listCoupons = () => {
    setLoading(true);
    getCoupons().then((data: any) => {
      setLoading(false);

      if (data.length === 0) {
        return setTextEmptyCoupon(true);
      }

      setTextEmptyCoupon(false);
      return setCoupon(data);
    });
  };

  const getCurrentSaldVoucher = useCallback(async () => {
    setLoading(true);
    await getCurrentBalanceVoucher().then((data: any) => {
      setLoading(false);
      setCurrentSald(data.tripBalance);
    });
  }, [getCurrentBalanceVoucher, currentSald]);

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
      <Header>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons name='arrow-back' size={30} color={theme.colors.background_global} />
        </ButtonBack>
        <TextHeader>
          {translate('paymentPage.title_payment_form')}
        </TextHeader>
      </Header>
      <Content>
        <View
          style={{
            borderBottomColor: theme.colors.secondary,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
          }}
        >
          <Title
            colorText={theme.colors.background_global}
            backgroundColor={theme.colors.primary}
          >
            {translate('paymentPage.title_payment_form')}
          </Title>
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
                  <Ionicons name="card-outline" color={theme.colors.black} size={30} />
                  <TextPaymentType>
                    ****{card.number.substr(-4)}
                  </TextPaymentType>
                </CardPaymentForm>
                <DeleteIcon
                  name="x"
                  size={15}
                  color={theme.colors.secondary}
                  style={{alignSelf: 'center', marginTop: 10}}
                />
              </CardContent>
            );
          })}
          <CardPaymentForm>
            <FontAwesome name="money" color={theme.colors.black} size={30} />
            <TextPaymentType>
              {translate('paymentPage.text_money')}
            </TextPaymentType>
          </CardPaymentForm>
          <Button
            backgroundColor={theme.colors.primary}
            onPress={() =>
              listCard.length > 4
                ? customToast(
                    translate('paymentPage.text_max_card_recorded'),
                    'warning',
                  )
                : setShowCardModal(true)
            }
          >
            <TextButton colorText={theme.colors.background_global}>
              {translate('paymentPage.text_add')}
            </TextButton>
          </Button>
        </View>
        <View
          style={{
            borderBottomColor: theme.colors.secondary,
            borderBottomWidth: 0.5,
            paddingBottom: 10,
          }}
        >
          <Title
            colorText={theme.colors.background_global}
            backgroundColor={theme.colors.primary}
          >
            {translate('paymentPage.title_cuopon')}
          </Title>
          {textEmptyCoupon && (
            <SimpleText style={{padding: 10}}>
              {translate('paymentPage.text_no_coupon')}
            </SimpleText>
          )}
          {coupon.map((item: listCoupon) => {
            return (
              <CardPaymentForm key={item.id}>
                <FontAwesome name="ticket" size={30} color={theme.colors.black}/>
                <TextPaymentType colorText={theme.colors.primary}>
                  {item.valueType === '%'
                    ? `-${item.value}${item.valueType} `
                    : `- ${item.valueType}${item.value} `}
                </TextPaymentType>
                <SimpleText
                  style={{
                    textTransform: 'lowercase',
                  }}
                >
                  {item.tripPaymentForm !== null
                    ? `${translate('paymentPage.text_coupon')} ${
                        item.tripPaymentForm
                      }`
                    : translate('paymentPage.text_all_type_payment')}
                </SimpleText>
              </CardPaymentForm>
            );
          })}
          <Button backgroundColor={theme.colors.primary}>
            <TextButton
              colorText={theme.colors.background_global}
              onPress={() => setShowCouponModal(true)}
            >
              {translate('paymentPage.text_add')}
            </TextButton>
          </Button>
        </View>
        <View>
          <Title
            colorText={theme.colors.background_global}
            backgroundColor={theme.colors.primary}
          >
            {translate('paymentPage.title_voucher')}
          </Title>
          <CardPaymentForm
            style={{alignSelf: 'center', flexDirection: 'column'}}
          >
            <SimpleText style={{fontSize: 20}}>
              {translate('paymentPage.text_current_balance')}
            </SimpleText>
            <TextPaymentType>
              {getCoinType()}{' '}
              {currentSald !== 0
                ? Helper.maskMoney(Number(currentSald))
                : '0,00'}
            </TextPaymentType>
          </CardPaymentForm>
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
                  <IconPercentage
                    colorText={theme.colors.background_global}
                    backgroundColor={theme.colors.primary}
                  >
                    -{parseInt(item.percentage, 10)}%
                  </IconPercentage>
                  <View>
                    <SimpleText>
                      {getCoinType()}
                      {Helper.maskMoney(Number(item.amount))}
                    </SimpleText>
                    <SimpleText style={{fontSize: 12}}>
                      {translate('paymentPage.text_pay')} {getCoinType()}
                      {Helper.maskMoney(Number(item.value))}{' '}
                      {translate('paymentPage.text_gain')} {getCoinType()}
                      {Helper.maskMoney(Number(item.amount))}
                    </SimpleText>
                  </View>
                </ContentVoucher>
                <TextBuyVoucher colorText={theme.colors.primary}>
                  {translate('paymentPage.text_buy')}
                </TextBuyVoucher>
              </CardVoucher>
            );
          })}
        </View>
        <AddCoupom
          visible={showCouponModal}
          setVisible={setShowCouponModal}
          updateList={listCoupons}
        />
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

export default PaymentPageSpeedMob;
