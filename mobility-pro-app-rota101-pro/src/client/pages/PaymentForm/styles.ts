import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  description: {
    marginVertical: 20,
    textAlign: 'center',
    color: theme.colors.text_gray,
  },
  contentPaymentForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  titlePaymentForm: {
    fontSize: 16,
  },
});
