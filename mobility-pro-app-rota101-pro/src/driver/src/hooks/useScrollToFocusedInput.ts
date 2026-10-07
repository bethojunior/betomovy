import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView } from 'react-native';
import { ScrollToFocusedInputResult } from './types';

/**
 * Rola um ScrollView pra trazer o campo focado pra cima do teclado nativo
 * (sem lib de terceiro tipo KeyboardAwareScrollView). Mesma técnica já usada
 * no ModalDoorHandleManual, extraída aqui pra reuso.
 *
 * Uso: `scrollRef`/`onScroll` no ScrollView, `ref` num wrapper por linha de
 * campo, `onPressIn={() => scrollToRow(rowRef)}` no TextInput da linha.
 */
export function useScrollToFocusedInput(keyboardHeight: number): ScrollToFocusedInputResult {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const keyboardScreenYRef = useRef<number | null>(null);
  const pendingRowRef = useRef<React.RefObject<any> | null>(null);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, e => {
      keyboardScreenYRef.current = e.endCoordinates.screenY;
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardScreenYRef.current = null;
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // measureInWindow nos dois views dá coords absolutas de tela.
  // O scrollOffset cancela na subtração, então targetY é independente
  // do offset atual — não há race com animação em curso.
  const performScroll = useCallback((rowRef: React.RefObject<any>, kbScreenY: number) => {
    if (!rowRef.current || !scrollRef.current) return;
    scrollRef.current.measureInWindow((_sx: number, svY: number, _sw: number, svH: number) => {
      rowRef.current?.measureInWindow((_rx: number, rowY: number, _rw: number, rowH: number) => {
        const effectiveBottom = Math.min(svY + svH, kbScreenY);
        const delta = rowY + rowH - effectiveBottom + 24;
        if (delta > 0) {
          scrollRef.current?.scrollTo({ y: scrollOffsetRef.current + delta, animated: true });
        }
      });
    });
  }, []);

  const scrollToRow = useCallback(
    (rowRef: React.RefObject<any>) => {
      if (!rowRef.current || !scrollRef.current) return;
      if (keyboardScreenYRef.current !== null) {
        performScroll(rowRef, keyboardScreenYRef.current);
        return;
      }
      pendingRowRef.current = rowRef;
    },
    [performScroll],
  );

  // Após o re-render que aplica paddingBottom, aguarda 150ms para o native
  // layer commitar o layout expandido antes de medir e chamar scrollTo.
  useEffect(() => {
    if (keyboardHeight > 0 && pendingRowRef.current !== null && keyboardScreenYRef.current !== null) {
      const row = pendingRowRef.current;
      const kbY = keyboardScreenYRef.current;
      pendingRowRef.current = null;
      const id = setTimeout(() => performScroll(row, kbY), 150);
      return () => clearTimeout(id);
    }
  }, [keyboardHeight, performScroll]);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  return { scrollRef, scrollToRow, onScroll };
}
