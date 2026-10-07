import { useRef, useState, useCallback } from 'react';
import { setStateAsync, ON, OFF } from 'expo-torch';
import { isDevice } from 'expo-device';

const MAX_BLINK_COUNT = 30;

export const useFlashlight = () => {
  const [enableTorch, setEnableTorch] = useState(false);

  const blinkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchCount = useRef(0);
  const isOn = useRef(false);

  const switchTorch = useCallback(async (state: boolean) => {
    if (!isDevice) {
      console.log('[useFlashlight] Simulador não suporta flash.');
      return;
    }

    try {
      await setStateAsync(state ? ON : OFF);
      setEnableTorch(state);
    } catch (error) {
      console.log('[useFlashlight] Erro ao controlar torch:', error);
    }
  }, []);

  const stop = useCallback(() => {
    if (blinkTimeout.current) clearTimeout(blinkTimeout.current);
    touchCount.current = 0;
    isOn.current = false;
    switchTorch(false);
  }, [switchTorch]);

  const blink = useCallback(
    (duration: number, interval: number) => {
      if (touchCount.current >= MAX_BLINK_COUNT) {
        stop();
        return;
      }

      touchCount.current += 1;
      isOn.current = !isOn.current;

      switchTorch(isOn.current);

      blinkTimeout.current = setTimeout(
        () => blink(duration, interval),
        isOn.current ? duration : interval,
      );
    },
    [switchTorch, stop],
  );

  return { enableTorch, blink, stop };
};
