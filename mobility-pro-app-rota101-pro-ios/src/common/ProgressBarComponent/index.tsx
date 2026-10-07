import {useEffect, useState} from 'react';
import {ProgressBar} from '../ProgressBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STATUS_BOARDING} from '../../client/constants/trip';

export const ProgressBarComponent = ({trip}: any) => {
  const [visible, setVisible] = useState(false);

  const clearAssyncStorage = async () => {
    // limpeza do cache da barra de progresso de inicio de viagem;
    await AsyncStorage.multiRemove(['startCountTime', 'startCounting']);
  };

  useEffect(() => {
    if (trip && trip?.status !== STATUS_BOARDING) {
      clearAssyncStorage();
      setVisible(false);
      return;
    }
    if (trip && trip?.status === STATUS_BOARDING) {
      setVisible(true);
    }
  }, [trip]);

  return visible ? <ProgressBar /> : null;
};
