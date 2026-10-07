import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 115,
    margin: 10,
    borderRadius: 2,
  },
  description: {
    margin: 10,
    flex: 1,
  },
  content: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: theme.colors.black,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
});
