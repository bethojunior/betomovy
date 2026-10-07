import { useEffect, useState } from 'react';
import { LayoutChangeEvent, View, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CollapseProps } from './typex';

const Collapse = ({ children, open, onPress }: CollapseProps) => {
  const [height, setHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const onLayoutHeight = event.nativeEvent.layout.height;

    if (onLayoutHeight > 0 && height !== onLayoutHeight) {
      setHeight(onLayoutHeight);
    }
  };

  const collapsableStyle = useAnimatedStyle(() => {
    animatedHeight.value = open ? withTiming(height) : withTiming(0);
    return {
      height: animatedHeight.value,
    };
  }, [open]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[collapsableStyle, { overflow: 'hidden' }]}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            paddingBottom: 2
          }}
          onLayout={onLayout}
        >
          {children}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Collapse;

export const CollapseDynamic = ({ children, open, onPress }: CollapseProps) => {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withTiming(open ? layoutHeight : 0, { duration: 300 });
  }, [open, layoutHeight]);

  const onLayout = event => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && height !== layoutHeight) {
      setLayoutHeight(height);
    }
  };

  const collapsableStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
      overflow: 'hidden',
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={collapsableStyle}>
        <View
          onLayout={onLayout}
          style={{ position: 'absolute', width: '100%', paddingBottom: 2 }}
        >
          {children}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
