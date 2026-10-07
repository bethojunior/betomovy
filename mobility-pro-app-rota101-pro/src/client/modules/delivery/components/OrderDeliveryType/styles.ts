import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
  },
  button: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  buttonActive: {
    borderBottomColor: theme.colors.black,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.text_gray,
  },
  buttonTextActive: {
    color: theme.colors.black,
  },
});
