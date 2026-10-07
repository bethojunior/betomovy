import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import {
  BodyArrow,
  ButtonTargetContainer,
  TextTarget,
} from "./styles"
import { useEffect } from "react";
import { ButtonTargetProps } from "./types";

const widthValue = -1000

export const ButtonTarget = ({
  text,
  visible,
  setVisible,
  callback,
  seconds = 1,
  secondsToHide = null
}: ButtonTargetProps) => {

  const arrow = useSharedValue(widthValue);
  const opacity = useSharedValue(1)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: arrow.value }],
    opacity: opacity.value,
  }));

  const hideTarget = () => {
    arrow.value = withTiming(1000, { duration: 1000 * seconds });
    setTimeout(() => {
      opacity.value = 0
      arrow.value = withTiming(-1000, { duration: 1000 * seconds });
      setVisible(false)
    }, 1000 * (seconds * 2))
  }

  useEffect(() => {
    if (visible) {
      opacity.value = 1
      arrow.value = withTiming(0, { duration: 1000 * seconds });
      if (secondsToHide) {
        setTimeout(() => {
          hideTarget()
        }, 1000 * secondsToHide)
      }
    }
  }, [visible])

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        zIndex: 10,
        bottom: 0,
        width: widthValue,
      }, animatedStyles]}>
      <ButtonTargetContainer
        onPressOut={() => {
          hideTarget();
          setVisible(false);
          callback && callback()
        }}>
        <BodyArrow>
          <TextTarget>
            {text}
          </TextTarget>
        </BodyArrow>
      </ButtonTargetContainer>
    </Animated.View>
  )
}