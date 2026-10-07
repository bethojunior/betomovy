/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-return-assign */
// @ts-nocheck

import {useCallback, useState, useEffect} from 'react';
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, LogBox, Text} from 'react-native';
import {Input} from 'react-native-elements';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';
import {
  ButtonOpenPaymentMethodModal,
  Container,
  ContainerDate,
  CurrencyType,
  Footer,
  FooterGL,
  Header,
  HeaderDialog,
  HeaderInfoButton,
  HeaderTitle,
  IconClock,
  NameLabel,
  OptionsList,
  OptionTravelItem,
  OptionTravelItemContent,
  PaymentMethodContainer,
  PaymentMethodSelected,
  RateImage,
  RatePriceLabel,
} from './styles';
import Helper from '../../../../utils/Helper';
import {ButtonSmall} from '../ButtonSmall';
import {If} from '../If';
import {convertDate, convertUSDate} from '../../../../utils/FormatDate';
import {ModalSchedule} from '../ModalSchedule';

import {customToast} from '../../../../../utils/FlashMessage';
import {ModalInfo} from '../ModalInfo';
import Preload from '../../../../components/Preload';
import {translate} from '../../../../locales';
import {usePaymentForm} from '../../../../contexts/paymentForms';
import ModalFrame from '../../../../components/form/Modal';
import {coinTypePerApi} from '../../../../utils/money';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';
import theme from '../../../../styles/theme';
import PaymentMethodModal from '../../../../components/PaymentMethodModalGL';
import {SvgUri} from 'react-native-svg';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';

let widthMax = Dimensions.get('window').width;

