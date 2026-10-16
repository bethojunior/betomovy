import { useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { ActivityIndicator, View } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import DriverSearch from '../DriverSearch';
import { useTrip } from '../../contexts/Trip';

import { Container } from './styles';
import {
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_SEARCHING_DRIVER_OFFER,
} from '../../constants/trip';
import { ModalOfferTrip } from '../ModalOfferTrip';
import theme from '../../styles/theme';
import { MessageProps, NotificationMessage } from '~/components/NotificationMessage';
import { buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import Push from '../../services/push';
import { translate } from '../../locales';
import { ChatRealtime } from '../../services/realtime/ChatRealtime';
import { TripProps } from '../../contexts/Trip/types';
import TripContentInProgressView from '../TripContentInProgress/tripView';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';

interface TripContentProps {
  setModalDriverData: (data: boolean) => void;
  trip: TripProps;
  setTrip: (trip: TripProps) => void;
}

const bottomInset = initialWindowMetrics?.insets?.bottom ?? 0;

function TripContentView({ setModalDriverData, trip, setTrip }: TripContentProps) {
  const [newMessage, setNewMessage] = useState(false);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const [statusType, setStatusType] = useState('');
  const [tripReferenceCurrent, setTripReferenceCurrent] = useState(null);

  const { tripRealtime } = useTripRealtime();
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const { handleTripStateChange } = useTrip();
  const { user } = useAuth();

  const unsubscribeRef = useRef<string | null>(null);

  const tripReference = useMemo(() => trip?.tripReference, [trip?.tripReference]);

  const navigation = useNavigation<any>();

  const conditionComponentTrip = [
    STATUS_SEARCHING,
    STATUS_SCHEDULED && trip?.driver === null,
    STATUS_SEARCHING_DRIVER_OFFER,
  ].includes(trip?.status);

  const mountSong = async () => {
    const { sound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/status-trip.mp3'),
    );
    return sound;
  };

  const unsubscribeTripListener = () => {
    if (unsubscribeRef.current) {
      tripRealtime.unsubscribe(unsubscribeRef.current);
      unsubscribeRef.current = null;
    }
  };

  useEffect(() => {
    if (!tripReference) {
      setTripReferenceCurrent(null);
      setStatusType(null);
      return;
    }

    if (tripReferenceCurrent === tripReference) {
      return;
    }

    unsubscribeTripListener();
    setTripReferenceCurrent(tripReference);

    const onTripUpdate: TripCallback = async ({ data, type }) => {
      if (['accepted', 'boarding', 'in_progress', 'finished'].includes(data.status)) {
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

          setStatusType(data.status);
        }
      }
      if (['added', 'modified'].includes(type)) {
        setTrip(data);
      }

      if (type === 'removed') {
        await AsyncStorage.setItem('trip', JSON.stringify(data));
        await handleTripStateChange(data.tripReference, unsubscribeTripListener);
      }
    };

    unsubscribeRef.current = tripRealtime.getTrip(tripReference, onTripUpdate);
  }, [tripReference]);

  useEffect(() => {
    if (tripReference) {
      const unsubscribe = chatRealtime.getLastMessageUnread(
        tripReference,
        ({ item, id }) => {
          if (item.message !== 'null') {
            if (item.userId != user?.idUser && !item.viewed && navigation.isFocused()) {
              Push.sendSimple({
                title: `${
                  (trip && trip?.driver?.nickname) || translate('trip.title_driver')
                } ${translate('trip.body_notify')}`,
                body: item.message,
              });
              setMessage(item);
              setNewMessage(true);
            }
          }
        },
      );

      return () => unsubscribe();
    }
  }, [tripReference]);

  return (
    <>
      <Container
        bottomInset={bottomInset}
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
          <TripContentInProgressView trip={trip} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
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
        onRead={() => setNewMessage(false)}
        onDismiss={() => setMessage(null)}
      />
    </>
  );
}

export default TripContentView;
