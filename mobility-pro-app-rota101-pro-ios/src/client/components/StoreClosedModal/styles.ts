import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_black_light,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.icon_gray,
    marginBottom: 5,
  },
  message: {
    textAlign: 'center',
    margin: 10,
  },
  button: {
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
  },
  textButton: {
    color: theme.colors.primaryText,
  },
});