export default function TravelOptionsGL({hide}) {
  const {cityConfig, offerBiometry} = useAuth();
  const {
    prices,
    selectedPaymentMethod,
    showLoadingToGetPrices,
    selectedOptionTravel,
    setSelectedOptionTravel,
    newTripSchedule,
    dataCalculate,
  } = useTripGL();
  const {getCards, cards} = usePaymentForm();
  const navigation = useNavigation();
  const [scheduleHour, setScheduleHour] = useState(false);
  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalInfo, setModalInfor] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [cardSelected, setCardSelected] = useState('');
  const [loadingCardAd, setLoadingCardAd] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [date, setDate] = useState(
    convertUSDate(new Date(new Date().setDate(new Date().getDate()))),
  );

  const [hours, setHours] = useState({
    hour: '',
    hourFinal: '',
  });

  const listCards = useCallback(async () => {
    setLoadingCardAd(true);

    try {
      if (cards.length === 0) {
        const response = await getCards();
        if (response.length > 0) {
          setCardSelected(response[0].idCard);
        }
        setLoadingCardAd(false);
      } else {
        setCardSelected(cards[0].idCard);
      }
      setLoadingCardAd(false);
    } catch (error) {
      console.log(error);
      customToast('erro desconhecido', 'danger');
    } finally {
      setLoadingCardAd(false);
    }
  }, [setSelectedOptionTravel, selectedOptionTravel]);

  useEffect(() => {
    listCards();
  }, []);

  function handleDateSelect(day) {
    setDate(day);
  }

  LogBox.ignoreLogs(['Setting a timer']);

  const handleDisabledSchedule = useCallback(() => {
    customToast(translate('schedule.toast_warning'), 'warning');
  }, []);

  const handleSchedule = useCallback(() => {
    setModalSchedule(true);
  }, []);

  const handleHourModal = useCallback(() => {
    setScheduleHour(true);
  }, []);

  const handleCartModal = useCallback(() => {
    setModalCart(true);
  }, []);
  const handleCloseCart = useCallback(() => {
    setModalCart(false);
  }, []);

  const handleCloseHour = () => {
    setScheduleHour({});
    setHours({
      hour: '',
      hourFinal: '',
    });
  };

  const handleSendConfirmSchedule = useCallback(async () => {
    if (
      hours.hour === '' ||
      date === '' ||
      selectedPaymentMethod === null ||
      Object.keys(selectedOptionTravel).length === 0
    ) {
      return customToast(translate('schedule.toast_warning'), 'warning');
    }
    setLoadingCardAd(true);

    const schedule = `${date} ${maskHour(hours.hour)}:00`;
    const localOffset = new Date().getTimezoneOffset() / -60; // Obtém o deslocamento de fuso horário local em horas

    // Calcula o fuso horário UTC baseado no dispositivo
    const scheduleUTC = moment(schedule).utcOffset(localOffset).format();

    await newTripSchedule(schedule, scheduleUTC, cardSelected);

    setLoadingCardAd(false);
    setModalSchedule(false);
  }, [
    date,
    hours.hour,
    modalSchedule,
    navigation,
    selectedOptionTravel,
    selectedPaymentMethod,
  ]);

  const maskHour = useCallback(value => {
    let hour = value.replace(/[^0-9]/g, '') ?? '';
    if (hour.length > 2) {
      const hourForm = `${hour.substring(0, 2)}:${hour.substring(2, 4)}`;
      const [h, m] = hourForm.split(':');
      if (h > 23) {
        return (hour = '23');
      }
      if (m > 59) {
        return (hour = `${h}:59`);
      }
      return (hour = hourForm);
    }
  }, []);

  const transformTag = (tag: string) => {
    return tag.includes('div');
  }

  const renderOptionItem = ({item}) => {
    return (
      <OptionTravelItem
        activeOpacity={0.8}
        selected={selectedOptionTravel.tripTypeId === item.tripTypeId}
        onPress={() => {
          setSelectedOptionTravel(item);
        }}
      >
        <OptionTravelItemContent>
          <NameLabel>{transformTag(item.tag) ? item?.multiplierPriceDynamic : item.tag}</NameLabel>
          {item?.tripType?.picture.split('.').pop() === 'svg' ? (
            <SvgUri
              width={RFValue(50)}
              height={RFValue(50)}
              uri={item?.tripType?.picture}
            />
          ) : (
            <RateImage
              source={{
                uri: item?.tripType?.picture,
              }}
            />
          )}
          <RatePriceLabel>
            {coinTypePerApi(cityConfig?.typeMoney)}{' '}
            {Helper.maskMoney(parseFloat(item.price))}
          </RatePriceLabel>
        </OptionTravelItemContent>
      </OptionTravelItem>
    );
  };

  if (hide) return null;

  const cardFind = (cardID: number) => {
    const card = cards.find(item => item.idCard === cardID);
    if (card) {
      return Helper.maskCardNumber(card.number);
    }
    return null;
  };

  return (
    <>
      <PaymentMethodModal
        visible={showPaymentMethodModal}
        setVisible={setShowPaymentMethodModal}
      />
      <Container>
        <Header>
          <HeaderTitle>
            {dataCalculate?.label_info?.title_trip_types}
          </HeaderTitle>
          <HeaderInfoButton onPress={() => setModalInfor(true)}>
            <MaterialCommunityIcons
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                borderRadius: 100,
                textAlign: 'center',
              }}
              name="information-variant"
              size={15}
              color="black"
            />
          </HeaderInfoButton>
        </Header>
        {showLoadingToGetPrices ? (
          <Text>...</Text>
        ) : (
          <OptionsList
            data={prices}
            numColumns={Number(widthMax) >= 410 ? 3 : 2}
            renderItem={renderOptionItem}
            keyExtractor={item => `${item.idPrice}`}
          />
        )}
        <ContainerDate
          style={
            selectedPaymentMethod?.idTripPaymentForm === '3'
              ? ''
              : {width: '100%'}
          }
        >
          <PaymentMethodContainer>
            <ButtonOpenPaymentMethodModal
              onPress={() => setShowPaymentMethodModal(true)}
            >
              <CurrencyType>R$</CurrencyType>
              <PaymentMethodSelected>
                {selectedPaymentMethod.name ||
                  translate('detailsTrip.text_type_payment')}
              </PaymentMethodSelected>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={16}
                color="black"
              />
            </ButtonOpenPaymentMethodModal>
          </PaymentMethodContainer>

          <If condition={selectedPaymentMethod?.idTripPaymentForm === '3'}>
            <IconClock>
              <PaymentMethodContainer>
                <ButtonOpenPaymentMethodModal onPress={handleCartModal}>
                  <CurrencyType>
                    {cardSelected !== ''
                      ? cardFind(cardSelected)
                      : translate('schedule.select')}{' '}
                  </CurrencyType>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={16}
                    color="black"
                  />
                </ButtonOpenPaymentMethodModal>
              </PaymentMethodContainer>
            </IconClock>
          </If>
        </ContainerDate>

        <ContainerDate>
          <PaymentMethodContainer>
            <ButtonOpenPaymentMethodModal onPress={handleSchedule}>
              <CurrencyType>{translate('schedule.date')}</CurrencyType>
              <PaymentMethodSelected>
                {convertDate(date) || translate('schedule.select_date')}
              </PaymentMethodSelected>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={16}
                color="black"
              />
            </ButtonOpenPaymentMethodModal>
          </PaymentMethodContainer>

          <IconClock>
            <PaymentMethodContainer>
              <ButtonOpenPaymentMethodModal onPress={handleHourModal}>
                <CurrencyType>{translate('schedule.time')}</CurrencyType>
                <PaymentMethodSelected>
                  {maskHour(hours.hour) ??
                    ('00:00' || translate('schedule.select_time'))}
                </PaymentMethodSelected>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={16}
                  color="black"
                />
              </ButtonOpenPaymentMethodModal>
            </PaymentMethodContainer>
          </IconClock>
        </ContainerDate>

        <FooterGL>
          <If condition={!hours.hour && !hours.hourFinal}>
            <ButtonSmall
              title={translate('schedule.text_button_add')}
              loading={false}
              onPress={handleDisabledSchedule}
            />
          </If>
          <If condition={hours.hour && date !== ''}>
            <ButtonSmall
              title={translate('schedule.text_button_add')}
              loading={false}
              onPress={handleSendConfirmSchedule}
            />
          </If>
        </FooterGL>

        <ModalSchedule
          setModal={setModalSchedule}
          visible={modalSchedule}
          date={date}
          setDate={setDate}
          setHours={setHours}
          hours={hours}
          // eslint-disable-next-line react/jsx-no-bind
          handleDateSelect={handleDateSelect}
        />

        <ModalFrame
          visible={scheduleHour}
          setVisible={setScheduleHour}
          onPressConfirm={() => setScheduleHour(false)}
          onClose={handleCloseHour}
        >
          <Input
            style={{marginTop: 10}}
            keyboardType="numeric"
            placeholder="00:00"
            onChangeText={value => setHours({...hours, hour: value})}
            value={maskHour(hours.hour)}
            returnKeyType="done"
            textAlign="center"
          />
        </ModalFrame>

        <ModalFrame
          visible={modalCart}
          setVisible={setModalCart}
          onPressConfirm={handleCloseCart}
          onClose={handleCloseCart}
        >
          <HeaderDialog>
            <AntDesign name="close" size={25} onPress={handleCloseCart} />
          </HeaderDialog>
          <Picker
            selectedValue={cardSelected}
            onValueChange={itemValue => setCardSelected(itemValue)}
          >
            {cards.length > 0 ? (
              cards.map(item => (
                <Picker.Item
                  key={item.idCard}
                  label={Helper.maskCardNumber(item.number)}
                  value={item.idCard}
                />
              ))
            ) : (
              <Picker.Item label={translate('schedule.no_card')} value={''} />
            )}
          </Picker>
        </ModalFrame>

        <If condition={modalInfo}>
          <ModalInfo
            visible={modalInfo}
            setVisible={setModalInfor}
            prices={prices}
          />
        </If>
      </Container>

      <Preload visible={loadingCardAd && !offerBiometry} />
    </>
  );
}
