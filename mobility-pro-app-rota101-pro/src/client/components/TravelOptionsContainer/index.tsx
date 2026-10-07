import { Button } from 'react-native-paper';
import { If } from '../If';
import {
  ButtonOpenPaymentMethodModal,
  ConfirmButton,
  ConfirmButtonText,
  Container,
  CurrencyType,
  Footer,
  Header,
  HeaderTitle,
  Loading,
  LoadingContainer,
  OptionalButton,
  OptionalButtonText,
  PaymentMethodContainer,
  PaymentMethodSelected,
  CancelationFeeContainer,
  OptionInDriver,
  ImageBid,
  TextBid,
  ButtonOpenPaymentMethodRight,
} from '../TravelOptions/styles';
import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { TextEdit } from '../TextEdit';
import { translate } from '../../locales';
import theme from '../../styles/theme';
import { coinTypePerApi, maskMoney } from '../../utils/money';
import AnimationIconRocket from '../AnimatedIconRocket';
import Helper from '../../utils/Helper';
import { convertDate, maskHour } from '../../utils/FormatDate';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { customToast } from '../../../utils/FlashMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTrip } from '../../contexts/Trip';
import { useAuth } from '../../../context/auth';
import { TravelOptionsContainerProps } from './types';
import { usePaymentForm } from '../../contexts/paymentForms';
import { usePixConfirmation } from '../../../driver/src/hooks/addressConfirmation';
import TravelOptionsCard from '../TravelOptionsCard';
import { TravelOptionsCardItem } from '../TravelOptionsCard/types';
import { PIX_WEB } from '~/client/constants/paymentFormType';
import { useEffect, useMemo, useState } from 'react';
import { ModalLowBatteryTravelOptions } from '~/common/ModalLowBatteryTravelOptions';
import { useBattery } from '~/hooks/useBattery';
import TripTypeOptionsPanel from '../TripTypeOptionsPanel';
import calculatePriceBreakdown from '../PriceBreakdown/calculatePriceBreakdown';
import styles from './styles';
import { SvgUri } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { readableTextColor } from '~/utils/color';

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
  const { hasLowBattery } = useBattery();
  const { cityConfig } = useAuth();
  const { stateTripCustomer } = useTrip();
  const { cards } = usePaymentForm();
  const { waitForPixConfirmation } = usePixConfirmation();
  const [visibleModalLowBattery, setVisibleModalLowBattery] = useState<boolean>(false);
  const [expandedTrip, setExpandedTrip] = useState<TravelOptionsCardItem | null>(null);
  const [visibleTripDetails, setVisibleTripDetails] = useState<boolean>(false);

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

  const handleVerifyLowBattery = async () => {
    const lowBattery = await hasLowBattery();

    if (lowBattery) {
      setVisibleModalLowBattery(true);
    }
  }

  useEffect(() => {
    handleVerifyLowBattery();
  }, []);

  useEffect(() => {
    if (!expandedTrip?.tripTypeId) return;
    if (expandedTrip.tripTypeId !== selectedOptionTravel?.tripTypeId) {
      setExpandedTrip(null);
      setVisibleTripDetails(false);
    }
  }, [expandedTrip, selectedOptionTravel]);

  const shouldRequireCreditCardSelection = (): boolean => {
    return (
      selectedPaymentMethod?.paymentFormTypeId === '3' &&
      Object.keys(selectedCard).length === 0
    );
  };

  const handleOpenCreditCardSelectorAlert = (): void => {
    Alert.alert(
      translate('trip.select_credit_card_title'),
      translate('trip.select_credit_card_description'),
      [
        {
          text: translate('trip.ok'),
          onPress: () => setModalCard(true),
        },
      ],
    );
  };

  const handlePress = async () => {
    try {
      if (!selectedPaymentMethod?.name) {
        customToast(translate('trip.select_payment_method_warning'), 'warning');
        return;
      }

      if (!selectedOptionTravel?.price) {
        customToast(translate('trip.select_trip_type_warning'), 'warning');
        return;
      }

      if (shouldRequireCreditCardSelection()) {
        handleOpenCreditCardSelectorAlert();
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
        await waitForAddressConfirmation();
        setVisibleConfirmAddress(false);
      }

      const isPix = Number(selectedPaymentMethod?.paymentFormTypeId) === PIX_WEB
      if (isPix) {
        handlePix();
        await waitForPixConfirmation();
      } else {
        handleConfirmRace();
      }
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

  const renderOptionItem = ({ item }) => {
    if (item) {
      return (
        <>
          <TravelOptionsCard
            selectedOptionTravel={selectedOptionTravel}
            item={item}
            setOfferInDriver={setOfferInDriver}
            onPressSelectedTripType={handleSelectedTripTypePress}
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

  const handleSelectedTripTypePress = (item: TravelOptionsCardItem): void => {
    if (!item?.tripTypeId) return;
    if (expandedTrip?.tripTypeId === item.tripTypeId) {
      setExpandedTrip(null);
      setVisibleTripDetails(false);
      return;
    }
    setExpandedTrip(item);
  };

  const detailBreakdown = useMemo(() => {
    if (!expandedTrip) return null;
    const hasSelectedCoupon = Object.keys(selectedCoupon).length > 0;
    return calculatePriceBreakdown({
      basePrice: expandedTrip?.price || 0,
      basePlatformAmount: expandedTrip?.platformAmount,
      baseDriverAmount: expandedTrip?.driverAmount,
      selectedCoupon,
      isCouponApplicable: hasSelectedCoupon && verifyCardOnCoupon && !turbined,
      offerInDriver,
      turbinedPrice: expandedTrip?.turbinedPrice,
      turbined,
    });
  }, [expandedTrip, offerInDriver, selectedCoupon, turbined, verifyCardOnCoupon]);

  const coin = coinTypePerApi(cityConfig?.typeMoney) || '';
  const summaryPrice = `${coin} ${maskMoney(Number(offerInDriver || selectedOptionTravel?.price || 0))}`.trim();
  const summaryEstimateRaw =
    expandedTrip?.estimatedTripTime ||
    expandedTrip?.tripType?.estimatedTime;
  const summaryEstimate = summaryEstimateRaw
    ? `${summaryEstimateRaw} ${translate('trip.minutes')}`
    : '';
  const detailsDescription =
    expandedTrip?.tripType?.description ||
    expandedTrip?.description ||
    calculateAllData?.label_info?.description_trip_types ||
    '';
  const detailTotal = detailBreakdown?.total ?? Number(offerInDriver || selectedOptionTravel?.price || 0);
  const detailPlatform = detailBreakdown?.platformAmount ?? expandedTrip?.platformAmount ?? null;
  const detailDriver = detailBreakdown?.driverAmount ?? expandedTrip?.driverAmount ?? null;
  const formatDetailValue = (value: number | null): string => {
    if (value === null || !Number.isFinite(value)) return '—';
    return `${coin} ${maskMoney(value)}`.trim();
  };

  return (
    <>
      <Container>
        {!!expandedTrip && visibleTripDetails ? (
          <View style={styles.priceCompositionCard}>
            <Header>
              <View style={styles.tripFocusHeaderContent}>
                <TouchableOpacity
                  style={styles.priceCompositionBackButton}
                  onPress={() => setVisibleTripDetails(false)}
                  accessibilityRole="button"
                  accessibilityLabel={translate('trip.back')}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={RFValue(18)}
                    color={theme.colors.secondary}
                  />
                </TouchableOpacity>
                <HeaderTitle>{translate('trip.senacon_title')}</HeaderTitle>
              </View>
            </Header>
            {!!detailsDescription && (
              <Text style={styles.priceCompositionDescription}>{detailsDescription}</Text>
            )}
            <View style={styles.priceCompositionRow}>
              <Text style={[styles.priceCompositionLabel, styles.priceCompositionEmphasis]}>
                {translate('trip.senacon_total')}
              </Text>
              <Text style={[styles.priceCompositionValue, styles.priceCompositionEmphasis]}>
                {formatDetailValue(detailTotal)}
              </Text>
            </View>
            <View style={styles.priceCompositionRow}>
              <Text style={styles.priceCompositionLabel}>{translate('trip.senacon_platform')}</Text>
              <Text style={styles.priceCompositionValue}>{formatDetailValue(detailPlatform)}</Text>
            </View>
            <View style={styles.priceCompositionRow}>
              <Text style={styles.priceCompositionLabel}>{translate('trip.senacon_driver')}</Text>
              <Text style={styles.priceCompositionValue}>{formatDetailValue(detailDriver)}</Text>
            </View>
            <Text style={styles.priceCompositionDisclaimer}>
              {translate('trip.senacon_disclaimer')}
            </Text>
          </View>
        ) : !!expandedTrip ? (
          <View style={styles.tripFocusCard}>
            <Header>
              <View style={styles.tripFocusHeaderContent}>
                <HeaderTitle>{translate('trip.confirm_information')}</HeaderTitle>
                <MaterialCommunityIcons
                  name="close"
                  size={RFValue(20)}
                  color={theme.colors.secondary}
                  style={styles.tripDetailsCloseButton}
                  onPress={() => {
                    setExpandedTrip(null);
                    setVisibleTripDetails(false);
                  }}
                />
              </View>
            </Header>
            <View style={styles.tripFocusImageContainer}>
              {expandedTrip?.tripType?.picture?.split('.').pop() === 'svg' ? (
                <SvgUri
                  width={RFValue(110)}
                  height={RFValue(110)}
                  uri={expandedTrip?.tripType?.picture}
                  style={styles.tripFocusImage}
                />
              ) : (
                <Image
                  source={{ uri: expandedTrip?.tripType?.picture }}
                  style={styles.tripFocusImage}
                />
              )}
            </View>
            <View style={styles.tripFocusMainRow}>
              <Text style={styles.tripFocusName}>
                {expandedTrip?.tripType?.name || expandedTrip?.tag || translate('trip.no_name')}
              </Text>
              <View style={styles.tripFocusPriceColumn}>
                <Text style={styles.tripFocusPrice}>{summaryPrice}</Text>
                {!!summaryEstimate && (
                  <Text style={styles.tripFocusEstimate}>{summaryEstimate}</Text>
                )}
              </View>
            </View>
            <View style={styles.tripDetailsDescriptionRow}>
              {!!detailsDescription && (
                <Text style={styles.tripDetailsDescriptionPreview} numberOfLines={2}>
                  {detailsDescription}
                </Text>
              )}
              <TouchableOpacity
                style={styles.tripDetailsActionButton}
                onPress={() => setVisibleTripDetails(true)}
                accessibilityRole="button"
                accessibilityLabel={translate('trip.senacon_action')}
                hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
              >
                <View style={styles.tripDetailsActionContent}>
                  <MaterialCommunityIcons
                    name="receipt-text-outline"
                    size={RFValue(14)}
                    color={theme.colors.blue}
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  />
                  <Text
                    style={styles.tripDetailsActionText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {translate('trip.senacon_action')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <TripTypeOptionsPanel
              title={calculateAllData?.label_info?.title_trip_types ?? ''}
              isLoading={showLoadingToGetPrices}
              options={listServices || prices || []}
              renderOptionItem={renderOptionItem}
              onPressInfo={() => setModalInfo(true)}
            />
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
          </>
        )}
        {!visibleTripDetails && (
          <>
            {haveCancelationFee &&
              (String(cityConfig?.showCancellationFeeForCustomer) || '0') == '1' ? (
              <CancelationFeeContainer>
                <Text style={styles.cancelationFeeText}>
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
                <ButtonOpenPaymentMethodRight onPress={() => setModalCard(true)}>
                  <PaymentMethodSelected>
                    <AntDesign name="credit-card" size={20} />
                    {cardFind(selectedCard)}
                  </PaymentMethodSelected>
                </ButtonOpenPaymentMethodRight>
              </If>
              <If condition={selectedPaymentMethod?.paymentFormTypeId === '1'}>
                <ButtonOpenPaymentMethodRight disabled>
                  <PaymentMethodSelected>
                    {cityConfig?.typeMoney}{" "}
                    {Helper.maskMoney(Number(valueVoucher) || 0) || 0}
                  </PaymentMethodSelected>
                </ButtonOpenPaymentMethodRight>
              </If>
            </PaymentMethodContainer>
            <Footer>
              {cityConfig?.enableKnobTrip === '1' ? (
                <OptionalButton onPress={() => setVisibleModalReadQrCode(true)}>
                  <FontAwesome name="qrcode" size={28} color={theme.colors.secondary} />
                  <OptionalButtonText>
                    {translate('trip.type_door_handler')}
                  </OptionalButtonText>
                </OptionalButton>
              ) : (
                <></>
              )}
              {cityConfig?.enableTripScheduled === '1' ? (
                <OptionalButton
                  onPress={() => {
                    setModalSchedule(true);
                  }}
                >
                  <MaterialIcons
                    name="schedule"
                    size={28}
                    color={theme.colors.secondary}
                  />
                  <OptionalButtonText>
                    {translate('trip.type_to_schedule')}
                  </OptionalButtonText>
                </OptionalButton>
              ) : (
                <></>
              )}
              <OptionalButton turbined={turbined} onPress={handleTurbine}>
                <AnimationIconRocket
                  color={
                    turbined ? readableTextColor(theme.colors.primary) : theme.colors.secondary
                  }
                />
                <OptionalButtonText
                  style={{
                    color: turbined
                      ? readableTextColor(theme.colors.primary)
                      : theme.colors.secondary,
                  }}
                >
                  {translate('trip.turbo')}
                </OptionalButtonText>
              </OptionalButton>
              <ConfirmButton
                style={styles.confirmButtonShadow}
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
                  <TextEdit size="small" color={theme.colors.primaryText}>
                    {convertDate(date) || translate('schedule.select_date')}
                    {` - `}
                    {maskHour(hours.hour) ?? '00:00'}
                  </TextEdit>
                </If>
              </ConfirmButton>
            </Footer>
            <ModalLowBatteryTravelOptions
              visible={visibleModalLowBattery}
              setVisible={setVisibleModalLowBattery}
              handleTurbine={handleTurbine}
            />
          </>
        )}
      </Container>
    </>
  );
};

export default TravelOptionsContainer;
