import {Button} from 'react-native-paper';
import {If} from '../If';
import {
  ButtonOpenPaymentMethodModal,
  ConfirmButton,
  ConfirmButtonText,
  Container,
  CurrencyType,
  Footer,
  Header,
  HeaderInfoButton,
  HeaderTitle,
  Loading,
  LoadingContainer,
  OptionalButton,
  OptionalButtonText,
  OptionsList,
  PaymentMethodContainer,
  PaymentMethodSelected,
  CancelationFeeContainer,
  OptionInDriver,
  ImageBid,
  TextBid,
} from '../TravelOptions/styles';
import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {TextEdit} from '../TextEdit';
import {Text} from 'react-native-elements';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import {coinTypePerApi} from '../../utils/money';
import AnimationIconRocket from '../AnimatedIconRocket';
import Helper from '../../utils/Helper';
import {convertDate, maskHour} from '../../utils/FormatDate';
import {ActivityIndicator, Alert} from 'react-native';
import {customToast} from '../../../utils/FlashMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTrip} from '../../contexts/Trip';
import {useAuth} from '../../../context/auth';
import {TravelOptionsContainerProps} from './types';
import {usePaymentForm} from '../../contexts/paymentForms';
import {usePixConfirmation} from '../../../driver/src/hooks/addressConfirmation';
import TravelOptionsCard from '../TravelOptionsCard';

