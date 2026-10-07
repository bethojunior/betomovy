import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  containerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingVertical: 20,
    backgroundColor: shade(0.05, theme.colors.background_global),
  },
  contentIcon: {
    padding: 10,
  },
  titleNav: {
    fontSize: 18,
    paddingVertical: 10,
  },
});
