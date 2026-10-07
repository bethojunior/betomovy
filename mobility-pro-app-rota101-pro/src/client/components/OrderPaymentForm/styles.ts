import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  containerPaymentForm: {
    marginTop: 10,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
  },
  titlePaymentForm: {
    fontSize: 18,
    paddingVertical: 20,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  btnSelectPaymentForm: {
    display: 'flex',
    paddingVertical: 20,
  },
  titlePaymentFormText: {
    fontSize: 15,
  },
  titleSwitchPaymentForm: {
    fontSize: 15,
    color: Colors.PRIMARY,
  },
  textChange: {
    fontSize: 12,
    color: theme.colors.icon_gray,
  },
  contentInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCard: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.colors.icon_gray,
  },
});
