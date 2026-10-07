import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { scheduleOnRN } from "react-native-worklets";

const DRAG_THRESHOLD = 100;

interface AnimatedActionButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  colors?: {
    primary?: string;
    primaryText?: string;
    background_global?: string;
  };
}

const AnimatedActionButton: React.FC<AnimatedActionButtonProps> = ({ text, onPress, loading = false, colors }) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(0, event.translationX);
    })
    .onEnd(() => {
      if (translateX.value >= DRAG_THRESHOLD) {
        scheduleOnRN(onPress);
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors?.primary || "#007bff" },
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.circle, animatedStyle]}>
            <ReanimatedIcon loading={loading} colors={colors} />
          </Animated.View>
        </GestureDetector>

        <View style={{ marginLeft: 15 }}>
          <Text
            style={[
              styles.text,
              { color: colors?.primaryText || "#fff" },
            ]}
          >
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const ReanimatedIcon = ({ loading, colors }) => {
  const scale = useSharedValue(0.8);
  const arrowTranslateX = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: arrowTranslateX.value },
    ] as const,
  }));

  useEffect(() => {
    scale.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    arrowTranslateX.value = withRepeat(
      withTiming(6, { duration: 600 }),
      -1,
      true
    );
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size={25} color={colors?.background_global || "#fff"} />
    );
  }

  return (
    <Animated.View style={[animatedStyles, { flexDirection: "row" }]}>
      <MaterialIcons
        name="arrow-forward-ios"
        size={25}
        color={colors?.primaryText || "#fff"}
      />
      <MaterialIcons
        name="arrow-forward-ios"
        size={25}
        color={colors?.primaryText || "#fff"}
        style={{ marginLeft: -10 }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  circle: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(30),
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    fontSize: RFValue(20),
    fontWeight: "600",
  },
});

export default AnimatedActionButton;
