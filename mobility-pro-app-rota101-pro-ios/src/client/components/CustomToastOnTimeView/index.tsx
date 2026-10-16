import {useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {Error} from '../Input/styles';

export const CustomToastOnTimeView = ({
  isVisible,
  message,
  duration,
  setError,
}) => {
  if (!isVisible) return null;
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setVisible(false);
        setError({
          visible: false,
          message: '',
        });
      }, duration);
    }
  }, []);

  return (
    <Animated.View
      style={{
        opacity: visible ? 1 : 0,
        transform: [
          {
            translateY: visible ? 0 : -100,
          },
        ],
      }}
    >
      <Error>{message}</Error>
    </Animated.View>
  );
};
