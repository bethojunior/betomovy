import {ReactNode} from 'react';
import {TouchableOpacityProps} from 'react-native';
import theme from '../../styles/theme';
import {Container, IconWrapper, Loading, Text} from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
  enabled?: boolean;
  inverted?: boolean;
  small?: boolean;
  backgroundColor?: string;
  color?: string;
  icon?: ReactNode;
}

export function Button({
  title,
  onPress,
  enabled = true,
  loading = false,
  small = false,
  icon,
  color,
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
      {icon && !loading ? <IconWrapper>{icon}</IconWrapper> : null}
      <Text small={small} enabled={enabled} color={color}>
        {title}
      </Text>
      {loading ? <Loading size={'small'} color={color ?? theme.colors.white} /> : null}
    </Container>
  );
}
