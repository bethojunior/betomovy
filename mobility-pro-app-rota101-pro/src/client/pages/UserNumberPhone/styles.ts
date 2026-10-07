import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
  },
  textError: {
    color: 'red',
    fontSize: 11,
  },
  label: {
    color: theme.colors.text_gray,
  },
});
