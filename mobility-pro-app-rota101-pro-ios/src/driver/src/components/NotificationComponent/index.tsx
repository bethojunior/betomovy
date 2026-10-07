import {useEffect} from 'react';
import {ButtonFloatContainer} from '../../../../client/components/FloatButton/styles';
import theme from '../../styles/theme';
import NotificationButton from '../NotificationButton';
import {Animated as Animation} from 'react-native';
import {useAuth} from '../../../../context/auth';
import * as Notifications from 'expo-notifications';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';

interface NotificationComponentProps {
  onPress?: () => void;
}

export const NotificationComponent = ({
  onPress,
}: NotificationComponentProps) => {
  const aminating = new Animation.Value(0);

  const {notification, setNewActionFb, newActionFb, getNotification} =
    useAuth();
  const {itsNetwork} = useNetwork();
  const {stateTrip, refuseTrip, dispatchTrip} = useTripProvider();
  const {song, trip, tripAccepted} = stateTrip;
  const {userDriverFind, getDriverFind} = useUserDriver();

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
        (newActionFb === 'updateStatusDocuments' ||
          newActionFb === 'changeStatusDriver')
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

  const notificationsActions = async () => {
    await Notifications.requestPermissionsAsync();
    Notifications.addNotificationResponseReceivedListener(
      async optionChoosed => {
        Notifications.dismissAllNotificationsAsync();

        if (optionChoosed.actionIdentifier === 'reject') {
          try {
            await song?.stopAsync();
          } catch (error) {
            console.log('erro', error);
          }
          await refuseTrip(
            Number(userDriverFind.idDriver),
            trip?.tripReference,
          );
          dispatchTrip({
            type: 'update',
            field: 'callDriverModal',
            arg: false,
          });
        }
      },
    );
  };

  useEffect(() => {
    notificationsActions();
  }, [itsNetwork]);

  return (
    <ButtonFloatContainer
      style={{
        backgroundColor: haveNotification()
          ? theme.colors.background_global
          : theme.colors.primary,
      }}
    >
      <Animation.View style={{transform: [{rotate: rotation}]}}>
        <NotificationButton isAnimating onPress={onPress} />
      </Animation.View>
    </ButtonFloatContainer>
  );
};
