import {ScrollView, Modal, ActivityIndicator} from 'react-native';
import {useEffect, useReducer, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {useTrip} from '../../contexts/Trip';
import {useKeyboardHeight} from '../../../common/hooks/useKeyboardHeight';

import {
  AddressCard,
  AddressCardHeader,
  AddressCardHeaderText,
  AddressLineItem,
  AddressRow,
  AddressText,
  Ball,
  ButtonBack,
  CloseButton,
  CommentBox,
  Container,
  ContainerPrice,
  ContainerText,
  Content,
  DriverInfoContainer,
  DriverProfilePicture,
  DriverRating,
  DriverRatingContainer,
  Header,
  MarkerColumn,
  PriceCard,
  PriceLabel,
  PriceLabelRow,
  PriceValue,
  ResultContainer,
  ResultScroll,
  ResultTitle,
  SectionTitleDivider,
  SectionTitleRow,
  SectionTitleText,
  SendEvaluationButton,
  SendEvaluationButtonText,
  Square,
  StopsBadge,
  StopsBadgeText,
  SubTitle,
  Subtitle,
  SubmitButton,
  SubmitButtonText,
  SuccessIconWrapper,
  TimelineLine,
  ThankYouCenterBadge,
  ThankYouContainer,
  ThankYouGlow,
  ThankYouSparkle,
  ThankYouStarsStage,
  ThankYouSubtitle,
  ThankYouTitle,
  Title,
  TripValue,
} from './styles';
import {coinTypePerApi, maskMoney} from '../../utils/money';
import StarRatings from '../StarRatings';
import {If} from '../If';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';
import {useTripGL} from '../../contexts/TripGL';
import {CardComment} from '../CardComment';
import {CardTip} from '../CardTip';

const THANK_YOU_SPARKLE_ANGLES = [0, 60, 120, 180, 240, 300];
const THANK_YOU_DURATION = 2200;

export default function TripFinishModal({visible, closeModal, setVisible}) {
  const {handleAvaliationDriver, stateTripCustomer} = useTrip();
  const {completedTripData} = stateTripCustomer;
  const {tripStatus} = useTripGL();
  const {cityConfig} = useAuth();
  const keyboardHeight = useKeyboardHeight();
  const [tripSchedule, setTripSchedule] = useState<any>();
  const [showStops, setShowStops] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const stopsCount = completedTripData?.tripWayPoints?.length || 0;
  const scrollViewRef = useRef<ScrollView>(null);
  const [states, setState] = useReducer(
    (oldState, newState) => ({...oldState, ...newState}),
    {
      loading: false,
      comment: '',
    },
  );

  const completedTripSchedule = async () => {
    const data = await AsyncStorage.getItem('tripSchedule');
    if (data && tripStatus === null) {
      setTripSchedule(JSON.parse(data));
    }
  };

  useEffect(() => {
    completedTripSchedule();
  }, [tripStatus, tripSchedule]);

  useEffect(() => {
    setShowThankYou(false);
  }, [completedTripData?.tripReference]);

  const switchCasePayment = paymentId => {
    switch (paymentId) {
      case 1:
        return translate('schedule.money');
      default:
        return 'Pague ao Colaborador';
    }
  };

  const confirmTrip = async () => {
    setState({loading: true});
    const result = await handleAvaliationDriver(states.comment);
    setState({comment: '', loading: false});

    if (!result) {
      closeModal();
      return;
    }

    AsyncStorage.removeItem('tripSchedule');
    setShowThankYou(true);
    setTimeout(closeModal, THANK_YOU_DURATION);
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true});
    }, 100);
  };

  return (
    <>
      <If condition={completedTripData}>
        <Modal visible={visible}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ResultContainer edges={['top', 'bottom']}>
            <ResultScroll
              ref={scrollViewRef}
              scrollEventThrottle={16}
              keyboardHeight={keyboardHeight}
            >
              {showThankYou ? (
                <ThankYouContainer>
                  <ThankYouStarsStage>
                    <ThankYouGlow
                      from={{scale: 0.4, opacity: 0.6}}
                      animate={{scale: 1.3, opacity: 0}}
                      transition={{type: 'timing', duration: 900}}
                    />
                    {THANK_YOU_SPARKLE_ANGLES.map((angle, index) => (
                      <ThankYouSparkle
                        key={angle}
                        angle={angle}
                        from={{scale: 0, opacity: 0, rotate: '0deg'}}
                        animate={{scale: 1, opacity: 1, rotate: '20deg'}}
                        transition={{type: 'spring', damping: 9, delay: 120 + index * 70}}
                      >
                        <Ionicons name="star" size={RFValue(16)} color={theme.colors.primary} />
                      </ThankYouSparkle>
                    ))}
                    <ThankYouCenterBadge
                      from={{scale: 0, opacity: 0}}
                      animate={{scale: 1, opacity: 1}}
                      transition={{type: 'spring', damping: 9, delay: 60}}
                    >
                      <Ionicons name="checkmark-circle" size={RFValue(64)} color={theme.colors.border_green} />
                    </ThankYouCenterBadge>
                  </ThankYouStarsStage>

                  <ThankYouTitle>{translate('finishTrip.thank_you_title')}</ThankYouTitle>
                  <ThankYouSubtitle>{translate('finishTrip.thank_you_subtitle')}</ThankYouSubtitle>
                </ThankYouContainer>
              ) : (
                completedTripData && Object.keys(completedTripData).length > 0 && (
                  <>
                    <CloseButton
                      activeOpacity={0.7}
                      onPress={() => {
                        closeModal();
                        AsyncStorage.removeItem('trip');
                      }}
                    >
                      <AntDesign name="close" size={RFValue(14)} color={theme.colors.red} />
                    </CloseButton>

                    <SuccessIconWrapper>
                      <Ionicons name="checkmark" size={RFValue(40)} color={theme.colors.border_green} />
                    </SuccessIconWrapper>

                    <ResultTitle>{translate('finishTrip.title_success_finish')}</ResultTitle>
                    <Subtitle>{translate('finishTrip.subtitle_success_finish')}</Subtitle>

                    <PriceCard>
                      <PriceLabelRow>
                        <Ionicons name="wallet-outline" size={RFValue(16)} color={theme.colors.border_green} />
                        <PriceLabel>
                          {switchCasePayment(completedTripData?.tripPaymentFormId)}
                        </PriceLabel>
                      </PriceLabelRow>
                      <PriceValue>
                        {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                        {maskMoney(parseFloat(completedTripData?.price))}
                      </PriceValue>
                    </PriceCard>

                    <AddressCard>
                      <AddressCardHeader>
                        <Ionicons name="location-outline" size={RFValue(16)} color={theme.colors.primary} />
                        <AddressCardHeaderText>
                          {translate('finishTrip.text_address')}
                        </AddressCardHeaderText>
                      </AddressCardHeader>

                      <AddressRow>
                        <TimelineLine />

                        <AddressLineItem>
                          <MarkerColumn>
                            <Ball />
                          </MarkerColumn>
                          <AddressText>{completedTripData?.origin?.address}</AddressText>
                        </AddressLineItem>

                        {stopsCount > 0 && (
                          <AddressLineItem>
                            <MarkerColumn />
                            <StopsBadge
                              activeOpacity={0.7}
                              onPress={() => setShowStops(current => !current)}
                            >
                              <StopsBadgeText>
                                {translate('finishTrip.stops_count', {count: stopsCount})}
                              </StopsBadgeText>
                              <Ionicons
                                name={showStops ? 'chevron-up' : 'chevron-down'}
                                size={RFValue(12)}
                                color={theme.colors.text_gray}
                              />
                            </StopsBadge>
                          </AddressLineItem>
                        )}

                        {stopsCount > 0 &&
                          showStops &&
                          completedTripData?.tripWayPoints?.map((wayPoint, index) => (
                            <AddressLineItem key={index}>
                              <MarkerColumn>
                                <Ball variant="waypoint" />
                              </MarkerColumn>
                              <AddressText>{wayPoint?.address}</AddressText>
                            </AddressLineItem>
                          ))}

                        <AddressLineItem isLast>
                          <MarkerColumn>
                            <Square />
                          </MarkerColumn>
                          <AddressText>{completedTripData?.destination?.name}</AddressText>
                        </AddressLineItem>
                      </AddressRow>
                    </AddressCard>

                    <SectionTitleRow>
                      <SectionTitleDivider />
                      <SectionTitleText>
                        {translate('finishTrip.rate_our_partners')}
                      </SectionTitleText>
                      <SectionTitleDivider />
                    </SectionTitleRow>

                    <CardComment
                      onPressInput={scrollToEnd}
                      trip={completedTripData}
                      setStates={setState}
                    />

                    <SubmitButton
                      activeOpacity={0.7}
                      onPress={confirmTrip}
                      disabled={states?.loading}
                    >
                      {states?.loading ? (
                        <ActivityIndicator size="small" color={theme.colors.primaryText} />
                      ) : (
                        <>
                          <Ionicons name="paper-plane-outline" size={RFValue(16)} color={theme.colors.primaryText} />
                          <SubmitButtonText>
                            {translate('contactUs.text_button_send')}
                          </SubmitButtonText>
                        </>
                      )}
                    </SubmitButton>
                  </>
                )
              )}
            </ResultScroll>
          </ResultContainer>
          </SafeAreaProvider>
        </Modal>
      </If>
      <If condition={tripSchedule !== undefined}>
        <Modal visible={visible}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ScrollView>
            <Container>
              <Header>
                <ButtonBack
                  onPress={() => {
                    AsyncStorage.removeItem('tripSchedule');
                    closeModal();
                  }}
                >
                  <AntDesign name="close" size={30} color="black" />
                </ButtonBack>
              </Header>
              {/* <RoutesImage source={require('../../assets/images/rotas.png')} /> */}
              {tripSchedule && Object.keys(tripSchedule).length > 0 && (
                <Content>
                  <Title>{translate('schedule.local')}</Title>
                  <SubTitle>{tripSchedule?.origin.address}</SubTitle>
                  <Title>{translate('schedule.value')}</Title>
                  <TripValue>
                    {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                    {maskMoney(parseFloat(tripSchedule?.price))}
                  </TripValue>
                  {tripSchedule?.recalculatedPrice && (
                    <SubTitle recalculed>Recalculado</SubTitle>
                  )}

                  <Title>{translate('schedule.evaluation')}</Title>
                  <DriverInfoContainer>
                    <DriverProfilePicture
                      source={{uri: tripSchedule?.driver.profilePicture}}
                    />
                    <DriverRatingContainer>
                      <DriverRating>
                        {parseFloat(tripSchedule?.driver.rating)
                          .toFixed(1)
                          .replace('.', ',')}
                      </DriverRating>
                      <AntDesign name="star" size={10} color="orange" />
                    </DriverRatingContainer>
                  </DriverInfoContainer>
                  <SubTitle>{tripSchedule?.driver.name}</SubTitle>
                  <StarRatings />
                  <CommentBox
                    multiline
                    numberOfLines={2}
                    placeholder={translate('schedule.text_commentary')}
                    onChangeText={text => setState({comment: text})}
                    defaultValue={states?.comment}
                  />
                  <SendEvaluationButton
                    onPress={async () => {
                      const result = await handleAvaliationDriver(
                        states?.comment,
                      );
                      setState({comment: ''});
                      if (result) {
                        AsyncStorage.removeItem('tripSchedule');
                        closeModal();
                      }
                    }}
                    style={({pressed}) => [
                      {
                        backgroundColor: pressed
                          ? shade(0.08, theme.colors.background_global)
                          : theme.colors.primary,
                      },
                    ]}
                  >
                    {({pressed}) => (
                      <SendEvaluationButtonText pressed={pressed}>
                        OK
                      </SendEvaluationButtonText>
                    )}
                  </SendEvaluationButton>
                </Content>
              )}
            </Container>
          </ScrollView>
          </SafeAreaProvider>
        </Modal>
      </If>
    </>
  );
}
