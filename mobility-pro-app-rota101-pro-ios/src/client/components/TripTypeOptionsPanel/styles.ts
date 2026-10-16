import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  infoButton: {
    position: 'absolute',
    right: 0,
  },
  infoIcon: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.white,
    borderRadius: 100,
    textAlign: 'center',
  },
});

export default styles;
