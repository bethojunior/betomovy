import {Switch as SwitchPaper} from 'react-native-gesture-handler';
import theme from '../../styles/theme';

interface SwitchProps {
  value: boolean;
  enabled?: boolean;
  trackColorOn?: string;
  onValueChange: (value: boolean) => void | Promise<void>;
}

export function Switch({value, onValueChange, enabled, trackColorOn}: SwitchProps) {
  return (
    <SwitchPaper
      trackColor={{true: trackColorOn || theme.colors.primary, false: theme.colors.secondary}}
      value={value}
      enabled={enabled}
      onValueChange={onValueChange}
      style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
    />
  );
}
