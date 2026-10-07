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
  textBold: {
    fontWeight: 'bold',
  },
  textObs: {
    color: theme.colors.yellowStrong,
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    // borderWidth: 0,
    borderWidth: 1,
    color: theme.colors.black,
  },
  underlineStyleHighLighted: {
    borderColor: theme.colors.black,
  },
  textError: {
    color: 'red',
    fontSize: 11,
    marginTop: -10,
    marginBottom: 20,
  },
});
