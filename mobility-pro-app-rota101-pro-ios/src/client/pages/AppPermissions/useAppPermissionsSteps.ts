import { useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export type AppPermissionStep = 'background';

export function useAppPermissionsSteps() {
  const [stepIndex, setStepIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const steps = useMemo<AppPermissionStep[]>(() => ['background'], []);

  const goToNextStep = () => {
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
  };

  return {
    stepWidth: width,
    steps,
    stepIndex,
    isLastStep: stepIndex === steps.length - 1,
    scrollRef,
    goToNextStep,
  };
}
