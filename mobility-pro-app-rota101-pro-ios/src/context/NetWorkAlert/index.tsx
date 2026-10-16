import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ContainerModal, TextModal} from './styles';
import {useEffect, useRef, useState} from 'react';
import {translate} from '../../client/locales';

export const NetWorkAlert = ({itsNetwork}) => {
  const [backgroundColor, setBackgroundColor] = useState('#e31818');
  const translateY = useSharedValue(-100);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      backgroundColor: backgroundColor,
    };
  });

  const toggleAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!itsNetwork) {
      setBackgroundColor('#e31818');
      translateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    } else {
      setBackgroundColor('green');
      timeoutRef.current = setTimeout(() => {
        translateY.value = withTiming(-100, {
          duration: 1000,
          easing: Easing.out(Easing.exp),
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    toggleAnimation();
  }, [itsNetwork]);

  return (
    <ContainerModal style={animatedStyle}>
      <TextModal>
        {translate(
          'commom.your_connection_is_unstable_check_your_internet_connection',
        )}
      </TextModal>
    </ContainerModal>
  );
};
