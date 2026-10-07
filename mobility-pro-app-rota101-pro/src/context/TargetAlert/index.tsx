import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ContainerModal, TextModal} from './styles';
import {useEffect, useState} from 'react';
import {dataExpired, dataNow, isBeta} from '../../constantBuild/config';
import {AppState} from 'react-native';
import {If} from '../../client/components/If';
import { translate } from '../../client/locales';
import * as Application from 'expo-application';

interface Props {
  setBetaEnd: (value: boolean) => void;
  betaEnd: boolean;
}

export const TargetAlert = ({setBetaEnd, betaEnd}: Props) => {
  const [backgroundColor, setBackgroundColor] = useState('#e31818');
  const translateY = useSharedValue(-100);
  const [daysLeft, setDaysLeft] = useState(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      backgroundColor: backgroundColor,
    };
  });

  function getDaysUntilExpiration() {
    // Converta a data de expiração para milissegundos
    const expirationTime = new Date(dataExpired).getTime();

    // Calcule a diferença em milissegundos
    const differenceInMilliseconds = expirationTime - dataNow;

    // Converta a diferença para dias
    const differenceInDays = Math.ceil(
      differenceInMilliseconds / (1000 * 60 * 60 * 24),
    );
    setBetaEnd(false);
    if (differenceInDays <= 0) {
      setBetaEnd(true);
    }
    setDaysLeft(differenceInDays);
    return differenceInDays;
  }

  useEffect(() => {
    AppState.addEventListener('change', getDaysUntilExpiration);
    getDaysUntilExpiration();
  }, []);

  const toggleAnimation = () => {
    if (!betaEnd) {
      setBackgroundColor('green');
      translateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    } else {
      setBackgroundColor('#e31818');
      translateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  };

  const formatPhrase = () => {
    return translate('configPage.title_beta_version').replace(
      '[prop]', `${daysLeft}`
      )
  }

  useEffect(() => {
    toggleAnimation();
  }, [betaEnd]);

  return (
    <ContainerModal style={animatedStyle}>
      <If condition={!betaEnd}>
        <TextModal>
          {formatPhrase()} (v{Application.nativeApplicationVersion})
        </TextModal>
      </If>
      <If condition={betaEnd}>
        <TextModal>
          {translate('configPage.title_unavailable_beta_version')}
        </TextModal>
      </If>
    </ContainerModal>
  );
};
