import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

// Histerese: limiares diferentes pra entrar/sair de "perto do fim" — evita o
// card/botão piscando quando o scroll oscila bem em cima de um valor único.
const ENTER_NEAR_BOTTOM = 40;
const LEAVE_NEAR_BOTTOM = 120;

// Compartilhado entre as telas de chat (client/driver) — decide se o usuário
// está perto do fim da lista, pra saber quando auto-scrollar e quando mostrar
// o botão de "ir pro fim". `canScroll` distingue conversa curta (cabe na tela,
// nada pra rolar) de longa — sem isso, um card flutuante fixo ou cobre a
// única mensagem visível ou sobra espaço vazio reservado à toa.
export function useChatScrollPosition(scrollRef: React.RefObject<any>) {
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const viewportHeightRef = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

    setIsNearBottom(current => {
      if (current && distanceFromBottom > LEAVE_NEAR_BOTTOM) return false;
      if (!current && distanceFromBottom < ENTER_NEAR_BOTTOM) return true;
      return current;
    });
  }, []);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeightRef.current = event.nativeEvent.layout.height;
  }, []);

  const onContentSizeChange = useCallback((_width: number, contentHeight: number) => {
    setCanScroll(contentHeight > viewportHeightRef.current);
    if (isNearBottom) scrollRef.current?.scrollToEnd({ animated: true });
  }, [isNearBottom, scrollRef]);

  return { isNearBottom, canScroll, onScroll, onLayout, onContentSizeChange };
}
