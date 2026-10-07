/* eslint-disable radix */
import {useEffect, useState} from 'react';
import {Dimensions, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {Modal} from './styles';
import {useTripProvider} from '../../../context/Trip';
import {useUserDriver} from '../../../context/userDriver';
import {useTripStatusProvider} from '../../../context/TripStatus';
import {customToast} from '../../../../../utils/FlashMessage';
import {V1ModalCallTrip} from './v1';
import {translate} from '../../../../../client/locales';
import theme from '../../../styles/theme';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {STATUS_PRE_ACCEPTED} from '../../../constants/trip';

interface Props {
  visible: any;
  driverId: string;
  showInitModal: (boolean) => void;
  receivedNotification: boolean;
  setPreloadVisible: (val: boolean) => void;
}

export default function ModalCallTrip({
  visible,
  driverId,
  showInitModal,
  receivedNotification,
  setPreloadVisible,
}: Props) {
  const [totalBonus, setTotalBonus] = useState(0);
  const [timeToAccept, setTimeToAccept] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modeAccepted, setModeAccepted] = useState<any>();
  const [isMoved, setIsMoved] = useState(false);
  const [rewardTrip, setRewardTrip] = useState(true);
  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  const {acceptTrip, stateTrip, dispatchTrip, sendMessage} = useTripProvider();

  const {trip, tripAccepted, song} = stateTrip;
  const {userDriverFind, setUserDriverFind} = useUserDriver();
  const {setStatusTrip} = useTripStatusProvider();

  const {navigate}: NavigationProp<ParamListBase> = useNavigation();

  const version = 1;
  const heigthWindowSize = Dimensions.get('window').height;

  const switchCaseVersionLayout = (v: number) => {
    switch (v) {
      case 1:
        return (
          <View
            style={{
              flex: 1,
              position: 'relative',
            }}
          >
            <V1ModalCallTrip
              confirm={confirm}
              setLoading={setLoading}
              modeAccepted={modeAccepted}
              loading={loading}
              timeToAccept={timeToAccept}
              driverId={driverId}
              totalBonus={totalBonus}
              verifyToucheIsEnabled={verifyToucheIsEnabled}
              isMoved={() => setIsMoved(true)}
              layout={{
                width: parentWidth,
                height: parentHeight,
              }}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const translateY = useSharedValue(heigthWindowSize);
  const opacity = useSharedValue(0.7);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  const defaultAnimationValue = () => {
    translateY.value = withTiming(heigthWindowSize, {duration: 800});
    opacity.value = withTiming(0.7, {duration: 800});
  };

  const countTimeAccept = async (second: number, timeLimit: number) => {
    if (!visible) {
      return 0;
    }

    const timeElapsed = (second * 100) / timeLimit;

    setTimeToAccept(timeElapsed);

    if (timeElapsed > 100) {
      dispatchTrip({type: 'update', field: 'callDriverModal', arg: false});
      setRewardTrip(true);
      setTotalBonus(0);
      receivedNotification = true;
      try {
        await song?.stopAsync();
      } catch (error) {
        console.log('erro', error);
      }
      await AsyncStorage.removeItem('trip');
      return dispatchTrip({type: 'update', field: 'trip', arg: {}});
    }

    second += 1;

    setTimeout(() => {
      countTimeAccept(second, timeLimit);
    }, 1000);

    return '';
  };

  useEffect(() => {
    if (visible) {
      countTimeAccept(
        parseInt(trip.missingSeconds),
        parseInt(trip.timeLimitToAccept),
      );
    }

    const getModeToAccept = async () => {
      setModeAccepted(JSON.parse(await AsyncStorage.getItem('appSetting')));
    };

    getModeToAccept();
  }, [visible]);

  useEffect(() => {
    if (Object.keys(trip).length !== 0 && visible) {
      translateY.value = withTiming(0, {duration: 800});
      opacity.value = withTiming(1, {duration: 800});

      if (trip.tripLongDistance !== null) {
        setTotalBonus(trip?.tripLongDistance?.value);
      }

      if (trip.rewardTrip !== null && rewardTrip) {
        setRewardTrip(false);
        setTotalBonus(totalBonus + trip?.rewardTrip?.value);
      }
    } else {
      defaultAnimationValue();

      dispatchTrip({
        type: 'update',
        field: 'callDriverModal',
        arg: false,
      });
    }
  }, [trip]);

  const sendMessageBot = async (tripA, chatBotTripTypeId) => {
    setTimeout(() => {
      sendMessage(tripA.driver.userId, tripA.tripReference, chatBotTripTypeId);
    }, 6000);
  };

  const closeCall = async () => {
    try {
      await song?.stopAsync();
    } catch (error) {
      console.log('erro', error);
    }
    receivedNotification = true;
    setTotalBonus(0);
    defaultAnimationValue();
    await AsyncStorage.removeItem('trip');
    await AsyncStorage.removeItem('tripError');
  };

  const acceptPreAvailable = async tripP => {
    try {
      await song?.stopAsync();
    } catch (error) {
      console.log('erro', error);
    }
    await sendMessageBot(tripP, 2);
    receivedNotification = true;

    userDriverFind.preAvailableTrip = tripP;
    setUserDriverFind(userDriverFind);
    await AsyncStorage.setItem('preAvailableTrip', JSON.stringify(tripP));
    await AsyncStorage.setItem(
      'tripInWait',
      JSON.stringify(trip.tripReference),
    );
    await AsyncStorage.setItem('user', JSON.stringify(userDriverFind));

    dispatchTrip({type: 'update', field: 'tripPreAccepted', arg: tripP});

    closeCall();
    dispatchTrip({type: 'update', field: 'callDriverModal', arg: false});
    setRewardTrip(true);
    setTotalBonus(0);
    setLoading(false);

    // MOSTRAR BOTÃO PRO MOTORISTA OLHAR OS DADOS DA CORRIDA PRE ACEITA
  };

  const confirm = async () => {
    if (loading) {
      return;
    }
    receivedNotification = true;
    try {
      await song?.stopAsync();
    } catch (error) {
      console.log('erro', error);
    }
    defaultAnimationValue();
    setPreloadVisible(true);
    await acceptTrip(
      userDriverFind?.idDriver,
      trip.tripReference,
      trip.estimative.duration.value,
      trip.estimative.distance.value,
    )
      .then(result => {
        setPreloadVisible(false);
        if (!result.status) {
          AsyncStorage.setItem('tripError', 'indisponivel');
          return customToast(
            translate('driverTrip.text_error_accept_trip'),
            'danger',
          );
        }
        setTotalBonus(0);

        if (
          (userDriverFind?.preAvailable === '1' &&
            tripAccepted &&
            Object.keys(tripAccepted).length !== 0) ||
          result?.data?.status === STATUS_PRE_ACCEPTED
        ) {
          return acceptPreAvailable(result.data);
        }

        dispatchTrip({type: 'acceptTrip', arg: result.data});

        sendMessageBot(result.data, 1);
        closeCall();
        setStatusTrip(translate('statusTrip.accepted'));
        AsyncStorage.setItem('tripDriver', JSON.stringify(result.data));
        showInitModal(true);
        // FAZER FUNC DE CONFIRM NA HOME SO PRA PODER ABRIR O MODAL DE INIT
        // setIniTripModal(true);
        dispatchTrip({type: 'update', field: 'callDriverModal', arg: false});
        setRewardTrip(true);
        setLoading(false);
        return navigate('Home');
      })
      .catch(() => {
        translateY.value = withTiming(0, {duration: 800});
        opacity.value = withTiming(1, {duration: 800});
        setPreloadVisible(false);
        song.pauseAsync();
        showInitModal(false);
        receivedNotification = true;
        return closeCall();
      });
  };

  const verifyToucheIsEnabled = async () => {
    if (modeAccepted.enableTouch && !loading) {
      setIsMoved(false);
      confirm();
      setLoading(true);
    }
  };

  const onLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setParentWidth(width);
    setParentHeight(height);
  };

  return (
    <Modal
      onLayout={onLayout}
      style={[
        animatedStyle,
        {
          shadowColor: theme.colors.black,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
        },
      ]}
    >
      <V1ModalCallTrip
        confirm={confirm}
        setLoading={setLoading}
        modeAccepted={modeAccepted}
        loading={loading}
        timeToAccept={timeToAccept}
        driverId={driverId}
        totalBonus={totalBonus}
        verifyToucheIsEnabled={verifyToucheIsEnabled}
        isMoved={() => setIsMoved(true)}
        layout={{
          width: parentWidth,
          height: parentHeight,
        }}
      />
    </Modal>
  );
}
