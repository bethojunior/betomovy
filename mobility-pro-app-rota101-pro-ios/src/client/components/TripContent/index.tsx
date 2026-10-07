import {useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Audio} from 'expo-av';
import {ActivityIndicator, View, BackHandler} from 'react-native';
import {useDynamicAnimation} from 'moti';
import DriverSearch from '../DriverSearch';
import TripContentInProgress from '../TripContentInProgress';
import {useTrip} from '../../contexts/Trip';

import {Container} from './styles';
import {
  STATUS_ACCEPTED,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_SEARCHING_DRIVER_OFFER,
  STATUS_SEARCHING_FAVORITE,
} from '../../constants/trip';
import {ModalOfferTrip} from '../ModalOfferTrip';
import theme from '../../styles/theme';
import {NotificationModalMessage} from '../ModalMessage';
import {If} from '../If';
import {useAuth} from '../../../context/auth';
import Push from '../../services/push';
import {translate} from '../../locales';
import {TripRealtime} from '../../services/realtime/TripRealtime';
import {ChatRealtime} from '../../services/realtime/ChatRealtime';
import {MONEY_IN_LOCAL} from '../../constants/paymentFormType';
import apiMain from '../../api/apiMain';
import {TripProps} from '../../contexts/Trip/types';

interface TripContentProps {
  setModalDriverData: (data: boolean) => void;
}

function TripContent({setModalDriverData}: TripContentProps) {
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);
  const {handleTripStateChange, stateTripCustomer, dispatchTripCustomer} =
    useTrip();
  const {user} = useAuth();

  const {trip, tripPartnerList, partnerTripsReference} = stateTripCustomer;
  const [loading, setLoading] = useState(true);
  const [statusType, setStatusType] = useState('');
  const navigation = useNavigation();
  const [tripReferenceCurrent, setTripReferenceCurrent] = useState(null);
  const tripPartnerListLocal = [...tripPartnerList];

  const tripReferenceConnected = useRef(partnerTripsReference);

  const lastTripPartner = tripPartnerList[tripPartnerList.length - 1];

  const conditionComponentTrip = [
    STATUS_SEARCHING,
    STATUS_SCHEDULED && trip?.driver === null,
    STATUS_SEARCHING_DRIVER_OFFER,
    STATUS_SEARCHING_FAVORITE,
  ].includes(trip?.status || lastTripPartner?.status);

  const mountSong = async () => {
    const {sound} = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/status-trip.mp3'),
    );
    return sound;
  };

  const getTrip = async (tripReference: string) => {
    try {
      const {
        data: {data},
      } = await apiMain.post('trip/get', {stdObject: [{tripReference}]});
      return data;
    } catch (error) {
      console.log('error', error);

      return false;
    }
  };

  useEffect(() => {
    if (Object.keys(trip).length === 0) {
      setTripReferenceCurrent(null);
      setLoading(false);
      return;
    }
    if (trip.tripReference !== tripReferenceCurrent) {
      setTripReferenceCurrent(trip.tripReference);
      if (trip.tripReference) {
        tripRealtime.getTrip(trip.tripReference, (trip, type) => {
          if (
            ['accepted', 'boarding', 'in_progress', 'finished'].includes(
              trip.status,
            )
          ) {
            if (statusType !== trip.status) {
              mountSong().then(async soung => {
                Audio.setAudioModeAsync({
                  allowsRecordingIOS: false,
                  staysActiveInBackground: true,
                  playsInSilentModeIOS: true,
                  shouldDuckAndroid: true,
                  playThroughEarpieceAndroid: false,
                });
                await soung?.playAsync().then(() => {});
              });

              setStatusType(trip.status);
            }
          }
          if (['added', 'modified'].includes(type)) {
            dispatchTripCustomer({type: 'update', field: 'trip', arg: trip});
            AsyncStorage.setItem('trip', JSON.stringify(trip));
          }

          if (type === 'removed') {
            handleTripStateChange();
          }
        });
      }
    }
    setLoading(false);
  }, [trip]);

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
    tripPartnerListLocal?.map(trip => {
      if (!tripReferenceConnected.current.includes(trip.tripReference)) {
        tripRealtime.getTrip(trip.tripReference, (trip, type) => {
          if (!tripReferenceConnected.current.includes(trip.tripReference)) {
            tripReferenceConnected.current = [
              ...tripReferenceConnected.current,
              trip.tripReference,
            ];
            updateTripsReference([
              ...tripReferenceConnected.current,
              trip.tripReference,
            ]);
          }

          if (['added', 'modified'].includes(type)) {
            const trips = tripPartnerListLocal?.filter(tripPartner => {
              return tripPartner.tripReference !== trip.tripReference;
            });

            updateTripPartnerList([...trips, trip]);

            if ([STATUS_ACCEPTED].includes(trip?.status)) {
              navigation.navigate('TripRoutes', {screen: 'Home'});
            }
          }

          if (type === 'removed') {
            const tripReferences = tripReferenceConnected.current.filter(
              tripReference => tripReference !== trip.tripReference,
            );

            const trips = tripPartnerListLocal.filter(tripPartner => {
              return tripPartner.tripReference !== trip.tripReference;
            });

            updateTripPartnerList(trips);

            tripReferenceConnected.current = [...tripReferences];
            updateTripsReference(tripReferences);

            handleTripStateChange(trip.tripReference);
          }
        });
      }
    });
  }, []);

  const [newMessage, setNewMessage] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const animationMessage = useDynamicAnimation(() => {
    return {
      transform: [{translateY: 500}],
    };
  });

  // [TODO]: Falta atualizacao de back para funcionar
  // const sendNotification = async () => {
  //   if (trip.status === STATUS_IN_PROGRESS) {
  //     const response = await getTrip(trip.tripReference);
  //     if (
  //       response &&
  //       String(response?.paymentFormTypeId) === String(MONEY_IN_LOCAL)
  //     ) {
  //       await pushNative({
  //         title: `<b> ${translate(
  //           'statusTrip.dont_forget_your_money',
  //         )} 💡 </b>`,
  //         body: `💰 ${translate(
  //           'statusTrip.you_need_to_pay_the_full_amount_the_driver_at_end_of_the_trip',
  //         )}`,
  //       });
  //     }
  //   }
  // };

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

  useEffect(() => {
    if (trip.tripReference) {
      chatRealtime.getLastMessageUnread(trip.tripReference, ({item, id}) => {
        if (item.message !== 'null') {
          if (
            // eslint-disable-next-line eqeqeq
            item.userId != user?.idUser &&
            !item.viewed &&
            navigation.isFocused()
          ) {
            Push.sendSimple({
              title: `${
                (trip && trip?.driver?.nickname) ||
                translate('trip.title_driver')
              } ${translate('trip.body_notify')}`,
              body: item.message,
            });
            setMessage(item);
            setNewMessage(true);
            setNewMessageNotification(true);
          }
        }
      });
    }
    setLoading(false);
  }, [trip]);

  return (
    <>
      <If condition={message?.message && newMessage}>
        <NotificationModalMessage
          animationMessage={animationMessage}
          isAudio={message?.isAudio}
          message={message}
          setNewMessage={setNewMessage}
          setNewMessageNotification={setNewMessageNotification}
        />
      </If>
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
          <TripContentInProgress setModalDriverData={setModalDriverData} />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
        {loading && (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </Container>
    </>
  );
}

export default TripContent;
