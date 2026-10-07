import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  containerTotals: {
    padding: 15,
    backgroundColor: theme.colors.white,
  },
  contentItemTotals: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  subtotalsText: {
    color: theme.colors.text_gray,
  },
  totalsText: {
    fontSize: 18,
  },
});
