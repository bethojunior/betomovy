import React, {useEffect, useState, useCallback} from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ContainerModal, TextModal} from './styles';

const PrepaidAlertMemo = React.memo(
  ({data}: any) => {
    const [backgroundColor, setBackgroundColor] = useState('#118906');
    const translateY = useSharedValue(-100);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
        backgroundColor: backgroundColor,
      };
    }, [backgroundColor]);

    const toggleAnimation = useCallback(() => {
      setBackgroundColor('green');
      translateY.value = withTiming(0, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }, [translateY]);

    useEffect(() => {
      toggleAnimation();
    }, []);

    return (
      <>
        {data && (
          <ContainerModal style={animatedStyle}>
            <TextModal>{data}</TextModal>
          </ContainerModal>
        )}
      </>
    );
  },
  (prevProps, nextProps) => prevProps.data === nextProps.data,
);

export default PrepaidAlertMemo;
