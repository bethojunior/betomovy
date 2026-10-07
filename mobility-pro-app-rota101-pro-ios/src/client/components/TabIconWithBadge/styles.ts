import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    margin: 5,
  },
  containerBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: theme.colors.red,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBadge: {color: theme.colors.white, fontSize: 7, fontWeight: 'bold'},
});
