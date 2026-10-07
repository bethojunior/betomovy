import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  containerEstablishment: {
    marginTop: 10,
    padding: 20,
    paddingHorizontal: 20,
    backgroundColor: shade(0.03, theme.colors.background_global),
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  nameEstablishment: {
    fontSize: 18,
    fontWeight: '600',
  },
});
