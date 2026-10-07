import {useEffect, useMemo, useRef} from 'react';
import {useTripProvider} from '../../context/Trip';
import {TripRealtime} from '../../service/realtime/TripRealtime';
import { useNetwork } from '../../../../context/ConfigGlobal';
import {mountSong} from '../../utils/mountSong';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {useUserDriver} from '../../context/userDriver';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';

export const TripPreAcceptedComponent = ({setIniTripModal}) => {
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {clearDataPreAcceptedTrip, verifyExistTrip, clearDataTrip, stateTrip} =
    useTripProvider();
  const {tripPreAccepted, cancelTrip, tripAccepted} = stateTrip;
  const {itsNetwork} = useNetwork();
  const {openApp} = useBubbleButton();
  const {getDriverFind} = useUserDriver();

  const tripPreAcceptedRef = useRef({});

  const verify = async (tripReference: string, isPreAccepted = false) => {
    if (!itsNetwork) {
      return;
    }
    const response = await verifyExistTrip(tripReference);

    if (response && response.status === 'canceled') {
      await mountSong(
        require('../../assets/songs/alertClientCancelTrip.mp3'),
      ).then(async sound => {
        await sound?.playAsync();

        await openApp();
      });

      getDriverFind();

      if (
        isPreAccepted &&
        tripPreAccepted.tripReference !== undefined &&
        tripAccepted.tripReference !== tripPreAccepted.tripReference
      ) {
        customToast(
          translate(
            `finishTrip.text_trip_pre_accepted_cancelled_by_${
              response.canceledBy === 'customer'
            }`,
          ),
          'warning',
        );

        clearDataPreAcceptedTrip();
        return;
      }

      customToast(
        translate(
          `finishTrip.text_trip_cancelled_by_${
            response.canceledBy === 'customer'
          }`,
        ),
        'warning',
      );
      setIniTripModal(false);

      clearDataTrip();
    }
  };

  useEffect(() => {
    if (Object.keys(tripPreAccepted).length !== 0) {
      tripPreAcceptedRef.current = tripPreAccepted;
    }
  }, [tripPreAccepted]);

  useEffect(() => {
    if (Object.keys(tripPreAcceptedRef?.current)?.length !== 0) {
      tripRealtime.getTrip(
        tripPreAccepted.tripReference,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        async (tripFirebase, type: string) => {
          if (type === 'removed' && Object.keys(cancelTrip).length === 0) {
            verify(tripFirebase.tripReference, true);
          }
          return '';
        },
      );
    }
  }, [tripPreAccepted]);
  return null;
};
