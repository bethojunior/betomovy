import {
  CotentTime,
  ProgressBarrer,
  ProgressContainer,
  TextTime,
  Time,
} from './styles';
import {useAuth} from '../../context/auth';
import {useEffect, useRef, useState} from 'react';
import {translate} from '../../client/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {diffSeconds} from '../../driver/src/utils/FormatDate';
import {AppState} from 'react-native';
import Helper from '../../driver/src/utils/Helper';

export const ProgressBar = () => {
  const {cityConfig} = useAuth();
  const [timeInPercent, setTimeInPercente] = useState(0);
  const currentTime = useRef(0);

  const secondsToExpire = Number(
    cityConfig?.waitingTimeCustomerCancellationFee,
  );

  const calculatePercent = () => {
    const percent = (currentTime.current / secondsToExpire) * 100;
    setTimeInPercente(percent);
  };

  const setTimeInBackground = async () => {
    const startTime = await AsyncStorage.getItem('startCountTime');
    if (!startTime) {
      return;
    }
    const timeDiff = diffSeconds(String(startTime));
    currentTime.current = currentTime.current + Number(timeDiff);
    return AsyncStorage.removeItem('startCountTime');
  };

  const setStartTime = async () => {
    const startCount = await AsyncStorage.getItem('startCounting');
    if (currentTime.current <= 1 && startCount) {
      const diff = diffSeconds(String(startCount));
      currentTime.current = Number(diff);
    }
    if (!startCount) {
      AsyncStorage.setItem('startCounting', JSON.stringify(new Date()));
    }
  };

  const showTimeLeft = () => {
    return secondsToExpire - currentTime.current || 0;
  };

  useEffect(() => {
    setStartTime();
  }, []);

  useEffect(() => {
    const emmiterBackground = AppState.addEventListener(
      'change',
      async state => {
        if (state === 'active') {
          return setTimeInBackground();
        }
        if (state === 'background') {
          return AsyncStorage.setItem(
            'startCountTime',
            JSON.stringify(new Date()),
          );
        }
      },
    );

    return () => {
      if (emmiterBackground) {
        emmiterBackground?.remove();
      }
    };
  }, []);

  useEffect(() => {
    const inteval = setInterval(() => {
      currentTime.current = currentTime.current + 1;
      calculatePercent();
    }, 1000);
    return () => clearInterval(inteval);
  }, [timeInPercent]);

  return (
    <ProgressContainer>
      <ProgressBarrer width={timeInPercent} />
      {timeInPercent >= 100 ? (
        <TextTime>{translate('statusTrip.title_time_exceeded')}</TextTime>
      ) : (
        <CotentTime>
          <TextTime>
            {translate('statusTrip.title_time_wait_customer')}
          </TextTime>
          <Time>{Helper.transformSecondsToMinutes(showTimeLeft())}</Time>
        </CotentTime>
      )}
    </ProgressContainer>
  );
};
