import {StyleSheet} from 'react-native';
import Colors from '../../../../components/Colors';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  footer: {
    padding: 15,
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  btnFinish: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFinishText: {
    color: theme.colors.primaryText,
    fontSize: 18,
  },
  textOutArea: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  containerGuest: {
    backgroundColor: theme.colors.white,
    padding: 15,
    marginTop: 10,
  },
  labelGuest: {
    color: theme.colors.text_gray,
    fontSize: 16,
  },
  buttonGuest: {
    borderWidth: 1,
    borderColor: theme.colors.icon_gray,
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonTextGuest: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.text_gray,
  },
});
