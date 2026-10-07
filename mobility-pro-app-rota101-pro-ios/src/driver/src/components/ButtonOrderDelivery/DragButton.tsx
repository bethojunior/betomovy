import {Dimensions, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import theme from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {ReanimatedComponentDelivery} from '.';
import {translate} from '../../../../client/locales';
import {SimpleTitle} from './styles';

const BUTTON_WIDTH = Dimensions.get('window').width * 0.8;
const DRAG_THRESHOLD = BUTTON_WIDTH / 2;

export const DragButtonDelivery = ({text, onPressButton, statusTrip}) => {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: () => {
      if (translateX.value >= DRAG_THRESHOLD) {
        runOnJS(onPressButton)();
        translateX.value = withSpring(0);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  return (
    <View
      style={{
        width: '100%',
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <PanGestureHandler onGestureEvent={gestureHandler}>
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
              // translate={translate}
              statusTrip={statusTrip}
            />
          </Animated.View>
        </PanGestureHandler>
        <View
          style={{
            marginLeft: 15,
          }}
        >
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
