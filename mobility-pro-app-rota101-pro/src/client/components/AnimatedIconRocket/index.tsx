import { useEffect, useRef } from "react";
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../styles/theme";
import { AnimatedIconRocketProps } from "./types";


const AnimationIconRocket = ({ size, color }: AnimatedIconRocketProps) => {
  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation.current, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation.current, {
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
            translateY: animation.current.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 10],
            }),
          },
        ],
      }}
    >
      <MaterialCommunityIcons
        name="rocket-launch"
        size={size || RFValue(24)}
        color={color || theme.colors.primary}
      />
    </Animated.View>
  );
};

export default AnimationIconRocket;