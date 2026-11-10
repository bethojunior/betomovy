/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { Modal } from './styles';
import { useTripProvider } from '../../../context/Trip';
import { useUserDriver } from '../../../context/userDriver';
import { useTripStatusProvider } from '../../../context/TripStatus';
import { customToast } from '../../../../../utils/FlashMessage';
import { V1ModalCallTrip } from './v1';
import { translate } from '../../../../../client/locales';
import theme from '../../../styles/theme';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { emitDriverStatusChange } from '../../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../../utils/tripStatusChangeEmitter';
import { useAuth } from '../../../../../context/auth';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { DriverStatusType } from '../../../../../interfaces/driver';

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

  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const acceptTrip = useTripProvider((context) => context.acceptTrip);

  const trip: any = useTripProvider((context: any) => context.stateTrip.trip);

  const { userDriverFind, setUserDriverFind, song } = useUserDriver();
  const setStatusTrip: any = useTripStatusProvider(
    (context: any) => context.setStatusTrip,
  );

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { cityConfig } = useAuth();

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
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const defaultAnimationValue = () => {
    translateY.value = withTiming(heigthWindowSize, { duration: 800 });
    opacity.value = withTiming(0.7, { duration: 800 });
  };

  const countTimeAccept = async (second: number, timeLimit: number) => {
    if (!visible) {
      return 0;
    }

    // Corrida fica na tela até Aceitar, Recusar ou outro motorista pegar.
    // Progresso visual só até 100% — não fecha o modal por timer.
    const safeLimit = Math.max(Number(timeLimit) || 1, 1);
    const timeElapsed = Math.min((second * 100) / safeLimit, 100);

    setTimeToAccept(timeElapsed);

    if (timeElapsed >= 100) {
      return '';
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
      translateY.value = withTiming(0, { duration: 800 });
      opacity.value = withTiming(1, { duration: 800 });

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

  const closeCall = async () => {
    try {
      await song?.stopAsync();
    } catch (error) {
      console.log('erro', error);
    }
    Notifications.dismissAllNotificationsAsync().catch(() => {});
    receivedNotification = true;
    setTotalBonus(0);
    defaultAnimationValue();
    dispatchTrip({
      type: 'update',
      field: 'callDriverModal',
      arg: false,
    });
    dispatchTrip({
      type: 'update',
      field: 'trip',
      arg: {},
    });
    await AsyncStorage.removeItem('trip');
    await AsyncStorage.removeItem('tripError');
  };

  const startActiveTrip = (acceptedTrip: any) => {
    setStatusTrip(translate('statusTrip.accepted'));

    const updatedDriver = { ...userDriverFind, status: 'corrida' as DriverStatusType };
    setUserDriverFind(updatedDriver);
    const currentLocation = userDriverFind.latitude && userDriverFind.longitude
      ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
      : undefined;
    emitDriverStatusChange(updatedDriver, 'corrida', cityConfig, currentLocation);
    emitDriverLocation(updatedDriver, currentLocation, cityConfig);
    const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
    if (acceptedTrip?.tripReference) {
      emitTripStatusChange(acceptedTrip.tripReference, 'accepted', configCityId);
    }

    AsyncStorage.setItem('tripDriver', JSON.stringify(acceptedTrip));
    showInitModal(true);
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
    Notifications.dismissAllNotificationsAsync().catch(() => {});
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

        if (!result?.status) {
          AsyncStorage.setItem('tripError', 'indisponivel');
          customToast(result?.message || translate('driverTrip.text_error_accept_trip'), 'warning');
          closeCall();
          setLoading(false);
          return;
        }

        setTotalBonus(0);

        if (!result.isPreAcceptedTrip) {
          startActiveTrip(result.data);
        }

        closeCall();
        setRewardTrip(true);
        setLoading(false);

        return result.isPreAcceptedTrip ? undefined : navigate('Home');
      })
      .catch(() => {
        setPreloadVisible(false);
        try {
          song?.stopAsync();
        } catch {}
        showInitModal(false);
        receivedNotification = true;
        setLoading(false);
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
    const { width, height } = event.nativeEvent.layout;
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
