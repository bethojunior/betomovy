import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useAuth} from '../../../context/auth';
import {STATUS_BOARDING} from '../../constants/trip';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import {ContentProgressTime, ProgressBarrer, TextTime} from './styles';

interface Props {
  visible: boolean;
}

export const ProgressBar = ({visible}: Props) => {
  const {cityConfig} = useAuth();
  const {stateTripCustomer} = useTrip();
  const {trip} = stateTripCustomer;
  const [percent, setPercent] = useState(0);

  const [showCountTime, setShowCountTime] = useState(false);

  let dateFinal = new Date();

  let dateStart = new Date();

  const difTime = cityConfig?.waitingTimeCustomerCancellationFee;

  const calculatePercentTime = async () => {
    const max = (dateFinal.getTime() - dateStart.getTime()) / 1000;

    const now = (dateFinal.getTime() - new Date().getTime()) / 1000;

    let result = 100 - (now * 100) / max;

    result = result < 100 ? result : 100;

    setPercent(result);

    if (result >= 100) {
      return '';
    }

    return setTimeout(() => {
      calculatePercentTime();
    }, 1000);
  };

  const startCount = async () => {
    const date = new Date(
      JSON.parse(await AsyncStorage.getItem('customerWaitTime')),
    );
    dateFinal = new Date(date.setSeconds(date.getSeconds() + Number(difTime)));
    dateStart = date;
    await calculatePercentTime();
  };

  useEffect(() => {
    if (trip?.status === STATUS_BOARDING) {
      AsyncStorage.setItem('customerWaitTime', JSON.stringify(new Date()));
      dateFinal = new Date();
      dateFinal.setSeconds(dateFinal.getSeconds() + Number(difTime));
      dateStart = new Date();
      calculatePercentTime();
      setShowCountTime(true);
    }
  }, [trip]);
  return (
    <ContentProgressTime
      visible={showCountTime && trip?.status === STATUS_BOARDING && visible}
    >
      <ProgressBarrer width={percent} />
      {percent >= 100 ? (
        <TextTime>{translate('statusTrip.title_time_exceeded')}</TextTime>
      ) : (
        <TextTime>{translate('trip.driver_waiting_time')}</TextTime>
      )}
    </ContentProgressTime>
  );
};
