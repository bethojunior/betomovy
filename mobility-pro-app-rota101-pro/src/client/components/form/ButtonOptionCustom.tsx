import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import theme from '../../styles/theme';
import { SubTitle, Title } from './styles';

export default function ButtonOptionCustom(props) {
  const { icon, title, subtitle, onPress, isSpeedMob, colorsText } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      <View style={styles.content}>
        <Title color={colorsText}>{title}</Title>
        {subtitle ? <SubTitle color={colorsText}>{subtitle}</SubTitle> : null}
      </View>
      {!isSpeedMob && (
        <Icon
          name="chevron-right"
          size={15}
          style={{
            position: 'absolute',
            right: 15,
            color: theme.colors.secondary,
          }}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 15,
  },
});
