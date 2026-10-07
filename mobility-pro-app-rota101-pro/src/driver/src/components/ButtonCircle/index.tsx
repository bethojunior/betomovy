import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {TouchableOpacityProps} from 'react-native';
import {useTheme} from 'styled-components/native';
import {Container, Loading, Text} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress?: () => void;
  enabled?: boolean;
  inverted?: boolean;
}

export function ButtonCircle({
  title,
  onPress,
  enabled = true,
  loading = false,
  ...rest
}: Props) {
  const theme = useTheme();
  return (
    <Container
      enabled={enabled}
      onPress={enabled ? onPress : () => {}}
      activeOpacity={0.8}
      {...rest}
    >
      {!loading ? <Text enabled={enabled}>{title}</Text> : null}
      {loading ? <Loading size={'small'} color={theme.colors.white} /> : null}
    </Container>
  );
}
