import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { Button, Wrapper } from './styles';

interface ScrollToTopButtonProps {
  scrollY: Animated.Value;
  onPress: () => void;
  nearTopThreshold?: number;
  safeDistance?: number;
}

export function ScrollToTopButton({
  scrollY,
  onPress,
  nearTopThreshold = 40,
  safeDistance = 24,
}: ScrollToTopButtonProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const lastValue = useRef(0);
  const accumulated = useRef(0);
  const direction = useRef<'up' | 'down' | null>(null);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const delta = value - lastValue.current;
      lastValue.current = value;

      if (value <= nearTopThreshold) {
        accumulated.current = 0;
        direction.current = null;
        setVisible(false);
        return;
      }

      if (delta === 0) return;

      const currentDirection = delta > 0 ? 'down' : 'up';

      if (currentDirection !== direction.current) {
        direction.current = currentDirection;
        accumulated.current = 0;
      }

      accumulated.current += Math.abs(delta);

      if (accumulated.current < safeDistance) return;

      setVisible(currentDirection === 'up');
    });

    return () => scrollY.removeListener(listenerId);
  }, [scrollY, nearTopThreshold, safeDistance]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      return;
    }

    Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, opacity]);

  if (!mounted) return null;

  return (
    <Wrapper
      pointerEvents={visible ? 'auto' : 'none'}
      style={{
        opacity,
        transform: [{ scale: opacity.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
      }}
    >
      <Button activeOpacity={0.8} onPress={onPress}>
        <MaterialIcons name="arrow-upward" size={22} color={theme.colors.primaryText} />
      </Button>
    </Wrapper>
  );
}
