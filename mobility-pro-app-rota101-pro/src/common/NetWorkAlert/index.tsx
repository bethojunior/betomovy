import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ContainerModal, TextModal} from './styles';
import {useEffect, useState} from 'react';
import {useAuth} from '../../context/auth';
import {useNetwork} from '../../context/ConfigGlobal';

export const NetWorkAlert = () => {
  const [backgroundColor, setBackgroundColor] = useState('#e31818');
  const translateY = useSharedValue(-100);
  const {itsNetwork} = useNetwork();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      backgroundColor: backgroundColor,
    };
  });

  const toggleAnimation = () => {
    if (!itsNetwork) {
      setBackgroundColor('#e31818');
      translateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    } else {
      setBackgroundColor('green');
      setTimeout(() => {
        translateY.value = withTiming(-100, {
          duration: 1000,
          easing: Easing.out(Easing.exp),
        });
      }, 1000);
    }
  };

  useEffect(() => {
    toggleAnimation();
  }, [itsNetwork]);

  return (
    <ContainerModal style={animatedStyle}>
      <TextModal>
        Sua conexão está instável, verifique sua conexão com a internet.
      </TextModal>
    </ContainerModal>
  );
};
