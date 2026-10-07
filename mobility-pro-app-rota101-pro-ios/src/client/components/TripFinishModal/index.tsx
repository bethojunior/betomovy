import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
  View,
  Keyboard,
} from 'react-native';
import {useEffect, useReducer, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AntDesign} from '@expo/vector-icons';
import {lighten, shade} from 'polished';
import {useTrip} from '../../contexts/Trip';

import {
  Address,
  AddressContent,
  Ball,
  ButtonBack,
  CommentBox,
  Container,
  ContainerButton,
  ContainerPrice,
  ContainerRow,
  ContainerText,
  Content,
  Destiny,
  DriverInfoContainer,
  DriverProfilePicture,
  DriverRating,
  DriverRatingContainer,
  Header,
  Line,
  SendEvaluationButton,
  SendEvaluationButtonText,
  Square,
  SubTitle,
  Title,
  TitleSmall,
  TripValue,
} from './styles';
import {coinTypePerApi, maskMoney} from '../../utils/money';
import StarRatings from '../StarRatings';
import {If} from '../If';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';
import {useTripGL} from '../../contexts/TripGL';
import {RFValue} from 'react-native-responsive-fontsize';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {AnimatedSlideY} from '../AnimatedSlideY';
import {CardComment} from '../CardComment';
import {CardTip} from '../CardTip';

export default function TripFinishModal({visible, closeModal, setVisible}) {
  const {handleAvaliationDriver, stateTripCustomer} = useTrip();
  const {completedTripData} = stateTripCustomer;
  const {tripStatus} = useTripGL();
  const {cityConfig} = useAuth();
  const [tripSchedule, setTripSchedule] = useState<any>();
  const [showAddress, setShowAddress] = useState(false);
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
    setState({comment: ''});
    if (result) {
      AsyncStorage.removeItem('tripSchedule');
    }
    closeModal();
    setState({loading: false});
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
          <KeyboardAvoidingView
            style={{
              flex: 1,
              backgroundColor: theme.colors.background_global,
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              ref={scrollViewRef}
              scrollEventThrottle={16}
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'green',
              }}
            >
              <Container>
                <Header>
                  <ButtonBack
                    onPress={async () => {
                      closeModal();
                      await confirmTrip();
                      AsyncStorage.removeItem('trip');
                    }}
                  >
                    <AntDesign
                      name="close"
                      size={RFValue(30)}
                      color={theme.colors.primary}
                    />
                  </ButtonBack>
                </Header>
                {completedTripData &&
                  Object.keys(completedTripData).length > 0 && (
                    <Content>
                      <Title>
                        {translate('finishTrip.title_success_finish')}
                      </Title>
                      <ContainerPrice>
                        <Title>
                          {switchCasePayment(
                            completedTripData?.tripPaymentFormId,
                          )}
                        </Title>
                        <TripValue>
                          {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                          {maskMoney(parseFloat(completedTripData?.price))}
                        </TripValue>
                      </ContainerPrice>

                      <SendEvaluationButton
                        onPress={() => {
                          setShowAddress(!showAddress);
                        }}
                      >
                        <ContainerButton>
                          <SendEvaluationButtonText>
                            {translate('finishTrip.text_address')}
                          </SendEvaluationButtonText>
                        </ContainerButton>

                        <AntDesign
                          name={showAddress ? 'up' : 'down'}
                          size={RFValue(25)}
                          color={theme.colors.primary}
                        />
                      </SendEvaluationButton>

                      <AnimatedSlideY
                        containerStyle={{}}
                        showAddress={showAddress}
                      >
                        <AddressContent>
                          <View style={{padding: 10}}>
                            <Ball color="primary" />
                            <Line />
                            {completedTripData?.tripWayPoints &&
                              completedTripData?.tripWayPoints?.length > 0 &&
                              completedTripData?.tripWayPoints?.map(() => (
                                <>
                                  <Ball color="secondary" />
                                  <Line />
                                </>
                              ))}
                            <Square />
                          </View>
                          <View style={{paddingRight: 20}}>
                            <Address>
                              {completedTripData?.origin?.address}
                            </Address>
                            {completedTripData?.tripWayPoints &&
                              completedTripData?.tripWayPoints?.length > 0 &&
                              completedTripData?.tripWayPoints?.map(
                                wayPoint => (
                                  <Address>{wayPoint?.address}</Address>
                                ),
                              )}
                            <Destiny>
                              {completedTripData?.destination?.name}
                            </Destiny>
                          </View>
                        </AddressContent>
                      </AnimatedSlideY>

                      <ContainerText>
                        <Title>
                          {translate('finishTrip.rate_our_partners')}
                        </Title>
                      </ContainerText>
                      <CardComment
                        onPressInput={scrollToEnd}
                        trip={completedTripData}
                        setStates={setState}
                      />
                      <SendEvaluationButton
                        onPress={confirmTrip}
                        style={({pressed}) => [
                          {
                            backgroundColor: pressed
                              ? shade(0.08, theme.colors.background_global)
                              : theme.colors.primary,
                          },
                        ]}
                        disabled={states?.loading}
                      >
                        <If condition={states?.loading}>
                          <ActivityIndicator
                            size="small"
                            color={theme.colors.background_global}
                          />
                        </If>
                        <If condition={!states?.loading}>
                          <SendEvaluationButtonText>
                            {translate('contactUs.text_button_send')}
                          </SendEvaluationButtonText>
                        </If>
                      </SendEvaluationButton>
                    </Content>
                  )}
              </Container>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </If>
      <If condition={tripSchedule !== undefined}>
        <Modal visible={visible}>
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
        </Modal>
      </If>
    </>
  );
}
