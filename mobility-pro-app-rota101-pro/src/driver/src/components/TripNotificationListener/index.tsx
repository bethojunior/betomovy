import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useTripProvider } from '../../context/Trip';
import { useAuth } from '../../../../context/auth';
import { useUserDriver } from '../../context/userDriver';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { DriverStatusType } from '../../../../interfaces/driver';

export const TripNotificationListener = () => {
  const {
    stateTrip: { trip },
    acceptTrip,
    dispatchTrip,
  } = useTripProvider((context) => context);

  const { userDriverFind, setUserDriverFind } = useUserDriver();
  const { cityConfig } = useAuth();

  const handleNotificationResponse = async (response: Notifications.NotificationResponse) => {
    const rawData = response?.notification?.request?.content?.data ?? {};
    let notificationData = rawData;
    try {
      if (rawData?.additionalData) {
        notificationData =
          typeof rawData.additionalData === 'string'
            ? JSON.parse(rawData.additionalData)
            : rawData.additionalData;
      }
    } catch {}

    const actionIdentifier = response.actionIdentifier;

    if (actionIdentifier === 'accept') {
      const currentTrip = trip?.tripReference ? trip : notificationData;
      const currentDriverId = userDriverFind?.idDriver;

      if (!currentTrip?.tripReference || !currentDriverId) {
        return;
      }

      const estimatedTime =
        currentTrip?.estimatedTimeDriverArrival ??
        notificationData?.estimatedTimeDriverArrival ??
        0;
      const distance =
        currentTrip?.distanceDriverArrival ??
        notificationData?.distanceDriverArrival ??
        0;

      await acceptTrip(
        String(currentDriverId),
        currentTrip.tripReference,
        estimatedTime,
        distance,
      );

      const updatedUser = {
        ...userDriverFind,
        status: 'corrida' as DriverStatusType,
      };
      setUserDriverFind(updatedUser);

      const currentLocation =
        userDriverFind?.latitude && userDriverFind?.longitude
          ? { latitude: userDriverFind.latitude, longitude: userDriverFind.longitude }
          : undefined;

      emitDriverStatusChange(updatedUser, 'corrida', cityConfig, currentLocation);

      const configCityId = cityConfig?.cityId ? String(cityConfig.cityId) : undefined;
      emitTripStatusChange(currentTrip.tripReference, 'accepted', configCityId);
    }

    if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      const userId = notificationData?.userId ?? rawData?.userId;
      if (userId == null) return;

      dispatchTrip({
        type: 'update',
        field: 'notificationTripCallRequest',
        arg: { userId: parseInt(userId), callType: notificationData?.tripCallTypeId },
      });
    }
  };

  useEffect(() => {
    // Verificar se app foi aberto por toque em notificação
    Notifications.getLastNotificationResponseAsync().then((lastResponse) => {
      if (lastResponse) {
        handleNotificationResponse(lastResponse);
      }
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse,
    );

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification?.request?.content?.data ?? {};
        let parsedData = data;
        try {
          if (data?.additionalData) {
            parsedData =
              typeof data.additionalData === 'string'
                ? JSON.parse(data.additionalData)
                : data.additionalData;
          }
        } catch {}

        const tag = data?.tag || parsedData?.tag;
        const action = data?.action || parsedData?.action;

        const isRideCall =
          tag === 'rideRequest' ||
          tag === 'notifyDriversClose' ||
          action === 'rideRequest' ||
          action === 'tripCall' ||
          parsedData?.tripReference;

        if (isRideCall && (parsedData?.userId != null || data?.userId != null)) {
          const userId = parsedData?.userId ?? data?.userId;
          const callType = parsedData?.tripCallTypeId ?? data?.tripCallTypeId;
          dispatchTrip({
            type: 'update',
            field: 'notificationTripCallRequest',
            arg: { userId: parseInt(userId), callType },
          });
        }
      },
    );

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, [userDriverFind?.idDriver, trip?.tripReference, cityConfig]);

  return null;
};
