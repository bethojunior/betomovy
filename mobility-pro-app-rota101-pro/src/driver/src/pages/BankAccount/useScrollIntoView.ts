import { RefObject, useCallback } from 'react';
import {
  findNodeHandle,
  NativeSyntheticEvent,
  ScrollView,
  TextInputFocusEventData,
  UIManager,
} from 'react-native';

const TOP_OFFSET = 24;

/** Rola o ScrollView pra trazer o input focado pra cima do teclado — sem libs externas. */
export function useScrollIntoView(scrollRef: RefObject<ScrollView>) {
  return useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const inputHandle = findNodeHandle(event.target as any);
    const scrollHandle = findNodeHandle(scrollRef.current);
    if (!inputHandle || !scrollHandle) return;

    UIManager.measureLayout(
      inputHandle,
      scrollHandle,
      () => {},
      (_x, y) => {
        scrollRef.current?.scrollTo({ y: Math.max(y - TOP_OFFSET, 0), animated: true });
      },
    );
  }, [scrollRef]);
}
