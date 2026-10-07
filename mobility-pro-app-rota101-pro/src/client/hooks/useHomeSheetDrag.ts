import { useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const COMPACT_DRAG_THRESHOLD = 40;

/**
 * isCompact é state React normal, sem shared value nem altura medida — decide
 * só ao soltar o dedo (onEnd) e o conteúdo compactável é escondido/mostrado
 * por render condicional de verdade, não por animação de altura. Isso evita
 * de vez a classe de bug que já apareceu 4x (gesto recriado, onFinalize
 * brigando com onEnd, contentHeight oscilando/desatualizado): sem medida
 * nenhuma envolvida, o conteúdo nunca fica dessincronizado do que é
 * mostrado (ex.: excluir um endereço recente e o card não encolher).
 */
export function useHomeSheetDrag() {
  const [isCompact, setIsCompact] = useState(false);

  const dragGesture = useMemo(
    () =>
      Gesture.Pan().onEnd(event => {
        if (event.translationY > COMPACT_DRAG_THRESHOLD) {
          runOnJS(setIsCompact)(true);
        } else if (event.translationY < -COMPACT_DRAG_THRESHOLD) {
          runOnJS(setIsCompact)(false);
        }
      }),
    [],
  );

  return { isCompact, dragGesture };
}
