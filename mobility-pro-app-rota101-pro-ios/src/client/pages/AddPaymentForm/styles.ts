import {StyleSheet} from 'react-native';
import Colors from '../../components/Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  contentInput: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  textInput: {
    fontWeight: 'bold',
    color: theme.colors.text_gray,
  },
  input: {
    borderBottomColor: theme.colors.text_gray,
    borderBottomWidth: 1,
  },
  contentInpus: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
});
