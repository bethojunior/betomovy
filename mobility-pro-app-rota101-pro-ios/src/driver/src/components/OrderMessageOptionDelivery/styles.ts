import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  images: {
    margin: 14,
  },
  names: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text_gray,
  },
});
