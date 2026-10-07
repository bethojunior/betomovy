import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  input: {
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: theme.colors.white_light,
  },
  button: {
    backgroundColor: theme.colors.black,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.white,
  },
});
