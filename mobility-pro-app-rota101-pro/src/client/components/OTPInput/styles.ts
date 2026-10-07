import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 1,
    textAlign: 'center',
  },
});
