import { ActivityIndicator } from 'react-native';
import { ConfirmBtn, ConfirmBtnText } from './styles';

interface ConfirmButtonProps {
  label: string;
  selected: boolean;
  loading?: boolean;
  onPress: () => void;
}

export function ConfirmButton({ label, selected, loading, onPress }: ConfirmButtonProps) {
  return (
    <ConfirmBtn
      activeOpacity={0.85}
      disabled={!selected || loading}
      onPress={onPress}
      selected={selected}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <ConfirmBtnText>{label}</ConfirmBtnText>
      )}
    </ConfirmBtn>
  );
}
