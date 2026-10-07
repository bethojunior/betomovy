import {TouchableOpacity} from 'react-native-gesture-handler';
import {MaterialIcons} from '@expo/vector-icons';
import theme from '../../styles/theme';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Animated} from 'react-native';

export const Mylocation = ({onPress}) => {
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);
  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );
  return (
    <PanGestureHandler onGestureEvent={onPanGestureEvent}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <MaterialIcons
          name="my-location"
          size={24}
          color={theme.colors.primaryText}
        />
      </TouchableOpacity>
    </PanGestureHandler>
  );
};
