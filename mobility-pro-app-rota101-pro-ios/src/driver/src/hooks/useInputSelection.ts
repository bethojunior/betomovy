import { useCallback, useRef } from 'react';
import { TextInput } from 'react-native';

/**
 * Garante que um TextInput com valor longo (endereço selecionado)
 * mostre o texto desde o início — não o final.
 *
 * Usa setNativeProps para forçar o cursor sem depender do ciclo de render.
 *
 * Uso:
 *   const sel = useInputSelection();
 *   <TextInput ref={sel.ref} onBlur={sel.onBlur} value={...} />
 *   // ao selecionar endereço: sel.reset()
 */
export const useInputSelection = () => {
  const ref = useRef<TextInput>(null);

  const reset = useCallback(() => {
    setTimeout(() => {
      ref.current?.setNativeProps({ selection: { start: 0, end: 0 } });
    }, 50);
  }, []);

  const onBlur = useCallback(() => {
    ref.current?.setNativeProps({ selection: { start: 0, end: 0 } });
  }, []);

  return { ref, reset, onBlur };
};
