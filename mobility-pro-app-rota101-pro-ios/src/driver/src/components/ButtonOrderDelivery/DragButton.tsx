import { Dimensions, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import { ReanimatedComponentDelivery } from '.';
import { SimpleTitle } from './styles';

const BUTTON_WIDTH = Dimensions.get('window').width * 0.8;
const DRAG_THRESHOLD = BUTTON_WIDTH / 2;

export const DragButtonDelivery = ({ text, onPressButton, statusTrip }) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value >= DRAG_THRESHOLD) {
        runOnJS(onPressButton)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                width: RFValue(50),
                height: RFValue(50),
                borderRadius: RFValue(50),
                backgroundColor: theme.colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              },
              animatedStyle,
            ]}
          >
            <ReanimatedComponentDelivery
              colors={theme.colors}
              statusTrip={statusTrip}
            />
          </Animated.View>
        </GestureDetector>

        <View style={{ marginLeft: 15 }}>
          <SimpleTitle
            style={{
              fontFamily: 'MavenPro_600SemiBold',
              color: theme.colors.primaryText,
              fontSize: RFValue(20),
            }}
          >
            {text}
          </SimpleTitle>
        </View>
      </View>
    </View>
  );
};
