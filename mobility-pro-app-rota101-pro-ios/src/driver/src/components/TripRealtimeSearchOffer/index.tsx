import {useEffect, useMemo, useState} from 'react';
import {useUserDriver} from '../../context/userDriver';
import {TripRealtime} from '../../service/realtime/TripRealtime';
import {useAuth} from '../../../../context/auth';
import {mountSong} from '../../utils/mountSong';
import {TripInfo} from '../../context/Trip/types';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {useNavigation} from '@react-navigation/native';
import {useTripProvider} from '../../context/Trip';

export const TripRealtimeSearchOffer = () => {
  const {userDriverFind} = useUserDriver();
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {cityConfig} = useAuth();
  const {openApp} = useBubbleButton();
  const {navigate} = useNavigation();
  const {stateTrip, dispatchTrip} = useTripProvider();
  const {tripsOffer} = stateTrip;

  const [tripsOfferList, setTripsOffer] = useState([...tripsOffer]);

  const initTripSearchOffer = (itsObserver = false) => {
    if (itsObserver) {
      return;
    }
    userDriverFind?.tripTypes?.map(item => {
      tripRealtime.getTripOffer(
        cityConfig?.cityId || userDriverFind?.cityId,
        item?.tripTypeId,
        async (tripFirebase: TripInfo, type: string) => {
          if (userDriverFind.status !== 'desligado') {
            await mountSong(
              require('../../assets/songs/scheduledTrip.mp3'),
            ).then(async sound => {
              await sound?.playAsync();
            });
          }
          if (type === 'added') {
            openApp();
            // colocando lista de ofertas
            await setTripsOffer([...tripsOffer, tripFirebase]);
            navigate('tripsOffer');
          }

          if (type === 'modified') {
            openApp();
            // atualizando lista de ofertas
            setTripsOffer(oldArray =>
              oldArray.map(item => {
                if (item.tripReference === tripFirebase.tripReference) {
                  return tripFirebase;
                }
                return item;
              }),
            );
          }

          if (type === 'removed') {
            openApp();
            setTripsOffer(oldArray =>
              oldArray.filter(
                item => item.tripReference !== tripFirebase.tripReference,
              ),
            );
          }
          // removendo lista de ofertas

          return '';
        },
      );
    });
  };

  useEffect(() => {
    initTripSearchOffer();
  }, []);

  useEffect(() => {
    // Atualizar o estado tripsOffer no dispatchTrip sempre que tripsOfferList for atualizado
    dispatchTrip({
      type: 'update',
      field: 'tripsOffer',
      arg: tripsOfferList,
    });
  }, [tripsOfferList]);

  return null;
};
