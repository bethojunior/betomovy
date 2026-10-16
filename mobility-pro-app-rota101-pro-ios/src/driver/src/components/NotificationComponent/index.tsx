import { useEffect, useRef } from 'react';
import { ButtonFloatContainer } from '../../../../client/components/FloatButton/styles';
import theme from '../../styles/theme';
import NotificationButton from '../NotificationButton';
import { Animated as Animation } from 'react-native';
import { useAuth } from '../../../../context/auth';
import * as Notifications from 'expo-notifications';
import { useTripProvider } from '../../context/Trip';
import { useUserDriver } from '../../context/userDriver';
import { loadSession } from '../../../../utils/Storage/sessionStorage';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { DriverStatusType } from '../../../../interfaces/driver';

interface NotificationComponentProps {
  onPress?: () => void;
}

export const NotificationComponent = ({ onPress }: NotificationComponentProps) => {
  const aminating = new Animation.Value(0);

  const { notification, setNewActionFb, newActionFb, getNotification, cityConfig } =
    useAuth();

  const {
    stateTrip: { trip, tripAccepted },
    acceptTrip,
    refuseTrip,
    dispatchTrip,
  } = useTripProvider((context) => context);

  const { getDriverFind, userDriverFind, setUserDriverFind } = useUserDriver();

  const haveNotification = () => {
    if (
      notification.length !== 0 &&
      notification.some((item: any) => item.viewed === '0')
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (newActionFb.length > 0) {
      if (
        !tripAccepted?.status &&
        (newActionFb === 'updateStatusDocuments' || newActionFb === 'changeStatusDriver')
      ) {
        getDriverFind();
      }
      if (newActionFb === 'newNotificationApp') {
        getNotification();
        setNewActionFb('');
      }
    }
  }, [newActionFb]);

  useEffect(() => {
    haveNotification;
  }, [Notifications, notification]);

  const rotation = aminating.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-10deg', '10deg'],
  });
  useEffect(() => {
    const animationBell = Animation.loop(
      Animation.sequence([
        Animation.timing(aminating, {
          toValue: -1,
          duration: 100,
          delay: 800,
          useNativeDriver: true,
        }),
        Animation.timing(aminating, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animation.timing(aminating, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animation.timing(aminating, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animation.timing(aminating, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    );

    haveNotification() ? animationBell.start() : animationBell.stop();
  }, [haveNotification()]);

  const tripRef = useRef(trip);
  tripRef.current = trip;

  const getDriverIdFromSession = async (): Promise<number | undefined> => {
    const session = await loadSession();
    if (!session.isDriver || !session.user) return undefined;

    try {
      return JSON.parse(session.user)?.idDriver;
    } catch {
      return undefined;
    }
  };

  const getNotificationData = (optionChoosed: any) => {
    const rawData = optionChoosed.notification?.request?.content?.data ?? {};

    try {
      return rawData?.additionalData ? JSON.parse(rawData.additionalData) : rawData;
    } catch {
      return rawData;
    }
  };

  const processedActionsRef = useRef<Set<string>>(new Set());

  const handleNotificationResponse = async (optionChoosed: any) => {
    if (!optionChoosed) return;

    const notificationData = getNotificationData(optionChoosed);
    const dedupeKey = `${optionChoosed.actionIdentifier}:${notificationData?.tripReference}`;
    if (processedActionsRef.current.has(dedupeKey)) return;
    processedActionsRef.current.add(dedupeKey);

    Notifications.dismissAllNotificationsAsync();

    const currentTrip = tripRef.current;
    const currentDriverId = Number(await getDriverIdFromSession());

    if (optionChoosed.actionIdentifier === 'reject') {
      await refuseTrip(currentDriverId, currentTrip?.tripReference);
      dispatchTrip({
        type: 'update',
        field: 'callDriverModal',
        arg: false,
      });
    }

    if (optionChoosed.actionIdentifier === 'accept') {
      const result = await acceptTrip(
        currentDriverId?.toString(),
        notificationData?.tripReference,
        notificationData?.estimatedTimeDriverArrival,
        notificationData?.distanceDriverArrival,
      );

      if (!result?.status) {
        customToast(translate('driverTrip.text_error_accept_trip'), 'warning');
        return;
      }

      if (!result.isPreAcceptedTrip) {
        const updatedUser = { ...userDriverFind, status: 'corrida' as DriverStatusType };
        setUserDriverFind(updatedUser);

        const currentLocation =
          userDriverFind.latitude && userDriverFind.longitude
            ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
            : undefined;

        emitDriverStatusChange(updatedUser, 'corrida', cityConfig, currentLocation);

        const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
        emitTripStatusChange(notificationData?.tripReference, 'accepted', configCityId);
      }
    }

    if (optionChoosed.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      const userId = notificationData?.userId;
      if (userId == null) return;

      dispatchTrip({
        type: 'update',
        field: 'notificationTripCallRequest',
        arg: { userId: parseInt(userId), callType: notificationData?.tripCallTypeId },
      });
    }
  };

  const pendingResponseRef = useRef<any>(null);
  const hasFetchedLaunchResponse = useRef(false);

  const notificationsActions = async () => {
    if (!hasFetchedLaunchResponse.current) {
      hasFetchedLaunchResponse.current = true;
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        const doesNotDependOnTripContext =
          lastResponse.actionIdentifier === 'accept' ||
          lastResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER;

        if (doesNotDependOnTripContext) {
          handleNotificationResponse(lastResponse);
        } else {
          pendingResponseRef.current = lastResponse;
        }
      }
    }
  };

  useEffect(() => {
    notificationsActions();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const pending = pendingResponseRef.current;
    if (!pending) return;
    if (!trip?.tripReference) return;

    pendingResponseRef.current = null;
    handleNotificationResponse(pending);
  }, [trip?.tripReference]);

  return (
    <ButtonFloatContainer
      style={{
        backgroundColor: haveNotification()
          ? theme.colors.background_global
          : theme.colors.primary,
      }}
    >
      <Animation.View style={{ transform: [{ rotate: rotation }] }}>
        <NotificationButton isAnimating onPress={onPress} />
      </Animation.View>
    </ButtonFloatContainer>
  );
};
