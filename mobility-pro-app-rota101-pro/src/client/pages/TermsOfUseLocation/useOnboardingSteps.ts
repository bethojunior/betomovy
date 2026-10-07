import { useMemo, useRef, useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export type OnboardingStep =
  | 'localization'
  | 'contacts'
  | 'terms'
  | 'camera'
  | 'microphone';

export function useOnboardingSteps() {
  const [stepIndex, setStepIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const steps = useMemo<OnboardingStep[]>(() => {
    const visibleSteps: OnboardingStep[] = [];
    visibleSteps.push('localization', 'contacts', 'camera', 'microphone', 'terms');
    return visibleSteps;
  }, []);

  const goToNextStep = () => {
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
  };

  return {
    stepWidth: width,
    steps,
    stepIndex,
    currentStep: steps[stepIndex],
    scrollRef,
    goToNextStep,
  };
}
