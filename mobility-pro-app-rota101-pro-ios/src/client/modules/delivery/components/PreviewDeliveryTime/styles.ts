import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: 25,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    marginVertical: 15,
    paddingVertical: 5,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text_gray,
  },
  time: {
    fontSize: 18,
    marginBottom: 10,
  },
});
