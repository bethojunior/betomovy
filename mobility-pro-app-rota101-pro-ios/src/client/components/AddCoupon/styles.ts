import {StyleSheet} from 'react-native';
import Colors from '../Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 10,
  },
  button: {
    padding: 10,
    paddingVertical: 15,
    backgroundColor: Colors.PRIMARY,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: '25%',
  },
  textButton: {
    color: theme.colors.primaryText,
  },
});
