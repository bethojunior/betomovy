import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';

type PendingAction = (() => void) | null;

export function useModal(initialVisible = false) {
  const [visible, setVisible] = useState(initialVisible);
  const pendingActionRef = useRef<PendingAction>(null);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  /**
   * Fecha o modal e passa a vez pra `action` (ex: abrir o próximo modal).
   * No iOS espera o onDismiss; no Android roda na hora.
   */
  const handOff = useCallback((action: () => void) => {
    if (Platform.OS === 'ios') {
      pendingActionRef.current = action;
      setVisible(false);
    } else {
      action();
    }
  }, []);

  /**
   * Roda a action pendente de handOff quando o modal termina de fechar (iOS only).
   */
  const onDismiss = useCallback(() => {
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  }, []);

  return { visible, setVisible, open, close, handOff, onDismiss };
}
