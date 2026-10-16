import { ActivityIndicator, Dimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import { useTheme } from "styled-components/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { Container, SimpleTitle, SimpleTitleContainer } from "./styles";
import { scheduleOnRN } from "react-native-worklets";
import { translate } from "~/client/locales";
import { useEffect } from "react";
import { MaterialIcons } from '@expo/vector-icons/';
import { transformColorInHex } from "../../utils/color";

const BUTTON_WIDTH = Dimensions.get('window').width * 0.8;
const DRAG_THRESHOLD = BUTTON_WIDTH / 2;

interface AnimatedDragButtonProps {
  statusTrip: string;
  onPressButton: () => void;
  text: string;
}

interface ReanimatedIconProps {
  statusTrip: string;
}

export const AnimatedDragButton: React.FC<AnimatedDragButtonProps> = ({ text, onPressButton, statusTrip }) => {
  const translateX = useSharedValue(0);
  const theme = useTheme();
  const primaryColor = transformColorInHex(theme.colors.primary);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value >= DRAG_THRESHOLD) {
        scheduleOnRN(onPressButton);
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Container>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(50),
              backgroundColor: primaryColor,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
            },
            animatedStyle,
          ]}
        >
          <ReanimatedIcon statusTrip={statusTrip} />
        </Animated.View>
      </GestureDetector>
      <SimpleTitleContainer>
        <SimpleTitle>{text}</SimpleTitle>
      </SimpleTitleContainer>
    </Container>
  );
};

export const ReanimatedIcon: React.FC<ReanimatedIconProps> = ({ statusTrip }) => {
  const { colors } = useTheme();
  const scale = useSharedValue(0.8);
  const translateX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ] as const,
  }));

  useEffect(() => {
    if (statusTrip === translate('statusTrip.loading')) return;
    scale.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    translateX.value = withRepeat(withTiming(6, { duration: 600 }), -1, true);
  }, [statusTrip]);

  if (statusTrip === translate('statusTrip.loading')) {
    return <ActivityIndicator size={25} color={colors.background_global} />;
  }

  return (
    <Animated.View style={[animatedStyles, { flexDirection: 'row' }]}>
      <MaterialIcons
        name="arrow-forward-ios"
        size={24}
        color={colors.primaryText}
      />
      <MaterialIcons
        name="arrow-forward-ios"
        size={24}
        color={colors.primaryText}
        style={{ marginLeft: -10 }}
      />
    </Animated.View>
  );
};
