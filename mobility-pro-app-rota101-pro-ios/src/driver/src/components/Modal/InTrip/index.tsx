/* eslint-disable no-unsafe-optional-chaining */
import {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, View} from 'react-native';
import {Feather, AntDesign, MaterialIcons} from '@expo/vector-icons/';
import {useDynamicAnimation} from 'moti';
import {useTheme} from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {maskMoney} from '../../../../../client/utils/money';
import {IsToShowField} from '../../../utils/cityConfig';
import {
  Address,
  AddressContent,
  Ball,
  Button,
  ButtonContent,
  ButtonMinizeModal,
  ClientContent,
  ClientName,
  ContentProgressTime,
  CotentTime,
  Dot,
  Line,
  Modal,
  MoreInfo,
  Picture,
  ProgressBarrer,
  SimpleText,
  SimpleTitle,
  Square,
  TextTime,
  Time,
} from './styles';
import {useTripProvider} from '../../../context/Trip';
import {
  STATUS_BOARDING_TRIP,
  STATUS_IN_PROGRESS,
} from '../../../constants/trip';
import {useTripStatusProvider} from '../../../context/TripStatus';
import {useAuth} from '../../../../../context/auth';
import {translate} from '../../../../../client/locales';
import {useUserDriver} from '../../../context/userDriver';
import {ModalCancellationReasons} from '../CancellationReason';
import {buildApp} from '../../../../../constantBuild/config';
import {customToast} from '../../../../../utils/FlashMessage';
import {If} from '../../If';
import {MessageProps, NotificationModalMessage} from '../../ModalMessage';
import theme from '../../../styles/theme';
import {CardInfoDriver} from '../../CardInfoDriver';
import Helper from '../../../utils/Helper';
import {ChatRealtime} from '../../../service/realtime/ChatRealtime';
import {RenderSvgImage} from '../../../../../common/RenderSvgImage';
import {TextWrapper} from '../../../../../common/TextWrapper';
import {DistanceComponent} from '../../DistanceInScreenComponent/Component';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  visibleCountPanic: boolean;
}

