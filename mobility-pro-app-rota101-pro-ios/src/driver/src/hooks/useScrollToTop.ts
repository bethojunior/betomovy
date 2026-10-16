import { useCallback, useRef } from 'react';
import { Animated, FlatList } from 'react-native';

interface UseScrollToTopOptions {
  scrollEventThrottle?: number;
}

export function useScrollToTop<T>({ scrollEventThrottle = 16 }: UseScrollToTopOptions = {}) {
  const listRef = useRef<FlatList<T>>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = useRef(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true }),
  ).current;

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return { listRef, scrollY, handleScroll, scrollToTop, scrollEventThrottle };
}
