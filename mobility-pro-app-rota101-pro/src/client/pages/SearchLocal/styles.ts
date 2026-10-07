import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listPlace: {
    flex: 1,
    backgroundColor: theme.colors.background_white_light,
  },
  itemPlace: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  simpleName: {
    fontSize: 18,
  },
  fullAddress: {
    fontSize: 14,
    color: theme.colors.text_gray,
  },
});
