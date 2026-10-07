import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Anima a entrada/saída de uma folha (bottom sheet) via translateY,
 * independente do fade do backdrop do <Modal>. Evita o animationType="slide"
 * nativo, que desliza a tela inteira (fundo + conteúdo) de uma vez.
 */
export function useSlideUpAnimation(visible: boolean, offset = 500) {
  const translateY = useSharedValue(offset);

  useEffect(() => {
    translateY.value = withTiming(visible ? 0 : offset, {
      duration: visible ? 280 : 200,
    });
  }, [visible]);

  return useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
}
