import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTripProvider } from '../../context/Trip';
import { useUserDriver } from '../../context/userDriver';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import { TRIP_CENTRAL } from '../../constants/trip';

function showConfirmAlert(
  title: string,
  message: string,
  onConfirm: () => void,
) {
  Alert.alert(
    title,
    message,
    [
      { text: translate('tripDriver.no'), style: 'cancel' },
      { text: translate('tripDriver.yes'), onPress: onConfirm },
    ],
    { cancelable: false },
  );
}

export function useCardScheduleActions() {
  const { userDriverFind } = useUserDriver();
  const { goBack } = useNavigation();
  const [loading, setLoading] = useState(false);

  const cancelTripSchedule: any = useTripProvider(
    (context: any) => context.cancelTripSchedule,
  );
  const acceptScheduled: any = useTripProvider(
    (context: any) => context.acceptScheduled,
  );

  const cancelTrip = async (tripReference: string) => {
    setLoading(true);
    const data = await cancelTripSchedule(TRIP_CENTRAL, userDriverFind.idDriver, tripReference);
    customToast(data.message, data.status ? 'success' : 'danger');
    setLoading(false);
    goBack();
  };

  const acceptTrip = async (tripReference: string) => {
    setLoading(true);
    const data = await acceptScheduled(parseInt(userDriverFind?.idDriver), tripReference);
    if (!data.status) {
      setLoading(false);
      return customToast(data.message, 'danger');
    }
    customToast(data.message, 'success');
    setLoading(false);
    goBack();
  };

  const handleAcceptTrip = (tripReference: string) => {
    showConfirmAlert(
      translate('tripDriver.accept_trip'),
      translate('tripDriver.want_to_accept_this_trip'),
      () => acceptTrip(tripReference),
    );
  };

  const handleCancelTrip = (tripReference: string) => {
    showConfirmAlert(
      translate('tripDriver.cancel_trip'),
      translate('tripDriver.want_to_cancel_this_trip'),
      () => cancelTrip(tripReference),
    );
  };

  return { loading, handleAcceptTrip, handleCancelTrip };
}