const TravelOptionsContainer = ({
  serviceSelected,
  enableDepartureAddresConfirmation,
  setVisibleOptionTravel,
  setVisibleConfirmAddress,
  handlePix,
  handleConfirmRace,
  turbined,
  setTurbined,
  setTypeTrip,
  calculatePricesAndSome,
  setOfferInDriver,
  setModalInfo,
  haveCancelationFee,
  listServices,
  setModalOfferInPrice,
  setModalCard,
  valueVoucher,
  setVisible,
  selectedCard,
  setVisibleModalReadQrCode,
  loadingButton,
  setModalSchedule,
  loadingConfirm,
  typeTrip,
  date,
  hours,
  offerInDriver,
  verifyCardOnCoupon,
  coupons,
  setModalCoupon,
  hasInDriver,
  waitForAddressConfirmation,
}: TravelOptionsContainerProps) => {
  const {cityConfig} = useAuth();
  const {stateTripCustomer} = useTrip();
  const {cards} = usePaymentForm();
  const {waitForPixConfirmation} = usePixConfirmation();

  const {
    prices,
    selectedPaymentMethod,
    showLoadingToGetPrices,
    selectedOptionTravel,
    calculateAllData,
    inputWho,
    selectedCoupon,
  } = stateTripCustomer;

  const cardFind = (cardID: number) => {
    const card = cards.find(item => item.idCard === cardID);
    if (card) {
      return ` ${Helper.maskCardNumber(card.number)}`;
    }
    return '';
  };

  const handlePress = async () => {
    try {
      if (!selectedPaymentMethod?.name) {
        customToast('Selecione uma forma de pagamento', 'warning');
        return;
      }

      if (!selectedOptionTravel?.price) {
        customToast('Selecione um tipo de chamado', 'warning');
        return;
      }
      if (serviceSelected) {
        await AsyncStorage.setItem(
          '@lastServices',
          JSON.stringify(serviceSelected),
        );
      }
      if (
        enableDepartureAddresConfirmation !== '0' &&
        enableDepartureAddresConfirmation !== null
      ) {
        setVisibleOptionTravel(false);
        setVisibleConfirmAddress(true);

        // Agora, o código irá "parar" aqui até que o endereço seja confirmado.
        await waitForAddressConfirmation();

        // Após a confirmação do endereço, você pode continuar com o código
        setVisibleConfirmAddress(false);
      }

      // Depois de confirmar a corrida, verificar se o método de pagamento é Pix
      if (selectedPaymentMethod?.name === 'PIX via aplicativo') {
        handlePix();
        await waitForPixConfirmation();
      }
      // Confirmação da corrida
      handleConfirmRace();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTurbine = async () => {
    if (turbined) {
      setTurbined(false);
      setTypeTrip('');
      return;
    }
    Alert.alert(
      translate('trip.turbo_mode'),
      translate('trip.turbo_mode_description'),
    );

    await calculatePricesAndSome(50);
    setOfferInDriver(selectedOptionTravel?.price);
    setTypeTrip('tripTurbine');
    setTurbined(true);
  };

  const renderOptionItem = ({item}) => {
    if (item) {
      return (
        <>
          <TravelOptionsCard
            selectedOptionTravel={selectedOptionTravel}
            item={item}
            setOfferInDriver={setOfferInDriver}
            turbined={turbined}
            selectedCoupon={selectedCoupon}
            offerInDriver={offerInDriver}
            verifyCardOnCoupon={verifyCardOnCoupon}
            coupons={coupons}
            setModalCoupon={setModalCoupon}
          />
          <If
            condition={
              (item?.tripType?.offerOption === '1' ||
                hasInDriver !== undefined) &&
              selectedOptionTravel.tripTypeId === item.tripTypeId
            }
          >
            <OptionInDriver>
              <ImageBid source={require('../../assets/images/bid.png')} />
              <TextBid>{translate('tripAnother.to_bid')}</TextBid>
            </OptionInDriver>
          </If>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>
          {calculateAllData?.label_info?.title_trip_types ?? ''}
        </HeaderTitle>
        <HeaderInfoButton onPress={() => setModalInfo(true)}>
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
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <OptionsList
          data={listServices || prices || []}
          renderItem={renderOptionItem}
          keyExtractor={(item: {idPrice?: number | string}, index: number) =>
            item?.idPrice ? `${item.idPrice}` : `undefined-${index}`
          }
        />
      )}
      <If condition={inputWho.name && selectedOptionTravel.price}>
        <Button
          mode="outlined"
          onPress={() => {
            setOfferInDriver(selectedOptionTravel?.price);
            setTypeTrip('tripPartner');
            setModalOfferInPrice(true);
          }}
        >
          <TextEdit color={theme.colors.primary}>
            {translate('tripAnother.edit_price')}
          </TextEdit>
        </Button>
      </If>

      {haveCancelationFee &&
      String(cityConfig?.showCancellationFeeForCustomer) == '1' ? (
        <CancelationFeeContainer>
          <Text style={{color: theme.colors.secondary}}>
            {translate('trip.cancelation_fee')}
          </Text>
        </CancelationFeeContainer>
      ) : (
        ''
      )}
      <PaymentMethodContainer>
        <ButtonOpenPaymentMethodModal onPress={() => setVisible(true)}>
          <CurrencyType>{coinTypePerApi(cityConfig?.typeMoney)} </CurrencyType>
          <PaymentMethodSelected>
            {selectedPaymentMethod?.name || translate('trip.no_payment')}
          </PaymentMethodSelected>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={26}
            color={theme.colors.secondary}
          />
        </ButtonOpenPaymentMethodModal>
        <If condition={selectedPaymentMethod?.paymentFormTypeId === '3'}>
          <ButtonOpenPaymentMethodModal
            onPress={() => setModalCard(true)}
            style={{
              justifyContent: 'flex-start',
            }}
          >
            <PaymentMethodSelected>
              <AntDesign name="creditcard" size={20} />
              {cardFind(selectedCard)}
            </PaymentMethodSelected>
          </ButtonOpenPaymentMethodModal>
        </If>
        <If condition={selectedPaymentMethod?.paymentFormTypeId === '1'}>
          <ButtonOpenPaymentMethodModal
            onPress={() => {}}
            style={{
              justifyContent: 'flex-start',
            }}
          >
            <PaymentMethodSelected>
              {cityConfig?.typeMoney}
              {Helper.maskMoney(Number(valueVoucher) || 0) || 0}
            </PaymentMethodSelected>
          </ButtonOpenPaymentMethodModal>
        </If>
      </PaymentMethodContainer>
      <Footer>
        <OptionalButton onPress={() => setVisibleModalReadQrCode(true)}>
          <FontAwesome name="qrcode" size={28} color={theme.colors.primary} />
          <OptionalButtonText>
            {translate('trip.type_door_handler')}
          </OptionalButtonText>
        </OptionalButton>
        <OptionalButton
          onPress={() => {
            setModalSchedule(true);
          }}
        >
          <MaterialIcons
            name="schedule"
            size={28}
            color={theme.colors.primary}
          />
          <OptionalButtonText>
            {translate('trip.type_to_schedule')}
          </OptionalButtonText>
        </OptionalButton>
        <OptionalButton turbined={turbined} onPress={handleTurbine}>
          <AnimationIconRocket
            color={
              turbined ? theme.colors.background_white : theme.colors.primary
            }
          />
          <OptionalButtonText>{translate('trip.turbo')}</OptionalButtonText>
        </OptionalButton>

        <ConfirmButton
          style={{
            elevation: 6,
            shadowColor: 'black',
            shadowOffset: {width: 5, height: 5},
            shadowOpacity: 0.4,
            shadowRadius: 5,
          }}
          onPress={async () => {
            await handlePress();
          }}
          disabled={loadingButton || loadingConfirm}
        >
          <ConfirmButtonText>
            <If condition={!loadingButton}>
              {typeTrip !== 'tripSchedule'
                ? translate('trip.confirm')
                : translate('trip.type_to_schedule')}
            </If>
            <If condition={loadingButton}>
              <ActivityIndicator
                size={'small'}
                color={theme.colors.background_global}
              />
            </If>
          </ConfirmButtonText>
          <If condition={!loadingButton && typeTrip === 'tripSchedule'}>
            <TextEdit size="small" color={theme.colors.white}>
              {convertDate(date) || translate('schedule.select_date')}
              {` - `}
              {maskHour(hours.hour) ??
                ('00:00' || translate('schedule.select_time'))}
            </TextEdit>
          </If>
        </ConfirmButton>
      </Footer>
    </Container>
  );
};

export default TravelOptionsContainer;
