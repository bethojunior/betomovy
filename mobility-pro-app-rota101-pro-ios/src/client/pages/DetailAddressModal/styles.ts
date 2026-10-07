import {StyleSheet} from 'react-native';
import Colors from '../../components/Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.background_black_light,
  },
  modal: {
    padding: 15,
    backgroundColor: theme.colors.white,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
  },
  simpleAddres: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.text_gray,
  },
  fullAddress: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.icon_gray,
  },
  contentAddress: {
    marginVertical: 10,
  },
  inputCustom: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderBottomColor: theme.colors.border,
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    display: 'flex',
    color: theme.colors.text_gray,
  },
  btnNext: {
    padding: 10,
    width: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnNextText: {
    color: theme.colors.white,
    fontSize: 16,
  },
});
