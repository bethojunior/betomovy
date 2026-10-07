import AsyncStorage from '@react-native-async-storage/async-storage';
import {TripInfo} from '../../driver/src/context/Trip/types';

export const VerifyPaymentForm = async (
  paymentForm: number,
  tripAccepted = null,
) => {
  const trip: TripInfo = tripAccepted
    ? tripAccepted
    : JSON?.parse(await AsyncStorage.getItem('tripDriver'));
  if (!trip) return 'tripDriver is empty';
  return Number(trip.paymentFormTypeId) === paymentForm ? true : false;
};

export const getMinutesAndSeconds = (time: number) => {
  if (!time) {
    return 0;
  }
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${seconds}`;
};
