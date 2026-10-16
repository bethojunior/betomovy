import { useState, useMemo, useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming, Easing, runOnJS } from 'react-native-reanimated';

export const LOCK_THRESHOLD_X = 80;

type Params = {
  disabled?: boolean;
  onRecordingStart: () => void;
  onRecordingEnd: () => void;
  onRecordingCancel: () => void;
};

const SPRING_SNAP = { damping: 20, stiffness: 400 } as const;
const SPRING_GROW = { damping: 18, stiffness: 280 } as const;
const SPRING_PRESS = { damping: 25, stiffness: 500 } as const;
const LOCK_EASING = Easing.bezier(0.4, 0, 0.2, 1);

export function useAudioDragLock({
  disabled = false,
  onRecordingStart,
  onRecordingEnd,
  onRecordingCancel,
}: Params) {
  const [isAudioLocked, setIsAudioLocked] = useState(false);

  const isActive = useSharedValue(false);
  const isLocked = useSharedValue(false);
  const dragProgress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const arrowOpacity = useSharedValue(0);
  const anchorX = useSharedValue(0);
  const lockProgress = useSharedValue(0);

  const onStartRef = useRef(onRecordingStart);
  const onEndRef = useRef(onRecordingEnd);
  const onCancelRef = useRef(onRecordingCancel);
  onStartRef.current = onRecordingStart;
  onEndRef.current = onRecordingEnd;
  onCancelRef.current = onRecordingCancel;

  const stableStart = useCallback(() => onStartRef.current(), []);
  const stableEnd = useCallback(() => onEndRef.current(), []);
  const stableCancel = useCallback(() => onCancelRef.current(), []);
  const stableHandleLock = useCallback(() => {
    lockProgress.value = withTiming(1, { duration: 220, easing: LOCK_EASING });
    setIsAudioLocked(true);
  }, []);

  const recordingGesture = useMemo(() => Gesture.Pan()
    .minDistance(0)
    .activateAfterLongPress(500)
    .enabled(!disabled)
    .onBegin(() => {
      buttonScale.value = withSpring(1.08, SPRING_PRESS);
    })
    .onStart((event) => {
      anchorX.value = event.absoluteX;
      isActive.value = true;
      isLocked.value = false;
      dragProgress.value = 0;
      buttonScale.value = withSpring(1.2, SPRING_GROW);
      arrowOpacity.value = withTiming(1, { duration: 200 });
      runOnJS(stableStart)();
    })
    .onUpdate((event) => {
      if (!isActive.value || isLocked.value) return;

      const deltaX = anchorX.value - event.absoluteX;

      if (deltaX <= 0) {
        dragProgress.value = 0;
        return;
      }

      if (deltaX >= LOCK_THRESHOLD_X) {
        isLocked.value = true;
        dragProgress.value = withSpring(0, SPRING_SNAP);
        arrowOpacity.value = withTiming(0, { duration: 120 });
        runOnJS(stableHandleLock)();
        return;
      }

      dragProgress.value = deltaX / LOCK_THRESHOLD_X;
    })
    .onEnd(() => {
      if (!isActive.value) return;

      const wasLocked = isLocked.value;
      isActive.value = false;
      dragProgress.value = withSpring(0, SPRING_SNAP);
      arrowOpacity.value = withTiming(0, { duration: 150 });

      if (!wasLocked) {
        buttonScale.value = withSpring(1, SPRING_SNAP);
        runOnJS(stableEnd)();
      }
    })
    .onFinalize((_, success) => {
      if (!success) {
        buttonScale.value = withSpring(1, SPRING_SNAP);
        if (isActive.value && !isLocked.value) {
          isActive.value = false;
          dragProgress.value = withSpring(0, SPRING_SNAP);
          arrowOpacity.value = withTiming(0, { duration: 150 });
          runOnJS(stableCancel)();
        }
      }
    })
  , [disabled, stableStart, stableEnd, stableCancel, stableHandleLock]);

  const resetDrag = () => {
    isLocked.value = false;
    isActive.value = false;
    dragProgress.value = withSpring(0, SPRING_SNAP);
    buttonScale.value = withSpring(1, SPRING_SNAP);
    arrowOpacity.value = withSpring(0);
    lockProgress.value = withTiming(0, { duration: 220, easing: LOCK_EASING });
    setIsAudioLocked(false);
  };

  return {
    isAudioLocked,
    dragProgress,
    buttonScale,
    arrowOpacity,
    lockProgress,
    recordingGesture,
    resetDrag,
  };
}
