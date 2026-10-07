import {useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

interface Props {
  children?: React.ReactNode;
}

export const AnimationIconFly = ({children}) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 10],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
};