export const ModalInTrip = ({
  visible,
  setVisible,
  visibleCountPanic,
}: ModalProps) => {
  const {navigate, isFocused}: NavigationProp<ParamListBase> = useNavigation();
  const [cancellationReasonsModal, setCancellationReasonsModal] =
    useState(false);
  const [minimize, setMinimize] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showCountTime, setShowCountTime] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const [message, setMessage] = useState({} as MessageProps);
  const [markWaypoint, setMarkWaypoint] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [visibleCardInfo, setVisibleCardInfo] = useState(false);

  const {colors} = useTheme();
  const {cancel, dispatchTrip, stateTrip, priceToShow} = useTripProvider();
  const {checkStatusTrip, statusTrip, setStatusTrip} = useTripStatusProvider();
  const {cityConfig} = useAuth();
  const {userDriverFind} = useUserDriver();
  const [driverValue, setDriverValue] = useState('');
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const {tripAccepted, cancelTrip} = stateTrip;

  let dateFinal = new Date();
  let dateStart = new Date();
  const difTime = cityConfig?.waitingTimeCustomerCancellationFee;
  let counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);

  const animation = useDynamicAnimation(() => {
    return {
      transform: [{translateY: 500}],
    };
  });

  const animationMessage = useDynamicAnimation(() => {
    return {
      transform: [{translateY: 500}],
    };
  });

  const verifyChat = () => {
    if (
      tripAccepted.tripReference &&
      tripAccepted.tripCallType !== 'CHAMADA TAXÍMETRO'
    ) {
      chatRealtime.getLastMessageUnread(
        tripAccepted.tripReference,
        ({item, id}) => {
          if (
            Number(item?.userId) !== Number(userDriverFind?.userId) &&
            !item.viewed
          ) {
            setMessage(item);
            setNewMessage(true);
            setNewMessageNotification(true);
          }
        },
      );
    }
  };

  useEffect(() => {
    if (visible && tripAccepted && Object.keys(tripAccepted).length > 0) {
      animation.animateTo({
        opacity: 1,
        transform: [{translateY: 0}],
      });
      verifyChat();
    } else {
      animation.animateTo({
        transform: [{translateY: 500}],
        opacity: 0.7,
      });
    }
    if (tripAccepted?.status === 'in_progress') {
      changeHeight(true);
    }
  }, [visible, tripAccepted]);

  const calculatePercentTime = async () => {
    const max = (dateFinal.getTime() - dateStart.getTime()) / 1000;

    const now = (dateFinal.getTime() - new Date().getTime()) / 1000;

    let result = 100 - (now * 100) / max;

    result = result < 100 ? result : 100;

    counter -= 1;
    setWaitTime(counter);
    setPercent(result);

    if (result >= 100) {
      counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);
      return '';
    }

    return setTimeout(() => {
      calculatePercentTime();
    }, 1000);
  };

  const startCount = async () => {
    const date = new Date(
      JSON.parse(await AsyncStorage.getItem('customerWaitTime')),
    );
    dateFinal = new Date(date.setSeconds(date.getSeconds() + Number(difTime)));
    dateStart = date;
    await calculatePercentTime();
  };

  const cancelTripAccepted = async (cancellationReasonId: number) => {
    if (cancellationReasonId === null) {
      return customToast(
        translate('driverTrip.text_choose_reason_to_cancel'),
        'warning',
      );
    }

    cancelTrip.cancellationReasonsId = cancellationReasonId;
    dispatchTrip({type: 'update', field: 'cancelTrip', arg: cancelTrip});

    if (percent === 0) {
      await startCount();
    }

    if (tripAccepted.status === STATUS_BOARDING_TRIP && percent >= 100) {
      if (!Array.isArray(cityConfig)) {
        if (!!cityConfig.allowDriverGenerateCancellationFee === true) {
          // ESSE SWITH É PRA SE TRANSFORMAR EM UM RADIO DENTRO DO MODAL
          // DE ESCOLHA DO MOTIVO DE CANCELAMENTO
          return Alert.alert(translate('driverTrip.text_taxe_client'), '', [
            {
              text: translate('driverTrip.text_yes'),
              onPress: async () => {
                return cancelTripByDriver(true);
              },
            },
            {
              text: translate('driverTrip.text_no'),
              onPress: async () => {
                return cancelTripByDriver(false);
              },
            },
          ]);
        }
      }
      return cancelTripByDriver(true);
    }

    // GERAR TAXA DE CANCELAMENTO PARA O MOTORISTA, POIS O TEMPO NAO FOI EXCEDIDO
    return Alert.alert(
      translate('driverTrip.text_driver_taxe'),
      translate('driverTrip.text_driver_confirm_taxe'),
      [
        {
          text: translate('driverTrip.text_yes'),
          onPress: async () => {
            return cancelTripByDriver();
          },
        },
        {
          text: translate('driverTrip.text_no'),
          onPress: async () => {
            return '';
          },
        },
      ],
    );
  };

  const cancelTripByDriver = async (generateCancellationFee = true) => {
    cancelTrip.tripReference = tripAccepted.tripReference;
    cancelTrip.generateCancellationFee = generateCancellationFee;
    cancelTrip.driverId = Number(userDriverFind.idDriver);
    dispatchTrip({type: 'update', field: 'cancelTrip', arg: cancelTrip});

    cancel(false);

    animation.animateTo({
      transform: [{translateY: 500}],
      opacity: 0.7,
    });

    setTimeout(() => {
      setVisible(false);
    }, 5000);
  };

  const changeHeight = async (state: boolean) => {
    if (state) {
      animation.animateTo({
        maxHeight: '95%',
      });
      return setTimeout(() => setMinimize(true), 200);
    }

    animation.animateTo({
      maxHeight: '100%',
    });
    return setTimeout(() => setMinimize(false), 100);
  };

  const progressTrip = async () => {
    const {callback, status, waypoint} = await checkStatusTrip();

    if (!callback) {
      customToast(translate('driverTrip.text_error_update_trip'), 'warning');
      setStatusTrip(status);
    }

    if (status === translate('statusTrip.accepted') && callback === true) {
      AsyncStorage.setItem('customerWaitTime', JSON.stringify(new Date()));
      dateFinal = new Date();
      dateFinal.setSeconds(dateFinal.getSeconds() + Number(difTime));
      dateStart = new Date();
      calculatePercentTime();
      counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);
      setShowCountTime(true);
    }

    if (status === translate('statusTrip.in_progress') && callback === true) {
      setMarkWaypoint(0);
      setVisible(false);
    }

    if (status === translate('statusTrip.waypoint') && waypoint) {
      setMarkWaypoint(1);
    }
  };

  const setSwitchRead = async () => {
    try {
      const responseSwitchRead = await AsyncStorage.getItem(
        'switchRead-driver',
      );
      if (responseSwitchRead === null) {
        await AsyncStorage.setItem('switchRead-driver', 'true');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSwitchRead();
  }, []);

  useEffect(() => {
    if (newMessage)
      setTimeout(() => {
        setNewMessage(false);

        animationMessage.animateTo({
          transform: [{translateY: 500}],
          opacity: 0.7,
        });
      }, 5000);
  }, [newMessage]);

  const [originSize, setOriginSize] = useState(2);
  const [destinationSize, setDestinationSize] = useState(2);

  const changeSizeAddress = (
    state: number,
    setState: (val: number) => void,
  ) => {
    if (state === 2) {
      return setState(5);
    }
    setState(2);
  };

  return (
    <>
      <CardInfoDriver
        visible={visibleCardInfo}
        setVisible={setVisibleCardInfo}
        markWaypoint={markWaypoint}
      />
      <If condition={message?.message && newMessage}>
        <NotificationModalMessage
          animationMessage={animationMessage}
          isAudio={message?.isAudio}
          message={message}
          setNewMessage={setNewMessage}
          setNewMessageNotification={setNewMessageNotification}
        />
      </If>

      <Modal
        transition={{
          type: 'timing',
          duration: 900,
        }}
        state={animation}
        style={{
          shadowColor: theme.colors.black,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
        }}
      >
        <ButtonMinizeModal
          onPress={() => {
            changeHeight(!minimize);
          }}
        >
          <MaterialIcons
            name={minimize ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={30}
            style={{
              color: colors.primaryText,
            }}
          />
        </ButtonMinizeModal>
        <If condition={tripAccepted.status === STATUS_IN_PROGRESS}>
          <DistanceComponent />
        </If>
        {!minimize && (
          <>
            <ClientContent
              activeOpacity={0.8}
              onPress={() => {
                setVisibleCardInfo(true);
              }}
            >
              {tripAccepted?.centralId === null ? (
                <Picture
                  source={{
                    uri: `${buildApp().HOST_IMAGE_CUSTOMER}${
                      tripAccepted?.customer?.profileImage
                    }`,
                  }}
                />
              ) : (
                <RenderSvgImage
                  image={`${buildApp().HOST_IMAGE_TRIP_TYPE}${
                    tripAccepted?.fare?.picture
                  }`}
                  width={80}
                  heigth={80}
                />
              )}

              <ClientName>
                {tripAccepted?.customer?.name?.split(' ')[0]}{' '}
                {
                  tripAccepted?.customer?.name?.split(' ')[
                    tripAccepted?.customer?.name?.split(' ').length - 1
                  ]
                }
              </ClientName>
            </ClientContent>
            <ButtonContent>
              <Button
                onPress={() => {
                  setNewMessage(false);
                  setNewMessageNotification(false);
                  setVisible(false);
                  navigate('TripChatDriver', {
                    trip: tripAccepted,
                  });
                }}
              >
                <If condition={newMessageNotification}>
                  <Dot
                    from={{
                      opacity: 1,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      loop: true,
                    }}
                  />
                </If>

                <AntDesign name="message1" size={23} color={colors.primary} />
              </Button>
              <Button onPress={() => setCancellationReasonsModal(true)}>
                <Feather name="x" size={25} color={colors.primary} />
              </Button>
            </ButtonContent>
            <MoreInfo>
              {IsToShowField('paymentForm') && (
                <View>
                  <SimpleTitle>
                    {translate('callTrip.text_type_payment')}
                  </SimpleTitle>
                  <SimpleText>{tripAccepted?.tripPaymentForm}</SimpleText>
                </View>
              )}
              {IsToShowField('price') && cityConfig !== null && (
                <View>
                  <SimpleTitle>{translate('callTrip.text_price')}</SimpleTitle>
                  <SimpleText>
                    {cityConfig?.typeMoney} {Helper?.maskMoney(priceToShow())}
                  </SimpleText>
                </View>
              )}
            </MoreInfo>
            <AddressContent>
              <View style={{alignItems: 'center'}}>
                <Ball style={{marginTop: 5}} />
                <Line />
                {tripAccepted?.tripWayPoints?.length !== 0 &&
                  tripAccepted?.tripWayPoints?.map(() => (
                    <>
                      <Ball />
                      <Line />
                    </>
                  ))}
                <Square />
              </View>
              <View>
                {IsToShowField('origin') && (
                  <TextWrapper
                    text={tripAccepted?.origin?.address}
                    selected={statusTrip === translate('statusTrip.accepted')}
                    Children={Address}
                    initialNumber={2}
                    endNumber={5}
                  />
                )}

                {tripAccepted?.tripWayPoints?.length !== 0 &&
                  tripAccepted?.tripWayPoints?.map((waypoint, index) => {
                    return (
                      <TextWrapper
                        text={waypoint?.address}
                        selected={
                          statusTrip === translate('statusTrip.waypoint') &&
                          markWaypoint === index
                        }
                        key={index}
                        Children={Address}
                        initialNumber={2}
                        endNumber={5}
                      />
                    );
                  })}
                {IsToShowField('destination') && (
                  <TextWrapper
                    text={tripAccepted?.destination?.name}
                    selected={
                      statusTrip === translate('statusTrip.in_progress')
                    }
                    Children={Address}
                    initialNumber={2}
                    endNumber={5}
                  />
                )}
              </View>
            </AddressContent>
          </>
        )}

        <View
          style={{
            width: '98%',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <DragButton
            text={statusTrip}
            onPressButton={() => {
              setStatusTrip(translate('statusTrip.loading'));
              progressTrip();
            }}
            statusTrip={statusTrip}
          />
        </View>
      </Modal>
      <ModalCancellationReasons
        visible={cancellationReasonsModal}
        setVisible={setCancellationReasonsModal}
        cancelTripAccepted={cancelTripAccepted}
      />
    </>
  );
};

const BUTTON_WIDTH = Dimensions.get('window').width * 0.8;
const DRAG_THRESHOLD = BUTTON_WIDTH / 2;

const DragButton = ({text, onPressButton, statusTrip}) => {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      if (translateX.value >= DRAG_THRESHOLD) {
        runOnJS(onPressButton)();
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              {
                width: RFValue(50),
                height: RFValue(50),
                borderRadius: RFValue(50),
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              },
              animatedStyle,
            ]}
          >
            <ReanimatedComponent
              colors={theme.colors}
              translate={translate}
              statusTrip={statusTrip}
            />
          </Animated.View>
        </PanGestureHandler>
        <View
          style={{
            marginLeft: 15,
          }}
        >
          <SimpleTitle
            style={{
              fontFamily: 'MavenPro_600SemiBold',
              color: theme.colors.primaryText,
              fontSize: RFValue(20),
            }}
          >
            {text}
          </SimpleTitle>
        </View>
      </View>
    </View>
  );
};

const ReanimatedComponent = ({statusTrip, colors, translate}) => {
  const scale = useSharedValue(0.8);
  const translateX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}, {translateX: translateX.value}],
    };
  });

  useEffect(() => {
    scale.value = withRepeat(withTiming(1, {duration: 600}), -1, true);
    translateX.value = withRepeat(withTiming(6, {duration: 600}), -1, true);
  }, []);

  if (statusTrip === translate('statusTrip.loading')) {
    return <ActivityIndicator size={25} color={colors.background_global} />;
  }

  return (
    <Animated.View style={[animatedStyles, {flexDirection: 'row'}]}>
      <MaterialIcons
        name="arrow-forward-ios"
        size={25}
        style={{
          color: colors.primaryText,
        }}
      />
      <MaterialIcons
        name="arrow-forward-ios"
        size={25}
        style={{
          color: colors.primaryText,
          marginLeft: -10,
        }}
      />
    </Animated.View>
  );
};
