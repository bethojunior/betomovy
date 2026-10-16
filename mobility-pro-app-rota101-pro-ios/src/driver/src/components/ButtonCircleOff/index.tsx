import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Content, Loading, styles } from './styles';

interface Props extends TouchableOpacityProps {
  loading?: boolean;
  onPress: () => void;
  enabled?: boolean;
  inverted?: boolean;
  iconName: any;
}

export function ButtonCircleOff({
  onPress,
  enabled = true,
  loading = false,
  iconName,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Container
      disabled={loading}
      enabled={enabled}
      style={styles.shadow}
      onPress={enabled ? onPress : () => {}}
      activeOpacity={0.6}
      {...rest}
    >
      <Content>
        {loading ? (
          <Loading size={'small'} color={theme.colors.white} />
        ) : (
          <MaterialCommunityIcons name={iconName} size={42} color={theme.colors.white} />
        )}
      </Content>
    </Container>
  );
}
