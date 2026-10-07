import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  textItem: {
    color: theme.colors.text_gray,
    fontSize: 16,
  },
});
