import {TouchableOpacityProps} from 'react-native';
import theme from '../../styles/theme';
import {Container, Loading, Text} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
  enabled?: boolean;
  inverted?: boolean;
  small?: boolean;
  backgroundColor?: string;
  color?: string;
}

export function Button({
  title,
  onPress,
  enabled = true,
  loading = false,
  small = false,
  ...rest
}: Props) {
  return (
    <Container
      enabled={enabled}
      onPress={enabled ? onPress : () => {}}
      activeOpacity={0.8}
      small={small}
      {...rest}
    >
      <Text small={small} enabled={enabled}>
        {title}
      </Text>
      {loading ? <Loading size={'small'} color={theme.colors.white} /> : null}
    </Container>
  );
}
