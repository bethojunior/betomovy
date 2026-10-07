import {TouchableOpacityProps} from 'react-native';
import {useTheme} from 'styled-components';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Container, Content, Loading, styles} from './styles';

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
      enabled={enabled}
      style={styles.shadow}
      onPress={enabled ? onPress : () => {}}
      activeOpacity={0.9}
      {...rest}
    >
      <Content>
        <MaterialCommunityIcons
          name={iconName}
          size={42}
          color={theme.colors.white}
        />
        {loading ? (
          <Loading size={'small'} color={theme.colors.primary} />
        ) : null}
      </Content>
    </Container>
  );
}
