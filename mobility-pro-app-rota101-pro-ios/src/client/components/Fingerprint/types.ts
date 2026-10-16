export interface FingerprintProps {
  setEnabled?: (enabled: boolean) => void;
  setEnabledBiometry?: (enabled: boolean) => void;
  onPress?: () => void;
}

export type FingerprintStatus = 'waiting' | 'failed';
