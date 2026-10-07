import {StyleSheet} from 'react-native';
import Colors from '../../../../components/Colors';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background_black_light,
  },
  content: {
    padding: 20,
    paddingVertical: 40,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: theme.colors.text_gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  btn: {
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  btnText: {
    color: theme.colors.primaryText,
  },
});
