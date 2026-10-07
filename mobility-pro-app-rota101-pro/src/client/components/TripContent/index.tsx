import { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { ActivityIndicator } from 'react-native';
import DriverSearch from '../DriverSearch';
import TripContentInProgress from '../TripContentInProgress';
import { useTrip } from '../../contexts/Trip';

import { Container, LoadingContainer } from './styles';
import {
  STATUS_ACCEPTED,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_SEARCHING_DRIVER_OFFER,
} from '../../constants/trip';
import { ModalOfferTrip } from '../ModalOfferTrip';
import theme from '../../styles/theme';
import { MessageProps, NotificationMessage } from '~/components/NotificationMessage';
import { buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import { ChatRealtime } from '../../services/realtime/ChatRealtime';
import { TripProps } from '../../contexts/Trip/types';

interface TripContentProps {
  setModalDriverData: (data: boolean) => void;
}

function TripContent({ setModalDriverData }: TripContentProps) {
  const [newMessage, setNewMessage] = useState(false);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const messageIdRef = useRef<string | null>(null);

  const { tripRealtime } = useTripRealtime();
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const { handleTripStateChange, stateTripCustomer, dispatchTripCustomer } = useTrip();
  const { user } = useAuth();

  const { trip, tripPartnerList, partnerTripsReference } = stateTripCustomer;
  const navigation = useNavigation<any>();
  const tripPartnerListLocal = [...tripPartnerList];

  const tripReferenceConnected = useRef(partnerTripsReference);

  const tripReference = useMemo(() => trip?.tripReference, [trip?.tripReference]);

  const lastTripPartner = tripPartnerList[tripPartnerList.length - 1];

  let tripUpdateEvent: string | null = null;
  let statusType: string | null = null;

  const conditionComponentTrip = [
    STATUS_SEARCHING,
    STATUS_SCHEDULED && trip?.driver === null,
    STATUS_SEARCHING_DRIVER_OFFER,
  ].includes(trip?.status || lastTripPartner?.status);

  const mountSong = async () => {
    const { sound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/status-trip.mp3'),
    );
    return sound;
  };

  const clearTripUpdateEvent = () => {
    if (!!tripUpdateEvent) {
      tripRealtime.unsubscribe(tripUpdateEvent);
      tripUpdateEvent = null;
    }
    statusType = null;
  };

  const onTripUpdate: TripCallback = async ({ data, type }) => {
    const statusTypes = ['accepted', 'boarding', 'in_progress', 'finished'];

    if (statusTypes.includes(data.status)) {
      if (statusType !== data.status) {
        mountSong().then(async (soung) => {
          Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
          await soung?.playAsync().then(() => {});
        });

        statusType = data.status;
      }
    }

    if (['added', 'modified'].includes(type)) {
      dispatchTripCustomer({ type: 'update', field: 'trip', arg: data });
      await AsyncStorage.setItem('trip', JSON.stringify(data));
    }

    if (type === 'removed') {
      await handleTripStateChange(data.tripReference);
      clearTripUpdateEvent();
    }
  };

  useEffect(() => {
    if (!!tripReference && !tripUpdateEvent) {
      tripUpdateEvent = tripRealtime.getTrip(tripReference, onTripUpdate);
    }
  }, [tripReference]);

  const updateTripPartnerList = (trips: TripProps[]) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'tripPartnerList',
      arg: trips,
    });

    if (trips.length > 0) {
      AsyncStorage.setItem('tripPartnerList', JSON.stringify(trips));
      return;
    }
    AsyncStorage.removeItem('tripPartnerList');
  };

  const updateTripsReference = (tripReference: string[]) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'partnerTripsReference',
      arg: tripReference,
    });
  };

  useEffect(() => {
    const unsubscribes = new Map();

    tripPartnerListLocal?.map((trip) => {
      if (!tripReferenceConnected.current.includes(trip.tripReference)) {
        const onTripUpdate: TripCallback = async ({ data, type }) => {
          if (!tripReferenceConnected.current.includes(data.tripReference)) {
            tripReferenceConnected.current = [
              ...tripReferenceConnected.current,
              trip.tripReference,
            ];
            updateTripsReference([...tripReferenceConnected.current, trip.tripReference]);
          }

          if (['added', 'modified'].includes(type)) {
            const trips = tripPartnerListLocal?.filter((tripPartner) => {
              return tripPartner.tripReference !== trip.tripReference;
            });

            updateTripPartnerList([...trips, data]);

            if ([STATUS_ACCEPTED].includes(data?.status)) {
              navigation.navigate('TripRoutes', { screen: 'Home' });
            }
          }

          if (type === 'removed') {
            const tripReferences = tripReferenceConnected.current.filter(
              (tripReference) => tripReference !== trip.tripReference,
            );

            const trips = tripPartnerListLocal.filter((tripPartner) => {
              return tripPartner.tripReference !== trip.tripReference;
            });

            updateTripPartnerList(trips);

            tripReferenceConnected.current = [...tripReferences];
            updateTripsReference(tripReferences);

            await handleTripStateChange(trip.tripReference, () => {
              const _unsubscribe = unsubscribes.get(trip.tripReference);

              if (_unsubscribe) {
                tripRealtime.unsubscribe(_unsubscribe);
                unsubscribes.delete(trip.tripReference);
              }
            });
          }
        };

        const unsubscribe = tripRealtime.getTrip(trip.tripReference, onTripUpdate);
        unsubscribes.set(trip.tripReference, unsubscribe);
      }
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        tripRealtime.unsubscribe(unsubscribe);
      });
      unsubscribes.clear();
    };
  }, []);

  const handleMessageRead = () => {
    if (messageIdRef.current) {
      chatRealtime.setViewMessage(messageIdRef.current);

      messageIdRef.current = null;
    }

    setNewMessage(false);
  };

  useEffect(() => {
    if (tripReference) {
      const unsubscribe = chatRealtime.getLastMessageUnread(
        tripReference,
        ({ item, id }) => {
          if (item.message !== 'null') {
            if (item.userId != user?.idUser && !item.viewed && navigation.isFocused()) {
              messageIdRef.current = id;
              setMessage(item);
              setNewMessage(true);
            }
          }
        },
      );

      return () => {
        unsubscribe();
        messageIdRef.current = null;
      };
    }
  }, [tripReference]);

  return (
    <>
      <Container
        style={{
          shadowColor: theme.colors.primary,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 8,

          borderTopColor: theme.colors.primary,
          borderTopWidth: 0.1,
        }}
      >
        {conditionComponentTrip ? (
          <>
            {trip.status !== 'get_bid_by_drivers' ? (
              <DriverSearch />
            ) : (
              <ModalOfferTrip visible trip={trip} />
            )}
          </>
        ) : trip.driver ? (
          <TripContentInProgress
            setModalDriverData={setModalDriverData}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
          />
        ) : (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </LoadingContainer>
        )}
      </Container>

      <NotificationMessage
        visible={!!message?.message}
        message={message}
        isAudio={message?.isAudio}
        title={trip?.driver?.nickname}
        pictureUri={
          trip?.centralId === null
            ? trip?.driver?.profilePicture
            : `${buildApp().HOST_IMAGE_TRIP_TYPE}${trip?.fare?.picture}`
        }
        onPress={() => navigation.navigate('TripChat', { trip })}
        onRead={handleMessageRead}
        onDismiss={() => { setMessage(null); }}
      />
    </>
  );
}

export default TripContent;
