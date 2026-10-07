import {TouchableOpacityProps} from 'react-native';
import theme from '../../styles/theme';
import {Container, Loading, Text} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
  enabled?: boolean;
  inverted?: boolean;
  colorText?: string;
  color?: string;
}

export function Button({
  title,
  onPress,
  enabled = true,
  loading = false,
  colorText,
  color,
  ...rest
}: Props) {
  return (
    <Container
      enabled={enabled}
      onPress={enabled ? onPress : () => {}}
      activeOpacity={0.8}
      color={color}
      {...rest}
    >
      <Text
        style={{
          color: colorText ? colorText : theme.colors.primaryText,
        }}
        enabled={enabled}
      >
        {title}
      </Text>
      {loading ? (
        <Loading size={'small'} color={color ? color : theme.colors.primary} />
      ) : null}
    </Container>
  );
}
