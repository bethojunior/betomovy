import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useTripProvider } from '../../context/Trip';
import { useAuth } from '../../../../context/auth';
import { useUserDriver } from '../../context/userDriver';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { emitTripStatusChange } from '../../utils/tripStatusChangeEmitter';
import { DriverStatusType } from '../../../../interfaces/driver';
import { readRideCallNotice } from '../../utils/rideCallNotification';

export const TripNotificationListener = () => {
  const {
    stateTrip: { trip },
    acceptTrip,
    dispatchTrip,
  } = useTripProvider((context) => context);

  const { userDriverFind, setUserDriverFind } = useUserDriver();
  const { cityConfig } = useAuth();
  const hasFetchedLaunchResponse = useRef(false);
  const processedNoticesRef = useRef<Set<string>>(new Set());
  const tripRef = useRef(trip);
  const userDriverRef = useRef(userDriverFind);
  const cityConfigRef = useRef(cityConfig);

  useEffect(() => {
    tripRef.current = trip;
  }, [trip]);

  useEffect(() => {
    userDriverRef.current = userDriverFind;
  }, [userDriverFind]);

  useEffect(() => {
    cityConfigRef.current = cityConfig;
  }, [cityConfig]);

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
    const currentTripState = tripRef.current;
    const currentUser = userDriverRef.current;
    const currentCityConfig = cityConfigRef.current;

    if (actionIdentifier === 'accept') {
      const currentTrip = currentTripState?.tripReference ? currentTripState : notificationData;
      const currentDriverId = currentUser?.idDriver;

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
        ...currentUser,
        status: 'corrida' as DriverStatusType,
      };
      setUserDriverFind(updatedUser);

      const currentLocation =
        currentUser?.latitude && currentUser?.longitude
          ? { latitude: currentUser.latitude, longitude: currentUser.longitude }
          : undefined;

      emitDriverStatusChange(updatedUser, 'corrida', currentCityConfig, currentLocation);

      const configCityId = currentCityConfig?.cityId ? String(currentCityConfig.cityId) : undefined;
      emitTripStatusChange(currentTrip.tripReference, 'accepted', configCityId);
    }

    if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      const notice = readRideCallNotice(notificationData) || readRideCallNotice(rawData);
      if (!notice) return;

      const dedupeKey = `tap:${notice.userId}:${notice.callType || ''}`;
      if (processedNoticesRef.current.has(dedupeKey)) return;
      processedNoticesRef.current.add(dedupeKey);

      dispatchTrip({
        type: 'update',
        field: 'notificationTripCallRequest',
        arg: { userId: notice.userId, callType: notice.callType },
      });
    }
  };

  useEffect(() => {
    if (!hasFetchedLaunchResponse.current) {
      hasFetchedLaunchResponse.current = true;
      Notifications.getLastNotificationResponseAsync().then((lastResponse) => {
        if (lastResponse) {
          handleNotificationResponse(lastResponse);
        }
      });
    }

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

        const isStopCall =
          parsedData?.action === 'stop_call' ||
          parsedData?.tag === 'stop_call' ||
          data?.action === 'stop_call' ||
          data?.tag === 'stop_call' ||
          parsedData?.call === false ||
          parsedData?.tag === 'trip_expired' ||
          parsedData?.tag === 'notify_customer_on_trip_expired';

        if (isStopCall) {
          Notifications.dismissAllNotificationsAsync();
          dispatchTrip({
            type: 'update',
            field: 'callDriverModal',
            arg: false,
          });
          return;
        }

        const notice = readRideCallNotice(parsedData) || readRideCallNotice(data);
        if (!notice) return;

        const dedupeKey = `recv:${notice.userId}:${notice.callType || ''}:${notification?.request?.identifier || ''}`;
        if (processedNoticesRef.current.has(dedupeKey)) return;
        processedNoticesRef.current.add(dedupeKey);

        dispatchTrip({
          type: 'update',
          field: 'notificationTripCallRequest',
          arg: { userId: notice.userId, callType: notice.callType },
        });
      },
    );

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

  return null;
};
